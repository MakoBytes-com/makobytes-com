import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin";
import { generateTotpSecret, buildQrDataUrl, buildOtpAuthUrl, remainingRecoveryCodeCount } from "@/lib/auth/totp";
import { SecurityClient } from "./security-client";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const user = await currentAdmin();
  if (!user) redirect("/promptpixel/admin/login");

  const enrolled = Boolean(user.totpEnrolledAt);
  let secret = "";
  let qr = "";
  let otpAuthUrl = "";
  let remaining = 0;
  if (!enrolled) {
    secret = generateTotpSecret();
    qr = await buildQrDataUrl(user.email, secret);
    otpAuthUrl = buildOtpAuthUrl(user.email, secret);
  } else {
    remaining = await remainingRecoveryCodeCount(user.id);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-1 text-2xl font-black">Security</h1>
      <p className="mb-6 text-sm text-white/50">Signed in as {user.email}</p>
      <SecurityClient enrolled={enrolled} secret={secret} qr={qr} otpAuthUrl={otpAuthUrl} remainingCodes={remaining} />
    </div>
  );
}
