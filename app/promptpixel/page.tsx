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
  title:
    "PromptPixel — One Hotkey. Screenshot to Any AI Chat. | MakoBytes",
  description:
    "Press a hotkey. Drop a screenshot into ChatGPT, Claude, or any AI chat — with your prompt auto-typed alongside it. Free Windows app. Pro unlocks OCR, voice prompts, and multi-target hotkeys.",
  alternates: { canonical: "https://makobytes.com/promptpixel" },
  openGraph: {
    type: "website",
    url: "https://makobytes.com/promptpixel",
    title: "PromptPixel — Screenshot to AI Chat in One Hotkey",
    description:
      "Hotkey-driven screenshot capture that pastes straight into any AI chat with your prompt. Free for Windows. Pro adds OCR, voice, and multi-target hotkeys.",
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
              "Hotkey-driven Windows desktop app that captures a screenshot and pastes it directly into any AI chat with an auto-typed prompt. Free tier available, Pro unlocks OCR, voice prompts, and multi-target hotkeys.",
            url: "https://makobytes.com/promptpixel",
            applicationCategory: "ProductivityApplication",
            operatingSystem: "Windows 10, Windows 11",
            softwareVersion: "2.0.1-alpha",
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
                v2.0.1-alpha · windows · macos coming soon
              </span>
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-[#333333] sm:text-6xl lg:text-7xl">
              <span className="text-gradient">One hotkey.</span>
              <br />
              <span className="text-gradient">Screenshot to AI.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-[#555555] sm:text-lg">
              Press a key. PromptPixel captures your screen, pastes it
              straight into ChatGPT, Claude, or any AI chat — and types your
              prompt alongside it. Hands-free AI workflows.
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
            works with every ai chat you already use
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-[#555555] md:gap-14">
            {[
              "ChatGPT",
              "Claude",
              "Gemini",
              "Perplexity",
              "Copilot",
              "Mistral",
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
              <span className="text-gradient">From screen to AI in one keystroke.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#555555]">
              Set it up once. Forget it forever. PromptPixel lives in your
              system tray and waits for your hotkey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "step_01",
                title: "Bind your hotkey",
                body: (
                  <>
                    Open settings, pick a hotkey combo (default{" "}
                    <span className="mono-tag text-[#0061aa]">
                      Ctrl + Alt + S
                    </span>
                    ), and write a default prompt PromptPixel will type for you
                    — like <em>&quot;explain this&quot;</em> or <em>&quot;what&apos;s wrong here?&quot;</em>.
                  </>
                ),
                Icon: Keyboard,
              },
              {
                step: "step_02",
                title: "Click into your AI chat",
                body: "Open ChatGPT, Claude, Gemini, whatever — and put your cursor in the message input. PromptPixel pastes wherever your cursor is, so it works in every web AI and most desktop ones too.",
                Icon: MousePointerClick,
              },
              {
                step: "step_03",
                title: "Press the hotkey",
                body: "PromptPixel snaps the screen, pastes the image into the chat input, and auto-types your prompt right after it. The AI sees image + prompt instantly. You didn't touch the mouse once.",
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
              Everything you need to wire AI chats into your day-to-day
              keyboard flow. The whole core product, free.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                Icon: Keyboard,
                title: "Custom hotkeys",
                body: "Bind any combo for fullscreen, region, low-res, or markup capture. Reserved keys (Ctrl+V, etc.) are blocked so you can't break Windows.",
              },
              {
                Icon: Camera,
                title: "Four capture modes",
                body: "Fullscreen, drag-a-region, AI-friendly low-res region (Ctrl+Shift+Alt+L), or capture-then-mark-up (Ctrl+Shift+Alt+E).",
              },
              {
                Icon: Wand2,
                title: "Markup editor",
                body: "Annotate captures with arrow, rectangle, text, highlighter, pen, and blur (for redacting passwords or PII). Save to file, or send straight to your AI chat.",
              },
              {
                Icon: Wand2,
                title: "Auto-type a default prompt",
                body: "Set a prompt like 'explain this' once. Every capture pastes the image AND types your prompt right after — perfect for AI chats.",
              },
              {
                Icon: Bell,
                title: "Capture feedback",
                body: "Soft confirmation sound, thumbnail toast preview, and an optional 'confirm before sending' dialog if you want a final check.",
              },
              {
                Icon: History,
                title: "Recent captures",
                body: "Your last 20 captures stay in a clickable grid — view, edit, copy, or delete each one. Pro raises the cap to 50.",
              },
              {
                Icon: Lock,
                title: "Stays on your machine",
                body: "PromptPixel runs entirely on Windows-native APIs. No third-party services. No cloud calls. Your screen never leaves your PC.",
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
              <span className="text-gradient">Five power features. One Pro key.</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#555555]">
              The features that turn PromptPixel from a hotkey into a full
              hands-free AI cockpit.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                Icon: LayoutList,
                title: "Prompt Picker",
                hotkey: "Ctrl + Alt + P",
                body: "Press the picker hotkey and a popup of your saved prompts appears. Pick one, and PromptPixel captures the screen, pastes it, and types your selected prompt — all in one action. Add as many prompts as you want, one per line. Ships with starter prompts like 'Explain this code', 'What's wrong here?', 'Translate to Spanish', and a dozen more.",
              },
              {
                Icon: Save,
                title: "Auto-Save Backups",
                hotkey: "always on",
                body: "Every screenshot is saved as a timestamped PNG to a folder of your choice. Default goes to Pictures\\PromptPixel, or set your own backup folder. Useful when you want a permanent copy of everything you captured — recover, browse, or share later.",
              },
              {
                Icon: ScanText,
                title: "OCR text extraction",
                hotkey: "Ctrl + Alt + T",
                body: "Drag a box around any text on screen. PromptPixel runs Windows OCR on just that region and drops the extracted TEXT on your clipboard — no image, no vision tokens. Great for code blocks, error messages, PDFs, and document text.",
              },
              {
                Icon: Mic,
                title: "Voice to Prompt",
                hotkey: "Ctrl + Alt + V",
                body: "Press the hotkey and speak your prompt. PromptPixel listens with Windows speech recognition, captures the screen when you stop talking, pastes the image, and types your spoken prompt. Hands-free AI, fully local.",
              },
              {
                Icon: Zap,
                title: "Multi-Target Hotkeys",
                hotkey: "Ctrl + Alt + 1/2/3…",
                body: "Bind extra hotkeys to specific pre-set prompts. Ctrl+Alt+1 → 'Explain this code'. Ctrl+Alt+2 → 'What's wrong here?'. Ctrl+Alt+3 → 'Translate to English'. One keystroke, one workflow.",
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
                  "Fullscreen + region capture hotkeys",
                  "Low-res region capture (AI-friendly)",
                  "Markup editor (arrow, text, highlighter, blur)",
                  "Custom auto-type prompt after paste",
                  "Capture feedback (sound, toast, confirm)",
                  "Recent captures (20)",
                  "Tray-resident, lightweight",
                  "Windows 10/11 native",
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
                    "Prompt Picker (Ctrl+Alt+P)",
                    "Auto-Save Backups",
                    "OCR text extraction (Ctrl+Alt+T)",
                    "Voice to Prompt (Ctrl+Alt+V)",
                    "Multi-Target Hotkeys",
                    "Recent captures raised to 50",
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
                  href="https://buy.polar.sh/polar_cl_E6KR5AWAR8BFjXmIIcO9JPaydeVcNXVhdOx4V4JO1yc"
                  type="click_buy"
                  meta={{ source: "pricing_card" }}
                  newTab
                  className="btn-glow mt-10 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold"
                >
                  Buy Pro — $25
                  <ArrowRight className="h-5 w-5" />
                </TrackLink>
                <p className="mono-tag mt-3 text-center text-[#777777]">
                  perpetual license · 12 months of updates
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
                  PromptPixel uses Windows-native APIs for everything — capture,
                  OCR, and speech recognition. No third-party services. No cloud
                  uploads. No telemetry. No account required. The only thing
                  that ever touches the network is the AI chat <em>you</em>{" "}
                  paste into.
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
                q: "What's the difference between Free and Pro?",
                a: "Free gives you the full core workflow — hotkey-driven screenshot capture (fullscreen, region, low-res region, markup-then-send), one auto-type default prompt, capture history of 20, the markup editor (arrow / text / highlighter / blur), and all feedback options. Pro ($25 one-time) unlocks five power features: Prompt Picker (Ctrl+Alt+P), Auto-Save Backups, OCR text extraction (Ctrl+Alt+T), Voice to Prompt (Ctrl+Alt+V), and Multi-Target Hotkeys. Pro also raises the recent-captures cap to 50. Every fresh install gets a 14-day Pro trial, then settles into Free — no nag screen, nothing locks.",
              },
              {
                q: "Is there a free trial of Pro?",
                a: "Yes — every fresh install starts with a 14-day full Pro trial. You get every Pro feature unlocked for two weeks: Prompt Picker, OCR, Voice to Prompt, Multi-Target Hotkeys, and Auto-Save Backups. After 14 days, the app reverts to the Free tier and the Pro features show a one-time tray notice. No nag popups, no countdown badges, no time bombs — Free keeps working exactly as before. Buy a license whenever you want to unlock Pro again.",
              },
              {
                q: "Does it actually work with ChatGPT, Claude, etc?",
                a: "Yes. PromptPixel pastes wherever your cursor is, so it works in any AI chat that accepts an image upload — ChatGPT, Claude, Gemini, Perplexity, Copilot, Mistral, your local LLM web UI, anything. Click into the chat input, press the hotkey, the screenshot pastes and your prompt types right after.",
              },
              {
                q: "Does PromptPixel send my screenshots anywhere?",
                a: "Never. PromptPixel uses Windows-native APIs for capture, OCR, and voice. Nothing touches the network. No telemetry, no analytics, no account required. The only network call ever made is by the AI chat you paste into — and that's your call, not ours.",
              },
              {
                q: "What are the default hotkeys?",
                a: "Free hotkeys: Ctrl+Alt+S for fullscreen capture, Ctrl+Shift+Alt+S for region capture, Ctrl+Shift+Alt+L for low-res region capture (downscaled for AI chats that struggle with large images), and Ctrl+Shift+Alt+E for capture-then-markup (drag a region, annotate with arrow/text/highlighter/blur, then send). Pro hotkeys: Ctrl+Alt+P for Prompt Picker, Ctrl+Alt+T for OCR, Ctrl+Alt+V for voice prompt, plus your own Multi-Target hotkeys. All are customizable in Settings.",
              },
              {
                q: "Which operating systems are supported?",
                a: "Windows 10 and Windows 11 right now. macOS support is in active development — if you buy Pro on Windows, you'll get the Mac version free the moment it ships.",
              },
              {
                q: "Does it work offline?",
                a: "The capture, OCR, and voice features work fully offline since they use built-in Windows APIs. Only the AI chat itself needs internet — and that's the AI provider's problem, not ours.",
              },
              {
                q: "What if Pro doesn't work for me?",
                a: "30-day money-back guarantee, no forms, no questions. Email hello@makobytes.com and we refund you. Free stays free either way.",
              },
              {
                q: "How does the perpetual license work?",
                a: "Pro is a perpetual license, JetBrains-style. The $25 buys you the current version of PromptPixel — yours to keep, forever, no expiry. Updates and new versions are included for 12 months. After 12 months, your version keeps working with every feature intact; you just stop receiving new versions. If you want to keep getting updates, renew for $15/year. If you don't, your software keeps running and nothing changes for you.",
              },
              {
                q: "What happens after 12 months if I don't renew?",
                a: "Nothing breaks, nothing locks, nothing nags. Your current version of PromptPixel keeps working exactly as it did the day you bought it — every Pro feature, every hotkey, every saved prompt. The only thing you stop receiving is new versions. You can renew later if you want to catch up to the latest release, or stay on your current version indefinitely. Many customers will never renew and that's totally fine.",
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
                href="mailto:hello@makobytes.com"
                className="transition hover:text-[#333333]"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mono-tag mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#dbdbdb]/50 pt-8 text-[#999999] md:flex-row">
            <div>© 2026 makobytes · v2.0.1-alpha · built by <a href="https://makologics.com" target="_blank" rel="noopener" className="transition hover:text-[#0061aa]">makologics</a></div>
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
