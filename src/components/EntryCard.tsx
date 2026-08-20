import Link from "next/link";
import type { Entry } from "@/lib/types";
import { averageRating } from "@/lib/rating";
import { mapsLinkFor } from "@/lib/maps";
import { TypeBadge } from "./TypeBadge";
import { RatingDots } from "./RatingDots";
import { PinIcon } from "./PinIcon";

export function EntryCard({ entry }: { entry: Entry }) {
  const mapsUrl = mapsLinkFor(entry);

  return (
    <div
      className="group relative paper-card rounded-3xl p-5 transition-all hover:-translate-y-0.5 hover:border-rust/60"
      style={{ transitionProperty: "transform, box-shadow, border-color" }}
    >
      <Link href={`/entry/${entry.id}`} className="absolute inset-0 rounded-3xl">
        <span className="sr-only">{entry.name}</span>
      </Link>

      <div className="relative pointer-events-none">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl leading-snug group-hover:text-rust transition-colors">
            {entry.name}
          </h2>
          <TypeBadge type={entry.type} />
        </div>
        {entry.location && (
          <div className="mt-1 flex items-center gap-1.5">
            <p className="font-label text-[11px] uppercase tracking-wide text-ink-soft">
              {entry.location}
            </p>
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${entry.name} in Google Maps`}
                className="pointer-events-auto text-ink-soft hover:text-rust transition-colors"
              >
                <PinIcon className="h-3 w-3" />
              </a>
            )}
          </div>
        )}
        {entry.speciality && (
          <p className="italic text-ink-soft mt-3 text-[15px] leading-relaxed">
            {entry.speciality}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <RatingDots value={averageRating(entry)} />
          <span className="font-label text-[11px] text-ink-soft">
            {entry.reviews.length} {entry.reviews.length === 1 ? "note" : "notes"}
          </span>
        </div>
        {entry.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 pointer-events-auto">
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
    </div>
  );
}
