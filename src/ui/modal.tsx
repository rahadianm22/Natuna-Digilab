"use client";

import { Warning, X } from "@phosphor-icons/react/ssr";
import { useEffect, useId, useRef, type ReactNode } from "react";

export type ModalType = "confirmation" | "form" | "alert";
export type ModalSize = "sm" | "md" | "lg" | "xl";

// 400, 560, 720, 960, never wider than the screen less 16px a side.
const WIDTH: Record<ModalSize, string> = { sm: "w-[400px]", md: "w-[560px]", lg: "w-[720px]", xl: "w-[960px]" };

export interface ModalPanelProps {
  title: string;
  description?: ReactNode;
  type?: ModalType;
  size?: ModalSize;
  /** The body, such as form fields. */
  children?: ReactNode;
  /** Footer buttons, right aligned. One primary action; a destructive one uses the destructive Button. */
  footer?: ReactNode;
  onClose?: () => void;
  titleId?: string;
  className?: string;
}

/** The dialog box on its own, for documentation. Modal adds the backdrop and focus handling. */
export function ModalPanel({ title, description, type = "confirmation", size = "sm", children, footer, onClose, titleId, className = "" }: ModalPanelProps) {
  return (
    <div className={`flex min-w-0 max-w-[calc(100vw-32px)] flex-col gap-4 rounded-xl bg-role-bg-surface p-6 shadow-lg ${WIDTH[size]} ${className}`}>
      {type === "alert" && (
        <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-role-bg-tone-danger text-role-text-tone-danger">
          <Warning size={20} />
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="grow">
          <h2 id={titleId} className="text-lg font-semibold leading-7 text-role-text-primary">
            {title}
          </h2>
          {description && <div className="mt-1 text-sm leading-[22px] text-role-text-secondary">{description}</div>}
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close" className="-my-2 -mr-3 flex size-11 shrink-0 items-center justify-center rounded-sm text-role-text-secondary hover:bg-role-bg-hover">
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      {children}
      {footer && <div className="flex flex-wrap justify-end gap-2">{footer}</div>}
    </div>
  );
}

export interface ModalProps extends Omit<ModalPanelProps, "titleId"> {
  open: boolean;
  /** Called for the close button, the backdrop, and Escape. */
  onClose: () => void;
}

/** A centered dialog for critical confirmations. A native dialog, so focus is trapped and the page behind is inert. */
export function Modal({ open, onClose, ...panel }: ModalProps) {
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
      className="m-auto bg-transparent p-0 backdrop:bg-role-text-primary/40"
    >
      <ModalPanel {...panel} onClose={onClose} titleId={titleId} />
    </dialog>
  );
}
