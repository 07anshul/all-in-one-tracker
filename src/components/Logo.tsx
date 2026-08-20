export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2C7.6 2 4 5.4 4 9.6 4 15.5 12 22 12 22s8-6.5 8-12.4C20 5.4 16.4 2 12 2Z"
        fill="var(--rust)"
      />
      <circle cx="12" cy="9.6" r="3.1" fill="var(--paper-card)" />
    </svg>
  );
}
