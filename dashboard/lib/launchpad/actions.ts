import "server-only";

import type { GoogleTaskGoal, LaunchpadAction, LaunchpadContext } from "@/lib/types";

const WORK_NOTE_PATH = "20_Areas/Work/Work.md";
const LEARNING_NOTE_PATH = "20_Areas/Learning/Learning.md";
const OPERATIONS_NOTE_PATH = "20_Areas/Operations/Operations.md";
const GENERAL_NOTE_PATH = "99_System/Guides/WORKFLOW.md";
const DASHBOARD_NOTE_PATH = "DASHBOARD.md";
const AGENTS_NOTE_PATH = "AGENTS.md";
const PRIVACY_NOTE_PATH = "PRIVACY.md";
const LAUNCHPAD_GUIDE_PATH = "99_System/Guides/LAUNCHPAD.md";

interface PrimaryNoteMeta {
  path: string;
  label: string;
  description: string;
  nextStepLabel: string;
}

function resolvePrimaryNoteMeta(goal: GoogleTaskGoal | "all"): PrimaryNoteMeta {
  if (goal === "work") {
    return {
      path: WORK_NOTE_PATH,
      label: "Work note",
      description: "Jump into the Work note for the current operating context.",
      nextStepLabel: "work",
    };
  }
  if (goal === "learning") {
    return {
      path: LEARNING_NOTE_PATH,
      label: "Learning note",
      description: "Jump into the Learning note for the current operating context.",
      nextStepLabel: "learning",
    };
  }
  if (goal === "operations") {
    return {
      path: OPERATIONS_NOTE_PATH,
      label: "Operations note",
      description: "Jump into the Operations note for the current operating context.",
      nextStepLabel: "operations",
    };
  }

  return {
    path: GENERAL_NOTE_PATH,
    label: "workflow note",
    description: "Jump into the workflow guide that anchors the starter loop.",
    nextStepLabel: "execution",
  };
}

function copyTemplateForGoal(goal: GoogleTaskGoal | "all"): string {
  const label =
    goal === "all" ? "Today" : `${goal.charAt(0).toUpperCase()}${goal.slice(1)}`;
  return [
    `${label} Execution Capture`,
    "- What moved forward:",
    "- What got stuck:",
    "- What changed in the wiki:",
    "- Next highest-leverage action:",
    "- Evidence note path:",
  ].join("\n");
}

function goalToLabel(goal: GoogleTaskGoal): string {
  if (goal === "work") return "Work";
  if (goal === "learning") return "Learning";
  if (goal === "operations") return "Operations";
  return "General";
}

function buildTodayFocusText(context: LaunchpadContext): string {
  if (context.dueSoonTasks.length === 0) {
    return "Today Focus\n- No due-soon tasks in the next 7 days.\n- Pick one high-leverage pending task.";
  }

  const lines = ["Today Focus (Due Soon, 7 days)", ""];
  context.dueSoonTasks.forEach((task, index) => {
    lines.push(`${index + 1}. [${goalToLabel(task.goal)}] ${task.title} (Due ${task.due})`);
  });
  lines.push("");
  lines.push("Execution Check");
  lines.push("- Start with item #1");
  lines.push("- Capture the result in the linked note");
  lines.push("- Re-rank after completion");
  return lines.join("\n");
}

function buildNextStepSuggestion(goal: GoogleTaskGoal | "all"): string {
  if (goal === "work") {
    return "Work Next Step\n1. Choose the next shippable outcome.\n2. Reduce one blocker.\n3. Record the decision in the Work note.";
  }
  if (goal === "learning") {
    return "Learning Next Step\n1. Ingest one source.\n2. Update one synthesis or area note.\n3. Capture the model change.";
  }
  if (goal === "operations") {
    return "Operations Next Step\n1. Run one maintenance pass.\n2. Remove one friction point.\n3. Update the operating note.";
  }
  return "Execution Next Step\n1. Pick one highest-impact task.\n2. Finish it end-to-end.\n3. Capture evidence and queue the next action.";
}

export function buildLaunchpadActions(context: LaunchpadContext): LaunchpadAction[] {
  const primaryNote = resolvePrimaryNoteMeta(context.goal);

  const actions: LaunchpadAction[] = [];

  if (context.googleConnected) {
    actions.push({
      id: "open-google-tasks",
      title:
        context.dueSoonCount > 0
          ? `Focus ${context.dueSoonCount} due-soon task(s)`
          : "Focus next actions in Google Tasks",
      description: "Open Google Tasks and execute the top pending item.",
      group: "do_now",
      type: "open_url",
      priority: 96,
      routeHints: ["/dashboard", "/goals"],
      deadlineSensitive: true,
      payload: { url: "https://tasks.google.com" },
    });
  } else {
    actions.push({
      id: "connect-google-tasks",
      title: "Connect Google Tasks",
      description: "Run OAuth handshake to activate Google sync.",
      group: "do_now",
      type: "api_call_readonly",
      priority: 99,
      routeHints: ["/dashboard", "/goals", "/settings"],
      payload: {
        endpoint: "/api/integrations/google/auth-url",
        method: "GET",
      },
    });
  }

  if (context.dueSoonTasks.length > 0) {
    actions.push({
      id: "copy-today-focus",
      title: "Copy Today Focus list",
      description: "Generate a due-soon execution list for today.",
      group: "do_now",
      type: "copy_text",
      priority: 94,
      routeHints: ["/dashboard", "/goals"],
      deadlineSensitive: true,
      payload: { text: buildTodayFocusText(context) },
    });
  }

  actions.push(
    {
      id: "open-goal-note",
      title: `Open ${primaryNote.label}`,
      description: primaryNote.description,
      group: "do_now",
      type: "open_note",
      priority: 90,
      routeHints: ["/dashboard", "/goals"],
      payload: { notePath: primaryNote.path },
    },
    {
      id: "copy-next-step",
      title: `Copy ${primaryNote.nextStepLabel} next-step brief`,
      description: "Paste a concise next-step sequence in chat or notes.",
      group: "do_now",
      type: "copy_text",
      priority: 88,
      routeHints: ["/dashboard", "/goals"],
      payload: { text: buildNextStepSuggestion(context.goal) },
    },
    {
      id: "open-drive",
      title: "Open Google Drive",
      description: "Access source docs and references.",
      group: "open_workspace",
      type: "open_url",
      priority: 78,
      routeHints: ["/dashboard", "/goals", "/notes"],
      payload: { url: "https://drive.google.com" },
    },
    {
      id: "open-notebooklm",
      title: "Open NotebookLM",
      description: "Review synthesized context from source docs.",
      group: "open_workspace",
      type: "open_url",
      priority: 75,
      routeHints: ["/dashboard", "/goals", "/notes"],
      payload: { url: "https://notebooklm.google.com" },
    },
    {
      id: "open-gemini",
      title: "Open Gemini",
      description: "Run quick ideation and summary prompts.",
      group: "open_workspace",
      type: "open_url",
      priority: 73,
      routeHints: ["/dashboard", "/goals", "/notes"],
      payload: { url: "https://gemini.google.com" },
    },
    {
      id: "open-google-calendar",
      title: "Open Google Calendar",
      description: "Align tasks with calendar commitments.",
      group: "open_workspace",
      type: "open_url",
      priority: 72,
      routeHints: ["/dashboard", "/goals", "/notes"],
      payload: { url: "https://calendar.google.com" },
    },
    {
      id: "open-launchpad-guide",
      title: "Open launchpad guide",
      description: "See how README, DASHBOARD.md, and the sidebar launchpad fit together.",
      group: "review",
      type: "open_note",
      priority: 71,
      routeHints: ["/dashboard", "/goals", "/notes"],
      payload: { notePath: LAUNCHPAD_GUIDE_PATH },
    },
    {
      id: "review-dashboard",
      title: "Review dashboard note",
      description: "Cross-check weekly priorities and current status.",
      group: "review",
      type: "open_note",
      priority: 70,
      routeHints: ["/dashboard"],
      payload: { notePath: DASHBOARD_NOTE_PATH },
    },
    {
      id: "open-agent-entry",
      title: "Open agent entry",
      description: "Use the agent control-layer entry file for maintenance and restructuring.",
      group: "review",
      type: "open_note",
      priority: 69,
      routeHints: ["/notes", "/dashboard", "/goals"],
      payload: { notePath: AGENTS_NOTE_PATH },
    },
    {
      id: "open-privacy-boundary",
      title: "Open privacy boundary",
      description: "Check what belongs in the public template versus your private instance.",
      group: "review",
      type: "open_note",
      priority: 68,
      routeHints: ["/settings", "/notes", "/dashboard"],
      payload: { notePath: PRIVACY_NOTE_PATH },
    },
    {
      id: "capture-daily-template",
      title: "Copy execution capture template",
      description: "Use a compact template for quick updates.",
      group: "capture",
      type: "copy_text",
      priority: 64,
      routeHints: ["/dashboard", "/goals", "/notes"],
      payload: { text: copyTemplateForGoal(context.goal) },
    }
  );

  if (context.googleConnected) {
    actions.push({
      id: "refresh-google-tasks-snapshot",
      title: "Refresh tasks snapshot",
      description: "Call readonly API to fetch latest Google task payload.",
      group: "review",
      type: "api_call_readonly",
      priority: 68,
      routeHints: ["/dashboard", "/goals"],
      payload: {
        endpoint: `/api/integrations/google/tasks?goal=${
          context.goal === "all" ? "all" : context.goal
        }`,
        method: "GET",
      },
    });
  }

  if (context.recentNotes.length > 0) {
    actions.push({
      id: "open-recent-note",
      title: "Open most recent note",
      description: "Resume from your last opened source note.",
      group: "capture",
      type: "open_note",
      priority: 66,
      routeHints: ["/dashboard", "/notes", "/goals"],
      payload: { notePath: context.recentNotes[0] },
    });
  }

  return actions;
}
