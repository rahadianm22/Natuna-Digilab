"use client";

import { Fragment, useState, type ReactNode } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

/** What the filter matches on. The card itself arrives as server-rendered HTML in `cards`. */
export interface FilterEntry {
  key: string;
  name: string;
  sourceName?: string;
  status: string;
  group: string;
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
}: {
  entries: FilterEntry[];
  cards: Record<string, ReactNode>;
  filters: FilterOption[];
  groups: { name: string; description: string }[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const q = query.trim().toLowerCase();
  const visible = entries.filter(
    (e) => (status === "all" || e.status === status) && (!q || `${e.name} ${e.sourceName ?? ""}`.toLowerCase().includes(q)),
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
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={status === f.value}
              onClick={() => setStatus(f.value)}
              className={`min-h-11 rounded-md border px-3 text-xs font-medium transition-colors ${
                status === f.value ? "border-blue-600 bg-brand text-white" : "border-gray-300 bg-surface text-gray-700 hover:bg-gray-50"
              }`}
            >
              {f.label} <span className="tabular-nums">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div role="status" className="sr-only">
        {visible.length} components shown
      </div>

      {visible.length === 0 && (
        <div className="mt-16 text-center">
          <div className="text-base font-semibold text-gray-900">No components found</div>
          <p className="mt-1 text-sm text-gray-700">Try a different name or clear the status filter.</p>
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
