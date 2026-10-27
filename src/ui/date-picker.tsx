"use client";

import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type DateRange = [Date, Date | null];

const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// Indonesian week, Monday first: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu.
const WEEK = [
  ["S", "Senin"],
  ["S", "Selasa"],
  ["R", "Rabu"],
  ["K", "Kamis"],
  ["J", "Jumat"],
  ["S", "Sabtu"],
  ["M", "Minggu"],
];
const monthName = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" });
const dayName = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const formatDate = (d: Date) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(d);

interface CalendarCommon {
  /** Today, for the outline. Pass it from the server to avoid a hydration mismatch. */
  today?: Date;
  /** Move focus into the grid on mount, as the date picker does when it opens. */
  autoFocus?: boolean;
  className?: string;
}

export interface CalendarSingleProps extends CalendarCommon {
  mode?: "single";
  value?: Date | null;
  onChange?: (value: Date) => void;
}

export interface CalendarRangeProps extends CalendarCommon {
  mode: "range";
  value?: DateRange | null;
  onChange?: (value: DateRange) => void;
}

/**
 * A month grid. Arrow keys move a day or a week, Page Up and Page Down move a month, Home and End go to the start
 * and end of the week, and Enter or Space picks.
 */
export function Calendar(props: CalendarSingleProps | CalendarRangeProps) {
  const range = props.mode === "range";
  const today = startOfDay(props.today ?? new Date());
  const start = range ? (props.value as DateRange | null | undefined)?.[0] : (props.value as Date | null | undefined);
  const end = range ? (props.value as DateRange | null | undefined)?.[1] ?? null : null;
  const [view, setView] = useState(() => new Date((start ?? today).getFullYear(), (start ?? today).getMonth(), 1));
  const [focus, setFocus] = useState<Date>(start ?? today);
  const grid = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (props.autoFocus) grid.current?.querySelector<HTMLButtonElement>("[tabindex='0']")?.focus();
    // Only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!moved.current) return;
    grid.current?.querySelector<HTMLButtonElement>("[tabindex='0']")?.focus();
  }, [focus]);

  const lead = (view.getDay() + 6) % 7; // Monday first
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))];

  function go(d: Date) {
    moved.current = true;
    setFocus(d);
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) setView(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  function choose(d: Date) {
    if (range) {
      const p = props as CalendarRangeProps;
      if (!start || end) p.onChange?.([d, null]);
      else p.onChange?.(d < start ? [d, start] : [start, d]);
    } else (props as CalendarSingleProps).onChange?.(d);
    setFocus(d);
  }

  function onKey(e: KeyboardEvent) {
    const map: Record<string, Date> = {
      ArrowLeft: addDays(focus, -1),
      ArrowRight: addDays(focus, 1),
      ArrowUp: addDays(focus, -7),
      ArrowDown: addDays(focus, 7),
      PageUp: new Date(focus.getFullYear(), focus.getMonth() - 1, Math.min(focus.getDate(), 28)),
      PageDown: new Date(focus.getFullYear(), focus.getMonth() + 1, Math.min(focus.getDate(), 28)),
      Home: addDays(focus, -((focus.getDay() + 6) % 7)),
      End: addDays(focus, 6 - ((focus.getDay() + 6) % 7)),
    };
    if (map[e.key]) {
      e.preventDefault();
      go(map[e.key]);
    }
  }

  const navBtn = "flex size-11 items-center justify-center rounded-full text-role-text-secondary hover:bg-role-bg-hover";

  return (
    <div className={`inline-flex flex-col gap-1 rounded-lg border border-role-border-default bg-role-bg-surface p-3 shadow-md ${props.className ?? ""}`}>
      <div className="flex items-center justify-between">
        <button type="button" aria-label="Previous month" className={navBtn} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>
          <CaretLeft size={16} aria-hidden="true" />
        </button>
        <p aria-live="polite" className="text-sm font-semibold capitalize text-role-text-primary">
          {monthName.format(view)}
        </p>
        <button type="button" aria-label="Next month" className={navBtn} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>
          <CaretRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div ref={grid} role="grid" aria-label={monthName.format(view)} onKeyDown={onKey} className="grid grid-cols-7">
        <div role="row" className="contents">
          {WEEK.map(([short, long], i) => (
            <span key={i} role="columnheader" aria-label={long} className="flex h-8 items-center justify-center text-xs text-role-text-secondary">
              {short}
            </span>
          ))}
        </div>
        <div role="row" className="contents">
          {cells.map((d, i) => {
            if (!d) return <span key={`blank-${i}`} role="gridcell" />;
            const chosen = sameDay(d, start) || sameDay(d, end);
            const between = range && start && end && d > start && d < end;
            const isFocus = sameDay(d, focus) && d.getMonth() === view.getMonth();
            return (
              <span key={d.getDate()} role="gridcell" className={`flex justify-center ${between ? "bg-role-bg-tone-info" : ""}`}>
                <button
                  type="button"
                  tabIndex={isFocus || (!cells.some((c) => c && sameDay(c, focus)) && d.getDate() === 1) ? 0 : -1}
                  aria-label={dayName.format(d)}
                  aria-pressed={chosen}
                  aria-current={sameDay(d, today) ? "date" : undefined}
                  onClick={() => choose(d)}
                  onFocus={() => setFocus(d)}
                  className="group flex size-11 items-center justify-center"
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-full text-xs tabular-nums ${
                      chosen
                        ? "bg-role-bg-brand font-semibold text-role-text-on-brand"
                        : between
                          ? "text-role-text-tone-info"
                          : `text-role-text-primary group-hover:bg-role-bg-hover ${sameDay(d, today) ? "ring-1 ring-role-bg-brand" : ""}`
                    }`}
                  >
                    {d.getDate()}
                  </span>
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface PickerCommon {
  label: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  today?: Date;
  /** Force the calendar open, for documentation. */
  defaultOpen?: boolean;
  className?: string;
}

export interface DatePickerSingleProps extends PickerCommon {
  mode?: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date) => void;
}

export interface DatePickerRangeProps extends PickerCommon {
  mode: "range";
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onChange?: (value: DateRange) => void;
}

/** A field that opens a calendar. Escape or a click outside closes it, and focus returns to the field. */
export function DatePicker(props: DatePickerSingleProps | DatePickerRangeProps) {
  const { label, hint, error, disabled, placeholder = "Select date", today, defaultOpen = false, className = "" } = props;
  const range = props.mode === "range";
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(defaultOpen);
  const [single, setSingle] = useState<Date | null>(!range ? ((props as DatePickerSingleProps).defaultValue ?? null) : null);
  const [pair, setPair] = useState<DateRange | null>(range ? ((props as DatePickerRangeProps).defaultValue ?? null) : null);
  const note = error ?? hint;

  const value = range ? ((props as DatePickerRangeProps).value ?? pair) : ((props as DatePickerSingleProps).value ?? single);
  const text = range
    ? value && (value as DateRange)[1]
      ? `${(value as DateRange)[0].getDate()} – ${formatDate((value as DateRange)[1]!)}`
      : value
        ? formatDate((value as DateRange)[0])
        : ""
    : value
      ? formatDate(value as Date)
      : "";

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={wrap} className={`relative flex flex-col gap-1.5 ${className}`}>
      <span id={`${id}-label`} className={`text-sm font-medium ${disabled ? "text-role-text-disabled" : "text-role-text-primary"}`}>
        {label}
      </span>
      <button
        ref={button}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-describedby={note ? `${id}-note` : undefined}
        onClick={() => setOpen(!open)}
        className={`flex min-h-11 items-center gap-2 rounded-md border px-3 text-left text-sm disabled:cursor-not-allowed disabled:border-role-border-disabled disabled:bg-role-bg-subtle ${
          error ? "border-role-border-danger bg-role-bg-surface" : open ? "border-role-border-focus bg-role-bg-surface" : "border-role-border-input bg-role-bg-surface hover:bg-role-bg-hover"
        }`}
      >
        <CalendarBlank size={16} aria-hidden="true" className="shrink-0 text-role-text-secondary" />
        <span id={`${id}-value`} className={text ? "text-role-text-primary" : "text-role-text-secondary"}>
          {text || placeholder}
        </span>
      </button>
      {open && !disabled && (
        <div role="dialog" aria-label={`Choose ${label.toLowerCase()}`} className="absolute top-full z-30 mt-1">
          {range ? (
            <Calendar
              mode="range"
              autoFocus
              today={today}
              value={value as DateRange | null}
              onChange={(v) => {
                const p = props as DatePickerRangeProps;
                if (p.value === undefined) setPair(v);
                p.onChange?.(v);
                if (v[1]) setOpen(false);
              }}
            />
          ) : (
            <Calendar
              autoFocus
              today={today}
              value={value as Date | null}
              onChange={(v) => {
                const p = props as DatePickerSingleProps;
                if (p.value === undefined) setSingle(v);
                p.onChange?.(v);
                setOpen(false);
                button.current?.focus();
              }}
            />
          )}
        </div>
      )}
      {note && (
        <p id={`${id}-note`} className={`text-xs leading-[18px] ${error ? "text-role-text-danger" : "text-role-text-secondary"}`}>
          {note}
        </p>
      )}
    </div>
  );
}
