"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Mail, ChevronDown } from "lucide-react";
import { mockLeads } from "@/lib/mock-data/leads";

const mockEmail = {
  subject: "Quick question about TechFlow's growth plans",
  body: `Hi Sarah,

Noticed TechFlow just expanded into enterprise — congrats on the Series A!

Companies at your stage often hit bottlenecks with manual processes around lead gen and client onboarding. We recently helped a similar SaaS reduce sales cycle by 34% with a custom automation system.

Worth a 15-minute chat this week?

Best,
Alex`,
  followUp1: "Hi Sarah — just following up on my previous email. Would love to show you a quick demo of what we built for a company similar to TechFlow.",
  followUp2: "Sarah — last follow-up from my end. If now's not the right time, totally understand. Here's a case study in case it's useful later: [link]",
};

export function EmailComposerPage() {
  const [selectedLead, setSelectedLead] = useState(mockLeads[0]);
  const [generating, setGenerating] = useState(false);
  const [email, setEmail] = useState(mockEmail);
  const [subject, setSubject] = useState(mockEmail.subject);
  const [body, setBody] = useState(mockEmail.body);

  function generateEmail() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setSubject(mockEmail.subject);
      setBody(mockEmail.body);
    }, 1500);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Email Outreach</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Compose personalized cold emails with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Composer */}
        <div className="lg:col-span-2 card p-6 space-y-5">
          {/* Lead selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Lead</label>
            <div className="relative">
              <select
                onChange={(e) => {
                  const lead = mockLeads.find((l) => l.id === e.target.value);
                  if (lead) setSelectedLead(lead);
                }}
                className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 pr-8 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
              >
                {mockLeads.map((l) => <option key={l.id} value={l.id}>{l.company} — {l.contactName}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          {/* Generate with AI */}
          <button
            onClick={generateEmail}
            disabled={generating}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:scale-[1.02] disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? "Generating..." : "Generate with AI"}
          </button>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all font-mono"
            />
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
            <Send className="h-4 w-4" />
            Send Email
          </button>
        </div>

        {/* Lead info sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Lead Info</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-[var(--text-muted)]">Company: </span><span className="font-medium">{selectedLead.company}</span></div>
              <div><span className="text-[var(--text-muted)]">Contact: </span><span className="font-medium">{selectedLead.contactName}</span></div>
              <div><span className="text-[var(--text-muted)]">Email: </span><span className="font-medium text-blue-600">{selectedLead.email}</span></div>
              <div><span className="text-[var(--text-muted)]">Score: </span><span className="font-bold text-emerald-600">{selectedLead.leadScore}/100</span></div>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Icebreaker</h3>
            <p className="text-xs text-[var(--text-secondary)] italic">{selectedLead.icebreaker}</p>
          </div>
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Follow-ups</h3>
            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
              <p><strong>Day 3:</strong> {mockEmail.followUp1.substring(0, 80)}...</p>
              <p><strong>Day 14:</strong> {mockEmail.followUp2.substring(0, 80)}...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
