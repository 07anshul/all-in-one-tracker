export function RatingDots({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="font-label text-[11px] text-ink-soft">not yet rated</span>
    );
  }

  const dots = Array.from({ length: 5 }, (_, i) => {
    const filled = value - i;
    let style: React.CSSProperties = {};
    if (filled >= 1) {
      style = { backgroundColor: "var(--rust)" };
    } else if (filled >= 0.5) {
      style = {
        backgroundImage: "linear-gradient(90deg, var(--rust) 50%, transparent 50%)",
      };
    }
    return (
      <span
        key={i}
        className="h-2 w-2 rounded-full border border-rust inline-block"
        style={style}
      />
    );
  });

  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex gap-1">{dots}</span>
      <span className="font-label text-[11px] text-ink-soft">{value.toFixed(1)}</span>
    </span>
  );
}
