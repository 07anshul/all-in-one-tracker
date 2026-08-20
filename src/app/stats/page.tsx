import { readGraph } from "@/lib/data";
import { StatsView } from "@/components/StatsView";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const graph = await readGraph();

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Ledger</h1>
      <StatsView entries={graph.entries} plans={graph.plans} />
    </div>
  );
}
