"use client";

import { useState } from "react";
import Link from "next/link";
import type { Entry } from "@/lib/types";
import { averageRating } from "@/lib/rating";
import { mapsLinkFor } from "@/lib/maps";
import { TypeBadge } from "./TypeBadge";
import { RatingDots } from "./RatingDots";
import { PinIcon } from "./PinIcon";
import { EditEntryForm } from "./EditEntryForm";

export function EntryHeader({ entry }: { entry: Entry }) {
  const [editing, setEditing] = useState(false);
  const mapsUrl = mapsLinkFor(entry);

  if (editing) {
    return <EditEntryForm entry={entry} onDone={() => setEditing(false)} />;
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-display text-3xl sm:text-4xl leading-tight">{entry.name}</h1>
        <div className="flex items-center gap-2 shrink-0">
          <TypeBadge type={entry.type} />
          <button
            onClick={() => setEditing(true)}
            className="font-label text-[10px] uppercase tracking-widest text-ink-soft hover:text-rust transition-colors cursor-pointer"
          >
            edit
          </button>
        </div>
      </div>

      {entry.location && (
        <div className="flex items-center gap-1.5 mt-2">
          <p className="font-label text-xs uppercase tracking-wide text-ink-soft">
            {entry.location}
          </p>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-label text-[10px] uppercase tracking-wide text-ink-soft hover:text-rust transition-colors"
            >
              <PinIcon className="h-3 w-3" />
              maps
            </a>
          )}
        </div>
      )}

      <div className="mt-4">
        <RatingDots value={averageRating(entry)} />
      </div>

      {entry.speciality && (
        <p className="border-l-2 border-rust pl-4 italic text-lg text-ink mt-6 leading-relaxed">
          {entry.speciality}
        </p>
      )}

      {entry.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <Link
              key={tag}
              href={`/?q=${encodeURIComponent(tag)}`}
              className="font-label text-[10px] text-ink-soft bg-paper px-1.5 py-0.5 rounded-full border border-line hover:border-rust hover:text-rust transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
