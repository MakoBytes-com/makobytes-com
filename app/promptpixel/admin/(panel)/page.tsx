import { serverSupabase } from "@/lib/supabase";
import { Stat, Section } from "./ui";

export const dynamic = "force-dynamic";
const PRO_PRICE = 25; // one-time

function daysAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

// Tiny inline sparkline bars for a 14-day series.
function Spark({ series, color }: { series: number[]; color: string }) {
  const max = Math.max(1, ...series);
  return (
    <div className="flex items-end gap-1 h-16">
      {series.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / max) * 100}%`, minHeight: 2, background: color, opacity: 0.35 + (v / max) * 0.65 }} title={`${v}`} />
      ))}
    </div>
  );
}

function last14(dates: string[]): number[] {
  const buckets = new Array(14).fill(0);
  for (const d of dates) {
    const age = daysAgo(d);
    if (age >= 0 && age < 14) buckets[13 - age] += 1;
  }
  return buckets;
}

export default async function Overview() {
  const supabase = serverSupabase();
  const [accountsRes, viewsRes, downloadsRes] = await Promise.all([
    supabase.from("accounts").select("subscription_status, source, created_at"),
    supabase.from("page_views").select("created_at"),
    supabase.from("analytics_events").select("created_at").eq("event_type", "click_download"),
  ]);

  const accounts = accountsRes.data ?? [];
  const views = viewsRes.data ?? [];
  const downloads = downloadsRes.data ?? [];

  const active = accounts.filter((a) => a.subscription_status === "active").length;
  const refunded = accounts.filter((a) => a.subscription_status === "refunded").length;
  // Lifetime revenue estimate: Stripe-sourced active licenses × $25. Imported
  // Polar sales and comped keys aren't Stripe money, so they're excluded.
  const paidSales = accounts.filter(
    (a) => a.subscription_status === "active" && a.source === "stripe",
  ).length;
  const revenue = paidSales * PRO_PRICE;

  // Conversion funnel: site visits → downloads → paid.
  const funnel = [
    { label: "Page views", value: views.length },
    { label: "Downloads", value: downloads.length },
    { label: "Paid (Pro)", value: active },
  ];
  const funnelMax = Math.max(1, ...funnel.map((f) => f.value));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-black">Overview</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Revenue (Stripe)" value={`$${revenue}`} sub={`${paidSales} sales × $${PRO_PRICE}`} accent />
        <Stat label="Active licenses" value={String(active)} sub={refunded ? `${refunded} refunded` : "none refunded"} />
        <Stat label="Accounts" value={String(accounts.length)} />
        <Stat label="Page views" value={String(views.length)} />
        <Stat label="Downloads" value={String(downloads.length)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="License signups — last 14 days">
          <Spark series={last14(accounts.map((a) => a.created_at))} color="#3B82F6" />
        </Section>
        <Section title="Page views — last 14 days">
          <Spark series={last14(views.map((v) => v.created_at))} color="#10B981" />
        </Section>
      </div>

      <Section title="Conversion funnel">
        <div className="space-y-3">
          {funnel.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-28 text-sm text-white/60">{f.label}</div>
              <div className="h-6 flex-1 overflow-hidden rounded bg-white/5">
                <div className="h-full rounded bg-[#3B82F6]" style={{ width: `${(f.value / funnelMax) * 100}%` }} />
              </div>
              <div className="w-12 text-right text-sm font-semibold tabular-nums">{f.value}</div>
            </div>
          ))}
        </div>
        {views.length === 0 && (
          <p className="mt-3 text-xs text-white/40">Traffic numbers start filling in as visitors hit the site (tracking just went live).</p>
        )}
      </Section>
    </div>
  );
}
