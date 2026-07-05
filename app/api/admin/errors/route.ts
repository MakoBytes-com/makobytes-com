import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { serverSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A UUID that no real row will ever have — used so a "delete all" still carries
// a WHERE clause (PostgREST refuses an unfiltered DELETE as a safety measure).
const IMPOSSIBLE_ID = "00000000-0000-0000-0000-000000000000";

// DELETE: clear error_events rows.
//   { id }          → dismiss a single error
//   { all: true }   → clear every error
//   { before: ISO } → clear everything logged before a timestamp
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await req.json().catch(() => ({}));
  const supabase = serverSupabase();

  let query = supabase.from("error_events").delete();

  if (typeof body?.id === "string" && body.id) {
    query = query.eq("id", body.id);
  } else if (typeof body?.before === "string" && body.before) {
    query = query.lt("created_at", body.before);
  } else if (body?.all === true) {
    query = query.neq("id", IMPOSSIBLE_ID); // matches all rows
  } else {
    return NextResponse.json({ ok: false, error: "specify id, before, or all" }, { status: 400 });
  }

  const { error } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
