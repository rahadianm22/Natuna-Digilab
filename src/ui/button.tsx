import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[color,background-color,border-color,transform] duration-100 ease-out active:scale-[0.97] disabled:active:scale-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:border-transparent";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  ghost: "border border-gray-300 text-gray-800 hover:bg-gray-50",
  destructive: "bg-danger text-white hover:bg-red-800",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-10 px-4 text-sm",
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
      className={`${buttonStyles({ variant, size })} ${className}`}
      {...rest}
    >
      {loading && (
        <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
