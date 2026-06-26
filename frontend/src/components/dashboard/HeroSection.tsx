"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp } from "lucide-react";
import { GradientBadge } from "@/components/ui/gradient-badge";

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]"
    >
      {/* Subtle gradient background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 80% 50%, #2563EB, transparent)",
        }}
      />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GradientBadge variant="blue" shimmer>
              <Sparkles className="h-3 w-3" />
              AI Running
            </GradientBadge>
            <GradientBadge variant="green">
              <TrendingUp className="h-3 w-3" />
              3 campaigns active
            </GradientBadge>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome back, Alex 👋
          </h1>
          <p className="mt-1 text-[var(--text-secondary)]">
            Your AI Sales System generated{" "}
            <span className="font-semibold text-[var(--accent-blue)]">24 new leads</span> today
            and sent{" "}
            <span className="font-semibold text-[var(--accent-purple)]">142 outreach messages</span>.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
            <Sparkles className="h-4 w-4" />
            Find New Leads
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition-all hover:bg-[var(--surface)] hover:shadow-md">
            <Zap className="h-4 w-4 text-[var(--accent-blue)]" />
            Run Campaign
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative mt-5 flex gap-6 border-t border-[var(--border-subtle)] pt-4">
        {[
          { label: "Leads Today", value: "24", color: "text-blue-600" },
          { label: "Emails Sent", value: "142", color: "text-violet-600" },
          { label: "Open Rate", value: "55%", color: "text-emerald-600" },
          { label: "Replies", value: "18", color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col">
            <span className={`text-lg font-bold ${color}`}>{value}</span>
            <span className="text-xs text-[var(--text-muted)]">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
