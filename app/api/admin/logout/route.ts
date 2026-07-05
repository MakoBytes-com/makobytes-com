import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  session.destroy();
  return NextResponse.redirect(new URL("/promptpixel/admin/login", req.url), 303);
}
export async function GET(req: NextRequest) {
  return POST(req);
}
