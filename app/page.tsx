import type { Metadata } from "next";
import Link from "next/link";
import { TrackPageView } from "@/components/admin/track-pageview";
import { TrackLink } from "@/components/admin/track-link";
import {
  ArrowRight,
  Camera,
  Clock,
  Library,
  Lock,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "MakoBytes — Lightweight Desktop Tools for People Who Live in AI",
  description:
    "MakoBytes builds fast, private, one-time-purchase desktop apps for AI power users. PromptPixel, and more on the way. No subscriptions. No bloat. No BS.",
  alternates: { canonical: "https://makobytes.com" },
  openGraph: {
    type: "website",
    url: "https://makobytes.com",
    title: "MakoBytes — Lightweight Desktop Tools for AI Workflows",
    description:
      "Fast. Private. One-time purchase. The MakoBytes app catalog.",
    siteName: "MakoBytes",
  },
};

// ───── brand mark (inline svg) ─────
function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-glow-blue via-glow-cyan to-glow-magenta ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 8l8-4 8 4v8l-8 4-8-4V8z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M4 8l8 4 8-4M12 12v8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ───── app catalog ─────
type AppStatus = "available" | "coming-soon" | "in-development";

type MakoApp = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: AppStatus;
  price?: string;
  platform?: string;
  href?: string;
  accent: "blue" | "cyan" | "magenta";
  Icon: React.ComponentType<{ className?: string }>;
};

const apps: MakoApp[] = [
  {
    slug: "promptpixel",
    name: "PromptPixel",
    tagline: "One hotkey. Screenshot to AI.",
    description:
      "Press a key. PromptPixel snaps your screen, pastes it into ChatGPT, Claude, or any AI chat — and types your prompt alongside it. Hands-free.",
    status: "available",
    price: "Free + Pro $25",
    platform: "Windows",
    href: "/promptpixel",
    accent: "blue",
    Icon: Camera,
  },
  {
    slug: "aipromptshive",
    name: "AI Prompt Hive",
    tagline: "A marketplace for creative intelligence.",
    description:
      "Save, organize, and share your best AI prompts in one place. Free prompt storage built for people who talk to AI all day.",
    status: "available",
    price: "Free",
    platform: "Web",
    href: "https://aipromptshive.com",
    accent: "cyan",
    Icon: Library,
  },
  {
    slug: "coming-soon-2",
    name: "App Three",
    tagline: "In development.",
    description:
      "Another lightweight AI workflow tool in the pipeline. Sign up to be the first to hear.",
    status: "in-development",
    accent: "magenta",
    Icon: Wrench,
  },
];

function AppCard({ app }: { app: MakoApp }) {
  const accentMap = {
    blue: {
      icon: "text-glow-blue",
      iconBg: "from-glow-blue/30 to-glow-blue/5 border-glow-blue/30",
      tag: "text-glow-blue",
    },
    cyan: {
      icon: "text-glow-cyan",
      iconBg: "from-glow-cyan/30 to-glow-cyan/5 border-glow-cyan/30",
      tag: "text-glow-cyan",
    },
    magenta: {
      icon: "text-glow-magenta",
      iconBg:
        "from-glow-magenta/30 to-glow-magenta/5 border-glow-magenta/30",
      tag: "text-glow-magenta",
    },
  };
  const accent = accentMap[app.accent];
  const isAvailable = app.status === "available";

  const statusLabel =
    app.status === "available"
      ? "available now"
      : app.status === "coming-soon"
        ? "coming soon"
        : "in development";

  const statusClasses =
    app.status === "available"
      ? "border-green-400/30 bg-green-400/10 text-green-400"
      : "border-white/10 bg-white/5 text-white/50";

  const CardInner = (
    <div className="group relative h-full glass rounded-2xl p-8 transition-all">
      {/* status pill */}
      <div
        className={`mono-tag inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 ${statusClasses}`}
      >
        {isAvailable && (
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
        )}
        {statusLabel}
      </div>

      {/* icon */}
      <div
        className={`mt-6 flex h-14 w-14 items-center justify-center rounded-xl border bg-gradient-to-br ${accent.iconBg}`}
      >
        <app.Icon className={`h-7 w-7 ${accent.icon}`} />
      </div>

      {/* name + price row */}
      <div className="mt-6 flex items-baseline justify-between gap-3">
        <h3 className="text-2xl font-bold text-white">{app.name}</h3>
        {app.price && (
          <div className="mono-tag text-white/40">
            {app.price}
            {app.platform && (
              <span className="ml-1.5 text-white/30">· {app.platform}</span>
            )}
          </div>
        )}
      </div>

      {/* tagline */}
      <div className={`mt-2 text-sm font-semibold ${accent.tag}`}>
        {app.tagline}
      </div>

      {/* description */}
      <p className="mt-3 text-sm leading-relaxed text-white/60">
        {app.description}
      </p>

      {/* cta row */}
      <div className="mt-6 flex items-center justify-between">
        {isAvailable ? (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white transition group-hover:gap-2.5">
            View product
            <ArrowRight className="h-4 w-4" />
          </span>
        ) : (
          <span className="mono-tag text-white/30">
            notify me when it ships →
          </span>
        )}
      </div>
    </div>
  );

  if (isAvailable && app.href) {
    const isExternal = app.href.startsWith("http");
    if (isExternal) {
      return (
        <a href={app.href} target="_blank" rel="noopener noreferrer" className="block h-full">
          {CardInner}
        </a>
      );
    }
    return (
      <Link href={app.href} className="block h-full">
        {CardInner}
      </Link>
    );
  }

  return (
    <a
      href="mailto:hello@makobytes.com?subject=Notify me when MakoBytes ships a new app"
      className="block h-full"
    >
      {CardInner}
    </a>
  );
}

export default function MakoBytesHub() {
  return (
    <main className="relative min-h-screen bg-ink-950 text-white">
      <TrackPageView type="pageview_home" page="/" />
      {/* JSON-LD: Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MakoBytes",
            url: "https://makobytes.com",
            description:
              "MakoBytes builds lightweight, private, one-time-purchase desktop tools for people who live in AI workflows.",
            sameAs: [],
          }),
        }}
      />

      {/* ───── NAV ───── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 whitespace-nowrap"
          >
            <BrandMark />
            <span className="text-lg font-bold tracking-tight text-white">
              MakoBytes
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#apps" className="transition hover:text-white">
              Apps
            </a>
            <a href="#philosophy" className="transition hover:text-white">
              Philosophy
            </a>
            <a
              href="mailto:hello@makobytes.com"
              className="transition hover:text-white"
            >
              Contact
            </a>
          </div>
          <TrackLink
            href="/promptpixel"
            type="click_app_card"
            meta={{ source: "nav", app: "promptpixel" }}
            className="btn-glow rounded-lg px-5 py-2 text-sm font-semibold text-white"
          >
            PromptPixel — $25
          </TrackLink>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-glow-blue/10 blur-[180px]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="mono-tag text-white/80">
              makobytes · desktop studio
            </span>
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            <span className="text-gradient">Lightweight tools</span>
            <br />
            <span className="text-gradient-violet">for AI power users.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
            MakoBytes builds fast, private, one-time-purchase desktop apps that
            plug into the way you already work. No subscriptions. No bloat. No
            BS.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#apps"
              className="btn-glow flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white"
            >
              Browse the catalog
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#philosophy"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-ink-950/50 px-6 py-3.5 font-semibold text-white/80 backdrop-blur-md transition hover:border-white/30 hover:text-white"
            >
              What we believe
            </a>
          </div>

          <div className="mono-tag mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/40">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-glow-blue" />
              on-device
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-glow-cyan" />
              under 40mb
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-glow-magenta" />
              one-time purchase
            </span>
          </div>
        </div>
      </section>

      {/* ───── APPS GRID ───── */}
      <section
        id="apps"
        className="relative scroll-mt-20 border-y border-white/5 bg-ink-900/40 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mono-tag mb-4 text-glow-cyan">// the catalog</div>
            <h2 className="mb-4 text-4xl font-black tracking-tight text-gradient sm:text-6xl">
              Every app, one click away.
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-white/60">
              Small catalog today. Growing catalog tomorrow. Same rules forever
              — buy once, own it, use it.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>
        </div>
      </section>

      {/* ───── PHILOSOPHY ───── */}
      <section
        id="philosophy"
        className="relative scroll-mt-20 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-12 text-center">
            <div className="mono-tag mb-4 text-glow-magenta">
              // philosophy
            </div>
            <h2 className="text-4xl font-black tracking-tight text-gradient sm:text-5xl">
              Tools worth paying for.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                Icon: Lock,
                title: "Your data stays with you",
                body: "Every MakoBytes app runs on-device. Your screenshots, your text, your workflows — none of it ever touches our servers because we don't have any.",
              },
              {
                Icon: Zap,
                title: "Fast or it's broken",
                body: "If a feature can't keep up with your thinking, we don't ship it. Sub-second response time is the floor, not the ceiling.",
              },
              {
                Icon: Clock,
                title: "Perpetual license, JetBrains-style.",
                body: "Every MakoBytes app is sold under a perpetual license. Buy it once, own that version forever — no expiry, no nag screens, no feature loss. Updates are included for 12 months; optional $15/year after that if you want new versions. Stop renewing and your software keeps working. The way it should be.",
              },
              {
                Icon: Sparkles,
                title: "Plays nice with everything",
                body: "Every app is model-agnostic, tool-agnostic, and workflow-agnostic. Use it with ChatGPT, Claude, Gemini, your own local model, whatever you prefer.",
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="glass rounded-2xl p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-glow-blue/20 to-glow-cyan/20">
                  <Icon className="h-5 w-5 text-glow-cyan" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-glow-blue/10 to-transparent" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-5xl font-black tracking-tight text-gradient sm:text-6xl">
            Start with PromptPixel.
          </h2>
          <p className="mb-10 text-xl text-white/60">
            Our first app. $25. Windows. Ships today.
          </p>
          <Link
            href="/promptpixel"
            className="btn-glow inline-flex items-center gap-2 rounded-xl px-10 py-5 text-lg font-bold text-white"
          >
            Explore PromptPixel
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-white/5 bg-ink-950 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <BrandMark />
              <div>
                <div className="font-bold text-white">MakoBytes</div>
                <div className="mono-tag text-white/40">
                  desktop studio · est. 2026
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/60">
              <a href="#apps" className="transition hover:text-white">
                Apps
              </a>
              <a href="#philosophy" className="transition hover:text-white">
                Philosophy
              </a>
              <Link
                href="/promptpixel"
                className="transition hover:text-white"
              >
                PromptPixel
              </Link>
              <a
                href="mailto:hello@makobytes.com"
                className="transition hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mono-tag mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-white/30 md:flex-row">
            <div>© 2026 makobytes · built by <a href="https://makologics.com" target="_blank" rel="noopener" className="transition hover:text-white">makologics</a></div>
            <div className="flex gap-4">
              <Link href="/privacy" className="transition hover:text-white">
                privacy
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
