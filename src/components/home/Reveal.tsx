"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Brings the items of a section in as they scroll into view. Each item with data-reveal-item is watched on its own,
 * so a tall section does not finish animating before its lower rows can be seen. Items that arrive together stagger
 * by a short, capped step. Without JavaScript, under reduced motion, and for anything already on screen at load,
 * items are simply there.
 */
export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pending = [...root.querySelectorAll<HTMLElement>("[data-reveal-item]")].filter(
      (n) => n.getBoundingClientRect().top > window.innerHeight * 0.9,
    );
    if (!pending.length) return;

    // Once an item has settled, drop the reveal attribute so its own hover and focus transitions are untouched.
    const settle = (n: HTMLElement) => {
      delete n.dataset.reveal;
      n.style.removeProperty("--i");
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
          .forEach((e, k) => {
            const n = e.target as HTMLElement;
            io.unobserve(n);
            n.style.setProperty("--i", String(Math.min(k, 5)));
            n.dataset.reveal = "shown";
            const done = (ev: TransitionEvent) => {
              if (ev.target !== n || ev.propertyName !== "transform") return;
              n.removeEventListener("transitionend", done);
              settle(n);
            };
            n.addEventListener("transitionend", done);
            // transitionend never fires if the tab is hidden for the whole transition.
            setTimeout(() => settle(n), 1800);
          });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    pending.forEach((n) => {
      n.dataset.reveal = "pending";
      io.observe(n);
    });

    return () => {
      io.disconnect();
      pending.forEach(settle);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
