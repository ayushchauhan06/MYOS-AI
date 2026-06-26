import type { Metadata } from "next";
import { mockLeads } from "@/lib/mock-data/leads";
import { formatRelativeTime } from "@/lib/utils";
import { Mail, MessageCircle, ThumbsUp, Minus, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Response Tracker — MYOS AI",
  description: "Track and manage all replies from your leads in one place.",
};

const mockResponses = mockLeads
  .filter((l) => ["REPLIED", "MEETING_SCHEDULED", "NEGOTIATION"].includes(l.stage))
  .map((l) => ({
    lead: l,
    channel: Math.random() > 0.5 ? "email" : "whatsapp",
    sentiment: (["positive", "positive", "neutral", "negative"] as const)[Math.floor(Math.random() * 4)],
    preview: `Thanks for reaching out! I'd love to learn more about how ${l.company} could benefit from your solution...`,
    receivedAt: l.updatedAt,
    nextAction: "Schedule a 15-minute discovery call this week",
    closingProbability: l.leadScore,
  }));

const sentimentConfig = {
  positive: { label: "Positive", bg: "bg-emerald-50 text-emerald-700", icon: ThumbsUp },
  neutral: { label: "Neutral", bg: "bg-gray-100 text-gray-600", icon: Minus },
  negative: { label: "Negative", bg: "bg-red-50 text-red-600", icon: ThumbsDown },
};

export default function ResponsesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Response Tracker</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {mockResponses.length} replies from leads this month
          </p>
        </div>
        <div className="flex items-center gap-3">
          {["All", "Positive", "Neutral", "Negative"].map((f) => (
            <button key={f} className={cn("rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium transition-colors",
              f === "All" ? "bg-[var(--accent-blue)] text-white border-[var(--accent-blue)]" : "bg-white text-[var(--text-secondary)] hover:bg-[var(--surface)]"
            )}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
              {["Lead", "Channel", "Preview", "Sentiment", "Closing %", "Next Action", "Received"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {mockResponses.map(({ lead, channel, sentiment, preview, receivedAt, nextAction, closingProbability }) => {
              const sc = sentimentConfig[sentiment];
              const SentIcon = sc.icon;
              return (
                <tr key={lead.id} className="hover:bg-[var(--surface)] transition-colors cursor-pointer">
                  <td className="px-5 py-3">
                    <p className="font-medium text-[var(--text-primary)]">{lead.company}</p>
                    <p className="text-xs text-[var(--text-muted)]">{lead.contactName}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold w-fit",
                      channel === "email" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                    )}>
                      {channel === "email" ? <Mail className="h-3 w-3" /> : <MessageCircle className="h-3 w-3" />}
                      {channel === "email" ? "Email" : "WhatsApp"}
                    </span>
                  </td>
                  <td className="px-5 py-3 max-w-[200px]">
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{preview}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold w-fit", sc.bg)}>
                      <SentIcon className="h-3 w-3" />
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold text-emerald-700">{closingProbability}%</span>
                  </td>
                  <td className="px-5 py-3 max-w-[180px]">
                    <p className="text-xs text-[var(--text-secondary)]">{nextAction}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(receivedAt)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
