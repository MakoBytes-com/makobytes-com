"use client";

import { useEffect, useRef, useState } from "react";

// Cloudflare Turnstile — explicit render, no npm package. Tokens are
// single-use, so the parent remounts this via a key bump after each submit.
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const RENDER_TIMEOUT_MS = 12_000;

type TurnstileGlobal = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileGlobal;
    __pcTurnstileLoading?: boolean;
  }
}

function ensureScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.turnstile) return resolve();
    if (window.__pcTurnstileLoading) {
      const start = Date.now();
      const id = setInterval(() => {
        if (window.turnstile) { clearInterval(id); resolve(); }
        else if (Date.now() - start > RENDER_TIMEOUT_MS) { clearInterval(id); reject(new Error("timeout")); }
      }, 100);
      return;
    }
    window.__pcTurnstileLoading = true;
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("load failed"));
    document.head.appendChild(s);
  });
}

export function TurnstileWidget({ onToken, onExpire }: { onToken: (t: string) => void; onExpire?: () => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const mountRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    ensureScript()
      .then(() => {
        if (cancelled || !window.turnstile || !mountRef.current) return;
        widgetIdRef.current = window.turnstile.render(mountRef.current, {
          sitekey: siteKey,
          theme: "dark",
          appearance: "always",
          callback: (token: string) => { setState("ready"); onToken(token); },
          "expired-callback": () => onExpire?.(),
          "error-callback": () => { setState("error"); onExpire?.(); },
        });
      })
      .catch(() => setState("error"));
    return () => {
      cancelled = true;
      try { if (window.turnstile && widgetIdRef.current) window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) return null;
  return (
    <div>
      <div ref={mountRef} aria-label="Bot protection challenge" />
      {state === "error" && <p className="mt-1 text-xs text-red-400">Verification failed to load — reload the page.</p>}
    </div>
  );
}
