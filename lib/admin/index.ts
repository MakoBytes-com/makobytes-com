import "server-only";
import { getSession } from "@/lib/auth/session";
import { findUserById, type AdminUser } from "@/lib/auth/users";

// Auth bridge for the PromptPixel admin (iron-session + admin_users in
// Supabase). Note: the site's original /admin (next-auth Google OAuth) is a
// separate system and does not use this module.

/** The fully-authenticated admin (post-2FA) for this request, or null. */
export async function currentAdmin(): Promise<AdminUser | null> {
  const session = await getSession();
  if (!session.userId) return null;
  const user = await findUserById(session.userId);
  if (!user || user.disabledAt) return null;
  return user;
}

export async function isAuthed(): Promise<boolean> {
  return (await currentAdmin()) !== null;
}

/** Guard for admin mutation API routes: null when authed, else a 401 Response. */
export async function requireAdmin(): Promise<Response | null> {
  const { NextResponse } = await import("next/server");
  if (await isAuthed()) return null;
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}
