"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("theme", next);
    setIsDark(next === "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="font-label text-[11px] uppercase tracking-widest text-ink-soft hover:text-rust transition-colors cursor-pointer"
    >
      {isDark ? "light" : "dark"}
    </button>
  );
}
