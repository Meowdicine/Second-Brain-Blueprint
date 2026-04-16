import { NextResponse } from "next/server";
import { getGoogleIntegrationStatus } from "@/lib/integrations/google/tasks";

export const runtime = "nodejs";

export async function GET() {
  const status = await getGoogleIntegrationStatus();
  return NextResponse.json({ ok: true, status });
}
