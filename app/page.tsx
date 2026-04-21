import Link from "next/link";
import { CheckCircle2, Lock, Radar, TimerReset } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const faq = [
  {
    question: "Do you record screenshots, keystrokes, or app names?",
    answer:
      "No. Work Tracker Honest tracks only focus state signals from your browser tab activity and idle timing. No screenshots, no keystroke logging, and no hidden surveillance."
  },
  {
    question: "Can my manager see my data?",
    answer:
      "No. This product is built for individual contributors. Your baseline data stays in your browser. Optional sync uses anonymous IDs, not employee identity." 
  },
  {
    question: "How do I unlock the dashboard after purchase?",
    answer:
      "Buy through the Stripe hosted checkout, then use the same email in the dashboard unlock form. Access is saved in a secure cookie on your browser." 
  },
  {
    question: "What is included in the $9 plan?",
    answer:
      "Unlimited tracking, productivity trend charts, distraction analysis, streak detection, and optional anonymous cloud sync to use across devices." 
  }
];

const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-slate-800 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_rgba(13,17,23,0.95)_52%)] p-8 sm:p-12">
        <p className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-200">
          Anonymous time tracking for actual productivity
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
          See your real work patterns without guilt, surveillance, or fake gamification.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
          Work Tracker Honest helps remote workers understand where their day goes. It measures focus, distraction, and away time using lightweight activity signals, then turns that data into practical insights you can act on.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={paymentLink}
            className={cn(buttonVariants({ size: "lg" }), "text-base")}
            target="_blank"
            rel="noreferrer"
          >
            Buy for $9/mo
          </a>
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-base")}>
            Open Dashboard
          </Link>
        </div>
        {!paymentLink ? (
          <p className="mt-4 text-sm text-amber-300">
            Stripe payment link is not set yet. Add `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` in your environment to enable checkout.
          </p>
        ) : null}
      </header>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Radar className="h-5 w-5 text-cyan-300" />
            <CardTitle>The problem</CardTitle>
            <CardDescription>Remote work creates invisible drift and unnecessary productivity guilt.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            Most trackers are either invasive or performative. That makes data unreliable, and people stop trusting the feedback.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Lock className="h-5 w-5 text-cyan-300" />
            <CardTitle>Privacy-first method</CardTitle>
            <CardDescription>Track behavior patterns, not personal content.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            Local-first storage and anonymous IDs keep your identity out of analytics while still producing useful trend visibility.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <TimerReset className="h-5 w-5 text-cyan-300" />
            <CardTitle>Actionable output</CardTitle>
            <CardDescription>Know when focus drops and exactly when to protect deep work windows.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            You get daily trend charts, focus ratios, streaks, and practical recommendations tuned to your recent work rhythm.
          </CardContent>
        </Card>
      </section>

      <section className="mt-14 rounded-2xl border border-slate-800 bg-slate-950/50 p-8 sm:p-10">
        <h2 className="text-2xl font-semibold text-white">What you get in the dashboard</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            "Real-time focus and distraction tracking with mode context",
            "Productivity trend charts across day and hour",
            "Honest insight panel that highlights friction points",
            "Optional anonymous cloud sync for multi-device continuity"
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 text-slate-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mt-14">
        <Card className="border-cyan-500/40 bg-[linear-gradient(160deg,_rgba(6,182,212,0.14),_rgba(2,6,23,0.8)_65%)]">
          <CardHeader>
            <CardTitle className="text-3xl">Simple pricing, honest value</CardTitle>
            <CardDescription>Built for individual remote knowledge workers in startups and agencies.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-4xl font-semibold text-white">$9<span className="text-lg text-slate-300">/month</span></p>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  Replace productivity anxiety with clear evidence. Protect your best hours, reduce distraction cycles, and improve output without letting anyone monitor your screen.
                </p>
              </div>
              <a
                href={paymentLink}
                className={cn(buttonVariants({ size: "lg" }), "text-base")}
                target="_blank"
                rel="noreferrer"
              >
                Start Subscription
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-white">FAQ</h2>
        <div className="mt-6 space-y-3">
          {faq.map((item) => (
            <Card key={item.question}>
              <CardHeader>
                <CardTitle className="text-lg">{item.question}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{item.answer}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
