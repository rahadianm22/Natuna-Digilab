"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { statusLabel, statusStyle, type TrackerStatus } from "@/lib/natuna-tracker";

export type Group = "ready" | "progress" | "planned";
export type Item = { name: string; slug?: string; group: Group };

// The same badge colors and labels as /components, read from the tracker so the two pages cannot drift.
const statusOf: Record<Group, TrackerStatus> = { ready: "Selesai", progress: "OnProgress", planned: "Belum" };

const filters: { key: Group | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ready", label: statusLabel.Selesai },
  { key: "progress", label: statusLabel.OnProgress },
  { key: "planned", label: statusLabel.Belum },
];

/**
 * Filter tabs over every tracked component. Status is a text badge, never color alone. Tabs follow the
 * ARIA tabs pattern: arrow keys, Home and End move, one tab stop.
 */
export default function StatusBoard({ items }: { items: Item[] }) {
  const id = useId();
  const [filter, setFilter] = useState<Group | "all">("all");
  // Phones show the first few rows of a long list; the rest are one tap away. Wider screens show everything.
  const [expanded, setExpanded] = useState(false);
  const PHONE_ROWS = 12;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = items.filter((i) => filter === "all" || i.group === filter);
  const count = (k: Group | "all") => (k === "all" ? items.length : items.filter((i) => i.group === k).length);

  function onKey(e: KeyboardEvent, index: number) {
    const last = filters.length - 1;
    const next =
      e.key === "ArrowRight" ? (index + 1) % filters.length
      : e.key === "ArrowLeft" ? (index + last) % filters.length
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setFilter(filters[next].key);
    refs.current[next]?.focus();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Two even rows of two on phones, so no tab is left alone on a second row. */}
      <div role="tablist" aria-label="Filter by status" className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {filters.map((f, i) => {
          const on = filter === f.key;
          return (
            <button
              key={f.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${id}-${f.key}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${id}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setFilter(f.key)}
              onKeyDown={(e) => onKey(e, i)}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors ${
                on ? "border-inverse bg-inverse text-inverse-text dark:border-inverse-text dark:bg-inverse-text dark:text-inverse" : "border-gray-300 bg-surface text-gray-900 hover:border-gray-500"
              }`}
            >
              {f.label}
              <span className={`font-label text-xs tabular-nums ${on ? "" : "text-gray-700"}`}>{count(f.key)}</span>
            </button>
          );
        })}
      </div>

      {/* The tabpanel role sits on a wrapper so the list keeps its list semantics. */}
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${filter}`}>
      <ul
        className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:gap-2.5"
      >
        {shown.map((item, i) => {
          const status = statusOf[item.group];
          const body = (
            <>
              <span className="min-w-0 text-base font-medium leading-tight text-gray-900 sm:flex-1">{item.name}</span>
              <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${statusStyle[status]}`}>{statusLabel[status]}</span>
            </>
          );
          // Phones stack the badge under the name; wider tiles put it at the end of the row.
          const cls =
            "flex min-h-12 flex-col items-start gap-1.5 rounded-xl border border-gray-200 bg-surface px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-3.5";
          return (
            <li key={item.name} className={!expanded && i >= PHONE_ROWS ? "hidden sm:block" : undefined}>
              {item.slug ? (
                <Link href={`/components/${item.slug}`} className={`${cls} transition-colors hover:border-gray-500`}>
                  {body}
                </Link>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      {shown.length > PHONE_ROWS && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-md border border-gray-300 bg-surface text-sm font-semibold text-gray-900 hover:border-gray-500 sm:hidden"
        >
          {expanded ? "Show fewer" : `Show all ${shown.length}`}
        </button>
      )}
      </div>
    </div>
  );
}
