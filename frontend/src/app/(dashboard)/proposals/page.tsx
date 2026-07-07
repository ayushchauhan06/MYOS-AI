"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Download, Share2, Copy, Edit, CheckCircle, X, Mail, MessageCircle, Check } from "lucide-react";
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
    <div id="proposal-print-area" className="min-h-full bg-white rounded-2xl border border-[var(--border)] p-10 font-[var(--font-geist-sans)] shadow-[var(--shadow-sm)]">
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

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalTitle: string;
  leadName: string;
  leadId: string;
}

function ShareModal({ isOpen, onClose, proposalTitle, leadName, leadId }: ShareModalProps) {
  const [isPublic, setIsPublic] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/proposals/share/${leadId}`
    : `https://myos.ai/proposals/share/${leadId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xl space-y-6"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="font-bold text-sm text-[var(--text-primary)]">Share AI Proposal</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[var(--surface)] p-4 border border-[var(--border)]">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Public Link Sharing</p>
            <p className="text-xs text-[var(--text-muted)]">Anyone with the link can view this document</p>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none ${
              isPublic ? "bg-[var(--accent-blue)]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPublic ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Public Link</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={isPublic ? shareUrl : "Public sharing is disabled"}
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-secondary)] outline-none"
            />
            <button
              disabled={!isPublic}
              onClick={handleCopy}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 text-xs font-semibold text-white shadow hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2 border-t border-[var(--border)] pt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Quick Channels</label>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`mailto:?subject=${encodeURIComponent(`Proposal: ${proposalTitle}`)}&body=${encodeURIComponent(
                `Hi ${leadName},\n\nI have generated a customized proposal for our project. You can review the details here:\n${shareUrl}\n\nBest,\nAlex`
              )}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
            >
              <Mail className="h-4 w-4 text-blue-500" />
              Share via Email
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wa.me/?text=${encodeURIComponent(
                `Hi ${leadName}, here is the customized proposal for our project: ${shareUrl}`
              )}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              Share via WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProposalsPage() {
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ProposalContent | null>(mockProposals[0].content);
  const [shareOpen, setShareOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProposalForm>({
    resolver: zodResolver(proposalSchema),
    defaultValues: { leadId: "8", projectType: "Web Application", budget: "$5K – $15K", timeline: "2 months" },
  });

  const activeLeadId = watch("leadId");
  const activeLead = mockLeads.find((l) => l.id === activeLeadId) || mockLeads[0];

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
            {/* Edit */}
            <button
              onClick={() => {
                const el = document.getElementsByName("requirements")[0];
                if (el) el.focus();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer animate-none"
            >
              <Edit className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
              Edit
            </button>

            {/* Copy Link */}
            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}/proposals/share/${activeLead?.id || "prop"}`;
                navigator.clipboard.writeText(shareUrl);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
            >
              {linkCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Link
                </>
              )}
            </button>

            {/* Share */}
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>

            {/* Export PDF */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </button>
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

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {shareOpen && (
          <ShareModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            proposalTitle={generatedContent?.title || "AI Proposal"}
            leadName={activeLead ? `${activeLead.contactName} (${activeLead.company})` : "Client"}
            leadId={activeLead?.id || "1"}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
