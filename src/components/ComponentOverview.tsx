"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, SquaresFour } from "@phosphor-icons/react";
import ComponentPreview from "./ComponentPreview";
import { components, getComponent, statusText, statusTone } from "@/lib/components-data";
import {
  lastBuildDay,
  statusLabel,
  statusOrder,
  statusStyle,
  tracker,
  trackerGroups,
  type TrackerItem,
  type TrackerStatus,
} from "@/lib/natuna-tracker";

const LAST_BUILD_DAY = lastBuildDay();

/** What a catalog card needs, whether it comes from a tracker row or from a page the tracker does not list. */
interface Entry {
  key: string;
  slug?: string;
  figmaLink?: string;
  name: string;
  /** The tracker's own name, kept as a tooltip when it differs from the page name. */
  sourceName?: string;
  meta: string;
  status: TrackerStatus | "untracked";
  badgeLabel: string;
  badgeClass: string;
  group: string;
}

// The page title wins over the Notion row name ("Cards" is the Card page), so a component has one name everywhere.
const displayName = (item: TrackerItem) => (item.slug && getComponent(item.slug)?.name) || item.name;

// Ready first, then in review, in progress, planned; alphabetical inside each status.
const tracked: Entry[] = [...tracker]
  .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status) || displayName(a).localeCompare(displayName(b)))
  .map((t) => ({
    key: `t-${t.no}`,
    slug: t.slug,
    figmaLink: t.figmaLink,
    name: displayName(t),
    sourceName: t.name,
    meta: t.buildDay ? `Build day ${t.buildDay} of ${LAST_BUILD_DAY}` : "Signed off in Figma",
    status: t.status,
    badgeLabel: statusLabel[t.status],
    badgeClass: statusStyle[t.status],
    group: t.group,
  }));

// Pages the tracker does not list still belong in the index, marked for what they are.
const untracked: Entry[] = components
  .filter((c) => c.status === "untracked")
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((c) => ({
    key: `u-${c.slug}`,
    slug: c.slug,
    name: c.name,
    meta: "No sign-off, no code",
    status: "untracked",
    badgeLabel: statusText.untracked,
    badgeClass: statusTone.untracked,
    group: "Not tracked",
  }));

const all = [...tracked, ...untracked];

const groups = [
  ...trackerGroups,
  { name: "Not tracked", description: "Pages without a tracker row. They have no design sign-off and no code yet; treat them as sketches." },
];

type Filter = TrackerStatus | "untracked" | "all";

function Thumbnail({ slug }: { slug?: string }) {
  return (
    <div
      aria-hidden="true"
      inert
      className="flex h-24 items-center justify-center overflow-hidden rounded-md bg-well transition-colors group-hover:bg-blue-50/60 sm:h-40"
    >
      {slug ? (
        <div className="pointer-events-none w-[200%] shrink-0 origin-center scale-[0.45] sm:w-full sm:scale-[0.68]">
          <ComponentPreview slug={slug} />
        </div>
      ) : (
        <SquaresFour size={32} className="text-gray-300" />
      )}
    </div>
  );
}

function Card({ entry }: { entry: Entry }) {
  const body = (
    <>
      <Thumbnail slug={entry.slug} />
      <div className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
        <div className="min-w-0">
          <div
            className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-800"
            title={entry.sourceName && entry.sourceName !== entry.name ? `Tracker name: ${entry.sourceName}` : undefined}
          >
            {entry.name}
          </div>
          <div className="text-xs text-gray-700">{entry.meta}</div>
        </div>
        <span className={`shrink-0 self-start rounded px-2 py-0.5 text-xs font-medium ${entry.badgeClass}`}>{entry.badgeLabel}</span>
      </div>
    </>
  );
  const base = "group block h-full min-w-0 rounded-xl border border-gray-200 bg-surface p-3";

  if (entry.slug) {
    return (
      <Link href={`/components/${entry.slug}`} className={`${base} transition-colors hover:border-blue-400`}>
        {body}
      </Link>
    );
  }
  if (entry.figmaLink) {
    return (
      <a href={entry.figmaLink} target="_blank" rel="noreferrer" className={`${base} transition-colors hover:border-blue-400`}>
        {body}
      </a>
    );
  }
  return <div className={`${base} opacity-80`}>{body}</div>;
}

export default function ComponentOverview() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Filter>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length, untracked: untracked.length };
    for (const s of statusOrder) c[s] = tracker.filter((t) => t.status === s).length;
    return c;
  }, []);

  // A filter that would lead to an empty page is not offered.
  const filters = (["all", ...statusOrder, "untracked"] as Filter[]).filter((s) => counts[s] > 0);

  const q = query.trim().toLowerCase();
  const visible = all.filter(
    (e) => (status === "all" || e.status === status) && (!q || `${e.name} ${e.sourceName ?? ""}`.toLowerCase().includes(q)),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search components</span>
          <MagnifyingGlass size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components"
            className="min-h-11 w-full rounded-md border border-gray-500 bg-surface py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-700 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          />
        </label>
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {filters.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={`min-h-11 rounded-md border px-3 text-xs font-medium transition-colors ${
                status === s ? "border-blue-600 bg-brand text-white" : "border-gray-300 bg-surface text-gray-700 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "All" : s === "untracked" ? statusText.untracked : statusLabel[s]}{" "}
              <span className="tabular-nums">{counts[s]}</span>
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
                <Card key={entry.key} entry={entry} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
