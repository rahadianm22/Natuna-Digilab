import { useId, type InputHTMLAttributes } from "react";

export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "size" | "role"> {
  /** Visible label. Required, so every toggle has an accessible name. */
  label: string;
  /** Helper text under the label. */
  hint?: string;
  size?: ToggleSize;
}

// Track 28x16, 36x20, 44x24. The knob is track height minus 8 when off and minus 4 when on.
// The input is the 44px hit area around the track; the visible track and knob are the sibling after it.
const SIZES: Record<ToggleSize, { track: string; hit: string; off: string; on: string; label: string }> = {
  sm: { track: "h-4 w-7", hit: "-inset-x-2 -inset-y-3.5", off: "size-2", on: "peer-checked:[&>span]:size-3", label: "text-xs leading-[18px]" },
  md: { track: "h-5 w-9", hit: "-inset-x-1 -inset-y-3", off: "size-3", on: "peer-checked:[&>span]:size-4", label: "text-sm leading-[22px]" },
  lg: { track: "h-6 w-11", hit: "-inset-y-2.5", off: "size-4", on: "peer-checked:[&>span]:size-5", label: "text-base leading-6" },
};

/** An on/off setting that applies at once. It has no error state: a setting that can fail validation is a field. */
export function Toggle({ label, hint, size = "sm", className = "", disabled, ...rest }: ToggleProps) {
  const id = useId();
  const s = SIZES[size];

  return (
    <div className={`flex min-h-11 gap-2 ${hint ? "items-start pt-2.5" : "items-center"} ${className}`}>
      <span className={`relative shrink-0 ${s.track}`}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          disabled={disabled}
          aria-describedby={hint ? `${id}-note` : undefined}
          className={`peer absolute m-0 cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed ${s.hit}`}
          {...rest}
        />
        {/* Off sits at the start, on at the end, by alignment and not by coordinates. The knob is the only child. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none flex h-full w-full items-center rounded-full border border-role-border-input bg-role-bg-surface px-0.5 transition-colors peer-hover:border-role-border-focus peer-checked:justify-end peer-checked:border-role-bg-brand peer-checked:bg-role-bg-brand peer-checked:peer-hover:bg-role-bg-brand-hover peer-checked:[&>span]:bg-role-text-on-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-role-border-focus peer-disabled:border-role-border-disabled peer-disabled:bg-role-bg-subtle peer-disabled:[&>span]:bg-role-border-disabled peer-disabled:peer-checked:bg-role-border-disabled peer-disabled:peer-checked:[&>span]:bg-role-text-on-brand ${s.on}`}
        >
          <span className={`rounded-full bg-role-text-tertiary ${s.off}`} />
        </span>
      </span>
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className={`${s.label} ${disabled ? "text-role-text-disabled" : "cursor-pointer text-role-text-primary"}`}>
          {label}
        </label>
        {hint && (
          <p id={`${id}-note`} className={`text-xs leading-[18px] ${disabled ? "text-role-text-disabled" : "text-role-text-secondary"}`}>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
