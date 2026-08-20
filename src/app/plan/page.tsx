import { readGraph } from "@/lib/data";
import { todayIso } from "@/lib/calendar";
import { PlanBoard, type PlanWithEntry } from "@/components/PlanBoard";

export const dynamic = "force-dynamic";

export default async function PlanPage() {
  const graph = await readGraph();
  const entryById = new Map(graph.entries.map((e) => [e.id, e]));

  const plans: PlanWithEntry[] = graph.plans
    .map((p) => {
      const entry = entryById.get(p.entryId);
      if (!entry) return null;
      return {
        ...p,
        entryName: entry.name,
        entryType: entry.type,
      };
    })
    .filter((p): p is PlanWithEntry => p !== null);

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Plan</h1>
      <PlanBoard plans={plans} today={todayIso()} />
    </div>
  );
}
