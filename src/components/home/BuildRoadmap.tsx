import Link from "next/link";
import { CaretDown, Check } from "@phosphor-icons/react/ssr";
import { getComponent } from "@/lib/components-data";
import { lastBuildDay, statusLabel, tracker, type TrackerItem, type TrackerStatus } from "@/lib/natuna-tracker";

type Stage = { key: string; label: string; items: TrackerItem[] };

const dot: Record<TrackerStatus, string> = {
  Selesai: "bg-emerald-600",
  "On Review": "bg-blue-600",
  OnProgress: "bg-amber-500",
  Belum: "bg-gray-300",
};

const last = lastBuildDay();
// Four windows over the build days, cut so each holds a similar amount of work.
const windows: [number, number][] = [
  [1, 5],
  [6, 10],
  [11, 15],
  [16, last],
];

const byDay = (a: TrackerItem, b: TrackerItem) => (a.buildDay ?? 0) - (b.buildDay ?? 0) || a.name.localeCompare(b.name);

const stages: Stage[] = [
  { key: "done", label: "Done", items: tracker.filter((t) => t.status === "Selesai").sort(byDay) },
  ...windows.map(([from, to]) => ({
    key: `d${from}`,
    label: `Days ${from}–${to}`,
    items: tracker.filter((t) => t.status !== "Selesai" && t.buildDay && t.buildDay >= from && t.buildDay <= to).sort(byDay),
  })),
];

// The stage being worked on is the first one that is not finished.
const currentIndex = stages.findIndex((s) => s.items.some((t) => t.status !== "Selesai"));

const nameOf = (t: TrackerItem) => (t.slug && getComponent(t.slug)?.name) || t.name;

const nodeTone = (done: boolean, current: boolean) =>
  done
    ? "bg-emerald-600 text-white"
    : current
      ? "border-2 border-blue-600 bg-canvas ring-4 ring-blue-100"
      : "border-2 border-gray-300 bg-canvas";

function StageTitle({ stage, current }: { stage: Stage; current: boolean }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900">
        {stage.label}
        {current && <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800">Now</span>}
      </h3>
      <p className="text-sm text-gray-600">
        {stage.items.length} component{stage.items.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}

function StageList({ stage }: { stage: Stage }) {
  return (
    <ul className="mt-4 space-y-0.5">
      {stage.items.map((t) => {
        const row = (
          <>
            <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${dot[t.status]}`} />
            <span className="min-w-0 flex-1 truncate">{nameOf(t)}</span>
            {t.buildDay ? <span className="shrink-0 text-xs tabular-nums text-gray-600">Day {t.buildDay}</span> : null}
          </>
        );
        const label = `${nameOf(t)}, ${statusLabel[t.status]}${t.buildDay ? `, build day ${t.buildDay}` : ""}`;
        return (
          <li key={t.no}>
            {t.slug ? (
              <Link
                href={`/components/${t.slug}`}
                aria-label={label}
                className="-mx-2 flex min-h-11 items-center gap-2.5 rounded-md px-2 text-sm text-gray-800 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:min-h-9"
              >
                {row}
              </Link>
            ) : (
              <span aria-label={label} className="-mx-2 flex min-h-11 items-center gap-2.5 px-2 text-sm text-gray-800 lg:min-h-9">
                {row}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The tracker's build plan as a route: what is done, what is being built now, and what each later
 * window of build days holds. Every row is a real tracker row and links to its page.
 */
export default function BuildRoadmap() {
  return (
    <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
      {/* The route line: vertical beside the stages on phones, horizontal through the nodes on wide screens. */}
      <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-2 w-px bg-gray-300 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[11px] lg:h-px lg:w-auto" />
      {stages.map((stage, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        return (
          <li key={stage.key} className="relative pl-10 lg:pl-0">
            {/* Phones: each stage folds away, and only the one being built now starts open. */}
            <span aria-hidden="true" className={`absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full lg:hidden ${nodeTone(done, current)}`}>
              {done && <Check size={14} weight="bold" />}
            </span>
            <details open={current} className="group lg:hidden">
              <summary className="-mt-2.5 flex min-h-11 cursor-pointer list-none items-center justify-between gap-3">
                <StageTitle stage={stage} current={current} />
                <CaretDown size={16} aria-hidden="true" className="shrink-0 text-gray-600 transition-transform group-open:rotate-180" />
              </summary>
              <StageList stage={stage} />
            </details>

            {/* Wide screens: every stage open, in columns along the route line. */}
            <div className="hidden lg:block">
              <span aria-hidden="true" className={`flex h-6 w-6 items-center justify-center rounded-full ${nodeTone(done, current)}`}>
                {done && <Check size={14} weight="bold" />}
              </span>
              <div className="mt-3">
                <StageTitle stage={stage} current={current} />
              </div>
              <StageList stage={stage} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
