import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { kv } from "@vercel/kv";
import { getCustomer, getLicenseKey } from "@/lib/polar";
import { sendLicenseKeyEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEDUPE_TTL_SECONDS = 60 * 60 * 24 * 7;

// Runtime shape check for the only event type this handler processes
// (benefit_grant.created). Signature verification proves the payload came
// from Polar; this guard proves the payload has the fields the handler
// actually destructures, so a future Polar schema change can't crash us
// with an unhandled exception.
type PolarBenefitGrant = {
  id: string;
  customer_id: string;
  properties: { license_key_id: string };
  customer?: { email?: string; name?: string | null };
};
type PolarBenefitGrantEvent = {
  type: "benefit_grant.created";
  data: PolarBenefitGrant;
};

function isString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function isPolarBenefitGrantEvent(
  e: unknown,
): e is PolarBenefitGrantEvent {
  if (!e || typeof e !== "object") return false;
  const ev = e as Record<string, unknown>;
  if (ev.type !== "benefit_grant.created") return false;
  const data = ev.data;
  if (!data || typeof data !== "object") return false;
  const grant = data as Record<string, unknown>;
  if (!isString(grant.id)) return false;
  if (!isString(grant.customer_id)) return false;
  const props = grant.properties;
  if (!props || typeof props !== "object") return false;
  if (!isString((props as Record<string, unknown>).license_key_id)) return false;
  return true;
}

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

  let unverifiedEvent: unknown;
  try {
    const normalized = secret.startsWith("polar_whs_")
      ? secret.slice("polar_whs_".length)
      : secret;
    const wh = new Webhook(normalized);
    unverifiedEvent = wh.verify(rawBody, headers);
  } catch (err) {
    console.error("[/api/polar-webhook] signature verification failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  // Determine event type for logging (ignored events still need to 200).
  const evType =
    typeof unverifiedEvent === "object" && unverifiedEvent !== null
      ? String((unverifiedEvent as Record<string, unknown>).type ?? "unknown")
      : "unknown";

  if (evType !== "benefit_grant.created") {
    console.log("[/api/polar-webhook] ignored event", { type: evType });
    return NextResponse.json({ ok: true, ignored: evType });
  }

  // Validate shape of the only event class we actually handle. Reject malformed
  // payloads that nonetheless passed signature (Polar schema drift, malicious
  // signed payload from a leaked secret, etc.) with 400 rather than letting
  // destructuring throw 500.
  if (!isPolarBenefitGrantEvent(unverifiedEvent)) {
    console.error("[/api/polar-webhook] benefit_grant.created with unexpected shape", {
      keys:
        typeof unverifiedEvent === "object" && unverifiedEvent !== null
          ? Object.keys(unverifiedEvent as Record<string, unknown>)
          : [],
    });
    return NextResponse.json({ error: "unexpected payload shape" }, { status: 400 });
  }

  const event = unverifiedEvent;

  try {
    const grant = event.data;
    const grantId = grant.id;
    const licenseKeyId = grant.properties.license_key_id;
    const customerId = grant.customer_id;
    const embeddedEmail = grant.customer?.email;
    const embeddedName = grant.customer?.name;

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
      console.error("[/api/polar-webhook] no customer email resolvable", {
        grantId,
        customerId,
      });
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
