import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { kv } from "@vercel/kv";
import { getCustomer, getLicenseKey } from "@/lib/polar";
import { sendLicenseKeyEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEDUPE_TTL_SECONDS = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[/api/polar-webhook] POLAR_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "config" }, { status: 500 });
  }

  const rawBody = await req.text();
  const headers = {
    "webhook-id": req.headers.get("webhook-id") ?? "",
    "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
    "webhook-signature": req.headers.get("webhook-signature") ?? "",
  };

  let event: any;
  try {
    const normalized = secret.startsWith("polar_whs_") ? secret.slice("polar_whs_".length) : secret;
    const wh = new Webhook(normalized);
    event = wh.verify(rawBody, headers);
  } catch (err) {
    console.error("[/api/polar-webhook] signature verification failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const type: string = event?.type ?? "unknown";

  if (type !== "benefit_grant.created") {
    console.log("[/api/polar-webhook] ignored event", { type });
    return NextResponse.json({ ok: true, ignored: type });
  }

  try {
    const grant = event.data;
    const grantId: string | undefined = grant?.id;
    const licenseKeyId: string | undefined = grant?.properties?.license_key_id;
    const customerId: string | undefined = grant?.customer_id;
    const embeddedEmail: string | undefined = grant?.customer?.email;
    const embeddedName: string | null | undefined = grant?.customer?.name;

    if (!grantId || !licenseKeyId || !customerId) {
      console.error("[/api/polar-webhook] grant payload missing fields", {
        grantId,
        licenseKeyId,
        customerId,
      });
      return NextResponse.json({ error: "missing grant fields" }, { status: 400 });
    }

    const dedupeKey = `polar-webhook:grant:${grantId}`;
    const alreadyProcessed = await kv.get(dedupeKey);
    if (alreadyProcessed) {
      console.log("[/api/polar-webhook] duplicate grant, skipping", { grantId });
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const licenseKey = await getLicenseKey(licenseKeyId);

    let email = embeddedEmail;
    let name: string | null | undefined = embeddedName;
    if (!email) {
      const customer = await getCustomer(customerId);
      email = customer.email;
      name = customer.name;
    }
    if (!email) {
      console.error("[/api/polar-webhook] no customer email resolvable", { grantId, customerId });
      return NextResponse.json({ error: "no customer email" }, { status: 400 });
    }

    await sendLicenseKeyEmail({
      to: email,
      licenseKey: licenseKey.key,
      customerName: name,
    });

    await kv.set(dedupeKey, Date.now(), { ex: DEDUPE_TTL_SECONDS });

    console.log("[/api/polar-webhook] delivered license key", {
      grantId,
      customer: email,
      licenseKeyId,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/polar-webhook] processing failed", err);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
