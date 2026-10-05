"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { domToSvg } from "@/lib/dom-to-svg";

const points = ["Text stays editable text", "Layers are named after their parts", "Borders, corners and icons stay vectors"];

/**
 * The Copy to Figma pitch with the real feature behind it: the button exports the example card through
 * the same converter every component page uses.
 */
export default function FigmaPanel() {
  const card = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "done" | "failed">("idle");

  async function copy() {
    if (!card.current) return;
    try {
      await navigator.clipboard.writeText(domToSvg(card.current, "Transfer sent"));
      setStatus("done");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2200);
  }

  return (
    <div className="flex flex-wrap items-center gap-12 rounded-[32px] border border-gray-200 bg-surface p-5 sm:p-14">
      <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-4.5" data-reveal-item>
        <span className="font-label text-[13px] text-blue-800">03 · Copy to Figma</span>
        <h2 id="figma" className="font-display text-[clamp(32px,3.6vw,46px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-gray-900">
          Paste layers, not screenshots.
        </h2>
        <p className="max-w-[460px] text-[17px] text-gray-700">
          Copy any example from the docs and paste it into Figma as editable layers, named after the parts they came
          from.
        </p>
        <ul className="flex flex-col gap-2.5 text-[15px] text-gray-900">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2.5">
              <Check size={18} weight="bold" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-w-0 flex-[1_1_420px] flex-col items-center gap-4 rounded-3xl bg-paper p-3 sm:p-8" data-reveal-item>
        <div ref={card} className="flex w-full max-w-[360px] flex-col gap-3.5 rounded-[20px] bg-surface p-4 shadow-[0_20px_40px_-24px_rgba(11,18,32,0.35)]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-soft text-inverse">
              <ArrowUpRight size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="whitespace-nowrap font-semibold text-gray-900">Transfer sent</div>
              <div className="whitespace-nowrap text-[13px] text-gray-700">To savings •••• 4821</div>
            </div>
            <span className="rounded-full bg-lime-soft px-2.5 py-1 text-xs font-semibold text-lime-ink">Success</span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <span className="text-[13px] text-gray-700">Amount</span>
            <span className="font-display text-[26px] font-bold text-gray-900">Rp&nbsp;250.000</span>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3 text-[13px] text-gray-700">
            <span>5 Oct 2026, 09:41</span>
            <span className="font-label">Ref. 0412 7731</span>
          </div>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-11 items-center gap-2.5 rounded-xl bg-inverse px-4.5 text-sm font-semibold text-inverse-text transition-transform active:scale-[0.97] dark:bg-inverse-text dark:text-inverse"
        >
          <Copy size={16} aria-hidden="true" />
          {status === "done" ? "Copied. Paste in Figma" : status === "failed" ? "Could not copy" : "Copy to Figma"}
        </button>
        <span role="status" className="sr-only">
          {status === "done" ? "Copied to the clipboard" : ""}
        </span>
      </div>
    </div>
  );
}
