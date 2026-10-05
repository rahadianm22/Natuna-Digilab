import Link from "next/link";
import { SquaresFour } from "@phosphor-icons/react/ssr";
import ComponentPreview from "./ComponentPreview";
import ComponentOverviewFilter, { type FilterEntry } from "./ComponentOverviewFilter";
import { componentGroup, components, getComponent, statusText, statusTone } from "@/lib/components-data";
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
    group: t.slug ? componentGroup(t.slug) : t.group,
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
    group: componentGroup(c.slug),
  }));

const all = [...tracked, ...untracked];

const groups = [
  ...trackerGroups,
  { name: "Documentation", description: "Layouts for the Figma file itself, such as covers and artboards. They are not product UI." },
  { name: "Not tracked", description: "Pages without a tracker row. They have no design sign-off and no code yet; treat them as sketches." },
];

type Filter = TrackerStatus | "untracked" | "all";

const counts: Record<string, number> = { all: all.length, untracked: untracked.length };
for (const s of statusOrder) counts[s] = tracker.filter((t) => t.status === s).length;

// A filter that would lead to an empty page is not offered.
const filters = (["all", ...statusOrder, "untracked"] as Filter[])
  .filter((s) => counts[s] > 0)
  .map((s) => ({
    value: s,
    label: s === "all" ? "All" : s === "untracked" ? statusText.untracked : statusLabel[s],
    count: counts[s],
  }));

// Only what the filter matches on goes to the browser; the cards and their previews stay server HTML.
const filterEntries: FilterEntry[] = all.map((e) => ({
  key: e.key,
  name: e.name,
  sourceName: e.sourceName,
  status: e.status,
  group: e.group,
}));

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
      <Link href={`/components/${entry.slug}`} prefetch={false} className={`${base} transition-colors hover:border-blue-400`}>
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
  return (
    <ComponentOverviewFilter
      entries={filterEntries}
      cards={Object.fromEntries(all.map((e) => [e.key, <Card key={e.key} entry={e} />]))}
      filters={filters}
      groups={groups}
    />
  );
}
