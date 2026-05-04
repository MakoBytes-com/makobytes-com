"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

/**
 * PromptPixelDemo
 *
 * Auto-playing "video reel" of the real app screenshots. Each frame:
 *   - Crossfades in from the previous one
 *   - Has a Ken Burns slow-zoom for life
 *   - Shows an animated narration caption beneath
 *   - Advances on a fixed timer (FRAME_DURATION_MS)
 *
 * Hover/focus the player to see play-pause + restart controls.
 * Click anywhere on the player to pause/resume.
 */

type Frame = {
  src: string;
  alt: string;
  chapter: string;
  title: string;
  subtitle: string;
  // Ken Burns end state — slight zoom + drift, keeps image alive
  kenBurns: {
    fromScale: number;
    toScale: number;
    fromX: number;
    toX: number;
    fromY: number;
    toY: number;
  };
};

const FRAME_DURATION_MS = 5200;

const FRAMES: Frame[] = [
  {
    src: "/screenshots/settings-hotkeys.png",
    alt: "Settings — Hotkeys tab with all five configurable hotkey rows",
    chapter: "01 / five configurable hotkeys",
    title: "One key per workflow.",
    subtitle:
      "Capture → clipboard, Look — Region, Look — Full Screen, Markup, and Pick a prompt. Each remappable; reserved combos like Ctrl+V are blocked so nothing collides with Windows.",
    kenBurns: {
      fromScale: 1.0,
      toScale: 1.05,
      fromX: 0,
      toX: 0,
      fromY: -1,
      toY: 1.5,
    },
  },
  {
    src: "/screenshots/settings-capture.png",
    alt: "Settings — Capture tab with monitor selection, image resolution cap, and history folder",
    chapter: "02 / monitor + resolution + history",
    title: "Pick the screen. Pick the size.",
    subtitle:
      "Lock the look-full-screen hotkey to a specific monitor or follow the cursor. Cap image resolution so AI chats stay fast. Set your own history folder.",
    kenBurns: {
      fromScale: 1.04,
      toScale: 1.0,
      fromX: 0,
      toX: 0,
      fromY: -2,
      toY: 0,
    },
  },
  {
    src: "/screenshots/settings-prompts.png",
    alt: "Settings — Prompts tab with a list of saved prompts and Add/Move/Remove buttons",
    chapter: "03 / your prompt library",
    title: "A library of questions, one click away.",
    subtitle:
      "Build a list of saved prompts the picker hotkey shows. \"What is this?\", \"Explain this\", \"Find the bug\" — drag a region, click one, the AI answers that exact question about your screen.",
    kenBurns: {
      fromScale: 1.0,
      toScale: 1.06,
      fromX: 0,
      toX: 0,
      fromY: -2,
      toY: 4,
    },
  },
  {
    src: "/screenshots/settings-ai.png",
    alt: "Settings — AI tab with trigger phrase fields and the MCP audit log",
    chapter: "04 / trigger phrases + audit log",
    title: "Say it your way. Audit every look.",
    subtitle:
      "What gets typed into your AI chat after a hotkey is fully editable. The MCP audit log records every look() call (timestamp + image size) so you see exactly what got sent.",
    kenBurns: {
      fromScale: 1.0,
      toScale: 1.06,
      fromX: 0,
      toX: 0,
      fromY: -2,
      toY: 3,
    },
  },
  {
    src: "/screenshots/settings-setup.png",
    alt: "Settings — Setup tab showing auto-configured AI clients and manual setup instructions",
    chapter: "05 / zero-setup with three AI clients",
    title: "Auto-configures with Claude Code, Claude Desktop, and Cursor.",
    subtitle:
      "First launch writes the bundled MCP server path into all three configs — no claude mcp add, no JSON to edit. Antigravity, Cline, Continue.dev get a one-time copy-paste path with per-client instructions.",
    kenBurns: {
      fromScale: 1.04,
      toScale: 1.0,
      fromX: 0,
      toX: 0,
      fromY: 0,
      toY: 2,
    },
  },
  {
    src: "/screenshots/settings-license.png",
    alt: "Settings — License tab with green ACTIVE Pro license banner",
    chapter: "06 / pro: $25 one-time",
    title: "Pay once. Own it forever.",
    subtitle:
      "Pro is a perpetual license, JetBrains-style. Every fresh install starts with a 14-day full Pro trial. After that, Free keeps working forever; Pro just unlocks the look hotkeys, MCP server, picker, and backups.",
    kenBurns: {
      fromScale: 1.0,
      toScale: 1.05,
      fromX: 0,
      toX: 0,
      fromY: 0,
      toY: 2,
    },
  },
  {
    src: "/screenshots/settings-about.png",
    alt: "Settings — About tab with version, links, and updater controls",
    chapter: "07 / signed + auto-updating",
    title: "Built by Mako Logics LLC. Always current.",
    subtitle:
      "Authenticode-signed installer (no SmartScreen warning). The app checks GitHub Releases once a day and offers updates in the tray. Open the debug log right from Settings if anything misbehaves.",
    kenBurns: {
      fromScale: 1.0,
      toScale: 1.06,
      fromX: 0,
      toX: 0,
      fromY: -2,
      toY: 3,
    },
  },
];

export function PromptPixelDemo({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);

  const frame = FRAMES[index];

  // Animation loop driving progress + auto-advance
  useEffect(() => {
    if (!playing) {
      pausedAtRef.current = progress;
      return;
    }

    startTsRef.current = null;

    const tick = (ts: number) => {
      if (startTsRef.current === null) {
        startTsRef.current = ts - pausedAtRef.current * FRAME_DURATION_MS;
      }
      const elapsed = ts - startTsRef.current;
      const p = Math.min(1, elapsed / FRAME_DURATION_MS);
      setProgress(p);

      if (p >= 1) {
        pausedAtRef.current = 0;
        setProgress(0);
        setIndex((i) => (i + 1) % FRAMES.length);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  // Reset progress whenever the frame index changes
  useEffect(() => {
    pausedAtRef.current = 0;
    setProgress(0);
  }, [index]);

  const goTo = (i: number) => {
    pausedAtRef.current = 0;
    setProgress(0);
    setIndex(i);
  };

  const restart = () => {
    pausedAtRef.current = 0;
    setProgress(0);
    setIndex(0);
    setPlaying(true);
  };

  const togglePlay = () => setPlaying((p) => !p);

  const kb = frame.kenBurns;
  // Lerp Ken Burns from start state to end state across the frame's progress
  const scale = kb.fromScale + (kb.toScale - kb.fromScale) * progress;
  const x = kb.fromX + (kb.toX - kb.fromX) * progress;
  const y = kb.fromY + (kb.toY - kb.fromY) * progress;

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* ambient navy halo behind the player */}
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[#0061aa]/15 blur-2xl" />

      <div className="circuit-border relative rounded-2xl">
        <div className="rounded-2xl bg-white p-1 shadow-[0_20px_60px_rgba(0,97,170,0.15)] border border-[#dbdbdb]">
          {/* window chrome */}
          <div className="relative flex items-center gap-1.5 border-b border-[#dbdbdb] bg-[#f8f9fb] px-4 py-3 rounded-t-2xl">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            <div className="mono-tag ml-4 text-[#777777]">
              promptpixel — v3.0.4 · live demo
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-full bg-[#e6f0f9] px-2.5 py-0.5">
              <div className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#0061aa]" />
              <span className="mono-tag text-[10px] text-[#0061aa]">
                {playing ? "playing" : "paused"}
              </span>
            </div>
          </div>

          {/* viewport */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause demo" : "Play demo"}
            className="group relative block aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#f8f9fb] to-[#eef2f7] sm:aspect-[16/13]"
          >
            <div className="absolute inset-0 grid-overlay opacity-50" />

            {/* Ken Burns image stack — render every frame, fade only the active */}
            {FRAMES.map((f, i) => {
              const isActive = i === index;
              return (
                <div
                  key={`${f.src}-${i}`}
                  className="absolute inset-0 transition-opacity duration-700 ease-out"
                  style={{
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: isActive
                        ? `scale(${scale}) translate(${x}%, ${y}%)`
                        : "scale(1)",
                      transition: "none",
                    }}
                  >
                    <Image
                      src={f.src}
                      alt={f.alt}
                      fill
                      className="object-contain p-4 sm:p-6"
                      sizes="(min-width: 1024px) 700px, 100vw"
                      priority={i === 0}
                    />
                  </div>
                </div>
              );
            })}

            {/* Bottom gradient + caption overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent px-6 pb-6 pt-16">
              <div
                key={`caption-${index}`}
                className="animate-caption mx-auto max-w-xl"
              >
                <div className="mono-tag text-[#0061aa]">{frame.chapter}</div>
                <div className="mt-1 text-xl font-bold text-[#333333] sm:text-2xl">
                  {frame.title}
                </div>
                <div className="mt-1.5 text-sm leading-relaxed text-[#555555] sm:text-base">
                  {frame.subtitle}
                </div>
              </div>
            </div>

            {/* Center play overlay (only visible when paused) */}
            {!playing && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0061aa] shadow-[0_0_60px_rgba(0,97,170,0.5)]">
                  <Play
                    className="h-7 w-7 text-white"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </div>
              </div>
            )}

            {/* Hover-only top-right control buttons */}
            <div className="absolute right-4 top-4 flex gap-2 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  restart();
                }}
                aria-label="Restart demo"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dbdbdb] bg-white text-[#555555] shadow-sm transition hover:border-[#0061aa] hover:text-[#0061aa]"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label={playing ? "Pause" : "Play"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dbdbdb] bg-white text-[#555555] shadow-sm transition hover:border-[#0061aa] hover:text-[#0061aa]"
              >
                {playing ? (
                  <Pause className="h-4 w-4" fill="currentColor" />
                ) : (
                  <Play className="h-4 w-4" fill="currentColor" />
                )}
              </button>
            </div>
          </button>

          {/* Frame chapter dots + progress bar */}
          <div className="border-t border-[#dbdbdb] bg-[#f8f9fb] px-4 py-3 rounded-b-2xl">
            <div className="flex items-center gap-2">
              {FRAMES.map((_, i) => {
                const isActive = i === index;
                const isPast = i < index;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to frame ${i + 1}`}
                    className="group/dot relative h-2 sm:h-1 flex-1 overflow-hidden rounded-full bg-[#dbdbdb] transition hover:bg-[#c1c5cd]"
                  >
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#0061aa] to-[#66a5db]"
                      style={{
                        width: isActive
                          ? `${progress * 100}%`
                          : isPast
                            ? "100%"
                            : "0%",
                        transition: isActive ? "none" : "width 0.3s ease-out",
                      }}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mono-tag mt-2 flex items-center justify-between text-[10px] text-[#999999]">
              <span>
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(FRAMES.length).padStart(2, "0")}
              </span>
              <span>click viewport to {playing ? "pause" : "play"}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes caption-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-caption {
          animation: caption-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
