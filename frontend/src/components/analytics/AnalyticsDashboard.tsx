"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, LabelList, Cell,
} from "recharts";
import {
  leadsOverTime, emailPerformance, replyRateTrend,
  conversionFunnel, topCampaigns, aiInsights,
} from "@/lib/mock-data/analytics";
import { cn } from "@/lib/utils";
import { Download, Calendar, Lightbulb, TrendingUp, Mail, MessageCircle } from "lucide-react";
import { GradientBadge } from "@/components/ui/gradient-badge";

const ranges = ["7d", "30d", "90d", "1y"];

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2.5 shadow-md min-w-[130px]">
      <p className="text-xs font-semibold text-[var(--text-muted)] mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-bold text-[var(--text-primary)]">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsDashboard() {
  const [range, setRange] = useState("30d");

  return (
    <div className="p-6 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Analytics</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Track your sales system performance</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date range */}
          <div className="flex items-center rounded-xl border border-[var(--border)] overflow-hidden">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold transition-colors",
                  r === range
                    ? "bg-[var(--accent-blue)] text-white"
                    : "bg-white text-[var(--text-muted)] hover:bg-[var(--surface)]"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Quick metric pills */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: "2,847", trend: "+18.2%", color: "blue" as const },
          { label: "Email Open Rate", value: "55.1%", trend: "+4.3%", color: "purple" as const },
          { label: "Reply Rate", value: "18.4%", trend: "+2.1%", color: "green" as const },
          { label: "Conversion Rate", value: "1.2%", trend: "+0.3%", color: "pink" as const },
        ].map(({ label, value, trend, color }) => (
          <div key={label} className="card flex items-center justify-between p-4">
            <div>
              <p className="text-xs text-[var(--text-muted)] font-medium">{label}</p>
              <p className="text-xl font-bold text-[var(--text-primary)] mt-0.5">{value}</p>
            </div>
            <GradientBadge variant={color}>{trend}</GradientBadge>
          </div>
        ))}
      </div>

      {/* Leads over time — full width */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">Leads Over Time</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Daily lead generation for the selected period</p>
          </div>
          <div className="flex gap-4">
            {[
              { label: "Total Leads", color: "#2563EB" },
              { label: "Qualified", color: "#7C3AED" },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={leadsOverTime} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gQual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="leads" name="Total Leads" stroke="#2563EB" strokeWidth={2} fill="url(#gLeads)" isAnimationActive animationDuration={1000} />
            <Area type="monotone" dataKey="qualified" name="Qualified" stroke="#7C3AED" strokeWidth={2} fill="url(#gQual)" isAnimationActive animationDuration={1000} animationBegin={200} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 3 charts row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Email Performance */}
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">Email Performance</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">Last 14 days</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={emailPerformance.slice(-7)} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barGap={1}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sent" name="Sent" fill="#DBEAFE" radius={[2, 2, 0, 0]} isAnimationActive />
              <Bar dataKey="opened" name="Opened" fill="#2563EB" radius={[2, 2, 0, 0]} isAnimationActive animationBegin={100} />
              <Bar dataKey="replied" name="Replied" fill="#7C3AED" radius={[2, 2, 0, 0]} isAnimationActive animationBegin={200} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reply Rate Trend */}
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">Reply Rate Trend</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">By channel, weekly</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={replyRateTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="email" name="Email %" stroke="#2563EB" strokeWidth={2} dot={false} isAnimationActive animationDuration={1000} />
              <Line type="monotone" dataKey="whatsapp" name="WhatsApp %" stroke="#059669" strokeWidth={2} dot={false} isAnimationActive animationDuration={1000} animationBegin={200} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="card p-5">
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">Conversion Funnel</h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">Lead to close</p>
          <div className="space-y-1.5">
            {conversionFunnel.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="text-[var(--text-secondary)] font-medium">{stage.stage}</span>
                  <span className="text-[var(--text-muted)]">{stage.count.toLocaleString()} ({stage.percentage}%)</span>
                </div>
                <div className="h-5 w-full rounded-sm bg-[var(--surface-2)] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentage}%` }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                    className="h-full rounded-sm"
                    style={{ background: `hsl(${220 - i * 8}, 70%, ${60 - i * 5}%)` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Campaigns Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h3 className="font-semibold text-[var(--text-primary)]">Top Performing Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                {["Campaign", "Type", "Leads", "Open Rate", "Reply Rate", "Conversions", "Revenue"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {topCampaigns.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="hover:bg-[var(--surface)] transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-[var(--text-primary)]">{c.name}</td>
                  <td className="px-5 py-3">
                    <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold w-fit",
                      c.type === "EMAIL" ? "bg-blue-50 text-blue-700" :
                      c.type === "WHATSAPP" ? "bg-emerald-50 text-emerald-700" :
                      "bg-violet-50 text-violet-700"
                    )}>
                      {c.type === "EMAIL" ? <Mail className="h-3 w-3" /> : <MessageCircle className="h-3 w-3" />}
                      {c.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">{c.leads}</td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">{c.openRate > 0 ? `${c.openRate}%` : "—"}</td>
                  <td className="px-5 py-3">
                    <span className="font-semibold text-emerald-700">{c.replyRate}%</span>
                  </td>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">{c.conversions}</td>
                  <td className="px-5 py-3 font-semibold text-[var(--text-primary)]">${c.revenue.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="font-semibold text-[var(--text-primary)]">AI Insights</h3>
          <GradientBadge variant="amber" shimmer>3 new insights</GradientBadge>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {aiInsights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="card p-5 border-l-4"
              style={{ borderLeftColor: i === 0 ? "#2563EB" : i === 1 ? "#059669" : "#D97706" }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">{insight.title}</h4>
                <span className={cn("text-xs font-semibold rounded-full px-2 py-0.5",
                  insight.impact === "high" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                )}>
                  {insight.impact} impact
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{insight.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--accent-blue)]">{insight.metric}</span>
                <button className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors">
                  Apply →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
