"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sparkles, SlidersHorizontal, CheckSquare, BookmarkPlus,
  Megaphone, Radar,
} from "lucide-react";
import { mockLeads } from "@/lib/mock-data/leads";
import { LeadCard } from "@/components/leads/LeadCard";
import { SkeletonLeadCard } from "@/components/ui/skeleton-card";
import { containerVariants } from "@/lib/utils";
import type { Lead } from "@/lib/types";

const searchSchema = z.object({
  industry: z.string().min(1, "Industry is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  businessType: z.string().optional(),
  companySize: z.string().optional(),
  keywords: z.string().optional(),
  count: z.number().min(1).max(50),
});

type SearchForm = z.infer<typeof searchSchema>;

const industries = ["SaaS", "E-commerce", "Healthcare Tech", "Agency", "FinTech", "EdTech", "Real Estate", "Logistics", "Developer Tools", "Marketing"];
const countries = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "India", "France", "Singapore", "UAE", "Netherlands"];
const businessTypes = ["B2B", "B2C", "B2B2C", "Enterprise", "SMB", "Startup"];
const companySizes = ["1–10", "11–50", "51–200", "200+"];

export function LeadFinderForm({
  onResults,
  isSearching,
}: {
  onResults: (leads: Lead[]) => void;
  isSearching: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { industry: "", country: "", count: 10 },
  });

  function onSubmit(_data: SearchForm) {
    // Mock: return subset of mockLeads with slight delay
    // When backend is ready, call: searchLeadsAction(data)
    setTimeout(() => {
      onResults(mockLeads.slice(0, 8));
    }, 2200);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card flex flex-col gap-5 p-6">
      <div>
        <h2 className="font-semibold text-[var(--text-primary)]">AI Lead Search</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Describe your ideal client and our AI will find them
        </p>
      </div>

      {/* Industry */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Industry <span className="text-red-500">*</span>
        </label>
        <select
          {...register("industry")}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
        >
          <option value="">Select industry...</option>
          {industries.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        {errors.industry && <p className="text-xs text-red-500">{errors.industry.message}</p>}
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          {...register("country")}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
        >
          <option value="">Select country...</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
      </div>

      {/* City */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">City</label>
        <input
          {...register("city")}
          placeholder="e.g. San Francisco"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all placeholder:text-[var(--text-muted)]"
        />
      </div>

      {/* Business Type + Company Size */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Business Type</label>
          <select
            {...register("businessType")}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
          >
            <option value="">Any</option>
            {businessTypes.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Company Size</label>
          <select
            {...register("companySize")}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
          >
            <option value="">Any</option>
            {companySizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Keywords</label>
        <input
          {...register("keywords")}
          placeholder="e.g. React, Shopify, automation..."
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all placeholder:text-[var(--text-muted)]"
        />
        <p className="text-[11px] text-[var(--text-muted)]">Comma-separated tags</p>
      </div>

      {/* Lead Count */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Number of Leads
        </label>
        <select
          {...register("count", { valueAsNumber: true })}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
        >
          {[5, 10, 20, 30, 50].map((n) => <option key={n} value={n}>{n} leads</option>)}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSearching}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isSearching ? (
          <>
            <Radar className="h-4 w-4 animate-spin" />
            AI Searching...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Find Leads with AI
          </>
        )}
      </button>
    </form>
  );
}
