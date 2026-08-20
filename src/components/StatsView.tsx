import type { Entry, EntryType, Plan } from "@/lib/types";
import {
  countsByType,
  topTags,
  entriesByMonth,
  overallStats,
  monthLabel,
} from "@/lib/stats";

const TYPE_COLOR: Record<EntryType, string> = {
  restaurant: "var(--rust)",
  place: "var(--olive)",
  activity: "var(--ochre)",
};

const TYPE_LABEL: Record<EntryType, string> = {
  restaurant: "restaurants",
  place: "places",
  activity: "activities",
};

export function StatsView({ entries, plans }: { entries: Entry[]; plans: Plan[] }) {
  const stats = overallStats(entries, plans);
  const counts = countsByType(entries);
  const maxTypeCount = Math.max(1, ...Object.values(counts));
  const tags = topTags(entries);
  const maxTagCount = Math.max(1, ...tags.map((t) => t.count));
  const months = entriesByMonth(entries);
  const maxMonthCount = Math.max(1, ...months.map((m) => m.count));

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile value={stats.totalEntries} label="entries" />
        <StatTile value={stats.totalReviews} label="notes" />
        <StatTile
          value={stats.avgRating !== null ? stats.avgRating.toFixed(1) : "—"}
          label="avg rating"
        />
        <StatTile value={stats.visited} label="visited" />
      </div>

      <section>
        <h2 className="font-label text-[11px] uppercase tracking-widest text-ink-soft mb-3">
          by type
        </h2>
        <div className="space-y-2.5">
          {(Object.keys(counts) as EntryType[]).map((type) => (
            <div key={type}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-label text-xs uppercase tracking-wide" style={{ color: TYPE_COLOR[type] }}>
                  {TYPE_LABEL[type]}
                </span>
                <span className="font-label text-xs text-ink-soft">{counts[type]}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--line)] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(counts[type] / maxTypeCount) * 100}%`,
                    backgroundColor: TYPE_COLOR[type],
                  }}
                  title={`${counts[type]} ${TYPE_LABEL[type]}`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {tags.length > 0 && (
        <section>
          <h2 className="font-label text-[11px] uppercase tracking-widest text-ink-soft mb-3">
            top tags
          </h2>
          <div className="space-y-2.5">
            {tags.map(({ tag, count }) => (
              <div key={tag}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-label text-xs text-ink">{tag}</span>
                  <span className="font-label text-xs text-ink-soft">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--line)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(count / maxTagCount) * 100}%`,
                      backgroundColor: "var(--rust)",
                      opacity: 0.75,
                    }}
                    title={`${count} entries tagged "${tag}"`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {months.length > 0 && (
        <section>
          <h2 className="font-label text-[11px] uppercase tracking-widest text-ink-soft mb-3">
            entries added over time
          </h2>
          <div className="flex items-end gap-3 h-32">
            {months.map(({ month, count }) => (
              <div key={month} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                <span className="font-label text-[10px] text-ink-soft">{count}</span>
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${Math.max((count / maxMonthCount) * 100, 6)}%`,
                    backgroundColor: "var(--ink-soft)",
                    opacity: 0.7,
                  }}
                  title={`${count} entries in ${monthLabel(month)}`}
                />
                <span className="font-label text-[10px] uppercase text-ink-soft">
                  {monthLabel(month)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="paper-card rounded-sm p-4 text-center">
      <div className="font-display text-3xl">{value}</div>
      <div className="font-label text-[10px] uppercase tracking-widest text-ink-soft mt-1">
        {label}
      </div>
    </div>
  );
}
