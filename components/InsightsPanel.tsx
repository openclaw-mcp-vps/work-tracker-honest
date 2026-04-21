"use client";

import { useMemo } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeInsights } from "@/lib/analytics";
import { useActivityStore } from "@/lib/activity-detector";

export function InsightsPanel() {
  const samples = useActivityStore((state) => state.samples);

  const summary = useMemo(() => summarizeInsights(samples), [samples]);

  if (samples.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <CardDescription>
            Insights appear once you collect activity data. Keep tracking for at least one full workday.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Honest Insight Summary</CardTitle>
        <CardDescription>
          Based on {summary.totalMinutesTracked} tracked minutes. The goal is useful clarity, not judgment.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Focus Ratio</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">{summary.focusRatio.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Distraction Ratio</p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">{summary.distractionRatio.toFixed(1)}%</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Best Focus Streak</p>
          <p className="mt-2 text-3xl font-semibold text-cyan-300">{summary.bestFocusStreakMinutes} min</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Peak Focus Hour</p>
          <p className="mt-2 text-3xl font-semibold text-slate-100">{summary.peakFocusHour}</p>
        </div>
        <div className="sm:col-span-2 lg:col-span-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-cyan-200">Recommendation</p>
          <p className="mt-2 text-sm leading-relaxed text-cyan-50">{summary.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
