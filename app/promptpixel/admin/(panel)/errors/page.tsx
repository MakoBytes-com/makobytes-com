import { serverSupabase } from "@/lib/supabase";
import { ErrorsManager, type ErrorRow } from "./errors-manager";

export const dynamic = "force-dynamic";

export default async function ErrorsPage() {
  const supabase = serverSupabase();
  const { data } = await supabase
    .from("error_events")
    .select("id, source, context, message, stack, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const errors = (data ?? []) as ErrorRow[];

  return <ErrorsManager initial={errors} />;
}
