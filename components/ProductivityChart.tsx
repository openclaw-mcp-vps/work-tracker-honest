"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivityStore } from "@/lib/activity-detector";
import { buildDailyProductivity, buildHourlyFocus } from "@/lib/analytics";

export function ProductivityChart() {
  const samples = useActivityStore((state) => state.samples);

  const daily = useMemo(() => buildDailyProductivity(samples, 14), [samples]);
  const hourly = useMemo(() => buildHourlyFocus(samples), [samples]);

  if (samples.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productivity Trends</CardTitle>
          <CardDescription>
            Start tracking to generate your first honest baseline. Insights become meaningful after 2-3 workdays.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>14-Day Pattern</CardTitle>
          <CardDescription>Focus, distraction, and away minutes by day.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #334155",
                    borderRadius: "0.5rem"
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="focusMinutes" stroke="#22c55e" fill="#22c55e33" name="Focus" />
                <Area
                  type="monotone"
                  dataKey="distractionMinutes"
                  stroke="#f59e0b"
                  fill="#f59e0b2a"
                  name="Distraction"
                />
                <Area type="monotone" dataKey="awayMinutes" stroke="#94a3b8" fill="#94a3b822" name="Away" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Focus Distribution</CardTitle>
          <CardDescription>Find your best concentration windows across a typical day.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="hour" interval={3} stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #334155",
                    borderRadius: "0.5rem"
                  }}
                />
                <Legend />
                <Bar dataKey="focusMinutes" fill="#06b6d4" name="Focus" />
                <Bar dataKey="distractionMinutes" fill="#f59e0b" name="Distraction" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
