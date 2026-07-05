"use client";

import { useActionState, useState } from "react";
import { changePasswordAction, enrollTotpAction, disableTotpAction, regenerateCodesAction } from "./actions";

type Result = { error: string | null; recoveryCodes?: string[]; ok?: boolean };
const initial: Result = { error: null };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">{title}</h2>
      {children}
    </section>
  );
}
const inputCls = "w-full rounded-lg border border-white/15 bg-[#0b1220] px-3 py-2 text-sm text-white outline-none focus:border-[#4b9be6]";
const btnCls = "rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f47a8] disabled:opacity-50";

function Msg({ state, okText }: { state: Result; okText: string }) {
  if (state.error) return <p className="text-sm text-red-300">{state.error}</p>;
  if (state.ok) return <p className="text-sm text-emerald-300">{okText}</p>;
  return null;
}

function RecoveryCodes({ codes }: { codes: string[] }) {
  return (
    <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
      <p className="mb-2 text-xs text-amber-200">Save these recovery codes somewhere safe — each works once, and this is the only time they&apos;re shown.</p>
      <div className="grid grid-cols-2 gap-1 font-mono text-sm text-white">
        {codes.map((c) => <span key={c}>{c}</span>)}
      </div>
    </div>
  );
}

export function SecurityClient({ enrolled, secret, qr, otpAuthUrl, remainingCodes }: {
  enrolled: boolean; secret: string; qr: string; otpAuthUrl: string; remainingCodes: number;
}) {
  const [pw, pwAction] = useActionState(changePasswordAction, initial);
  const [enroll, enrollAction] = useActionState(enrollTotpAction, initial);
  const [disable, disableAction] = useActionState(disableTotpAction, initial);
  const [regen, regenAction] = useActionState(regenerateCodesAction, initial);
  const [showManual, setShowManual] = useState(false);

  return (
    <div>
      <Card title="Change password">
        <form action={pwAction} className="space-y-3">
          <input name="current_password" type="password" placeholder="Current password" autoComplete="current-password" required className={inputCls} />
          <input name="new_password" type="password" placeholder="New password (min 10 chars)" autoComplete="new-password" required className={inputCls} />
          <input name="confirm_password" type="password" placeholder="Confirm new password" autoComplete="new-password" required className={inputCls} />
          <div className="flex items-center gap-3">
            <button type="submit" className={btnCls}>Update password</button>
            <Msg state={pw} okText="Password updated." />
          </div>
        </form>
      </Card>

      {!enrolled ? (
        <Card title="Enable two-factor authentication">
          {enroll.recoveryCodes ? (
            <div>
              <p className="text-sm text-emerald-300">2FA is now enabled.</p>
              <RecoveryCodes codes={enroll.recoveryCodes} />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-white/60">Scan this QR code with an authenticator app (Google Authenticator, 1Password, Authy), then enter the 6-digit code to confirm.</p>
              {qr && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qr} alt="2FA QR code" width={180} height={180} className="rounded-lg" />
              )}
              <button type="button" onClick={() => setShowManual((s) => !s)} className="block text-xs text-[#4b9be6] hover:underline">
                Can&apos;t scan? Enter the key manually
              </button>
              {showManual && <p className="break-all rounded bg-black/30 p-2 font-mono text-xs text-white/70">{secret}</p>}
              <form action={enrollAction} className="space-y-3">
                <input type="hidden" name="secret" value={secret} />
                <input type="hidden" name="otpauth" value={otpAuthUrl} />
                <input name="current_password" type="password" placeholder="Current password" autoComplete="current-password" required className={inputCls} />
                <input name="code" inputMode="numeric" placeholder="6-digit code" required className={inputCls} />
                <div className="flex items-center gap-3">
                  <button type="submit" className={btnCls}>Enable 2FA</button>
                  <Msg state={enroll} okText="" />
                </div>
              </form>
            </div>
          )}
        </Card>
      ) : (
        <>
          <Card title="Two-factor authentication">
            <p className="mb-4 text-sm text-emerald-300">2FA is enabled. {remainingCodes} recovery code{remainingCodes === 1 ? "" : "s"} remaining.</p>
            <form action={regenAction} className="mb-2 space-y-3">
              <input name="current_password" type="password" placeholder="Current password to regenerate codes" autoComplete="current-password" required className={inputCls} />
              <div className="flex items-center gap-3">
                <button type="submit" className={btnCls}>Regenerate recovery codes</button>
                <Msg state={regen} okText="" />
              </div>
            </form>
            {regen.recoveryCodes && <RecoveryCodes codes={regen.recoveryCodes} />}
          </Card>
          <Card title="Disable 2FA">
            <form action={disableAction} className="space-y-3">
              <input name="current_password" type="password" placeholder="Current password" autoComplete="current-password" required className={inputCls} />
              <input name="code" inputMode="numeric" placeholder="Current 6-digit code" required className={inputCls} />
              <div className="flex items-center gap-3">
                <button type="submit" className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10">Disable 2FA</button>
                <Msg state={disable} okText="2FA disabled." />
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
