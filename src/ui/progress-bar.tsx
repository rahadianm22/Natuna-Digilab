import type { HTMLAttributes } from "react";

export type ProgressTone = "primary" | "success" | "warning" | "danger";

// Fills use the status text roles, not the solid ones: a fill is a graphic and needs 3:1 on the track in both modes.
const FILL: Record<ProgressTone, string> = {
  primary: "bg-role-bg-brand",
  success: "bg-role-status-success",
  warning: "bg-role-status-warning",
  danger: "bg-role-bg-danger",
};

const STROKE: Record<ProgressTone, string> = {
  primary: "stroke-role-bg-brand",
  success: "stroke-role-status-success",
  warning: "stroke-role-status-warning",
  danger: "stroke-role-bg-danger",
};

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Names what is progressing. Also the visible label unless showLabel is false. */
  label: string;
  type?: "linear" | "circular";
  /** Indeterminate is a process with no known duration. */
  mode?: "determinate" | "indeterminate";
  tone?: ProgressTone;
  /** 0 to 100. Ignored when indeterminate. */
  value?: number;
  showLabel?: boolean;
  showValue?: boolean;
}

const R = 22;
const C = 2 * Math.PI * R;

export function ProgressBar({ label, type = "linear", mode = "determinate", tone = "primary", value = 0, showLabel = true, showValue = true, className = "", ...rest }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  const indeterminate = mode === "indeterminate";
  const aria = {
    role: "progressbar" as const,
    "aria-label": label,
    "aria-valuemin": indeterminate ? undefined : 0,
    "aria-valuemax": indeterminate ? undefined : 100,
    "aria-valuenow": indeterminate ? undefined : pct,
  };

  if (type === "circular") {
    return (
      <div className={`inline-flex flex-col items-start gap-1 ${className}`} {...rest}>
        <div {...aria} className="relative size-12">
          <svg viewBox="0 0 48 48" className={`size-12 -rotate-90 ${indeterminate ? "motion-safe:animate-spin" : ""}`} aria-hidden="true">
            <circle cx="24" cy="24" r={R} fill="none" strokeWidth="4" className="stroke-role-bg-subtle" />
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - (indeterminate ? 0.3 : pct / 100))}
              className={STROKE[tone]}
            />
          </svg>
          {showValue && !indeterminate && (
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-xs font-medium text-role-text-primary">
              {pct}%
            </span>
          )}
        </div>
        {showLabel && <span className="text-sm text-role-text-secondary">{label}</span>}
      </div>
    );
  }

  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`} {...rest}>
      {(showLabel || (showValue && !indeterminate)) && (
        <div className="flex justify-between text-sm text-role-text-secondary">
          {showLabel ? <span>{label}</span> : <span />}
          {showValue && !indeterminate && <span className="font-medium text-role-text-primary">{pct}%</span>}
        </div>
      )}
      <div {...aria} className="h-1.5 w-full overflow-hidden rounded-full bg-role-bg-subtle">
        <div
          className={`h-full rounded-full ${FILL[tone]} ${indeterminate ? "w-[30%] motion-safe:animate-[nd-indeterminate_1.4s_ease-in-out_infinite]" : ""}`}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
