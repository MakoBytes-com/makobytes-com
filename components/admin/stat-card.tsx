import { ComponentType } from "react";

export function StatCard({
  label,
  total,
  today,
  Icon,
  accent = "blue",
}: {
  label: string;
  total: number;
  today: number;
  Icon: ComponentType<{ className?: string }>;
  accent?: "blue" | "cyan" | "magenta" | "green";
}) {
  // All accents resolved into the navy palette so stat cards stay on-theme
  // even when the dashboard adds new accent variants. Green is kept as
  // semantic success green (#04bf6c) since downloads = positive.
  const accentMap = {
    blue: {
      icon: "text-[#0061aa]",
      iconBg: "from-[#0061aa]/15 to-transparent",
      border: "border-[#0061aa]/30",
    },
    cyan: {
      icon: "text-[#3387cf]",
      iconBg: "from-[#3387cf]/15 to-transparent",
      border: "border-[#3387cf]/30",
    },
    magenta: {
      icon: "text-[#406f7b]",
      iconBg: "from-[#406f7b]/15 to-transparent",
      border: "border-[#406f7b]/30",
    },
    green: {
      icon: "text-[#04bf6c]",
      iconBg: "from-[#04bf6c]/15 to-transparent",
      border: "border-[#04bf6c]/30",
    },
  };
  const a = accentMap[accent];

  return (
    <div className="feature-card p-6">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg border bg-gradient-to-br ${a.iconBg} ${a.border}`}
        >
          <Icon className={`h-5 w-5 ${a.icon}`} />
        </div>
        <div className="mono-tag text-[10px] text-[#999999]">all-time</div>
      </div>
      <div className="mt-5 text-4xl font-black tracking-tight text-[#333333]">
        {total.toLocaleString()}
      </div>
      <div className="mt-1 text-sm text-[#777777]">{label}</div>
      <div className="mt-4 flex items-center gap-1.5 border-t border-[#dbdbdb]/50 pt-3">
        <span className="mono-tag text-[#999999]">today</span>
        <span className={`text-sm font-bold ${a.icon}`}>
          {today.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
