import { ArrowsClockwise, CheckCircle, Sparkle, Warning } from "@phosphor-icons/react/ssr";
import type { HTMLAttributes } from "react";

export type ChangelogType = "added" | "improved" | "fixed" | "deprecated";

// Icon and tone are locked per type: added success, improved primary, fixed neutral, deprecated warning.
const TYPES: Record<ChangelogType, { Icon: typeof Sparkle; chip: string }> = {
  added: { Icon: Sparkle, chip: "bg-role-bg-tone-success text-role-text-tone-success" },
  improved: { Icon: ArrowsClockwise, chip: "bg-role-bg-tone-info text-role-text-tone-info" },
  fixed: { Icon: CheckCircle, chip: "bg-role-bg-tone-neutral text-role-text-tone-neutral" },
  deprecated: { Icon: Warning, chip: "bg-role-bg-tone-warning text-role-text-tone-warning" },
};

export interface ChangelogProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  type?: ChangelogType;
  /** product shows the end-user action; system shows which components are affected. */
  scope?: "product" | "system";
  version: string;
  timestamp: string;
  title: string;
  description?: string;
  /** Components touched. System scope only. */
  affects?: string[];
  actionLabel?: string;
  actionHref?: string;
  /** Vertical line to the next entry. Turn it off for the last one. */
  connector?: boolean;
}

export function Changelog({ type = "added", scope = "product", version, timestamp, title, description, affects, actionLabel, actionHref, connector = true, className = "", ...rest }: ChangelogProps) {
  const { Icon, chip } = TYPES[type];

  return (
    <article className={`flex gap-3 ${className}`} {...rest}>
      <div className="flex flex-col items-center gap-1">
        <span aria-hidden="true" className={`flex size-6 shrink-0 items-center justify-center rounded-full ${chip}`}>
          <Icon size={14} />
        </span>
        {connector && <span aria-hidden="true" className="w-px grow bg-role-border-default" />}
      </div>
      <div className={`flex min-w-0 flex-col gap-1 ${connector ? "pb-6" : ""}`}>
        <p className="flex items-center gap-2 text-xs leading-[18px] text-role-text-secondary">
          <span className="rounded-sm bg-role-bg-subtle px-1.5 text-role-text-secondary">{version}</span>
          {timestamp}
          <span className="sr-only">, {type}</span>
        </p>
        <h3 className="text-sm font-semibold leading-[22px] text-role-text-primary">{title}</h3>
        {description && <p className="text-xs leading-[18px] text-role-text-secondary">{description}</p>}
        {scope === "product" && actionLabel && (
          <a href={actionHref} className="inline-flex min-h-11 w-fit items-center text-xs leading-[18px] text-role-text-link">{actionLabel}</a>
        )}
        {scope === "system" && affects && affects.length > 0 && (
          <p className="text-xs leading-[18px] text-role-text-secondary">Affects: {affects.join(", ")}</p>
        )}
      </div>
    </article>
  );
}
