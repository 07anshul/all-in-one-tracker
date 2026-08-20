import type { EntryType } from "@/lib/types";
import { TypeIcon } from "./TypeIcon";

const STYLES: Record<EntryType, string> = {
  restaurant: "border-rust text-rust",
  place: "border-olive text-olive",
  activity: "border-ochre text-ochre",
};

export function TypeBadge({ type }: { type: EntryType }) {
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1 font-label text-[10px] uppercase tracking-widest border rounded-full px-2 py-0.5 ${STYLES[type]}`}
    >
      <TypeIcon type={type} className="h-2.5 w-2.5" />
      {type}
    </span>
  );
}
