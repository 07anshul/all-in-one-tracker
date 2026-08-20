"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { computeLayout, type LayoutEdge, type Point } from "@/lib/graph-layout";
import { RELATION_LABELS } from "@/lib/types";
import type { Entry, EntryType, Relation } from "@/lib/types";

const TYPE_COLOR: Record<EntryType, string> = {
  restaurant: "var(--rust)",
  place: "var(--olive)",
  activity: "var(--ochre)",
};

const WIDTH = 900;
const HEIGHT = 620;

export function GraphView({ entries, relations }: { entries: Entry[]; relations: Relation[] }) {
  const router = useRouter();
  const [showTags, setShowTags] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const tagEdges: LayoutEdge[] = useMemo(() => {
    const edges: LayoutEdge[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const shared = entries[i].tags.some((t) => entries[j].tags.includes(t));
        if (!shared) continue;
        const key = [entries[i].id, entries[j].id].sort().join("::");
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push({ from: entries[i].id, to: entries[j].id, weak: true });
      }
    }
    return edges;
  }, [entries]);

  const relationEdges: LayoutEdge[] = useMemo(
    () => relations.map((r) => ({ from: r.from, to: r.to })),
    [relations]
  );

  const layoutKey = useMemo(
    () => entries.map((e) => e.id).join(",") + "|" + relations.map((r) => r.id).join(","),
    [entries, relations]
  );

  // The force simulation is a chaotic iterative system: tiny floating-point
  // differences between Node's and the browser's math implementations
  // amplify over hundreds of iterations, so running it during SSR produces
  // a hydration mismatch. Compute it client-only, after mount, instead.
  const [positions, setPositions] = useState<Map<string, Point> | null>(null);

  useEffect(() => {
    const nodes = entries.map((e) => ({ id: e.id }));
    const edges = showTags ? [...relationEdges, ...tagEdges] : relationEdges;
    setPositions(computeLayout(nodes, edges, WIDTH, HEIGHT));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey, showTags]);

  const entryById = useMemo(() => new Map(entries.map((e) => [e.id, e])), [entries]);

  if (entries.length === 0) {
    return <p className="text-ink-soft italic font-display text-lg py-16 text-center">Nothing to map yet.</p>;
  }

  if (!positions) {
    return <div className="paper-card rounded-sm" style={{ height: 320 }} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-4 font-label text-[10px] uppercase tracking-widest text-ink-soft">
          <Legend color={TYPE_COLOR.restaurant} label="restaurant" />
          <Legend color={TYPE_COLOR.place} label="place" />
          <Legend color={TYPE_COLOR.activity} label="activity" />
        </div>
        <label className="font-label text-[10px] uppercase tracking-widest text-ink-soft flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={showTags}
            onChange={(e) => setShowTags(e.target.checked)}
            style={{ accentColor: "var(--rust)" }}
          />
          shared tags
        </label>
      </div>

      <div className="paper-card rounded-sm overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto"
          style={{ minWidth: WIDTH, width: WIDTH }}
        >
          {showTags &&
            tagEdges.map((edge, i) => {
              const a = positions.get(edge.from);
              const b = positions.get(edge.to);
              if (!a || !b) return null;
              return (
                <line
                  key={`tag-${i}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--line)"
                  strokeWidth={1}
                  strokeDasharray="3 4"
                />
              );
            })}

          {relations.map((rel) => {
            const a = positions.get(rel.from);
            const b = positions.get(rel.to);
            if (!a || !b) return null;
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const dimmed = hovered && hovered !== rel.from && hovered !== rel.to;
            return (
              <g key={rel.id} opacity={dimmed ? 0.25 : 1}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--ink-soft)" strokeWidth={1.3} />
                <title>{`${entryById.get(rel.from)?.name} ${RELATION_LABELS[rel.kind]} ${entryById.get(rel.to)?.name}${rel.note ? ` — ${rel.note}` : ""}`}</title>
                <rect
                  x={midX - 3}
                  y={midY - 3}
                  width={6}
                  height={6}
                  fill="var(--paper-card)"
                  stroke="var(--ink-soft)"
                  strokeWidth={0.75}
                  transform={`rotate(45 ${midX} ${midY})`}
                />
              </g>
            );
          })}

          {entries.map((entry) => {
            const p = positions.get(entry.id);
            if (!p) return null;
            const radius = 12 + Math.min(entry.reviews.length, 6) * 2;
            const dimmed = hovered && hovered !== entry.id;
            return (
              <g
                key={entry.id}
                transform={`translate(${p.x}, ${p.y})`}
                opacity={dimmed ? 0.35 : 1}
                onMouseEnter={() => setHovered(entry.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/entry/${entry.id}`)}
                className="cursor-pointer"
              >
                <circle
                  r={radius}
                  fill="var(--paper-card)"
                  stroke={TYPE_COLOR[entry.type]}
                  strokeWidth={2}
                />
                <text
                  y={radius + 14}
                  textAnchor="middle"
                  className="font-display italic"
                  style={{ fontSize: 13, fill: "var(--ink)" }}
                >
                  {entry.name}
                </text>
                <title>{entry.name}</title>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="font-label text-[10px] uppercase tracking-widest text-ink-soft mt-2 text-center">
        click a node to open it · hover a connection for details · scroll sideways to see more
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full inline-block border-2" style={{ borderColor: color }} />
      {label}
    </span>
  );
}
