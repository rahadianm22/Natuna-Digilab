"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; label: string };

/**
 * The section being read: the last heading that has scrolled past the top band of the viewport.
 * At the bottom of the page the final section wins, so short closing sections still light up.
 */
function useActiveSection(items: Item[], offset = 140) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    function update() {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) return setActive(items[items.length - 1]?.id);
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= offset) current = item.id;
      }
      setActive(current);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items, offset]);

  return active;
}

/** Sticky table of contents beside the content on wide screens. */
export default function OnThisPage({ items, className = "" }: { items: Item[]; className?: string }) {
  const active = useActiveSection(items);

  return (
    <nav aria-label="On this page" className={`sticky top-24 h-fit shrink-0 ${className}`}>
      <div className="text-sm font-semibold text-gray-900">On this page</div>
      <ul className="mt-3 space-y-1 border-l border-gray-200 text-sm">
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={`-ml-px block border-l py-1 pl-3 transition-colors ${
                  current
                    ? "border-blue-700 font-medium text-blue-700"
                    : "border-transparent text-gray-600 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * The same sections as a sticky, horizontally scrolling row for phones and tablets, where there is no
 * room for a side column. The current section is marked and kept in view inside the row.
 */
export function SectionChips({ items, label, className = "" }: { items: Item[]; label: string; className?: string }) {
  const active = useActiveSection(items, 180);
  const row = useRef<HTMLElement>(null);

  useEffect(() => {
    const chip = row.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    // Scroll only the row, never the page, so reading position is not disturbed.
    if (chip && row.current) {
      const r = row.current;
      const left = chip.offsetLeft - r.clientWidth / 2 + chip.offsetWidth / 2;
      r.scrollTo({ left, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }, [active]);

  return (
    <nav ref={row} aria-label={label} className={`flex gap-1 overflow-x-auto ${className}`}>
      {items.map((s) => {
        const current = s.id === active;
        return (
          <a
            key={s.id}
            data-id={s.id}
            href={`#${s.id}`}
            aria-current={current ? "location" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-md px-3 text-sm font-medium transition-colors ${
              current ? "bg-blue-50 text-blue-800" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {s.label}
          </a>
        );
      })}
    </nav>
  );
}
