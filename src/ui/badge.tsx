import type { HTMLAttributes } from "react";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-role-bg-tone-neutral text-role-text-tone-neutral",
  info: "bg-role-bg-tone-info text-role-text-tone-info",
  success: "bg-role-bg-tone-success text-role-text-tone-success",
  warning: "bg-role-bg-tone-warning text-role-text-tone-warning",
  danger: "bg-role-bg-tone-danger text-role-text-tone-danger",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

/** The label is the meaning; the color only reinforces it, so always pass text. */
export function Badge({ tone = "neutral", className = "", ...rest }: BadgeProps) {
  return <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`} {...rest} />;
}
