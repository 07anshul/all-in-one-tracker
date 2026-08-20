import type { EntryType } from "@/lib/types";

export function TypeIcon({ type, className }: { type: EntryType; className?: string }) {
  if (type === "restaurant") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path
          d="M3.5 2v4.5a1 1 0 0 0 1 1v0M5.5 2v4.5a1 1 0 0 1-1 1v0M7.5 2v4.5a1 1 0 0 1-1 1h-3M4.5 7.5V14M11.5 2c-1 0-1.5 1-1.5 2.5S10.5 7 11.5 7s1.5-1 1.5-2.5S12.5 2 11.5 2Zm0 5v7"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "place") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path
          d="M8 2c4.5 1.5 4.5 7 0 12-4.5-5-4.5-10.5 0-12Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M8 4.5V12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 1.5 9.4 6 14 8l-4.6 2L8 14.5 6.6 10 2 8l4.6-2Z" />
    </svg>
  );
}
