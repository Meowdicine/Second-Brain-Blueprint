import { NextRequest, NextResponse } from "next/server";
import {
  createGoogleTask,
  deleteGoogleTask,
  listGoogleTasksByGoal,
  parseGoal,
  parseGoalOrAll,
  updateGoogleTask,
} from "@/lib/integrations/google/tasks";

export const runtime = "nodejs";

function jsonError(status: number, message: string) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function statusForError(message: string): number {
  const lowered = message.toLowerCase();
  if (
    lowered.includes("not connected") ||
    lowered.includes("not configured") ||
    lowered.includes("authorize") ||
    lowered.includes("token")
  ) {
    return lowered.includes("not configured") ? 400 : 401;
  }

  if (
    lowered.includes("invalid") ||
    lowered.includes("required") ||
    lowered.includes("cannot be empty")
  ) {
    return 400;
  }

  if (lowered.includes("conflict")) {
    return 409;
  }

  return 500;
}

export async function GET(request: NextRequest) {
  try {
    const goal = parseGoalOrAll(new URL(request.url).searchParams.get("goal"));
    const tasksByGoal = await listGoogleTasksByGoal(goal, true);

    return NextResponse.json({
      ok: true,
      goal,
      tasksByGoal,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list tasks";
    return jsonError(statusForError(message), message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      goal?: string;
      title?: string;
      notes?: string;
      due?: string;
      parent?: string;
    };

    const goal = parseGoal(body.goal);
    if (!body.title || body.title.trim() === "") {
      return jsonError(400, "title is required");
    }

    const created = await createGoogleTask({
      goal,
      title: body.title,
      notes: body.notes,
      due: body.due,
      parent: body.parent,
    });

    return NextResponse.json({ ok: true, task: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create task";
    return jsonError(statusForError(message), message);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      listId?: string;
      taskId?: string;
      title?: string;
      notes?: string;
      due?: string | null;
      status?: "needsAction" | "completed";
      goal?: string;
    };

    if (!body.listId || !body.taskId) {
      return jsonError(400, "listId and taskId are required");
    }

    const goal = body.goal ? parseGoal(body.goal) : undefined;

    const updated = await updateGoogleTask({
      listId: body.listId,
      taskId: body.taskId,
      title: body.title,
      notes: body.notes,
      due: body.due,
      status: body.status,
      goal,
    });

    return NextResponse.json({ ok: true, task: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update task";
    return jsonError(statusForError(message), message);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      listId?: string;
      taskId?: string;
    };

    if (!body.listId || !body.taskId) {
      return jsonError(400, "listId and taskId are required");
    }

    await deleteGoogleTask(body.listId, body.taskId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete task";
    return jsonError(statusForError(message), message);
  }
}
