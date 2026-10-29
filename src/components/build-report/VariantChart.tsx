"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface ChartRow {
  name: string;
  variants: number;
  slug?: string;
  group: "Atoms" | "Molecules";
}

type Sort = "variants" | "build";

// Two groups, two hues. Both clear 3:1 against the surface in light and dark, and every bar is labelled with its
// number, so the color only groups, it never carries the value.
const BAR: Record<ChartRow["group"], string> = { Atoms: "bg-role-status-success", Molecules: "bg-role-text-link" };

/** Horizontal bars, one per component, that grow in when the chart scrolls into view. */
export default function VariantChart({ rows }: { rows: ChartRow[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [grown, setGrown] = useState(true);
  const [sort, setSort] = useState<Sort>("variants");
  const max = Math.max(...rows.map((r) => r.variants));
  const shown = sort === "variants" ? [...rows].sort((a, b) => b.variants - a.variants || a.name.localeCompare(b.name)) : rows;

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    setGrown(false);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGrown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = (s: Sort, label: string) => (
    <button
      type="button"
      aria-pressed={sort === s}
      onClick={() => setSort(s)}
      className={`min-h-11 rounded-full px-4 text-sm font-medium transition-colors ${sort === s ? "bg-role-text-primary text-role-bg-surface" : "text-role-text-secondary hover:bg-role-bg-hover"}`}
    >
      {label}
    </button>
  );

  return (
    <div ref={ref} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-5 text-sm text-role-text-secondary" aria-label="Legend">
          {(["Atoms", "Molecules"] as const).map((g) => (
            <li key={g} className="flex items-center gap-2">
              <span aria-hidden="true" className={`size-3 rounded-sm ${BAR[g]}`} />
              {g} · {rows.filter((r) => r.group === g).length}
            </li>
          ))}
        </ul>
        <div className="flex gap-1 rounded-full border border-role-border-default p-1" role="group" aria-label="Sort the chart">
          {toggle("variants", "Most variants")}
          {toggle("build", "Build order")}
        </div>
      </div>

      <ol className="flex flex-col gap-1.5">
        {shown.map((r, i) => {
          const pct = (r.variants / max) * 100;
          const name = r.slug ? (
            <Link href={`/components/${r.slug}`} className="flex min-h-11 min-w-0 items-center rounded-sm text-role-text-primary underline-offset-4 hover:underline">
              <span className="truncate">{r.name}</span>
            </Link>
          ) : (
            <span className="truncate text-role-text-primary">{r.name}</span>
          );
          return (
            <li key={r.name} className="grid min-h-11 grid-cols-[minmax(0,7rem)_1fr] items-center gap-3 text-sm sm:grid-cols-[minmax(0,12rem)_1fr]">
              {name}
              <div className="flex items-center gap-2.5">
                <div className="h-5 grow overflow-hidden rounded-full bg-role-bg-subtle">
                  <div
                    className={`h-full rounded-full transition-[width] duration-700 ease-out ${BAR[r.group]}`}
                    style={{ width: grown ? `${pct}%` : "0%", transitionDelay: grown ? `${Math.min(i, 20) * 25}ms` : "0ms" }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right font-semibold tabular-nums text-role-text-primary">{r.variants}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
