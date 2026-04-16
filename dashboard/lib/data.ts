import { readFileSync } from "fs";
import path from "path";
import type {
  GoogleIntegrationStatus,
  GoogleTasksByGoal,
  HomeData,
  StarterAreaData,
  StarterGoal,
} from "./types";
import {
  getGoogleIntegrationStatus,
  listGoogleTasksByGoal,
} from "./integrations/google/tasks";

const DATA_DIR = path.join(process.cwd(), "..", "dashboard-data");

function readDataFile<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const fileContent = readFileSync(filePath, "utf-8");
  const normalized = fileContent.replace(/^\uFEFF/, "");
  return JSON.parse(normalized) as T;
}

export function getHomeData(): HomeData {
  return readDataFile<HomeData>("home.json");
}

export function getWorkData(): StarterAreaData {
  return readDataFile<StarterAreaData>("work.json");
}

export function getLearningData(): StarterAreaData {
  return readDataFile<StarterAreaData>("learning.json");
}

export function getOperationsData(): StarterAreaData {
  return readDataFile<StarterAreaData>("operations.json");
}

export function getAreaData(goal: StarterGoal): StarterAreaData {
  if (goal === "work") return getWorkData();
  if (goal === "learning") return getLearningData();
  return getOperationsData();
}

export function getAllData() {
  return {
    home: getHomeData(),
    work: getWorkData(),
    learning: getLearningData(),
    operations: getOperationsData(),
  };
}

export async function getGoogleNextActionsViewData(): Promise<{
  status: GoogleIntegrationStatus;
  tasksByGoal: GoogleTasksByGoal | null;
  fallbackActions: HomeData["nextActions"];
}> {
  const homeData = getHomeData();
  let status = await getGoogleIntegrationStatus();

  if (!status.connected) {
    return {
      status,
      tasksByGoal: null,
      fallbackActions: homeData.nextActions,
    };
  }

  try {
    const tasksByGoal = await listGoogleTasksByGoal("all", true);
    status = await getGoogleIntegrationStatus();
    return {
      status,
      tasksByGoal,
      fallbackActions: homeData.nextActions,
    };
  } catch (error) {
    status = await getGoogleIntegrationStatus(
      error instanceof Error ? error.message : "Failed to load Google tasks"
    );
    return {
      status,
      tasksByGoal: null,
      fallbackActions: homeData.nextActions,
    };
  }
}
