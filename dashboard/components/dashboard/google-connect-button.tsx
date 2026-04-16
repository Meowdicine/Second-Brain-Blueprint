"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoogleConnectButtonProps {
  className?: string;
}

export function GoogleConnectButton({ className }: GoogleConnectButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onConnect() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/integrations/google/auth-url", {
        cache: "no-store",
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        authUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.authUrl) {
        throw new Error(payload.error || "Failed to start Google OAuth.");
      }

      window.location.href = payload.authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect Google.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <Button
        type="button"
        size="sm"
        onClick={onConnect}
        disabled={loading}
        className={className}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Connect Google Tasks
      </Button>
      {error ? <p className="text-xs text-amber-300">{error}</p> : null}
    </div>
  );
}
