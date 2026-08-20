"use client";

import { useMemo, useState } from "react";
import type { Entry, EntryType } from "@/lib/types";
import { EntryCard } from "./EntryCard";
import { EmptyState } from "./EmptyState";

const FILTERS: { label: string; value: EntryType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Restaurants", value: "restaurant" },
  { label: "Places", value: "place" },
  { label: "Activities", value: "activity" },
];

export function EntryBrowser({
  entries,
  initialQuery = "",
}: {
  entries: Entry[];
  initialQuery?: string;
}) {
  const [filter, setFilter] = useState<EntryType | "all">("all");
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter((e) => filter === "all" || e.type === filter)
      .filter((e) => {
        if (!q) return true;
        return (
          e.name.toLowerCase().includes(q) ||
          e.speciality.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [entries, filter, query]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`font-label text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors cursor-pointer hover:scale-105 ${
                filter === f.value
                  ? "border-rust text-rust"
                  : "border-line text-ink-soft hover:border-rust/40"
              }`}
              style={filter === f.value ? { backgroundColor: "var(--rust-soft)" } : undefined}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search notes, tags, places…"
          className="flex-1 font-body text-sm bg-transparent border-b border-line focus:border-rust outline-none py-1.5 placeholder:text-ink-soft/70"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="Nothing here yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((entry, i) => (
            <div key={entry.id} className="pop-in" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <EntryCard entry={entry} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
