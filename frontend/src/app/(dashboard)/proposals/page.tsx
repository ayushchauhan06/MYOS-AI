"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Download, Share2, Copy, Edit, CheckCircle } from "lucide-react";
import { mockLeads } from "@/lib/mock-data/leads";
import { mockProposals } from "@/lib/mock-data/proposals";
import type { ProposalContent } from "@/lib/types";

const proposalSchema = z.object({
  leadId: z.string().min(1, "Select a lead"),
  projectType: z.string().min(1, "Select project type"),
  budget: z.string().min(1, "Select budget range"),
  timeline: z.string().min(1, "Select timeline"),
  requirements: z.string().optional(),
});

type ProposalForm = z.infer<typeof proposalSchema>;

const projectTypes = ["Web Application", "Mobile App", "E-commerce", "Shopify Development", "API Development", "UI/UX Design", "Marketing Automation", "AI Integration"];
const budgets = ["$1K – $5K", "$5K – $15K", "$15K – $30K", "$30K – $60K", "$60K – $100K", "$100K+"];
const timelines = ["2 weeks", "1 month", "6 weeks", "2 months", "3 months", "4–6 months", "6+ months"];

function ProposalPreviewDoc({ content }: { content: ProposalContent }) {
  return (
    <div className="min-h-full bg-white rounded-2xl border border-[var(--border)] p-10 font-[var(--font-geist-sans)] shadow-[var(--shadow-sm)]">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[var(--border)] pb-8 mb-8">
        <div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-sm">MA</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] leading-tight">{content.title}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-2">Prepared by Alex Chen · MYOS AI</p>
        </div>
        <div className="text-right text-sm text-[var(--text-muted)]">
          <p>Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          <p className="mt-1 font-semibold text-emerald-700">CONFIDENTIAL</p>
        </div>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-[var(--accent-blue)] mb-3 pb-1 border-b border-blue-100">Introduction</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{content.introduction}</p>
      </section>

      {/* Problem */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-[var(--accent-blue)] mb-3 pb-1 border-b border-blue-100">Problem Analysis</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{content.problemAnalysis}</p>
      </section>

      {/* Solution */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-[var(--accent-blue)] mb-3 pb-1 border-b border-blue-100">Proposed Solution</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{content.proposedSolution}</p>
      </section>

      {/* Scope */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-[var(--accent-blue)] mb-3 pb-1 border-b border-blue-100">Scope of Work</h2>
        <ul className="space-y-1.5">
          {content.scopeOfWork.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Pricing */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-[var(--accent-blue)] mb-4 pb-1 border-b border-blue-100">Pricing Packages</h2>
        <div className="grid grid-cols-3 gap-4">
          {content.pricing.packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`rounded-2xl border p-5 ${pkg.recommended ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200" : "border-[var(--border)] bg-white"}`}
            >
              {pkg.recommended && (
                <div className="mb-2 inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  ⭐ Recommended
                </div>
              )}
              <p className="font-bold text-[var(--text-primary)]">{pkg.name}</p>
              <p className="text-2xl font-bold text-[var(--accent-blue)] mt-1">${pkg.price.toLocaleString()}</p>
              <ul className="mt-3 space-y-1.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-[var(--accent-blue)] mb-3 pb-1 border-b border-blue-100">Payment Milestones</h2>
        <div className="space-y-2">
          {content.milestones.map((m) => (
            <div key={m.name} className="flex items-center justify-between rounded-xl bg-[var(--surface)] px-4 py-3">
              <span className="text-sm font-medium text-[var(--text-primary)]">{m.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--text-muted)]">{m.percentage}%</span>
                <span className="text-sm font-bold text-emerald-700">${m.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 p-6">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">{content.closing}</p>
      </section>
    </div>
  );
}

export default function ProposalsPage() {
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ProposalContent | null>(mockProposals[0].content);

  const { register, handleSubmit, formState: { errors } } = useForm<ProposalForm>({
    resolver: zodResolver(proposalSchema),
    defaultValues: { leadId: "8", projectType: "Web Application", budget: "$5K – $15K", timeline: "2 months" },
  });

  function onSubmit(_data: ProposalForm) {
    setGenerating(true);
    setGeneratedContent(null);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedContent(mockProposals[0].content);
    }, 2500);
  }

  return (
    <div className="flex h-full">
      {/* Left: Form */}
      <div className="w-[360px] flex-shrink-0 overflow-y-auto border-r border-[var(--border)] bg-white p-6 scrollbar-hide">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Proposal Studio</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">AI generates a tailored proposal in seconds</p>
          </div>

          {/* Lead */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Lead</label>
            <select {...register("leadId")} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all">
              <option value="">Select a lead...</option>
              {mockLeads.map((l) => <option key={l.id} value={l.id}>{l.company} — {l.contactName}</option>)}
            </select>
            {errors.leadId && <p className="text-xs text-red-500">{errors.leadId.message}</p>}
          </div>

          {/* Project type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Project Type</label>
            <select {...register("projectType")} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all">
              <option value="">Select type...</option>
              {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Budget Range</label>
            <select {...register("budget")} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all">
              {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Timeline</label>
            <select {...register("timeline")} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all">
              {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Requirements */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Special Requirements</label>
            <textarea
              {...register("requirements")}
              rows={4}
              placeholder="Any special requirements, tech stack preferences, integrations needed..."
              className="resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all placeholder:text-[var(--text-muted)]"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? "Generating..." : "Generate AI Proposal"}
          </button>
        </form>
      </div>

      {/* Right: Preview */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[var(--surface)]">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-3">
          <p className="text-sm font-semibold text-[var(--text-secondary)]">Preview</p>
          <div className="flex items-center gap-2">
            {[
              { label: "Edit", icon: Edit },
              { label: "Copy Link", icon: Copy },
              { label: "Share", icon: Share2 },
              { label: "Export PDF", icon: Download },
            ].map(({ label, icon: Icon }) => (
              <button key={label} className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {generating && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">AI is crafting your proposal...</p>
              </motion.div>
            )}
            {!generating && generatedContent && (
              <motion.div key="proposal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <ProposalPreviewDoc content={generatedContent} />
              </motion.div>
            )}
            {!generating && !generatedContent && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 border border-[var(--border)] flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-[var(--accent-blue)]" />
                </div>
                <p className="text-[var(--text-secondary)] font-medium">Fill the form and generate your proposal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
