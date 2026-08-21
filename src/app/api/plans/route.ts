import { NextRequest, NextResponse } from "next/server";
import { readGraph, writeGraph } from "@/lib/data";
import { isAuthorized } from "@/lib/auth";
import { apiError } from "@/lib/api";
import type { Plan } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { entryId, date, note } = body ?? {};

  if (typeof entryId !== "string" || !entryId) {
    return NextResponse.json({ error: "entryId is required" }, { status: 400 });
  }

  try {
    const graph = await readGraph();
    const entry = graph.entries.find((e) => e.id === entryId);
    if (!entry) {
      return NextResponse.json({ error: "Unknown entry id" }, { status: 400 });
    }

    const plan: Plan = {
      id: `plan-${Date.now().toString(36)}`,
      entryId,
      date: typeof date === "string" ? date : "",
      note: typeof note === "string" ? note.trim() : "",
      status: "planned",
    };

    graph.plans.push(plan);
    await writeGraph(graph, plan.date
      ? `Plan a visit to ${entry.name} on ${plan.date}`
      : `Add ${entry.name} to the someday list`
    );

    return NextResponse.json(plan, { status: 201 });
  } catch (err) {
    return apiError(err);
  }
}
