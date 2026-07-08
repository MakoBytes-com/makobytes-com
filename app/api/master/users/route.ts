// Master CP user-summary pull endpoint. Verifies an inbound master JWT and
// returns per-role user counts the fleet dashboard rolls up.
//
// This app's user table is `accounts` (PromptPixel licensing). It has no role
// column — there is no admin/editor distinction — so admins/editors are
// reported as 0. `active` maps to subscription_status = 'active'.

import { NextResponse, type NextRequest } from "next/server";
import { serverSupabase } from "@/lib/supabase";
import { verifyMasterToken } from "@/lib/master-jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ ok: false, error: "missing bearer token" }, { status: 401 });
  }

  try {
    await verifyMasterToken(auth.slice("Bearer ".length).trim(), "users.read");
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "verification failed" },
      { status: 401 },
    );
  }

  try {
    const supabase = serverSupabase();
    const [totalRes, activeRes] = await Promise.all([
      supabase.from("accounts").select("id", { count: "exact", head: true }),
      supabase
        .from("accounts")
        .select("id", { count: "exact", head: true })
        .eq("subscription_status", "active"),
    ]);
    if (totalRes.error) throw totalRes.error;
    if (activeRes.error) throw activeRes.error;

    return NextResponse.json({
      ok: true,
      counts: {
        total: totalRes.count ?? 0,
        active: activeRes.count ?? 0,
        admins: 0, // no role column on `accounts`
        editors: 0, // no role column on `accounts`
      },
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "internal error" },
      { status: 500 },
    );
  }
}
