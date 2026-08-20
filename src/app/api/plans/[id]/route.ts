import { NextRequest, NextResponse } from "next/server";
import { readGraph, writeGraph } from "@/lib/data";
import { isAuthorized } from "@/lib/auth";

const VALID_STATUSES = ["planned", "visited", "skipped"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, date, note } = body ?? {};

  const graph = await readGraph();
  const plan = graph.plans.find((p) => p.id === id);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    plan.status = status;
  }
  if (typeof date === "string" && date) plan.date = date;
  if (typeof note === "string") plan.note = note.trim();

  const entry = graph.entries.find((e) => e.id === plan.entryId);
  await writeGraph(graph, `Update plan for ${entry?.name ?? plan.entryId}`);

  return NextResponse.json(plan);
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
  const plan = graph.plans.find((p) => p.id === id);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const entry = graph.entries.find((e) => e.id === plan.entryId);
  graph.plans = graph.plans.filter((p) => p.id !== id);
  await writeGraph(graph, `Remove plan for ${entry?.name ?? plan.entryId}`);

  return NextResponse.json({ ok: true });
}
