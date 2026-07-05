import { serverSupabase } from "@/lib/supabase";
import { UsersManager } from "./users-manager";

export const dynamic = "force-dynamic";

export type AdminAccount = {
  email: string;
  license_key: string;
  subscription_status: string;
  source: string;
  stripe_customer_id: string | null;
  created_at: string;
};

export default async function UsersPage() {
  const supabase = serverSupabase();
  const { data } = await supabase
    .from("accounts")
    .select("email, license_key, subscription_status, source, stripe_customer_id, created_at")
    .order("created_at", { ascending: false });
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-black">Users</h1>
      <UsersManager initial={(data ?? []) as AdminAccount[]} />
    </div>
  );
}
