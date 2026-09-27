import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client (service key) for licensing, admin auth, and
// analytics. NEVER import from a client component — API routes and server
// components only. Throws when unconfigured so routes fail loudly, not
// silently, in a misdeployed environment.
//
// SUPABASE_DB_SCHEMA names this site's folder inside the shared "Mako Logics"
// Supabase project (makobytes). Unset means the classic `public` schema.
export function serverSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  const schema = process.env.SUPABASE_DB_SCHEMA || "public";
  return createClient(url, key, { auth: { persistSession: false }, db: { schema } });
}
