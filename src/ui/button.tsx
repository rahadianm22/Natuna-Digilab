import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[color,background-color,border-color,transform] duration-100 ease-out active:scale-[0.97] disabled:active:scale-100";

// Unavailable reads as gray. A loading button is busy, not unavailable, so it keeps its variant color.
const unavailable = "disabled:cursor-not-allowed disabled:bg-role-bg-subtle disabled:text-role-text-disabled disabled:border-transparent";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-role-bg-brand text-role-text-on-brand hover:bg-role-bg-brand-hover",
  secondary: "border border-role-border-input bg-role-bg-subtle text-role-text-strong hover:bg-role-bg-subtle-hover hover:text-role-text-strong-hover",
  ghost: "border border-role-border-input text-role-text-strong hover:bg-role-bg-hover hover:text-role-text-strong-hover",
  // Fills that carry white text keep the same value in both modes.
  destructive: "bg-role-bg-danger text-role-text-on-brand hover:bg-role-bg-danger-hover",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

/** Class names for anything that has to look like a button but is a link. */
export function buttonStyles({ variant = "primary", size = "md" }: { variant?: ButtonVariant; size?: ButtonSize } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks clicks while keeping the label, so the width does not jump. */
  loading?: boolean;
}

export function Button({ variant = "primary", size = "md", loading = false, disabled, className = "", children, type = "button", onClick, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      // Loading uses aria-disabled, not disabled: a natively disabled button drops keyboard focus to the page.
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      // A loading button with nothing to block gets no handler, so it can render as static server HTML.
      onClick={loading ? (onClick || type !== "button" ? (e) => e.preventDefault() : undefined) : onClick}
      className={`${buttonStyles({ variant, size })} relative ${loading ? "cursor-progress" : unavailable} ${className}`}
      {...rest}
    >
      {/* The label stays in the layout (transparent, still announced), so the button keeps its width and its neighbours stay put. */}
      <span className={loading ? "inline-flex items-center gap-2 opacity-0" : "contents"}>{children}</span>
      {loading && (
        <span aria-hidden="true" className="absolute inset-0 m-auto h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
    </button>
  );
}
