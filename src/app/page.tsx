import { readGraph } from "@/lib/data";
import { EntryBrowser } from "@/components/EntryBrowser";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const graph = await readGraph();

  return (
    <div>
      <p className="font-label text-[11px] uppercase tracking-widest text-ink-soft mb-6">
        {graph.entries.length} {graph.entries.length === 1 ? "entry" : "entries"} logged
      </p>
      <EntryBrowser entries={graph.entries} />
    </div>
  );
}
