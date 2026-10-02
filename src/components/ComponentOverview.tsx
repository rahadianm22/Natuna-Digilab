"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, SquaresFour } from "@phosphor-icons/react";
import ComponentPreview from "./ComponentPreview";
import {
  statusLabel,
  statusOrder,
  statusStyle,
  tracker,
  trackerGroups,
  type TrackerItem,
  type TrackerStatus,
} from "@/lib/natuna-tracker";

function Thumbnail({ item }: { item: TrackerItem }) {
  return (
    <div
      aria-hidden="true"
      inert
      className="flex h-32 items-center justify-center overflow-hidden rounded-md bg-gray-50 transition-colors group-hover:bg-blue-50/60"
    >
      {item.slug ? (
        <div className="pointer-events-none w-full origin-center scale-[0.7]">
          <ComponentPreview slug={item.slug} />
        </div>
      ) : (
        <SquaresFour size={32} className="text-gray-300" />
      )}
    </div>
  );
}

function Card({ item }: { item: TrackerItem }) {
  const body = (
    <>
      <Thumbnail item={item} />
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-700">{item.name}</div>
          <div className="text-xs text-gray-600">{item.buildDay ? `Build day ${item.buildDay}` : "Done"}</div>
        </div>
        <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${statusStyle[item.status]}`}>
          {statusLabel[item.status]}
        </span>
      </div>
    </>
  );
  const base = "group block h-full rounded-xl border border-gray-200 bg-surface p-3";

  if (item.slug) {
    return (
      <Link
        href={`/components/${item.slug}`}
        className={`${base} transition-colors hover:border-blue-400`}
      >
        {body}
      </Link>
    );
  }
  if (item.figmaLink) {
    return (
      <a
        href={item.figmaLink}
        target="_blank"
        rel="noreferrer"
        className={`${base} transition-colors hover:border-blue-400`}
      >
        {body}
      </a>
    );
  }
  return <div className={`${base} opacity-80`}>{body}</div>;
}

export default function ComponentOverview() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TrackerStatus | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: tracker.length };
    for (const s of statusOrder) c[s] = tracker.filter((t) => t.status === s).length;
    return c;
  }, []);

  const q = query.trim().toLowerCase();
  const visible = tracker.filter(
    (t) => (status === "all" || t.status === status) && (!q || t.name.toLowerCase().includes(q)),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search components</span>
          <MagnifyingGlass size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components"
            className="w-full rounded-md border border-gray-300 bg-surface py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500"
          />
        </label>
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {(["all", ...statusOrder] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={`min-h-9 rounded-md border px-3 text-xs font-medium transition-colors ${
                status === s
                  ? "border-blue-600 bg-brand text-white"
                  : "border-gray-300 bg-surface text-gray-700 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "All" : statusLabel[s]} <span className="tabular-nums">{counts[s]}</span>
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
          <p className="mt-1 text-sm text-gray-600">Try a different name or clear the status filter.</p>
        </div>
      )}

      {trackerGroups.map((g) => {
        const items = visible.filter((t) => t.group === g.name);
        if (items.length === 0) return null;
        return (
          <section key={g.name} aria-labelledby={`group-${g.name}`} className="mt-12">
            <h2 id={`group-${g.name}`} className="flex items-baseline gap-2 text-2xl font-bold text-gray-900">
              {g.name}
              <span className="text-base font-medium text-gray-600">{items.length}</span>
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-600">{g.description}</p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <Card key={item.no} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
