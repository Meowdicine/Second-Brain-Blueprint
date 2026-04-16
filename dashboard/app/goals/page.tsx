import Link from "next/link";
import { Brain, BriefcaseBusiness, ExternalLink, ShieldCheck, Wrench } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { getHomeData, getLearningData, getOperationsData, getWorkData } from "@/lib/data";
import { BentoGrid, BentoGridItem } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";
import { notePathToHref } from "@/lib/note-url";

export default function GoalsPage() {
  const homeData = getHomeData();
  const workData = getWorkData();
  const learningData = getLearningData();
  const operationsData = getOperationsData();

  const goals = [
    {
      slug: "work",
      title: workData.title,
      description: workData.description,
      kpis: workData.kpis,
      icon: BriefcaseBusiness,
      accent: "text-cyan-300",
    },
    {
      slug: "learning",
      title: learningData.title,
      description: learningData.description,
      kpis: learningData.kpis,
      icon: Brain,
      accent: "text-indigo-300",
    },
    {
      slug: "operations",
      title: operationsData.title,
      description: operationsData.description,
      kpis: operationsData.kpis,
      icon: Wrench,
      accent: "text-emerald-300",
    },
  ];

  return (
    <MainLayout lastUpdated={homeData.lastUpdated}>
      <div className="space-y-6">
        <div>
          <h1 className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-4xl font-bold text-transparent">
            Goals
          </h1>
          <p className="mt-2 text-muted-foreground">
            Open each starter area to review focus, checkpoints, prompts, and next actions.
          </p>
        </div>

        <BentoGrid className="auto-rows-[minmax(14rem,auto)]">
          {goals.map((goal) => {
            const Icon = goal.icon;
            return (
              <BentoGridItem key={goal.slug} className="md:col-span-1">
                <MagicCard className="h-full">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${goal.accent}`} />
                      <h3 className="text-lg font-semibold text-slate-100">{goal.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                    <div className="space-y-2">
                      {goal.kpis.slice(0, 3).map((kpi) => (
                        <div
                          key={`${goal.slug}-${kpi.label}`}
                          className="flex items-center justify-between rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-sm"
                        >
                          <span className="text-slate-300">{kpi.label}</span>
                          <span className="font-medium text-slate-100">{kpi.value}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/goals/${goal.slug}`}
                      className="inline-flex rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-500/30"
                    >
                      Open {goal.title}
                    </Link>
                  </div>
                </MagicCard>
              </BentoGridItem>
            );
          })}

          <BentoGridItem className="md:col-span-3">
            <MagicCard>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-cyan-300" />
                  <h3 className="text-lg font-semibold text-slate-100">Control Layer References</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  The dashboard is optional. The repo is designed to stay usable through Markdown plus agent entry files.
                </p>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  {[
                    "AGENTS.md",
                    "CLAUDE.md",
                    "99_System/Guides/WORKFLOW.md",
                  ].map((pathValue) => (
                    <Link
                      key={pathValue}
                      href={notePathToHref(pathValue)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-sm hover:border-cyan-400/40 hover:text-cyan-200"
                    >
                      {pathValue}
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </MagicCard>
          </BentoGridItem>
        </BentoGrid>
      </div>
    </MainLayout>
  );
}
