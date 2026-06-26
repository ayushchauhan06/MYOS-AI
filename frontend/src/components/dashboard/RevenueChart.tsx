"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { emailPerformance } from "@/lib/mock-data/analytics";
import { leadsOverTime } from "@/lib/mock-data/analytics";

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3.5 py-2.5 shadow-[var(--shadow-md)] min-w-[140px]">
      <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: p.color }}
            />
            {p.name}
          </span>
          <span className="font-semibold text-[var(--text-primary)]">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  const data = leadsOverTime.slice(-14); // Last 14 days

  return (
    <div className="card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">Revenue Pipeline</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Leads generated over the last 14 days</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            Total Leads
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
            Qualified
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="leads"
            name="Total Leads"
            stroke="#2563EB"
            strokeWidth={2}
            fill="url(#colorLeads)"
            isAnimationActive
            animationDuration={1000}
          />
          <Area
            type="monotone"
            dataKey="qualified"
            name="Qualified"
            stroke="#7C3AED"
            strokeWidth={2}
            fill="url(#colorQualified)"
            isAnimationActive
            animationDuration={1000}
            animationBegin={200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EmailPerformanceChart() {
  const data = emailPerformance.slice(-7);

  return (
    <div className="card flex flex-col gap-4 p-5">
      <div>
        <h3 className="font-semibold text-[var(--text-primary)]">Email Performance</h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">Last 7 days</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="sent" name="Sent" fill="#DBEAFE" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800} />
          <Bar dataKey="opened" name="Opened" fill="#2563EB" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800} animationBegin={100} />
          <Bar dataKey="replied" name="Replied" fill="#7C3AED" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800} animationBegin={200} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
