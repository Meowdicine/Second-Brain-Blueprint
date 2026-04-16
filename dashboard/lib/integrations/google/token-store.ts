import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";
import { getDashboardEnv } from "@/lib/env";

export interface GoogleTokenRecord {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  scope: string;
  expiryDate: number;
}

export async function readGoogleTokenRecord(): Promise<GoogleTokenRecord | null> {
  const env = getDashboardEnv();

  try {
    const raw = await readFile(env.googleTokenStorePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<GoogleTokenRecord>;

    if (
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.expiryDate !== "number"
    ) {
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      tokenType: typeof parsed.tokenType === "string" ? parsed.tokenType : "Bearer",
      scope: typeof parsed.scope === "string" ? parsed.scope : "",
      expiryDate: parsed.expiryDate,
    };
  } catch {
    return null;
  }
}

export async function writeGoogleTokenRecord(record: GoogleTokenRecord): Promise<void> {
  const env = getDashboardEnv();
  await mkdir(dirname(env.googleTokenStorePath), { recursive: true });
  await writeFile(env.googleTokenStorePath, `${JSON.stringify(record, null, 2)}\n`, "utf-8");
}

export function getGoogleTokenStorePath(): string {
  return getDashboardEnv().googleTokenStorePath;
}
