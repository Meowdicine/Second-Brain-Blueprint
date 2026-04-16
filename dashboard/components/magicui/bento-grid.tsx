"use client";

import { cn } from "@/lib/utils";

interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

interface BentoGridItemProps {
  className?: string;
  children: React.ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[minmax(13rem,auto)] grid-cols-1 gap-4 md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({ className, children }: BentoGridItemProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 backdrop-blur-md transition-colors hover:bg-slate-900/85",
        className
      )}
    >
      {children}
    </div>
  );
}

