import { NextRequest, NextResponse } from "next/server";
import { buildLaunchpadContext } from "@/lib/launchpad/context";

export const runtime = "nodejs";

function parseRecentNotes(searchParams: URLSearchParams): string[] {
  const values = searchParams.getAll("recentNote");
  const csv = searchParams.get("recentNotes");
  if (csv) {
    values.push(
      ...csv
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    );
  }

  return values;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const context = await buildLaunchpadContext({
      route: searchParams.get("route") ?? undefined,
      recentNotes: parseRecentNotes(searchParams),
    });

    return NextResponse.json({ ok: true, context });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to build launchpad context",
      },
      { status: 500 }
    );
  }
}
