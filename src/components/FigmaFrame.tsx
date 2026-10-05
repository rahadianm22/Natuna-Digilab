"use client";

import { useRef, type ReactNode } from "react";
import { FigmaLogo, DownloadSimple } from "@phosphor-icons/react";
import { useFigmaExport, type FigmaExportStatus } from "@/components/useFigmaExport";

const message: Record<FigmaExportStatus, string> = {
  idle: "",
  copied: "Copied. Paste it into Figma.",
  failed: "Could not copy. Use Download SVG instead.",
  downloaded: "SVG downloaded.",
};

/**
 * A preview surface that can hand its current rendering to Figma. Copy puts SVG markup on the
 * clipboard, which Figma pastes as editable, named layers; Download saves the same markup as a
 * file for drag and drop.
 */
export default function FigmaFrame({ name, className = "", children }: { name: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { status, copy, download, warm } = useFigmaExport(ref, {
    name: `Natuna / ${name}`,
    fileName: `natuna-${name.toLowerCase().replace(/\W+/g, "-")}`,
  });

  const action =
    "inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-[background-color,color,transform] duration-100 active:scale-[0.97]";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-surface">
      <div ref={ref} className={className}>
        {children}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-gray-200 px-3 py-2">
        <p className="px-1 text-xs text-gray-700" aria-hidden={status !== "idle"}>
          {status === "idle" ? "Pastes as editable layers. Shadows are not exported." : message[status]}
        </p>
        <div className="ml-auto flex gap-1.5">
          <button type="button" onClick={copy} onPointerEnter={warm} onFocus={warm} className={`${action} bg-gray-100 text-gray-800 hover:bg-gray-200`}>
            <FigmaLogo size={14} aria-hidden="true" />
            {status === "copied" ? "Copied" : "Copy to Figma"}
          </button>
          <button type="button" onClick={download} onPointerEnter={warm} onFocus={warm} className={`${action} text-gray-700 hover:bg-gray-100`}>
            <DownloadSimple size={14} aria-hidden="true" />
            Download SVG
          </button>
        </div>
      </div>
      <span role="status" className="sr-only">
        {message[status]}
      </span>
    </div>
  );
}
