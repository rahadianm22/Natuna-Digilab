import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[color,background-color,border-color,transform] duration-100 ease-out active:scale-[0.97] disabled:active:scale-100";

// Unavailable reads as gray. A loading button is busy, not unavailable, so it keeps its variant color.
const unavailable = "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:border-transparent";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  ghost: "border border-gray-300 text-gray-800 hover:bg-gray-50",
  // Fixed hover tokens: the red ramp flips light in dark mode, which would leave white text on pale pink.
  destructive: "bg-danger text-white hover:bg-danger-hover",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-4 text-sm sm:min-h-10",
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

export function Button({ variant = "primary", size = "md", loading = false, disabled, className = "", children, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
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
