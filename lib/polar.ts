const POLAR_API = "https://api.polar.sh";

export interface PolarLicenseKey {
  id: string;
  key: string;
  status: string;
  customer_id: string;
  organization_id: string;
  expires_at: string | null;
}

export interface PolarCustomer {
  id: string;
  email: string;
  name: string | null;
}

function authHeaders(): HeadersInit {
  const token = process.env.POLAR_API_TOKEN;
  if (!token) throw new Error("POLAR_API_TOKEN not set");
  return { Authorization: `Bearer ${token}` };
}

export async function getLicenseKey(id: string): Promise<PolarLicenseKey> {
  const res = await fetch(`${POLAR_API}/v1/license-keys/${id}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Polar GET /license-keys/${id} failed: ${res.status} ${body}`);
  }
  return res.json();
}

export async function getCustomer(id: string): Promise<PolarCustomer> {
  const res = await fetch(`${POLAR_API}/v1/customers/${id}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Polar GET /customers/${id} failed: ${res.status} ${body}`);
  }
  return res.json();
}
