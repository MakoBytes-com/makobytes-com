import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrackPageView } from "@/components/admin/track-pageview";
import { TrackLink } from "@/components/admin/track-link";
import {
  ArrowRight,
  Brain,
  Camera,
  Clock,
  Lock,
  Sparkles,
  SquareDashed,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "MakoBytes — Lightweight Desktop Tools for People Who Live in AI",
  description:
    "MakoBytes builds fast, private desktop apps for AI power users. PromptPixel, MakoBot, PixelCopy, and more on the way. No subscriptions forced on you. No bloat. No BS.",
  alternates: { canonical: "https://makobytes.com" },
  openGraph: {
    type: "website",
    url: "https://makobytes.com",
    title: "MakoBytes — Lightweight Desktop Tools for AI Workflows",
    description:
      "Fast. Private. Yours to keep. The MakoBytes app catalog.",
    siteName: "MakoBytes",
  },
};

// ───── brand mark — circular navy "M" matching the MakoBot family ─────
function BrandMark({ size = 36 }: { size?: number }) {
  const fontSize = Math.round(size * 0.45);
  return (
    <div
      className="relative rounded-full flex items-center justify-center logo-ring"
      style={{
        width: size,
        height: size,
        background: "#ffffff",
        border: `${Math.max(2, Math.round(size * 0.04))}px solid #0061aa`,
      }}
    >
      <span
        className="font-bold select-none"
        style={{ fontSize, lineHeight: 1, color: "#0061aa" }}
      >
        M
      </span>
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
    Icon: Camera,
  },
  {
    slug: "makobot",
    name: "MakoBot",
    tagline: "Your local AI Workbench.",
    description:
      "Permanent memory across every AI tool you use, plus one-line plug-ins (@verify, @audit, @codereview) that cross-check answers with GPT, Claude, and Gemini. Windows, free, 100% local.",
    status: "available",
    price: "Free",
    platform: "Windows",
    href: "https://makobot.com",
    Icon: Brain,
  },
  {
    slug: "pixelcopy",
    name: "PixelCopy",
    tagline: "Capture your Windows screen like a pro.",
    description:
      "Region, scrolling, and fullscreen capture with screen recording, GIFs, annotations, OCR, and pin-to-screen. Every capture lands in a floating overlay, ready to mark up and share.",
    status: "available",
    price: "Free + Pro $8/mo",
    platform: "Windows",
    href: "https://pixelcopy.app",
    Icon: SquareDashed,
  },
];

function AppCard({ app }: { app: MakoApp }) {
  const isAvailable = app.status === "available";

  const statusLabel =
    app.status === "available"
      ? "available now"
      : app.status === "coming-soon"
        ? "coming soon"
        : "in development";

  const statusClasses = isAvailable
    ? "border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]"
    : "border-[#dbdbdb] bg-[#f8f9fb] text-[#777777]";

  const CardInner = (
    <div className="group relative h-full feature-card p-8">
      {/* status pill */}
      <div
        className={`mono-tag inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 ${statusClasses}`}
      >
        {isAvailable && (
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#10B981]" />
        )}
        {statusLabel}
      </div>

      {/* icon */}
      <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#0061aa]/20 bg-[#e6f0f9]">
        <app.Icon className="h-7 w-7 text-[#0061aa]" />
      </div>

      {/* name + price row */}
      <div className="mt-6 flex items-baseline justify-between gap-3">
        <h3 className="text-2xl font-bold text-[#333333]">{app.name}</h3>
        {app.price && (
          <div className="mono-tag text-[#777777]">
            {app.price}
            {app.platform && (
              <span className="ml-1.5 text-[#999999]">· {app.platform}</span>
            )}
          </div>
        )}
      </div>

      {/* tagline */}
      <div className="mt-2 text-sm font-semibold text-[#0061aa]">
        {app.tagline}
      </div>

      {/* description */}
      <p className="mt-3 text-sm leading-relaxed text-[#555555]">
        {app.description}
      </p>

      {/* cta row */}
      <div className="mt-6 flex items-center justify-between">
        {isAvailable ? (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-[#0061aa] transition group-hover:gap-2.5">
            View product
            <ArrowRight className="h-4 w-4" />
          </span>
        ) : (
          <span className="mono-tag text-[#999999]">
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
      href="mailto:admin@makobytes.com?subject=Notify me when MakoBytes ships a new app"
      className="block h-full"
    >
      {CardInner}
    </a>
  );
}

export default function MakoBytesHub() {
  return (
    <main className="relative min-h-screen bg-white text-[#333333]">
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
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#dbdbdb]/50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 whitespace-nowrap"
          >
            <BrandMark size={36} />
            <span className="text-lg font-bold tracking-tight text-[#333333]">
              MakoBytes
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-[#777777] md:flex">
            <a href="#apps" className="transition hover:text-[#333333]">
              Apps
            </a>
            <a href="#philosophy" className="transition hover:text-[#333333]">
              Philosophy
            </a>
            <a
              href="mailto:admin@makobytes.com"
              className="transition hover:text-[#333333]"
            >
              Contact
            </a>
          </div>
          <TrackLink
            href="/promptpixel"
            type="click_app_card"
            meta={{ source: "nav", app: "promptpixel" }}
            className="inline-flex items-center px-5 py-2 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-sm font-semibold transition-colors"
          >
            PromptPixel — $25
          </TrackLink>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section
        id="hero"
        className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 min-h-[600px] sm:min-h-[700px] lg:min-h-[820px]"
      >
        {/* Background hero image — anchored right, contained so the full monitor +
            keyboard + mouse setup is visible (no vertical crop). The section's
            min-height gives the contained image plenty of room to render large.
            On mobile a white gradient masks the image so text stays legible. */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/images/hero.webp"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-contain object-right"
          />
          {/* Mobile-only fade — desktop relies on the image's built-in whitespace */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/60 sm:hidden" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dbdbdb] bg-[#f8f9fb] px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[#10B981]" />
              <span className="mono-tag text-[#555555]">
                makobytes · desktop studio
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-black leading-[0.95] tracking-tight text-[#333333] sm:text-6xl lg:text-7xl">
              <span className="text-gradient">Lightweight tools</span>
              <br />
              <span className="text-gradient">for AI power users.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#555555] sm:text-xl">
              MakoBytes builds fast, private, one-time-purchase desktop apps that
              plug into the way you already work. No subscriptions. No bloat. No
              BS.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#apps"
                className="btn-glow flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold"
              >
                Browse the catalog
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#philosophy"
                className="flex items-center gap-2 rounded-xl border border-[#dbdbdb] bg-white px-6 py-3.5 font-semibold text-[#555555] transition hover:border-[#777777] hover:text-[#333333]"
              >
                What we believe
              </a>
            </div>

            <div className="mono-tag mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[#777777]">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#0061aa]" />
                on-device
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#0061aa]" />
                under 40mb
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#0061aa]" />
                one-time purchase
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── APPS GRID ───── */}
      <section
        id="apps"
        className="relative scroll-mt-20 border-y border-[#dbdbdb]/50 bg-[#eef2f7] py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mono-tag mb-4 text-[#0061aa]">// the catalog</div>
            <h2 className="mb-4 text-4xl font-black tracking-tight text-[#333333] sm:text-6xl">
              Every app, one click away.
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#555555]">
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
            <div className="mono-tag mb-4 text-[#0061aa]">// philosophy</div>
            <h2 className="text-4xl font-black tracking-tight text-[#333333] sm:text-5xl">
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
              <div key={title} className="feature-card p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#e6f0f9] border border-[#0061aa]/20">
                  <Icon className="h-5 w-5 text-[#0061aa]" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#333333]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#555555]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative overflow-hidden border-t border-[#dbdbdb]/50 py-24 sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0061aa]/[0.08] blur-[150px]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-5xl font-black tracking-tight text-[#333333] sm:text-6xl">
            <span className="text-gradient">Start with PromptPixel.</span>
          </h2>
          <p className="mb-10 text-xl text-[#555555]">
            Our first app. $25. Windows. Ships today.
          </p>
          <Link
            href="/promptpixel"
            className="btn-glow inline-flex items-center gap-2 rounded-xl px-10 py-5 text-lg font-bold"
          >
            Explore PromptPixel
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-[#dbdbdb]/50 bg-[#f8f9fb] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <BrandMark size={32} />
              <div>
                <div className="font-bold text-[#333333]">MakoBytes</div>
                <div className="mono-tag text-[#999999]">
                  desktop studio · est. 2026
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm text-[#777777]">
              <a href="#apps" className="transition hover:text-[#333333]">
                Apps
              </a>
              <a href="#philosophy" className="transition hover:text-[#333333]">
                Philosophy
              </a>
              <Link
                href="/promptpixel"
                className="transition hover:text-[#333333]"
              >
                PromptPixel
              </Link>
              <a
                href="mailto:admin@makobytes.com"
                className="transition hover:text-[#333333]"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mono-tag mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#dbdbdb]/50 pt-8 text-[#999999] md:flex-row">
            <div>© 2026 makobytes · built by <a href="https://makologics.com" target="_blank" rel="noopener" className="transition hover:text-[#0061aa]">makologics</a></div>
            <div className="flex gap-4">
              <Link href="/privacy" className="transition hover:text-[#333333]">
                privacy
              </Link>
              <Link href="/terms" className="transition hover:text-[#333333]">
                terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
