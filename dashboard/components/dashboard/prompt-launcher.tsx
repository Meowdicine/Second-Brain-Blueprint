"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import { notePathToHref } from "@/lib/note-url";

export interface PromptLauncherItem {
  id: string;
  title: string;
  prompt: string;
  notePath: string;
  description?: string;
}

interface PromptLauncherProps {
  items: PromptLauncherItem[];
}

export function PromptLauncher({ items }: PromptLauncherProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyPrompt(id: string, prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 1200);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-slate-600/60 bg-slate-800/60 p-3"
        >
          <p className="text-sm font-semibold text-slate-100">{item.title}</p>
          {item.description ? (
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyPrompt(item.id, item.prompt)}
              className="inline-flex items-center gap-2 rounded-md border border-cyan-400/40 bg-cyan-500/20 px-2.5 py-1.5 text-xs text-cyan-100 hover:bg-cyan-500/30"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedId === item.id ? "Copied" : "Copy prompt"}
            </button>
            <Link
              href={notePathToHref(item.notePath)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-500/60 bg-slate-700/60 px-2.5 py-1.5 text-xs text-slate-100 hover:border-cyan-400/40 hover:text-cyan-100"
            >
              Open note
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
