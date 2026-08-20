"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Entry, Relation } from "@/lib/types";
import { mapsLinkFor, directionsLinkFor } from "@/lib/maps";
import { TypeBadge } from "./TypeBadge";
import { PinIcon } from "./PinIcon";

const SUGGEST_KINDS = new Set(["near", "pairs-well-with"]);

export function ItineraryBuilder({
  entries,
  relations,
}: {
  entries: Entry[];
  relations: Relation[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryById = useMemo(() => new Map(entries.map((e) => [e.id, e])), [entries]);

  const [stopIds, setStopIds] = useState<string[]>(() => {
    const raw = searchParams.get("stops");
    return raw ? raw.split(",").filter((id) => entryById.has(id)) : [];
  });
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = stopIds.length ? `/itinerary?stops=${stopIds.join(",")}` : "/itinerary";
    router.replace(url, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopIds]);

  const stops = stopIds.map((id) => entryById.get(id)).filter((e): e is Entry => Boolean(e));

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return entries
      .filter((e) => !stopIds.includes(e.id))
      .filter((e) => e.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [entries, query, stopIds]);

  const suggestions = useMemo(() => {
    const stopSet = new Set(stopIds);
    const seen = new Map<string, { entry: Entry; because: string }>();
    for (const rel of relations) {
      if (!SUGGEST_KINDS.has(rel.kind)) continue;
      const fromIn = stopSet.has(rel.from);
      const toIn = stopSet.has(rel.to);
      if (fromIn === toIn) continue;
      const otherId = fromIn ? rel.to : rel.from;
      const anchorId = fromIn ? rel.from : rel.to;
      if (stopSet.has(otherId) || seen.has(otherId)) continue;
      const other = entryById.get(otherId);
      const anchor = entryById.get(anchorId);
      if (!other || !anchor) continue;
      seen.set(otherId, { entry: other, because: anchor.name });
    }
    return [...seen.values()].slice(0, 5);
  }, [relations, stopIds, entryById]);

  function addStop(id: string) {
    setStopIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setQuery("");
  }

  function removeStop(id: string) {
    setStopIds((prev) => prev.filter((s) => s !== id));
  }

  function move(index: number, delta: number) {
    setStopIds((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function copyLink() {
    const url = `${window.location.origin}/itinerary${
      stopIds.length ? `?stops=${stopIds.join(",")}` : ""
    }`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const directionsUrl = directionsLinkFor(stops);

  return (
    <div>
      <div className="relative mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search entries to add…"
          className="w-full font-body text-sm bg-transparent border-b border-line focus:border-rust outline-none py-1.5 placeholder:text-ink-soft/70"
        />
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full paper-card rounded-sm overflow-hidden">
            {searchResults.map((e) => (
              <button
                key={e.id}
                onClick={() => addStop(e.id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--rust-soft)] transition-colors cursor-pointer flex items-center justify-between gap-2"
              >
                <span>{e.name}</span>
                <TypeBadge type={e.type} />
              </button>
            ))}
          </div>
        )}
      </div>

      {stops.length === 0 ? (
        <p className="text-ink-soft italic font-display text-lg py-12 text-center">
          Add a few stops to build a day plan.
        </p>
      ) : (
        <div className="space-y-2">
          {stops.map((entry, i) => {
            const mapsUrl = mapsLinkFor(entry);
            return (
              <div
                key={entry.id}
                className="paper-card rounded-sm p-3 flex items-center gap-3"
              >
                <span className="font-display italic text-ink-soft w-6 text-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/entry/${entry.id}`}
                      className="font-display hover:text-rust transition-colors"
                    >
                      {entry.name}
                    </Link>
                    <TypeBadge type={entry.type} />
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ink-soft hover:text-rust transition-colors"
                        aria-label={`Open ${entry.name} in Google Maps`}
                      >
                        <PinIcon className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="font-label text-ink-soft hover:text-rust disabled:opacity-30 cursor-pointer px-1"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === stops.length - 1}
                    className="font-label text-ink-soft hover:text-rust disabled:opacity-30 cursor-pointer px-1"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeStop(entry.id)}
                    className="font-label text-[10px] uppercase tracking-widest text-rust hover:underline cursor-pointer ml-1"
                  >
                    remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-6">
          <h2 className="font-label text-[11px] uppercase tracking-widest text-ink-soft mb-2">
            you might also add
          </h2>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(({ entry, because }) => (
              <button
                key={entry.id}
                onClick={() => addStop(entry.id)}
                className="font-label text-[11px] text-ink-soft border border-line rounded-sm px-2.5 py-1 hover:border-olive hover:text-olive transition-colors cursor-pointer"
              >
                + {entry.name} <span className="opacity-70">(near {because})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {stops.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={copyLink}
            className="font-label text-[11px] uppercase tracking-widest text-ink-soft border border-line rounded-sm px-3 py-1.5 hover:border-rust hover:text-rust transition-colors cursor-pointer"
          >
            {copied ? "copied!" : "copy shareable link"}
          </button>
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="font-label text-[11px] uppercase tracking-widest text-paper-card bg-rust rounded-sm px-3 py-1.5 hover:opacity-90 transition-opacity"
            >
              open route in maps
            </a>
          )}
        </div>
      )}
    </div>
  );
}
