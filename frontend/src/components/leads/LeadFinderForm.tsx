"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Radar, Search, MapPin } from "lucide-react";

const searchSchema = z.object({
  industry: z.string().min(1, "Search term is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  companySize: z.string().optional(),
  keywords: z.string().optional(),
  count: z.number().min(1).max(50),
});

type SearchForm = z.infer<typeof searchSchema>;

// Quick-pick chips — same idea as Google Maps Scraper examples
const SUGGESTIONS = [
  "restaurant", "dental clinic", "digital agency", "real estate agent",
  "gym", "law firm", "hotel", "saloon", "accountant", "web designer",
  "interior designer", "auto repair", "physiotherapist", "cafe",
];

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Singapore", "UAE", "Netherlands", "Pakistan",
  "Bangladesh", "Philippines", "South Africa", "Nigeria",
];

const companySizes = ["1–10", "11–50", "51–200", "200+"];

export function LeadFinderForm({
  onSearch,
  isSearching,
}: {
  onSearch: (data: SearchForm) => void;
  isSearching: boolean;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { industry: "", country: "India", count: 10 },
  });

  const currentTerm = watch("industry");

  function applySuggestion(s: string) {
    setValue("industry", s, { shouldValidate: true });
    setShowSuggestions(false);
  }

  return (
    <form onSubmit={handleSubmit(onSearch)} className="card flex flex-col gap-5 p-6">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-[var(--text-primary)]">AI Lead Search</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Enter any business type or name — just like Google Maps
        </p>
      </div>

      {/* Search Term (replaces Industry dropdown) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Search Term <span className="text-red-500">*</span>
        </label>

        {/* Input with search icon */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            {...register("industry")}
            placeholder="e.g. restaurant, saloon, digital agency..."
            autoComplete="off"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all placeholder:text-[var(--text-muted)]"
          />
        </div>

        {errors.industry && (
          <p className="text-xs text-red-500">{errors.industry.message}</p>
        )}

        {/* Quick-pick suggestion chips */}
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {SUGGESTIONS.filter((s) =>
            !currentTerm || s.includes(currentTerm.toLowerCase())
          )
            .slice(0, 8)
            .map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => applySuggestion(s)}
                className="rounded-full border border-[var(--border)] bg-white px-2.5 py-0.5 text-[11px] text-[var(--text-secondary)] hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                {s}
              </button>
            ))}
        </div>
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
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.country && (
          <p className="text-xs text-red-500">{errors.country.message}</p>
        )}
      </div>

      {/* City */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide flex items-center gap-1">
          <MapPin className="h-3 w-3" /> City
        </label>
        <input
          {...register("city")}
          placeholder="e.g. Mumbai, London, Dubai..."
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all placeholder:text-[var(--text-muted)]"
        />
      </div>

      {/* Company Size */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Company Size
        </label>
        <select
          {...register("companySize")}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
        >
          <option value="">Any</option>
          {companySizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Number of Leads */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Number of Leads
        </label>
        <select
          {...register("count", { valueAsNumber: true })}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
        >
          {[5, 10, 20, 30, 50].map((n) => (
            <option key={n} value={n}>{n} leads</option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSearching}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isSearching ? (
          <>
            <Radar className="h-4 w-4 animate-spin" />
            Searching Google Maps...
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
