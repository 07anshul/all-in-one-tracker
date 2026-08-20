"use client";

import { useState } from "react";
import Link from "next/link";
import type { Entry } from "@/lib/types";
import { averageRating } from "@/lib/rating";
import { TypeBadge } from "./TypeBadge";
import { RatingDots } from "./RatingDots";

export function SurpriseMe({
  entries,
  visitedIds,
}: {
  entries: Entry[];
  visitedIds: string[];
}) {
  const [picked, setPicked] = useState<Entry | null>(null);
  const visited = new Set(visitedIds);

  function pick() {
    if (entries.length === 0) return;
    const weights = entries.map((e) => {
      const rating = averageRating(e) ?? 3;
      const visitedPenalty = visited.has(e.id) ? 0.35 : 1;
      return (0.4 + rating / 5) * visitedPenalty;
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < entries.length; i++) {
      r -= weights[i];
      if (r <= 0) {
        setPicked(entries[i]);
        return;
      }
    }
    setPicked(entries[entries.length - 1]);
  }

  return (
    <div>
      <button
        onClick={pick}
        className="font-label text-[11px] uppercase tracking-widest text-olive border border-olive rounded-full px-3.5 py-1.5 hover:bg-[var(--olive-soft)] hover:scale-105 transition-all cursor-pointer"
      >
        ✦ surprise me
      </button>
      {picked && (
        <div className="mt-3 paper-card rounded-2xl p-4 pop-in">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl italic">{picked.name}</h3>
            <TypeBadge type={picked.type} />
          </div>
          {picked.speciality && (
            <p className="text-ink-soft text-sm mt-2 italic">{picked.speciality}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <RatingDots value={averageRating(picked)} />
            <div className="flex gap-4">
              <button
                onClick={pick}
                className="font-label text-[11px] uppercase tracking-widest text-ink-soft hover:text-rust transition-colors cursor-pointer"
              >
                again
              </button>
              <Link
                href={`/entry/${picked.id}`}
                className="font-label text-[11px] uppercase tracking-widest text-rust hover:underline"
              >
                view →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
