import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in · PromptPixel Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reset?: string }> }) {
  const { next = "/promptpixel/admin", reset } = await searchParams;
  const session = await getSession();
  if (session.userId) redirect("/promptpixel/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1220] p-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B82F6] text-sm font-black text-white">P</div>
          <span className="font-semibold tracking-tight text-white">PromptPixel Admin</span>
        </div>
        {reset === "ok" && (
          <p className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            Password updated. Sign in with your new password.
          </p>
        )}
        <LoginForm next={next.startsWith("/promptpixel/admin") ? next : "/promptpixel/admin"} />
      </div>
    </main>
  );
}
