"use client";

import { useEffect, useRef } from "react";

// What makes the ring grow: anything a click does something to.
const interactive = 'a[href], button:not(:disabled), summary, [role="button"], [role="tab"], [role="option"], label[for], select';
const textField = 'input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"]), textarea';

/**
 * A small dot that sits on the pointer and a soft ring that trails behind it. Only on mouse-like pointers:
 * touch, forced-colors, and visitors without JavaScript keep the system cursor, because the system cursor is
 * hidden by a class this effect adds. With reduced motion the ring stays on the dot instead of trailing.
 */
export default function DotCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(forced-colors: active)").matches) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const d = dot.current!;
    const r = ring.current!;
    d.style.opacity = r.style.opacity = "0";

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let raf = 0;
    let seen = false;

    function frame() {
      rx += (x - rx) * (reduce ? 1 : 0.18);
      ry += (y - ry) * (reduce ? 1 : 0.18);
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(frame) : 0;
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        seen = true;
        rx = x;
        ry = y;
        root.classList.add("dot-cursor");
      }
      const target = e.target instanceof Element ? e.target : null;
      const onText = !!target?.closest(textField);
      d.style.opacity = r.style.opacity = onText ? "0" : "1";
      const hot = !onText && !!target?.closest(interactive);
      (r.firstElementChild as HTMLElement).style.scale = hot ? "1.6" : "1";
      (d.firstElementChild as HTMLElement).style.scale = hot ? "0.6" : "1";
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function onLeave() {
      d.style.opacity = r.style.opacity = "0";
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      root.classList.remove("dot-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} aria-hidden="true" className="dot-cursor-ring">
        <span />
      </div>
      <div ref={dot} aria-hidden="true" className="dot-cursor-dot">
        <span />
      </div>
    </>
  );
}
