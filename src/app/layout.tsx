import type { Metadata } from "next";
import { Fraunces, Karla, Space_Mono } from "next/font/google";
import Link from "next/link";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${karla.variable} ${spaceMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-body text-ink">
        <header className="border-b border-line">
          <div className="mx-auto max-w-3xl px-5 py-5 flex items-baseline justify-between">
            <Link href="/" className="group">
              <span className="font-display italic text-2xl tracking-tight">
                Fieldnotes
              </span>
            </Link>
            <nav className="flex items-center gap-5 font-label text-[11px] uppercase tracking-widest text-ink-soft">
              <Link href="/" className="hover:text-rust transition-colors">
                Index
              </Link>
              <Link
                href="/add"
                className="hover:text-rust transition-colors"
              >
                + Add
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-5 py-8">{children}</div>
        </main>
        <footer className="border-t border-line">
          <div className="mx-auto max-w-3xl px-5 py-6 font-label text-[10px] uppercase tracking-widest text-ink-soft">
            kept in a git repo, not a database
          </div>
        </footer>
      </body>
    </html>
  );
}
