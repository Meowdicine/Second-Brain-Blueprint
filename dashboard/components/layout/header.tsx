"use client";

import { Clock, Sparkles, Zap } from "lucide-react";

interface HeaderProps {
  lastUpdated?: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-700/70 bg-slate-900/55 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="hidden items-center gap-2 md:flex">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/35 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-100">
            <Zap className="h-3.5 w-3.5" />
            Execution
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-600/70 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-300">
            <Sparkles className="h-3.5 w-3.5" />
            Live Board
          </span>
        </div>

        {lastUpdated ? (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Clock className="h-4 w-4 text-cyan-200" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        ) : (
          <div />
        )}
      </div>
    </header>
  );
}
