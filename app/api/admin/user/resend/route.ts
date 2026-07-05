import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { serverSupabase } from "@/lib/supabase";
import { sendLicenseKeyEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Re-send a customer their license key + activation instructions.
// Body: { licenseKey }
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const licenseKey = String(body?.licenseKey ?? "");
  if (!licenseKey) return NextResponse.json({ ok: false, error: "licenseKey required" }, { status: 400 });

  const supabase = serverSupabase();
  const { data: account } = await supabase.from("accounts").select("email").eq("license_key", licenseKey).single();
  if (!account?.email) return NextResponse.json({ ok: false, error: "account not found" }, { status: 404 });

  try {
    await sendLicenseKeyEmail({ to: account.email, licenseKey });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "send failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, email: account.email });
}
