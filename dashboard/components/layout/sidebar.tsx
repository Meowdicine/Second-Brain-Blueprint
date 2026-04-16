"use client";

import { type ComponentType, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { notePathToHref } from "@/lib/note-url";
import type { LaunchpadAction, LaunchpadActionGroup } from "@/lib/types";
import {
  Bolt,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  ExternalLink,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  Search,
  Settings,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RECENT_ACTIONS_STORAGE_KEY = "launchpad-recent-action-ids";
const RECENT_NOTES_STORAGE_KEY = "launchpad-recent-notes";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

const GROUP_ORDER: LaunchpadActionGroup[] = [
  "do_now",
  "open_workspace",
  "review",
  "capture",
];

const GROUP_META: Record<
  LaunchpadActionGroup,
  { title: string; icon: ComponentType<{ className?: string }> }
> = {
  do_now: { title: "Do Now", icon: Bolt },
  open_workspace: { title: "Open Workspace", icon: FolderOpen },
  review: { title: "Review", icon: Search },
  capture: { title: "Capture", icon: ClipboardList },
};

function loadStoredArray(key: string, max: number): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, max);
  } catch {
    return [];
  }
}

function saveStoredArray(key: string, values: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // ignore
  }
}

function actionIcon(action: LaunchpadAction) {
  if (action.type === "open_note") return <FileText className="h-3.5 w-3.5" />;
  if (action.type === "copy_text") return <Copy className="h-3.5 w-3.5" />;
  if (action.type === "api_call_readonly") return <Search className="h-3.5 w-3.5" />;
  return <ExternalLink className="h-3.5 w-3.5" />;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [launchpadExpanded, setLaunchpadExpanded] = useState(true);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [launchpadLoading, setLaunchpadLoading] = useState(false);
  const [launchpadActions, setLaunchpadActions] = useState<LaunchpadAction[]>([]);
  const [recentActionIds, setRecentActionIds] = useState<string[]>(() =>
    loadStoredArray(RECENT_ACTIONS_STORAGE_KEY, 4)
  );
  const [recentNotes, setRecentNotes] = useState<string[]>(() =>
    loadStoredArray(RECENT_NOTES_STORAGE_KEY, 6)
  );
  const [launchpadHint, setLaunchpadHint] = useState<string | null>(null);

  useEffect(() => {
    if (collapsed) return;
    let cancelled = false;

    async function loadActions() {
      setLaunchpadLoading(true);
      setLaunchpadHint(null);
      try {
        const query = new URLSearchParams();
        query.set("route", pathname || "/dashboard");
        for (const value of recentActionIds) query.append("recentAction", value);
        for (const value of recentNotes) query.append("recentNote", value);

        const response = await fetch(`/api/launchpad/actions?${query.toString()}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          ok?: boolean;
          actions?: LaunchpadAction[];
          error?: string;
        };

        if (!response.ok || !payload.ok || !payload.actions) {
          throw new Error(payload.error || "Failed to load launchpad actions.");
        }

        if (!cancelled) {
          setLaunchpadActions(payload.actions);
        }
      } catch (error) {
        if (!cancelled) {
          setLaunchpadActions([]);
          setLaunchpadHint(error instanceof Error ? error.message : "Launchpad unavailable.");
        }
      } finally {
        if (!cancelled) {
          setLaunchpadLoading(false);
        }
      }
    }

    void loadActions();
    return () => {
      cancelled = true;
    };
  }, [pathname, collapsed, recentActionIds, recentNotes]);

  const groupedActions = useMemo(() => {
    const grouped: Record<LaunchpadActionGroup, LaunchpadAction[]> = {
      do_now: [],
      open_workspace: [],
      review: [],
      capture: [],
    };

    for (const action of launchpadActions) {
      grouped[action.group].push(action);
    }

    return grouped;
  }, [launchpadActions]);

  const recentActions = useMemo(() => {
    if (recentActionIds.length === 0) return [];
    const byId = new Map(launchpadActions.map((action) => [action.id, action]));
    return recentActionIds
      .map((id) => byId.get(id))
      .filter((action): action is LaunchpadAction => action != null);
  }, [launchpadActions, recentActionIds]);

  function rememberRecentAction(actionId: string) {
    setRecentActionIds((prev) => {
      const next = [actionId, ...prev.filter((id) => id !== actionId)].slice(0, 4);
      saveStoredArray(RECENT_ACTIONS_STORAGE_KEY, next);
      return next;
    });
  }

  function rememberRecentNote(notePath: string) {
    setRecentNotes((prev) => {
      const normalized = notePath.trim().replace(/\\/g, "/");
      const next = [normalized, ...prev.filter((value) => value !== normalized)].slice(0, 6);
      saveStoredArray(RECENT_NOTES_STORAGE_KEY, next);
      return next;
    });
  }

  async function executeAction(action: LaunchpadAction) {
    if (loadingActionId === action.id) return;
    setLoadingActionId(action.id);
    setLaunchpadHint(null);

    try {
      if (action.type === "open_url") {
        const url = action.payload.url?.trim();
        if (!url) throw new Error("Action URL is missing.");
        const response = await fetch("/api/system/open-external", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const payload = (await response.json()) as { ok?: boolean };
        if (!response.ok || !payload.ok) {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      } else if (action.type === "open_note") {
        const notePath = action.payload.notePath?.trim();
        if (!notePath) throw new Error("Action note path is missing.");
        rememberRecentNote(notePath);
        const response = await fetch("/api/system/open-note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notePath }),
        });
        const payload = (await response.json()) as { ok?: boolean };
        if (!response.ok || !payload.ok) {
          window.location.href = notePathToHref(notePath);
        }
      } else if (action.type === "copy_text") {
        const text = action.payload.text ?? "";
        if (!text.trim()) throw new Error("Action text is empty.");
        await navigator.clipboard.writeText(text);
        setLaunchpadHint("Copied to clipboard.");
      } else if (action.type === "api_call_readonly") {
        const endpoint = action.payload.endpoint?.trim();
        const method = action.payload.method ?? "GET";
        if (!endpoint) throw new Error("Action endpoint is missing.");
        const response = await fetch(endpoint, {
          method,
          cache: "no-store",
        });

        let payload: unknown = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        const payloadRecord = asRecord(payload);
        const payloadOk =
          payloadRecord && typeof payloadRecord.ok === "boolean"
            ? payloadRecord.ok
            : undefined;

        if (!response.ok || payloadOk === false) {
          const payloadError =
            payloadRecord && typeof payloadRecord.error === "string"
              ? payloadRecord.error
              : null;
          throw new Error(payloadError || `Readonly call failed: ${response.status}`);
        }

        const authUrl =
          payloadRecord && typeof payloadRecord.authUrl === "string"
            ? payloadRecord.authUrl.trim()
            : "";
        if (authUrl) {
          window.location.href = authUrl;
        } else {
          setLaunchpadHint("Readonly action executed.");
        }
      }

      rememberRecentAction(action.id);
    } catch (error) {
      setLaunchpadHint(error instanceof Error ? error.message : "Launchpad action failed.");
    } finally {
      setLoadingActionId((current) => (current === action.id ? null : current));
    }
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen transition-all duration-300 md:block",
        "border-r border-[var(--command-border)] bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.98))] backdrop-blur-xl",
        collapsed ? "w-16" : "w-72"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-[var(--command-border)] px-4">
          {!collapsed ? (
            <div>
              <h1 className="text-lg font-semibold tracking-wide text-slate-100">Second Brain</h1>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
                Starter Console
              </p>
            </div>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto text-slate-200 hover:bg-slate-800/80"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="dashboard-scrollbar flex-1 space-y-2 overflow-y-auto p-3">
          <TooltipProvider>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
                    "hover:bg-slate-800/80 hover:text-cyan-200",
                    isActive
                      ? "border border-cyan-400/35 bg-cyan-500/15 text-cyan-100 shadow-[0_0_0_1px_rgba(56,189,248,0.06),0_14px_34px_-20px_rgba(34,211,238,0.55)]"
                      : "text-slate-300",
                    collapsed && "justify-center"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-1.5 h-5 w-1 rounded-full bg-transparent transition-colors",
                      isActive ? "bg-cyan-300/90" : "group-hover:bg-cyan-400/45"
                    )}
                  />
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed ? <span className="font-medium">{item.label}</span> : null}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.href}>{linkContent}</div>;
            })}
          </TooltipProvider>
        </nav>

        {!collapsed ? (
          <div className="border-t border-[var(--command-border)] p-3">
            <button
              type="button"
              onClick={() => setLaunchpadExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-lg border border-[var(--command-border-strong)] bg-[var(--command-surface)] px-3 py-2 text-left text-sm font-medium text-slate-100 hover:border-cyan-400/50 hover:text-cyan-100"
            >
              <span>Launchpad</span>
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", launchpadExpanded ? "rotate-180" : "")}
              />
            </button>

            {launchpadExpanded ? (
              <div className="mt-2 space-y-2.5">
                {recentActions.length > 0 ? (
                  <div className="rounded-lg border border-[var(--command-border)] bg-[var(--command-surface-soft)] p-2">
                    <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-slate-300">Recent</p>
                    <div className="space-y-1">
                      {recentActions.map((action) => (
                        <button
                          key={`recent-${action.id}`}
                          type="button"
                          onClick={() => executeAction(action)}
                          disabled={loadingActionId === action.id}
                          className="flex w-full items-center justify-between rounded-md border border-transparent bg-slate-900/35 px-2 py-1.5 text-left text-xs text-slate-200 hover:border-cyan-400/35 hover:text-cyan-100 disabled:opacity-60"
                        >
                          <span className="line-clamp-1">{action.title}</span>
                          {loadingActionId === action.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            actionIcon(action)
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="dashboard-scrollbar max-h-[34vh] space-y-2 overflow-y-auto pr-1.5">
                  {launchpadLoading ? (
                    <div className="rounded-lg border border-[var(--command-border)] bg-[var(--command-surface-soft)] p-3 text-xs text-slate-300">
                      Loading launchpad actions...
                    </div>
                  ) : null}

                  {!launchpadLoading &&
                    GROUP_ORDER.map((group) => {
                      const actions = groupedActions[group];
                      if (!actions || actions.length === 0) return null;
                      const meta = GROUP_META[group];
                      const GroupIcon = meta.icon;

                      return (
                        <div
                          key={group}
                          className="rounded-lg border border-[var(--command-border)] bg-[var(--command-surface-soft)] p-2"
                        >
                          <p className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-slate-300">
                            <GroupIcon className="h-3.5 w-3.5" />
                            {meta.title}
                          </p>
                          <div className="space-y-1">
                            {actions.map((action) => (
                              <button
                                key={action.id}
                                type="button"
                                onClick={() => executeAction(action)}
                                disabled={loadingActionId === action.id}
                                className="w-full rounded-md border border-transparent bg-slate-900/35 px-2 py-1.5 text-left hover:border-cyan-400/35 hover:bg-slate-900/55 disabled:opacity-60"
                              >
                                <span className="flex items-start justify-between gap-2">
                                  <span>
                                    <span className="block text-xs font-medium text-slate-100">
                                      {action.title}
                                    </span>
                                    {action.description ? (
                                      <span className="mt-0.5 block text-[11px] text-slate-400">
                                        {action.description}
                                      </span>
                                    ) : null}
                                  </span>
                                  {loadingActionId === action.id ? (
                                    <Loader2 className="mt-0.5 h-3.5 w-3.5 animate-spin text-cyan-200" />
                                  ) : (
                                    <span className="mt-0.5 text-cyan-200">{actionIcon(action)}</span>
                                  )}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {launchpadHint ? (
                  <p className="text-xs text-cyan-200/90">{launchpadHint}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="border-t border-[var(--command-border)] p-4">
          {!collapsed ? (
            <p className="text-center text-xs text-slate-400">Markdown-first workspace</p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
