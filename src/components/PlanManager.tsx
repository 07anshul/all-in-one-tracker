"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authedFetch } from "@/lib/client-key";
import type { Plan, PlanStatus } from "@/lib/types";

const STATUS_STYLES: Record<PlanStatus, string> = {
  planned: "border-ochre text-ochre",
  visited: "border-olive text-olive",
  skipped: "border-line text-ink-soft",
};

export function PlanManager({ entryId, plans }: { entryId: string; plans: Plan[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setSubmitting(true);
    const res = await authedFetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId, date, note }),
    });
    setSubmitting(false);
    if (res.ok) {
      setDate("");
      setNote("");
      setOpen(false);
      router.refresh();
    }
  }

  async function setStatus(planId: string, status: PlanStatus) {
    setBusyId(planId);
    await authedFetch(`/api/plans/${planId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(planId: string) {
    setBusyId(planId);
    await authedFetch(`/api/plans/${planId}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-2">
      {plans.length === 0 && (
        <p className="text-ink-soft italic text-sm">Nothing planned yet.</p>
      )}
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="paper-card rounded-sm p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
        >
          <div className="flex-1 min-w-0">
            <span
              className={`font-label text-[10px] uppercase tracking-widest border rounded-sm px-1.5 py-0.5 ${STATUS_STYLES[plan.status]}`}
            >
              {plan.status}
            </span>
            <span className="font-label text-[11px] text-ink-soft ml-2">{plan.date}</span>
            {plan.note && <p className="text-sm mt-1">{plan.note}</p>}
          </div>
          <div className="flex gap-2 shrink-0">
            {plan.status !== "visited" && (
              <button
                onClick={() => setStatus(plan.id, "visited")}
                disabled={busyId === plan.id}
                className="font-label text-[10px] uppercase tracking-widest text-olive hover:underline cursor-pointer disabled:opacity-50"
              >
                mark visited
              </button>
            )}
            {plan.status !== "skipped" && (
              <button
                onClick={() => setStatus(plan.id, "skipped")}
                disabled={busyId === plan.id}
                className="font-label text-[10px] uppercase tracking-widest text-ink-soft hover:underline cursor-pointer disabled:opacity-50"
              >
                mark skipped
              </button>
            )}
            {plan.status !== "planned" && (
              <button
                onClick={() => setStatus(plan.id, "planned")}
                disabled={busyId === plan.id}
                className="font-label text-[10px] uppercase tracking-widest text-ochre hover:underline cursor-pointer disabled:opacity-50"
              >
                reopen
              </button>
            )}
            <button
              onClick={() => remove(plan.id)}
              disabled={busyId === plan.id}
              className="font-label text-[10px] uppercase tracking-widest text-rust hover:underline cursor-pointer disabled:opacity-50"
            >
              delete
            </button>
          </div>
        </div>
      ))}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="font-label text-[11px] uppercase tracking-widest text-ochre border border-ochre rounded-sm px-3 py-1.5 hover:bg-[var(--ochre-soft)] transition-colors cursor-pointer"
        >
          + plan a visit
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="paper-card rounded-sm p-4 space-y-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="bg-transparent border border-line rounded-sm p-2 text-sm outline-none focus:border-ochre"
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="why? (optional)"
            className="w-full bg-transparent border border-line rounded-sm p-2.5 text-sm outline-none focus:border-ochre"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="font-label text-[11px] uppercase tracking-widest text-paper-card bg-ochre rounded-sm px-3 py-1.5 disabled:opacity-50 cursor-pointer"
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
      )}
    </div>
  );
}
