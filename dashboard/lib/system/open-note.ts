import "server-only";

import { existsSync } from "fs";
import { spawn } from "child_process";
import path from "path";

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

function normalizeNotePath(notePath: string): string {
  return notePath.replace(/\\/g, "/").replace(/^\/+/, "");
}

export function resolveNoteAbsolutePath(notePath: string): string | null {
  const repoRoot = path.resolve(process.cwd(), "..");
  const normalized = normalizeNotePath(notePath.trim());

  if (!normalized) return null;
  if (!normalized.toLowerCase().endsWith(".md")) return null;

  const absolute = path.resolve(repoRoot, normalized);
  const relative = path.relative(repoRoot, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  if (!existsSync(absolute)) {
    return null;
  }

  return absolute;
}

export function openNoteInCursor(absolutePath: string): boolean {
  if (process.platform === "win32") {
    if (spawnDetached("cursor", ["--reuse-window", "--goto", `${absolutePath}:1`])) return true;
    if (spawnDetached("cursor.cmd", ["--reuse-window", "--goto", `${absolutePath}:1`])) return true;
    return false;
  }

  if (spawnDetached("cursor", ["--reuse-window", "--goto", `${absolutePath}:1`])) return true;
  return false;
}
