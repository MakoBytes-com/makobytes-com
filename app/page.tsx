import type { Metadata } from "next";
import Image from "next/image";
import { TrackPageView } from "@/components/admin/track-pageview";
import { TrackLink } from "@/components/admin/track-link";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Check,
  Crop,
  Lock,
  PenLine,
  Scale,
  ScanText,
  ShieldCheck,
  SquareDashed,
  Type,
  Video,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "MakoBytes — Desktop Software, Built Like Precision Instruments",
  description:
    "MakoBytes is a Windows desktop software studio. Small, sharp apps for AI power users — PixelCopy and MakoBot — signed, on-device, fast. No subscriptions forced on you. No bloat. No BS.",
  alternates: { canonical: "https://makobytes.com" },
  openGraph: {
    type: "website",
    url: "https://makobytes.com",
    title: "MakoBytes — Desktop Software, Built Like Precision Instruments",
    description: "Fast. Private. No BS. The MakoBytes catalog.",
    siteName: "MakoBytes",
  },
};

/* ───── brand mark — circular navy "M" (house mark) ───── */
function BrandMark({ size = 36 }: { size?: number }) {
  const fontSize = Math.round(size * 0.45);
  return (
    <div
      className="logo-ring relative flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: "#ffffff",
        border: `${Math.max(2, Math.round(size * 0.04))}px solid #0061aa`,
      }}
    >
      <span
        className="select-none font-bold"
        style={{ fontSize, lineHeight: 1, color: "#0061aa" }}
      >
        M
      </span>
    </div>
  );
}

/* ───── tiny drawing hardware ───── */
function Screws() {
  return (
    <>
      <span className="screw absolute left-3 top-3" style={{ "--slot": "22deg" } as React.CSSProperties} />
      <span className="screw absolute right-3 top-3" style={{ "--slot": "68deg" } as React.CSSProperties} />
      <span className="screw absolute bottom-3 left-3" style={{ "--slot": "110deg" } as React.CSSProperties} />
      <span className="screw absolute bottom-3 right-3" style={{ "--slot": "-15deg" } as React.CSSProperties} />
    </>
  );
}

function SpecRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[112px_1fr] items-baseline gap-4 border-b border-[#dfe5ec] py-2.5 last:border-b-0">
      <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#6b7684]">{k}</dt>
      <dd className="text-[15px] leading-relaxed text-[#26303b]">{v}</dd>
    </div>
  );
}

/* ───── PixelCopy UI mockup — software, drawn in software ───── */
function PixelCopyWindow() {
  return (
    <div className="ui-window w-[320px] sm:w-[380px]">
      <div className="ui-titlebar">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d7dee6]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d7dee6]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#0061aa]" />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b7684]">
          PixelCopy — Capture
        </span>
        <SquareDashed className="ml-auto h-3.5 w-3.5 text-[#0061aa]" aria-hidden="true" />
      </div>
      <div className="relative h-[200px] bg-[#eef2f7] p-4 sm:h-[220px]">
        {/* faux desktop windows behind the capture */}
        <div className="absolute left-4 top-4 h-16 w-40 rounded-md border border-[#dde3ea] bg-white/80" />
        <div className="absolute bottom-8 right-6 h-20 w-36 rounded-md border border-[#dde3ea] bg-white/70" />

        {/* capture marquee */}
        <div className="absolute left-10 top-9 h-[104px] w-[210px] rounded-md border-2 border-dashed border-[#0061aa] bg-[#0061aa]/[0.06] sm:w-[240px]">
          <span className="absolute -left-1 -top-1 h-2 w-2 border border-[#0061aa] bg-white" />
          <span className="absolute -right-1 -top-1 h-2 w-2 border border-[#0061aa] bg-white" />
          <span className="absolute -bottom-1 -left-1 h-2 w-2 border border-[#0061aa] bg-white" />
          <span className="absolute -bottom-1 -right-1 h-2 w-2 border border-[#0061aa] bg-white" />
          <span className="absolute -top-6 left-0 rounded bg-[#26303b] px-1.5 py-0.5 font-mono text-[9px] text-white">
            1280 × 720
          </span>
        </div>

        {/* annotation toolbar */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-lg border border-[#dbe2ea] bg-white px-3 py-2 shadow-[0_8px_24px_-8px_rgba(0,62,110,0.35)]">
          <Crop className="h-3.5 w-3.5 text-[#26303b]" aria-hidden="true" />
          <PenLine className="h-3.5 w-3.5 text-[#26303b]" aria-hidden="true" />
          <Type className="h-3.5 w-3.5 text-[#26303b]" aria-hidden="true" />
          <ScanText className="h-3.5 w-3.5 text-[#0061aa]" aria-hidden="true" />
          <span className="h-4 w-px bg-[#e2e8ef]" />
          <Video className="h-3.5 w-3.5 text-[#26303b]" aria-hidden="true" />
          <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[#e11d48]" />
        </div>

        {/* toast */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-[#d9e6d9] bg-white px-2 py-1 shadow-sm">
          <Check className="h-3 w-3 text-[#10B981]" aria-hidden="true" />
          <span className="font-mono text-[9.5px] text-[#26303b]">Copied to clipboard</span>
        </div>
      </div>
    </div>
  );
}

/* ───── MakoBot UI mockup ───── */
function MakoBotWindow() {
  return (
    <div className="ui-window w-[320px] sm:w-[380px]">
      <div className="ui-titlebar">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d7dee6]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d7dee6]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#0061aa]" />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6b7684]">
          MakoBot — Memory
        </span>
        <Brain className="ml-auto h-3.5 w-3.5 text-[#0061aa]" aria-hidden="true" />
      </div>
      <div className="space-y-2 bg-white p-3.5">
        <div className="rounded-md border border-[#e4e9ef] bg-[#f8fafc] px-2.5 py-2">
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#96a1ad]">Today · makobytes.com</div>
          <div className="mt-0.5 font-mono text-[11px] text-[#26303b]">site rebuild shipped — precision spec sheet ✓</div>
        </div>
        <div className="rounded-md border border-[#e4e9ef] bg-[#f8fafc] px-2.5 py-2">
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#96a1ad]">Yesterday · client portal</div>
          <div className="mt-0.5 font-mono text-[11px] text-[#26303b]">pitch email approved, first send queued</div>
        </div>
        <div className="rounded-md border border-[#cfe0f0] bg-[#e6f0f9] px-2.5 py-2">
          <div className="font-mono text-[11px] text-[#004d88]">
            @verify → GPT <Check className="inline h-3 w-3 text-[#10B981]" aria-hidden="true" /> · Gemini{" "}
            <Check className="inline h-3 w-3 text-[#10B981]" aria-hidden="true" /> · Claude{" "}
            <Check className="inline h-3 w-3 text-[#10B981]" aria-hidden="true" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-md border border-[#d3dae2] px-2.5 py-2">
          <span className="font-mono text-[11px] text-[#96a1ad]">Search every project…</span>
          <span className="rounded border border-[#d3dae2] px-1 font-mono text-[9px] text-[#6b7684]">⏎</span>
        </div>
      </div>
    </div>
  );
}

/* ───── spec ticker content ───── */
function TickerRow({ hidden = false }: { hidden?: boolean }) {
  const items = [
    "NO TELEMETRY",
    "SIGNED VIA AZURE TRUSTED SIGNING",
    "RUNS ON YOUR MACHINE",
    "NO DARK PATTERNS",
    "SUB-SECOND OR IT DOESN'T SHIP",
    "MACHINED IN TEXAS",
  ];
  return (
    <span className="inline-flex items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className="inline-flex items-center">
          <span className="mx-6 font-mono text-[11px] uppercase tracking-[0.24em] text-[#4d5a68]">{t}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#0061aa]/40" />
        </span>
      ))}
    </span>
  );
}

const SPEC_CHIPS = ["SIGNED BINARIES", "100% ON-DEVICE", "WINDOWS 10–11", "EST. 2026"];

export default function MakoBytesHub() {
  return (
    <main className="paper-grid relative min-h-screen text-[#26303b]">
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
              "MakoBytes builds lightweight, private desktop tools for people who live in AI workflows.",
            sameAs: [],
          }),
        }}
      />

      {/* ───── NAV ───── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#d7dee6]/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-3 whitespace-nowrap">
            <BrandMark size={36} />
            <span className="leading-none">
              <span className="block font-display text-lg font-bold tracking-tight text-[#26303b]">
                MakoBytes
              </span>
              <span className="mt-0.5 hidden font-mono text-[9px] uppercase tracking-[0.28em] text-[#6b7684] sm:block">
                Desktop software works
              </span>
            </span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-[#55606c] md:flex">
            <a href="#catalog" className="transition hover:text-[#0061aa]">
              Catalog
            </a>
            <a href="#standard" className="transition hover:text-[#0061aa]">
              The Standard
            </a>
            <a href="#company" className="transition hover:text-[#0061aa]">
              Company
            </a>
            <a href="mailto:admin@makobytes.com" className="transition hover:text-[#0061aa]">
              Contact
            </a>
          </div>
          <TrackLink
            href="https://pixelcopy.app"
            type="click_app_card"
            meta={{ source: "nav", app: "pixelcopy" }}
            newTab
            className="btn-machined whitespace-nowrap px-3 py-2 text-[13px] font-semibold sm:px-4 sm:text-sm"
          >
            Get PixelCopy
          </TrackLink>
        </div>
      </nav>

      {/* ───── HERO — the spec sheet opens ───── */}
      <section id="top" className="relative overflow-hidden pb-20 pt-28 sm:pt-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <Reveal>
                <div className="flex items-center gap-3">
                  <span className="crosshair" aria-hidden="true" />
                  <span className="spec-label">Spec sheet Nº 001 — Mako Logics LLC</span>
                </div>
              </Reveal>

              <RevealLines
                as="h1"
                className="mt-8 font-display text-[13.5vw] font-bold leading-[0.94] tracking-tight text-[#111b26] sm:text-7xl lg:text-[5.2rem]"
                delay={0.05}
              >
                <span>Software,</span>
                <span>
                  built like <span className="text-[#0061aa]">precision</span>
                </span>
                <span>
                  <span className="text-[#0061aa]">instruments.</span>
                </span>
              </RevealLines>

              <Reveal delay={0.35}>
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#4d5a68] sm:text-xl">
                  MakoBytes is a Windows desktop software studio. Small, sharp
                  apps for people who live in AI workflows — machined with the
                  care of a tool shop, signed like they mean it, and fast enough
                  to keep up with your thinking.
                </p>
              </Reveal>

              <Reveal delay={0.45}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <a href="#catalog" className="btn-machined px-6 py-3.5 font-semibold">
                      Browse the catalog
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Magnetic>
                  <a href="#standard" className="btn-ink px-6 py-3.5 font-semibold">
                    Read the standard
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.55}>
                <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3">
                  {SPEC_CHIPS.map((chip) => (
                    <span key={chip} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rotate-45 bg-[#0061aa]" aria-hidden="true" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#55606c]">
                        {chip}
                      </span>
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* FIG. 00 — the house mark, dimensioned like a drawing */}
            <Reveal delay={0.25} y={44} className="relative mx-auto w-full max-w-[440px]">
              <div className="relative">
                {/* top dimension line */}
                <svg
                  className="pointer-events-none absolute -top-9 left-2 right-2 hidden h-7 w-[calc(100%-16px)] md:block"
                  viewBox="0 0 100 24"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M0,8 V24" pathLength={1} className="dim-draw" stroke="#0061aa" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
                  <path d="M100,8 V24" pathLength={1} className="dim-draw" stroke="#0061aa" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
                  <path d="M0,16 H100" pathLength={1} className="dim-draw" stroke="#0061aa" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>
                <span className="dim-fade absolute -top-[46px] left-1/2 hidden -translate-x-1/2 bg-white px-2 font-mono text-[10px] tracking-[0.18em] text-[#0061aa] md:block">
                  440 px
                </span>

                {/* right dimension line */}
                <svg
                  className="pointer-events-none absolute -right-9 top-2 hidden h-[calc(100%-16px)] w-7 md:block"
                  viewBox="0 0 24 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M8,0 H24" pathLength={1} className="dim-draw" stroke="#0061aa" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
                  <path d="M8,100 H24" pathLength={1} className="dim-draw" stroke="#0061aa" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
                  <path d="M16,0 V100" pathLength={1} className="dim-draw" stroke="#0061aa" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
                </svg>

                <div className="plate sweep relative p-5">
                  <Screws />
                  <Image
                    src="/images/instrument-badge.png"
                    alt="Machined aluminum MakoBytes house mark — a brushed metal badge engraved with the letter M and a navy anodized ring"
                    width={1024}
                    height={1024}
                    priority
                    className="w-full rounded-lg"
                  />
                  <div className="mt-4 flex items-end justify-between px-1">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0061aa]">
                        Fig. 00 — House mark
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a95a1]">
                        The mark goes on when it ships clean.
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a95a1]">
                      MAT: AL 6061
                      <br />
                      NAVY ANODIZE
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───── SPEC TICKER ───── */}
      <div className="border-y border-[#d7dee6]/80 bg-white/70 py-3">
        <div className="ticker">
          <div className="ticker-track">
            <TickerRow />
            <TickerRow hidden />
          </div>
        </div>
      </div>

      {/* ───── THE CATALOG ───── */}
      <section id="catalog" className="scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="crosshair" aria-hidden="true" />
              <span className="spec-label">// The catalog</span>
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-tight text-[#111b26] sm:text-6xl">
              Two instruments in production.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-[#4d5a68]">
              A small catalog, on purpose. Each app earns its place on the bench
              — same rules, same finish, same signature.
            </p>
          </Reveal>

          {/* PX-01 — PixelCopy */}
          <Reveal y={48} className="mt-16">
            <article className="plate sweep relative overflow-hidden p-7 sm:p-10">
              <Screws />
              <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="steel-text font-display text-6xl font-bold tracking-tight sm:text-7xl">
                      PX-01
                    </span>
                    <span className="mono-tag inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2.5 py-0.5 text-[#10B981]">
                      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#10B981]" />
                      In production
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-3xl font-bold text-[#111b26] sm:text-4xl">
                    PixelCopy
                  </h3>
                  <p className="mt-2 text-lg font-semibold text-[#0061aa]">
                    Capture your Windows screen like a pro.
                  </p>
                  <dl className="mt-6">
                    <SpecRow k="Class" v="Screen-capture studio" />
                    <SpecRow k="Capture" v="Region · Window · Scrolling · Full screen" />
                    <SpecRow k="Record" v="MP4 · WebM · GIF, with pause/resume" />
                    <SpecRow k="Extract" v="OCR any region straight to your clipboard" />
                    <SpecRow k="Share" v="Pin to screen, annotate, optional cloud links" />
                    <SpecRow k="License" v={<span><strong>Free tier</strong> + Pro $8/mo — cancel anytime</span>} />
                  </dl>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Magnetic>
                      <TrackLink
                        href="https://pixelcopy.app"
                        type="click_app_card"
                        meta={{ source: "catalog", app: "pixelcopy" }}
                        newTab
                        className="btn-machined px-6 py-3 font-semibold"
                      >
                        Visit pixelcopy.app
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </TrackLink>
                    </Magnetic>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#8a95a1]">
                      Win 10/11 · Signed · Microsoft Store
                    </span>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-[520px] pb-10 pl-2 sm:pb-14">
                  <Image
                    src="/images/plate-pixelcopy.png"
                    alt="Precision camera aperture machined from brushed aluminum with a navy anodized iris, photographed on an engineering drawing"
                    width={1264}
                    height={848}
                    className="w-full rounded-xl border border-[#d3dae2]"
                  />
                  <div className="absolute -bottom-2 -left-2 sm:bottom-0 sm:left-0">
                    <PixelCopyWindow />
                  </div>
                </div>
              </div>
            </article>
          </Reveal>

          {/* MB-02 — MakoBot */}
          <Reveal y={48} className="mt-12">
            <article className="plate sweep relative overflow-hidden p-7 sm:p-10">
              <Screws />
              <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="relative order-2 mx-auto w-full max-w-[520px] pb-10 pr-2 lg:order-1 sm:pb-14">
                  <Image
                    src="/images/plate-makobot.png"
                    alt="Machined aluminum cube engraved with navy circuit traces, photographed on an engineering drawing"
                    width={1264}
                    height={848}
                    className="w-full rounded-xl border border-[#d3dae2]"
                  />
                  <div className="absolute -bottom-2 -right-2 sm:bottom-0 sm:right-0">
                    <MakoBotWindow />
                  </div>
                </div>

                <div className="order-1 lg:order-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="steel-text font-display text-6xl font-bold tracking-tight sm:text-7xl">
                      MB-02
                    </span>
                    <span className="mono-tag inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2.5 py-0.5 text-[#10B981]">
                      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#10B981]" />
                      In production
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-3xl font-bold text-[#111b26] sm:text-4xl">
                    MakoBot
                  </h3>
                  <p className="mt-2 text-lg font-semibold text-[#0061aa]">
                    Your local AI workbench.
                  </p>
                  <dl className="mt-6">
                    <SpecRow k="Class" v="AI memory + workbench" />
                    <SpecRow k="Memory" v="One cross-project brain, auto-injected into every AI tool you use" />
                    <SpecRow k="Plug-ins" v="@verify · @audit · @codereview — second opinions from GPT, Claude, and Gemini in parallel" />
                    <SpecRow k="Search" v="Every commit, conversation, and note — one bar" />
                    <SpecRow k="Privacy" v="100% local · bring-your-own keys, DPAPI-encrypted" />
                    <SpecRow k="License" v={<strong>Free</strong>} />
                  </dl>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Magnetic>
                      <TrackLink
                        href="https://makobot.com"
                        type="click_app_card"
                        meta={{ source: "catalog", app: "makobot" }}
                        newTab
                        className="btn-machined px-6 py-3 font-semibold"
                      >
                        Visit makobot.com
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </TrackLink>
                    </Magnetic>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#8a95a1]">
                      Win 10/11 · Signed · 100% local
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ───── THE STANDARD ───── */}
      <section id="standard" className="scroll-mt-24 border-y border-[#d7dee6]/80 bg-[#f4f7fa]/80 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="crosshair" aria-hidden="true" />
              <span className="spec-label">// The standard</span>
            </div>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-[#111b26] sm:text-6xl">
              Every release passes the same bench.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-[#4d5a68]">
              Four stamps go on before anything leaves the shop. No exceptions,
              no fine print.
            </p>
          </Reveal>

          <Reveal stagger={0.09} y={36} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                Icon: ShieldCheck,
                title: "Signed",
                body: "Every binary is code-signed by Mako Logics via Azure Trusted Signing. No SmartScreen roulette, no mystery installers.",
              },
              {
                Icon: Lock,
                title: "On-device",
                body: "Your screen, your prompts, your files stay on your machine. We don't run servers for your data — there's nothing to breach.",
              },
              {
                Icon: Zap,
                title: "Fast",
                body: "If a feature can't keep up with your thinking, it doesn't ship. Sub-second response is the floor, not the goal.",
              },
              {
                Icon: Scale,
                title: "Fair",
                body: "Prices stated plainly before you pay. Free tiers you can actually use. 30-day money-back, cancel in one click.",
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="plate relative p-7">
                <div className="stamp flex h-16 w-16 items-center justify-center">
                  <Icon className="h-6 w-6 text-[#0061aa]" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-[#111b26]">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#4d5a68]">{body}</p>
                <span className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#aeb9c6]">
                  QC ✓
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ───── COMPANY / PROVENANCE ───── */}
      <section id="company" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="plate relative overflow-hidden p-8 sm:p-12">
              <Screws />
              <div className="grid items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)]">
                <Image
                  src="/images/instrument-badge.png"
                  alt=""
                  aria-hidden="true"
                  width={1024}
                  height={1024}
                  className="hidden w-36 rounded-full border border-[#d3dae2] md:block"
                />
                <div>
                  <div className="spec-label">// Provenance</div>
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#111b26] sm:text-4xl">
                    Machined in Texas.
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#4d5a68]">
                    MakoBytes is the desktop product line of{" "}
                    <a
                      href="https://makologics.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#0061aa] underline-offset-4 transition hover:underline"
                    >
                      Mako Logics LLC
                    </a>{" "}
                    — a small Texas software shop. Small catalog, tight
                    tolerances: we'd rather ship two instruments that feel
                    inevitable than twenty that feel adequate.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative overflow-hidden pb-28 pt-8 sm:pb-36">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <RevealLines
            as="h2"
            className="font-display text-5xl font-bold tracking-tight text-[#111b26] sm:text-7xl"
          >
            <span>Take one</span>
            <span>
              off the <span className="text-[#0061aa]">bench.</span>
            </span>
          </RevealLines>
          <Reveal delay={0.25}>
            <p className="mt-6 text-xl text-[#4d5a68]">
              Both instruments are free to pick up. Neither will slow you down.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Magnetic>
                <TrackLink
                  href="https://pixelcopy.app"
                  type="click_app_card"
                  meta={{ source: "cta", app: "pixelcopy" }}
                  newTab
                  className="btn-machined px-8 py-4 text-lg font-bold"
                >
                  Get PixelCopy
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </TrackLink>
              </Magnetic>
              <Magnetic>
                <TrackLink
                  href="https://makobot.com"
                  type="click_app_card"
                  meta={{ source: "cta", app: "makobot" }}
                  newTab
                  className="btn-ink px-8 py-4 text-lg font-bold"
                >
                  Get MakoBot
                </TrackLink>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───── FOOTER — engineering drawing title block ───── */}
      <footer className="bg-white">
        <div className="ruler-x" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="titleblock grid grid-cols-2 md:grid-cols-6">
            {[
              { k: "Drawn by", v: "MakoBytes" },
              { k: "Unit", v: "Mako Logics LLC", href: "https://makologics.com" },
              { k: "Sheet", v: "1 of 1" },
              { k: "Rev", v: "2026.07" },
              { k: "Scale", v: "1 : 1" },
              { k: "Status", v: "● Released", accent: true },
            ].map(({ k, v, href, accent }, i) => (
              <div
                key={k}
                className={`titleblock-cell border-[#26303b] px-4 py-3 ${i > 0 ? "border-l" : ""} ${i >= 2 ? "max-md:border-t max-md:[&:nth-child(odd)]:border-l-0" : ""} md:border-t-0`}
              >
                <div className="titleblock-key">{k}</div>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm font-semibold text-[#26303b] transition hover:text-[#0061aa]"
                  >
                    {v}
                  </a>
                ) : (
                  <div className={`mt-1 text-sm font-semibold ${accent ? "text-[#10B981]" : "text-[#26303b]"}`}>
                    {v}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <BrandMark size={30} />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6b7684]">
                © 2026 MakoBytes · Desktop software works
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#55606c]">
              <a href="#catalog" className="transition hover:text-[#0061aa]">
                Catalog
              </a>
              <a href="#standard" className="transition hover:text-[#0061aa]">
                The Standard
              </a>
              <a href="/privacy" className="transition hover:text-[#0061aa]">
                Privacy
              </a>
              <a href="/terms" className="transition hover:text-[#0061aa]">
                Terms
              </a>
              <a href="mailto:admin@makobytes.com" className="transition hover:text-[#0061aa]">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
