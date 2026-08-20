"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authedFetch } from "@/lib/client-key";
import { ENTRY_TYPES, type Entry, type EntryType } from "@/lib/types";

export function EditEntryForm({ entry, onDone }: { entry: Entry; onDone: () => void }) {
  const router = useRouter();
  const [type, setType] = useState<EntryType>(entry.type);
  const [name, setName] = useState(entry.name);
  const [location, setLocation] = useState(entry.location);
  const [speciality, setSpeciality] = useState(entry.speciality);
  const [tags, setTags] = useState(entry.tags.join(", "));
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Give it a name.");
      return;
    }
    setSubmitting(true);
    const res = await authedFetch(`/api/entries/${entry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        name,
        location,
        speciality,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }
    router.refresh();
    onDone();
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${entry.name}"? This also removes its connections and plans.`)) {
      return;
    }
    setDeleting(true);
    const res = await authedFetch(`/api/entries/${entry.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
    } else {
      setDeleting(false);
      setError("Couldn't delete this entry.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="paper-card rounded-2xl p-5 space-y-4 pop-in">
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

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-transparent border-b border-line focus:border-rust outline-none py-1.5 font-display text-xl"
      />
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="location"
        className="w-full bg-transparent border border-line rounded-xl p-2.5 text-sm outline-none focus:border-rust"
      />
      <textarea
        value={speciality}
        onChange={(e) => setSpeciality(e.target.value)}
        placeholder="the move — what's actually good here"
        rows={2}
        className="w-full bg-transparent border border-line rounded-xl p-2.5 text-sm outline-none focus:border-rust"
      />
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="tags, comma separated"
        className="w-full bg-transparent border border-line rounded-xl p-2.5 text-sm outline-none focus:border-rust"
      />

      {error && <p className="text-rust text-sm">{error}</p>}

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="font-label text-[11px] uppercase tracking-widest text-paper-card bg-rust rounded-full px-4 py-1.5 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
          >
            {submitting ? "saving…" : "save"}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="font-label text-[11px] uppercase tracking-widest text-ink-soft px-3 py-1.5 cursor-pointer"
          >
            cancel
          </button>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="font-label text-[10px] uppercase tracking-widest text-rust hover:underline cursor-pointer disabled:opacity-50"
        >
          {deleting ? "deleting…" : "delete entry"}
        </button>
      </div>
    </form>
  );
}
