# Build Task: work-tracker-honest

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: work-tracker-honest
HEADLINE: Anonymous time tracking for actual productivity
WHAT: None
WHY: None
WHO PAYS: None
NICHE: productivity-tools
PRICE: $$9/mo

ARCHITECTURE SPEC:
A Next.js web app with anonymous time tracking that focuses on honest productivity measurement without user accounts or complex setup. Uses local storage for data persistence and optional cloud sync via simple API keys.

PLANNED FILES:
- app/page.tsx
- app/tracker/page.tsx
- app/api/sync/route.ts
- components/TimeTracker.tsx
- components/ProductivityChart.tsx
- components/TaskList.tsx
- components/PricingCard.tsx
- lib/storage.ts
- lib/analytics.ts
- types/tracking.ts

DEPENDENCIES: next, react, tailwindcss, recharts, date-fns, zustand, @lemonsqueezy/lemonsqueezy.js, lucide-react

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Lemon Squeezy checkout overlay for payments
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.


PREVIOUS ATTEMPT FAILED WITH:
Codex exited 1: Reading additional input from stdin...
OpenAI Codex v0.121.0 (research preview)
--------
workdir: /tmp/openclaw-builds/work-tracker-honest
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: none
reasoning summaries: none
session id: 019d94f5-9617-7c73-8a6d-74059256a5ca
--------
user
# Build Task: work-tracker-honest

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: work-tracker-honest
HEADLINE: Anonymous time trackin
Please fix the above errors and regenerate.