import { CheckCircle, Info, Warning, X, XCircle } from "@phosphor-icons/react/ssr";
import type { HTMLAttributes } from "react";

export type ToastTone = "info" | "success" | "warning" | "danger";
export type ToastType = "solid" | "subtle";

const solid: Record<ToastTone, string> = {
  info: "bg-role-bg-brand text-role-text-on-brand",
  success: "bg-role-status-solid-success text-role-text-on-accent",
  warning: "bg-role-status-solid-warning text-role-text-on-accent",
  danger: "bg-role-bg-danger text-role-text-on-danger",
};

const subtle: Record<ToastTone, string> = {
  info: "bg-role-status-info-bg text-role-status-info",
  success: "bg-role-status-success-bg text-role-status-success",
  warning: "bg-role-status-warning-bg text-role-status-warning",
  danger: "bg-role-status-danger-bg text-role-status-danger",
};

const ICONS = { info: Info, success: CheckCircle, warning: Warning, danger: XCircle };

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: ToastTone;
  type?: ToastType;
  size?: "sm" | "md";
  title: string;
  description?: string;
  /** Label for the action, such as Undo. Needs onAction. */
  actionLabel?: string;
  onAction?: () => void;
  /** Shows the close button. */
  onClose?: () => void;
}

/**
 * The toast itself. Showing it, stacking it, and dismissing it on a timer belong to the app.
 * Danger must never auto-dismiss: the user has to acknowledge an error.
 */
export function Toast({ tone = "info", type = "subtle", size = "md", title, description, actionLabel, onAction, onClose, className = "", ...rest }: ToastProps) {
  const Icon = ICONS[tone];
  const colors = type === "solid" ? solid[tone] : subtle[tone];

  return (
    <div
      // alert interrupts the screen reader, so only errors use it.
      role={tone === "danger" ? "alert" : "status"}
      className={`flex w-full max-w-[360px] items-start gap-3 rounded-xl px-4 shadow-md ${size === "sm" ? "py-3" : "py-3.5"} min-h-12 ${colors} ${className}`}
      {...rest}
    >
      <Icon size={20} aria-hidden="true" className="mt-px shrink-0" />
      <div className="min-w-0 grow">
        <p className="text-sm font-medium leading-[22px]">{title}</p>
        {description && <p className="text-xs leading-[18px]">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="-my-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm px-1 text-sm font-medium underline underline-offset-2">
          {actionLabel}
        </button>
      )}
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Close notification" className="-my-3 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-sm">
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
