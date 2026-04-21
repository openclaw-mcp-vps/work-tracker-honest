import { NextRequest, NextResponse } from "next/server";

import { grantPaidAccess } from "@/lib/data-storage";
import { extractPaidEmail, verifyLemonSqueezySignature, verifyStripeSignature } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      {
        error: "STRIPE_WEBHOOK_SECRET is not configured"
      },
      { status: 500 }
    );
  }

  const rawBody = await request.text();
  const stripeSignature = request.headers.get("stripe-signature");
  const lemonSignature = request.headers.get("x-signature");

  let isVerified = false;

  if (stripeSignature) {
    isVerified = verifyStripeSignature(rawBody, stripeSignature, secret);
  } else if (lemonSignature) {
    isVerified = verifyLemonSqueezySignature(rawBody, lemonSignature, secret);
  }

  if (!isVerified) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
  }

  const email = extractPaidEmail(payload);
  if (email) {
    await grantPaidAccess(email);
  }

  return NextResponse.json({ received: true, emailRecorded: Boolean(email) });
}
