"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authedFetch } from "@/lib/client-key";
import { ENTRY_TYPES, type EntryType } from "@/lib/types";

export default function AddEntryPage() {
  const router = useRouter();
  const [type, setType] = useState<EntryType>("restaurant");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [tags, setTags] = useState("");
  const [rating, setRating] = useState(4);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Give it a name first.");
      return;
    }
    setSubmitting(true);
    const res = await authedFetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        name,
        location,
        speciality,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        initialReview: note.trim() ? { rating, note } : undefined,
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      return;
    }
    await res.json();
    router.push("/");
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">New entry</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-1.5">
          {ENTRY_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`font-label text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all hover:scale-105 cursor-pointer ${
                type === t ? "border-rust text-rust" : "border-line text-ink-soft"
              }`}
              style={type === t ? { backgroundColor: "var(--rust-soft)" } : undefined}
            >
              {t}
            </button>
          ))}
        </div>

        <Field label="name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Otto's Noodle Bar"
            className="w-full bg-transparent border-b border-line focus:border-rust outline-none py-1.5 font-display text-xl"
            autoFocus
          />
        </Field>

        <Field label="location">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Church Street"
            className="w-full bg-transparent border border-line rounded-2xl p-2.5 text-sm outline-none focus:border-rust"
          />
        </Field>

        <Field label="the move — what's actually good here">
          <textarea
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            placeholder="Hand-pulled noodles. Ask for extra numbing."
            rows={2}
            className="w-full bg-transparent border border-line rounded-2xl p-2.5 text-sm outline-none focus:border-rust"
          />
        </Field>

        <Field label="tags — comma separated">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="noodles, spicy, late-night"
            className="w-full bg-transparent border border-line rounded-2xl p-2.5 text-sm outline-none focus:border-rust"
          />
        </Field>

        <div className="paper-card rounded-3xl p-4 space-y-3">
          <p className="font-label text-[11px] uppercase tracking-widest text-ink-soft">
            first note (optional)
          </p>
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
            rows={2}
            className="w-full bg-transparent border border-line rounded-2xl p-2.5 text-sm outline-none focus:border-rust"
          />
        </div>

        {error && <p className="text-rust text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="font-label text-[11px] uppercase tracking-widest text-paper-card bg-rust rounded-full px-4 py-2 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
        >
          {submitting ? "saving…" : "save entry"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-label text-[11px] uppercase tracking-widest text-ink-soft block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
