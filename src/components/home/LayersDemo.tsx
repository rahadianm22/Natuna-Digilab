"use client";

import { useEffect, useRef, useState } from "react";
import { FigmaLogo, Hash, LineSegment, PenNib, Square, Star, TextT } from "@phosphor-icons/react";
import { Avatar, Badge, buttonStyles } from "@/ui";
import { domToSvg } from "@/lib/dom-to-svg";

type Kind = "frame" | "text" | "rect" | "line" | "path" | "icon";
type Layer = { name: string; kind: Kind; children: Layer[] };

const icons = { frame: Hash, text: TextT, rect: Square, line: LineSegment, path: PenNib, icon: Star };

function kindOf(el: Element): Kind {
  switch (el.tagName.toLowerCase()) {
    case "g":
      return "frame";
    case "text":
      return "text";
    case "line":
      return "line";
    case "path":
      return "path";
    case "svg":
      return "icon";
    default:
      return "rect";
  }
}

function read(el: Element): Layer[] {
  return [...el.children]
    .filter((c) => c.tagName.toLowerCase() !== "clippath")
    .map((c) => ({
      name: c.getAttribute("id") ?? c.tagName,
      kind: kindOf(c),
      // An icon's inner shapes are one vector in Figma, so its children are not listed.
      children: c.tagName.toLowerCase() === "g" ? read(c) : [],
    }));
}

function count(layers: Layer[]): number {
  return layers.reduce((n, l) => n + 1 + count(l.children), 0);
}

function Tree({ layers, depth }: { layers: Layer[]; depth: number }) {
  return (
    <ul>
      {layers.map((l, i) => {
        const Icon = icons[l.kind];
        return (
          <li key={`${l.name}-${i}`}>
            <div className="flex min-h-7 items-center gap-2 rounded px-2 text-[13px] hover:bg-white/[0.06]" style={{ paddingLeft: 8 + depth * 14 }}>
              <Icon size={13} aria-hidden="true" className="shrink-0 text-[#9aa4b2]" />
              <span className={`truncate ${l.kind === "frame" ? "font-medium text-white" : "text-[#d0d5dd]"}`}>{l.name}</span>
            </div>
            {l.children.length > 0 && <Tree layers={l.children} depth={depth + 1} />}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * A receipt card beside the layer list that Copy to Figma would paste for it. The list is read from
 * the SVG the converter produces for this card right now, so it is the real output, not a mock-up.
 */
export default function LayersDemo() {
  const card = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState<Layer[] | null>(null);
  const [svg, setSvg] = useState("");
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

  useEffect(() => {
    let alive = true;
    // Wait for the fonts, so text is measured in Urbanist and lines break where they will in Figma.
    document.fonts.ready.then(() => {
      if (!alive || !card.current) return;
      const out = domToSvg(card.current, "Transfer receipt");
      const root = new DOMParser().parseFromString(out, "image/svg+xml").querySelector("svg > g");
      setSvg(out);
      setLayers(root ? [{ name: root.getAttribute("id") ?? "Frame", kind: "frame", children: read(root) }] : []);
    });
    return () => {
      alive = false;
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(svg);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    setTimeout(() => setCopied("idle"), 2000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-stretch">
      <div className="flex items-center justify-center rounded-3xl bg-gray-50 p-6 sm:p-12">
        <div ref={card} className="w-full max-w-sm rounded-2xl border border-gray-200 bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Transfer</span>
            <Badge tone="success">Sent</Badge>
          </div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-gray-900">Rp&nbsp;500.000</div>
          <div className="mt-5 flex items-center gap-3">
            <Avatar name="Budi Santoso" />
            <div className="min-w-0">
              <div className="truncate font-semibold text-gray-900">Budi Santoso</div>
              <div className="text-xs text-gray-600">Bank account •••• 7710</div>
            </div>
          </div>
          <div className="mt-6 flex gap-2" aria-hidden="true">
            <span className={`${buttonStyles({ variant: "ghost" })} flex-1`}>Share</span>
            <span className={`${buttonStyles()} flex-1`}>Done</span>
          </div>
        </div>
      </div>

      {/* Always dark, like the panel it stands for, so it reads the same in both site modes. */}
      <div className="flex min-h-80 flex-col overflow-hidden rounded-3xl bg-[#0d121c] text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-sm font-semibold">Layers</span>
          <span className="text-xs tabular-nums text-[#9aa4b2]">{layers ? `${count(layers)} layers` : "Reading"}</span>
        </div>
        <div tabIndex={0} aria-label="Layers Copy to Figma creates for this card" className="max-h-[22rem] flex-1 overflow-y-auto p-2">
          {layers ? <Tree layers={layers} depth={0} /> : <p className="px-2 py-1 text-sm text-[#9aa4b2]">Reading the card</p>}
        </div>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={copy}
            disabled={!svg}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-semibold text-[#0d121c] transition-[background-color,transform] duration-100 hover:bg-[#ebf0f4] active:scale-[0.98] disabled:opacity-60"
          >
            <FigmaLogo size={16} aria-hidden="true" />
            {copied === "done" ? "Copied. Paste in Figma" : copied === "failed" ? "Could not copy" : "Copy to Figma"}
          </button>
          <span role="status" className="sr-only">
            {copied === "done" ? "Copied to the clipboard" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
