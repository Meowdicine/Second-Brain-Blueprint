"use client";

import { useState } from "react";
import { notePathToHref } from "@/lib/note-url";
import { cn } from "@/lib/utils";

const RECENT_NOTES_STORAGE_KEY = "launchpad-recent-notes";

function rememberRecentNote(notePath: string): void {
  if (typeof window === "undefined") return;

  try {
    const normalized = notePath.trim().replace(/\\/g, "/");
    if (!normalized) return;
    const raw = window.localStorage.getItem(RECENT_NOTES_STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as string[]) : [];
    const next = [normalized, ...existing.filter((item) => item !== normalized)].slice(0, 6);
    window.localStorage.setItem(RECENT_NOTES_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore local storage failures
  }
}

interface OpenNoteButtonProps {
  notePath: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
}

export function OpenNoteButton({
  notePath,
  className,
  title,
  children,
}: OpenNoteButtonProps) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (loading) return;
    setLoading(true);
    rememberRecentNote(notePath);

    try {
      const response = await fetch("/api/system/open-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notePath }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
      };

      if (!response.ok || !payload.ok) {
        window.location.href = notePathToHref(notePath);
      }
    } catch {
      window.location.href = notePathToHref(notePath);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      title={title}
      className={cn(className)}
    >
      {children}
    </button>
  );
}
