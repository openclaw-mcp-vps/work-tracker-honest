"use client";

import { create } from "zustand";

import type { ActivityCategory, ActivitySample, WorkIntent } from "@/lib/types";

const STORAGE_KEY = "work-tracker-honest:samples";
const SETTINGS_KEY = "work-tracker-honest:settings";
const MAX_SAMPLES = 60 * 24 * 60;

const defaultIntent: WorkIntent = "deep-work";

interface ActivitySettings {
  anonymousId: string;
  cloudSyncEnabled: boolean;
}

interface ActivityStore {
  anonymousId: string;
  cloudSyncEnabled: boolean;
  intent: WorkIntent;
  tracking: boolean;
  hydrated: boolean;
  lastSyncedAt: string | null;
  samples: ActivitySample[];
  hydrate: () => void;
  setIntent: (intent: WorkIntent) => void;
  setTracking: (tracking: boolean) => void;
  setCloudSyncEnabled: (enabled: boolean) => void;
  addSample: (sample: ActivitySample) => void;
  replaceSamples: (samples: ActivitySample[]) => void;
  clearSamples: () => void;
  markSynced: () => void;
}

function makeAnonymousId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadSettings(): ActivitySettings {
  if (typeof window === "undefined") {
    return {
      anonymousId: "",
      cloudSyncEnabled: false
    };
  }

  const raw = window.localStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    const fallback = {
      anonymousId: makeAnonymousId(),
      cloudSyncEnabled: false
    };
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(fallback));
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ActivitySettings>;
    const nextValue: ActivitySettings = {
      anonymousId: parsed.anonymousId || makeAnonymousId(),
      cloudSyncEnabled: parsed.cloudSyncEnabled ?? false
    };
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextValue));
    return nextValue;
  } catch {
    const fallback = {
      anonymousId: makeAnonymousId(),
      cloudSyncEnabled: false
    };
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

function saveSettings(anonymousId: string, cloudSyncEnabled: boolean) {
  if (typeof window === "undefined") return;
  const nextValue: ActivitySettings = { anonymousId, cloudSyncEnabled };
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextValue));
}

function loadSamples() {
  if (typeof window === "undefined") return [] as ActivitySample[];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as ActivitySample[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistSamples(samples: ActivitySample[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
}

export function mergeSamples(current: ActivitySample[], incoming: ActivitySample[]) {
  const map = new Map<string, ActivitySample>();

  for (const sample of current) {
    map.set(sample.id, sample);
  }

  for (const sample of incoming) {
    map.set(sample.id, sample);
  }

  return Array.from(map.values())
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .slice(-MAX_SAMPLES);
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  anonymousId: "",
  cloudSyncEnabled: false,
  intent: defaultIntent,
  tracking: false,
  hydrated: false,
  lastSyncedAt: null,
  samples: [],
  hydrate: () => {
    if (get().hydrated) return;

    const settings = loadSettings();
    const samples = loadSamples();

    set({
      anonymousId: settings.anonymousId,
      cloudSyncEnabled: settings.cloudSyncEnabled,
      samples,
      hydrated: true
    });
  },
  setIntent: (intent) => set({ intent }),
  setTracking: (tracking) => set({ tracking }),
  setCloudSyncEnabled: (cloudSyncEnabled) => {
    const anonymousId = get().anonymousId || makeAnonymousId();
    saveSettings(anonymousId, cloudSyncEnabled);
    set({ anonymousId, cloudSyncEnabled });
  },
  addSample: (sample) => {
    const merged = mergeSamples(get().samples, [sample]);
    persistSamples(merged);
    set({ samples: merged });
  },
  replaceSamples: (samples) => {
    const merged = mergeSamples([], samples);
    persistSamples(merged);
    set({ samples: merged });
  },
  clearSamples: () => {
    persistSamples([]);
    set({ samples: [] });
  },
  markSynced: () => set({ lastSyncedAt: new Date().toISOString() })
}));

function classifyActivity(focused: boolean, idleSeconds: number): ActivityCategory {
  if (!focused || idleSeconds >= 300) {
    return "away";
  }

  if (idleSeconds >= 90) {
    return "distraction";
  }

  return "focus";
}

export function startActivityDetection(options: {
  getIntent: () => WorkIntent;
  onSample: (sample: ActivitySample) => void;
}) {
  let lastInteractionAt = Date.now();

  const markInteraction = () => {
    lastInteractionAt = Date.now();
  };

  const eventNames: Array<keyof WindowEventMap> = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
    "pointerdown"
  ];

  for (const eventName of eventNames) {
    window.addEventListener(eventName, markInteraction, { passive: true });
  }

  const tick = () => {
    const now = Date.now();
    const idleSeconds = Math.max(0, Math.floor((now - lastInteractionAt) / 1000));
    const focused = document.hasFocus() && !document.hidden;

    options.onSample({
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${now}-${Math.random()}`,
      timestamp: new Date(now).toISOString(),
      category: classifyActivity(focused, idleSeconds),
      intent: options.getIntent(),
      idleSeconds,
      focused,
      source: "auto"
    });
  };

  tick();
  const intervalId = window.setInterval(tick, 60_000);

  return () => {
    window.clearInterval(intervalId);
    for (const eventName of eventNames) {
      window.removeEventListener(eventName, markInteraction);
    }
  };
}
