import { cookies } from "next/headers";

import { AccessGate } from "@/components/AccessGate";
import { ActivityTracker } from "@/components/ActivityTracker";
import { InsightsPanel } from "@/components/InsightsPanel";
import { ProductivityChart } from "@/components/ProductivityChart";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("wt_access")?.value === "granted";

  if (!hasAccess) {
    return <AccessGate paymentLink={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK} />;
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Productivity Dashboard</h1>
        <p className="max-w-3xl text-slate-300">
          This dashboard tracks your day as it really happens. Use it to identify your reliable deep-work windows and reduce avoidable distraction cycles.
        </p>
      </header>
      <ActivityTracker />
      <ProductivityChart />
      <InsightsPanel />
    </main>
  );
}
