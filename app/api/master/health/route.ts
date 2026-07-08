// Master CP health-pull endpoint. Master signs a JWT with scope=health.read
// and fetches this to populate the fleet dashboard's "schema drift / last seen"
// tile. Returns a quick user count so master can flag this client unhealthy if
// the DB is unreachable.

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
    await verifyMasterToken(auth.slice("Bearer ".length).trim(), "health.read");
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "verification failed" },
      { status: 401 },
    );
  }

  try {
    const supabase = serverSupabase();
    // accounts is this app's user/licensing table (PromptPixel). Head count
    // only — no rows fetched.
    const { count, error } = await supabase
      .from("accounts")
      .select("id", { count: "exact", head: true });
    if (error) throw error;

    return NextResponse.json({
      ok: true,
      schema_rev: 1,
      plugin_versions: { admin: "1.0.0" },
      user_count: count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "internal error" },
      { status: 500 },
    );
  }
}
