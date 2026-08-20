"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "index" },
  { href: "/graph", label: "graph" },
  { href: "/plan", label: "plan" },
  { href: "/stats", label: "ledger" },
  { href: "/itinerary", label: "itinerary" },
];

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="hidden sm:flex items-center gap-x-4 gap-y-2 flex-wrap font-label text-[11px] uppercase tracking-widest text-ink-soft">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-rust transition-colors">
            {link.label}
          </Link>
        ))}
        <Link href="/add" className="text-rust hover:underline">
          + add
        </Link>
        <span className="text-line">|</span>
        <ThemeToggle />
      </nav>

      <div className="sm:hidden relative">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
          className="flex items-center justify-center h-9 w-9 rounded-full border border-line text-ink-soft hover:border-rust hover:text-rust transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            {open ? (
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 6h12M4 10h12M4 14h12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute right-0 top-full mt-2 w-48 paper-card rounded-2xl p-2 z-20 pop-in shadow-lg flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-xl hover:bg-[var(--rust-soft)] font-label text-[11px] uppercase tracking-widest text-ink-soft hover:text-rust transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/add"
                className="px-3 py-2 rounded-xl hover:bg-[var(--rust-soft)] font-label text-[11px] uppercase tracking-widest text-rust"
              >
                + add
              </Link>
              <div className="border-t border-line my-1.5" />
              <div className="px-3 py-1.5">
                <ThemeToggle />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
