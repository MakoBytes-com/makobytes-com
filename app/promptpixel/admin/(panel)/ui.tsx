export function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-[#3B82F6]/50 bg-[#3B82F6]/10" : "border-white/10 bg-white/[0.03]"}`}>
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-white/40">{sub}</div>}
    </div>
  );
}

export function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">{title}</h2>
        {action}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">{children}</div>
    </section>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    canceled: "bg-white/10 text-white/50 border-white/20",
    past_due: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    inactive: "bg-white/10 text-white/50 border-white/20",
  };
  const cls = map[status] ?? "bg-white/10 text-white/60 border-white/20";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${cls}`}>{status}</span>;
}

export function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
