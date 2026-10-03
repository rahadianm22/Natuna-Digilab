import Link from "next/link";
import { getComponent } from "@/lib/components-data";
import { lastBuildDay, statusLabel, tracker, type TrackerItem, type TrackerStatus } from "@/lib/natuna-tracker";

const last = lastBuildDay();
const days = Array.from({ length: last }, (_, i) => i + 1);
const done = tracker.filter((t) => t.status === "Selesai").sort((a, b) => a.name.localeCompare(b.name));
const onDay = (d: number) => tracker.filter((t) => t.status !== "Selesai" && t.buildDay === d);
// The window being built now: from the first unfinished day, five days on.
const firstOpen = Math.min(...tracker.filter((t) => t.status !== "Selesai" && t.buildDay).map((t) => t.buildDay!));

const tone: Record<TrackerStatus, string> = {
  Selesai: "bg-emerald-500",
  "On Review": "bg-blue-400",
  OnProgress: "bg-amber-400",
  Belum: "bg-white/[0.07] ring-1 ring-inset ring-white/30",
};

const columns = `repeat(3, minmax(0, 1fr)) 0.75rem repeat(${last}, minmax(0, 1fr))`;

const nameOf = (t: TrackerItem) => (t.slug && getComponent(t.slug)?.name) || t.name;

function Cell({ item }: { item: TrackerItem }) {
  const label = `${nameOf(item)}, ${statusLabel[item.status]}${item.buildDay ? `, build day ${item.buildDay}` : ""}`;
  const cls = `group relative block aspect-square w-full rounded-[3px] outline-offset-2 transition-transform hover:scale-110 focus-visible:scale-110 ${tone[item.status]}`;
  // The name appears above the cell on hover and focus; screen readers get it from the label.
  const tip = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-medium text-[#0d121c] shadow-md group-hover:block group-focus-visible:block"
    >
      {nameOf(item)}
    </span>
  );
  return item.slug ? (
    <Link href={`/components/${item.slug}`} aria-label={label} className={cls}>
      {tip}
    </Link>
  ) : (
    <span role="img" aria-label={label} className={cls}>
      {tip}
    </span>
  );
}

/**
 * The build plan as a grid: the done pile on the left, then one column per build day with one cell per
 * component. A team can read where the work is, and how much is left, in a single glance.
 */
export default function BuildGrid() {
  return (
    <div>
      {/* One grid for everything, so a done cell and a day cell are the same size: three columns hold the
          done block, a narrow gutter, then one column per build day. */}
      <div className="grid items-end gap-1" style={{ gridTemplateColumns: columns }}>
        <div className="col-span-3 grid grid-cols-3 gap-1 p-0.5">
          {done.map((t) => (
            <Cell key={t.no} item={t} />
          ))}
        </div>
        <span aria-hidden="true" />
        {days.map((d) => {
          const now = d >= firstOpen && d < firstOpen + 5;
          return (
            <div key={d} className={`flex flex-col-reverse gap-1 rounded-sm p-0.5 ${now ? "bg-white/[0.06]" : ""}`}>
              {onDay(d).map((t) => (
                <Cell key={t.no} item={t} />
              ))}
            </div>
          );
        })}
      </div>

      {/* Axis: the done block, then every fifth day, so the numbers stay readable on a phone. */}
      <div className="mt-3 grid gap-1 text-xs text-gray-600" style={{ gridTemplateColumns: columns }}>
        <span className="col-span-3 px-0.5">Done</span>
        <span aria-hidden="true" />
        {days.map((d) => (
          <span key={d} className="text-center tabular-nums">
            {d === 1 || d % 5 === 0 || d === last ? d : ""}
          </span>
        ))}
      </div>
    </div>
  );
}
