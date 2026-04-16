"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps {
  className?: string;
  children: React.ReactNode;
}

export function MagicCard({ className, children }: MagicCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/60 p-4 transition-colors",
        className
      )}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300",
          isHovering && "opacity-100"
        )}
        style={{
          background: `radial-gradient(280px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.16), transparent 55%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

