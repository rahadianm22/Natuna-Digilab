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
      <label htmlFor={id} className="text-xs font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        // Border and focus ring both clear 3:1 against the surface (WCAG 1.4.11), in light and dark.
        className={`min-h-11 rounded-md border bg-surface px-3 text-sm text-gray-900 placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500 sm:min-h-10 ${
          error ? "border-red-700 focus-visible:ring-red-700" : "border-gray-500 focus-visible:border-blue-600 focus-visible:ring-blue-600"
        } ${className}`}
        {...rest}
      />
      {(error || hint) && (
        <p id={`${id}-note`} className={`text-xs ${error ? "text-red-700" : "text-gray-600"}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
