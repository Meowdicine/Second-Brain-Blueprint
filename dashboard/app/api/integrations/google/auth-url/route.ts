import { NextResponse } from "next/server";
import { getDashboardEnv } from "@/lib/env";
import { createGoogleOAuthState, getGoogleOAuthUrl } from "@/lib/integrations/google/oauth";

export const runtime = "nodejs";

const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";

export async function GET() {
  const env = getDashboardEnv();

  if (!env.isGoogleConfigured) {
    return NextResponse.json(
      {
        ok: false,
        error: "Google integration is not configured.",
        missingEnv: env.missingGoogleEnv,
      },
      { status: 400 }
    );
  }

  const state = createGoogleOAuthState();
  const authUrl = getGoogleOAuthUrl(state);

  const response = NextResponse.json({ ok: true, authUrl });
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  });

  return response;
}
