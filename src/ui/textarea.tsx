"use client";

import { useId, useState, type ChangeEvent, type TextareaHTMLAttributes } from "react";

export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  /** Visible label. Required, because a placeholder is not a label. */
  label: string;
  hint?: string;
  /** Error message. Setting it marks the field invalid and replaces the hint. */
  error?: string;
  size?: TextareaSize;
  /** Shows used/max under the field. Needs maxLength. */
  showCounter?: boolean;
}

// Height 64, 88, 120: about three, four and five lines of 16px body text.
const HEIGHT: Record<TextareaSize, string> = { sm: "min-h-16", md: "min-h-[88px]", lg: "min-h-[120px]" };

/** Multi-line input for notes and long descriptions. Same tokens and states as Input. */
export function Textarea({ label, hint, error, size = "md", showCounter = true, maxLength, className = "", value, defaultValue, onChange, ...rest }: TextareaProps) {
  const id = useId();
  const [inner, setInner] = useState(String(defaultValue ?? ""));
  const length = String(value ?? inner).length;
  const note = error ?? hint;
  const counter = showCounter && maxLength !== undefined;

  function handle(e: ChangeEvent<HTMLTextAreaElement>) {
    if (value === undefined) setInner(e.target.value);
    onChange?.(e);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-role-text-primary">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={handle}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={note || counter ? `${id}-note` : undefined}
        className={`w-full resize-y rounded-md border bg-role-bg-surface px-3 py-2.5 text-base leading-6 text-role-text-primary placeholder:text-role-text-secondary hover:bg-role-bg-hover disabled:cursor-not-allowed disabled:border-role-border-disabled disabled:bg-role-bg-subtle disabled:text-role-text-disabled ${HEIGHT[size]} ${
          error ? "border-role-border-danger focus-visible:outline-role-border-danger" : "border-role-border-input focus-visible:border-role-border-focus"
        } ${className}`}
        {...rest}
      />
      {(note || counter) && (
        <div id={`${id}-note`} className="flex justify-between gap-4 text-xs leading-[18px]">
          <span className={error ? "text-role-text-danger" : "text-role-text-secondary"}>{note}</span>
          {counter && (
            <span className="shrink-0 tabular-nums text-role-text-secondary">
              {length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
