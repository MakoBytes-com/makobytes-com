import Image from "next/image";
import { TrackLink } from "@/components/admin/track-link";
import ContactForm from "@/components/os/ContactForm";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  Crop,
  Download,
  PenLine,
  ScanText,
  ShieldCheck,
  Type,
  Video,
} from "lucide-react";

/* Server-rendered contents for every MakoOS window. All of this ships
   in the HTML — the desktop is presentation, never a content gate. */

function SpecRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="os-specrow">
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6b7684]">{k}</dt>
      <dd className="text-[14px] leading-relaxed text-[#26303b]">{v}</dd>
    </div>
  );
}

/* ── welcome ── */
export function WelcomeContent() {
  return (
    <div className="p-6">
      <div className="spec-label">Mako Logics LLC — desktop software works</div>
      <h1 className="mt-3 font-display text-[26px] font-bold leading-tight tracking-tight text-[#111b26] sm:text-3xl">
        Software, built like precision instruments.
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[#4d5a68]">
        You&apos;re looking at MakoOS — our whole studio, running as a desktop.
        We build small, sharp Windows apps for people who live in AI
        workflows. Two instruments are installed on this machine; open
        anything, drag it around, poke the shark.
      </p>
      <div className="mt-5 flex flex-wrap gap-2.5">
        <button data-os-open="pixelcopy" className="btn-machined px-4 py-2.5 text-sm font-semibold">
          Open PixelCopy.exe
        </button>
        <button data-os-open="makobot" className="btn-ink px-4 py-2.5 text-sm font-semibold">
          Open MakoBot.exe
        </button>
        <button data-os-open="certificate" className="btn-ink px-4 py-2.5 text-sm font-semibold">
          View signature
        </button>
      </div>
      <div className="mt-5 border-t border-[#e4e9ef] pt-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#8a95a1]">
        Signed binaries · 100% on-device · Windows 10–11 · Est. 2026
      </div>
      <p className="mt-3 text-[12.5px] text-[#8a95a1]">
        Prefer paper?{" "}
        <a href="/sheet" className="font-semibold text-[#0061aa] underline-offset-4 hover:underline">
          Read the spec sheet →
        </a>
      </p>
    </div>
  );
}

/* ── PixelCopy ── */
export function PixelCopyContent() {
  return (
    <div>
      <div className="relative h-24 overflow-hidden border-b border-[#e0e6ed] sm:h-28">
        <Image
          src="/images/plate-pixelcopy.png"
          alt="Machined aluminum camera aperture with a navy anodized iris on an engineering drawing"
          width={1264}
          height={848}
          className="w-full -translate-y-1/4 object-cover"
        />
        <span className="absolute right-3 top-3 rounded-full border border-[#10B981]/40 bg-white/90 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#10B981]">
          PX-01 · in production
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-[#111b26]">PixelCopy</h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#8a95a1]">
            Free + Pro $8/mo
          </span>
        </div>
        <p className="mt-1 text-[15px] font-semibold text-[#0061aa]">
          Capture your Windows screen like a pro.
        </p>

        {/* live-feeling capture demo */}
        <div className="relative mt-4 h-[150px] overflow-hidden rounded-lg border border-[#dbe2ea] bg-[#eef2f7]">
          <div className="absolute left-3 top-3 h-12 w-32 rounded border border-[#dde3ea] bg-white/80" />
          <div className="absolute bottom-6 right-4 h-14 w-28 rounded border border-[#dde3ea] bg-white/70" />
          <div className="absolute left-8 top-7 h-[76px] w-[200px] rounded border-2 border-dashed border-[#0061aa] bg-[#0061aa]/[0.06]">
            <span className="absolute -top-5 left-0 rounded bg-[#26303b] px-1.5 py-0.5 font-mono text-[8.5px] text-white">
              1280 × 720
            </span>
          </div>
          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg border border-[#dbe2ea] bg-white px-2.5 py-1.5 shadow-sm">
            <Crop className="h-3 w-3 text-[#26303b]" aria-hidden="true" />
            <PenLine className="h-3 w-3 text-[#26303b]" aria-hidden="true" />
            <Type className="h-3 w-3 text-[#26303b]" aria-hidden="true" />
            <ScanText className="h-3 w-3 text-[#0061aa]" aria-hidden="true" />
            <span className="h-3.5 w-px bg-[#e2e8ef]" />
            <Video className="h-3 w-3 text-[#26303b]" aria-hidden="true" />
          </div>
          <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded border border-[#d9e6d9] bg-white px-1.5 py-0.5">
            <Check className="h-2.5 w-2.5 text-[#10B981]" aria-hidden="true" />
            <span className="font-mono text-[8.5px] text-[#26303b]">Copied</span>
          </div>
        </div>

        <dl className="mt-4">
          <SpecRow k="Capture" v="Region · Window · Scrolling · Full screen" />
          <SpecRow k="Record" v="MP4 · WebM · GIF, with pause/resume" />
          <SpecRow k="Extract" v="OCR any region straight to your clipboard" />
          <SpecRow k="Annotate" v="Crop, arrows, text, counter, spotlight, blur" />
          <SpecRow k="Privacy" v="Captures stay local; cloud share links are opt-in" />
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <TrackLink
            href="https://pixelcopy.app"
            type="click_app_card"
            meta={{ source: "os_window", app: "pixelcopy" }}
            newTab
            className="btn-machined px-5 py-2.5 text-sm font-semibold"
          >
            Get it at pixelcopy.app
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </TrackLink>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a95a1]">
            Win 10/11 · Microsoft Store
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── MakoBot ── */
export function MakoBotContent() {
  return (
    <div>
      <div className="relative h-24 overflow-hidden border-b border-[#e0e6ed] sm:h-28">
        <Image
          src="/images/makobot-hero.jpg"
          alt="MakoBot — the little robot with a glowing circuit brain, surrounded by the AI tools it gives shared memory to"
          width={1280}
          height={720}
          className="h-full w-full object-cover object-[center_32%]"
        />
        <span className="absolute right-3 top-3 rounded-full border border-[#10B981]/40 bg-white/90 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#10B981]">
          MB-02 · in production
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-[#111b26]">MakoBot</h2>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#8a95a1]">Free</span>
        </div>
        <p className="mt-1 text-[15px] font-semibold text-[#0061aa]">Your local AI workbench.</p>

        {/* memory demo */}
        <div className="mt-4 space-y-1.5 rounded-lg border border-[#dbe2ea] bg-white p-2.5">
          <div className="rounded border border-[#e4e9ef] bg-[#f8fafc] px-2 py-1.5">
            <div className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-[#96a1ad]">
              Today · your project
            </div>
            <div className="font-mono text-[10.5px] text-[#26303b]">every AI tool now shares one memory ✓</div>
          </div>
          <div className="rounded border border-[#cfe0f0] bg-[#e6f0f9] px-2 py-1.5 font-mono text-[10.5px] text-[#004d88]">
            @verify → GPT ✓ · Gemini ✓ · Claude ✓
          </div>
          <div className="flex items-center justify-between rounded border border-[#d3dae2] px-2 py-1.5">
            <span className="font-mono text-[10.5px] text-[#96a1ad]">Search every project…</span>
            <span className="rounded border border-[#d3dae2] px-1 font-mono text-[8.5px] text-[#6b7684]">⏎</span>
          </div>
        </div>

        <dl className="mt-4">
          <SpecRow k="Memory" v="One cross-project brain, auto-injected into every AI tool you use" />
          <SpecRow k="Plug-ins" v="@verify · @audit · @codereview — parallel second opinions from GPT, Claude, and Gemini" />
          <SpecRow k="Search" v="Every commit, conversation, and note — one bar" />
          <SpecRow k="Privacy" v="100% local · bring-your-own keys, DPAPI-encrypted" />
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <TrackLink
            href="https://makobot.com"
            type="click_app_card"
            meta={{ source: "os_window", app: "makobot" }}
            newTab
            className="btn-machined px-5 py-2.5 text-sm font-semibold"
          >
            Get it at makobot.com
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </TrackLink>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a95a1]">
            Win 10/11 · 100% local
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── certificate dialog ── */
export function CertificateContent() {
  return (
    <div className="p-6">
      <div className="flex items-start gap-4">
        <div className="stamp flex h-16 w-16 shrink-0 items-center justify-center">
          <ShieldCheck className="h-7 w-7 text-[#0061aa]" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-[#111b26]">
            This catalog is digitally signed.
          </h2>
          <p className="mt-1 flex items-center gap-1.5 text-[13.5px] font-semibold text-[#10B981]">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Signature valid
          </p>
        </div>
      </div>
      <dl className="mt-5">
        <SpecRow k="Signer" v="Mako Logics LLC" />
        <SpecRow k="Method" v="Microsoft Azure Trusted Signing" />
        <SpecRow k="Coverage" v="Every binary we ship — apps and installers" />
        <SpecRow k="Means" v="No SmartScreen roulette, no mystery installers, provenance you can check" />
      </dl>
      <div className="mt-4 rounded-lg border border-[#e0e6ed] bg-[#f6f8fb] p-4">
        <div className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#6b7684]">
          Extensions — the MakoBytes standard
        </div>
        <ul className="mt-2.5 space-y-1.5 text-[13.5px] text-[#26303b]">
          {[
            "On-device: your files never touch our servers — we don't run any",
            "Fast: sub-second response is the floor, not the goal",
            "Fair: prices stated plainly, 30-day money-back, one-click cancel",
            "No telemetry: we can't see you use the apps, and we like it that way",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── README.md ── */
export function ReadmeContent() {
  return (
    <div className="p-6 text-[14.5px] leading-relaxed text-[#26303b]">
      <div className="font-mono text-[13px] font-bold text-[#0061aa]"># MakoBytes</div>
      <p className="mt-3">
        MakoBytes is the desktop product line of{" "}
        <a
          href="https://makologics.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#0061aa] underline-offset-4 hover:underline"
        >
          Mako Logics LLC
        </a>{" "}
        — a small software shop in Texas. We build Windows apps the way a
        machine shop builds tools: small catalog, tight tolerances, every
        piece signed before it leaves the bench.
      </p>
      <div className="mt-4 font-mono text-[13px] font-bold text-[#0061aa]">## Why a desktop?</div>
      <p className="mt-2">
        Because that&apos;s what we make. A brochure about desktop software
        felt like selling hammers with a slideshow — so the site is a
        desktop, and the catalog is installed on it. Everything here runs in
        your browser; nothing phones home.
      </p>
      <div className="mt-4 font-mono text-[13px] font-bold text-[#0061aa]">## The rules</div>
      <p className="mt-2">
        Two instruments ship today — a screen-capture studio and an AI
        workbench. We&apos;d rather ship two that feel inevitable than twenty
        that feel adequate. If a feature can&apos;t keep up with your
        thinking, it doesn&apos;t ship.
      </p>
      <div className="mt-4 border-t border-[#e4e9ef] pt-3 font-mono text-[11px] text-[#8a95a1]">
        rev 2026.07 · machined in Texas ·{" "}
        <a href="/sheet" className="text-[#0061aa] hover:underline">
          /sheet
        </a>{" "}
        ·{" "}
        <a href="/privacy" className="text-[#0061aa] hover:underline">
          /privacy
        </a>{" "}
        ·{" "}
        <a href="/terms" className="text-[#0061aa] hover:underline">
          /terms
        </a>
      </div>
    </div>
  );
}

/* ── wallpapers folder ── */
export function WallpapersContent() {
  const items = [
    { file: "wallpaper-mako.png", name: "circuit-mako.png", blurb: "The mako, machined from steel and navy traces." },
    { file: "wallpaper-forge.png", name: "house-mark.png", blurb: "The MakoOS default — brushed navy with the mark." },
  ];
  return (
    <div className="p-6">
      <p className="text-[13.5px] text-[#4d5a68]">
        Free wallpapers from the shop floor. Take them — no email address,
        no watermark, no catch.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((w) => (
          <figure key={w.file} className="overflow-hidden rounded-lg border border-[#dbe2ea] bg-white">
            <Image
              src={`/images/${w.file}`}
              alt={w.blurb}
              width={1376}
              height={768}
              className="aspect-video w-full object-cover"
            />
            <figcaption className="p-3">
              <div className="font-mono text-[11px] text-[#26303b]">{w.name}</div>
              <div className="mt-0.5 text-[11.5px] text-[#8a95a1]">{w.blurb}</div>
              <a
                href={`/images/${w.file}`}
                download={w.name}
                className="btn-ink mt-2.5 px-3 py-1.5 text-[12px] font-semibold"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Download PNG
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ── contact composer (real form → /api/contact → Resend) ── */
export function ContactContent() {
  return (
    <div className="relative p-6">
      <ContactForm />
      <p className="mt-3 text-[11.5px] text-[#8a95a1]">
        Prefer your own mail app?{" "}
        <a href="mailto:admin@makobytes.com" className="font-semibold text-[#0061aa] underline-offset-4 hover:underline">
          admin@makobytes.com
        </a>
      </p>
    </div>
  );
}
