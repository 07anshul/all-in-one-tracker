import { NextRequest, NextResponse } from "next/server";
import { readGraph, writeGraph } from "@/lib/data";
import { isAuthorized } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";
import { ENTRY_TYPES, type Entry, type EntryType, type Review } from "@/lib/types";

export async function GET() {
  const graph = await readGraph();
  return NextResponse.json(graph);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, name, location, speciality, tags, initialReview } = body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!ENTRY_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid entry type" }, { status: 400 });
  }

  const graph = await readGraph();
  const existingIds = new Set(graph.entries.map((e) => e.id));
  const id = uniqueSlug(name, existingIds);

  const reviews: Review[] = [];
  if (initialReview && typeof initialReview.rating === "number") {
    reviews.push({
      id: `${id}-r1`,
      rating: clampRating(initialReview.rating),
      note: typeof initialReview.note === "string" ? initialReview.note.trim() : "",
      date: new Date().toISOString().slice(0, 10),
    });
  }

  const entry: Entry = {
    id,
    type: type as EntryType,
    name: name.trim(),
    location: typeof location === "string" ? location.trim() : "",
    speciality: typeof speciality === "string" ? speciality.trim() : "",
    tags: Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 8)
      : [],
    reviews,
    createdAt: new Date().toISOString(),
  };

  graph.entries.push(entry);
  await writeGraph(graph, `Add ${entry.name}`);

  return NextResponse.json(entry, { status: 201 });
}

function clampRating(value: number): number {
  return Math.min(5, Math.max(0.5, Math.round(value * 2) / 2));
}
