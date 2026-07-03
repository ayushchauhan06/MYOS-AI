"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, BookmarkPlus, Megaphone, Sparkles, MapPin, Clock } from "lucide-react";
import { LeadFinderForm } from "@/components/leads/LeadFinderForm";
import { LeadCard } from "@/components/leads/LeadCard";
import { SkeletonLeadCard } from "@/components/ui/skeleton-card";
import { containerVariants } from "@/lib/utils";
import { useLeadStore } from "@/lib/store/useLeadStore";
import type { Lead } from "@/lib/types";
import { searchLeadsAction } from "@/modules/leads/lead.actions";

interface SearchQueryInput {
  industry: string;
  country: string;
  city?: string;
  businessType?: string;
  companySize?: string;
  keywords?: string;
  count: number;
}

const SEARCH_MESSAGES = [
  "Connecting to Google Maps...",
  "Scanning local businesses...",
  "Extracting contact details...",
  "Analysing ratings & reviews...",
  "Qualifying leads with AI...",
  "Almost there — finalising results...",
];

export default function LeadFinderPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addLead } = useLeadStore();

  // Timer that shows elapsed seconds + rotating messages while searching
  useEffect(() => {
    if (isSearching) {
      setElapsedSeconds(0);
      setMsgIndex(0);
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
        setMsgIndex((m) => (m + 1) % SEARCH_MESSAGES.length);
      }, 3000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSearching]);

  async function handleSearch(query: SearchQueryInput) {
    setIsSearching(true);
    setResults([]);
    setHasSearched(true);
    setSearchError(null);
    try {
      const res = await searchLeadsAction(query);
      if (res.success && res.data) {
        setResults(res.data as Lead[]);
      } else {
        setSearchError(res.error ?? "Unknown error");
        console.error("Search failed:", res.error);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      setSearchError(msg);
      console.error("Failed to run lead search:", error);
    } finally {
      setIsSearching(false);
    }
  }

  function saveAll() {
    results.forEach((lead) => addLead({ ...lead, id: `saved_${lead.id}` }));
  }

  return (
    <div className="flex h-full min-h-0">
      {/* Left panel — form */}
      <div className="w-[320px] flex-shrink-0 overflow-y-auto border-r border-[var(--border)] bg-white p-6 scrollbar-hide">
        <LeadFinderForm onSearch={handleSearch} isSearching={isSearching} />
      </div>

      {/* Right panel — results */}
      <div className="flex-1 overflow-y-auto bg-[var(--surface)] p-6">
        <AnimatePresence mode="wait">
          {/* Loading state */}
          {isSearching && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Scanning animation */}
              <div className="mb-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border)] bg-white py-10">
                {/* Animated icon */}
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-500" style={{ animationDuration: "1.2s" }} />
                  <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-violet-400" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
                  <MapPin className="h-7 w-7 text-blue-600" />
                </div>

                {/* Status text */}
                <div className="text-center space-y-1">
                  <p className="font-semibold text-[var(--text-primary)]">
                    Searching Google Maps via Apify
                  </p>
                  <motion.p
                    key={msgIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-blue-600 font-medium"
                  >
                    {SEARCH_MESSAGES[msgIndex]}
                  </motion.p>
                  <p className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" />
                    {elapsedSeconds}s elapsed — this can take up to 90 seconds
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                    initial={{ width: "5%" }}
                    animate={{ width: `${Math.min(5 + elapsedSeconds, 90)}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonLeadCard key={i} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {!isSearching && hasSearched && searchError && results.length === 0 && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50 py-12 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                <MapPin className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-red-700">Search failed</p>
                <p className="text-sm text-red-500 mt-1 max-w-sm">{searchError}</p>
              </div>
              <p className="text-xs text-red-400">Check your Apify token in .env or try again.</p>
            </motion.div>
          )}

          {/* Zero results state */}
          {!isSearching && hasSearched && !searchError && results.length === 0 && (
            <motion.div
              key="noresults"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border)] bg-white py-12 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                <MapPin className="h-7 w-7 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">No leads found</p>
                <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">
                  Google Maps returned 0 results for this query. Try a broader industry, different city, or fewer keywords.
                </p>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {!isSearching && hasSearched && results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Bulk actions bar */}
              <div className="mb-5 flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--accent-blue)]" />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {results.length} leads found
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">via Google Maps</span>
                  <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors">
                    <CheckSquare className="h-3.5 w-3.5" />
                    Select All
                  </button>
                  <button
                    onClick={saveAll}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <BookmarkPlus className="h-3.5 w-3.5" />
                    Save All
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors">
                    <Megaphone className="h-3.5 w-3.5" />
                    Add to Campaign
                  </button>
                </div>
              </div>

              <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                {results.map((lead, i) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    delay={i * 0.05}
                    onSave={() => addLead({ ...lead, id: `saved_${lead.id}` })}
                    onEmail={() => {}}
                    onWhatsApp={() => {}}
                    onProposal={() => {}}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Empty state */}
          {!isSearching && !hasSearched && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 border border-[var(--border)]">
                <Sparkles className="h-9 w-9 text-[var(--accent-blue)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">AI Lead Finder</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xs">
                  Fill in the search form on the left and let our AI find high-quality leads that match your ideal client profile.
                </p>
              </div>
              <div className="flex gap-2 text-xs text-[var(--text-muted)]">
                <span className="rounded-full border border-[var(--border)] px-3 py-1">🎯 AI-powered matching</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1">📊 Lead scoring</span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1">✉️ Contact details</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
