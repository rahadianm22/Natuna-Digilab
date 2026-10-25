import { useId } from "react";
import { RadioButton, type RadioButtonSize } from "./radio-button";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  /** Names the group. It is the fieldset legend. */
  label: string;
  options: RadioOption[];
  /** Controlled value. Pass onChange with it. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
  size?: RadioButtonSize;
  hint?: string;
  /** Error message. The error state passes to every option, and it replaces the hint. */
  error?: string;
  disabled?: boolean;
  /** Form field name. Generated when left out. */
  name?: string;
  className?: string;
}

/** One active choice per group. The browser keeps that rule because every option shares the name. */
export function RadioGroup({ label, options, value, defaultValue, onChange, orientation = "vertical", size = "md", hint, error, disabled, name, className = "" }: RadioGroupProps) {
  const id = useId();
  const note = error ?? hint;

  return (
    <fieldset disabled={disabled} aria-describedby={note ? `${id}-note` : undefined} className={`m-0 min-w-0 border-0 p-0 ${className}`}>
      <legend className="mb-2 p-0 text-sm font-medium text-role-text-primary">{label}</legend>
      <div className={orientation === "horizontal" ? "flex flex-wrap gap-4" : "flex flex-col gap-2"}>
        {options.map((o) => (
          <RadioButton
            key={o.value}
            size={size}
            name={name ?? id}
            value={o.value}
            label={o.label}
            // Only the error look passes down. The message is shown once, under the group.
            invalid={!!error}
            {...(value !== undefined ? { checked: value === o.value } : { defaultChecked: defaultValue === o.value })}
            onChange={() => onChange?.(o.value)}
          />
        ))}
      </div>
      {note && (
        <p id={`${id}-note`} className={`mt-2 text-xs leading-[18px] ${error ? "text-role-text-danger" : "text-role-text-secondary"}`}>
          {note}
        </p>
      )}
    </fieldset>
  );
}
