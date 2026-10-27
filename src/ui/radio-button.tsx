import { useId, type InputHTMLAttributes } from "react";

export type RadioButtonSize = "sm" | "md" | "lg";

export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "size"> {
  /** Visible label. Required, so every radio button has an accessible name. */
  label: string;
  /** Helper text under the label. */
  hint?: string;
  /** Error message. Setting it marks the field invalid and replaces the hint. */
  error?: string;
  /** The error look without a message, for a group that shows one message for all its options. */
  invalid?: boolean;
  size?: RadioButtonSize;
}

// Circle, dot, hit area, and label text per Figma size sm / md / lg. The input is 44px square around the circle.
const SIZES: Record<RadioButtonSize, { circle: string; dot: string; hit: string; label: string }> = {
  sm: { circle: "size-4", dot: "size-1.5", hit: "-inset-3.5", label: "text-xs leading-[18px]" },
  md: { circle: "size-5", dot: "size-2", hit: "-inset-3", label: "text-sm leading-[22px]" },
  lg: { circle: "size-6", dot: "size-2.5", hit: "-inset-2.5", label: "text-base leading-6" },
};

/**
 * One option. Mutually exclusive selection comes from sharing a name across several of these,
 * which is what the Radio Group does.
 */
export function RadioButton({ label, hint, error, invalid, size = "sm", className = "", disabled, ...rest }: RadioButtonProps) {
  const id = useId();
  const s = SIZES[size];
  const note = error ?? hint;
  const bad = invalid || !!error;

  const edge = bad
    ? "border-role-border-danger peer-checked:[&>span]:bg-role-bg-danger"
    : "border-role-border-input peer-hover:border-role-border-focus peer-hover:bg-role-bg-hover peer-checked:border-role-bg-brand peer-checked:[&>span]:bg-role-bg-brand";

  return (
    <div className={`flex min-h-11 gap-2 ${note ? "items-start pt-2.5" : "items-center"} ${className}`}>
      <span className={`relative shrink-0 ${s.circle}`}>
        <input
          id={id}
          type="radio"
          disabled={disabled}
          aria-describedby={note ? `${id}-note` : undefined}
          className={`peer absolute m-0 cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed ${s.hit}`}
          {...rest}
        />
        {/* The circle, and inside it the dot. The input is transparent and only takes the clicks and the focus. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none flex items-center justify-center rounded-full border bg-role-bg-surface peer-checked:[&>span]:opacity-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-role-border-focus peer-disabled:border-role-border-disabled peer-disabled:bg-role-bg-subtle peer-disabled:peer-checked:[&>span]:bg-role-border-disabled ${s.circle} ${edge}`}
        >
          <span className={`rounded-full opacity-0 transition-opacity ${s.dot}`} />
        </span>
      </span>
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className={`${s.label} ${disabled ? "text-role-text-disabled" : "cursor-pointer text-role-text-primary"}`}>
          {label}
        </label>
        {note && (
          <p id={`${id}-note`} className={`text-xs leading-[18px] ${error ? "text-role-text-danger" : disabled ? "text-role-text-disabled" : "text-role-text-secondary"}`}>
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
