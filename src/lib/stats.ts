import type { Entry, EntryType, Plan } from "./types";
import { averageRating } from "./rating";

export function countsByType(entries: Entry[]): Record<EntryType, number> {
  const counts: Record<EntryType, number> = { restaurant: 0, place: 0, activity: 0 };
  for (const e of entries) counts[e.type]++;
  return counts;
}

export function topTags(entries: Entry[], limit = 8): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    for (const tag of e.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
}

export function entriesByMonth(entries: Entry[]): { month: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    const month = e.createdAt.slice(0, 7);
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function overallStats(entries: Entry[], plans: Plan[]) {
  const totalReviews = entries.reduce((sum, e) => sum + e.reviews.length, 0);
  const rated = entries.map(averageRating).filter((r): r is number => r !== null);
  const avgRating = rated.length ? rated.reduce((a, b) => a + b, 0) / rated.length : null;
  const visited = plans.filter((p) => p.status === "visited").length;
  const planned = plans.filter((p) => p.status === "planned").length;
  return {
    totalEntries: entries.length,
    totalReviews,
    avgRating,
    visited,
    planned,
  };
}

export function monthLabel(month: string): string {
  const [year, m] = month.split("-").map(Number);
  return new Date(year, m - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}
