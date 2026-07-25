import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Download,
  ShoppingCart,
  MousePointerClick,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { auth } from "@/auth";
import {
  getTotal,
  getToday,
  getLastNDays,
  getRecentEvents,
  isStorageConfigured,
} from "@/lib/admin/storage";
import { StatCard } from "@/components/admin/stat-card";
import { TrendChart } from "@/components/admin/trend-chart";
import { EventsFeed } from "@/components/admin/events-feed";
import { LogoutButton } from "./logout-button";

export const metadata: Metadata = {
  title: "Dashboard · MakoBytes Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/admin");
  }

  const configured = isStorageConfigured();

  const [
    totalPageviews,
    todayPageviews,
    totalDownloads,
    todayDownloads,
    totalBuys,
    todayBuys,
    totalAppCardClicks,
    todayAppCardClicks,
    pageviewsTrend,
    downloadsTrend,
    recentEvents,
  ] = await Promise.all([
    getTotal("pageview_home"),
    getToday("pageview_home"),
    getTotal("click_download"),
    getToday("click_download"),
    getTotal("click_buy"),
    getToday("click_buy"),
    getTotal("click_app_card"),
    getToday("click_app_card"),
    getLastNDays("pageview_home", 14),
    getLastNDays("click_download", 14),
    getRecentEvents(50),
  ]);

  const funnelStops = [
    { label: "Site visits", value: totalPageviews },
    { label: "App card clicks", value: totalAppCardClicks },
    { label: "Download clicks", value: totalDownloads },
    { label: "Buy clicks", value: totalBuys },
  ];
  const funnelTop = funnelStops[0].value || 1;

  return (
    <main className="relative min-h-screen bg-white text-[#333333]">
      <div className="pointer-events-none fixed inset-0 grid-overlay opacity-50" />
      <div className="pointer-events-none fixed left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#0061aa]/[0.08] blur-[160px]" />

      <nav className="relative border-b border-[#dbdbdb]/50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-[#777777] transition hover:text-[#333333]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              MakoBytes
            </Link>
            <div className="h-4 w-px bg-[#dbdbdb]" />
            <span className="font-bold tracking-tight text-[#333333]">
              Admin Dashboard
            </span>
            <span className="mono-tag rounded-full border border-[#0061aa]/30 bg-[#e6f0f9] px-2 py-0.5 text-[10px] text-[#0061aa]">
              v1
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              {session.user.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={session.user.image}
                  alt=""
                  className="h-7 w-7 rounded-full border border-[#dbdbdb]"
                />
              )}
              <span className="mono-tag text-[11px] text-[#777777]">
                {session.user.email}
              </span>
            </div>
            <a
              href="/admin/dashboard"
              className="flex items-center gap-1.5 rounded-lg border border-[#dbdbdb] px-3 py-1.5 text-xs text-[#555555] transition hover:border-[#0061aa] hover:text-[#0061aa]"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </a>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        {!configured && (
          <div className="mb-8 rounded-2xl border border-[#f59e0b]/40 bg-[#fef3c7] p-6">
            <div className="mono-tag mb-2 text-[#b45309]">// setup required</div>
            <h2 className="mb-2 text-xl font-bold text-[#333333]">
              Vercel KV not connected yet
            </h2>
            <p className="text-sm leading-relaxed text-[#92400e]">
              All counters below will read zero until you create a Vercel KV
              database and connect it to this project. Go to{" "}
              <span className="mono-tag text-[#333333]">vercel.com/dashboard</span>{" "}
              → makobytes-com → Storage → Create Database → KV → Connect.
              Vercel will inject{" "}
              <span className="mono-tag text-[#333333]">KV_REST_API_URL</span> and{" "}
              <span className="mono-tag text-[#333333]">KV_REST_API_TOKEN</span>{" "}
              automatically. Then redeploy.
            </p>
          </div>
        )}

        <div className="mb-8">
          <div className="mono-tag mb-2 text-[#0061aa]">// overview</div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            <span className="text-gradient">What&apos;s happening on the site</span>
          </h1>
          <p className="mt-2 text-[#555555]">
            Live analytics — refreshed every page load. {recentEvents.length}{" "}
            recent event{recentEvents.length === 1 ? "" : "s"} captured.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Page views"
            total={totalPageviews}
            today={todayPageviews}
            Icon={Eye}
            accent="cyan"
          />
          <StatCard
            label="Download clicks"
            total={totalDownloads}
            today={todayDownloads}
            Icon={Download}
            accent="green"
          />
          <StatCard
            label="Buy Pro clicks"
            total={totalBuys}
            today={todayBuys}
            Icon={ShoppingCart}
            accent="magenta"
          />
          <StatCard
            label="App card clicks"
            total={totalAppCardClicks}
            today={todayAppCardClicks}
            Icon={MousePointerClick}
            accent="blue"
          />
        </div>

        <div className="mb-8 feature-card p-6">
          <div className="mb-6">
            <div className="mono-tag mb-1 text-[#0061aa]">// funnel</div>
            <h3 className="text-lg font-bold text-[#333333]">
              Visit → app card → download → buy
            </h3>
          </div>
          <div className="space-y-3">
            {funnelStops.map((stop, i) => {
              const pct = Math.round((stop.value / funnelTop) * 100);
              const colors = [
                "from-[#3387cf] to-[#0061aa]",
                "from-[#0061aa] to-[#3387cf]",
                "from-[#04bf6c] to-[#0061aa]",
                "from-[#406f7b] to-[#0061aa]",
              ];
              return (
                <div key={stop.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-[#555555]">{stop.label}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-[#333333]">
                        {stop.value.toLocaleString()}
                      </span>
                      <span className="mono-tag text-[#999999]">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#eef2f7]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${colors[i]}`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <TrendChart
              series={[
                {
                  name: "page views",
                  color: "#0061aa",
                  data: pageviewsTrend,
                },
                {
                  name: "downloads",
                  color: "#04bf6c",
                  data: downloadsTrend,
                },
              ]}
            />
          </div>
          <div className="lg:col-span-2">
            <EventsFeed events={recentEvents} />
          </div>
        </div>
      </div>
    </main>
  );
}
