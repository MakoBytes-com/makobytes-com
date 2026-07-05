import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/admin";
import { serverSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Rotate an account's license key (old key stops working immediately).
// Body: { licenseKey }  ->  { ok, licenseKey: <new> }
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const licenseKey = String(body?.licenseKey ?? "");
  if (!licenseKey) return NextResponse.json({ ok: false, error: "licenseKey required" }, { status: 400 });

  const newKey = randomUUID();
  const supabase = serverSupabase();
  const { error } = await supabase
    .from("accounts")
    .update({ license_key: newKey, updated_at: new Date().toISOString() })
    .eq("license_key", licenseKey);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, licenseKey: newKey });
}
