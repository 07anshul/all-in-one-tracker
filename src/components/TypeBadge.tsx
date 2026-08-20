import type { EntryType } from "@/lib/types";

const STYLES: Record<EntryType, string> = {
  restaurant: "border-rust text-rust",
  place: "border-olive text-olive",
  activity: "border-ochre text-ochre",
};

export function TypeBadge({ type }: { type: EntryType }) {
  return (
    <span
      className={`shrink-0 font-label text-[10px] uppercase tracking-widest border rounded-sm px-1.5 py-0.5 ${STYLES[type]}`}
    >
      {type}
    </span>
  );
}
