export default function Page() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-16">

      {/* Hero */}
      <section className="flex flex-col gap-6 text-center">
        <div className="inline-block mx-auto bg-[#161b22] border border-[#30363d] rounded-full px-4 py-1 text-sm text-[#58a6ff]">
          No account required
        </div>
        <h1 className="text-4xl font-bold text-white leading-tight">
          Anonymous time tracking for{" "}
          <span className="text-[#58a6ff]">actual productivity</span>
        </h1>
        <p className="text-[#8b949e] text-lg max-w-xl mx-auto">
          Stop lying to yourself about how you spend your day. WorkTracker Honest measures real work time — no logins, no dashboards, no fluff. Just honest data stored locally on your device.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "#"}
            className="bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Start tracking for $9/mo
          </a>
          <a
            href="#faq"
            className="border border-[#30363d] hover:border-[#58a6ff] text-[#c9d1d9] px-8 py-3 rounded-lg transition-colors"
          >
            Learn more
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#8b949e]">
          <span>✓ No sign-up</span>
          <span>✓ Local-first storage</span>
          <span>✓ Optional cloud sync</span>
          <span>✓ Cancel anytime</span>
        </div>
      </section>

      {/* Pricing */}
      <section className="flex flex-col gap-6 items-center">
        <h2 className="text-2xl font-bold text-white">Simple, honest pricing</h2>
        <div className="w-full max-w-sm bg-[#161b22] border border-[#30363d] rounded-xl p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[#58a6ff] text-sm font-medium uppercase tracking-wide">Pro</span>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-white">$9</span>
              <span className="text-[#8b949e] mb-1">/month</span>
            </div>
            <p className="text-[#8b949e] text-sm">Everything you need to track honestly.</p>
          </div>
          <ul className="flex flex-col gap-3 text-sm">
            {[
              "Unlimited local time entries",
              "Optional encrypted cloud backup",
              "Weekly productivity reports",
              "API key for custom integrations",
              "No ads, no tracking, no BS"
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-[#58a6ff]">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <a
            href={process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "#"}
            className="bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-semibold px-6 py-3 rounded-lg text-center transition-colors"
          >
            Get started — $9/mo
          </a>
          <p className="text-[#8b949e] text-xs text-center">Cancel anytime. No questions asked.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white text-center">FAQ</h2>
        <div className="flex flex-col gap-4">
          {[
            {
              q: "Do I need to create an account?",
              a: "No. WorkTracker Honest runs entirely in your browser using local storage. Your data never leaves your device unless you explicitly enable cloud sync."
            },
            {
              q: "How does optional cloud sync work?",
              a: "You generate a personal API key from your dashboard. Data is encrypted before leaving your device and synced to our servers so you can access it across devices."
            },
            {
              q: "What happens if I cancel?",
              a: "Your local data stays on your device forever — it's yours. Cloud backups are retained for 30 days after cancellation so you can export everything."
            }
          ].map(({ q, a }) => (
            <div key={q} className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 flex flex-col gap-2">
              <h3 className="font-semibold text-white">{q}</h3>
              <p className="text-[#8b949e] text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-[#8b949e] text-sm border-t border-[#30363d] pt-8">
        © {new Date().getFullYear()} WorkTracker Honest. Built for honest people.
      </footer>

    </main>
  );
}
