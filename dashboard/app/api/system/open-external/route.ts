import { NextRequest, NextResponse } from "next/server";
import { getDashboardEnv } from "@/lib/env";
import { openUrlInChrome } from "@/lib/system/open-external";
import type { ExternalLaunchRequest } from "@/lib/types";

export const runtime = "nodejs";

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

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

  let payload: ExternalLaunchRequest;

  try {
    payload = (await request.json()) as ExternalLaunchRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const targetUrl = (payload.url ?? "").trim();
  if (!targetUrl || !isHttpUrl(targetUrl)) {
    return NextResponse.json(
      { ok: false, error: "Only http/https URLs are allowed." },
      { status: 400 }
    );
  }

  const launched = openUrlInChrome(targetUrl);

  if (!launched) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to open Chrome. Open manually in Chrome.",
        url: targetUrl,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
