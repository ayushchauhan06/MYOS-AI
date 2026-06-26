"use client";

import { cn } from "@/lib/utils";

export function AITypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 px-3 py-2", className)}>
      <div className="h-2 w-2 rounded-full bg-[var(--text-muted)] bounce-dot-1" />
      <div className="h-2 w-2 rounded-full bg-[var(--text-muted)] bounce-dot-2" />
      <div className="h-2 w-2 rounded-full bg-[var(--text-muted)] bounce-dot-3" />
    </div>
  );
}
