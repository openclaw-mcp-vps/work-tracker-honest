import { eachDayOfInterval, format, parseISO, startOfDay, subDays } from "date-fns";

import type { ActivitySample, DailyProductivityPoint, HourlyFocusPoint, InsightSummary } from "@/lib/types";

function categoryCounts(samples: ActivitySample[]) {
  let focusMinutes = 0;
  let distractionMinutes = 0;
  let awayMinutes = 0;

  for (const sample of samples) {
    if (sample.category === "focus") focusMinutes += 1;
    if (sample.category === "distraction") distractionMinutes += 1;
    if (sample.category === "away") awayMinutes += 1;
  }

  return { focusMinutes, distractionMinutes, awayMinutes };
}

export function buildDailyProductivity(samples: ActivitySample[], days = 14): DailyProductivityPoint[] {
  const now = new Date();
  const start = startOfDay(subDays(now, days - 1));
  const dateRange = eachDayOfInterval({ start, end: startOfDay(now) });

  return dateRange.map((day) => {
    const dayKey = format(day, "yyyy-MM-dd");
    const daySamples = samples.filter((sample) => sample.timestamp.startsWith(dayKey));
    const counts = categoryCounts(daySamples);
    const denominator = counts.focusMinutes + counts.distractionMinutes + counts.awayMinutes || 1;
    const score = Math.round((counts.focusMinutes / denominator) * 100);

    return {
      date: format(day, "MMM d"),
      focusMinutes: counts.focusMinutes,
      distractionMinutes: counts.distractionMinutes,
      awayMinutes: counts.awayMinutes,
      productivityScore: score
    };
  });
}

export function buildHourlyFocus(samples: ActivitySample[]): HourlyFocusPoint[] {
  const buckets = new Map<number, HourlyFocusPoint>();

  for (let hour = 0; hour < 24; hour += 1) {
    buckets.set(hour, {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      focusMinutes: 0,
      distractionMinutes: 0,
      awayMinutes: 0
    });
  }

  for (const sample of samples) {
    const sampleDate = parseISO(sample.timestamp);
    const hour = sampleDate.getHours();
    const bucket = buckets.get(hour);
    if (!bucket) continue;

    if (sample.category === "focus") bucket.focusMinutes += 1;
    if (sample.category === "distraction") bucket.distractionMinutes += 1;
    if (sample.category === "away") bucket.awayMinutes += 1;
  }

  return Array.from(buckets.values());
}

function getBestFocusStreak(samples: ActivitySample[]) {
  const ordered = [...samples].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  let currentStreak = 0;
  let bestStreak = 0;

  for (const sample of ordered) {
    if (sample.category === "focus") {
      currentStreak += 1;
      if (currentStreak > bestStreak) bestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }

  return bestStreak;
}

export function summarizeInsights(samples: ActivitySample[]): InsightSummary {
  const counts = categoryCounts(samples);
  const totalMinutesTracked = counts.focusMinutes + counts.distractionMinutes + counts.awayMinutes;
  const denominator = totalMinutesTracked || 1;

  const hourly = buildHourlyFocus(samples);
  const bestHour = hourly
    .map((hour) => {
      const total = hour.focusMinutes + hour.distractionMinutes + hour.awayMinutes;
      return {
        hour: hour.hour,
        ratio: total ? hour.focusMinutes / total : 0
      };
    })
    .sort((a, b) => b.ratio - a.ratio)[0];

  const focusRatio = (counts.focusMinutes / denominator) * 100;
  const distractionRatio = (counts.distractionMinutes / denominator) * 100;
  const awayRatio = (counts.awayMinutes / denominator) * 100;

  let recommendation = "Your focus rate is stable. Keep protecting your top concentration hours.";

  if (distractionRatio >= 28) {
    recommendation =
      "Distraction time is high. Try 45-minute focus blocks with a short reset between blocks to reduce context switching.";
  } else if (awayRatio >= 35) {
    recommendation =
      "Away time is large. Consider tighter meeting windows and a dedicated deep-work block before noon.";
  } else if (focusRatio >= 60) {
    recommendation =
      "Strong focus trend. Double down by scheduling your hardest tasks during your peak hour and grouping admin work later.";
  }

  return {
    totalMinutesTracked,
    focusRatio,
    distractionRatio,
    awayRatio,
    bestFocusStreakMinutes: getBestFocusStreak(samples),
    peakFocusHour: bestHour?.hour ?? "N/A",
    recommendation
  };
}
