import { Image as ImageIcon, MagnifyingGlass, Tray, WarningCircle } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

export type EmptyStateScope = "search" | "list" | "error" | "custom";
export type EmptyStateSize = "sm" | "md" | "lg";

const ICON = { search: MagnifyingGlass, list: Tray, error: WarningCircle, custom: ImageIcon };

// Icon in a 48, 64 or 80 circle.
const CIRCLE: Record<EmptyStateSize, { box: string; icon: number; title: string }> = {
  sm: { box: "size-12", icon: 22, title: "text-base leading-6" },
  md: { box: "size-16", icon: 30, title: "text-lg leading-7" },
  lg: { box: "size-20", icon: 38, title: "text-xl leading-[30px]" },
};

export interface EmptyStateProps {
  title: string;
  description?: string;
  scope?: EmptyStateScope;
  size?: EmptyStateSize;
  /** Replaces the scope icon. Custom scope uses it. */
  icon?: ReactNode;
  /** One action at most, such as a secondary Button. */
  action?: ReactNode;
  /** Show the icon circle. */
  showImage?: boolean;
  className?: string;
}

/** For a screen or list with no data: empty search results, nothing yet, or a failed load. */
export function EmptyState({ title, description, scope = "list", size = "md", icon, action, showImage = true, className = "" }: EmptyStateProps) {
  const c = CIRCLE[size];
  const Icon = ICON[scope];
  const error = scope === "error";

  return (
    <div className={`flex flex-col items-center gap-2 p-6 text-center ${className}`}>
      {showImage && (
        <span
          aria-hidden="true"
          className={`mb-1 flex items-center justify-center rounded-full ${c.box} ${error ? "bg-role-bg-tone-danger text-role-text-tone-danger" : "bg-role-bg-subtle text-role-text-secondary"}`}
        >
          {icon ?? <Icon size={c.icon} />}
        </span>
      )}
      <h3 className={`font-semibold text-role-text-primary ${c.title}`}>{title}</h3>
      {description && <p className="max-w-[280px] text-sm leading-[22px] text-role-text-secondary">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
