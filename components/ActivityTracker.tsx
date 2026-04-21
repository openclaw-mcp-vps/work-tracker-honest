"use client";

import { useCallback, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { CloudUpload, Pause, Play, ShieldCheck, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mergeSamples, startActivityDetection, useActivityStore } from "@/lib/activity-detector";
import type { WorkIntent } from "@/lib/types";
import { cn } from "@/lib/utils";

const intentOptions: Array<{ value: WorkIntent; label: string; description: string }> = [
  { value: "deep-work", label: "Deep Work", description: "Coding, writing, design, analysis" },
  { value: "collaboration", label: "Collaboration", description: "Calls, pair sessions, async review" },
  { value: "admin", label: "Admin", description: "Email, planning, ticket cleanup" },
  { value: "break", label: "Break", description: "Intentional reset or recovery" }
];

export function ActivityTracker() {
  const {
    hydrated,
    anonymousId,
    cloudSyncEnabled,
    tracking,
    intent,
    samples,
    lastSyncedAt,
    hydrate,
    setIntent,
    setTracking,
    setCloudSyncEnabled,
    addSample,
    replaceSamples,
    clearSamples,
    markSynced
  } = useActivityStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated || !tracking) return;

    const stop = startActivityDetection({
      getIntent: () => useActivityStore.getState().intent,
      onSample: (sample) => addSample(sample)
    });

    return stop;
  }, [hydrated, tracking, addSample]);

  const syncToCloud = useCallback(async () => {
    if (!cloudSyncEnabled || !anonymousId || samples.length === 0) {
      return;
    }

    const response = await fetch("/api/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "push",
        anonymousId,
        samples
      })
    });

    if (response.ok) {
      markSynced();
    }
  }, [anonymousId, cloudSyncEnabled, markSynced, samples]);

  const pullFromCloud = useCallback(async () => {
    if (!cloudSyncEnabled || !anonymousId) {
      return;
    }

    const response = await fetch("/api/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "pull",
        anonymousId
      })
    });

    if (!response.ok) return;
    const payload = (await response.json()) as { samples?: typeof samples };
    if (!payload.samples || payload.samples.length === 0) return;

    replaceSamples(mergeSamples(samples, payload.samples));
    markSynced();
  }, [anonymousId, cloudSyncEnabled, markSynced, replaceSamples, samples]);

  useEffect(() => {
    if (!hydrated || !cloudSyncEnabled) return;

    void pullFromCloud();
  }, [cloudSyncEnabled, hydrated, pullFromCloud]);

  useEffect(() => {
    if (!hydrated || !cloudSyncEnabled) return;

    const interval = window.setInterval(() => {
      void syncToCloud();
    }, 120_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [cloudSyncEnabled, hydrated, syncToCloud]);

  const todaySummary = useMemo(() => {
    const todayKey = format(new Date(), "yyyy-MM-dd");
    const todaySamples = samples.filter((sample) => sample.timestamp.startsWith(todayKey));

    const focus = todaySamples.filter((sample) => sample.category === "focus").length;
    const distraction = todaySamples.filter((sample) => sample.category === "distraction").length;
    const away = todaySamples.filter((sample) => sample.category === "away").length;

    return {
      focus,
      distraction,
      away,
      total: focus + distraction + away
    };
  }, [samples]);

  if (!hydrated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading tracker...</CardTitle>
          <CardDescription>Preparing your private local workspace.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl">Activity Tracker</CardTitle>
            <CardDescription>
              Tracks focus patterns with anonymous signals only. No screenshots, no keystroke capture.
            </CardDescription>
          </div>
          <Badge variant={tracking ? "default" : "neutral"}>{tracking ? "Tracking Active" : "Tracking Paused"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setTracking(!tracking)}>
            {tracking ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {tracking ? "Pause Tracking" : "Start Tracking"}
          </Button>
          <Button variant="secondary" onClick={() => void syncToCloud()} disabled={!cloudSyncEnabled}>
            <CloudUpload className="mr-2 h-4 w-4" />
            Sync Now
          </Button>
          <Button variant="outline" onClick={() => clearSamples()}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Local Data
          </Button>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-200">
              Anonymous workspace ID: <span className="mono text-cyan-300">{anonymousId || "Not initialized"}</span>
            </p>
            <button
              type="button"
              className={cn(
                "inline-flex items-center rounded-md border px-3 py-1 text-sm transition",
                cloudSyncEnabled
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                  : "border-slate-700 bg-slate-900 text-slate-300"
              )}
              onClick={() => setCloudSyncEnabled(!cloudSyncEnabled)}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              {cloudSyncEnabled ? "Cloud Sync On" : "Cloud Sync Off"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Cloud sync is optional. It stores anonymous activity samples keyed to your workspace ID.
          </p>
          {lastSyncedAt ? (
            <p className="mt-2 text-xs text-cyan-300">Last synced at {format(new Date(lastSyncedAt), "MMM d, HH:mm")}</p>
          ) : null}
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-slate-200">Current work mode</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {intentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setIntent(option.value)}
                className={cn(
                  "rounded-lg border p-3 text-left transition",
                  intent === option.value
                    ? "border-cyan-400/60 bg-cyan-500/10"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                )}
              >
                <p className="font-medium text-slate-100">{option.label}</p>
                <p className="mt-1 text-xs text-slate-400">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Focus</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">{todaySummary.focus} min</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Distraction</p>
            <p className="mt-2 text-2xl font-semibold text-amber-300">{todaySummary.distraction} min</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Away</p>
            <p className="mt-2 text-2xl font-semibold text-slate-300">{todaySummary.away} min</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
