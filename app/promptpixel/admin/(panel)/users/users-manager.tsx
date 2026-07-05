"use client";

import { useState } from "react";
import type { AdminAccount } from "./page";

// One-time purchase: a license is either usable (active) or not
// (refunded / disabled). No renewal dates.
const STATUSES = ["active", "refunded", "disabled"];

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function UsersManager({ initial }: { initial: AdminAccount[] }) {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [compEmail, setCompEmail] = useState("");

  const filtered = rows.filter((r) => r.email.toLowerCase().includes(q.toLowerCase()) || r.license_key.includes(q));

  type ApiResp = { ok?: boolean; error?: string; licenseKey?: string; email?: string };
  async function call(url: string, method: string, body: object): Promise<ApiResp> {
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return res.json().catch(() => ({ ok: false }) as ApiResp);
  }

  async function setStatus(a: AdminAccount, status: string) {
    setBusy(a.license_key);
    const r = await call("/api/admin/user", "PATCH", { licenseKey: a.license_key, subscription_status: status });
    if (r.ok) {
      setRows((rs) => rs.map((x) => (x.license_key === a.license_key ? { ...x, subscription_status: status } : x)));
      setMsg(`${a.email} → ${status}`);
    } else setMsg(r.error ?? "failed");
    setBusy(null);
  }

  async function regenerate(a: AdminAccount) {
    if (!confirm(`Rotate ${a.email}'s license key? Their old key stops working immediately.`)) return;
    setBusy(a.license_key);
    const r = await call("/api/admin/user/regenerate", "POST", { licenseKey: a.license_key });
    if (r.ok && r.licenseKey) {
      const nk = r.licenseKey;
      setRows((rs) => rs.map((x) => (x.license_key === a.license_key ? { ...x, license_key: nk } : x)));
      setMsg(`New key for ${a.email}: ${nk}`);
    } else setMsg(r.error ?? "failed");
    setBusy(null);
  }

  async function resend(a: AdminAccount) {
    setBusy(a.license_key);
    const r = await call("/api/admin/user/resend", "POST", { licenseKey: a.license_key });
    setMsg(r.ok ? `License email sent to ${a.email}` : r.error ?? "failed");
    setBusy(null);
  }

  async function del(a: AdminAccount) {
    if (!confirm(`Delete ${a.email} entirely? This removes their account and license key.`)) return;
    setBusy(a.license_key);
    const r = await call("/api/admin/user", "DELETE", { licenseKey: a.license_key });
    if (r.ok) {
      setRows((rs) => rs.filter((x) => x.license_key !== a.license_key));
      setMsg(`${a.email} deleted`);
    } else setMsg(r.error ?? "failed");
    setBusy(null);
  }

  async function comp() {
    const email = compEmail.trim().toLowerCase();
    if (!email) return;
    const r = await call("/api/admin/user", "POST", { email });
    if (r.ok && r.licenseKey) {
      const nk = r.licenseKey;
      setRows((rs) => {
        const exists = rs.find((x) => x.email === email);
        if (exists) return rs.map((x) => (x.email === email ? { ...x, subscription_status: "active", license_key: nk } : x));
        return [{ email, license_key: nk, subscription_status: "active", source: "comp", stripe_customer_id: null, created_at: new Date().toISOString() }, ...rs];
      });
      setMsg(`Comped Pro for ${email} — key ${nk}`);
      setCompEmail("");
    } else setMsg(r.error ?? "failed");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search email or key…"
          className="w-64 rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2 text-sm text-white outline-none focus:border-[#4b9be6]"
        />
        <div className="ml-auto flex items-center gap-2">
          <input
            value={compEmail}
            onChange={(e) => setCompEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-56 rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2 text-sm text-white outline-none focus:border-[#4b9be6]"
          />
          <button onClick={comp} className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold hover:bg-[#2f6fd6]">Comp Pro</button>
        </div>
      </div>

      {msg && <p className="mb-3 rounded-lg border border-[#4b9be6]/30 bg-[#4b9be6]/10 px-3 py-2 text-sm text-[#9dc9f0] break-all">{msg}</p>}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-white/[0.03] text-left text-white/50">
            <tr>
              <th className="px-3 py-2.5 font-medium">Email</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium">License key</th>
              <th className="px-3 py-2.5 font-medium">Source</th>
              <th className="px-3 py-2.5 font-medium">Joined</th>
              <th className="px-3 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-white/40">No users yet.</td></tr>
            )}
            {filtered.map((a) => (
              <tr key={a.license_key} className="border-t border-white/5 align-middle">
                <td className="px-3 py-2.5">{a.email}</td>
                <td className="px-3 py-2.5">
                  <select
                    aria-label={`License status for ${a.email}`}
                    value={a.subscription_status}
                    onChange={(e) => setStatus(a, e.target.value)}
                    disabled={busy === a.license_key}
                    className="rounded border border-white/15 bg-[#0b1220] px-2 py-1 text-xs text-white"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-white/60">{a.license_key.slice(0, 13)}…</td>
                <td className="px-3 py-2.5 text-white/60">{a.source}</td>
                <td className="px-3 py-2.5 text-white/60">{fmt(a.created_at)}</td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => resend(a)} disabled={busy === a.license_key} className="rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/10">Resend</button>
                    <button onClick={() => regenerate(a)} disabled={busy === a.license_key} className="rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/10">New key</button>
                    <button onClick={() => del(a)} disabled={busy === a.license_key} className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
