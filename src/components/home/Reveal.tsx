"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Brings a section in as it scrolls into view. Children marked data-reveal-item rise in one after
 * another with a short, capped stagger. Without JavaScript, and under reduced motion, everything is
 * simply there.
 */
export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.querySelectorAll<HTMLElement>("[data-reveal-item]").forEach((n, i) => n.style.setProperty("--i", String(i)));
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${state === "idle" ? "" : "reveal"} ${state === "shown" ? "is-shown" : ""} ${className}`}>
      {children}
    </div>
  );
}
