import { NextRequest, NextResponse } from "next/server";
import { readGraph, writeGraph } from "@/lib/data";
import { isAuthorized } from "@/lib/auth";
import { RELATION_KINDS, type Relation } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { from, to, kind, note } = body ?? {};

  if (!RELATION_KINDS.includes(kind)) {
    return NextResponse.json({ error: "Invalid relation kind" }, { status: 400 });
  }
  if (typeof from !== "string" || typeof to !== "string" || from === to) {
    return NextResponse.json({ error: "Two distinct entries are required" }, { status: 400 });
  }

  const graph = await readGraph();
  const ids = new Set(graph.entries.map((e) => e.id));
  if (!ids.has(from) || !ids.has(to)) {
    return NextResponse.json({ error: "Unknown entry id" }, { status: 400 });
  }

  const relation: Relation = {
    id: `rel-${graph.relations.length + 1}-${Date.now().toString(36)}`,
    from,
    to,
    kind,
    note: typeof note === "string" ? note.trim() : "",
  };

  graph.relations.push(relation);
  await writeGraph(graph, `Relate ${from} ↔ ${to}`);

  return NextResponse.json(relation, { status: 201 });
}
