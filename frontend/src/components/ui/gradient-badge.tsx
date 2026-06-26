"use client";

import { cn } from "@/lib/utils";

interface GradientBadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "purple" | "green" | "pink" | "amber" | "teal";
  shimmer?: boolean;
  className?: string;
}

const variantMap = {
  blue: "from-blue-500 to-indigo-600",
  purple: "from-violet-500 to-purple-700",
  green: "from-emerald-500 to-teal-600",
  pink: "from-pink-500 to-rose-600",
  amber: "from-amber-400 to-orange-500",
  teal: "from-teal-500 to-cyan-600",
};

export function GradientBadge({
  children,
  variant = "blue",
  shimmer = false,
  className,
}: GradientBadgeProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-1 overflow-hidden rounded-full px-2.5 py-0.5 text-xs font-semibold text-white",
        `bg-gradient-to-r ${variantMap[variant]}`,
        className
      )}
    >
      {shimmer && (
        <span
          className="animate-shimmer absolute inset-0 -translate-x-full"
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
