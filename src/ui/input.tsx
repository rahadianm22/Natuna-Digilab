import { useId, type InputHTMLAttributes } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  /** Visible label. Required, because a placeholder is not a label. */
  label: string;
  hint?: string;
  /** Error message. Setting it marks the field invalid and replaces the hint. */
  error?: string;
}

export function Input({ label, hint, error, className = "", ...rest }: InputProps) {
  const id = useId();
  const describedBy = error || hint ? `${id}-note` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-role-text-secondary">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        // Border and focus ring both clear 3:1 against the surface (WCAG 1.4.11), in light and dark.
        className={`min-h-11 rounded-md border bg-role-bg-surface px-3 text-sm text-role-text-primary placeholder:text-role-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-role-bg-surface disabled:border-role-border-disabled disabled:bg-role-bg-subtle disabled:text-role-text-disabled ${
          error ? "border-role-border-danger focus-visible:ring-role-border-danger" : "border-role-border-input focus-visible:border-role-border-focus focus-visible:ring-role-border-focus"
        } ${className}`}
        {...rest}
      />
      {(error || hint) && (
        <p id={`${id}-note`} className={`text-xs ${error ? "text-role-text-danger" : "text-role-text-secondary"}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
