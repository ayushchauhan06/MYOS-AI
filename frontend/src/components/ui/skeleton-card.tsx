"use client";

import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export function SkeletonCard({ className, lines = 3 }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "card animate-pulse overflow-hidden p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl bg-[var(--surface-2)]" />
        <div className="h-5 w-16 rounded-full bg-[var(--surface-2)]" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-1/3 rounded bg-[var(--surface-2)]" />
        <div className="h-7 w-2/3 rounded bg-[var(--surface-2)]" />
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-[var(--surface-2)]"
            style={{ width: `${75 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonLeadCard({ className }: { className?: string }) {
  return (
    <div className={cn("card animate-pulse overflow-hidden p-5", className)}>
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-[var(--surface-2)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded bg-[var(--surface-2)]" />
          <div className="h-3 w-1/3 rounded bg-[var(--surface-2)]" />
        </div>
        <div className="h-12 w-12 rounded-full bg-[var(--surface-2)]" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-[var(--surface-2)]" />
        <div className="h-3 w-4/5 rounded bg-[var(--surface-2)]" />
        <div className="h-3 w-3/5 rounded bg-[var(--surface-2)]" />
      </div>
      <div className="mt-4 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-20 rounded-full bg-[var(--surface-2)]" />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 flex-1 rounded-lg bg-[var(--surface-2)]" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex animate-pulse items-center gap-4 px-4 py-3", className)}>
      <div className="h-8 w-8 rounded-lg bg-[var(--surface-2)]" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-1/3 rounded bg-[var(--surface-2)]" />
        <div className="h-3 w-1/4 rounded bg-[var(--surface-2)]" />
      </div>
      <div className="h-6 w-20 rounded-full bg-[var(--surface-2)]" />
      <div className="h-6 w-16 rounded-full bg-[var(--surface-2)]" />
    </div>
  );
}
