"use client";

import { useState } from "react";
import Link from "next/link";
import { notePathToHref } from "@/lib/note-url";
import { loadAchievements } from "@/lib/achievements-storage";
import type { Achievement } from "@/lib/types";
import { Trophy, ExternalLink } from "lucide-react";

const RECENT_COUNT = 5;

export function AchievementsWidget() {
  const [achievements] = useState<Achievement[]>(() => loadAchievements().slice(0, RECENT_COUNT));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-300" />
          Recent achievements
        </h3>
        <Link
          href="/achievements"
          className="text-sm text-muted-foreground hover:text-cyan-200 transition-colors"
        >
          View all
        </Link>
      </div>
      {achievements.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No achievements yet. Add your first success on the{" "}
          <Link href="/achievements" className="text-cyan-200 hover:underline">
            Achievements
          </Link>{" "}
          page.
        </p>
      ) : (
        <ul className="space-y-2">
          {achievements.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors border border-slate-700/60"
            >
              <span className="flex-1 font-medium">{a.title}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(a.date).toLocaleDateString()}
              </span>
              {a.notePath && (
                <Link
                  href={notePathToHref(a.notePath)}
                  className="p-1.5 rounded hover:bg-slate-700/80 text-muted-foreground hover:text-cyan-200"
                  title="Open note"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
              {a.tag && (
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {a.tag}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
