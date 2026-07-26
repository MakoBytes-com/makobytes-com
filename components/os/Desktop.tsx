"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  BadgeCheck,
  Brain,
  FileText,
  Fish,
  Images,
  Mail,
  Minus,
  ShieldCheck,
  Square,
  SquareDashed,
  X,
} from "lucide-react";

/**
 * MakoOS — the site as a running desktop.
 *
 * Window contents are server-rendered ReactNodes passed in from
 * page.tsx, so every word of copy ships in the HTML for crawlers and
 * no-JS visitors (windows are laid out at SSR time; drag/minimize are
 * progressive enhancement). On phones, windows become full-screen
 * sheets via CSS and the top of the z-order is what you see.
 */

export type WinId =
  | "welcome"
  | "pixelcopy"
  | "makobot"
  | "certificate"
  | "readme"
  | "wallpapers"
  | "contact"
  | "privacy"
  | "terms";

type WinState = {
  open: boolean;
  min: boolean;
  max: boolean;
  x: number;
  y: number;
  z: number;
};

type WinDef = {
  id: WinId;
  title: string;
  label: string; // desktop icon label
  w: number;
  x: number;
  y: number;
  icon: ReactNode;
};

const DEFS: WinDef[] = [
  {
    id: "welcome",
    title: "welcome — MakoBytes",
    label: "welcome",
    w: 560,
    x: 148,
    y: 72,
    icon: <SquareDashed className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: "pixelcopy",
    title: "PixelCopy.exe",
    label: "PixelCopy.exe",
    w: 640,
    x: 430,
    y: 110,
    icon: <SquareDashed className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: "makobot",
    title: "MakoBot.exe",
    label: "MakoBot.exe",
    w: 640,
    x: 660,
    y: 170,
    icon: <Brain className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: "certificate",
    title: "catalog.sig — digital signature",
    label: "catalog.sig",
    w: 460,
    x: 320,
    y: 150,
    icon: <BadgeCheck className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: "readme",
    title: "README.md",
    label: "README.md",
    w: 560,
    x: 250,
    y: 100,
    icon: <FileText className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: "wallpapers",
    title: "wallpapers — free downloads",
    label: "wallpapers",
    w: 560,
    x: 380,
    y: 190,
    icon: <Images className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: "contact",
    title: "new message — contact",
    label: "contact.eml",
    w: 470,
    x: 500,
    y: 130,
    icon: <Mail className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: "privacy",
    title: "privacy.txt",
    label: "privacy.txt",
    w: 700,
    x: 300,
    y: 60,
    icon: <FileText className="h-6 w-6" aria-hidden="true" />,
  },
  {
    id: "terms",
    title: "terms.txt",
    label: "terms.txt",
    w: 700,
    x: 340,
    y: 90,
    icon: <FileText className="h-6 w-6" aria-hidden="true" />,
  },
];

/** Windows that don't get a desktop icon (welcome opens itself; the
 *  legal .txt docs live in the start menu, like a real OS). */
const NO_DESKTOP_ICON: WinId[] = ["welcome", "privacy", "terms"];

function buildInitial(initialOpen?: WinId): Record<WinId, WinState> {
  const closed = (id: WinId): WinState => {
    const d = DEFS.find((x) => x.id === id)!;
    return { open: false, min: false, max: false, x: d.x, y: d.y, z: 0 };
  };
  const base: Record<WinId, WinState> = {
    pixelcopy: closed("pixelcopy"),
    makobot: closed("makobot"),
    welcome: closed("welcome"),
    certificate: closed("certificate"),
    readme: closed("readme"),
    wallpapers: closed("wallpapers"),
    contact: closed("contact"),
    privacy: closed("privacy"),
    terms: closed("terms"),
  };
  if (initialOpen && initialOpen !== "welcome") {
    // Document routes (/privacy, /terms): the desktop opens with just
    // that document front and center.
    base[initialOpen] = { ...base[initialOpen], open: true, z: 1 };
    return base;
  }
  // Home: the working desk — products behind, welcome on top.
  base.pixelcopy = { ...base.pixelcopy, open: true, z: 1 };
  base.makobot = { ...base.makobot, open: true, z: 2 };
  base.welcome = { ...base.welcome, open: true, z: 3 };
  return base;
}

const BOOT_LINES = [
  "MAKOBYTES FIRMWARE 26.07 — TEXAS",
  "verifying signatures ...... OK",
  "telemetry ................. NOT FOUND (by design)",
  "mounting catalog .......... 2 instruments",
  "starting desktop",
];

function MakoShark() {
  // The circuit-mako from the wallpaper series, cut out by Higgsfield's
  // background remover. The artwork faces LEFT, so the swim runs
  // right-to-left (see @keyframes mako-cross).
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/images/mako-sprite.png"
      alt=""
      width={260}
      height={100}
      style={{ height: "auto" }}
      draggable={false}
    />
  );
}

export default function Desktop({
  contents,
  initialOpen,
}: {
  contents: Record<WinId, ReactNode>;
  initialOpen?: WinId;
}) {
  const [wins, setWins] = useState<Record<WinId, WinState>>(() => buildInitial(initialOpen));
  const [zTop, setZTop] = useState(3);
  const [startOpen, setStartOpen] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const [toast, setToast] = useState(false);
  const [sharkTrack, setSharkTrack] = useState<number | null>(null);
  const sharkCount = useRef(0);
  const [clock, setClock] = useState<{ t: string; d: string } | null>(null);
  const winRefs = useRef<Partial<Record<WinId, HTMLElement | null>>>({});
  const drag = useRef<{
    id: WinId;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  } | null>(null);

  /* ── boot ── */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("mb_os_booted");
    if (reduced || seen) {
      setBootDone(true);
      return;
    }
    const t = setTimeout(() => {
      setBootDone(true);
      sessionStorage.setItem("mb_os_booted", "1");
    }, 1650);
    return () => clearTimeout(t);
  }, []);

  /* ── signed-toast, once per session ── */
  useEffect(() => {
    if (!bootDone) return;
    if (sessionStorage.getItem("mb_os_toast")) return;
    const show = setTimeout(() => {
      setToast(true);
      sessionStorage.setItem("mb_os_toast", "1");
    }, 4500);
    return () => clearTimeout(show);
  }, [bootDone]);
  useEffect(() => {
    if (!toast) return;
    const hide = setTimeout(() => setToast(false), 8000);
    return () => clearTimeout(hide);
  }, [toast]);

  /* ── tray clock (Central Time, per the house rule) ── */
  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      const t = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        hour: "numeric",
        minute: "2-digit",
      }).format(now);
      const d = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(now);
      setClock({ t: `${t} CT`, d });
    };
    fmt();
    const i = setInterval(fmt, 30_000);
    return () => clearInterval(i);
  }, []);

  /* ── clamp windows into the viewport after mount (small laptops) ── */
  useEffect(() => {
    if (window.innerWidth < 1024) return;
    setWins((prev) => {
      const next = { ...prev };
      for (const def of DEFS) {
        const s = next[def.id];
        const maxX = Math.max(12, window.innerWidth - def.w - 16);
        const maxY = Math.max(12, window.innerHeight - 220);
        next[def.id] = { ...s, x: Math.min(s.x, maxX), y: Math.min(s.y, maxY) };
      }
      return next;
    });
  }, []);

  const focusWin = useCallback(
    (id: WinId) => {
      setZTop((zt) => {
        const nz = zt + 1;
        setWins((prev) => ({ ...prev, [id]: { ...prev[id], z: nz, min: false } }));
        return nz;
      });
    },
    [setWins],
  );

  const openWin = useCallback(
    (id: WinId) => {
      setWins((prev) => ({ ...prev, [id]: { ...prev[id], open: true, min: false } }));
      focusWin(id);
      setStartOpen(false);
    },
    [focusWin],
  );

  const closeWin = (id: WinId) =>
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], open: false, max: false } }));
  const minWin = (id: WinId) =>
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], min: true } }));
  const maxWin = (id: WinId) =>
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], max: !prev[id].max, min: false } }));

  /* ── Escape closes the top window ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (startOpen) {
        setStartOpen(false);
        return;
      }
      const top = (Object.entries(wins) as [WinId, WinState][])
        .filter(([, s]) => s.open && !s.min)
        .sort((a, b) => b[1].z - a[1].z)[0];
      if (top) closeWin(top[0]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [wins, startOpen]);

  /* ── titlebar drag (pointer-fine desktops only) ── */
  const onDragStart = (id: WinId) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const s = wins[id];
    if (s.max) return;
    drag.current = { id, startX: e.clientX, startY: e.clientY, baseX: s.x, baseY: s.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    focusWin(id);
  };
  const onDragMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const el = winRefs.current[d.id];
    if (!el) return;
    const nx = Math.min(
      Math.max(-40, d.baseX + e.clientX - d.startX),
      window.innerWidth - 140,
    );
    const ny = Math.min(
      Math.max(0, d.baseY + e.clientY - d.startY),
      window.innerHeight - 120,
    );
    el.style.left = `${nx}px`;
    el.style.top = `${ny}px`;
  };
  const onDragEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const el = winRefs.current[d.id];
    if (!el) return;
    const nx = parseFloat(el.style.left || "0");
    const ny = parseFloat(el.style.top || "0");
    setWins((prev) => ({ ...prev, [d.id]: { ...prev[d.id], x: nx, y: ny } }));
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  /* ── delegation: server-rendered content can open windows via
        data-os-open="<id>" without being a client component ── */
  const onRootClick = (e: React.MouseEvent) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-os-open]");
    if (t?.dataset.osOpen) openWin(t.dataset.osOpen as WinId);
  };

  const runShark = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      openWin("wallpapers");
      return;
    }
    sharkCount.current += 1;
    setSharkTrack([18, 34, 52, 26][sharkCount.current % 4]);
  };

  const openList = DEFS.filter((d) => wins[d.id].open);
  const topId = openList
    .filter((d) => !wins[d.id].min)
    .sort((a, b) => wins[b.id].z - wins[a.id].z)[0]?.id;

  return (
    <div className="os-root" onClick={onRootClick}>
      {/* ── desktop icons ── */}
      <div className="absolute left-3 top-3 z-[5] grid grid-cols-4 gap-1 sm:left-5 sm:top-5 lg:grid-cols-1">
        {DEFS.filter((d) => !NO_DESKTOP_ICON.includes(d.id)).map((d) => (
          <button key={d.id} className="os-icon" onClick={() => openWin(d.id)}>
            <span className="os-icon-plate">{d.icon}</span>
            <span className="os-icon-label">{d.label}</span>
          </button>
        ))}
        <button className="os-icon" onClick={runShark}>
          <span className="os-icon-plate">
            <Fish className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="os-icon-label">mako.exe</span>
        </button>
      </div>

      {/* ── windows ── */}
      {DEFS.map((d) => {
        const s = wins[d.id];
        if (!s.open) return null;
        return (
          <section
            key={d.id}
            ref={(el) => {
              winRefs.current[d.id] = el;
            }}
            aria-label={d.title}
            className={`os-window ${s.max ? "os-max" : ""}`}
            style={{
              left: s.x,
              top: s.y,
              width: d.w,
              zIndex: 10 + s.z,
              display: s.min ? "none" : undefined,
            }}
            onPointerDown={() => focusWin(d.id)}
          >
            <div
              className="os-titlebar"
              onPointerDown={onDragStart(d.id)}
              onPointerMove={onDragMove}
              onPointerUp={onDragEnd}
              onDoubleClick={() => maxWin(d.id)}
            >
              <span className="text-[#0061aa]">{d.icon}</span>
              <span className="os-title">{d.title}</span>
              <div className="ml-auto flex items-center">
                <button className="os-winbtn" title="Minimize" onClick={() => minWin(d.id)}>
                  <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  className="os-winbtn hidden lg:flex"
                  title={s.max ? "Restore" : "Maximize"}
                  onClick={() => maxWin(d.id)}
                >
                  <Square className="h-3 w-3" aria-hidden="true" />
                </button>
                <button className="os-winbtn os-winbtn-close" title="Close" onClick={() => closeWin(d.id)}>
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="os-winbody">{contents[d.id]}</div>
          </section>
        );
      })}

      {/* ── taskbar ── */}
      <div className="os-taskbar">
        <button
          onClick={() => setStartOpen((v) => !v)}
          aria-expanded={startOpen}
          aria-label="Start menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#0061aa] bg-white text-base font-bold text-[#0061aa] transition hover:scale-105"
        >
          M
        </button>
        <div className="mx-1 hidden h-6 w-px bg-white/15 sm:block" />
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
          {openList.map((d) => {
            const s = wins[d.id];
            return (
              <button
                key={d.id}
                onClick={() => (s.min || topId !== d.id ? openWin(d.id) : minWin(d.id))}
                className={`os-task-btn ${topId === d.id && !s.min ? "is-active" : ""} ${s.min ? "is-min" : ""}`}
              >
                <span className="text-[#66a5db] [&>svg]:h-3.5 [&>svg]:w-3.5">{d.icon}</span>
                <span className="hidden sm:inline">{d.label}</span>
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-3 pr-1">
          <span title="All catalog binaries signed — Mako Logics LLC" className="text-[#10B981]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </span>
          <span
            suppressHydrationWarning
            className="text-right font-mono text-[10.5px] leading-tight text-white/85"
          >
            {clock ? (
              <>
                {clock.t}
                <br />
                {clock.d}
              </>
            ) : (
              "—"
            )}
          </span>
        </div>
      </div>

      {/* ── start menu ── */}
      {startOpen && (
        <>
          <button
            className="fixed inset-0 z-[65] cursor-default"
            aria-label="Close start menu"
            onClick={() => setStartOpen(false)}
          />
          <div className="os-startmenu">
            <div className="os-menu-label">Catalog</div>
            {(["pixelcopy", "makobot"] as WinId[]).map((id) => {
              const d = DEFS.find((x) => x.id === id)!;
              return (
                <button key={id} className="os-menu-item" onClick={() => openWin(id)}>
                  <span className="text-[#66a5db] [&>svg]:h-4 [&>svg]:w-4">{d.icon}</span>
                  {d.label}
                </button>
              );
            })}
            <div className="os-menu-label">Documents</div>
            {(["readme", "certificate", "wallpapers", "contact", "privacy", "terms"] as WinId[]).map(
              (id) => {
                const d = DEFS.find((x) => x.id === id)!;
                return (
                  <button key={id} className="os-menu-item" onClick={() => openWin(id)}>
                    <span className="text-[#66a5db] [&>svg]:h-4 [&>svg]:w-4">{d.icon}</span>
                    {d.label}
                  </button>
                );
              },
            )}
            <div className="os-menu-label">Elsewhere</div>
            <a
              className="os-menu-item"
              href="https://makologics.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BadgeCheck className="h-4 w-4 text-[#66a5db]" aria-hidden="true" />
              Mako Logics LLC ↗
            </a>
          </div>
        </>
      )}

      {/* ── mako.exe ── */}
      {sharkTrack !== null && (
        <div
          className="mako-swim"
          style={{ top: `${sharkTrack}%` }}
          onAnimationEnd={() => setSharkTrack(null)}
        >
          <MakoShark />
        </div>
      )}

      {/* ── signed toast ── */}
      {toast && (
        <div className="os-toast" role="status">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[#26303b]">Signature check complete</div>
            <div className="mt-0.5 text-[12px] leading-snug text-[#55606c]">
              All catalog binaries signed by Mako Logics LLC via Azure Trusted Signing.
            </div>
          </div>
          <button
            className="os-winbtn -mr-1 -mt-1 shrink-0"
            title="Dismiss"
            onClick={() => setToast(false)}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* ── boot ── */}
      <div className={`os-boot ${bootDone ? "is-done" : ""}`} aria-hidden="true">
        <div className="w-[min(420px,86vw)]">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3387cf] text-lg font-bold text-[#3387cf]">
              M
            </span>
            <span className="font-mono text-sm tracking-[0.3em] text-[#9fc3e0]">MAKO OS</span>
          </div>
          <div className="space-y-1.5">
            {BOOT_LINES.map((l, i) => (
              <div key={l} className="os-boot-line" style={{ animationDelay: `${0.15 + i * 0.22}s` }}>
                {l}
              </div>
            ))}
          </div>
          <div className="os-boot-bar mt-6">
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}
