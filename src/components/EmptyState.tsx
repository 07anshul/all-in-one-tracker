export function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 text-center">
      <svg viewBox="0 0 40 40" className="mx-auto h-10 w-10 text-line mb-3" fill="none">
        <rect
          x="3"
          y="3"
          width="34"
          height="34"
          rx="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M20 14v12M14 20h12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-ink-soft font-display text-lg">{message}</p>
    </div>
  );
}
