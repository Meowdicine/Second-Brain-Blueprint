import "server-only";

import os from "os";
import path from "path";

export type GoalKey = "work" | "learning" | "operations" | "general";

export interface DashboardEnv {
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  googleTaskListNames: Record<GoalKey, string>;
  googlePrimaryTaskListName: string;
  googleTasksSingleListMode: boolean;
  googleTokenStorePath: string;
  externalOpenEnabled: boolean;
  isGoogleConfigured: boolean;
  missingGoogleEnv: string[];
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value.trim() === "") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

function getDefaultGoogleTokenStorePath(): string {
  const localAppData = process.env.LOCALAPPDATA;
  if (localAppData && localAppData.trim() !== "") {
    return path.join(localAppData, "CursorMemo", "secrets", "google-tasks-token.json");
  }

  return path.join(os.homedir(), ".cursor-memo", "secrets", "google-tasks-token.json");
}

export function getDashboardEnv(): DashboardEnv {
  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";
  const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI?.trim() ?? "";

  const googleTaskListNames: Record<GoalKey, string> = {
    work: process.env.GOOGLE_TASKLIST_WORK_NAME?.trim() || "Work",
    learning: process.env.GOOGLE_TASKLIST_LEARNING_NAME?.trim() || "Learning",
    operations:
      process.env.GOOGLE_TASKLIST_OPERATIONS_NAME?.trim() || "Operations",
    general: process.env.GOOGLE_TASKLIST_GENERAL_NAME?.trim() || "General",
  };

  const googlePrimaryTaskListName =
    process.env.GOOGLE_TASKLIST_PRIMARY_NAME?.trim() ||
    googleTaskListNames.general;
  const googleTasksSingleListMode = parseBoolean(
    process.env.GOOGLE_TASKS_SINGLE_LIST_MODE,
    true
  );

  const googleTokenStorePath =
    process.env.GOOGLE_TOKEN_STORE_PATH?.trim() || getDefaultGoogleTokenStorePath();

  const externalOpenEnabled = parseBoolean(
    process.env.EXTERNAL_OPEN_ENABLED,
    process.env.NODE_ENV !== "production"
  );

  const missingGoogleEnv: string[] = [];
  if (!googleClientId) missingGoogleEnv.push("GOOGLE_CLIENT_ID");
  if (!googleClientSecret) missingGoogleEnv.push("GOOGLE_CLIENT_SECRET");
  if (!googleRedirectUri) missingGoogleEnv.push("GOOGLE_REDIRECT_URI");

  return {
    googleClientId,
    googleClientSecret,
    googleRedirectUri,
    googleTaskListNames,
    googlePrimaryTaskListName,
    googleTasksSingleListMode,
    googleTokenStorePath,
    externalOpenEnabled,
    isGoogleConfigured: missingGoogleEnv.length === 0,
    missingGoogleEnv,
  };
}
