"use client";

import { useState } from "react";

export type ErrorRow = {
  id: string;
  source: string | null;
  context: string | null;
  message: string | null;
  stack: string | null;
  created_at: string;
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function ErrorsManager({ initial }: { initial: ErrorRow[] }) {
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function call(body: object) {
    const res = await fetch("/api/admin/errors", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json().catch(() => ({ ok: false }));
  }

  async function dismiss(id: string) {
    setBusy(id);
    const r = await call({ id });
    if (r.ok) setRows((rs) => rs.filter((x) => x.id !== id));
    setBusy(null);
  }

  async function clearAll() {
    if (!confirm(`Clear all ${rows.length} error${rows.length === 1 ? "" : "s"}? This can't be undone.`)) return;
    setBusy("__all__");
    const r = await call({ all: true });
    if (r.ok) setRows([]);
    setBusy(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black">Errors</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/50">last {rows.length}</span>
          {rows.length > 0 && (
            <button
              onClick={clearAll}
              disabled={busy === "__all__"}
              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
            >
              {busy === "__all__" ? "Clearing…" : "Clear all"}
            </button>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] py-16 text-center text-white/40">Nothing broken. 🎉</div>
      ) : (
        <div className="space-y-2">
          {rows.map((e) => (
            <details key={e.id} className="group rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-amber-400">{e.source} · {e.context}</span>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-white/40">{fmt(e.created_at)}</span>
                    <button
                      onClick={(ev) => { ev.preventDefault(); dismiss(e.id); }}
                      disabled={busy === e.id}
                      aria-label="Dismiss this error"
                      title="Dismiss"
                      className="rounded border border-white/15 px-2 py-0.5 text-xs text-white/60 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p className="mt-1 truncate text-sm text-white/80">{e.message}</p>
              </summary>
              {e.stack && (
                <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-black/40 p-3 text-xs text-white/60">{e.stack}</pre>
              )}
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
