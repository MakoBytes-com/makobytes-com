import "server-only";
import { serverSupabase } from "@/lib/supabase";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  passwordHash: string | null;
  disabledAt: string | null;
  totpSecret: string | null;
  totpEnrolledAt: string | null;
};

// Supabase column → camelCase mapper.
function map(r: Record<string, unknown>): AdminUser {
  return {
    id: r.id as string,
    email: r.email as string,
    name: r.name as string,
    role: (r.role as "admin" | "editor") ?? "admin",
    passwordHash: (r.password_hash as string) ?? null,
    disabledAt: (r.disabled_at as string) ?? null,
    totpSecret: (r.totp_secret as string) ?? null,
    totpEnrolledAt: (r.totp_enrolled_at as string) ?? null,
  };
}

const COLS = "id, email, name, role, password_hash, disabled_at, totp_secret, totp_enrolled_at";

export async function findUserByEmail(email: string): Promise<AdminUser | null> {
  const { data } = await serverSupabase().from("admin_users").select(COLS).eq("email", email.toLowerCase()).single();
  return data ? map(data) : null;
}

export async function findUserById(id: string): Promise<AdminUser | null> {
  const { data } = await serverSupabase().from("admin_users").select(COLS).eq("id", id).single();
  return data ? map(data) : null;
}

export async function recordLogin(id: string): Promise<void> {
  await serverSupabase().from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", id);
}

export async function setUserPassword(id: string, passwordHash: string): Promise<void> {
  await serverSupabase().from("admin_users").update({ password_hash: passwordHash, updated_at: new Date().toISOString() }).eq("id", id);
}

export async function setUserTotp(id: string, encryptedSecret: string): Promise<void> {
  await serverSupabase().from("admin_users")
    .update({ totp_secret: encryptedSecret, totp_enrolled_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function clearUserTotp(id: string): Promise<void> {
  await serverSupabase().from("admin_users")
    .update({ totp_secret: null, totp_enrolled_at: null, updated_at: new Date().toISOString() })
    .eq("id", id);
  await serverSupabase().from("admin_recovery_codes").delete().eq("user_id", id);
}
