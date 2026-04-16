import { existsSync } from "fs";
import path from "path";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { KPICard } from "@/components/cards/kpi-card";
import { GoogleConnectButton } from "@/components/dashboard/google-connect-button";
import { notePathToHref } from "@/lib/note-url";
import {
  getHomeData,
  getLearningData,
  getOperationsData,
  getWorkData,
} from "@/lib/data";
import { getGoogleIntegrationStatus } from "@/lib/integrations/google/tasks";

export const dynamic = "force-dynamic";

interface SourceStatus {
  name: string;
  ok: boolean;
  detail: string;
  sourcePath: string;
  notePath?: string;
}

interface SettingsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function toSingleValue(input: string | string[] | undefined): string | undefined {
  if (Array.isArray(input)) return input[0];
  return input;
}

function getSourceStatuses(): SourceStatus[] {
  const repoRoot = path.join(process.cwd(), "..");
  const statuses: SourceStatus[] = [];

  const jsonChecks: Array<{
    name: string;
    file: string;
    loader: () => unknown;
  }> = [
    { name: "home.json", file: "dashboard-data/home.json", loader: () => getHomeData() },
    { name: "work.json", file: "dashboard-data/work.json", loader: () => getWorkData() },
    { name: "learning.json", file: "dashboard-data/learning.json", loader: () => getLearningData() },
    { name: "operations.json", file: "dashboard-data/operations.json", loader: () => getOperationsData() },
  ];

  for (const item of jsonChecks) {
    try {
      item.loader();
      statuses.push({
        name: item.name,
        ok: true,
        detail: "Loaded successfully",
        sourcePath: item.file,
      });
    } catch (error) {
      statuses.push({
        name: item.name,
        ok: false,
        detail: `Failed to load: ${error instanceof Error ? error.message : "Unknown error"}`,
        sourcePath: item.file,
      });
    }
  }

  const noteChecks = [
    "README.md",
    "PRIVACY.md",
    "DASHBOARD.md",
    "20_Areas/Work/Work.md",
    "20_Areas/Learning/Learning.md",
    "20_Areas/Operations/Operations.md",
  ];

  for (const relativePath of noteChecks) {
    const fullPath = path.join(repoRoot, relativePath);
    const ok = existsSync(fullPath);
    statuses.push({
      name: path.basename(relativePath),
      ok,
      detail: ok ? "Source note exists" : "Missing expected starter note",
      sourcePath: relativePath,
      notePath: relativePath,
    });
  }

  return statuses;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const homeData = getHomeData();
  const statuses = getSourceStatuses();
  const integrationStatus = await getGoogleIntegrationStatus();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const oauthState = toSingleValue(resolvedSearchParams.google);
  const oauthDetail = toSingleValue(resolvedSearchParams.detail);

  const docsLinks = [
    "README.md",
    "PRIVACY.md",
    "AGENTS.md",
    "CLAUDE.md",
    "99_System/Agent-Kernel.md",
    "99_System/Guides/WORKFLOW.md",
  ];

  return (
    <MainLayout lastUpdated={homeData.lastUpdated}>
      <div className="space-y-6">
        <div>
          <h1 className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-4xl font-bold text-transparent">
            Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Governance and integration console for the optional dashboard layer.
          </p>
        </div>

        <KPICard title="Dashboard Governance" icon={<Settings className="h-5 w-5 text-cyan-300" />} showBeam={false}>
          <p className="text-sm text-slate-200">
            The dashboard is display-first. Source of truth remains Markdown notes plus structured starter data.
          </p>
        </KPICard>

        <KPICard title="Google Integration" icon={<ExternalLink className="h-5 w-5 text-cyan-300" />} showBeam={false}>
          <div className="space-y-3 text-sm">
            <div className="space-y-2 rounded-lg border border-slate-600/60 bg-slate-800/60 p-3">
              <p className="text-slate-100">
                Configured: <span className={integrationStatus.configured ? "text-emerald-300" : "text-amber-300"}>{integrationStatus.configured ? "Yes" : "No"}</span>
              </p>
              <p className="text-slate-100">
                Connected: <span className={integrationStatus.connected ? "text-emerald-300" : "text-amber-300"}>{integrationStatus.connected ? "Yes" : "No"}</span>
              </p>
              <p className="text-xs text-muted-foreground">Token path: {integrationStatus.tokenPath}</p>
              <p className="text-xs text-muted-foreground">
                External launch bridge: {integrationStatus.externalOpenEnabled ? "Enabled" : "Disabled"}
              </p>
              <p className="text-xs text-muted-foreground">
                Sync mode: {integrationStatus.singleListMode ? "Single list" : "Multi list"}
              </p>
              <p className="text-xs text-muted-foreground">
                Primary task list: {integrationStatus.primaryTaskListName}
              </p>
              <p className="text-xs text-muted-foreground">
                Task lists: Work={integrationStatus.taskListNames.work}, Learning={integrationStatus.taskListNames.learning}, Operations={integrationStatus.taskListNames.operations}, General={integrationStatus.taskListNames.general}
              </p>
              {!integrationStatus.configured ? (
                <p className="text-xs text-amber-300">
                  Missing env: {integrationStatus.missingEnv.join(", ")}
                </p>
              ) : null}
              {integrationStatus.lastError ? (
                <p className="text-xs text-amber-300">Last error: {integrationStatus.lastError}</p>
              ) : null}
            </div>

            {oauthState ? (
              <div className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                OAuth result: {oauthState}
                {oauthDetail ? ` (${oauthDetail})` : ""}
              </div>
            ) : null}

            {!integrationStatus.connected ? (
              <GoogleConnectButton className="bg-cyan-500/25 text-cyan-100 border border-cyan-400/40 hover:bg-cyan-500/35" />
            ) : null}
          </div>
        </KPICard>

        <KPICard title="Data Source Status" icon={<FileCheck2 className="h-5 w-5 text-cyan-300" />} showBeam={false}>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div
                key={`${status.name}-${status.sourcePath}`}
                className="flex flex-col gap-2 rounded-lg border border-slate-600/60 bg-slate-800/60 p-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-2">
                  {status.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <TriangleAlert className="h-4 w-4 text-amber-300" />
                  )}
                  <p className="text-sm text-slate-100">{status.name}</p>
                </div>
                <p className="text-xs text-muted-foreground md:flex-1 md:mx-4">{status.detail}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{status.sourcePath}</span>
                  {status.notePath ? (
                    <Link
                      href={notePathToHref(status.notePath)}
                      className="inline-flex items-center gap-1 text-xs text-cyan-200 hover:text-cyan-100"
                    >
                      Open note
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </KPICard>

        <KPICard title="Process References" icon={<ExternalLink className="h-5 w-5 text-cyan-300" />} showBeam={false}>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {docsLinks.map((pathValue) => (
              <Link
                key={pathValue}
                href={notePathToHref(pathValue)}
                className="inline-flex items-center justify-between rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 hover:border-cyan-400/40 hover:text-cyan-200"
              >
                <span>{pathValue}</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </KPICard>
      </div>
    </MainLayout>
  );
}
