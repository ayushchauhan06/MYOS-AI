"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export function TrendIndicator({ value, label, className, size = "sm" }: TrendIndicatorProps) {
  const isUp = value > 0;
  const isDown = value < 0;
  const isFlat = value === 0;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-full font-semibold",
          size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-sm",
          isUp && "bg-emerald-50 text-emerald-700",
          isDown && "bg-red-50 text-red-600",
          isFlat && "bg-gray-100 text-gray-500"
        )}
      >
        {isUp && <TrendingUp className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />}
        {isDown && <TrendingDown className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />}
        {isFlat && <Minus className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />}
        {Math.abs(value).toFixed(1)}%
      </span>
      {label && (
        <span className="text-xs text-[var(--text-muted)]">{label}</span>
      )}
    </div>
  );
}
