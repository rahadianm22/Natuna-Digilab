import type { HTMLAttributes } from "react";

export type AvatarSize = "sm" | "md" | "lg";

const sizes: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Full name. Initials are derived from it and it becomes the accessible name. */
  name: string;
  size?: AvatarSize;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : [parts[0] ?? ""];
  return letters.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

/** Initials fallback only. Photos are not supported yet. */
export function Avatar({ name, size = "md", className = "", ...rest }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-role-bg-tone-info font-semibold text-role-text-tone-info ${sizes[size]} ${className}`}
      {...rest}
    >
      <span aria-hidden="true">{initials(name)}</span>
    </span>
  );
}
