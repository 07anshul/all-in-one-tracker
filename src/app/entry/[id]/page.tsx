import Link from "next/link";
import { notFound } from "next/navigation";
import { readGraph } from "@/lib/data";
import { averageRating } from "@/lib/rating";
import { relationsFor } from "@/lib/relations";
import { RELATION_LABELS, RELATION_LABELS_REVERSED } from "@/lib/types";
import { TypeBadge } from "@/components/TypeBadge";
import { RatingDots } from "@/components/RatingDots";
import { AddReviewForm } from "@/components/AddReviewForm";
import { AddRelationForm } from "@/components/AddRelationForm";

export const dynamic = "force-dynamic";

export default async function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const graph = await readGraph();
  const entry = graph.entries.find((e) => e.id === id);

  if (!entry) notFound();

  const related = relationsFor(graph, id);
  const otherEntries = graph.entries
    .filter((e) => e.id !== id)
    .map((e) => ({ id: e.id, name: e.name }));

  return (
    <div>
      <Link
        href="/"
        className="font-label text-[11px] uppercase tracking-widest text-ink-soft hover:text-rust transition-colors"
      >
        ← index
      </Link>

      <div className="mt-6 flex items-start justify-between gap-3">
        <h1 className="font-display text-3xl sm:text-4xl leading-tight">{entry.name}</h1>
        <TypeBadge type={entry.type} />
      </div>

      {entry.location && (
        <p className="font-label text-xs uppercase tracking-wide text-ink-soft mt-2">
          {entry.location}
        </p>
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
            <span
              key={tag}
              className="font-label text-[10px] text-ink-soft bg-paper px-1.5 py-0.5 rounded-sm border border-line"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-label text-[11px] uppercase tracking-widest text-ink-soft">
            notes
          </h2>
        </div>
        <div className="space-y-3">
          {entry.reviews.length === 0 && (
            <p className="text-ink-soft italic text-sm">No notes yet.</p>
          )}
          {[...entry.reviews]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((review) => (
              <div key={review.id} className="paper-card rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <RatingDots value={review.rating} />
                  <span className="font-label text-[11px] text-ink-soft">{review.date}</span>
                </div>
                {review.note && <p className="mt-2 text-sm leading-relaxed">{review.note}</p>}
              </div>
            ))}
        </div>
        <div className="mt-3">
          <AddReviewForm entryId={entry.id} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-label text-[11px] uppercase tracking-widest text-ink-soft mb-3">
          connections
        </h2>
        <div className="space-y-2">
          {related.length === 0 && (
            <p className="text-ink-soft italic text-sm">Nothing linked yet.</p>
          )}
          {related.map(({ relation, other, forward }) => (
            <Link
              key={relation.id}
              href={`/entry/${other.id}`}
              className="paper-card rounded-sm p-3 flex items-center justify-between gap-3 hover:border-olive/60 transition-colors block"
            >
              <span className="text-sm">
                <span className="text-ink-soft">
                  is {forward ? RELATION_LABELS[relation.kind] : RELATION_LABELS_REVERSED[relation.kind]}
                </span>{" "}
                <span className="font-display italic">{other.name}</span>
                {relation.note && (
                  <span className="text-ink-soft"> — {relation.note}</span>
                )}
              </span>
              <TypeBadge type={other.type} />
            </Link>
          ))}
        </div>
        <div className="mt-3">
          <AddRelationForm entryId={entry.id} otherEntries={otherEntries} />
        </div>
      </section>
    </div>
  );
}
