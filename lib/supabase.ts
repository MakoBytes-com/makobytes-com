import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client (service key) for licensing, admin auth, and
// analytics. NEVER import from a client component — API routes and server
// components only. Throws when unconfigured so routes fail loudly, not
// silently, in a misdeployed environment.
export function serverSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}
