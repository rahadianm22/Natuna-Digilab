import { CaretDown } from "@phosphor-icons/react/ssr";
import { useId, type SelectHTMLAttributes } from "react";

export type SelectSize = "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "size"> {
  /** Visible label. Required, because a placeholder is not a label. */
  label: string;
  options: SelectOption[];
  /** Shown while nothing is chosen. It cannot be chosen back. */
  placeholder?: string;
  hint?: string;
  /** Error message. Setting it marks the field invalid and replaces the hint. */
  error?: string;
  size?: SelectSize;
}

const SIZE: Record<SelectSize, string> = { md: "min-h-11 text-sm", lg: "min-h-12 text-base" };

/**
 * A native select in Foundation styling, so the option list is the platform's own: a wheel on iOS, a sheet on
 * Android, a list on desktop. For long lists that need typing to filter, use Combobox.
 */
export function Select({ label, options, placeholder, hint, error, size = "md", disabled, className = "", defaultValue, value, ...rest }: SelectProps) {
  const id = useId();
  const note = error ?? hint;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className={`text-sm font-medium ${disabled ? "text-role-text-disabled" : "text-role-text-primary"}`}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          disabled={disabled}
          value={value}
          // With a placeholder and no value, start on the empty option.
          defaultValue={value === undefined ? (defaultValue ?? (placeholder ? "" : undefined)) : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? `${id}-note` : undefined}
          className={`w-full appearance-none rounded-md border bg-role-bg-surface pl-3 pr-10 text-role-text-primary has-[option[value='']:checked]:text-role-text-secondary [&>option]:text-role-text-primary disabled:cursor-not-allowed disabled:border-role-border-disabled disabled:bg-role-bg-subtle disabled:text-role-text-disabled ${SIZE[size]} ${
            error ? "border-role-border-danger focus-visible:outline-role-border-danger" : "border-role-border-input hover:bg-role-bg-hover focus-visible:border-role-border-focus"
          }`}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <CaretDown
          size={16}
          aria-hidden="true"
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${disabled ? "text-role-text-disabled" : "text-role-text-secondary"}`}
        />
      </div>
      {note && (
        <p id={`${id}-note`} className={`text-xs leading-[18px] ${error ? "text-role-text-danger" : "text-role-text-secondary"}`}>
          {note}
        </p>
      )}
    </div>
  );
}
