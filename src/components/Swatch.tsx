"use client";

import { useState } from "react";

export default function Swatch({
  step,
  hex,
  anchor,
  onWhite,
}: {
  step: string;
  hex: string;
  anchor: boolean;
  onWhite: number;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the hex stays visible under the swatch.
    }
  }

  // Labels sit below the color on the page background, so they stay readable on every step.
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${step}${anchor ? ", anchor" : ""}, ${hex}, ${onWhite.toFixed(2)} to 1 on white. Copy hex`}
      className="group flex flex-col rounded-md text-left"
    >
      <span
        className={`block h-14 w-full rounded-md transition-transform group-hover:-translate-y-0.5 ${
          anchor ? "ring-2 ring-gray-900 ring-offset-2 ring-offset-canvas" : "border border-gray-900/10"
        }`}
        style={{ background: hex }}
      />
      <span className="mt-2 text-xs font-semibold text-gray-900">
        {step}
        {anchor && <span className="ml-1 font-normal text-gray-600">anchor</span>}
      </span>
      <span className="font-mono-code text-[11px] text-gray-600">{copied ? "Copied" : hex}</span>
      <span className="text-[11px] tabular-nums text-gray-600">
        {onWhite.toFixed(2)}:1{onWhite >= 7 ? " AAA" : onWhite >= 4.5 ? " AA" : ""}
      </span>
    </button>
  );
}
