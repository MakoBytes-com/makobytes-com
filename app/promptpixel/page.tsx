import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Camera,
  Mic,
  ScanText,
  Keyboard,
  Bell,
  History,
  Lock,
  Zap,
  Plus,
  Wand2,
  MousePointerClick,
  Crown,
  LayoutList,
  Save,
} from "lucide-react";
import { PromptPixelDemo } from "@/components/blocks/promptpixel-demo";
import { TrackPageView } from "@/components/admin/track-pageview";
import { TrackLink } from "@/components/admin/track-link";

export const metadata: Metadata = {
  // Layout's title.template appends "| MakoBytes" automatically — don't
  // include it here or the rendered <title> doubles the suffix.
  title: "PromptPixel — Vision MCP for AI agents.",
  description:
    "Hit a hotkey. Claude (or any MCP-aware AI) sees your screen and answers — no pasting, no clicking. Vision MCP for Windows. Free tier; Pro $25 one-time.",
  alternates: { canonical: "https://makobytes.com/promptpixel" },
  openGraph: {
    type: "website",
    url: "https://makobytes.com/promptpixel",
    title: "PromptPixel — Give your AI eyes.",
    description:
      "PromptPixel ships an MCP server that lets Claude Code, Claude Desktop, Cursor, and other MCP-aware AIs see your screen on a hotkey. Auto-configured. No clipboard pasting.",
    siteName: "MakoBytes",
  },
};

// ───── brand mark — small navy/white camera mark ─────
function BrandMark() {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#0061aa] shadow-[0_4px_12px_rgba(0,97,170,0.3)]">
      <Camera className="h-4 w-4 text-white" strokeWidth={2.5} />
    </div>
  );
}

export default function PromptPixelPage() {
  return (
    <main className="relative min-h-screen bg-white text-[#333333]">
      <TrackPageView type="pageview_promptpixel" page="/promptpixel" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "PromptPixel",
            description:
              "Windows tray app + bundled MCP server. Hit a hotkey, your AI sees your screen and responds — Claude calls a look() tool that delivers the image into its reply. Auto-configures with Claude Code, Claude Desktop, and Cursor. Free tier; Pro $25 one-time.",
            url: "https://makobytes.com/promptpixel",
            applicationCategory: "ProductivityApplication",
            operatingSystem: "Windows 10, Windows 11",
            softwareVersion: "3.0.8",
            author: {
              "@type": "Organization",
              name: "MakoBytes",
              url: "https://makobytes.com",
            },
            offers: [
              {
                "@type": "Offer",
                name: "PromptPixel Free",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer",
                name: "PromptPixel Pro",
                price: "25.00",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                priceValidUntil: "2027-12-31",
              },
            ],
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
            <BrandMark />
            <span className="text-lg font-bold tracking-tight text-[#333333]">
              PromptPixel
            </span>
            <span className="mono-tag hidden text-[10px] text-[#999999] sm:inline">
              by makobytes
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-[#777777] md:flex">
            <Link
              href="/"
              className="flex items-center gap-1.5 transition hover:text-[#333333]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              MakoBytes
            </Link>
            <a href="#how" className="transition hover:text-[#333333]">
              How it works
            </a>
            <a href="#features" className="transition hover:text-[#333333]">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-[#333333]">
              Pricing
            </a>
            <a href="#faq" className="transition hover:text-[#333333]">
              FAQ
            </a>
          </div>
          <TrackLink
            href="https://github.com/MakoBytes-com/PromptPixel/releases/latest/download/PromptPixel-Setup.exe"
            type="click_download"
            meta={{ source: "nav" }}
            className="inline-flex items-center px-5 py-2 rounded-lg bg-[#0061aa] hover:bg-[#004d88] text-white text-sm font-semibold transition-colors"
          >
            Download free
          </TrackLink>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section
        id="top"
        className="relative min-h-screen w-full overflow-hidden pt-16"
      >
        <div className="pointer-events-none absolute inset-0 z-0 grid-overlay opacity-50" />
        <div className="pointer-events-none absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-[#0061aa]/[0.08] blur-[160px]" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 lg:grid-cols-2 lg:gap-8 lg:py-0">
          {/* LEFT — text */}
          <div className="relative z-20 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dbdbdb] bg-[#f8f9fb] px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-[#10B981]" />
              <span className="mono-tag text-[#555555]">
                v3.0.8 · windows · vision mcp
              </span>
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-[#333333] sm:text-6xl lg:text-7xl">
              <span className="text-gradient">Give your AI</span>
              <br />
              <span className="text-gradient">eyes.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-[#555555] sm:text-lg">
              Hit a hotkey. Claude calls a <span className="mono-tag text-[#0061aa]">look()</span> tool
              and the image lands in its reply. No pasting, no clicking the chat,
              no cursor focus. PromptPixel ships its own MCP server and
              auto-configures with Claude Code, Claude Desktop, and Cursor.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <TrackLink
                href="https://github.com/MakoBytes-com/PromptPixel/releases/latest/download/PromptPixel-Setup.exe"
                type="click_download"
                meta={{ source: "hero" }}
                className="btn-glow flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold"
              >
                Download free for Windows
                <ArrowRight className="h-4 w-4" />
              </TrackLink>
              <a
                href="#how"
                className="flex items-center gap-2 rounded-xl border border-[#dbdbdb] bg-white px-6 py-3.5 font-semibold text-[#555555] transition hover:border-[#777777] hover:text-[#333333]"
              >
                How it works
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#777777]">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#10B981]" strokeWidth={3} />
                free forever
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#10B981]" strokeWidth={3} />
                pro: $25 perpetual license
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#10B981]" strokeWidth={3} />
                12 months of updates
              </span>
            </div>
          </div>

          {/* RIGHT — auto-playing demo of the real app */}
          <div className="relative w-full">
            <PromptPixelDemo />
          </div>
        </div>
      </section>

      {/* ───── TRUST ROW ───── */}
      <section className="border-y border-[#dbdbdb]/50 bg-[#eef2f7] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mono-tag mb-8 text-center text-[#777777]">
            auto-configures with these mcp-aware ai clients
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-[#555555] md:gap-14">
            {[
              "Claude Code",
              "Claude Desktop",
              "Cursor",
              "Antigravity",
              "Cline",
              "Continue",
            ].map((n) => (
              <span
                key={n}
                className="text-xl font-bold transition hover:text-[#0061aa]"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how" className="relative scroll-mt-20 py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-20 text-center">
            <div className="mono-tag mb-4 text-[#0061aa]">// workflow</div>
            <h2 className="mb-4 text-4xl font-black tracking-tight text-[#333333] sm:text-6xl">
              <span className="text-gradient">Install. Hit a hotkey. The AI sees.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#555555]">
              Three steps total. One of them is <em>install</em>. PromptPixel
              auto-registers its MCP server with your AI client on first launch
              — no <span className="mono-tag text-[#0061aa]">claude mcp add</span> step,
              no JSON to edit.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "step_01",
                title: "Install PromptPixel",
                body: "Run the signed installer. It places the tray app + the bundled MCP server on disk and writes the server path into Claude Code's, Claude Desktop's, and Cursor's MCP configs automatically. Open a new chat in any of them and the look() tool is just there.",
                Icon: Save,
              },
              {
                step: "step_02",
                title: "Press a look hotkey",
                body: (
                  <>
                    From any app, anywhere on screen. Default{" "}
                    <span className="mono-tag text-[#0061aa]">
                      Ctrl + Shift + Alt + L
                    </span>{" "}
                    drags a region. <span className="mono-tag text-[#0061aa]">Ctrl + Alt + L</span>{" "}
                    grabs the chosen monitor. PromptPixel finds your AI chat
                    window, types a trigger phrase, presses Enter.
                  </>
                ),
                Icon: Keyboard,
              },
              {
                step: "step_03",
                title: "The AI sees your screen",
                body: (
                  <>
                    Claude calls the <span className="mono-tag text-[#0061aa]">look()</span>{" "}
                    tool, the MCP server returns the image, and it lands in
                    the reply. No pasting, no clipboard juggling, no cursor
                    focus, no prep step.
                  </>
                ),
                Icon: Zap,
              },
            ].map(({ step, title, body, Icon }) => (
              <div key={step} className="group feature-card p-8">
                <div className="mono-tag mb-6 text-[#0061aa]">{step}</div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#0061aa]/20 bg-[#e6f0f9]">
                  <Icon className="h-7 w-7 text-[#0061aa]" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-[#333333]">{title}</h3>
                <p className="leading-relaxed text-[#555555]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FREE FEATURES ───── */}
      <section
        id="features"
        className="relative scroll-mt-20 overflow-hidden border-y border-[#dbdbdb]/50 bg-[#eef2f7] py-32"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#0061aa]/[0.08] blur-[150px]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <div className="mono-tag mb-4 text-[#0061aa]">// free tier</div>
            <h2 className="mb-4 text-4xl font-black tracking-tight text-[#333333] sm:text-6xl">
              <span className="text-gradient">Free, forever, no catch.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#555555]">
              The basic capture-to-clipboard workflow stays free for everyone.
              The Vision MCP features are Pro — try them on a 14-day trial.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                Icon: Keyboard,
                title: "Custom hotkeys",
                body: "Bind any combo for capture-to-clipboard, region select, or markup. Reserved keys (Ctrl+V, etc.) are blocked so you can't break Windows.",
              },
              {
                Icon: Camera,
                title: "Capture → clipboard",
                body: "Drag a region, image goes to your clipboard. Paste with Ctrl+V into anything — emails, docs, chats, Slack. Industry-standard snipping flow.",
              },
              {
                Icon: Wand2,
                title: "Markup editor",
                body: "Annotate any capture with arrow, rectangle, text, highlighter, pen, and blur (for redacting passwords or PII). Save to file, or copy to clipboard.",
              },
              {
                Icon: LayoutList,
                title: "Multi-monitor support",
                body: "Pick which monitor look hotkeys capture, or follow the cursor. An Identify Monitors button flashes a giant number on each display so you know which is which.",
              },
              {
                Icon: History,
                title: "Capture history",
                body: "Your recent captures stay in a clickable grid — view, edit, copy, or delete. Free keeps the last 3; Pro raises the cap to 50.",
              },
              {
                Icon: Lock,
                title: "Stays on your machine",
                body: "PromptPixel uses Windows-native APIs and a local stdio MCP server — no third-party services, no cloud uploads, no telemetry. Your screen never leaves your PC.",
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="feature-card p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-[#0061aa]/20 bg-[#e6f0f9]">
                  <Icon className="h-5 w-5 text-[#0061aa]" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#333333]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#555555]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRO FEATURES ───── */}
      <section className="relative py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <div className="mono-tag mb-4 inline-flex items-center gap-1.5 text-[#0061aa]">
              <Crown className="h-3.5 w-3.5" />
              // pro tier
            </div>
            <h2 className="mb-4 text-4xl font-black tracking-tight text-[#333333] sm:text-6xl">
              <span className="text-gradient">Vision MCP. One Pro key.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#555555]">
              Pro unlocks the parts that turn PromptPixel from a snipping tool
              into a full vision pipeline for your AI agents.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                Icon: Zap,
                title: "Look — Region",
                hotkey: "Ctrl + Shift + Alt + L",
                body: "Drag a box around what you want me to see. PromptPixel saves the image, finds your AI chat window, types a trigger phrase, presses Enter. Claude calls look() and the image lands in its reply. Zero clipboard pasting.",
              },
              {
                Icon: Camera,
                title: "Look — Full Screen",
                hotkey: "Ctrl + Alt + L",
                body: "Capture the chosen monitor and auto-push to your AI chat. Same auto-trigger as Look — Region but no drag step. Multi-monitor select lets you lock which display gets captured (or follow the cursor).",
              },
              {
                Icon: Wand2,
                title: "Markup → AI",
                hotkey: "Ctrl + Shift + Alt + E",
                body: "Drag a region, annotate with arrow / box / text / highlight / blur, click Send. The annotated image gets pushed to your AI like Look — Region. Free users keep markup-to-clipboard; Pro adds the AI push.",
              },
              {
                Icon: LayoutList,
                title: "Pick a prompt",
                hotkey: "Ctrl + Alt + P",
                body: "Drag a region, then a popup shows your saved prompts. Click one and that prompt becomes the question Claude answers — \"What's wrong here?\", \"Find the bug\", \"Describe what I'm looking at\", whatever you've configured.",
              },
              {
                Icon: ScanText,
                title: "Configurable trigger phrases",
                hotkey: "settings",
                body: "What gets typed into your AI chat when a look hotkey fires is fully editable. Default forces Claude to call the look() tool; tune it for other models or workflows. The picker prefix is separately configurable.",
              },
              {
                Icon: Save,
                title: "Auto-save backups",
                hotkey: "always on",
                body: "Every capture saved as a timestamped PNG to a folder of your choice. Default Pictures\\PromptPixel; pick your own. Separate from the rotating capture history (which Pro also raises from 3 to 50 items).",
              },
            ].map(({ Icon, title, hotkey, body }) => (
              <div
                key={title}
                className="group relative feature-card p-8"
              >
                <div className="mono-tag absolute right-6 top-6 inline-flex items-center gap-1 rounded-full border border-[#0061aa]/30 bg-[#e6f0f9] px-2.5 py-0.5 text-[10px] text-[#0061aa]">
                  <Crown className="h-2.5 w-2.5" />
                  pro
                </div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#0061aa]/20 bg-[#e6f0f9]">
                  <Icon className="h-7 w-7 text-[#0061aa]" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-[#333333]">{title}</h3>
                <div className="mono-tag mb-4 text-[#0061aa]">{hotkey}</div>
                <p className="leading-relaxed text-[#555555]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section
        id="pricing"
        className="relative scroll-mt-20 border-y border-[#dbdbdb]/50 bg-[#eef2f7] py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <div className="mono-tag mb-4 text-[#0061aa]">// pricing</div>
            <h2 className="mb-4 text-4xl font-black tracking-tight text-[#333333] sm:text-6xl">
              <span className="text-gradient">Free or Pro. You pick.</span>
            </h2>
            <p className="text-lg text-[#555555]">
              No subscriptions, ever. Pay once for Pro and own it forever.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {/* FREE */}
            <div className="feature-card p-8 sm:p-10">
              <div className="mono-tag mb-2 text-[#0061aa]">
                // promptpixel_free
              </div>
              <h3 className="text-2xl font-black text-[#333333]">Free</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#333333]">$0</span>
                <span className="text-[#777777]">forever</span>
              </div>
              <p className="mt-4 text-sm text-[#555555]">
                Includes a 14-day Pro trial on every fresh install. After the trial, Free keeps working — no nag screen, no expiry.
              </p>

              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Capture region → clipboard hotkey",
                  "Markup editor (arrow, text, highlighter, blur)",
                  "Multi-monitor select + Identify Monitors",
                  "Capture history (last 3)",
                  "Tray-resident, lightweight",
                  "Auto-update from GitHub releases",
                  "Windows 10/11 native, signed installer",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[#333333]"
                  >
                    <Check
                      className="h-4 w-4 flex-shrink-0 text-[#0061aa]"
                      strokeWidth={3}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                id="download"
                href="https://github.com/MakoBytes-com/PromptPixel/releases/latest/download/PromptPixel-Setup.exe"
                className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dbdbdb] bg-white py-4 font-semibold text-[#333333] transition hover:border-[#0061aa] hover:bg-[#f8f9fb]"
              >
                Download free for Windows
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* PRO */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-[#0061aa]/15 blur-2xl" />
              <div className="relative feature-card border-[#0061aa]/40 p-8 sm:p-10">
                <div className="mb-2 flex items-center justify-between">
                  <div className="mono-tag inline-flex items-center gap-1 text-[#0061aa]">
                    <Crown className="h-3 w-3" />
                    // promptpixel_pro
                  </div>
                  <div className="mono-tag rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-0.5 text-[#10B981]">
                    best value
                  </div>
                </div>
                <h3 className="text-2xl font-black text-[#333333]">Pro</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-[#333333]">$25</span>
                  <span className="text-[#999999] line-through">$49</span>
                  <span className="ml-1 text-[#555555]">perpetual</span>
                </div>
                <p className="mt-4 text-sm text-[#555555]">
                  Buy once. Own this version forever. Updates included for 12
                  months. Try every Pro feature free for 14 days first — every install starts with a full Pro trial.
                </p>

                <ul className="mt-8 space-y-3 text-sm">
                  {[
                    "Everything in Free",
                    "14-day full-Pro trial on first install",
                    "Look — Region (Ctrl+Shift+Alt+L)",
                    "Look — Full Screen (Ctrl+Alt+L)",
                    "Markup → AI auto-push",
                    "Pick a prompt (Ctrl+Alt+P)",
                    "MCP server access",
                    "Auto-save backups (folder you pick)",
                    "Configurable trigger phrases",
                    "Capture history raised to 50",
                    "One key, all your PCs — the license follows your email",
                    "Perpetual license — own this version forever",
                    "12 months of new versions + updates",
                    "Priority email support",
                    "30-day money-back guarantee",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-[#333333]"
                    >
                      <Check
                        className="h-4 w-4 flex-shrink-0 text-[#0061aa]"
                        strokeWidth={3}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <TrackLink
                  href="/promptpixel/buy"
                  type="click_buy"
                  meta={{ source: "pricing_card" }}
                  newTab
                  className="btn-glow mt-10 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold"
                >
                  Buy Pro — $25
                  <ArrowRight className="h-5 w-5" />
                </TrackLink>
                <p className="mono-tag mt-3 text-center text-[#777777]">
                  perpetual license · 12 months of updates · secure Stripe checkout
                </p>
                <p className="mt-1 text-center text-[11px] text-[#999999]">
                  Sales tax added at checkout where applicable.
                </p>
                <p className="mt-3 rounded-lg border border-[#dbdbdb] bg-white p-3 text-center text-[11px] leading-relaxed text-[#555555]">
                  When your update period ends, your version of PromptPixel
                  keeps working{" "}
                  <span className="text-[#333333] font-semibold">forever</span> — every Pro
                  feature, every hotkey, no expiry. Want new versions
                  afterwards? Renew updates for{" "}
                  <span className="text-[#333333] font-semibold">$15/year</span>. Your call.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── PRIVACY CALLOUT ───── */}
      <section className="relative py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="feature-card p-8 sm:p-12">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-[#0061aa]/20 bg-[#e6f0f9]">
                <Lock className="h-8 w-8 text-[#0061aa]" />
              </div>
              <div>
                <div className="mono-tag mb-2 text-[#0061aa]">
                  // privacy by default
                </div>
                <h3 className="mb-3 text-2xl font-bold text-[#333333] sm:text-3xl">
                  Your screen never leaves your machine.
                </h3>
                <p className="leading-relaxed text-[#555555]">
                  PromptPixel uses Windows-native APIs for capture and a local
                  stdio MCP server. No third-party services. No cloud uploads.
                  No telemetry. No account required. The only thing that ever
                  touches the network is the AI chat <em>you</em> push to.
                  There&apos;s also an in-app audit log of every <span className="mono-tag text-[#0061aa]">look()</span>{" "}
                  call so you can see exactly what got sent and when.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section
        id="faq"
        className="scroll-mt-20 border-y border-[#dbdbdb]/50 bg-[#eef2f7] py-32"
      >
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-16 text-center">
            <div className="mono-tag mb-4 text-[#0061aa]">// faq</div>
            <h2 className="text-4xl font-black tracking-tight text-[#333333] sm:text-5xl">
              <span className="text-gradient">Questions?</span>
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "What is Vision MCP and why does it matter?",
                a: "MCP (Model Context Protocol) is the standard Claude and other AI clients use to load external tools. PromptPixel ships its own MCP server that exposes a look() tool. Hit a hotkey on your screen and the AI calls look() — the image lands directly in its reply. No clipboard pasting, no manual upload, no \"see this image\" prep step. The AI sees what you see, on demand.",
              },
              {
                q: "Which AI clients does it work with?",
                a: "Auto-configured: Claude Code (CLI + VS Code extension), Claude Desktop (Mac/Windows), and Cursor — first launch writes the MCP server path into all three configs, no claude mcp add step. Manual setup (one-time, copy a path): Antigravity, Cline, Continue.dev, Goose, and any other MCP-aware client. Not supported: claude.ai web, ChatGPT, and Gemini — those don't load MCP servers. Browser-extension support for those is planned for a later release.",
              },
              {
                q: "What's the difference between Free and Pro?",
                a: "Free gets you the basic snipping flow — drag a region, image goes to your clipboard, paste with Ctrl+V into anything. Markup editor included, multi-monitor select included, history of 3. Pro ($25 one-time) unlocks the Vision MCP features: Look — Region (Ctrl+Shift+Alt+L), Look — Full Screen (Ctrl+Alt+L), Markup-to-AI auto-push, Pick a prompt (Ctrl+Alt+P), the MCP server itself, auto-save backups, configurable trigger phrases, and 50-item history. Every fresh install starts with a 14-day full Pro trial.",
              },
              {
                q: "Is there a free trial of Pro?",
                a: "Yes — every fresh install starts with a 14-day full Pro trial. Every Look hotkey, the picker, the MCP server, auto-save backups, configurable trigger phrases, 50-item history — all unlocked, no credit card. After 14 days the app shows a one-time tray notice and reverts to Free; the basic capture-to-clipboard workflow keeps working forever. No nag popups, no countdown badges, no time bombs. Buy a license whenever you want to unlock Pro again.",
              },
              {
                q: "What are the default hotkeys?",
                a: "Free: Ctrl+Alt+S for capture-to-clipboard. Pro: Ctrl+Shift+Alt+L for Look — Region (drag, AI sees it), Ctrl+Alt+L for Look — Full Screen (chosen monitor, AI sees it), Ctrl+Shift+Alt+E for Markup-to-AI (drag, annotate, AI sees the marked-up image), Ctrl+Alt+P for Pick a prompt (drag region, choose a saved prompt as the question). All five are remappable in Settings.",
              },
              {
                q: "Does PromptPixel send my screenshots anywhere?",
                a: "Never. The MCP server is a local stdio process — it talks to your AI client over a pipe on your own machine. Nothing leaves your PC except whatever your AI client itself sends to its provider, and that's your client's call, not ours. There's an in-app audit log in Settings → AI that logs every look() call (timestamp + image size) so you can see exactly what got delivered.",
              },
              {
                q: "Which operating systems are supported?",
                a: "Windows 10 and Windows 11 right now. macOS support is in active development — Claude Desktop on Mac already loads the same kind of MCP config, so most of the work is the tray app and installer. If you buy Pro on Windows, you'll get the Mac version free the moment it ships.",
              },
              {
                q: "Does it work offline?",
                a: "Capture, history, markup, and the MCP server all run fully offline (Windows APIs + a local stdio process). The AI itself needs internet — that's your AI provider's call, not ours. PromptPixel's only outbound network calls are: license validation against makobytes.com when you activate a key, and GitHub Releases for the auto-updater check (once a day).",
              },
              {
                q: "What if Pro doesn't work for me?",
                a: "30-day money-back guarantee, no forms, no questions. Email admin@makobytes.com and we refund you. Free stays free either way.",
              },
              {
                q: "How does the perpetual license work?",
                a: "Pro is a perpetual license, JetBrains-style. The $25 buys you the current version of PromptPixel — yours to keep, forever, no expiry. Updates and new versions are included for 12 months. After 12 months, your version keeps working with every feature intact; you just stop receiving new versions. Renew for $15/year if you want to keep getting updates. If you don't, the software you bought keeps running indefinitely.",
              },
              {
                q: "What happens after 12 months if I don't renew?",
                a: "Nothing breaks, nothing locks, nothing nags. Your version keeps working exactly as it did the day you bought it — every Pro feature, every hotkey, every saved prompt, the bundled MCP server. The only thing you stop receiving is new versions. Renew later if you want to catch up; stay on your current version forever if you don't.",
              },
              {
                q: "Is the $15/year a subscription?",
                a: "No — it's an optional update renewal, not a subscription. Your software is yours forever the moment you pay $25; the $15/year only buys you new versions. If you stop renewing, the software you bought keeps working forever. Compare with traditional SaaS where stopping payment cuts off access — that never happens here.",
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="group feature-card cursor-pointer p-6"
              >
                <summary className="flex list-none items-center justify-between font-semibold text-[#333333]">
                  {q}
                  <Plus className="h-5 w-5 flex-shrink-0 text-[#0061aa] transition-transform group-open:rotate-45" />
                </summary>
                <p className="mt-4 leading-relaxed text-[#555555]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative overflow-hidden py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0061aa]/[0.08] blur-[150px]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-5xl font-black tracking-tight text-[#333333] sm:text-7xl">
            <span className="text-gradient">Stop tabbing. Start shipping.</span>
          </h2>
          <p className="mb-10 text-xl text-[#555555]">
            Free for Windows. Pro is $25 once, never again.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <TrackLink
              href="https://github.com/MakoBytes-com/PromptPixel/releases/latest/download/PromptPixel-Setup.exe"
              type="click_download"
              meta={{ source: "final_cta" }}
              className="btn-glow inline-flex items-center gap-2 rounded-xl px-10 py-5 text-lg font-bold"
            >
              Download free
              <ArrowRight className="h-5 w-5" />
            </TrackLink>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-[#dbdbdb] bg-white px-10 py-5 text-lg font-bold text-[#555555] transition hover:border-[#777777] hover:text-[#333333]"
            >
              See Pro
            </a>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-[#dbdbdb]/50 bg-[#f8f9fb] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center gap-3">
              <BrandMark />
              <div>
                <div className="font-bold text-[#333333]">PromptPixel</div>
                <div className="mono-tag text-[#999999]">
                  a makobytes product
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-8 text-sm text-[#777777]">
              <Link href="/" className="transition hover:text-[#333333]">
                MakoBytes
              </Link>
              <a href="#how" className="transition hover:text-[#333333]">
                How it works
              </a>
              <a href="#pricing" className="transition hover:text-[#333333]">
                Pricing
              </a>
              <a
                href="mailto:admin@makobytes.com"
                className="transition hover:text-[#333333]"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mono-tag mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#dbdbdb]/50 pt-8 text-[#999999] md:flex-row">
            <div>© 2026 makobytes · v3.0.8 · built by <a href="https://makologics.com" target="_blank" rel="noopener" className="transition hover:text-[#0061aa]">makologics</a></div>
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
