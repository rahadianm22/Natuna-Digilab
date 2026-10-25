import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "neutral" | "primary" | "secondary" | "info" | "success" | "warning" | "danger";
export type BadgeType = "solid" | "subtle" | "outline";
export type BadgeSize = "sm" | "md";

// info is the older name for primary and keeps working. Classes are written out in full so Tailwind can see them.
const subtle: Record<BadgeTone, string> = {
  neutral: "bg-role-bg-tone-neutral text-role-text-tone-neutral",
  primary: "bg-role-bg-tone-info text-role-text-tone-info",
  secondary: "bg-role-bg-tone-info text-role-text-tone-info",
  info: "bg-role-bg-tone-info text-role-text-tone-info",
  success: "bg-role-bg-tone-success text-role-text-tone-success",
  warning: "bg-role-bg-tone-warning text-role-text-tone-warning",
  danger: "bg-role-bg-tone-danger text-role-text-tone-danger",
};

const solid: Record<BadgeTone, string> = {
  neutral: "bg-role-text-primary text-role-bg-surface",
  primary: "bg-role-bg-brand text-role-text-on-brand",
  secondary: "bg-role-bg-brand-hover text-role-text-on-brand",
  info: "bg-role-bg-brand text-role-text-on-brand",
  success: "bg-role-status-solid-success text-role-text-on-accent",
  warning: "bg-role-status-solid-warning text-role-text-on-accent",
  danger: "bg-role-bg-danger text-role-text-on-danger",
};

const outline: Record<BadgeTone, string> = {
  neutral: "border-role-border-input text-role-text-secondary",
  primary: "border-role-bg-brand text-role-text-link",
  secondary: "border-role-bg-brand-hover text-role-text-link",
  info: "border-role-bg-brand text-role-text-link",
  success: "border-role-status-success text-role-status-success",
  warning: "border-role-status-warning text-role-status-warning",
  danger: "border-role-border-danger text-role-text-danger",
};

const types: Record<BadgeType, Record<BadgeTone, string>> = { subtle, solid, outline };

const sizes: Record<BadgeSize, string> = {
  sm: "min-h-4 px-1.5 text-xs leading-4",
  md: "min-h-5 px-2 text-xs leading-5",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  type?: BadgeType;
  size?: BadgeSize;
  /** Decorative icon before the label. Hidden from screen readers. */
  iconLeft?: ReactNode;
  /** Decorative icon after the label. Hidden from screen readers. */
  iconRight?: ReactNode;
}

/** The label is the meaning; the color only reinforces it, so always pass text. */
export function Badge({ tone = "neutral", type = "subtle", size = "md", iconLeft, iconRight, className = "", children, ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${type === "outline" ? "border" : ""} ${sizes[size]} ${types[type][tone]} ${className}`}
      {...rest}
    >
      {iconLeft && <span aria-hidden="true" className="inline-flex">{iconLeft}</span>}
      {children}
      {iconRight && <span aria-hidden="true" className="inline-flex">{iconRight}</span>}
    </span>
  );
}
