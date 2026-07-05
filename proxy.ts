import { NextRequest, NextResponse } from "next/server";

// Coarse edge gate for /promptpixel/admin — checks only that the session
// cookie exists (no decryption at the edge). Real enforcement is the (panel)
// layout + per-action guards. Public auth routes are allowed through.
//
// NOTE: the site's original /admin (Google OAuth via next-auth) is a separate
// system and deliberately NOT matched here.
const COOKIE = "mb_session";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/promptpixel/admin")) return NextResponse.next();

  const isPublicAuth =
    pathname === "/promptpixel/admin/login" || pathname.startsWith("/promptpixel/admin/login/") ||
    pathname === "/promptpixel/admin/2fa" || pathname.startsWith("/promptpixel/admin/2fa/");
  if (isPublicAuth) return NextResponse.next();

  const cookie = req.cookies.get(COOKIE);
  if (!cookie?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/promptpixel/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/promptpixel/admin/:path*"] };
