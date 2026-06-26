"use client";

import { motion, AnimatePresence } from "framer-motion";
import { activityFeed } from "@/lib/mock-data/analytics";
import { formatRelativeTime } from "@/lib/utils";
import {
  UserPlus, Mail, MessageSquare, Phone, CalendarCheck, CheckCircle,
} from "lucide-react";

const iconMap: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  lead_found: { icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-50" },
  email_opened: { icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
  lead_replied: { icon: MessageSquare, color: "text-violet-600", bg: "bg-violet-50" },
  whatsapp_read: { icon: Phone, color: "text-teal-600", bg: "bg-teal-50" },
  meeting_scheduled: { icon: CalendarCheck, color: "text-orange-600", bg: "bg-orange-50" },
  proposal_accepted: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
};

export function ActivityFeed() {
  return (
    <div className="card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">Activity Feed</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Live updates from your AI system</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span className="text-xs text-emerald-600 font-medium">Live</span>
        </div>
      </div>

      {/* Feed items */}
      <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-subtle)]" style={{ maxHeight: 300 }}>
        <AnimatePresence initial={false}>
          {activityFeed.map((item, i) => {
            const config = iconMap[item.type] ?? iconMap.lead_found;
            const Icon = config.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="flex items-start gap-3 px-5 py-3.5 hover:bg-[var(--surface)] transition-colors"
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] truncate-2 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <span className="flex-shrink-0 text-xs text-[var(--text-muted)] mt-0.5">
                  {formatRelativeTime(item.time)}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="border-t border-[var(--border)] px-5 py-3">
        <button className="w-full text-center text-xs font-medium text-[var(--accent-blue)] hover:underline transition-colors">
          View all activity →
        </button>
      </div>
    </div>
  );
}
