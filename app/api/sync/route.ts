import { NextRequest, NextResponse } from "next/server";

import { hasPaidAccess, readSyncedSamples, writeSyncedSamples } from "@/lib/data-storage";
import type { ActivitySample } from "@/lib/types";

export const runtime = "nodejs";

type SyncAction =
  | { action: "unlock"; email: string }
  | { action: "pull"; anonymousId: string }
  | { action: "push"; anonymousId: string; samples: ActivitySample[] };

function isActivitySample(value: unknown): value is ActivitySample {
  if (typeof value !== "object" || value === null) return false;

  const sample = value as Partial<ActivitySample>;

  return (
    typeof sample.id === "string" &&
    typeof sample.timestamp === "string" &&
    (sample.category === "focus" || sample.category === "distraction" || sample.category === "away") &&
    (sample.intent === "deep-work" ||
      sample.intent === "collaboration" ||
      sample.intent === "admin" ||
      sample.intent === "break") &&
    typeof sample.idleSeconds === "number" &&
    typeof sample.focused === "boolean" &&
    (sample.source === "auto" || sample.source === "manual")
  );
}

export async function POST(request: NextRequest) {
  let payload: SyncAction;

  try {
    payload = (await request.json()) as SyncAction;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (payload.action === "unlock") {
    const email = payload.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const paid = await hasPaidAccess(email);
    const devBypass = process.env.NODE_ENV !== "production";

    if (!paid && !devBypass) {
      return NextResponse.json(
        {
          error:
            "This email is not confirmed yet. If you just completed checkout, wait a minute and try again once the webhook arrives."
        },
        { status: 403 }
      );
    }

    const response = NextResponse.json({ access: true });
    response.cookies.set({
      name: "wt_access",
      value: "granted",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/"
    });

    return response;
  }

  if (payload.action === "pull") {
    const anonymousId = payload.anonymousId?.trim();
    if (!anonymousId) {
      return NextResponse.json({ error: "anonymousId is required" }, { status: 400 });
    }

    const samples = await readSyncedSamples(anonymousId);
    return NextResponse.json({ samples });
  }

  if (payload.action === "push") {
    const anonymousId = payload.anonymousId?.trim();
    if (!anonymousId) {
      return NextResponse.json({ error: "anonymousId is required" }, { status: 400 });
    }

    if (!Array.isArray(payload.samples)) {
      return NextResponse.json({ error: "samples must be an array" }, { status: 400 });
    }

    const sanitizedSamples = payload.samples.filter((sample) => isActivitySample(sample)).slice(-7_200);
    const merged = await writeSyncedSamples(anonymousId, sanitizedSamples);

    return NextResponse.json({ samples: merged });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
