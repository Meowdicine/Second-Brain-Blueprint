import Link from "next/link";
import {
  Activity,
  Brain,
  BriefcaseBusiness,
  ClipboardList,
  Sparkles,
  Wrench,
} from "lucide-react";
import {
  getGoogleNextActionsViewData,
  getHomeData,
  getLearningData,
  getOperationsData,
  getWorkData,
} from "@/lib/data";
import { MainLayout } from "@/components/layout/main-layout";
import { MiniBarChart } from "@/components/charts/mini-bar-chart";
import { GoogleNextActionsPanel } from "@/components/dashboard/google-next-actions-panel";
import { CockpitAchievementSpotlight } from "@/components/dashboard/cockpit-achievement-spotlight";
import { AchievementsWidget } from "@/components/dashboard/achievements-widget";
import { WeeklyDeliverables } from "@/components/dashboard/weekly-deliverables";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BentoGrid, BentoGridItem } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const homeData = getHomeData();
  const workData = getWorkData();
  const learningData = getLearningData();
  const operationsData = getOperationsData();
  const googleView = await getGoogleNextActionsViewData();

  const activityData = [
    { name: "Work", value: homeData.scoreboards.work.shippedOutputs },
    { name: "Learning", value: homeData.scoreboards.learning.synthesisNotes },
    { name: "Ops", value: homeData.scoreboards.operations.maintenanceTasks },
  ];

  const areaCards = [
    {
      href: "/goals/work",
      title: workData.title,
      subtitle: `${homeData.scoreboards.work.activeProjects} active project(s)`,
      focus: homeData.scoreboards.work.currentFocus,
      icon: BriefcaseBusiness,
      accent: "text-cyan-200",
    },
    {
      href: "/goals/learning",
      title: learningData.title,
      subtitle: `${homeData.scoreboards.learning.sourcesIngested} source(s) ingested`,
      focus: homeData.scoreboards.learning.currentFocus,
      icon: Brain,
      accent: "text-indigo-200",
    },
    {
      href: "/goals/operations",
      title: operationsData.title,
      subtitle: `${homeData.scoreboards.operations.maintenanceTasks} maintenance task(s)`,
      focus: homeData.scoreboards.operations.currentFocus,
      icon: Wrench,
      accent: "text-emerald-200",
    },
  ];

  return (
    <MainLayout lastUpdated={homeData.lastUpdated}>
      <div className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-5">
        <BlurFade delay={0.05}>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1.15fr_1fr]">
            <MagicCard className="rounded-3xl border-cyan-400/30 bg-slate-900/55 p-0">
              <div className="relative overflow-hidden rounded-3xl border border-cyan-400/25 bg-[radial-gradient(circle_at_8%_20%,rgba(20,184,166,0.2),transparent_45%),radial-gradient(circle_at_82%_12%,rgba(56,189,248,0.24),transparent_38%),linear-gradient(145deg,rgba(2,6,23,0.85),rgba(15,23,42,0.85))] p-6 md:p-7">
                <div className="pointer-events-none absolute -top-16 right-[-3.2rem] h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/90">
                    Markdown first
                  </p>
                  <h1 className="mt-2 bg-gradient-to-r from-cyan-200 via-sky-100 to-blue-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
                    Second Brain Dashboard
                  </h1>
                  <p className="mt-3 max-w-xl text-sm text-slate-200/90">
                    Use the dashboard as a control surface, not as the knowledge itself. The wiki remains the durable memory layer.
                  </p>
                </div>
              </div>
            </MagicCard>
            <CockpitAchievementSpotlight />
          </div>
        </BlurFade>

        <BlurFade delay={0.1}>
          <BentoGrid className="h-full min-h-0 auto-rows-[minmax(0,1fr)] gap-5 md:grid-cols-4">
            <BentoGridItem className="min-h-0 overflow-hidden border-cyan-400/25 bg-[linear-gradient(150deg,rgba(8,47,73,0.55),rgba(2,6,23,0.86))] p-5 md:col-span-2 md:row-span-2">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-cyan-200" />
                <h3 className="text-lg font-semibold text-slate-100">Next Actions</h3>
              </div>
              <div className="max-h-[42vh] overflow-y-auto pr-1">
                <GoogleNextActionsPanel
                  initialStatus={googleView.status}
                  initialTasksByGoal={googleView.tasksByGoal}
                  fallbackActions={googleView.fallbackActions}
                />
              </div>
            </BentoGridItem>

            <BentoGridItem className="border-cyan-400/25 bg-[linear-gradient(160deg,rgba(2,6,23,0.8),rgba(15,23,42,0.78))] p-5 md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-200" />
                <h3 className="text-base font-semibold text-slate-100">Weekly Deliverables</h3>
              </div>
              <WeeklyDeliverables deliverables={homeData.weeklyDeliverables} />
            </BentoGridItem>

            {areaCards.map((item) => {
              const Icon = item.icon;
              return (
                <BentoGridItem
                  key={item.href}
                  className="border-slate-500/25 bg-[linear-gradient(150deg,rgba(15,23,42,0.72),rgba(2,6,23,0.84))] p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${item.accent}`} />
                    <h3 className="text-base font-semibold text-slate-100">{item.title}</h3>
                  </div>
                  <p className="text-sm text-slate-200">{item.subtitle}</p>
                  <p className="mt-2 text-xs text-slate-400">{item.focus}</p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex rounded-lg border border-cyan-400/35 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-500/20"
                  >
                    Open {item.title}
                  </Link>
                </BentoGridItem>
              );
            })}

            <BentoGridItem className="border-indigo-400/25 bg-[linear-gradient(150deg,rgba(30,27,75,0.45),rgba(2,6,23,0.82))] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-200" />
                <h3 className="text-base font-semibold text-slate-100">Starter Activity</h3>
              </div>
              <div className="h-48">
                <MiniBarChart data={activityData} />
              </div>
            </BentoGridItem>

            <BentoGridItem className="border-amber-400/25 bg-[linear-gradient(150deg,rgba(66,32,6,0.45),rgba(2,6,23,0.82))] p-5 md:col-span-2">
              <AchievementsWidget />
            </BentoGridItem>
          </BentoGrid>
        </BlurFade>
      </div>
    </MainLayout>
  );
}
