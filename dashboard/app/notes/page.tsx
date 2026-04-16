import Link from "next/link";
import { ExternalLink, FileText, Sparkles } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { KPICard } from "@/components/cards/kpi-card";
import { notePathToHref } from "@/lib/note-url";
import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list";
import {
  PromptLauncher,
  type PromptLauncherItem,
} from "@/components/dashboard/prompt-launcher";
import { ExternalLaunchButton } from "@/components/common/external-launch-button";

const promptItems: PromptLauncherItem[] = [
  {
    id: "work-triage",
    title: "Work triage",
    description: "Turn the current work area into the next shippable action.",
    notePath: "20_Areas/Work/Work.md",
    prompt:
      "Based on 20_Areas/Work and 10_Projects, identify the highest-leverage next step and rewrite it as a shippable action.",
  },
  {
    id: "learning-synthesis",
    title: "Learning synthesis",
    description: "Extract durable takeaways from recent notes.",
    notePath: "20_Areas/Learning/Learning.md",
    prompt:
      "Based on my recent source notes and 20_Areas/Learning, extract the three most durable takeaways and suggest where they should be linked.",
  },
  {
    id: "operations-review",
    title: "Operations review",
    description: "Run a maintenance-oriented pass over the system.",
    notePath: "20_Areas/Operations/Operations.md",
    prompt:
      "Based on 20_Areas/Operations, DASHBOARD.md, and 99_System/Guides/WORKFLOW.md, identify the main maintenance bottleneck and propose a cleanup pass.",
  },
];

export default function NotesPage() {
  const noteDomains = [
    {
      title: "Work",
      description: "Active delivery notes, project briefs, and execution context.",
      links: [
        "20_Areas/Work/Work.md",
        "10_Projects/Sample-Project-Launch.md",
      ],
    },
    {
      title: "Learning",
      description: "Source ingestion, synthesis, and topic development notes.",
      links: [
        "20_Areas/Learning/Learning.md",
        "99_System/Templates/Source-Ingest-Template.md",
      ],
    },
    {
      title: "Operations",
      description: "Maintenance, weekly review, and workflow health notes.",
      links: [
        "20_Areas/Operations/Operations.md",
        "99_System/Guides/WORKFLOW.md",
      ],
    },
    {
      title: "System",
      description: "Control-layer files, privacy rules, and starter guides.",
      links: [
        "AGENTS.md",
        "CLAUDE.md",
        "PRIVACY.md",
        "99_System/Guides/CURSOR_PROMPTS.md",
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-4xl font-bold text-transparent">
            Notes
          </h1>
          <p className="mt-2 text-muted-foreground">
            Use the dashboard for navigation. Use source notes and agents for durable writing.
          </p>
        </div>

        <KPICard title="Work With An Agent" icon={<Sparkles className="h-5 w-5 text-cyan-300" />} showBeam={false}>
          <div className="space-y-3 text-sm">
            <p className="text-slate-200">
              Major writing, restructuring, and synthesis should happen in notes, not inside dashboard state.
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
                href={notePathToHref("99_System/Guides/WORKFLOW.md")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-slate-100 hover:border-cyan-400/40 hover:text-cyan-200"
              >
                Open Workflow
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </KPICard>

        <KPICard title="Prompt Launcher" icon={<Sparkles className="h-5 w-5 text-cyan-300" />} showBeam={false}>
          <PromptLauncher items={promptItems} />
        </KPICard>

        <KPICard title="External Tools" icon={<ExternalLink className="h-5 w-5 text-cyan-300" />} showBeam={false}>
          <div className="flex flex-wrap gap-2">
            <ExternalLaunchButton url="https://tasks.google.com" label="Google Tasks" />
            <ExternalLaunchButton url="https://gemini.google.com" label="Gemini" />
            <ExternalLaunchButton url="https://drive.google.com" label="Google Drive" />
            <ExternalLaunchButton url="https://notebooklm.google.com" label="NotebookLM" />
          </div>
        </KPICard>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {noteDomains.map((domain) => (
            <KPICard
              key={domain.title}
              title={domain.title}
              icon={<FileText className="h-5 w-5 text-cyan-300" />}
              showBeam={false}
            >
              <p className="mb-3 text-sm text-muted-foreground">{domain.description}</p>
              <AnimatedList>
                {domain.links.map((pathValue, index) => (
                  <AnimatedListItem key={pathValue} index={index}>
                    <Link
                      href={notePathToHref(pathValue)}
                      className="flex items-center justify-between rounded-lg border border-slate-600/60 bg-slate-800/60 p-3 text-sm text-slate-100 hover:border-cyan-400/40 hover:text-cyan-200"
                    >
                      <span>{pathValue}</span>
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    </Link>
                  </AnimatedListItem>
                ))}
              </AnimatedList>
            </KPICard>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
