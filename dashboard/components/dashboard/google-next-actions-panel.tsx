"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NextActions } from "@/components/dashboard/next-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  GoogleIntegrationStatus,
  GoogleTaskGoal,
  GoogleTaskItem,
  GoogleTasksByGoal,
} from "@/lib/types";
import { ChevronDown, Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

type GoalOrAll = GoogleTaskGoal | "all";

interface FallbackActionItem {
  id: string;
  done: boolean;
  text: string;
  tag: string;
  notePath?: string;
}

interface GoogleNextActionsPanelProps {
  initialStatus: GoogleIntegrationStatus;
  initialTasksByGoal: GoogleTasksByGoal | null;
  fallbackActions: FallbackActionItem[];
}

const GOAL_LABEL: Record<GoogleTaskGoal, string> = {
  work: "Work",
  learning: "Learning",
  operations: "Operations",
  general: "General",
};

const GOAL_ORDER: GoogleTaskGoal[] = ["work", "learning", "operations", "general"];
const CREATE_HOVER_OPEN_DELAY_MS = 220;

function emptyTasksByGoal(): GoogleTasksByGoal {
  return {
    work: [],
    learning: [],
    operations: [],
    general: [],
  };
}

function taskKey(task: GoogleTaskItem): string {
  return `${task.listId}:${task.id}`;
}

export function GoogleNextActionsPanel({
  initialStatus,
  initialTasksByGoal,
  fallbackActions,
}: GoogleNextActionsPanelProps) {
  const [status, setStatus] = useState(initialStatus);
  const [tasksByGoal, setTasksByGoal] = useState<GoogleTasksByGoal>(
    initialTasksByGoal ?? emptyTasksByGoal()
  );
  const [activeGoal, setActiveGoal] = useState<GoalOrAll>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [workingTaskKey, setWorkingTaskKey] = useState<string | null>(null);

  const [createGoal, setCreateGoal] = useState<GoogleTaskGoal>("work");
  const [createTitle, setCreateTitle] = useState("");
  const [createNotes, setCreateNotes] = useState("");
  const [createDue, setCreateDue] = useState("");
  const [isCreateExpanded, setIsCreateExpanded] = useState(false);
  const [isCreateHovering, setIsCreateHovering] = useState(false);
  const createHoverTimerRef = useRef<number | null>(null);

  const [editingTaskKey, setEditingTaskKey] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editDue, setEditDue] = useState("");
  const [editGoal, setEditGoal] = useState<GoogleTaskGoal>("work");

  const visibleTasks = useMemo(() => {
    if (activeGoal === "all") {
      return GOAL_ORDER.flatMap((goal) => tasksByGoal[goal]);
    }

    return tasksByGoal[activeGoal];
  }, [activeGoal, tasksByGoal]);
  const isCreateFormVisible = isCreateExpanded || isCreateHovering;

  useEffect(() => {
    return () => {
      if (createHoverTimerRef.current != null) {
        window.clearTimeout(createHoverTimerRef.current);
      }
    };
  }, []);

  function handleCreateMouseEnter() {
    if (isCreateExpanded) return;
    if (createHoverTimerRef.current != null) {
      window.clearTimeout(createHoverTimerRef.current);
    }
    createHoverTimerRef.current = window.setTimeout(() => {
      setIsCreateHovering(true);
    }, CREATE_HOVER_OPEN_DELAY_MS);
  }

  function handleCreateMouseLeave() {
    if (createHoverTimerRef.current != null) {
      window.clearTimeout(createHoverTimerRef.current);
      createHoverTimerRef.current = null;
    }
    if (!isCreateExpanded) {
      setIsCreateHovering(false);
    }
  }

  async function refreshStatus() {
    const response = await fetch("/api/integrations/google/status", { cache: "no-store" });
    const payload = (await response.json()) as {
      ok?: boolean;
      status?: GoogleIntegrationStatus;
      error?: string;
    };

    if (!response.ok || !payload.ok || !payload.status) {
      throw new Error(payload.error || "Failed to fetch integration status.");
    }

    setStatus(payload.status);
  }

  async function refreshTasks(goal: GoalOrAll = "all") {
    setLoading(true);
    setError(null);

    try {
      await refreshStatus();
      const response = await fetch(`/api/integrations/google/tasks?goal=${goal}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        tasksByGoal?: GoogleTasksByGoal;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.tasksByGoal) {
        throw new Error(payload.error || "Failed to refresh tasks.");
      }

      if (goal === "all") {
        setTasksByGoal(payload.tasksByGoal);
      } else {
        setTasksByGoal((prev) => ({
          ...prev,
          [goal]: payload.tasksByGoal?.[goal] ?? [],
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh tasks.");
    } finally {
      setLoading(false);
    }
  }

  async function connectGoogle() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/integrations/google/auth-url", {
        cache: "no-store",
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        authUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.authUrl) {
        throw new Error(payload.error || "Failed to start Google OAuth.");
      }

      window.location.href = payload.authUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect Google.");
      setLoading(false);
    }
  }

  async function createTask() {
    if (!createTitle.trim()) {
      setError("Task title is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/integrations/google/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: createGoal,
          title: createTitle,
          notes: createNotes || undefined,
          due: createDue || undefined,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Failed to create task.");
      }

      setCreateTitle("");
      setCreateNotes("");
      setCreateDue("");
      await refreshTasks("all");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleTaskStatus(task: GoogleTaskItem) {
    setWorkingTaskKey(taskKey(task));
    setError(null);

    try {
      const nextStatus = task.status === "completed" ? "needsAction" : "completed";
      const response = await fetch("/api/integrations/google/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId: task.listId,
          taskId: task.id,
          status: nextStatus,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Failed to update status.");
      }

      await refreshTasks("all");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task status.");
    } finally {
      setWorkingTaskKey(null);
    }
  }

  function startEdit(task: GoogleTaskItem) {
    setEditingTaskKey(taskKey(task));
    setEditTitle(task.title);
    setEditNotes(task.notes ?? "");
    setEditDue(task.due ?? "");
    setEditGoal(task.goal);
  }

  function cancelEdit() {
    setEditingTaskKey(null);
    setEditTitle("");
    setEditNotes("");
    setEditDue("");
    setEditGoal("work");
  }

  async function saveEdit(task: GoogleTaskItem) {
    if (!editTitle.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    setWorkingTaskKey(taskKey(task));
    setError(null);

    try {
      const response = await fetch("/api/integrations/google/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId: task.listId,
          taskId: task.id,
          title: editTitle,
          notes: editNotes,
          due: editDue || null,
          goal: editGoal,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Failed to update task.");
      }

      cancelEdit();
      await refreshTasks("all");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task.");
    } finally {
      setWorkingTaskKey(null);
    }
  }

  async function removeTask(task: GoogleTaskItem) {
    setWorkingTaskKey(taskKey(task));
    setError(null);

    try {
      const response = await fetch("/api/integrations/google/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId: task.listId,
          taskId: task.id,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Failed to delete task.");
      }

      await refreshTasks("all");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task.");
    } finally {
      setWorkingTaskKey(null);
    }
  }

  if (!status.configured) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-amber-200">
          Google integration is not configured yet. Add values in <code className="text-amber-100">dashboard/.env</code>.
        </p>
        <p className="text-xs text-muted-foreground">
          Missing: {status.missingEnv.join(", ")}
        </p>
      </div>
    );
  }

  if (!status.connected) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-200">
          Google Tasks is not connected. Connect once, then this panel becomes your main next-actions layer.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={connectGoogle}
            disabled={loading}
            className="bg-cyan-500/25 text-cyan-100 border border-cyan-400/40 hover:bg-cyan-500/35"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Connect Google Tasks
          </Button>
        </div>

        <div className="rounded-lg border border-slate-600/60 bg-slate-800/60 p-3">
          <p className="mb-3 text-sm font-medium text-slate-100">Fallback local actions</p>
          <NextActions actions={fallbackActions} />
        </div>

        {error ? <p className="text-xs text-amber-300">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={activeGoal}
          onChange={(event) => setActiveGoal(event.target.value as GoalOrAll)}
          className="rounded-md border border-slate-600/70 bg-slate-900/70 px-3 py-1.5 text-sm text-slate-100"
        >
          <option value="all">All goals</option>
          {GOAL_ORDER.map((goal) => (
            <option key={goal} value={goal}>
              {GOAL_LABEL[goal]}
            </option>
          ))}
        </select>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refreshTasks("all")}
          disabled={loading}
          className="border-slate-500/60 bg-slate-800/70 text-slate-100 hover:bg-slate-700/80"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <div
        className="rounded-lg border border-slate-600/60 bg-slate-800/60 p-3"
        onMouseEnter={handleCreateMouseEnter}
        onMouseLeave={handleCreateMouseLeave}
      >
        <button
          type="button"
          onClick={() => setIsCreateExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-md border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-left transition-colors hover:bg-slate-900/90"
          aria-expanded={isCreateFormVisible}
          aria-controls="create-task-form"
        >
          <span className="text-sm font-medium text-slate-100">Create task</span>
          <span className="flex items-center gap-1 text-xs text-slate-300">
            {isCreateFormVisible ? "Hide" : "Hover (slow) or click"}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isCreateFormVisible ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        <div
          id="create-task-form"
          className={cn(
            "grid transition-all duration-500 ease-out",
            isCreateFormVisible
              ? "mt-3 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0"
          )}
          aria-hidden={!isCreateFormVisible}
        >
          <div
            className={cn(
              "overflow-hidden",
              isCreateFormVisible ? "pointer-events-auto" : "pointer-events-none"
            )}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <select
                  value={createGoal}
                  onChange={(event) => setCreateGoal(event.target.value as GoogleTaskGoal)}
                  className="rounded-md border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                >
                  {GOAL_ORDER.map((goal) => (
                    <option key={goal} value={goal}>
                      {GOAL_LABEL[goal]}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={createDue}
                  onChange={(event) => setCreateDue(event.target.value)}
                  className="rounded-md border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                />
                <input
                  type="text"
                  value={createTitle}
                  onChange={(event) => setCreateTitle(event.target.value)}
                  placeholder="Task title"
                  className="rounded-md border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 md:col-span-2"
                />
                <textarea
                  value={createNotes}
                  onChange={(event) => setCreateNotes(event.target.value)}
                  placeholder="Notes (optional)"
                  className="min-h-[72px] rounded-md border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 md:col-span-2"
                />
              </div>
              <Button
                type="button"
                size="sm"
                onClick={createTask}
                disabled={loading}
                className="border border-cyan-400/40 bg-cyan-500/25 text-cyan-100 hover:bg-cyan-500/35"
              >
                <Plus className="h-4 w-4" />
                Add task
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {visibleTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks in this scope.</p>
        ) : (
          visibleTasks.map((task) => {
            const rowKey = taskKey(task);
            const isEditing = rowKey === editingTaskKey;
            const isWorking = rowKey === workingTaskKey;

            return (
              <div
                key={rowKey}
                className="rounded-lg border border-slate-600/60 bg-slate-800/60 p-3"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      className="w-full rounded-md border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                    />
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <select
                        value={editGoal}
                        onChange={(event) => setEditGoal(event.target.value as GoogleTaskGoal)}
                        className="rounded-md border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                      >
                        {GOAL_ORDER.map((goal) => (
                          <option key={goal} value={goal}>
                            {GOAL_LABEL[goal]}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={editDue}
                        onChange={(event) => setEditDue(event.target.value)}
                        className="rounded-md border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                      />
                    </div>
                    <textarea
                      value={editNotes}
                      onChange={(event) => setEditNotes(event.target.value)}
                      className="w-full min-h-[70px] rounded-md border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveEdit(task)}
                        disabled={isWorking}
                        className="bg-cyan-500/25 text-cyan-100 border border-cyan-400/40 hover:bg-cyan-500/35"
                      >
                        {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={cancelEdit}
                        className="border-slate-500/60 bg-slate-800/70 text-slate-100 hover:bg-slate-700/80"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(task)}
                        className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border border-slate-500/80"
                        disabled={isWorking}
                        aria-label={task.status === "completed" ? "Mark as pending" : "Mark as completed"}
                      >
                        {task.status === "completed" ? (
                          <span className="h-2.5 w-2.5 rounded bg-cyan-300" />
                        ) : null}
                      </button>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            task.status === "completed"
                              ? "line-through text-muted-foreground"
                              : "text-slate-100"
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {GOAL_LABEL[task.goal]}
                          {!status.singleListMode ? ` | ${task.listTitle}` : ""}
                          {task.due ? ` | Due ${task.due}` : ""}
                        </p>
                        {task.notes ? (
                          <p className="mt-1 whitespace-pre-wrap text-xs text-slate-300">
                            {task.notes}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() => startEdit(task)}
                        className="border-slate-500/60 bg-slate-800/70 text-slate-100 hover:bg-slate-700/80"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() => removeTask(task)}
                        disabled={isWorking}
                        className="border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                      >
                        {isWorking ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {error ? <p className="text-xs text-amber-300">{error}</p> : null}
    </div>
  );
}
