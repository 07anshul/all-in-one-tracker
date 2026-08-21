import { NextRequest, NextResponse } from "next/server";
import { readGraph, writeGraph } from "@/lib/data";
import { isAuthorized } from "@/lib/auth";
import { apiError } from "@/lib/api";
import type { Review } from "@/lib/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { rating, note } = body ?? {};

  if (typeof rating !== "number" || Number.isNaN(rating)) {
    return NextResponse.json({ error: "Rating is required" }, { status: 400 });
  }

  try {
    const graph = await readGraph();
    const entry = graph.entries.find((e) => e.id === id);
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const review: Review = {
      id: `${id}-r${entry.reviews.length + 1}`,
      rating: Math.min(5, Math.max(0.5, Math.round(rating * 2) / 2)),
      note: typeof note === "string" ? note.trim() : "",
      date: new Date().toISOString().slice(0, 10),
    };

    entry.reviews.push(review);
    await writeGraph(graph, `Review ${entry.name}`);

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    return apiError(err);
  }
}
