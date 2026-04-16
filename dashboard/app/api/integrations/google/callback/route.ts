import { NextRequest, NextResponse } from "next/server";
import { getDashboardEnv } from "@/lib/env";
import { exchangeGoogleCodeAndStoreToken } from "@/lib/integrations/google/oauth";

export const runtime = "nodejs";

const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";

function redirectToSettings(request: NextRequest, status: string, detail: string) {
  const target = new URL("/settings", request.url);
  target.searchParams.set("google", status);
  target.searchParams.set("detail", detail);
  return NextResponse.redirect(target);
}

export async function GET(request: NextRequest) {
  const env = getDashboardEnv();
  if (!env.isGoogleConfigured) {
    return redirectToSettings(
      request,
      "config-missing",
      env.missingGoogleEnv.join(",")
    );
  }

  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");
  if (error) {
    return redirectToSettings(request, "oauth-error", error);
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

  if (!code) {
    return redirectToSettings(request, "missing-code", "missing_code");
  }

  if (!state || !cookieState || state !== cookieState) {
    return redirectToSettings(request, "invalid-state", "oauth_state_mismatch");
  }

  try {
    await exchangeGoogleCodeAndStoreToken(code);
    const response = redirectToSettings(request, "connected", "ok");
    response.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
    return response;
  } catch (error) {
    return redirectToSettings(
      request,
      "token-error",
      error instanceof Error ? error.message : "token_exchange_failed"
    );
  }
}
