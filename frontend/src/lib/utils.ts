import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Variants } from "framer-motion";

// ── Classname helper ──────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Formatters ────────────────────────────────────────────────────────────────
export function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (compact && value >= 1000) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ── Framer Motion Variants ────────────────────────────────────────────────────
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -8 },
};

export const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.05 },
  },
};

export const cardVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.2 } },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.15 } },
};

export const springExpand = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

// ── Color helpers ─────────────────────────────────────────────────────────────
export function getLeadScoreColor(score: number): string {
  if (score >= 75) return "#059669"; // green
  if (score >= 50) return "#D97706"; // amber
  return "#DC2626"; // red
}

export function getLeadScoreBg(score: number): string {
  if (score >= 75) return "bg-emerald-50 text-emerald-700";
  if (score >= 50) return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

export function getStageColor(stage: string): string {
  const map: Record<string, string> = {
    NEW: "#6B7280",
    CONTACT_READY: "#3B82F6",
    EMAIL_SENT: "#8B5CF6",
    WHATSAPP_SENT: "#10B981",
    REPLIED: "#F59E0B",
    MEETING_SCHEDULED: "#EC4899",
    PROPOSAL_SENT: "#6366F1",
    NEGOTIATION: "#F97316",
    WON: "#059669",
    LOST: "#EF4444",
  };
  return map[stage] ?? "#6B7280";
}

export function getStageBg(stage: string): string {
  const map: Record<string, string> = {
    NEW: "bg-gray-100 text-gray-600",
    CONTACT_READY: "bg-blue-100 text-blue-700",
    EMAIL_SENT: "bg-purple-100 text-purple-700",
    WHATSAPP_SENT: "bg-emerald-100 text-emerald-700",
    REPLIED: "bg-amber-100 text-amber-700",
    MEETING_SCHEDULED: "bg-pink-100 text-pink-700",
    PROPOSAL_SENT: "bg-indigo-100 text-indigo-700",
    NEGOTIATION: "bg-orange-100 text-orange-700",
    WON: "bg-green-100 text-green-700",
    LOST: "bg-red-100 text-red-600",
  };
  return map[stage] ?? "bg-gray-100 text-gray-600";
}
