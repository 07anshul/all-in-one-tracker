"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authedFetch } from "@/lib/client-key";
import { monthGrid, monthLabel } from "@/lib/calendar";
import { TypeBadge } from "./TypeBadge";
import type { EntryType, PlanStatus } from "@/lib/types";

export interface PlanWithEntry {
  id: string;
  entryId: string;
  entryName: string;
  entryType: EntryType;
  date: string;
  note: string;
  status: PlanStatus;
}

const STATUS_STYLES: Record<PlanStatus, string> = {
  planned: "border-ochre text-ochre",
  visited: "border-olive text-olive",
  skipped: "border-line text-ink-soft",
};

const STATUS_DOT: Record<PlanStatus, string> = {
  planned: "var(--ochre)",
  visited: "var(--olive)",
  skipped: "var(--ink-soft)",
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function PlanBoard({ plans, today }: { plans: PlanWithEntry[]; today: string }) {
  const router = useRouter();
  const [y, m] = today.split("-").map(Number);
  const [viewYear, setViewYear] = useState(y);
  const [viewMonth, setViewMonth] = useState(m - 1);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, PlanWithEntry[]>();
    for (const p of plans) {
      const list = map.get(p.date) ?? [];
      list.push(p);
      map.set(p.date, list);
    }
    return map;
  }, [plans]);

  const cells = monthGrid(viewYear, viewMonth);

  const visiblePlans = useMemo(() => {
    if (selectedDay) return plans.filter((p) => p.date === selectedDay);
    return plans;
  }, [plans, selectedDay]);

  const upcoming = visiblePlans
    .filter((p) => p.status === "planned" && p.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = visiblePlans
    .filter((p) => p.status !== "planned" || p.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));

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

  function shiftMonth(delta: number) {
    let nm = viewMonth + delta;
    let ny = viewYear;
    if (nm < 0) {
      nm = 11;
      ny--;
    } else if (nm > 11) {
      nm = 0;
      ny++;
    }
    setViewMonth(nm);
    setViewYear(ny);
  }

  return (
    <div>
      <div className="paper-card rounded-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => shiftMonth(-1)}
            className="font-label text-ink-soft hover:text-rust transition-colors cursor-pointer px-2"
            aria-label="Previous month"
          >
            ←
          </button>
          <h2 className="font-display text-lg italic">{monthLabel(viewYear, viewMonth)}</h2>
          <button
            onClick={() => shiftMonth(1)}
            className="font-label text-ink-soft hover:text-rust transition-colors cursor-pointer px-2"
            aria-label="Next month"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w, i) => (
            <div
              key={i}
              className="font-label text-[10px] text-ink-soft text-center uppercase"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((iso, i) => {
            if (!iso) return <div key={i} />;
            const dayPlans = byDate.get(iso) ?? [];
            const isToday = iso === today;
            const isSelected = iso === selectedDay;
            return (
              <button
                key={iso}
                onClick={() => setSelectedDay(isSelected ? null : iso)}
                className={`aspect-square rounded-sm border text-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                  isSelected
                    ? "border-rust"
                    : isToday
                    ? "border-ink-soft"
                    : "border-line hover:border-rust/40"
                }`}
                style={isSelected ? { backgroundColor: "var(--rust-soft)" } : undefined}
              >
                <span className={isToday ? "font-bold" : ""}>{Number(iso.slice(-2))}</span>
                {dayPlans.length > 0 && (
                  <span className="flex gap-0.5">
                    {dayPlans.slice(0, 3).map((p) => (
                      <span
                        key={p.id}
                        className="h-1 w-1 rounded-full inline-block"
                        style={{ backgroundColor: STATUS_DOT[p.status] }}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {selectedDay && (
          <button
            onClick={() => setSelectedDay(null)}
            className="mt-3 font-label text-[11px] uppercase tracking-widest text-ink-soft hover:text-rust cursor-pointer"
          >
            × clear day filter
          </button>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-label text-[11px] uppercase tracking-widest text-ink-soft mb-3">
          upcoming
        </h2>
        <div className="space-y-2">
          {upcoming.length === 0 && (
            <p className="text-ink-soft italic text-sm">Nothing on the books.</p>
          )}
          {upcoming.map((plan) => (
            <PlanRow
              key={plan.id}
              plan={plan}
              busy={busyId === plan.id}
              onSetStatus={setStatus}
              onRemove={remove}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-label text-[11px] uppercase tracking-widest text-ink-soft mb-3">
          past
        </h2>
        <div className="space-y-2">
          {past.length === 0 && (
            <p className="text-ink-soft italic text-sm">Nothing here yet.</p>
          )}
          {past.map((plan) => (
            <PlanRow
              key={plan.id}
              plan={plan}
              busy={busyId === plan.id}
              onSetStatus={setStatus}
              onRemove={remove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanRow({
  plan,
  busy,
  onSetStatus,
  onRemove,
}: {
  plan: PlanWithEntry;
  busy: boolean;
  onSetStatus: (id: string, status: PlanStatus) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="paper-card rounded-sm p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-label text-[10px] uppercase tracking-widest border rounded-sm px-1.5 py-0.5 ${STATUS_STYLES[plan.status]}`}
          >
            {plan.status}
          </span>
          <span className="font-label text-[11px] text-ink-soft">{plan.date}</span>
          <Link
            href={`/entry/${plan.entryId}`}
            className="font-display italic hover:text-rust transition-colors"
          >
            {plan.entryName}
          </Link>
          <TypeBadge type={plan.entryType} />
        </div>
        {plan.note && <p className="text-sm mt-1">{plan.note}</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        {plan.status !== "visited" && (
          <button
            onClick={() => onSetStatus(plan.id, "visited")}
            disabled={busy}
            className="font-label text-[10px] uppercase tracking-widest text-olive hover:underline cursor-pointer disabled:opacity-50"
          >
            visited
          </button>
        )}
        {plan.status !== "skipped" && (
          <button
            onClick={() => onSetStatus(plan.id, "skipped")}
            disabled={busy}
            className="font-label text-[10px] uppercase tracking-widest text-ink-soft hover:underline cursor-pointer disabled:opacity-50"
          >
            skipped
          </button>
        )}
        {plan.status !== "planned" && (
          <button
            onClick={() => onSetStatus(plan.id, "planned")}
            disabled={busy}
            className="font-label text-[10px] uppercase tracking-widest text-ochre hover:underline cursor-pointer disabled:opacity-50"
          >
            reopen
          </button>
        )}
        <button
          onClick={() => onRemove(plan.id)}
          disabled={busy}
          className="font-label text-[10px] uppercase tracking-widest text-rust hover:underline cursor-pointer disabled:opacity-50"
        >
          delete
        </button>
      </div>
    </div>
  );
}
