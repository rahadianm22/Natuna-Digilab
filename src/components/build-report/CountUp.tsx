"use client";

import { useEffect, useRef, useState } from "react";

const fmt = new Intl.NumberFormat("en-US");

/**
 * A number that counts up once it scrolls into view. The server renders the final value, so it reads correctly
 * without JavaScript, to screen readers, and under reduced motion, where it never moves.
 */
export default function CountUp({ value, duration = 1400, className = "" }: { value: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || value === 0 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // Ease out, so the last digits settle instead of snapping.
          setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {/* The animated digits are hidden from screen readers; the final value is read once. */}
      <span aria-hidden="true">{fmt.format(shown)}</span>
      <span className="sr-only">{fmt.format(value)}</span>
    </span>
  );
}
