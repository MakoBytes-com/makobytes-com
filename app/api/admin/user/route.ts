import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { serverSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH: edit an account (subscription status + paid-through date).
// Body: { licenseKey, subscription_status?, current_period_end? (ISO | null) }
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const licenseKey = String(body?.licenseKey ?? "");
  if (!licenseKey) return NextResponse.json({ ok: false, error: "licenseKey required" }, { status: 400 });

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body?.subscription_status === "string") patch.subscription_status = body.subscription_status;
  if ("current_period_end" in body) patch.current_period_end = body.current_period_end || null;

  const supabase = serverSupabase();
  const { error } = await supabase.from("accounts").update(patch).eq("license_key", licenseKey);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE: remove an account entirely. Body: { licenseKey }
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const licenseKey = String(body?.licenseKey ?? "");
  if (!licenseKey) return NextResponse.json({ ok: false, error: "licenseKey required" }, { status: 400 });

  const supabase = serverSupabase();
  const { error } = await supabase.from("accounts").delete().eq("license_key", licenseKey);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// POST: comp a Pro account by email (grant Pro without payment) or extend.
// Body: { email }
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "valid email required" }, { status: 400 });
  }

  const supabase = serverSupabase();
  // Insert vs. update split so comping an existing Stripe customer doesn't
  // overwrite their source ('stripe' stays 'stripe'; new rows get 'comp').
  const { data: existing } = await supabase.from("accounts").select("license_key").eq("email", email).single();
  if (existing) {
    const { error } = await supabase
      .from("accounts")
      .update({ subscription_status: "active", updated_at: new Date().toISOString() })
      .eq("email", email);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, licenseKey: existing.license_key });
  }
  const { data, error } = await supabase
    .from("accounts")
    .insert({ email, subscription_status: "active", source: "comp" })
    .select("license_key")
    .single();
  if (error || !data) return NextResponse.json({ ok: false, error: error?.message ?? "failed" }, { status: 500 });
  return NextResponse.json({ ok: true, licenseKey: data.license_key });
}
