import "server-only";

import { existsSync } from "fs";
import { spawn } from "child_process";
import path from "path";

function getWindowsChromeCandidates(): string[] {
  const candidates: string[] = [];
  const localAppData = process.env.LOCALAPPDATA;
  const programFiles = process.env.PROGRAMFILES;
  const programFilesX86 = process.env["PROGRAMFILES(X86)"];

  if (localAppData) {
    candidates.push(path.join(localAppData, "Google", "Chrome", "Application", "chrome.exe"));
  }

  if (programFiles) {
    candidates.push(path.join(programFiles, "Google", "Chrome", "Application", "chrome.exe"));
  }

  if (programFilesX86) {
    candidates.push(path.join(programFilesX86, "Google", "Chrome", "Application", "chrome.exe"));
  }

  return candidates;
}

function spawnDetached(command: string, args: string[]): boolean {
  try {
    const child = spawn(command, args, {
      detached: true,
      stdio: "ignore",
    });
    child.unref();
    return true;
  } catch {
    return false;
  }
}

export function openUrlInChrome(url: string): boolean {
  if (process.platform === "win32") {
    for (const candidate of getWindowsChromeCandidates()) {
      if (!existsSync(candidate)) continue;
      if (spawnDetached(candidate, [url])) return true;
    }

    if (spawnDetached("chrome", [url])) return true;
    if (spawnDetached("chrome.exe", [url])) return true;
    return false;
  }

  if (process.platform === "darwin") {
    return spawnDetached("open", ["-a", "Google Chrome", url]);
  }

  // Linux and others
  if (spawnDetached("google-chrome", [url])) return true;
  if (spawnDetached("google-chrome-stable", [url])) return true;
  if (spawnDetached("chromium-browser", [url])) return true;
  if (spawnDetached("chromium", [url])) return true;

  return false;
}
