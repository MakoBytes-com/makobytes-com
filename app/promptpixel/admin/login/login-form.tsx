"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { loginAction } from "./actions";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="w-full rounded-lg bg-[#3B82F6] py-2.5 font-semibold text-white transition hover:bg-[#1f47a8] disabled:opacity-50"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(loginAction, { error: null as string | null });
  const [token, setToken] = useState("");
  const [epoch, setEpoch] = useState(0);
  const onToken = useCallback((t: string) => setToken(t), []);
  const onExpire = useCallback(() => setToken(""), []);
  const captchaRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const captchaReady = !captchaRequired || token.length > 0;

  useEffect(() => {
    if (state.error) { setToken(""); setEpoch((n) => n + 1); }
  }, [state.error]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {/* honeypot */}
      <div aria-hidden style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="block text-sm text-white/70">
        Email
        <input name="email" type="email" autoComplete="email" required autoFocus
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2.5 text-white outline-none focus:border-[#4b9be6]" />
      </label>
      <label className="block text-sm text-white/70">
        Password
        <input name="password" type="password" autoComplete="current-password" required
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2.5 text-white outline-none focus:border-[#4b9be6]" />
      </label>

      {captchaRequired && (
        <>
          <input type="hidden" name="cf-turnstile-response" value={token} />
          <TurnstileWidget key={epoch} onToken={onToken} onExpire={onExpire} />
        </>
      )}

      {state.error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</p>}

      <SubmitButton disabled={!captchaReady} />
    </form>
  );
}
