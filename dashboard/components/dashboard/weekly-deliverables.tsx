"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { OpenNoteButton } from "@/components/common/open-note-button";

interface DeliverableItem {
  id: string;
  title: string;
  type: string;
  status: string;
  link: string;
  notePath?: string;
}

interface WeeklyDeliverablesProps {
  deliverables: DeliverableItem[];
}

export function WeeklyDeliverables({ deliverables }: WeeklyDeliverablesProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Pick two priorities this week and close them with note evidence.
      </p>
      <div className="space-y-2">
        {deliverables.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-800/60 p-3 transition-colors hover:bg-slate-800"
          >
            {item.notePath ? (
              <OpenNoteButton
                notePath={item.notePath}
                className="flex flex-1 items-center gap-2 font-medium transition-colors hover:text-cyan-200"
              >
                <FileText className="h-4 w-4 flex-shrink-0 text-cyan-300" />
                {item.title}
              </OpenNoteButton>
            ) : (
              <Link
                href={item.link}
                className="flex flex-1 items-center gap-2 font-medium transition-colors hover:text-cyan-200"
              >
                <FileText className="h-4 w-4 flex-shrink-0 text-cyan-300" />
                {item.title}
              </Link>
            )}
            {item.notePath ? (
              <OpenNoteButton
                notePath={item.notePath}
                className="text-xs text-muted-foreground hover:text-cyan-200"
              >
                Open note
              </OpenNoteButton>
            ) : (
              <Link
                href={item.link}
                className="text-xs text-muted-foreground hover:text-cyan-200"
              >
                Open goal
              </Link>
            )}
            <Badge
              variant="secondary"
              className={
                item.status === "done"
                  ? "border-emerald-400/30 bg-emerald-500/20 text-emerald-300"
                  : "border-amber-400/30 bg-amber-500/20 text-amber-300"
              }
            >
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
