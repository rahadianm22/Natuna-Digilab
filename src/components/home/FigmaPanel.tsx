"use client";

import { useRef } from "react";
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { useFigmaExport } from "@/components/useFigmaExport";
import { buttonStyles } from "@/ui";

const points = ["Text stays editable text", "Layers are named after their parts", "Borders, corners and icons stay vectors"];

/**
 * The Copy to Figma pitch with the real feature behind it: the button exports the example card through
 * the same converter every component page uses.
 */
export default function FigmaPanel() {
  const card = useRef<HTMLDivElement>(null);
  const { status, copy, warm } = useFigmaExport(card, { name: "Transfer sent", resetAfter: 2200 });

  return (
    <div className="flex flex-wrap items-center gap-12">
      <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4.5" data-reveal-item>
        <span className="font-label text-sm font-medium text-blue-800">Copy to Figma</span>
        <h2 id="figma" className="font-display text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-gray-900">
          Paste layers, not screenshots.
        </h2>
        <p className="max-w-[460px] text-lg text-gray-700">
          Copy any example from the docs and paste it into Figma as editable layers, named after the parts they came
          from.
        </p>
        <ul className="flex flex-col gap-2.5 text-base text-gray-900">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2.5">
              <Check size={18} weight="bold" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-w-0 flex-[1_1_420px] flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-gray-100 p-3 sm:p-8" data-reveal-item>
        <div ref={card} className="flex w-full max-w-[360px] flex-col gap-3.5 rounded-2xl bg-surface p-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
              <ArrowUpRight size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="whitespace-nowrap font-semibold text-gray-900">Transfer sent</div>
              <div className="whitespace-nowrap text-sm text-gray-700">To savings •••• 4821</div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-900">Success</span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <span className="text-sm text-gray-700">Amount</span>
            <span className="font-display text-2xl font-bold tracking-[-0.01em] text-gray-900">Rp&nbsp;250.000</span>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3 text-sm text-gray-700">
            <span>5 Oct 2026, 09:41</span>
            <span className="font-label">Ref. 0412 7731</span>
          </div>
        </div>
        <button
          type="button"
          onClick={copy}
          onPointerEnter={warm}
          onFocus={warm}
          className={buttonStyles({ variant: "inverse" })}
        >
          <Copy size={16} aria-hidden="true" />
          {status === "copied" ? "Copied. Paste in Figma" : status === "failed" ? "Could not copy" : "Copy to Figma"}
        </button>
        <span role="status" className="sr-only">
          {status === "copied" ? "Copied to the clipboard" : ""}
        </span>
      </div>
    </div>
  );
}
