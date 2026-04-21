"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AccessGateProps {
  paymentLink?: string;
}

export function AccessGate({ paymentLink }: AccessGateProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const onUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action: "unlock", email })
      });

      const payload = (await response.json()) as { access?: boolean; error?: string };

      if (!response.ok || !payload.access) {
        setStatus("error");
        setMessage(payload.error || "Unable to verify this email yet. Make sure checkout finished successfully.");
        return;
      }

      setStatus("success");
      setMessage("Access granted. Loading dashboard...");
      window.location.reload();
    } catch {
      setStatus("error");
      setMessage("Network issue while verifying access. Please try again.");
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-12 sm:px-6">
      <Card className="w-full border-cyan-400/40 bg-[linear-gradient(150deg,_rgba(6,182,212,0.18),_rgba(2,6,23,0.92)_70%)]">
        <CardHeader>
          <CardTitle className="text-3xl text-white">Unlock Your Honest Productivity Dashboard</CardTitle>
          <CardDescription>
            The dashboard is subscription-only to keep this product independent from employer surveillance models.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <a
            href={paymentLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-cyan-500 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Buy Access for $9/mo
          </a>
          {!paymentLink ? (
            <p className="text-sm text-amber-200">
              Stripe link is not configured yet. Set `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` to enable checkout.
            </p>
          ) : null}

          <form className="space-y-3" onSubmit={onUnlock}>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">
              Already purchased? Enter the same email from checkout.
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
              />
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Verifying..." : "Unlock"}
              </Button>
            </div>
          </form>

          {status === "error" ? <p className="text-sm text-rose-300">{message}</p> : null}
          {status === "success" ? <p className="text-sm text-emerald-300">{message}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}
