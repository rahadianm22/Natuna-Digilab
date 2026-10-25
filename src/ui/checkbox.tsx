"use client";

import { useEffect, useId, useRef, type InputHTMLAttributes } from "react";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "size"> {
  /** Visible label. Required, so every checkbox has an accessible name. */
  label: string;
  /** Helper text under the label. */
  hint?: string;
  /** Error message. Setting it marks the field invalid and replaces the hint. */
  error?: string;
  size?: CheckboxSize;
  /** Partly selected. Only for a parent row whose children are partly selected, never a value a user can pick. */
  indeterminate?: boolean;
}

// Control box, glyph box, label text, per Figma size sm / md / lg.
const SIZES: Record<CheckboxSize, { box: string; glyph: string; hit: string; label: string }> = {
  sm: { box: "size-4", glyph: "size-3", hit: "-inset-3.5", label: "text-xs leading-[18px]" },
  md: { box: "size-5", glyph: "size-4", hit: "-inset-3", label: "text-sm leading-[22px]" },
  lg: { box: "size-6", glyph: "size-5", hit: "-inset-2.5", label: "text-base leading-6" },
};

export function Checkbox({ label, hint, error, size = "sm", indeterminate = false, className = "", disabled, ...rest }: CheckboxProps) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const s = SIZES[size];
  const note = error ?? hint;

  // indeterminate is a DOM property with no HTML attribute.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const idle = error ? "border-role-border-danger" : "border-role-border-input";
  // Written out in full so Tailwind can see every class.
  const on = error
    ? "peer-checked:bg-role-bg-danger peer-checked:border-role-border-danger peer-indeterminate:bg-role-bg-danger peer-indeterminate:border-role-border-danger"
    : "peer-checked:bg-role-bg-brand peer-checked:border-role-bg-brand peer-indeterminate:bg-role-bg-brand peer-indeterminate:border-role-bg-brand";

  return (
    <div className={`flex min-h-11 gap-2 ${note ? "items-start pt-2.5" : "items-center"} ${className}`}>
      <span className={`relative shrink-0 ${s.box}`}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? `${id}-note` : undefined}
          className={`peer absolute m-0 cursor-pointer appearance-none rounded-[2px] disabled:cursor-not-allowed ${s.hit}`}
          {...rest}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none flex items-center justify-center rounded-[2px] border bg-role-bg-surface ${s.box} ${idle} peer-hover:bg-role-bg-hover peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-role-border-focus ${on} peer-disabled:border-role-border-disabled peer-disabled:bg-role-bg-subtle peer-disabled:peer-checked:bg-role-border-disabled peer-disabled:peer-indeterminate:bg-role-border-disabled`}
        />
        {/* Glyphs come from the Figma file: check and minus, white, one file per size. */}
        <img
          alt=""
          src={`/checkbox/check-${size}.svg`}
          className={`pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 peer-checked:block peer-indeterminate:hidden ${s.glyph}`}
        />
        <img
          alt=""
          src={`/checkbox/minus-${size}.svg`}
          className={`pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 peer-indeterminate:block ${s.glyph}`}
        />
      </span>
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className={`${s.label} ${disabled ? "text-role-text-disabled" : "text-role-text-primary cursor-pointer"}`}>
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
