import { Suspense } from "react";
import { readGraph } from "@/lib/data";
import { ItineraryBuilder } from "@/components/ItineraryBuilder";

export const dynamic = "force-dynamic";

export default async function ItineraryPage() {
  const graph = await readGraph();

  return (
    <div>
      <h1 className="font-display text-3xl mb-2">Itinerary</h1>
      <p className="text-ink-soft text-sm mb-6">
        String a few stops into a day plan, then share the link or open the route in Maps.
      </p>
      <Suspense>
        <ItineraryBuilder entries={graph.entries} relations={graph.relations} />
      </Suspense>
    </div>
  );
}
