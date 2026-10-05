"use client";

import { Fragment, useState, type ReactNode } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { filterChip } from "@/lib/filter-style";

/** What the filter matches on. The card itself arrives as server-rendered HTML in `cards`. */
export interface FilterEntry {
  key: string;
  name: string;
  sourceName?: string;
  status: string;
  group: string;
  /** Has React code in src/ui. */
  code: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export default function ComponentOverviewFilter({
  entries,
  cards,
  filters,
  groups,
  codeCount,
}: {
  entries: FilterEntry[];
  cards: Record<string, ReactNode>;
  filters: FilterOption[];
  groups: { name: string; description: string }[];
  codeCount: number;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [reactOnly, setReactOnly] = useState(false);

  const q = query.trim().toLowerCase();
  const visible = entries.filter(
    (e) => (status === "all" || e.status === status) && (!reactOnly || e.code) && (!q || `${e.name} ${e.sourceName ?? ""}`.toLowerCase().includes(q)),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search components</span>
          <MagnifyingGlass size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components"
            className="min-h-11 w-full rounded-md border border-gray-500 bg-surface py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-700 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          />
        </label>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button key={f.value} type="button" aria-pressed={status === f.value} onClick={() => setStatus(f.value)} className={filterChip(status === f.value)}>
                {f.label} <span className="tabular-nums">{f.count}</span>
              </button>
            ))}
          </div>
          <div role="group" aria-label="Filter by code" className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={reactOnly} onClick={() => setReactOnly((v) => !v)} className={filterChip(reactOnly)}>
              In React <span className="tabular-nums">{codeCount}</span>
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-gray-700">
        Status is where the Figma design stands. In React means the component also has code in <code className="font-mono-code text-[13px]">src/ui</code>.
        The two are independent.
      </p>

      <div role="status" className="sr-only">
        {visible.length} components shown
      </div>

      {visible.length === 0 && (
        <div className="mt-16 text-center">
          <div className="text-base font-semibold text-gray-900">No components found</div>
          <p className="mt-1 text-sm text-gray-700">Try a different name or clear a filter.</p>
        </div>
      )}

      {groups.map((g) => {
        const items = visible.filter((e) => e.group === g.name);
        if (items.length === 0) return null;
        const id = `group-${g.name.replace(/\s+/g, "-")}`;
        return (
          <section key={g.name} aria-labelledby={id} className="mt-12">
            <h2 id={id} className="flex scroll-mt-24 items-baseline gap-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {g.name}
              <span className="text-base font-medium text-gray-700">{items.length}</span>
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-700">{g.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((entry) => (
                <Fragment key={entry.key}>{cards[entry.key]}</Fragment>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
