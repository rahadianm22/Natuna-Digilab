"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// After a client-side navigation, move focus to the new page's main landmark. Without this, focus is
// left on <body> and keyboard and screen reader users start again from the top of the document.
export default function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // A link to a section (#hash) already lands on its target; leave that focus alone.
    if (window.location.hash) return;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
