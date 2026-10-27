import { X } from "@phosphor-icons/react/ssr";
import type { HTMLAttributes, ReactNode } from "react";

export type ChipTone = "neutral" | "primary" | "success" | "warning" | "danger";
export type ChipType = "filled" | "outline";
export type ChipSize = "sm" | "md";

const FILLED: Record<ChipTone, string> = {
  neutral: "bg-role-bg-tone-neutral text-role-text-tone-neutral",
  primary: "bg-role-bg-tone-info text-role-text-tone-info",
  success: "bg-role-bg-tone-success text-role-text-tone-success",
  warning: "bg-role-bg-tone-warning text-role-text-tone-warning",
  danger: "bg-role-bg-tone-danger text-role-text-tone-danger",
};

const OUTLINE: Record<ChipTone, string> = {
  neutral: "border-role-border-input text-role-text-secondary",
  primary: "border-role-bg-brand text-role-text-link",
  success: "border-role-status-success text-role-status-success",
  warning: "border-role-status-warning text-role-status-warning",
  danger: "border-role-border-danger text-role-text-danger",
};

// Height 24 or 32. The remove button is 44px square around its 12px icon, pulled into the chip's padding.
const SIZE: Record<ChipSize, string> = { sm: "h-6 pl-1.5 pr-1.5 text-xs", md: "h-8 pl-2.5 pr-2.5 text-sm" };

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** The visible text. Also names the remove button. */
  label: string;
  tone?: ChipTone;
  type?: ChipType;
  size?: ChipSize;
  /** Decorative icon before the label. */
  icon?: ReactNode;
  /** Shows the remove button. Leave out for a chip that cannot be removed. */
  onRemove?: () => void;
}

/** Unlike Badge, which only labels, a Chip stands for a choice the user made and can remove, such as an active filter. */
export function Chip({ label, tone = "neutral", type = "filled", size = "md", icon, onRemove, className = "", ...rest }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${SIZE[size]} ${type === "outline" ? `border ${OUTLINE[tone]}` : FILLED[tone]} ${className}`}
      {...rest}
    >
      {icon && <span aria-hidden="true" className="inline-flex">{icon}</span>}
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="-my-3 -mr-3.5 inline-flex size-11 shrink-0 items-center justify-center rounded-full"
        >
          <span className="flex size-5 items-center justify-center rounded-full hover:bg-role-text-primary/10">
            <X size={12} weight="bold" aria-hidden="true" />
          </span>
        </button>
      )}
    </span>
  );
}
