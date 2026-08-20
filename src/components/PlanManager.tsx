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

  async function setPlanDate(planId: string, newDate: string) {
    setBusyId(planId);
    await authedFetch(`/api/plans/${planId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate }),
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
          className="paper-card rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
        >
          <div className="flex-1 min-w-0">
            <span
              className={`font-label text-[10px] uppercase tracking-widest border rounded-full px-2 py-0.5 ${STATUS_STYLES[plan.status]}`}
            >
              {plan.status}
            </span>
            {plan.date ? (
              <span className="font-label text-[11px] text-ink-soft ml-2">{plan.date}</span>
            ) : (
              <span className="font-label text-[11px] text-ink-soft ml-2">someday</span>
            )}
            {plan.note && <p className="text-sm mt-1">{plan.note}</p>}
            {!plan.date && plan.status === "planned" && (
              <label className="mt-2 inline-flex items-center gap-1.5 font-label text-[10px] uppercase tracking-widest text-ink-soft">
                pick a date
                <input
                  type="date"
                  onChange={(e) => e.target.value && setPlanDate(plan.id, e.target.value)}
                  disabled={busyId === plan.id}
                  className="bg-transparent border border-line rounded-full px-2 py-0.5 text-ink outline-none focus:border-ochre"
                />
              </label>
            )}
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
          className="font-label text-[11px] uppercase tracking-widest text-ochre border border-ochre rounded-full px-3 py-1.5 hover:bg-[var(--ochre-soft)] hover:scale-105 transition-all cursor-pointer"
        >
          + plan a visit
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="paper-card rounded-2xl p-4 space-y-3 pop-in">
          <label className="flex items-center gap-2 font-label text-[11px] uppercase tracking-widest text-ink-soft">
            date (optional)
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border border-line rounded-full px-2.5 py-1 text-sm text-ink outline-none focus:border-ochre"
            />
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="why? (optional)"
            className="w-full bg-transparent border border-line rounded-xl p-2.5 text-sm outline-none focus:border-ochre"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="font-label text-[11px] uppercase tracking-widest text-paper-card bg-ochre rounded-full px-3 py-1.5 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
            >
              {submitting ? "saving…" : date ? "save" : "add to someday"}
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
