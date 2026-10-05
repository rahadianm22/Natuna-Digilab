"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export type FigmaExportStatus = "idle" | "copied" | "failed" | "downloaded";

type Converter = typeof import("@/lib/dom-to-svg");

// The converter only runs on click, so it stays out of the page bundle. One shared promise means the
// module is fetched once however many frames are on the page.
let converter: Converter | undefined;
let loading: Promise<Converter> | undefined;

function loadConverter() {
  loading ??= import("@/lib/dom-to-svg").then((mod) => (converter = mod));
  // A failed fetch (offline for a moment) is retried on the next hover or click.
  loading.catch(() => (loading = undefined));
  return loading;
}

/**
 * Copy and download for a Copy to Figma surface. `warm` starts loading the converter on pointer enter
 * or focus, so by the time of the click it is usually in memory and the clipboard write runs with no
 * await before it, inside the click's user activation. The status resets to idle after `resetAfter`
 * milliseconds, and a newer status replaces an older one instead of being cut short by its timer.
 * `name` becomes the top layer in Figma; `fileName` is the download's name, without ".svg".
 */
export function useFigmaExport(
  ref: RefObject<HTMLElement | null>,
  { name, fileName = "natuna", resetAfter = 2400 }: { name: string; fileName?: string; resetAfter?: number },
) {
  const [status, setStatus] = useState<FigmaExportStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = useCallback(
    (next: FigmaExportStatus) => {
      setStatus(next);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus("idle"), resetAfter);
    },
    [resetAfter],
  );

  const warm = useCallback(() => {
    void loadConverter().catch(() => {});
  }, []);

  const copy = useCallback(async () => {
    if (!ref.current) return;
    try {
      const { domToSvg } = converter ?? (await loadConverter());
      if (!ref.current) return;
      await navigator.clipboard.writeText(domToSvg(ref.current, name));
      flash("copied");
    } catch {
      flash("failed");
    }
  }, [ref, name, flash]);

  const download = useCallback(async () => {
    if (!ref.current) return;
    const { domToSvg } = converter ?? (await loadConverter());
    if (!ref.current) return;
    const blob = new Blob([domToSvg(ref.current, name)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: `${fileName}.svg` });
    a.click();
    URL.revokeObjectURL(url);
    flash("downloaded");
  }, [ref, name, fileName, flash]);

  return { status, copy, download, warm };
}
