import { NextRequest, NextResponse } from "next/server";
import { readGraph, writeGraph } from "@/lib/data";
import { isAuthorized } from "@/lib/auth";
import { ENTRY_TYPES, type EntryType } from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { type, name, location, speciality, tags } = body ?? {};

  const graph = await readGraph();
  const entry = graph.entries.find((e) => e.id === id);
  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  if (type !== undefined) {
    if (!ENTRY_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid entry type" }, { status: 400 });
    }
    entry.type = type as EntryType;
  }
  if (typeof name === "string") {
    if (!name.trim()) {
      return NextResponse.json({ error: "Name can't be empty" }, { status: 400 });
    }
    entry.name = name.trim();
  }
  if (typeof location === "string") entry.location = location.trim();
  if (typeof speciality === "string") entry.speciality = speciality.trim();
  if (Array.isArray(tags)) {
    entry.tags = tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 8);
  }

  await writeGraph(graph, `Edit ${entry.name}`);

  return NextResponse.json(entry);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const graph = await readGraph();
  const entry = graph.entries.find((e) => e.id === id);
  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  graph.entries = graph.entries.filter((e) => e.id !== id);
  graph.relations = graph.relations.filter((r) => r.from !== id && r.to !== id);
  graph.plans = graph.plans.filter((p) => p.entryId !== id);

  await writeGraph(graph, `Remove ${entry.name}`);

  return NextResponse.json({ ok: true });
}
