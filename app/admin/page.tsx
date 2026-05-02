import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn, isAuthConfigured } from "@/auth";
import { AlertCircle, ChromeIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · MakoBytes",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLogin({
  searchParams,
}: {
  // Next 15+: dynamic page-route props (searchParams, params) are now Promises.
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user?.email) {
    redirect("/admin/dashboard");
  }

  const configured = isAuthConfigured();
  const { error } = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-ink-950 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-blue/10 blur-[150px]" />

      <div className="relative w-full max-w-md">
        <div className="glass rounded-2xl p-8 sm:p-10">
          <div className="mono-tag mb-3 text-glow-cyan">// admin access</div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            MakoBytes admin
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Internal dashboard. Sign in with an authorized Google account.
          </p>

          {!configured ? (
            <div className="mt-6 rounded-lg border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm leading-relaxed text-yellow-200/90">
              <div className="mono-tag mb-1.5 text-yellow-400">
                // setup required
              </div>
              Google OAuth is not configured on this Vercel deployment. Set{" "}
              <span className="mono-tag text-white">AUTH_GOOGLE_ID</span>,{" "}
              <span className="mono-tag text-white">AUTH_GOOGLE_SECRET</span>,{" "}
              <span className="mono-tag text-white">AUTH_SECRET</span>, and{" "}
              <span className="mono-tag text-white">ADMIN_ALLOWED_EMAILS</span>{" "}
              under Project Settings → Environment Variables, then redeploy.
            </div>
          ) : (
            <>
              {error && (
                <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    {error === "AccessDenied" ? (
                      <>
                        That Google account is not on the admin allowlist.
                        Contact the site owner if you should have access.
                      </>
                    ) : (
                      <>Sign-in failed. Please try again.</>
                    )}
                  </div>
                </div>
              )}

              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/admin/dashboard" });
                }}
                className="mt-6"
              >
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 py-3.5 font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Sign in with Google
                </button>
              </form>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-white/40">
                Only Google accounts on the admin allowlist can sign in.
                Everyone else is bounced.
              </p>
            </>
          )}
        </div>

        <div className="mono-tag mt-6 text-center text-[10px] text-white/30">
          makobytes · admin v1
        </div>
      </div>
    </main>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
