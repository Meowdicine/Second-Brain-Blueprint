"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { notePathToHref } from "@/lib/note-url";
import { loadAchievements } from "@/lib/achievements-storage";
import type { Achievement } from "@/lib/types";
import { KPICard } from "@/components/cards/kpi-card";
import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list";
import { PromptLauncher, type PromptLauncherItem } from "@/components/dashboard/prompt-launcher";
import { ExternalLink, Filter, Search, Trophy } from "lucide-react";

const achievementPrompts: PromptLauncherItem[] = [
  {
    id: "achievement-log",
    title: "Capture outcomes",
    description: "Rewrite completed work as durable achievement bullets.",
    notePath: "20_Areas/Work/Work.md",
    prompt:
      "From this week's notes, extract completed outcomes and rewrite them as concise achievement bullets with evidence.",
  },
];

export default function AchievementsPage() {
  const [achievements] = useState<Achievement[]>(() => loadAchievements());
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");

  const tags = useMemo(() => {
    const unique = new Set<string>();
    achievements.forEach((item) => {
      if (item.tag) unique.add(item.tag);
    });
    return ["all", ...Array.from(unique)];
  }, [achievements]);

  const filtered = useMemo(() => {
    return achievements.filter((item) => {
      const matchesTag = tagFilter === "all" || item.tag === tagFilter;
      const lowerQuery = query.trim().toLowerCase();
      const matchesQuery =
        lowerQuery.length === 0 ||
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.tag ?? "").toLowerCase().includes(lowerQuery);
      return matchesTag && matchesQuery;
    });
  }, [achievements, query, tagFilter]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-4xl font-bold text-transparent">
            Achievements
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review finished outcomes here, then push the durable version back into notes.
          </p>
        </div>

        <KPICard title="Agent Workflow" showBeam={false}>
          <div className="space-y-3 text-sm">
            <p className="text-slate-200">
              This page is for review and reuse. For major updates, write in source notes and let an agent help you clean the wording.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={notePathToHref("AGENTS.md")}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-3 py-2 text-cyan-100 hover:bg-cyan-500/30"
              >
                Open AGENTS.md
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                href={notePathToHref("20_Areas/Work/Work.md")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-slate-100 hover:border-cyan-400/40 hover:text-cyan-200"
              >
                Open Work Note
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </KPICard>

        <KPICard title="Link To Next Actions" showBeam={false}>
          <div className="space-y-3 text-sm">
            <p className="text-slate-200">
              Close work on the dashboard first, then capture the finished outcome here.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-3 py-2 text-cyan-100 hover:bg-cyan-500/30"
              >
                Open Dashboard
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
            <PromptLauncher items={achievementPrompts} />
          </div>
        </KPICard>

        <KPICard title="Filters" icon={<Filter className="h-5 w-5 text-cyan-300" />} showBeam={false}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2 rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title or tag"
                className="w-full bg-transparent text-slate-100 placeholder:text-slate-400 outline-none"
              />
            </div>

            <div className="rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2">
              <select
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                className="w-full bg-transparent text-slate-100 outline-none"
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag} className="bg-slate-900 text-slate-100">
                    {tag === "all" ? "All tags" : tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </KPICard>

        <KPICard title={`Achievements (${filtered.length})`} icon={<Trophy className="h-5 w-5 text-amber-300" />} showBeam={false}>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground">No items match current filters.</p>
          ) : (
            <AnimatedList>
              {filtered.map((item, index) => (
                <AnimatedListItem key={item.id} index={index}>
                  <div className="flex items-center gap-3 rounded-lg border border-slate-600/60 bg-slate-800/60 p-3">
                    <Trophy className="h-4 w-4 flex-shrink-0 text-amber-300" />
                    <span className="flex-1 font-medium text-slate-100">{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    {item.notePath ? (
                      <Link
                        href={notePathToHref(item.notePath)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-slate-700/80 hover:text-cyan-200"
                        title="Open note"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    ) : null}
                    {item.tag ? (
                      <span className="rounded-full border border-amber-400/30 bg-amber-500/20 px-2 py-1 text-xs text-amber-300">
                        {item.tag}
                      </span>
                    ) : null}
                  </div>
                </AnimatedListItem>
              ))}
            </AnimatedList>
          )}
        </KPICard>
      </div>
    </MainLayout>
  );
}
