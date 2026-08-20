import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import Link from "next/link";
import { NavMenu } from "@/components/NavMenu";
import { Logo } from "@/components/Logo";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Plan Better",
  description: "Restaurants, places, and things worth doing again — plotted, rated, and remembered.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full`}>
      <body className="min-h-full flex flex-col font-body text-ink">
        <header className="border-b border-line">
          <div className="mx-auto max-w-4xl px-5 py-4 flex items-center justify-between gap-3">
            <Link href="/" className="group shrink-0 flex items-center gap-1.5">
              <Logo className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-display text-2xl tracking-tight">
                Plan Better
              </span>
            </Link>
            <NavMenu />
          </div>
        </header>
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-5 py-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
