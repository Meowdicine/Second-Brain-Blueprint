import { NextRequest, NextResponse } from "next/server";
import { buildLaunchpadActions } from "@/lib/launchpad/actions";
import { buildLaunchpadContext } from "@/lib/launchpad/context";
import { rankLaunchpadActions } from "@/lib/launchpad/ranker";

export const runtime = "nodejs";

function parseListValues(
  searchParams: URLSearchParams,
  repeatedKey: string,
  csvKey: string
): string[] {
  const values = searchParams
    .getAll(repeatedKey)
    .map((value) => value.trim())
    .filter(Boolean);
  const csv = searchParams.get(csvKey);
  if (csv) {
    values.push(
      ...csv
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    );
  }

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    unique.push(value);
  }
  return unique;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recentNotes = parseListValues(searchParams, "recentNote", "recentNotes");
    const recentActionIds = parseListValues(searchParams, "recentAction", "recentActions");

    const context = await buildLaunchpadContext({
      route: searchParams.get("route") ?? undefined,
      recentNotes,
    });

    const actions = rankLaunchpadActions(
      buildLaunchpadActions(context),
      context,
      recentActionIds
    );

    return NextResponse.json({ ok: true, context, actions });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to build launchpad actions",
      },
      { status: 500 }
    );
  }
}
