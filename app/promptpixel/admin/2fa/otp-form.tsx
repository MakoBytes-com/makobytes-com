"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { verifyOtpAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full rounded-lg bg-[#3B82F6] py-2.5 font-semibold text-white transition hover:bg-[#1f47a8] disabled:opacity-50">
      {pending ? "Verifying…" : "Verify"}
    </button>
  );
}

export function OtpForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(verifyOtpAction, { error: null as string | null });
  const [recovery, setRecovery] = useState(false);
  const [token, setToken] = useState("");
  const [epoch, setEpoch] = useState(0);
  const onToken = useCallback((t: string) => setToken(t), []);
  const captchaRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  useEffect(() => { if (state.error) { setToken(""); setEpoch((n) => n + 1); } }, [state.error]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="use_recovery" value={recovery ? "1" : "0"} />

      <label className="block text-sm text-white/70">
        {recovery ? "Recovery code" : "Authenticator code"}
        <input
          name="code"
          inputMode={recovery ? "text" : "numeric"}
          autoComplete="one-time-code"
          placeholder={recovery ? "xxxxx-xxxxx" : "123456"}
          required
          autoFocus
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2.5 text-center font-mono tracking-widest text-white outline-none focus:border-[#4b9be6]"
        />
      </label>

      {captchaRequired && (
        <>
          <input type="hidden" name="cf-turnstile-response" value={token} />
          <TurnstileWidget key={epoch} onToken={onToken} onExpire={() => setToken("")} />
        </>
      )}

      {state.error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</p>}

      <SubmitButton />

      <button type="button" onClick={() => setRecovery((r) => !r)} className="w-full text-center text-xs text-white/50 hover:text-white/80">
        {recovery ? "Use authenticator code instead" : "Lost your device? Use a recovery code"}
      </button>
    </form>
  );
}
