import { CheckCircle, Info, Warning, X, XCircle } from "@phosphor-icons/react/ssr";
import type { HTMLAttributes, ReactNode } from "react";

export type AlertTone = "info" | "success" | "warning" | "danger";

const TONE: Record<AlertTone, { box: string; Icon: typeof Info }> = {
  info: { box: "border-role-status-info/40 bg-role-status-info-bg text-role-status-info", Icon: Info },
  success: { box: "border-role-status-success/40 bg-role-status-success-bg text-role-status-success", Icon: CheckCircle },
  warning: { box: "border-role-status-warning/40 bg-role-status-warning-bg text-role-status-warning", Icon: Warning },
  danger: { box: "border-role-status-danger/40 bg-role-status-danger-bg text-role-status-danger", Icon: XCircle },
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title: string;
  description?: ReactNode;
  /** A link or button for the next step. */
  action?: ReactNode;
  /** Shows the close button. */
  onClose?: () => void;
}

/**
 * A message that stays in the page until the problem is gone, unlike Toast which comes and goes.
 * Icon and color are locked per tone.
 */
export function Alert({ tone = "info", title, description, action, onClose, className = "", ...rest }: AlertProps) {
  const { box, Icon } = TONE[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 ${box} ${className}`} {...rest}>
      <Icon size={20} aria-hidden="true" className="mt-px shrink-0" />
      <div className="min-w-0 grow">
        <p className="text-sm font-semibold leading-[22px]">{title}</p>
        {description && <div className="text-sm leading-[22px]">{description}</div>}
        {action && <div className="mt-1 text-sm">{action}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss" className="-my-2.5 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-sm">
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
