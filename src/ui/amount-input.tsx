"use client";

import { useId, useState } from "react";

export type AmountInputSize = "sm" | "md" | "lg";

// Field 40, 48, 56 tall; the sm field is drawn 44 so it stays a full touch target.
const HEIGHT: Record<AmountInputSize, string> = { sm: "min-h-11 text-base", md: "min-h-12 text-lg", lg: "min-h-14 text-xl" };

const fmt = new Intl.NumberFormat("id-ID");

export interface AmountInputProps {
  label: string;
  /** The amount in rupiah, or null when empty. */
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  size?: AmountInputSize;
  hint?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

/** A rupiah amount with the Rp prefix and id-ID thousands separators, formatted as the user types. */
export function AmountInput({ label, value, defaultValue = null, onChange, size = "md", hint, error, disabled, placeholder = "0", className = "" }: AmountInputProps) {
  const id = useId();
  const [inner, setInner] = useState<number | null>(defaultValue);
  const amount = value !== undefined ? value : inner;
  const note = error ?? hint;

  function set(text: string) {
    const digits = text.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    const next = digits ? Number(digits) : null;
    if (value === undefined) setInner(next);
    onChange?.(next);
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className={`text-sm font-medium ${disabled ? "text-role-text-disabled" : "text-role-text-primary"}`}>
        {label}
      </label>
      <div
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.querySelector("input")?.focus()}
        className={`flex items-center gap-1.5 rounded-md border px-3 ${HEIGHT[size]} ${
          disabled
            ? "border-role-border-disabled bg-role-bg-subtle"
            : error
              ? "border-role-border-danger bg-role-bg-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-role-border-danger"
              : "border-role-border-input bg-role-bg-surface hover:bg-role-bg-hover has-[:focus-visible]:border-role-border-focus has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-role-border-focus"
        }`}
      >
        <span aria-hidden="true" className="font-medium text-role-text-secondary">
          Rp
        </span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          value={amount === null ? "" : fmt.format(amount)}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => set(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? `${id}-note` : undefined}
          // The Rp prefix is visual only. Say rupiah in the label when the currency is not obvious from the page.
          className="-my-px min-w-0 grow self-stretch bg-transparent font-semibold tabular-nums text-role-text-primary outline-none placeholder:font-normal placeholder:text-role-text-secondary disabled:cursor-not-allowed disabled:text-role-text-disabled"
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
