import { readGraph } from "@/lib/data";
import { EntryBrowser } from "@/components/EntryBrowser";
import { SurpriseMe } from "@/components/SurpriseMe";
import { overallStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const graph = await readGraph();
  const { q } = await searchParams;
  const stats = overallStats(graph.entries, graph.plans);
  const visitedIds = graph.plans
    .filter((p) => p.status === "visited")
    .map((p) => p.entryId);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <p className="font-label text-[11px] uppercase tracking-widest text-ink-soft">
          {stats.totalEntries} {stats.totalEntries === 1 ? "entry" : "entries"} ·{" "}
          {stats.totalReviews} {stats.totalReviews === 1 ? "note" : "notes"}
          {stats.avgRating !== null && <> · {stats.avgRating.toFixed(1)} avg</>}
          {stats.planned > 0 && (
            <>
              {" "}
              · {stats.planned} planned
            </>
          )}
        </p>
        <SurpriseMe entries={graph.entries} visitedIds={visitedIds} />
      </div>
      <EntryBrowser key={q ?? ""} entries={graph.entries} initialQuery={q ?? ""} />
    </div>
  );
}
