import "server-only";

import { randomBytes } from "crypto";
import { getDashboardEnv } from "@/lib/env";
import {
  readGoogleTokenRecord,
  writeGoogleTokenRecord,
  type GoogleTokenRecord,
} from "@/lib/integrations/google/token-store";

const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export const GOOGLE_TASKS_SCOPE = "https://www.googleapis.com/auth/tasks";

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

export function createGoogleOAuthState(): string {
  return randomBytes(16).toString("hex");
}

export function getGoogleOAuthUrl(state: string): string {
  const env = getDashboardEnv();

  const url = new URL(GOOGLE_OAUTH_ENDPOINT);
  url.searchParams.set("client_id", env.googleClientId);
  url.searchParams.set("redirect_uri", env.googleRedirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_TASKS_SCOPE);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);

  return url.toString();
}

async function exchangeTokenPayload(
  payload: Record<string, string>
): Promise<TokenResponse> {
  const body = new URLSearchParams(payload).toString();

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const data = (await response.json()) as TokenResponse;

  if (!response.ok || data.error) {
    const reason = data.error_description || data.error || response.statusText;
    throw new Error(`Google token exchange failed: ${reason}`);
  }

  return data;
}

function toTokenRecord(
  data: TokenResponse,
  previous: GoogleTokenRecord | null
): GoogleTokenRecord {
  if (!data.access_token) {
    throw new Error("Missing access_token from Google token response");
  }

  const refreshToken = data.refresh_token || previous?.refreshToken;
  if (!refreshToken) {
    throw new Error("Missing refresh_token. Reconnect with consent prompt.");
  }

  const expiresInSeconds = typeof data.expires_in === "number" ? data.expires_in : 3600;

  return {
    accessToken: data.access_token,
    refreshToken,
    tokenType: data.token_type || previous?.tokenType || "Bearer",
    scope: data.scope || previous?.scope || GOOGLE_TASKS_SCOPE,
    expiryDate: Date.now() + expiresInSeconds * 1000,
  };
}

export async function exchangeGoogleCodeAndStoreToken(code: string): Promise<void> {
  const env = getDashboardEnv();
  const previous = await readGoogleTokenRecord();

  const data = await exchangeTokenPayload({
    code,
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    redirect_uri: env.googleRedirectUri,
    grant_type: "authorization_code",
  });

  const record = toTokenRecord(data, previous);
  await writeGoogleTokenRecord(record);
}

export async function refreshGoogleAccessToken(
  refreshToken: string
): Promise<GoogleTokenRecord> {
  const env = getDashboardEnv();
  const previous = await readGoogleTokenRecord();

  const data = await exchangeTokenPayload({
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const record = toTokenRecord(
    {
      ...data,
      refresh_token: refreshToken,
    },
    previous
  );

  await writeGoogleTokenRecord(record);
  return record;
}
