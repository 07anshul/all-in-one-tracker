import type { Entry, Graph, Relation } from "./types";

export interface RelatedEntry {
  relation: Relation;
  other: Entry;
  forward: boolean;
}

export function relationsFor(graph: Graph, id: string): RelatedEntry[] {
  const byId = new Map(graph.entries.map((e) => [e.id, e]));
  return graph.relations
    .filter((r) => r.from === id || r.to === id)
    .map((r) => {
      const otherId = r.from === id ? r.to : r.from;
      const other = byId.get(otherId);
      return other ? { relation: r, other, forward: r.from === id } : null;
    })
    .filter((x): x is RelatedEntry => x !== null);
}
