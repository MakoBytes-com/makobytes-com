import type { EventRecord } from "@/lib/admin/storage";
import {
  Eye,
  Download,
  ShoppingCart,
  MousePointerClick,
  Activity,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  pageview: Eye,
  pageview_home: Eye,
  pageview_promptpixel: Eye,
  click_download: Download,
  click_buy: ShoppingCart,
  click_app_card: MousePointerClick,
  click_cta: MousePointerClick,
};

// All event types resolved into the navy palette. Green stays semantic
// (download = positive action), red would be used if we ever capture an
// error event class.
const COLOR_MAP: Record<string, string> = {
  pageview: "text-[#777777]",
  pageview_home: "text-[#0061aa]",
  pageview_promptpixel: "text-[#3387cf]",
  click_download: "text-[#04bf6c]",
  click_buy: "text-[#406f7b]",
  click_app_card: "text-[#0061aa]",
  click_cta: "text-[#0061aa]",
};

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function shortenRef(ref?: string): string {
  if (!ref) return "—";
  try {
    const u = new URL(ref);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return ref.slice(0, 32);
  }
}

export function EventsFeed({ events }: { events: EventRecord[] }) {
  return (
    <div className="feature-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mono-tag mb-1 text-[#0061aa]">// activity</div>
          <h3 className="text-lg font-bold text-[#333333]">Recent events</h3>
        </div>
        <div className="mono-tag flex items-center gap-1.5 text-[#777777]">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[#04bf6c]" />
          live
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Activity className="mb-3 h-8 w-8 text-[#dbdbdb]" />
          <div className="text-sm text-[#999999]">
            No events yet. They&apos;ll show up here as soon as someone hits the
            site.
          </div>
        </div>
      ) : (
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white/95 backdrop-blur">
              <tr className="mono-tag text-[10px] text-[#999999]">
                <th className="px-2 py-2 text-left">type</th>
                <th className="px-2 py-2 text-left">page</th>
                <th className="px-2 py-2 text-left">from</th>
                <th className="px-2 py-2 text-right">when</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const Icon = ICON_MAP[e.type] || Activity;
                const color = COLOR_MAP[e.type] || "text-[#777777]";
                return (
                  <tr
                    key={e.id}
                    className="border-t border-[#dbdbdb]/50 transition hover:bg-[#f8f9fb]"
                  >
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 ${color}`} />
                        <span className={`mono-tag ${color}`}>
                          {e.type.replace(/_/g, " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 mono-tag text-[#555555]">
                      {e.page}
                    </td>
                    <td className="px-2 py-2.5 mono-tag text-[#999999]">
                      {shortenRef(e.ref)}
                    </td>
                    <td className="px-2 py-2.5 text-right mono-tag text-[#999999]">
                      {formatTimeAgo(e.ts)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
