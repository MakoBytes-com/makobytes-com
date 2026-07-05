import { serverSupabase } from "@/lib/supabase";
import { Stat, Section } from "../ui";

export const dynamic = "force-dynamic";

const GH_RELEASES = "https://api.github.com/repos/MakoBytes-com/PromptPixel/releases";

type Asset = { name: string; download_count: number; size: number; browser_download_url: string };
type Release = { tag_name: string; name: string; published_at: string; body: string; html_url: string; assets: Asset[] };

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function ReleasesPage() {
  let releases: Release[] = [];
  let ghError = false;
  try {
    const res = await fetch(GH_RELEASES, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "makobytes.com" },
      next: { revalidate: 120 },
    });
    if (res.ok) releases = await res.json();
    else ghError = true;
  } catch {
    ghError = true;
  }

  // Site download clicks (landing-page Download button), for adoption context.
  const supabase = serverSupabase();
  const { count: siteDownloads } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("event_type", "click_download");

  const totalGhDownloads = releases.reduce(
    (s, r) => s + r.assets.reduce((a, x) => a + (x.download_count ?? 0), 0),
    0,
  );
  const latest = releases[0];

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-black">Releases</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Latest version" value={latest?.tag_name ?? "—"} accent />
        <Stat label="GitHub downloads" value={String(totalGhDownloads)} sub="all versions" />
        <Stat label="Site download clicks" value={String(siteDownloads ?? 0)} sub="via makobytes.com" />
        <Stat label="Releases" value={String(releases.length)} />
      </div>

      {ghError && (
        <p className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
          Couldn&apos;t reach GitHub just now — counts may be stale.
        </p>
      )}

      <Section title="Published releases">
        {releases.length === 0 ? (
          <p className="py-6 text-center text-sm text-white/40">No releases found.</p>
        ) : (
          <div className="space-y-4">
            {releases.map((r) => (
              <div key={r.tag_name} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black">{r.name || r.tag_name}</span>
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-white/50">{r.tag_name}</span>
                  </div>
                  <span className="text-xs text-white/40">{fmt(r.published_at)}</span>
                </div>
                {r.assets.map((a) => (
                  <div key={a.name} className="mt-2 flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-sm">
                    <a href={a.browser_download_url} className="font-mono text-xs text-[#4b9be6] hover:underline">{a.name}</a>
                    <span className="text-white/60">{a.download_count} download{a.download_count === 1 ? "" : "s"} · {(a.size / 1048576).toFixed(0)} MB</span>
                  </div>
                ))}
                <a href={r.html_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-white/40 hover:text-white/70">View on GitHub →</a>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="How updates work">
        <p className="text-sm leading-relaxed text-white/60">
          Releases live on GitHub (<span className="font-mono text-xs">MakoBytes-com/PromptPixel</span>).
          The desktop app checks the latest release daily and on demand, and
          the download buttons on makobytes.com/promptpixel point at the newest
          <span className="font-mono text-xs"> PromptPixel-Setup.exe</span>. To ship an update:
          build + sign, then <span className="font-mono text-xs">gh release create v2.0.2-alpha …</span>.
        </p>
      </Section>
    </div>
  );
}
