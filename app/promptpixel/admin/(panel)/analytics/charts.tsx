"use client";

import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import type { DailyPoint, Tally } from "@/lib/analytics";

const GRID = "#1e2a3d";
const AXIS = "#7c8aa0";
const VIEWS = "#4b9be6";
const VISITORS = "#3B82F6";
const SESSIONS = "#10B981";
const tooltip = { background: "#0f1729", border: "1px solid #223049", borderRadius: 8, fontSize: 12, color: "#e6edf5" };
const PIE = ["#3B82F6", "#4b9be6", "#10B981", "#f59e0b", "#ef4444", "#a78bfa"];

export function TrafficChart({ data }: { data: DailyPoint[] }) {
  const interval = data.length > 30 ? Math.floor(data.length / 12) : data.length > 14 ? 3 : 1;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={VIEWS} stopOpacity={0.35} />
            <stop offset="100%" stopColor={VIEWS} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: AXIS }} stroke={GRID} interval={interval} />
        <YAxis tick={{ fontSize: 11, fill: AXIS }} stroke={GRID} allowDecimals={false} width={36} />
        <Tooltip contentStyle={tooltip} />
        <Legend wrapperStyle={{ fontSize: 12, color: AXIS }} />
        <Area type="monotone" dataKey="views" stroke={VIEWS} strokeWidth={2} fill="url(#gViews)" name="Page views" />
        <Line type="monotone" dataKey="visitors" stroke={VISITORS} strokeWidth={2} dot={false} name="Visitors" />
        <Line type="monotone" dataKey="sessions" stroke={SESSIONS} strokeWidth={2} dot={false} name="Sessions" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data }: { data: Tally[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={40} outerRadius={64} paddingAngle={2} stroke="none">
            {data.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
          </Pie>
          <Tooltip contentStyle={tooltip} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex-1 space-y-1.5 text-sm">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-white/70">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: PIE[i % PIE.length] }} />
              {d.label}
            </span>
            <span className="tabular-nums text-white/50">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DownloadsChart({ data }: { data: DailyPoint[] }) {
  const interval = data.length > 30 ? Math.floor(data.length / 12) : data.length > 14 ? 3 : 1;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: AXIS }} stroke={GRID} interval={interval} />
        <YAxis tick={{ fontSize: 11, fill: AXIS }} stroke={GRID} allowDecimals={false} width={30} />
        <Tooltip contentStyle={tooltip} />
        <Bar dataKey="views" fill={SESSIONS} radius={[3, 3, 0, 0]} name="Downloads" />
      </BarChart>
    </ResponsiveContainer>
  );
}
