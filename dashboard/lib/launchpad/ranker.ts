import "server-only";

import type { LaunchpadAction, LaunchpadContext } from "@/lib/types";

function routeScore(action: LaunchpadAction, route: string): number {
  if (!action.routeHints || action.routeHints.length === 0) return 0;

  for (const hint of action.routeHints) {
    if (route.startsWith(hint)) {
      return 22;
    }
  }

  return 0;
}

function deadlineScore(action: LaunchpadAction, dueSoonCount: number): number {
  if (!action.deadlineSensitive) return 0;
  return Math.min(dueSoonCount, 6) * 4;
}

function recencyScore(actionId: string, recentActionIds: string[]): number {
  const index = recentActionIds.findIndex((id) => id === actionId);
  if (index < 0) return 0;
  return Math.max(0, 12 - index * 3);
}

function dedupeById(actions: LaunchpadAction[]): LaunchpadAction[] {
  const unique = new Map<string, LaunchpadAction>();
  for (const action of actions) {
    if (!unique.has(action.id)) {
      unique.set(action.id, action);
    }
  }
  return [...unique.values()];
}

export function rankLaunchpadActions(
  actions: LaunchpadAction[],
  context: LaunchpadContext,
  recentActionIds: string[]
): LaunchpadAction[] {
  return dedupeById(actions)
    .map((action) => ({
      action,
      score:
        action.priority +
        routeScore(action, context.route) +
        deadlineScore(action, context.dueSoonCount) +
        recencyScore(action.id, recentActionIds),
    }))
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return a.action.title.localeCompare(b.action.title);
    })
    .map((item) => item.action);
}
