"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";

export type Group = "ready" | "progress" | "planned";
export type Item = { name: string; slug?: string; group: Group };

const look: Record<Group, { dot: string; label: string }> = {
  ready: { dot: "bg-inverse border-inverse dark:bg-inverse-text dark:border-inverse-text", label: "Ready" },
  progress: { dot: "bg-lime border-inverse", label: "In progress" },
  planned: { dot: "bg-transparent border-gray-500", label: "Planned" },
};

const filters: { key: Group | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ready", label: "Ready" },
  { key: "progress", label: "In progress" },
  { key: "planned", label: "Planned" },
];

/**
 * Filter tabs over every tracked component. Status is carried by the dot's fill and border and by a text
 * label, never by color alone. Tabs follow the ARIA tabs pattern: arrow keys move, one tab stop.
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
      <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-2">
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
              className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
                on ? "border-inverse bg-inverse text-inverse-text dark:border-inverse-text dark:bg-inverse-text dark:text-inverse" : "border-gray-300 bg-surface text-gray-900 hover:border-gray-500"
              }`}
            >
              {f.label}
              <span className="font-label text-xs opacity-75">{count(f.key)}</span>
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
          const l = look[item.group];
          const body = (
            <>
              <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-full border-2 ${l.dot}`} />
              <span className="min-w-0 flex-1 text-[15px] font-medium leading-tight text-gray-900">{item.name}</span>
              <span className="sr-only font-label text-[11px] text-gray-700 sm:not-sr-only">{l.label}</span>
            </>
          );
          const cls = "flex min-h-12 items-center gap-2.5 rounded-[14px] border border-gray-200 bg-surface px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5";
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
          className="mt-3 flex min-h-11 w-full items-center justify-center rounded-[14px] border border-gray-300 bg-surface text-sm font-semibold text-gray-900 hover:border-gray-500 sm:hidden"
        >
          {expanded ? "Show fewer" : `Show all ${shown.length}`}
        </button>
      )}
      </div>
    </div>
  );
}
