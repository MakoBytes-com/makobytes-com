import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Keys are UUIDs for Stripe-era purchases, but customers who bought through
// Polar keep their original key format (imported rows, source='polar-import'),
// so accept any sane key-shaped string and let the DB decide.
const KEY_RE = /^[A-Za-z0-9-]{8,64}$/;

// Desktop app activation check: POST {licenseKey} → {valid, email, status}.
// One-time purchase: a license stays valid until refunded or disabled.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const raw = typeof body?.licenseKey === "string" ? body.licenseKey.trim() : "";
    if (!KEY_RE.test(raw)) {
      return NextResponse.json({ valid: false, error: "Malformed license key" }, { status: 400 });
    }

    const supabase = serverSupabase();
    // UUID keys were historically stored lowercase; Polar keys are case-
    // sensitive as issued. Try exact first, then lowercase.
    let { data: account } = await supabase
      .from("accounts")
      .select("email, subscription_status")
      .eq("license_key", raw)
      .single();
    if (!account && raw !== raw.toLowerCase()) {
      ({ data: account } = await supabase
        .from("accounts")
        .select("email, subscription_status")
        .eq("license_key", raw.toLowerCase())
        .single());
    }

    if (!account) return NextResponse.json({ valid: false });

    const active = account.subscription_status === "active";

    return NextResponse.json({
      valid: active,
      email: account.email,
      status: account.subscription_status,
    });
  } catch (e) {
    console.error("license verify error", e);
    return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
  }
}
