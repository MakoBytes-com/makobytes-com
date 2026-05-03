"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export type TrendSeries = {
  name: string;
  color: string;
  data: { date: string; count: number }[];
};

export function TrendChart({ series }: { series: TrendSeries[] }) {
  // Merge all series by date
  const dates = Array.from(
    new Set(series.flatMap((s) => s.data.map((d) => d.date))),
  ).sort();

  const merged = dates.map((date) => {
    const row: Record<string, string | number> = { date };
    series.forEach((s) => {
      const found = s.data.find((d) => d.date === date);
      row[s.name] = found?.count ?? 0;
    });
    return row;
  });

  return (
    <div className="feature-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mono-tag mb-1 text-[#0061aa]">// trend</div>
          <h3 className="text-lg font-bold text-[#333333]">Last 14 days</h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {series.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-1.5 mono-tag text-[#555555]"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              {s.name}
            </div>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={merged}>
            <defs>
              {series.map((s, i) => (
                <linearGradient
                  key={s.name}
                  id={`grad-${i}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0, 97, 170, 0.08)"
            />
            <XAxis
              dataKey="date"
              stroke="#777777"
              fontSize={11}
              tickFormatter={(v) => v.slice(5)}
            />
            <YAxis
              stroke="#777777"
              fontSize={11}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #dbdbdb",
                borderRadius: "0.5rem",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0, 97, 170, 0.10)",
              }}
              labelStyle={{ color: "#333333" }}
              itemStyle={{ color: "#555555" }}
            />
            {series.map((s, i) => (
              <Area
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#grad-${i})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
