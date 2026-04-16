import "server-only";

import { getDashboardEnv, type GoalKey } from "@/lib/env";
import { refreshGoogleAccessToken } from "@/lib/integrations/google/oauth";
import {
  readGoogleTokenRecord,
  type GoogleTokenRecord,
} from "@/lib/integrations/google/token-store";
import type {
  GoogleIntegrationStatus,
  GoogleTaskGoal,
  GoogleTaskItem,
  GoogleTaskList,
  GoogleTasksByGoal,
} from "@/lib/types";

const GOOGLE_TASKS_API_BASE = "https://tasks.googleapis.com/tasks/v1";
const ACCESS_TOKEN_REFRESH_WINDOW_MS = 60_000;
const GOAL_MARKER_PREFIX = "#goal:";
const GOAL_MARKER_LINE_REGEX = /^#goal:\s*(work|learning|operations|general)\s*$/i;
const GOAL_TITLE_PREFIX_REGEX = /^\[(work|learning|operations|general)\]\s*/i;

type GoalOrAll = GoogleTaskGoal | "all";

interface GoogleTaskRaw {
  id?: string;
  title?: string;
  notes?: string;
  due?: string;
  status?: "needsAction" | "completed";
  completed?: string;
  parent?: string;
  updated?: string;
}

interface GoogleTaskListRaw {
  id?: string;
  title?: string;
}

function createEmptyTasksByGoal(): GoogleTasksByGoal {
  return {
    work: [],
    learning: [],
    operations: [],
    general: [],
  };
}

function normalizeDueInput(value?: string | null): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed}T00:00:00.000Z`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid due date format. Use YYYY-MM-DD or ISO date.");
  }

  return parsed.toISOString();
}

function toDueDate(value?: string): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}

function goalKeys(): GoogleTaskGoal[] {
  return ["work", "learning", "operations", "general"];
}

function isGoal(value: string): value is GoogleTaskGoal {
  return goalKeys().includes(value as GoogleTaskGoal);
}

function isGoalMarkerLine(value: string): boolean {
  return GOAL_MARKER_LINE_REGEX.test(value.trim());
}

function normalizeNotesInput(value?: string | null): string | undefined {
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function extractGoalFromNotes(notes?: string): GoogleTaskGoal | undefined {
  if (!notes) return undefined;

  const lines = notes.split(/\r?\n/);
  for (const line of lines) {
    const match = line.trim().match(GOAL_MARKER_LINE_REGEX);
    if (match && isGoal(match[1])) {
      return match[1];
    }
  }

  return undefined;
}

function extractGoalFromTitle(title?: string): GoogleTaskGoal | undefined {
  if (!title) return undefined;
  const match = title.trim().match(GOAL_TITLE_PREFIX_REGEX);
  if (!match || !isGoal(match[1])) return undefined;
  return match[1];
}

function stripGoalMarker(notes?: string): string | undefined {
  const normalized = normalizeNotesInput(notes);
  if (!normalized) return undefined;

  const cleaned = normalized
    .split(/\r?\n/)
    .filter((line) => !isGoalMarkerLine(line))
    .join("\n")
    .trim();

  return cleaned || undefined;
}

function resolveGoalFromTaskRaw(
  raw: GoogleTaskRaw,
  fallback: GoogleTaskGoal = "general"
): GoogleTaskGoal {
  return extractGoalFromNotes(raw.notes) ?? extractGoalFromTitle(raw.title) ?? fallback;
}

function addGoalMarkerToNotes(notes: string | undefined, goal: GoogleTaskGoal): string {
  const noteBody = stripGoalMarker(notes);
  if (!noteBody) {
    return `${GOAL_MARKER_PREFIX}${goal}`;
  }
  return `${GOAL_MARKER_PREFIX}${goal}\n${noteBody}`;
}

function resolveGoalByListTitle(title: string): GoogleTaskGoal | undefined {
  const env = getDashboardEnv();
  if (env.googleTasksSingleListMode) {
    return undefined;
  }
  const normalizedTitle = title.trim().toLowerCase();

  for (const goal of goalKeys()) {
    if (env.googleTaskListNames[goal].trim().toLowerCase() === normalizedTitle) {
      return goal;
    }
  }

  return undefined;
}

async function getValidGoogleTokenRecord(): Promise<GoogleTokenRecord> {
  const env = getDashboardEnv();

  if (!env.isGoogleConfigured) {
    throw new Error(`Google integration is not configured: ${env.missingGoogleEnv.join(", ")}`);
  }

  const token = await readGoogleTokenRecord();
  if (!token) {
    throw new Error("Google account is not connected. Please authorize first.");
  }

  const shouldRefresh = token.expiryDate <= Date.now() + ACCESS_TOKEN_REFRESH_WINDOW_MS;
  if (!shouldRefresh) {
    return token;
  }

  return refreshGoogleAccessToken(token.refreshToken);
}

async function googleApiRequest<T>(
  pathname: string,
  init: RequestInit = {}
): Promise<T> {
  const token = await getValidGoogleTokenRecord();
  const url = `${GOOGLE_TASKS_API_BASE}${pathname}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      const payload = (await response.json()) as {
        error?: { message?: string };
      };
      if (payload.error?.message) {
        message = payload.error.message;
      }
    } catch {
      // Keep default status message.
    }

    throw new Error(`Google Tasks request failed: ${message}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function listGoogleTaskListsRaw(): Promise<GoogleTaskListRaw[]> {
  const response = await googleApiRequest<{ items?: GoogleTaskListRaw[] }>(
    "/users/@me/lists?maxResults=100"
  );

  return response.items ?? [];
}

function toGoogleTaskList(raw: GoogleTaskListRaw): GoogleTaskList | null {
  if (!raw.id || !raw.title) return null;

  return {
    id: raw.id,
    title: raw.title,
    goal: resolveGoalByListTitle(raw.title),
  };
}

async function createGoogleTaskList(title: string): Promise<GoogleTaskList> {
  const response = await googleApiRequest<GoogleTaskListRaw>("/users/@me/lists", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

  const list = toGoogleTaskList(response);
  if (!list) {
    throw new Error("Google list creation returned an invalid payload.");
  }

  return list;
}

function findGoogleTaskListByTitle(
  rawLists: GoogleTaskListRaw[],
  title: string
): GoogleTaskList | null {
  const normalizedTitle = title.trim().toLowerCase();

  const matched = rawLists
    .map((raw) => toGoogleTaskList(raw))
    .find((list): list is GoogleTaskList => {
      return list != null && list.title.trim().toLowerCase() === normalizedTitle;
    });

  return matched ?? null;
}

async function getPrimaryGoogleTaskList(createIfMissing: boolean): Promise<GoogleTaskList> {
  const env = getDashboardEnv();
  const rawLists = await listGoogleTaskListsRaw();
  const existing = findGoogleTaskListByTitle(rawLists, env.googlePrimaryTaskListName);

  if (existing) {
    return existing;
  }

  if (!createIfMissing) {
    throw new Error(
      `Primary task list "${env.googlePrimaryTaskListName}" is missing. Create it or enable auto-creation.`
    );
  }

  return createGoogleTaskList(env.googlePrimaryTaskListName);
}

export async function getMappedGoogleTaskLists(
  createIfMissing = false
): Promise<Record<GoogleTaskGoal, GoogleTaskList>> {
  const env = getDashboardEnv();

  if (env.googleTasksSingleListMode) {
    const primaryList = await getPrimaryGoogleTaskList(createIfMissing);
    return {
      work: primaryList,
      learning: primaryList,
      operations: primaryList,
      general: primaryList,
    };
  }

  const rawLists = await listGoogleTaskListsRaw();
  const mapped: Partial<Record<GoogleTaskGoal, GoogleTaskList>> = {};

  for (const raw of rawLists) {
    const list = toGoogleTaskList(raw);
    if (!list || !list.goal) continue;
    mapped[list.goal] = list;
  }

  if (createIfMissing) {
    for (const goal of goalKeys()) {
      if (mapped[goal]) continue;
      mapped[goal] = await createGoogleTaskList(env.googleTaskListNames[goal]);
    }
  }

  const missing = goalKeys().filter((goal) => !mapped[goal]);
  if (missing.length > 0) {
    throw new Error(
      `Mapped task lists missing for goals: ${missing.join(", ")}. Connect or create them first.`
    );
  }

  return mapped as Record<GoogleTaskGoal, GoogleTaskList>;
}

function mapTaskRawToItem(
  raw: GoogleTaskRaw,
  goal: GoogleTaskGoal,
  list: GoogleTaskList
): GoogleTaskItem | null {
  if (!raw.id || !raw.title) return null;

  return {
    id: raw.id,
    goal,
    listId: list.id,
    listTitle: list.title,
    title: raw.title,
    notes: stripGoalMarker(raw.notes),
    due: toDueDate(raw.due),
    status: raw.status ?? "needsAction",
    completed: raw.completed,
    parent: raw.parent,
    updated: raw.updated,
  };
}

function sortGoogleTaskItems(tasks: GoogleTaskItem[]): GoogleTaskItem[] {
  return tasks.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "needsAction" ? -1 : 1;
    }
    if (a.due && b.due) return a.due.localeCompare(b.due);
    if (a.due) return -1;
    if (b.due) return 1;
    return a.title.localeCompare(b.title);
  });
}

async function listTaskRawsInList(list: GoogleTaskList): Promise<GoogleTaskRaw[]> {
  const response = await googleApiRequest<{ items?: GoogleTaskRaw[] }>(
    `/lists/${encodeURIComponent(list.id)}/tasks?showCompleted=true&showHidden=true&maxResults=100`
  );

  return response.items ?? [];
}

async function listTasksInList(
  list: GoogleTaskList,
  goal: GoogleTaskGoal
): Promise<GoogleTaskItem[]> {
  return sortGoogleTaskItems(
    (await listTaskRawsInList(list))
      .map((raw) => mapTaskRawToItem(raw, goal, list))
      .filter((item): item is GoogleTaskItem => item != null)
  );
}

async function listTasksInSingleList(
  list: GoogleTaskList,
  goal: GoalOrAll
): Promise<GoogleTasksByGoal> {
  const output = createEmptyTasksByGoal();
  const raws = await listTaskRawsInList(list);

  for (const raw of raws) {
    const resolvedGoal = resolveGoalFromTaskRaw(raw, "general");
    const item = mapTaskRawToItem(raw, resolvedGoal, list);
    if (!item) continue;

    if (goal === "all" || resolvedGoal === goal) {
      output[resolvedGoal].push(item);
    }
  }

  for (const goalKey of goalKeys()) {
    sortGoogleTaskItems(output[goalKey]);
  }

  return output;
}

export async function listGoogleTasksByGoal(
  goal: GoalOrAll,
  createListsIfMissing = true
): Promise<GoogleTasksByGoal> {
  const lists = await getMappedGoogleTaskLists(createListsIfMissing);

  if (getDashboardEnv().googleTasksSingleListMode) {
    return listTasksInSingleList(lists.general, goal);
  }

  const output = createEmptyTasksByGoal();
  const goalsToLoad = goal === "all" ? goalKeys() : [goal];

  await Promise.all(
    goalsToLoad.map(async (goalKey) => {
      output[goalKey] = await listTasksInList(lists[goalKey], goalKey);
    })
  );

  return output;
}

export async function listGoogleTaskLists(): Promise<GoogleTaskList[]> {
  const rawLists = await listGoogleTaskListsRaw();

  return rawLists
    .map((raw) => toGoogleTaskList(raw))
    .filter((list): list is GoogleTaskList => list != null)
    .sort((a, b) => a.title.localeCompare(b.title));
}

interface CreateGoogleTaskInput {
  goal: GoogleTaskGoal;
  title: string;
  notes?: string;
  due?: string;
  parent?: string;
}

export async function createGoogleTask(
  input: CreateGoogleTaskInput
): Promise<GoogleTaskItem> {
  const title = input.title.trim();
  if (!title) {
    throw new Error("Task title is required.");
  }

  const lists = await getMappedGoogleTaskLists(true);
  const list = lists[input.goal];
  const singleListMode = getDashboardEnv().googleTasksSingleListMode;

  const payload: Record<string, string> = { title };
  const normalizedNotes = normalizeNotesInput(input.notes);
  const noteValue = singleListMode
    ? addGoalMarkerToNotes(normalizedNotes, input.goal)
    : normalizedNotes;
  if (noteValue) payload.notes = noteValue;

  const due = normalizeDueInput(input.due);
  if (typeof due === "string") payload.due = due;

  const query = new URLSearchParams();
  if (input.parent?.trim()) query.set("parent", input.parent.trim());

  const suffix = query.toString() ? `?${query.toString()}` : "";

  const response = await googleApiRequest<GoogleTaskRaw>(
    `/lists/${encodeURIComponent(list.id)}/tasks${suffix}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  const item = mapTaskRawToItem(response, input.goal, list);
  if (!item) {
    throw new Error("Google create task returned an invalid payload.");
  }

  return item;
}

interface UpdateGoogleTaskInput {
  listId: string;
  taskId: string;
  title?: string;
  notes?: string;
  due?: string | null;
  status?: "needsAction" | "completed";
  goal?: GoogleTaskGoal;
}

async function getGoogleTaskById(
  listId: string,
  taskId: string
): Promise<GoogleTaskRaw> {
  return googleApiRequest<GoogleTaskRaw>(
    `/lists/${encodeURIComponent(listId)}/tasks/${encodeURIComponent(taskId)}`
  );
}

async function deleteGoogleTaskById(listId: string, taskId: string): Promise<void> {
  await googleApiRequest<void>(
    `/lists/${encodeURIComponent(listId)}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "DELETE",
    }
  );
}

export async function updateGoogleTask(
  input: UpdateGoogleTaskInput
): Promise<GoogleTaskItem> {
  const lists = await getMappedGoogleTaskLists(true);
  const singleListMode = getDashboardEnv().googleTasksSingleListMode;
  const existing = await getGoogleTaskById(input.listId, input.taskId);

  if (!existing.id || !existing.title) {
    throw new Error("Source task does not exist or is invalid.");
  }

  const sourceGoal = singleListMode
    ? resolveGoalFromTaskRaw(existing, "general")
    : goalKeys().find((goalKey) => lists[goalKey].id === input.listId);
  const targetGoal = input.goal ?? sourceGoal;

  if (!sourceGoal || !targetGoal) {
    throw new Error("Unable to resolve source/target goal mapping for task update.");
  }

  const targetList = lists[targetGoal];
  const sourceList =
    goalKeys()
      .map((goalKey) => lists[goalKey])
      .find((list) => list.id === input.listId) ?? lists[sourceGoal];
  const isCrossListMove = !singleListMode && targetList.id !== sourceList.id;

  if (isCrossListMove) {
    const recreated = await createGoogleTask({
      goal: targetGoal,
      title: input.title ?? existing.title,
      notes: input.notes ?? stripGoalMarker(existing.notes),
      due: input.due === undefined ? toDueDate(existing.due) : input.due ?? undefined,
      parent: existing.parent,
    });

    if ((input.status ?? existing.status ?? "needsAction") === "completed") {
      await updateGoogleTask({
        listId: recreated.listId,
        taskId: recreated.id,
        status: "completed",
      });
    }

    await deleteGoogleTaskById(sourceList.id, input.taskId);
    return recreated;
  }

  const payload: Record<string, string | null> = {};

  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("Task title cannot be empty.");
    payload.title = title;
  }

  const shouldRewriteNotesForGoal = singleListMode && input.goal !== undefined;
  if (input.notes !== undefined || shouldRewriteNotesForGoal) {
    if (singleListMode) {
      const notesValue =
        input.notes !== undefined ? normalizeNotesInput(input.notes) : stripGoalMarker(existing.notes);
      payload.notes = addGoalMarkerToNotes(notesValue, targetGoal);
    } else {
      payload.notes = normalizeNotesInput(input.notes) ?? null;
    }
  }

  if (input.due !== undefined) {
    const normalizedDue = normalizeDueInput(input.due);
    payload.due = normalizedDue ?? null;
  }

  if (input.status !== undefined) {
    payload.status = input.status;
  }

  if (Object.keys(payload).length === 0) {
    const unchanged = mapTaskRawToItem(existing, sourceGoal, sourceList);
    if (!unchanged) throw new Error("Unable to map unchanged task payload.");
    return unchanged;
  }

  const response = await googleApiRequest<GoogleTaskRaw>(
    `/lists/${encodeURIComponent(sourceList.id)}/tasks/${encodeURIComponent(input.taskId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );

  const mappedGoal = singleListMode
    ? resolveGoalFromTaskRaw(response, targetGoal)
    : sourceGoal;
  const mapped = mapTaskRawToItem(response, mappedGoal, sourceList);
  if (!mapped) {
    throw new Error("Google task update returned an invalid payload.");
  }

  return mapped;
}

export async function deleteGoogleTask(
  listId: string,
  taskId: string
): Promise<void> {
  await deleteGoogleTaskById(listId, taskId);
}

export async function getGoogleIntegrationStatus(
  errorMessage?: string
): Promise<GoogleIntegrationStatus> {
  const env = getDashboardEnv();
  const token = await readGoogleTokenRecord();

  return {
    configured: env.isGoogleConfigured,
    connected: env.isGoogleConfigured && token != null,
    missingEnv: env.missingGoogleEnv,
    tokenPath: env.googleTokenStorePath,
    externalOpenEnabled: env.externalOpenEnabled,
    singleListMode: env.googleTasksSingleListMode,
    primaryTaskListName: env.googlePrimaryTaskListName,
    taskListNames: env.googleTaskListNames,
    lastError: errorMessage,
  };
}

export function parseGoalOrAll(value: string | null): GoalOrAll {
  if (!value || value === "all") return "all";
  if (isGoal(value)) return value;
  throw new Error(`Invalid goal value: ${value}`);
}

export function parseGoal(value: string | null | undefined): GoogleTaskGoal {
  if (!value) {
    throw new Error("goal is required");
  }

  if (!isGoal(value)) {
    throw new Error(`Invalid goal value: ${value}`);
  }

  return value;
}

export function getTaskListNameByGoal(goal: GoalKey): string {
  const env = getDashboardEnv();
  return env.googleTasksSingleListMode
    ? env.googlePrimaryTaskListName
    : env.googleTaskListNames[goal];
}
