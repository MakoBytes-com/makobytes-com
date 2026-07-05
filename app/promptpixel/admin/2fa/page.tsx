import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { OtpForm } from "./otp-form";

export const metadata: Metadata = { title: "Two-factor · PromptPixel Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TwoFactorPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/promptpixel/admin" } = await searchParams;
  const session = await getSession();
  if (session.userId) redirect("/promptpixel/admin");
  if (!session.pendingUserId || !session.pendingExpiresAt || session.pendingExpiresAt < Date.now()) redirect("/promptpixel/admin/login");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1220] p-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="mb-2 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B82F6] text-sm font-black text-white">P</div>
          <span className="font-semibold tracking-tight text-white">Two-factor authentication</span>
        </div>
        <p className="mb-6 text-sm text-white/50">Enter the 6-digit code from your authenticator app.</p>
        <OtpForm next={next.startsWith("/promptpixel/admin") ? next : "/promptpixel/admin"} />
        <form action="/promptpixel/admin/2fa/cancel" method="post" className="mt-4">
          <button type="submit" className="w-full text-center text-xs text-white/40 hover:text-white/70">Cancel and return to sign in</button>
        </form>
      </div>
    </main>
  );
}
