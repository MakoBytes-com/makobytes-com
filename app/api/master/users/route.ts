// Master CP user-summary pull endpoint. Verifies an inbound master JWT and
// returns per-role user counts the fleet dashboard rolls up.
//
// This site has no user system: PromptPixel (and its `accounts` licensing
// table) was retired 2026-07-25, and the catalog pages have no signups. All
// counts are legitimately 0 — not an error.

import { NextResponse, type NextRequest } from "next/server";
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

  return NextResponse.json({
    ok: true,
    counts: { total: 0, active: 0, admins: 0, editors: 0 },
    timestamp: new Date().toISOString(),
  });
}
