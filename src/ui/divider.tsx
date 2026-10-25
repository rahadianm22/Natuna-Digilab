import type { HTMLAttributes, ReactNode } from "react";

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Text in the middle, such as "or". */
  label?: string;
  /** An icon in the middle. Ignored when there is a label. Decorative. */
  icon?: ReactNode;
  size?: "sm" | "md";
}

/**
 * A separator with centered content. For a plain line, use Separator: the scope of the two is still to be decided,
 * and the design file recommends merging them once it is.
 */
export function Divider({ label, icon, size = "md", className = "", ...rest }: DividerProps) {
  const line = "h-px grow bg-role-border-default";
  const text = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div role="separator" aria-label={label} className={`flex items-center gap-3 ${className}`} {...rest}>
      <span aria-hidden="true" className={line} />
      {(label || icon) && (
        <span aria-hidden="true" className={`inline-flex ${text} text-role-text-secondary`}>
          {label ?? icon}
        </span>
      )}
      {(label || icon) && <span aria-hidden="true" className={line} />}
    </div>
  );
}
