export type ActivityCategory = "focus" | "distraction" | "away";

export type WorkIntent = "deep-work" | "collaboration" | "admin" | "break";

export interface ActivitySample {
  id: string;
  timestamp: string;
  category: ActivityCategory;
  intent: WorkIntent;
  idleSeconds: number;
  focused: boolean;
  source: "auto" | "manual";
}

export interface DailyProductivityPoint {
  date: string;
  focusMinutes: number;
  distractionMinutes: number;
  awayMinutes: number;
  productivityScore: number;
}

export interface HourlyFocusPoint {
  hour: string;
  focusMinutes: number;
  distractionMinutes: number;
  awayMinutes: number;
}

export interface InsightSummary {
  totalMinutesTracked: number;
  focusRatio: number;
  distractionRatio: number;
  awayRatio: number;
  bestFocusStreakMinutes: number;
  peakFocusHour: string;
  recommendation: string;
}
