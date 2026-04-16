"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { BorderBeam } from "@/components/magicui/border-beam";

interface KPICardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  showBeam?: boolean;
}

export function KPICard({ title, icon, children, className, showBeam = true }: KPICardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden",
        "bg-slate-900/70 backdrop-blur-xl border border-slate-700/70",
        "rounded-2xl shadow-xl shadow-black/30",
        "hover:-translate-y-0.5 hover:bg-slate-900/85 hover:border-slate-500/70 hover:shadow-2xl",
        "transition-all duration-300",
        "p-6",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(45,212,191,0.12),transparent_48%),radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.1),transparent_50%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
      {showBeam && <BorderBeam size={250} duration={12} delay={0} />}

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-400/30">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        </div>

        <div>{children}</div>
      </div>
    </Card>
  );
}
