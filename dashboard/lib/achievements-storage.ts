"use client";

import type { Achievement } from "./types";

const STORAGE_KEY = "dashboard-achievements";

const SEED_ACHIEVEMENTS: Achievement[] = [
  {
    id: "seed-work-project-brief",
    title: "Turned an active work stream into a clear project brief.",
    date: "2026-04-15",
    notePath: "20_Areas/Work/Work.md",
    tag: "work",
  },
  {
    id: "seed-learning-synthesis",
    title: "Promoted one source into a reusable synthesis note.",
    date: "2026-04-15",
    notePath: "20_Areas/Learning/Learning.md",
    tag: "learning",
  },
  {
    id: "seed-operations-review",
    title: "Completed a weekly review and removed one maintenance bottleneck.",
    date: "2026-04-15",
    notePath: "20_Areas/Operations/Operations.md",
    tag: "operations",
  },
  {
    id: "seed-control-layer-alignment",
    title: "Aligned agent control-layer rules across the starter.",
    date: "2026-04-15",
    notePath: "99_System/Agent-Kernel.md",
    tag: "system",
  },
];

function normalizeTitle(value: string): string {
  return value.trim().toLowerCase();
}

function dedupeAchievements(list: Achievement[]): Achievement[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const output: Achievement[] = [];

  for (const item of list) {
    const id = item.id?.trim();
    const titleKey = normalizeTitle(item.title ?? "");

    if (!id || !titleKey) {
      continue;
    }

    if (seenIds.has(id) || seenTitles.has(titleKey)) {
      continue;
    }

    seenIds.add(id);
    seenTitles.add(titleKey);
    output.push(item);
  }

  return output;
}

function mergeSeedAchievements(list: Achievement[]): Achievement[] {
  const merged = [...list];
  const existingTitles = new Set(merged.map((item) => normalizeTitle(item.title)));
  const existingIds = new Set(merged.map((item) => item.id));

  const missingSeeds = SEED_ACHIEVEMENTS.filter(
    (seed) => !existingIds.has(seed.id) && !existingTitles.has(normalizeTitle(seed.title))
  );

  if (missingSeeds.length === 0) {
    return merged;
  }

  return [...missingSeeds, ...merged];
}

function safelyLoadLocalAchievements(): Achievement[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Achievement[]) : [];
  } catch {
    return [];
  }
}

export function loadAchievements(): Achievement[] {
  const local = dedupeAchievements(safelyLoadLocalAchievements());
  const merged = dedupeAchievements(mergeSeedAchievements(local));

  if (typeof window !== "undefined") {
    const raw = safelyLoadLocalAchievements();
    if (merged.length !== raw.length) {
      saveAchievements(merged);
    }
  }

  return merged;
}

export function saveAchievements(achievements: Achievement[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dedupeAchievements(achievements)));
  } catch {
    // ignore
  }
}

export function addAchievement(achievement: Omit<Achievement, "id">): Achievement {
  const list = loadAchievements();
  const id = `a-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const newItem: Achievement = { ...achievement, id };
  saveAchievements([newItem, ...list]);
  return newItem;
}

export function deleteAchievement(id: string) {
  const list = loadAchievements().filter((a) => a.id !== id);
  saveAchievements(list);
}
