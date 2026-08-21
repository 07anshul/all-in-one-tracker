"use client";

import { useEffect, useRef, useState } from "react";
import { registerPassphraseModal } from "@/lib/passphrase-modal";

export function PassphraseModal() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const resolverRef = useRef<((value: string | null) => void) | null>(null);

  useEffect(() => {
    registerPassphraseModal((resolve) => {
      resolverRef.current = resolve;
      setValue("");
      setOpen(true);
    });
  }, []);

  function close(result: string | null) {
    setOpen(false);
    resolverRef.current?.(result);
    resolverRef.current = null;
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm p-4"
      onClick={() => close(null)}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          close(value);
        }}
        className="paper-card rounded-3xl p-6 w-full max-w-sm space-y-4 pop-in text-center"
      >
        <div className="space-y-1">
          <div className="text-4xl">🔒</div>
          <h2 className="font-display text-xl">psst — what&apos;s the word?</h2>
          <p className="text-sm text-ink-soft">
            this bit&apos;s locked. enter the passphrase to save changes.
          </p>
        </div>

        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="passphrase"
          className="w-full bg-transparent border border-line rounded-2xl p-2.5 text-sm outline-none focus:border-rust text-center"
        />

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => close(null)}
            className="font-label text-[11px] uppercase tracking-widest text-ink-soft px-4 py-2 cursor-pointer"
          >
            cancel
          </button>
          <button
            type="submit"
            className="font-label text-[11px] uppercase tracking-widest text-paper-card bg-rust rounded-full px-4 py-2 hover:scale-105 transition-transform cursor-pointer"
          >
            unlock
          </button>
        </div>
      </form>
    </div>
  );
}
