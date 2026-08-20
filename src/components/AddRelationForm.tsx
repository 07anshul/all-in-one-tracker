"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authedFetch } from "@/lib/client-key";
import { RELATION_KINDS, RELATION_LABELS, type RelationKind } from "@/lib/types";

export function AddRelationForm({
  entryId,
  otherEntries,
}: {
  entryId: string;
  otherEntries: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState(otherEntries[0]?.id ?? "");
  const [kind, setKind] = useState<RelationKind>("near");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (otherEntries.length === 0) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await authedFetch("/api/relations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: entryId, to, kind, note }),
    });
    setSubmitting(false);
    if (res.ok) {
      setNote("");
      setOpen(false);
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="font-label text-[11px] uppercase tracking-widest text-olive border border-olive rounded-full px-3 py-1.5 hover:bg-[var(--olive-soft)] hover:scale-105 transition-all cursor-pointer"
      >
        + connect to another entry
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="paper-card rounded-2xl p-4 space-y-3 pop-in">
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as RelationKind)}
          className="bg-transparent border border-line rounded-xl p-2 text-sm outline-none focus:border-olive"
        >
          {RELATION_KINDS.map((k) => (
            <option key={k} value={k}>
              {RELATION_LABELS[k]}
            </option>
          ))}
        </select>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex-1 bg-transparent border border-line rounded-xl p-2 text-sm outline-none focus:border-olive"
        >
          {otherEntries.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="why? (optional)"
        className="w-full bg-transparent border border-line rounded-xl p-2.5 text-sm outline-none focus:border-olive"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="font-label text-[11px] uppercase tracking-widest text-paper-card bg-olive rounded-full px-3 py-1.5 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
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
