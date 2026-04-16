"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface ExternalLaunchButtonProps {
  url: string;
  label: string;
  className?: string;
}

export function ExternalLaunchButton({
  url,
  label,
  className,
}: ExternalLaunchButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/system/open-external", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Failed to launch external URL.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open external URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClick}
        disabled={loading}
        className={cn(
          "border-slate-500/60 bg-slate-800/70 text-slate-100 hover:bg-slate-700/80 hover:text-cyan-100",
          className
        )}
      >
        <ExternalLink className="h-4 w-4" />
        {loading ? "Opening..." : label}
      </Button>
      {error ? <p className="text-xs text-amber-300">{error}</p> : null}
    </div>
  );
}
