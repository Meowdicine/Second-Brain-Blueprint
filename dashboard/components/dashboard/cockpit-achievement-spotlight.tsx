"use client";

import { type KeyboardEvent, useState } from "react";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { OpenNoteButton } from "@/components/common/open-note-button";
import type { Achievement } from "@/lib/types";

const SPOTLIGHT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "seed-work-deliverable",
    title: "Turned an active work stream into a concrete deliverable with a clear next step.",
    date: "2026-04-15",
    notePath: "20_Areas/Work/Work.md",
    tag: "work",
  },
  {
    id: "seed-learning-promotion",
    title: "Converted one source into a reusable learning synthesis.",
    date: "2026-04-15",
    notePath: "20_Areas/Learning/Learning.md",
    tag: "learning",
  },
  {
    id: "seed-operations-cleanup",
    title: "Finished a maintenance pass and reduced workflow friction.",
    date: "2026-04-15",
    notePath: "20_Areas/Operations/Operations.md",
    tag: "operations",
  },
];

function normalizeIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return ((index % length) + length) % length;
}

function formatDateEnglish(date: string): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function CockpitAchievementSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active =
    SPOTLIGHT_ACHIEVEMENTS.length > 0
      ? SPOTLIGHT_ACHIEVEMENTS[normalizeIndex(activeIndex, SPOTLIGHT_ACHIEVEMENTS.length)]
      : null;

  function step(delta: number) {
    setActiveIndex((prev) => normalizeIndex(prev + delta, SPOTLIGHT_ACHIEVEMENTS.length));
  }

  function onKeyNavigate(event: KeyboardEvent<HTMLDivElement>) {
    if (SPOTLIGHT_ACHIEVEMENTS.length <= 1) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
      event.preventDefault();
      step(1);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      step(-1);
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-amber-300/40 bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.2),transparent_48%),radial-gradient(circle_at_80%_100%,rgba(249,115,22,0.2),transparent_45%),linear-gradient(145deg,rgba(41,24,12,0.72),rgba(18,10,6,0.82))] p-4 shadow-[0_18px_40px_-22px_rgba(251,146,60,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      tabIndex={0}
      onKeyDown={onKeyNavigate}
      onWheel={(event) => {
        if (SPOTLIGHT_ACHIEVEMENTS.length <= 1) return;
        event.preventDefault();
        step(event.deltaY > 0 ? 1 : -1);
      }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-amber-300/50 bg-amber-500/20 p-1.5">
              <Trophy className="h-4 w-4 text-amber-200" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-amber-200/90">
                Achievements
              </p>
              <p className="text-sm font-semibold text-amber-50">Spotlight</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => step(-1)}
              className="rounded-md border border-amber-300/40 bg-black/20 p-1 text-amber-100 hover:bg-black/35"
              aria-label="Previous achievement"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="rounded-md border border-amber-300/40 bg-black/20 p-1 text-amber-100 hover:bg-black/35"
              aria-label="Next achievement"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {active ? (
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-amber-300/30 bg-black/20 p-3">
              <p className="text-sm font-semibold leading-5 text-amber-50">{active.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-amber-300/40 bg-amber-500/15 px-2 py-0.5 text-amber-100">
                  {formatDateEnglish(active.date)}
                </span>
                {active.tag ? (
                  <span className="rounded-full border border-orange-300/40 bg-orange-500/15 px-2 py-0.5 text-orange-100">
                    {active.tag}
                  </span>
                ) : null}
                {active.notePath ? (
                  <OpenNoteButton
                    notePath={active.notePath}
                    className="rounded-full border border-cyan-300/40 bg-cyan-500/10 px-2 py-0.5 text-cyan-100 hover:bg-cyan-500/20"
                  >
                    Open note
                  </OpenNoteButton>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
