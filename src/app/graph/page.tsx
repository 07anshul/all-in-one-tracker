import { readGraph } from "@/lib/data";
import { GraphView } from "@/components/GraphView";

export const dynamic = "force-dynamic";

export default async function GraphPage() {
  const graph = await readGraph();

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Graph</h1>
      <GraphView entries={graph.entries} relations={graph.relations} />
    </div>
  );
}
