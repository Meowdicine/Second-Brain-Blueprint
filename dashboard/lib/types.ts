export type StarterGoal = "work" | "learning" | "operations";
export type GoogleTaskGoal = StarterGoal | "general";

export interface HomeData {
  scoreboards: {
    work: {
      activeProjects: number;
      shippedOutputs: number;
      blockers: number;
      currentFocus: string;
    };
    learning: {
      sourcesIngested: number;
      synthesisNotes: number;
      reviewCadence: string;
      currentFocus: string;
    };
    operations: {
      inboxItems: number;
      maintenanceTasks: number;
      weeklyReviewStatus: string;
      currentFocus: string;
    };
  };
  weeklyDeliverables: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    link: string;
    notePath?: string;
  }>;
  nextActions: Array<{
    id: string;
    done: boolean;
    text: string;
    tag: GoogleTaskGoal;
    notePath?: string;
  }>;
  lastUpdated: string;
}

export interface StarterAreaData {
  slug: StarterGoal;
  title: string;
  description: string;
  kpis: Array<{
    label: string;
    value: string;
  }>;
  focus: string;
  prompts: string[];
  checkpoints: string[];
  nextActions: Array<{
    id: string;
    done: boolean;
    text: string;
  }>;
  markdownLink: string;
  lastUpdated: string;
}

export interface TodoState {
  done: boolean;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  notePath?: string;
  tag?: string;
}

export interface GoogleTaskItem {
  id: string;
  goal: GoogleTaskGoal;
  listId: string;
  listTitle: string;
  title: string;
  notes?: string;
  due?: string;
  status: "needsAction" | "completed";
  completed?: string;
  parent?: string;
  updated?: string;
}

export interface GoogleTaskList {
  id: string;
  title: string;
  goal?: GoogleTaskGoal;
}

export interface GoogleTasksByGoal {
  work: GoogleTaskItem[];
  learning: GoogleTaskItem[];
  operations: GoogleTaskItem[];
  general: GoogleTaskItem[];
}

export interface GoogleIntegrationStatus {
  configured: boolean;
  connected: boolean;
  missingEnv: string[];
  tokenPath: string;
  externalOpenEnabled: boolean;
  singleListMode: boolean;
  primaryTaskListName: string;
  taskListNames: Record<GoogleTaskGoal, string>;
  lastError?: string;
}

export interface ExternalLaunchRequest {
  url: string;
}

export interface OpenNoteRequest {
  notePath: string;
}

export type LaunchpadActionType =
  | "open_url"
  | "open_note"
  | "copy_text"
  | "api_call_readonly";

export type LaunchpadActionGroup =
  | "do_now"
  | "open_workspace"
  | "review"
  | "capture";

export interface LaunchpadActionPayload {
  url?: string;
  notePath?: string;
  text?: string;
  endpoint?: string;
  method?: "GET";
}

export interface LaunchpadAction {
  id: string;
  title: string;
  description?: string;
  group: LaunchpadActionGroup;
  type: LaunchpadActionType;
  priority: number;
  routeHints?: string[];
  deadlineSensitive?: boolean;
  payload: LaunchpadActionPayload;
}

export interface LaunchpadDueSoonTask {
  id: string;
  title: string;
  due: string;
  goal: GoogleTaskGoal;
}

export interface LaunchpadContext {
  route: string;
  goal: GoogleTaskGoal | "all";
  googleConnected: boolean;
  taskCount: number;
  dueSoonCount: number;
  dueSoonTasks: LaunchpadDueSoonTask[];
  recentNotes: string[];
}
