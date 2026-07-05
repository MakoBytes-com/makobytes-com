import { serverSupabase } from "@/lib/supabase";

// Best-effort server error capture into the error_events table so failures
// are visible in one place instead of buried in Vercel function logs.
// NEVER throws — a broken error logger must not take down the request path.
export async function reportError(context: string, error: unknown, meta?: Record<string, unknown>) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? (error.stack ?? null) : null;
  console.error(`[${context}]`, message, meta ?? "");
  try {
    const supabase = serverSupabase();
    await supabase.from("error_events").insert({
      source: "makobytes.com",
      context,
      message: message.slice(0, 2000),
      stack: stack?.slice(0, 8000) ?? null,
      meta: meta ?? null,
    });
  } catch {
    // Swallow — console.error above is the fallback of record.
  }
}
