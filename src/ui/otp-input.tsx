"use client";

import { useId, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";

export type OtpSize = "sm" | "md" | "lg";

// Cell 32x40, 40x48, 48x56. The sm cell keeps a 44px tall tap area by its height row, not its box.
const CELL: Record<OtpSize, string> = { sm: "h-11 w-11 text-base", md: "h-12 w-11 text-lg", lg: "h-14 w-12 text-xl" };

export interface OtpInputProps {
  /** Names the group, such as "Verification code". */
  label: string;
  length?: 4 | 6;
  value?: string;
  onChange?: (value: string) => void;
  /** Called once every digit is filled. Use it to submit. */
  onComplete?: (value: string) => void;
  size?: OtpSize;
  hint?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * One box per digit. Typing moves to the next box, Backspace moves back, and pasting a whole code fills every box.
 * The first box carries autocomplete="one-time-code", so phones can offer the code from the SMS.
 */
export function OtpInput({ label, length = 6, value, onChange, onComplete, size = "md", hint, error, disabled, className = "" }: OtpInputProps) {
  const id = useId();
  const [inner, setInner] = useState("");
  const code = (value ?? inner).slice(0, length);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const note = error ?? hint;

  function commit(next: string) {
    const clean = next.replace(/\D/g, "").slice(0, length);
    if (value === undefined) setInner(clean);
    onChange?.(clean);
    if (clean.length === length) onComplete?.(clean);
    boxes.current[Math.min(clean.length, length - 1)]?.focus();
  }

  function type(i: number, digit: string) {
    const d = digit.replace(/\D/g, "").slice(-1);
    if (!d) return;
    const chars = code.padEnd(length, " ").split("");
    chars[i] = d;
    commit(chars.join("").replace(/\s+$/, "").replace(/\s/g, ""));
  }

  function onKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const chars = code.split("");
      if (chars[i]) chars.splice(i, 1);
      else if (i > 0) chars.splice(i - 1, 1);
      const next = chars.join("");
      if (value === undefined) setInner(next);
      onChange?.(next);
      boxes.current[Math.max(0, chars[i] === undefined ? i - 1 : i)]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) boxes.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < length - 1) boxes.current[i + 1]?.focus();
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    commit(e.clipboardData.getData("text"));
  }

  return (
    <div role="group" aria-labelledby={`${id}-label`} aria-describedby={note ? `${id}-note` : undefined} className={`flex flex-col gap-2 ${className}`}>
      <span id={`${id}-label`} className="sr-only">
        {label}
      </span>
      <div className="flex gap-2">
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => {
              boxes.current[i] = el;
            }}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-invalid={error ? true : undefined}
            maxLength={1}
            value={code[i] ?? ""}
            disabled={disabled}
            onChange={(e) => type(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            onPaste={onPaste}
            onFocus={(e) => e.target.select()}
            className={`rounded-md border text-center font-semibold caret-role-bg-brand focus-visible:outline-2 focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:border-role-border-disabled disabled:bg-role-bg-subtle ${CELL[size]} ${
              error
                ? "border-role-border-danger bg-role-bg-tone-danger text-role-text-tone-danger focus-visible:outline-role-border-danger"
                : "border-role-border-input bg-role-bg-surface text-role-text-primary focus-visible:border-role-border-focus focus-visible:outline-role-border-focus"
            }`}
          />
        ))}
      </div>
      {note && (
        <p id={`${id}-note`} className={`text-xs leading-[18px] ${error ? "text-role-text-danger" : "text-role-text-secondary"}`}>
          {note}
        </p>
      )}
    </div>
  );
}
