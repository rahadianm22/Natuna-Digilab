import type { LabelHTMLAttributes, ReactNode } from "react";

export type LabelTextSize = "sm" | "md" | "lg";
export type LabelTextIndicator = "none" | "required" | "optional";

export interface LabelTextProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: LabelTextSize;
  /** Required and optional are mutually exclusive, so this is one prop, not two. */
  indicator?: LabelTextIndicator;
  error?: boolean;
  /** Muted look for a disabled field. Set the native disabled attribute on the field too. */
  disabled?: boolean;
  /** Info icon after the label. Pass an icon element. It is decorative, so explain the field in a hint instead. */
  icon?: ReactNode;
}

const sizes: Record<LabelTextSize, string> = {
  sm: "text-xs leading-[18px]",
  md: "text-sm leading-[22px]",
  lg: "text-base leading-6",
};

/** A form label. Pass htmlFor so it names its field. Disabled is a styling concern, so use aria-disabled on the field too. */
export function LabelText({ size = "md", indicator = "none", error = false, disabled = false, icon, className = "", children, ...rest }: LabelTextProps) {
  return (
    <label
      className={`inline-flex items-center gap-1 font-normal ${sizes[size]} ${disabled ? "text-role-text-disabled" : error ? "text-role-text-danger" : "text-role-text-primary"} ${className}`}
      {...rest}
    >
      {children}
      {indicator === "required" && (
        <span aria-hidden="true" className="text-role-text-danger">
          *
        </span>
      )}
      {indicator === "optional" && <span className="text-xs text-role-text-secondary">(optional)</span>}
      {icon && <span aria-hidden="true" className="inline-flex">{icon}</span>}
    </label>
  );
}
