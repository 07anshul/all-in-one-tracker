import Link from "next/link";
import type { Entry } from "@/lib/types";
import { averageRating } from "@/lib/rating";
import { TypeBadge } from "./TypeBadge";
import { RatingDots } from "./RatingDots";

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <Link
      href={`/entry/${entry.id}`}
      className="group block paper-card rounded-sm p-5 transition-all hover:-translate-y-0.5 hover:border-rust/60"
      style={{ transitionProperty: "transform, box-shadow, border-color" }}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-xl leading-snug group-hover:text-rust transition-colors">
          {entry.name}
        </h2>
        <TypeBadge type={entry.type} />
      </div>
      {entry.location && (
        <p className="font-label text-[11px] uppercase tracking-wide text-ink-soft mt-1">
          {entry.location}
        </p>
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
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="font-label text-[10px] text-ink-soft bg-paper px-1.5 py-0.5 rounded-sm border border-line"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
