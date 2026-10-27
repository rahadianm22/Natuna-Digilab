"use client";

import { useState, type ReactNode } from "react";

export type ButtonGroupSize = "md" | "lg";

export interface ButtonGroupOption {
  value: string;
  label: string;
  icon?: ReactNode;
  /** Show only the icon. The label still names the button for screen readers. */
  iconOnly?: boolean;
  disabled?: boolean;
}

export interface ButtonGroupProps {
  /** Names the group for screen readers, such as "View". */
  label: string;
  options: ButtonGroupOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: ButtonGroupSize;
  /** Stretch to the container, with equal segments. */
  fullWidth?: boolean;
  className?: string;
}

const SIZE: Record<ButtonGroupSize, string> = { md: "min-h-11 px-4 text-sm", lg: "min-h-12 px-5 text-base" };
const ICON_ONLY: Record<ButtonGroupSize, string> = { md: "min-h-11 min-w-11 px-0", lg: "min-h-12 min-w-12 px-0" };

/**
 * Two to four related choices joined into one control, such as Grid and List. One is always chosen.
 * Each segment is a toggle button with aria-pressed, so Tab reaches each one.
 */
export function ButtonGroup({ label, options, value, defaultValue, onChange, size = "md", fullWidth = false, className = "" }: ButtonGroupProps) {
  const [inner, setInner] = useState(defaultValue ?? options.find((o) => !o.disabled)?.value);
  const current = value ?? inner;

  return (
    <div
      role="group"
      aria-label={label}
      className={`${fullWidth ? "flex w-full" : "inline-flex"} overflow-hidden rounded-md border border-role-border-input bg-role-bg-surface ${className}`}
    >
      {options.map((o, i) => {
        const on = o.value === current;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            aria-label={o.iconOnly ? o.label : undefined}
            disabled={o.disabled}
            onClick={() => {
              if (value === undefined) setInner(o.value);
              onChange?.(o.value);
            }}
            className={`inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:text-role-text-disabled ${
              o.iconOnly ? ICON_ONLY[size] : SIZE[size]
            } ${fullWidth ? "flex-1" : ""} ${i > 0 ? "border-l border-role-border-input" : ""} ${
              on ? "bg-role-bg-brand text-role-text-on-brand" : "text-role-text-strong hover:bg-role-bg-hover disabled:hover:bg-transparent"
            }`}
          >
            {o.icon && (
              <span aria-hidden="true" className="inline-flex">
                {o.icon}
              </span>
            )}
            {!o.iconOnly && o.label}
          </button>
        );
      })}
    </div>
  );
}
