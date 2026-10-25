import { Heart, Star } from "@phosphor-icons/react/ssr";
import type { HTMLAttributes } from "react";

export type RatingType = "star" | "heart" | "number";

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The visual score, 1 to 5. */
  score: 1 | 2 | 3 | 4 | 5;
  type?: RatingType;
  /** The displayed average, such as 4,5. Formatted by the caller for the locale. */
  value?: string;
  showValue?: boolean;
  disabled?: boolean;
}

/** Display only. It shows a score, it does not collect one. */
export function Rating({ score, type = "star", value, showValue = true, disabled = false, className = "", ...rest }: RatingProps) {
  const Icon = type === "heart" ? Heart : Star;
  const on = disabled ? "text-role-text-disabled" : type === "heart" ? "text-role-bg-danger" : "text-role-status-warning";
  const off = disabled ? "text-role-border-disabled" : "text-role-border-input";
  const shown = value ?? `${score},0`;
  const label = `Rated ${value ?? score} out of 5`;

  if (type === "number") {
    return (
      <div role="img" aria-label={label} className={`inline-flex items-center gap-1 ${className}`} {...rest}>
        <Icon aria-hidden="true" size={16} weight="fill" className={on} />
        <span className={`text-base font-medium ${disabled ? "text-role-text-disabled" : "text-role-text-primary"}`}>{shown}</span>
        <span className="text-xs text-role-text-secondary">/ 5</span>
      </div>
    );
  }

  return (
    <div role="img" aria-label={label} className={`inline-flex items-center gap-1 ${className}`} {...rest}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} aria-hidden="true" size={16} weight={n <= score ? "fill" : "regular"} className={n <= score ? on : off} />
      ))}
      {showValue && <span className={`ml-1 text-sm font-medium ${disabled ? "text-role-text-disabled" : "text-role-text-primary"}`}>{shown}</span>}
    </div>
  );
}
