"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authedFetch } from "@/lib/client-key";

export function AddReviewForm({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(4);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await authedFetch(`/api/entries/${entryId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, note }),
    });
    setSubmitting(false);
    if (res.ok) {
      setNote("");
      setRating(4);
      setOpen(false);
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="font-label text-[11px] uppercase tracking-widest text-rust border border-rust rounded-full px-3 py-1.5 hover:bg-[var(--rust-soft)] hover:scale-105 transition-all cursor-pointer"
      >
        + add a note
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="paper-card rounded-2xl p-4 space-y-3 pop-in">
      <div className="flex items-center gap-3">
        <span className="font-label text-[11px] uppercase tracking-widest text-ink-soft">
          rating
        </span>
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ accentColor: "var(--rust)" }}
          className="flex-1"
        />
        <span className="font-label text-sm w-8">{rating.toFixed(1)}</span>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="what did you think?"
        rows={3}
        className="w-full bg-transparent border border-line rounded-xl p-2.5 text-sm outline-none focus:border-rust"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="font-label text-[11px] uppercase tracking-widest text-paper-card bg-rust rounded-full px-3 py-1.5 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
        >
          {submitting ? "saving…" : "save"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-label text-[11px] uppercase tracking-widest text-ink-soft px-3 py-1.5 cursor-pointer"
        >
          cancel
        </button>
      </div>
    </form>
  );
}
