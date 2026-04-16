import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckSquare, Compass, ExternalLink, Sparkles, Target } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { getAreaData } from "@/lib/data";
import type { StarterGoal } from "@/lib/types";
import { notePathToHref } from "@/lib/note-url";
import { KPICard } from "@/components/cards/kpi-card";
import {
  PromptLauncher,
  type PromptLauncherItem,
} from "@/components/dashboard/prompt-launcher";

interface GoalPageProps {
  params: Promise<{ slug: string }>;
}

function parseGoal(slug: string): StarterGoal | null {
  if (slug === "work" || slug === "learning" || slug === "operations") {
    return slug;
  }
  return null;
}

export default async function GoalPage({ params }: GoalPageProps) {
  const { slug } = await params;
  const goal = parseGoal(slug);

  if (!goal) {
    notFound();
  }

  const areaData = getAreaData(goal);
  const promptItems: PromptLauncherItem[] = areaData.prompts.map((prompt, index) => ({
    id: `${goal}-${index + 1}`,
    title: `${areaData.title} prompt ${index + 1}`,
    description: "Copy this into your agent to continue the current area.",
    notePath: areaData.markdownLink,
    prompt,
  }));

  return (
    <MainLayout lastUpdated={areaData.lastUpdated}>
      <div className="space-y-6">
        <div className="space-y-3">
          <Link
            href="/goals"
            className="inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100"
          >
            <Compass className="h-4 w-4" />
            Back to goals
          </Link>
          <div>
            <h1 className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-4xl font-bold text-transparent">
              {areaData.title}
            </h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">{areaData.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <KPICard title="Key Metrics" icon={<Target className="h-5 w-5 text-cyan-300" />} showBeam={false}>
            <div className="space-y-2">
              {areaData.kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="flex items-center justify-between rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-sm"
                >
                  <span className="text-slate-300">{kpi.label}</span>
                  <span className="font-medium text-slate-100">{kpi.value}</span>
                </div>
              ))}
            </div>
          </KPICard>

          <KPICard title="Current Focus" icon={<Compass className="h-5 w-5 text-cyan-300" />} showBeam={false}>
            <p className="text-sm text-slate-200">{areaData.focus}</p>
            <div className="mt-4">
              <Link
                href={notePathToHref(areaData.markdownLink)}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-500/30"
              >
                Open source note
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </KPICard>

          <KPICard title="Checkpoints" icon={<CheckSquare className="h-5 w-5 text-cyan-300" />} showBeam={false}>
            <div className="space-y-2">
              {areaData.checkpoints.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </KPICard>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <KPICard title="Prompt Launcher" icon={<Sparkles className="h-5 w-5 text-cyan-300" />} showBeam={false}>
            <PromptLauncher items={promptItems} />
          </KPICard>

          <KPICard title="Next Actions" icon={<CheckSquare className="h-5 w-5 text-cyan-300" />} showBeam={false}>
            <div className="space-y-2">
              {areaData.nextActions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-sm text-slate-200"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </KPICard>
        </div>
      </div>
    </MainLayout>
  );
}
