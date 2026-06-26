"use client";

import { motion } from "framer-motion";
import { Play, Pause, Trash2, MoreHorizontal, Mail, MessageCircle, Zap } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useCampaignStore } from "@/lib/store/useCampaignStore";
import { cardVariants } from "@/lib/utils";
import type { Campaign } from "@/lib/types";

interface CampaignCardProps {
  campaign: Campaign;
  delay?: number;
}

const statusConfig = {
  DRAFT: { label: "Draft", bg: "bg-gray-100 text-gray-600" },
  ACTIVE: { label: "Active", bg: "bg-emerald-100 text-emerald-700" },
  PAUSED: { label: "Paused", bg: "bg-amber-100 text-amber-700" },
  COMPLETED: { label: "Completed", bg: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 text-red-600" },
};

const typeConfig = {
  EMAIL: { icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
  WHATSAPP: { icon: MessageCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  COMBINED: { icon: Zap, color: "text-violet-600", bg: "bg-violet-50" },
};

export function CampaignCard({ campaign, delay = 0 }: CampaignCardProps) {
  const { updateCampaignStatus, deleteCampaign } = useCampaignStore();
  const status = statusConfig[campaign.status];
  const type = typeConfig[campaign.type];
  const TypeIcon = type.icon;

  const openRate = campaign.emailsSent > 0 ? Math.round((campaign.opens / campaign.emailsSent) * 100) : 0;
  const replyRate = campaign.emailsSent > 0
    ? Math.round((campaign.replies / campaign.emailsSent) * 100)
    : campaign.totalLeads > 0
    ? Math.round((campaign.replies / campaign.totalLeads) * 100)
    : 0;

  const progress = campaign.totalLeads > 0
    ? Math.round(((campaign.emailsSent || campaign.replies) / campaign.totalLeads) * 100)
    : 0;

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}
      transition={{ delay, duration: 0.3 }}
      className="card flex flex-col gap-4 p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl", type.bg)}>
            <TypeIcon className={cn("h-5 w-5", type.color)} />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-tight">{campaign.name}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{campaign.type}</p>
          </div>
        </div>
        <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex-shrink-0", status.bg)}>
          {status.label}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Leads", value: campaign.totalLeads },
          { label: "Sent", value: campaign.emailsSent || campaign.replies },
          { label: "Open Rate", value: `${openRate}%` },
          { label: "Replies", value: campaign.replies },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-base font-bold text-[var(--text-primary)]">{value}</p>
            <p className="text-[11px] text-[var(--text-muted)]">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-[var(--text-muted)]">Progress</span>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)]">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--surface-2)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: delay + 0.2 }}
            className="h-full rounded-full"
            style={{ background: campaign.status === "ACTIVE" ? "#059669" : "#2563EB" }}
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
        <span className="text-[11px] text-[var(--text-muted)]">
          {campaign.updatedAt ? `Updated ${formatRelativeTime(campaign.updatedAt)}` : "—"}
        </span>
        <div className="flex items-center gap-1">
          {campaign.status === "ACTIVE" ? (
            <button
              onClick={() => updateCampaignStatus(campaign.id, "PAUSED")}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-amber-50 text-[var(--text-muted)] hover:text-amber-600 transition-colors"
            >
              <Pause className="h-3.5 w-3.5" />
            </button>
          ) : campaign.status === "PAUSED" || campaign.status === "DRAFT" ? (
            <button
              onClick={() => updateCampaignStatus(campaign.id, "ACTIVE")}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-emerald-50 text-[var(--text-muted)] hover:text-emerald-600 transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
            </button>
          ) : null}
          <button
            onClick={() => deleteCampaign(campaign.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
