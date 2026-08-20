export function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 2c-3.03 0-5.5 2.4-5.5 5.5 0 4.13 5.5 10 5.5 10s5.5-5.87 5.5-10C15.5 4.4 13.03 2 10 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="7.6" r="1.8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
