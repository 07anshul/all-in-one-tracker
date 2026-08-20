import type { Entry } from "./types";

export function averageRating(entry: Entry): number | null {
  if (!entry.reviews.length) return null;
  const sum = entry.reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / entry.reviews.length;
}
