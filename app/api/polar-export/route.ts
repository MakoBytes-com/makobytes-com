import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// TEMPORARY one-shot migration helper: exports Polar license keys + customer
// emails using the production POLAR_API_TOKEN (stored sensitive in Vercel, so
// it can't be read locally). Guarded by POLAR_EXPORT_SECRET; responds 404
// without it. DELETE this route and both Polar env vars once the
// Polar → Stripe license import is finished.
export async function GET(req: NextRequest) {
  const secret = process.env.POLAR_EXPORT_SECRET;
  if (!secret || req.headers.get("x-export-secret") !== secret) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const token = process.env.POLAR_API_TOKEN;
  if (!token) return NextResponse.json({ error: "POLAR_API_TOKEN missing" }, { status: 500 });

  const res = await fetch(
    "https://api.polar.sh/v1/license-keys?organization_id=07f28307-4ad3-4ff2-8985-abaab5a76da8&limit=100",
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (!res.ok) return NextResponse.json({ error: `polar ${res.status}` }, { status: 502 });
  const data = await res.json();

  const out: Array<{ key: string; status: string; email: string | null; created_at: string }> = [];
  for (const it of data.items ?? []) {
    let email: string | null = it.customer?.email ?? null;
    if (!email && it.customer_id) {
      const c = await fetch(`https://api.polar.sh/v1/customers/${it.customer_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (c.ok) email = (await c.json()).email ?? null;
    }
    out.push({ key: it.key, status: it.status, email, created_at: it.created_at });
  }
  return NextResponse.json({ count: out.length, items: out });
}
