import { createHmac, timingSafeEqual } from "node:crypto";

import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export function setupLemonSqueezyClient() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) return;

  lemonSqueezySetup({
    apiKey,
    onError: (error) => {
      console.error("Lemon Squeezy setup error:", error.message);
    }
  });
}

export function verifyLemonSqueezySignature(rawBody: string, signature: string, secret: string) {
  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");

  const incoming = Buffer.from(signature, "hex");
  const expected = Buffer.from(digest, "hex");

  if (incoming.length !== expected.length) return false;
  return timingSafeEqual(incoming, expected);
}

export function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string) {
  const values = signatureHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split("=");
    if (key && value) acc[key] = value;
    return acc;
  }, {});

  const timestamp = values.t;
  const v1 = values.v1;
  if (!timestamp || !v1) return false;

  const payload = `${timestamp}.${rawBody}`;
  const digest = createHmac("sha256", secret).update(payload).digest("hex");

  const incoming = Buffer.from(v1, "hex");
  const expected = Buffer.from(digest, "hex");

  if (incoming.length !== expected.length) return false;
  return timingSafeEqual(incoming, expected);
}

export function extractPaidEmail(payload: unknown) {
  if (typeof payload !== "object" || payload === null) return null;

  const maybeStripe = payload as {
    type?: string;
    data?: { object?: { customer_details?: { email?: string }; customer_email?: string; receipt_email?: string } };
  };

  if (maybeStripe.type === "checkout.session.completed") {
    return (
      maybeStripe.data?.object?.customer_details?.email ||
      maybeStripe.data?.object?.customer_email ||
      maybeStripe.data?.object?.receipt_email ||
      null
    );
  }

  const maybeLemon = payload as {
    meta?: { event_name?: string; custom_data?: { email?: string } };
    data?: { attributes?: { user_email?: string } };
  };

  if (maybeLemon.meta?.event_name === "order_created") {
    return maybeLemon.meta.custom_data?.email || maybeLemon.data?.attributes?.user_email || null;
  }

  return null;
}
