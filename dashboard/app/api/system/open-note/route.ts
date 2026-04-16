import { NextRequest, NextResponse } from "next/server";
import { getDashboardEnv } from "@/lib/env";
import { openNoteInCursor, resolveNoteAbsolutePath } from "@/lib/system/open-note";
import type { OpenNoteRequest } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const env = getDashboardEnv();

  if (!env.externalOpenEnabled) {
    return NextResponse.json(
      {
        ok: false,
        error: "External launch is disabled. Set EXTERNAL_OPEN_ENABLED=true in .env.",
      },
      { status: 403 }
    );
  }

  let payload: OpenNoteRequest;

  try {
    payload = (await request.json()) as OpenNoteRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const notePath = (payload.notePath ?? "").trim();
  if (!notePath) {
    return NextResponse.json({ ok: false, error: "notePath is required." }, { status: 400 });
  }

  const absolutePath = resolveNoteAbsolutePath(notePath);
  if (!absolutePath) {
    return NextResponse.json(
      { ok: false, error: "Invalid or missing markdown note path." },
      { status: 400 }
    );
  }

  const opened = openNoteInCursor(absolutePath);
  if (!opened) {
    return NextResponse.json(
      { ok: false, error: "Failed to launch Cursor via CLI." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
