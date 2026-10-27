"use client";

import { useId, useState } from "react";

export type SliderSize = "sm" | "md" | "lg";

// Track 2, 4, 6 high; thumb 12, 16, 20 across. The native input is 44px tall, so the whole row is the touch target.
const TRACK: Record<SliderSize, string> = { sm: "h-0.5", md: "h-1", lg: "h-1.5" };
const THUMB: Record<SliderSize, string> = {
  sm: "[&::-webkit-slider-thumb]:size-3 [&::-moz-range-thumb]:size-3",
  md: "[&::-webkit-slider-thumb]:size-4 [&::-moz-range-thumb]:size-4",
  lg: "[&::-webkit-slider-thumb]:size-5 [&::-moz-range-thumb]:size-5",
};

// One thumb style for both engines. pointer-events on the thumb only, so two overlapping range inputs both work.
const INPUT =
  "pointer-events-none absolute inset-0 m-0 h-11 w-full cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-role-bg-brand [&::-webkit-slider-thumb]:bg-role-bg-surface [&::-webkit-slider-thumb]:shadow-sm " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-role-bg-brand [&::-moz-range-thumb]:bg-role-bg-surface " +
  "focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-webkit-slider-thumb]:outline-role-border-focus " +
  "focus-visible:[&::-moz-range-thumb]:outline-2 focus-visible:[&::-moz-range-thumb]:outline-offset-2 focus-visible:[&::-moz-range-thumb]:outline-role-border-focus " +
  "disabled:[&::-webkit-slider-thumb]:border-role-border-disabled disabled:[&::-moz-range-thumb]:border-role-border-disabled";

interface Common {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  size?: SliderSize;
  disabled?: boolean;
  showLabel?: boolean;
  showValue?: boolean;
  className?: string;
}

export interface SliderProps extends Common {
  mode?: "single";
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Turns the value into the text shown and read, such as "15 yrs". */
  format?: (value: number) => string;
}

export interface RangeSliderProps extends Common {
  mode: "range";
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  format?: (value: number) => string;
}

/** A value or range picker. Built on native range inputs, so arrow keys, Home, End and Page keys work. */
export function Slider(props: SliderProps | RangeSliderProps) {
  const { label, min = 0, max = 100, step = 1, size = "md", disabled, showLabel = true, showValue = true, className = "" } = props;
  const id = useId();
  const fmt = props.format ?? ((n: number) => String(n));
  const range = props.mode === "range";

  const [single, setSingle] = useState<number>(!range ? (props.defaultValue ?? min) : min);
  const [pair, setPair] = useState<[number, number]>(range ? (props.defaultValue ?? [min, max]) : [min, max]);

  const lo = range ? (props.value ?? pair)[0] : min;
  const hi = range ? (props.value ?? pair)[1] : ((props as SliderProps).value ?? single);
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  function setLo(n: number) {
    const next: [number, number] = [Math.min(n, hi), hi];
    if ((props as RangeSliderProps).value === undefined) setPair(next);
    (props as RangeSliderProps).onChange?.(next);
  }
  function setHi(n: number) {
    if (range) {
      const next: [number, number] = [lo, Math.max(n, lo)];
      if ((props as RangeSliderProps).value === undefined) setPair(next);
      (props as RangeSliderProps).onChange?.(next);
    } else {
      if ((props as SliderProps).value === undefined) setSingle(n);
      (props as SliderProps).onChange?.(n);
    }
  }

  const text = range ? `${fmt(lo)} – ${fmt(hi)}` : fmt(hi);
  const fill = disabled ? "bg-role-text-disabled" : "bg-role-bg-brand";

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {(showLabel || showValue) && (
        <div className="flex items-baseline justify-between gap-4 text-sm">
          {showLabel && (
            <span id={`${id}-label`} className={disabled ? "text-role-text-disabled" : "text-role-text-primary"}>
              {label}
            </span>
          )}
          {showValue && (
            <span aria-hidden="true" className={`font-medium tabular-nums ${disabled ? "text-role-text-disabled" : "text-role-text-link"}`}>
              {text}
            </span>
          )}
        </div>
      )}
      <div className="relative h-11">
        <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-role-bg-subtle ${TRACK[size]}`}>
          <div className={`absolute h-full rounded-full ${fill}`} style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }} />
        </div>
        {range && (
          <input
            type="range"
            aria-label={`${label}, minimum`}
            aria-valuetext={fmt(lo)}
            min={min}
            max={max}
            step={step}
            value={lo}
            disabled={disabled}
            onChange={(e) => setLo(Number(e.target.value))}
            className={`${INPUT} ${THUMB[size]}`}
          />
        )}
        <input
          type="range"
          aria-label={range ? `${label}, maximum` : label}
          aria-valuetext={fmt(hi)}
          min={min}
          max={max}
          step={step}
          value={hi}
          disabled={disabled}
          onChange={(e) => setHi(Number(e.target.value))}
          className={`${INPUT} ${THUMB[size]}`}
        />
      </div>
    </div>
  );
}
