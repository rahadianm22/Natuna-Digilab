"use client";

import { useId, useState } from "react";

export interface PinInputProps {
  label: string;
  length?: 4 | 6;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** Show the label above the dots. It is always read by screen readers. */
  showLabel?: boolean;
  className?: string;
}

/**
 * Like OTP Input, but the value is never shown: each digit is a filled dot. A numeric keypad, when the design has
 * one, lives outside this component and calls onChange. A real password input sits over the dots, so the system
 * keyboard and screen readers work too.
 */
export function PinInput({ label, length = 6, value, onChange, onComplete, hint, error, disabled, showLabel = true, className = "" }: PinInputProps) {
  const id = useId();
  const [inner, setInner] = useState("");
  const pin = (value ?? inner).slice(0, length);
  const note = error ?? hint;

  function set(next: string) {
    const clean = next.replace(/\D/g, "").slice(0, length);
    if (value === undefined) setInner(clean);
    onChange?.(clean);
    if (clean.length === length) onComplete?.(clean);
  }

  return (
    <div className={`flex flex-col items-center gap-3 text-center ${className}`}>
      <label htmlFor={id} className={showLabel ? `text-sm ${disabled ? "text-role-text-disabled" : "text-role-text-primary"}` : "sr-only"}>
        {label}
      </label>
      <div className="relative flex min-h-11 items-center gap-4 rounded-full px-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-role-border-focus">
        <input
          id={id}
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={length}
          value={pin}
          disabled={disabled}
          onChange={(e) => set(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? `${id}-note` : undefined}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 outline-none disabled:cursor-not-allowed"
        />
        {Array.from({ length }, (_, i) => {
          const filled = i < pin.length;
          return (
            <span
              key={i}
              aria-hidden="true"
              className={`size-3.5 rounded-full border-2 ${
                disabled
                  ? "border-role-border-disabled"
                  : error
                    ? "border-role-bg-danger bg-role-bg-danger"
                    : filled
                      ? "border-role-bg-brand bg-role-bg-brand"
                      : "border-role-border-input"
              }`}
            />
          );
        })}
      </div>
      {note && (
        <p id={`${id}-note`} aria-live="polite" className={`text-xs leading-[18px] ${error ? "text-role-text-danger" : "text-role-text-secondary"}`}>
          {note}
        </p>
      )}
    </div>
  );
}
