import type { Graph, Plan } from "./types";

export function plansFor(graph: Graph, entryId: string): Plan[] {
  return graph.plans
    .filter((p) => p.entryId === entryId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function upcomingPlans(graph: Graph, today: string): Plan[] {
  return graph.plans
    .filter((p) => p.status === "planned" && p.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function pastPlans(graph: Graph, today: string): Plan[] {
  return graph.plans
    .filter((p) => p.status !== "planned" || p.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function isVisited(graph: Graph, entryId: string): boolean {
  return graph.plans.some((p) => p.entryId === entryId && p.status === "visited");
}
