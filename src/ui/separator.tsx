import type { HTMLAttributes } from "react";

export type SeparatorWeight = "subtle" | "default" | "strong";

export interface SeparatorProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  orientation?: "horizontal" | "vertical";
  /** Weight of the line: subtle is faint, strong is 2px. */
  weight?: SeparatorWeight;
  /** Text centered on a horizontal line, such as "or". Ignored when vertical. */
  label?: string;
}

const line: Record<SeparatorWeight, string> = {
  subtle: "bg-role-border-default/60",
  default: "bg-role-border-default",
  strong: "bg-role-border-input",
};

const thickness: Record<SeparatorWeight, { h: string; v: string }> = {
  subtle: { h: "h-px", v: "w-px" },
  default: { h: "h-px", v: "w-px" },
  strong: { h: "h-0.5", v: "w-0.5" },
};

/** A dividing line. With a label it reads as a divider in the content, so it keeps the separator role. */
export function Separator({ orientation = "horizontal", weight = "default", label, className = "", ...rest }: SeparatorProps) {
  const t = thickness[weight];

  if (orientation === "vertical") {
    return <div role="separator" aria-orientation="vertical" className={`self-stretch ${t.v} ${line[weight]} ${className}`} {...rest} />;
  }

  if (label) {
    return (
      <div role="separator" aria-label={label} className={`flex items-center gap-3 ${className}`} {...rest}>
        <span aria-hidden="true" className={`grow ${t.h} ${line[weight]}`} />
        <span aria-hidden="true" className="text-sm text-role-text-secondary">{label}</span>
        <span aria-hidden="true" className={`grow ${t.h} ${line[weight]}`} />
      </div>
    );
  }

  return <div role="separator" aria-orientation="horizontal" className={`w-full ${t.h} ${line[weight]} ${className}`} {...rest} />;
}
