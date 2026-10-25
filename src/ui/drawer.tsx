"use client";

import { X } from "@phosphor-icons/react/ssr";
import { useEffect, useId, useRef, type ReactNode } from "react";

export type DrawerSide = "right" | "left" | "bottom" | "top";
export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerPanelProps {
  title: string;
  description?: string;
  children?: ReactNode;
  /** Footer buttons. */
  footer?: ReactNode;
  onClose?: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  className?: string;
  /** Linked by the dialog. Set by Drawer. */
  titleId?: string;
}

// Width for right and left: 320, 400, 720. Bottom and top use the same sizes as a maximum width.
const WIDTH: Record<DrawerSize, string> = { sm: "w-80", md: "w-[400px]", lg: "w-[720px]" };
const CORNERS: Record<DrawerSide, string> = { right: "rounded-l-lg", left: "rounded-r-lg", bottom: "rounded-t-lg", top: "rounded-b-lg" };

/** The panel on its own, for documentation and for layouts that place it. Drawer adds the scrim and the focus handling. */
export function DrawerPanel({ title, description, children, footer, onClose, side = "right", size = "sm", className = "", titleId }: DrawerPanelProps) {
  const vertical = side === "right" || side === "left";
  return (
    <div className={`flex max-w-full flex-col bg-role-bg-surface shadow-lg ${WIDTH[size]} ${CORNERS[side]} ${vertical ? "h-full" : ""} ${className}`}>
      {(side === "bottom" || side === "top") && <span aria-hidden="true" className="mx-auto mt-2 h-1 w-8 rounded-full bg-role-border-input" />}
      <header className="flex items-start gap-3 border-b border-role-border-default px-4 py-3">
        <div className="grow">
          <h2 id={titleId} className="text-base font-semibold leading-6 text-role-text-primary">{title}</h2>
          {description && <p className="text-xs leading-[18px] text-role-text-secondary">{description}</p>}
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close" className="-my-1.5 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-sm text-role-text-secondary hover:bg-role-bg-hover">
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </header>
      <div className="grow overflow-auto p-4">{children}</div>
      {footer && <footer className="flex justify-end gap-2 border-t border-role-border-default px-4 py-3">{footer}</footer>}
    </div>
  );
}

export interface DrawerProps extends Omit<DrawerPanelProps, "titleId"> {
  open: boolean;
  /** Called for the close button, the scrim, and Escape. */
  onClose: () => void;
}

const POSITION: Record<DrawerSide, string> = {
  right: "ml-auto h-full",
  left: "mr-auto h-full",
  bottom: "mt-auto mx-auto",
  top: "mb-auto mx-auto",
};

/** A native dialog, so focus is trapped, Escape closes it, and the page behind is inert. */
export function Drawer({ open, onClose, side = "right", size = "sm", ...panel }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-role-text-primary/40"
    >
      <div className={`flex ${POSITION[side]} max-h-full ${side === "bottom" || side === "top" ? "w-full justify-center" : ""}`}>
        <DrawerPanel {...panel} side={side} size={size} onClose={onClose} titleId={titleId} />
      </div>
    </dialog>
  );
}
