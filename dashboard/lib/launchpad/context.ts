import "server-only";

import { getGoogleIntegrationStatus, listGoogleTasksByGoal } from "@/lib/integrations/google/tasks";
import type {
  GoogleTaskGoal,
  GoogleTaskItem,
  LaunchpadContext,
  LaunchpadDueSoonTask,
} from "@/lib/types";

interface BuildLaunchpadContextInput {
  route?: string;
  recentNotes?: string[];
}

function normalizeRoute(route?: string): string {
  const raw = (route ?? "/dashboard").trim();
  if (!raw) return "/dashboard";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function inferGoalFromRoute(route: string): GoogleTaskGoal | "all" {
  if (route.startsWith("/goals/work")) return "work";
  if (route.startsWith("/goals/learning")) return "learning";
  if (route.startsWith("/goals/operations")) return "operations";
  if (route.startsWith("/goals")) return "all";
  if (route.startsWith("/dashboard")) return "all";
  return "general";
}

function parseDueDateToUtcDay(due?: string): number | null {
  if (!due) return null;
  const parsed = new Date(`${due}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.getTime();
}

function collectDueSoonPendingTasks(
  tasks: GoogleTaskItem[],
  windowDays: number
): LaunchpadDueSoonTask[] {
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const deadlineUtc = todayUtc + windowDays * 24 * 60 * 60 * 1000;

  return tasks
    .filter((task) => {
      if (task.status !== "needsAction") return false;
      const dueUtc = parseDueDateToUtcDay(task.due);
      if (dueUtc == null) return false;
      return dueUtc >= todayUtc && dueUtc <= deadlineUtc;
    })
    .sort((a, b) => {
      const dueA = parseDueDateToUtcDay(a.due) ?? Number.MAX_SAFE_INTEGER;
      const dueB = parseDueDateToUtcDay(b.due) ?? Number.MAX_SAFE_INTEGER;
      if (dueA !== dueB) return dueA - dueB;
      return a.title.localeCompare(b.title);
    })
    .map((task) => ({
      id: `${task.listId}:${task.id}`,
      title: task.title,
      due: task.due as string,
      goal: task.goal,
    }));
}

function sanitizeRecentNotes(notes: string[] | undefined): string[] {
  if (!notes || notes.length === 0) return [];

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const value of notes) {
    const normalized = value.trim().replace(/\\/g, "/");
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    unique.push(normalized);
    if (unique.length >= 6) break;
  }

  return unique;
}

function flattenPendingTasks(tasksByGoal: Awaited<ReturnType<typeof listGoogleTasksByGoal>>): GoogleTaskItem[] {
  return [
    ...tasksByGoal.work,
    ...tasksByGoal.learning,
    ...tasksByGoal.operations,
    ...tasksByGoal.general,
  ].filter((task) => task.status === "needsAction");
}

export async function buildLaunchpadContext(
  input: BuildLaunchpadContextInput = {}
): Promise<LaunchpadContext> {
  const route = normalizeRoute(input.route);
  const goal = inferGoalFromRoute(route);
  const recentNotes = sanitizeRecentNotes(input.recentNotes);

  const integrationStatus = await getGoogleIntegrationStatus();
  if (!integrationStatus.connected) {
    return {
      route,
      goal,
      googleConnected: false,
      taskCount: 0,
      dueSoonCount: 0,
      dueSoonTasks: [],
      recentNotes,
    };
  }

  try {
    const tasksByGoal = await listGoogleTasksByGoal("all", true);
    const pendingTasks = flattenPendingTasks(tasksByGoal);
    const dueSoonTasks = collectDueSoonPendingTasks(pendingTasks, 7);

    return {
      route,
      goal,
      googleConnected: true,
      taskCount: pendingTasks.length,
      dueSoonCount: dueSoonTasks.length,
      dueSoonTasks: dueSoonTasks.slice(0, 6),
      recentNotes,
    };
  } catch {
    return {
      route,
      goal,
      googleConnected: true,
      taskCount: 0,
      dueSoonCount: 0,
      dueSoonTasks: [],
      recentNotes,
    };
  }
}
