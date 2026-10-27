import { DownloadSimple } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

export type QrSize = "sm" | "md" | "lg";

// QR square 160, 200, 240.
const BOX: Record<QrSize, string> = { sm: "size-40", md: "size-[200px]", lg: "size-60" };

export interface QrCodeDisplayProps {
  /** Merchant or account name. */
  label?: string;
  /** The real QR from the backend, as an image or SVG element. Leave out only in documentation. */
  qr?: ReactNode;
  /** The formatted amount, such as Rp150.000. */
  value?: string;
  /** Dynamic QR only: the countdown text, such as "Valid for 04:59". */
  expiry?: string;
  type?: "static" | "dynamic";
  size?: QrSize;
  onSave?: () => void;
  saveLabel?: string;
  className?: string;
}

/**
 * A placeholder pattern, clearly not scannable: the three finder squares and a fixed scatter. Swap it for the real
 * QR from the backend; never draw a payment QR on the client.
 */
function Placeholder() {
  const cells: [number, number][] = [];
  for (let y = 0; y < 21; y++)
    for (let x = 0; x < 21; x++) {
      const finder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (!finder && (x * 7 + y * 13 + x * y) % 5 < 2) cells.push([x, y]);
    }
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="currentColor" />
      <rect x={x + 1} y={y + 1} width="5" height="5" className="fill-role-bg-surface" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="currentColor" />
    </g>
  );
  return (
    <svg viewBox="0 0 21 21" className="size-full text-role-text-primary" shapeRendering="crispEdges">
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
      {cells.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
    </svg>
  );
}

/** A payment QR with the merchant name, amount, an optional countdown, and a save action. */
export function QrCodeDisplay({ label, qr, value, expiry, type = "static", size = "md", onSave, saveLabel = "Save image", className = "" }: QrCodeDisplayProps) {
  return (
    <figure className={`inline-flex flex-col items-center gap-2 rounded-lg border border-role-border-default bg-role-bg-surface p-4 shadow-sm ${className}`}>
      {label && <figcaption className="text-sm font-semibold text-role-text-primary">{label}</figcaption>}
      <div role="img" aria-label={label ? `Payment QR code for ${label}` : "Payment QR code"} className={`rounded-md border border-role-border-default bg-role-bg-surface p-2 ${BOX[size]}`}>
        {qr ?? <Placeholder />}
      </div>
      {value && <p className="text-xl font-semibold tabular-nums text-role-text-primary">{value}</p>}
      {type === "dynamic" && expiry && (
        <p className="text-xs text-role-text-secondary" aria-live="off">
          {expiry}
        </p>
      )}
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-role-bg-brand px-4 text-sm font-medium text-role-text-link hover:bg-role-bg-hover"
        >
          <DownloadSimple size={16} aria-hidden="true" />
          {saveLabel}
        </button>
      )}
    </figure>
  );
}
