import type { Metadata } from "next";
import { Fraunces, Karla, Space_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Fieldnotes",
  description: "A running log of restaurants, places, and things worth doing again.",
};

const NAV_LINKS = [
  { href: "/", label: "index" },
  { href: "/graph", label: "graph" },
  { href: "/plan", label: "plan" },
  { href: "/stats", label: "ledger" },
  { href: "/itinerary", label: "itinerary" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${karla.variable} ${spaceMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body text-ink">
        <script
          // Runs before paint to avoid a flash of the wrong theme on load.
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;}catch(e){}`,
          }}
        />
        <header className="border-b border-line">
          <div className="mx-auto max-w-4xl px-5 py-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
            <Link href="/" className="group shrink-0">
              <span className="font-display italic text-2xl tracking-tight">
                Fieldnotes
              </span>
            </Link>
            <nav className="flex items-center gap-x-4 gap-y-2 flex-wrap font-label text-[11px] uppercase tracking-widest text-ink-soft">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-rust transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/add" className="text-rust hover:underline">
                + add
              </Link>
              <span className="text-line">|</span>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-5 py-8">{children}</div>
        </main>
        <footer className="border-t border-line">
          <div className="mx-auto max-w-4xl px-5 py-6 font-label text-[10px] uppercase tracking-widest text-ink-soft">
            kept in a git repo, not a database
          </div>
        </footer>
      </body>
    </html>
  );
}
