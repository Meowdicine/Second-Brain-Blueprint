import { NextResponse } from "next/server";
import { listGoogleTaskLists } from "@/lib/integrations/google/tasks";

export const runtime = "nodejs";

export async function GET() {
  try {
    const taskLists = await listGoogleTaskLists();
    return NextResponse.json({ ok: true, taskLists });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to list task lists";
    const status =
      message.toLowerCase().includes("not connected") ||
      message.toLowerCase().includes("authorize")
        ? 401
        : 500;
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status }
    );
  }
}
