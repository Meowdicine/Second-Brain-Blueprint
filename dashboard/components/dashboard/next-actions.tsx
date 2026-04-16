"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { TodoState } from "@/lib/types";
import { OpenNoteButton } from "@/components/common/open-note-button";

const STORAGE_KEY = "dashboard-todos";

interface NextActionItem {
  id: string;
  done: boolean;
  text: string;
  tag: string;
  notePath?: string;
}

interface NextActionsProps {
  actions: NextActionItem[];
}

function loadTodoState(): Record<string, TodoState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, TodoState>) : {};
  } catch {
    return {};
  }
}

function saveTodoState(state: Record<string, TodoState>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function NextActions({ actions }: NextActionsProps) {
  const [todoState, setTodoState] = useState<Record<string, TodoState>>(loadTodoState);

  const mergedActions = actions.map((action) => {
    const stored = todoState[action.id];
    return {
      ...action,
      done: stored?.done ?? action.done,
      completedAt: stored?.completedAt,
    };
  });

  const toggleDone = useCallback((id: string, currentDone: boolean) => {
    setTodoState((prev) => {
      const next = { ...prev };
      next[id] = {
        done: !currentDone,
        completedAt: !currentDone ? new Date().toISOString() : undefined,
      };
      saveTodoState(next);
      return next;
    });
  }, []);

  return (
    <div className="space-y-2">
      {mergedActions.map((action) => (
        <div
          key={action.id}
          className="flex items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-800/60 p-3 transition-colors hover:bg-slate-800"
        >
          <button
            type="button"
            onClick={() => toggleDone(action.id, action.done)}
            className="h-4 w-4 flex-shrink-0 rounded border border-slate-500/80 bg-slate-900/50 hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label={action.done ? "Mark undone" : "Mark done"}
          >
            {action.done ? (
              <span className="flex h-full w-full items-center justify-center rounded bg-cyan-400 text-[10px] font-bold text-slate-950">
                x
              </span>
            ) : null}
          </button>
          <div className="min-w-0 flex-1">
            {action.notePath ? (
              <OpenNoteButton
                notePath={action.notePath}
                className={cn(
                  "font-medium transition-colors hover:text-cyan-200",
                  action.done && "text-muted-foreground line-through"
                )}
              >
                {action.text}
              </OpenNoteButton>
            ) : (
              <span className={cn(action.done && "text-muted-foreground line-through")}>
                {action.text}
              </span>
            )}
            {action.completedAt ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Completed {new Date(action.completedAt).toLocaleString()}
              </p>
            ) : null}
          </div>
          {action.notePath ? (
            <OpenNoteButton
              notePath={action.notePath}
              className="flex-shrink-0 rounded p-1.5 text-muted-foreground hover:bg-slate-700/80 hover:text-cyan-200"
              title="Open note"
            >
              <ExternalLink className="h-4 w-4" />
            </OpenNoteButton>
          ) : null}
          <span className="flex-shrink-0 rounded-full border border-cyan-400/30 bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200">
            {action.tag}
          </span>
        </div>
      ))}
    </div>
  );
}
