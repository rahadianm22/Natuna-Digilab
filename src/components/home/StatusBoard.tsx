"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import CodeBadge from "@/components/CodeBadge";
import { filterChip } from "@/lib/filter-style";
import { statusLabel, statusStyle, type TrackerStatus } from "@/lib/natuna-tracker";

export type Group = "ready" | "review" | "progress" | "planned";
export type Item = {
  name: string;
  slug?: string;
  group: Group;
  /** Has React code in src/ui. Derived on the server from componentDocs. */
  code: boolean;
  /** What the component is, from the tracker group. */
  kind?: "Atom" | "Molecule";
};

// The same labels and badge colors as /components, read from the tracker so the pages cannot drift.
const statusOf: Record<Group, TrackerStatus> = { ready: "Selesai", review: "On Review", progress: "OnProgress", planned: "Belum" };
const order: Group[] = ["ready", "review", "progress", "planned"];

// In the "All" view the longest group, Planned, is cut to a few rows; its heading still shows the real count.
const PLANNED_PREVIEW = 8;
// Phones show the first rows of a long list; the rest are one tap away.
const PHONE_ROWS = 12;

/**
 * Status board for every tracked component. The top strip lists what has React code today; the tabs below filter
 * by design status. Status is a text label, never color alone. Tabs follow the ARIA tabs pattern: arrow keys,
 * Home and End move, one tab stop.
 */
export default function StatusBoard({ items }: { items: Item[] }) {
  const id = useId();
  const [filter, setFilter] = useState<Group | "all">("all");
  const [expanded, setExpanded] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const count = (k: Group | "all") => (k === "all" ? items.length : items.filter((i) => i.group === k).length);
  // A status with no rows is not offered, so no tab leads to an empty panel.
  const filters: { key: Group | "all"; label: string }[] = [
    { key: "all", label: "All" },
    ...order.filter((g) => count(g) > 0).map((g) => ({ key: g, label: statusLabel[statusOf[g]] })),
  ];
  const inReact = items.filter((i) => i.code);

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

  const showAll = filter === "all";
  const visibleGroups: { group: Group; total: number; rows: Item[]; start: number }[] = [];
  let rowCount = 0;
  for (const g of order) {
    if (!(showAll || g === filter) || count(g) === 0) continue;
    const all = items.filter((i) => i.group === g);
    const rows = showAll && g === "planned" ? all.slice(0, PLANNED_PREVIEW) : all;
    visibleGroups.push({ group: g, total: all.length, rows, start: rowCount });
    rowCount += rows.length;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-gray-300 bg-surface p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-display text-xl font-bold text-gray-900">In React today</h3>
          <span className="font-semibold tabular-nums text-gray-900">{inReact.length}</span>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-700">
          Code you can copy from <code className="font-label text-gray-900">src/ui</code>. Design status is separate: a component can ship
          code while its Figma design is still in progress.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {inReact.map((item) => (
            <li key={item.name}>
              <Link
                href={`/components/${item.slug}`}
                className="flex min-h-11 flex-col items-start justify-center gap-1 rounded-md border border-gray-300 px-3 py-2 transition-colors hover:border-gray-500"
              >
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyle[statusOf[item.group]]}`}>{statusLabel[statusOf[item.group]]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

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
                className={filterChip(on)}
              >
                {f.label}
                <span className="tabular-nums">{count(f.key)}</span>
              </button>
            );
          })}
        </div>

        {/* The tabpanel role sits on a wrapper so each list keeps its list semantics. */}
        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${filter}`}>
          <div className={showAll ? "grid gap-10 lg:grid-cols-3" : "grid"}>
            {visibleGroups.map(({ group, total, rows, start }) => (
              <section key={group} aria-labelledby={`${id}-h-${group}`} className="min-w-0">
                <h3 id={`${id}-h-${group}`} className="flex items-baseline gap-2 border-b-2 border-gray-900 pb-2 font-display text-xl font-bold text-gray-900">
                  {statusLabel[statusOf[group]]}
                  <span className="text-base font-medium tabular-nums text-gray-700">{total}</span>
                </h3>
                <ul className={showAll ? undefined : "sm:grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3"}>
                  {rows.map((item, n) => {
                    const index = start + n;
                    const body = (
                      <>
                        <span className="min-w-0 flex-1 text-base text-gray-900">{item.name}</span>
                        {item.code && <CodeBadge />}
                        {item.kind && !item.code && <span className="shrink-0 text-sm text-gray-700">{item.kind}</span>}
                      </>
                    );
                    const cls = "flex min-h-11 items-center gap-3 py-2";
                    return (
                      <li key={item.name} className={`border-b border-gray-200 ${!expanded && index >= PHONE_ROWS ? "hidden sm:block" : ""}`}>
                        {item.slug ? (
                          <Link href={`/components/${item.slug}`} className={`${cls} hover:text-blue-800 hover:underline`}>
                            {body}
                          </Link>
                        ) : (
                          <div className={cls}>{body}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {rows.length < total && (
                  <Link href="/components" className="mt-2 inline-flex min-h-11 items-center text-base font-medium text-blue-800 underline underline-offset-4 hover:text-blue-900">
                    See all {total} in Components
                  </Link>
                )}
              </section>
            ))}
          </div>
          {rowCount > PHONE_ROWS && (
            <button
              type="button"
              aria-expanded={expanded}
              ref={toggle}
              onClick={() => {
                setExpanded((v) => !v);
                // Collapsing a long list leaves the toggle far below the viewport; bring it back.
                if (expanded) requestAnimationFrame(() => toggle.current?.scrollIntoView({ block: "nearest" }));
              }}
              className="mt-3 flex min-h-11 w-full items-center justify-center rounded-md border border-gray-300 bg-surface text-sm font-semibold text-gray-900 hover:border-gray-500 sm:hidden"
            >
              {expanded ? "Show fewer" : `Show all ${rowCount}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
