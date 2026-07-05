import "server-only";
import type { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type Role = "admin" | "editor";

export interface PcSession {
  userId?: string;
  email?: string;
  name?: string;
  role?: Role;
  // Half-authenticated: set after password check for a 2FA-enabled user.
  // The session is NOT trusted until userId is set (via /admin/2fa).
  pendingUserId?: string;
  pendingEmail?: string;
  pendingExpiresAt?: number;
}

let cached: SessionOptions | null = null;

function options(): SessionOptions {
  if (cached) return cached;
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var is not set");
  cached = {
    password: secret,
    cookieName: "mb_session",
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    },
  };
  return cached;
}

export async function getSession() {
  return getIronSession<PcSession>(await cookies(), options());
}
