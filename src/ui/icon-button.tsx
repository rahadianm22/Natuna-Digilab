import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonBase, buttonUnavailable, buttonVariants, type ButtonVariant } from "./button";

export type IconButtonSize = "md" | "lg";
export type IconButtonShape = "square" | "circle";

// 44 and 48 square, so both sizes are full touch targets.
const SIZE: Record<IconButtonSize, string> = { md: "size-11", lg: "size-12" };

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  /** The accessible name. Required, because there is no visible text. */
  label: string;
  /** The icon. It is hidden from screen readers; the label names the button. */
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: IconButtonSize;
  shape?: IconButtonShape;
  /** Shows a spinner in place of the icon and blocks clicks. */
  loading?: boolean;
}

/** A button with only an icon, for toolbars and dense rows. Wrap it in a Tooltip when the icon is not obvious. */
export function IconButton({ label, icon, variant = "ghost", size = "md", shape = "square", loading = false, disabled, className = "", type = "button", onClick, ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      className={`${buttonBase} ${buttonVariants[variant]} ${SIZE[size]} shrink-0 p-0 ${shape === "circle" ? "rounded-full!" : ""} ${loading ? "cursor-progress" : buttonUnavailable} ${className}`}
      {...rest}
    >
      {loading ? (
        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      )}
    </button>
  );
}
