"use client";

import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react/ssr";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Chip } from "./chip";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface Base {
  label: string;
  options: ComboboxOption[];
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  /** Shown when nothing matches. */
  emptyText?: string;
  className?: string;
}

export interface ComboboxSingleProps extends Base {
  mode?: "single";
  value?: string | null;
  onChange?: (value: string | null) => void;
}

export interface ComboboxMultipleProps extends Base {
  mode: "multiple";
  value?: string[];
  onChange?: (value: string[]) => void;
}

/** Bolds the part of the label that matches what was typed. */
function Match({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <strong className="font-semibold">{text.slice(at, at + query.length)}</strong>
      {text.slice(at + query.length)}
    </>
  );
}

/**
 * A text field whose list filters as you type, for long lists such as banks. Follows the ARIA combobox pattern:
 * arrow keys move through the list, Enter picks, Escape closes. In multiple mode the picks become chips.
 */
export function Combobox(props: ComboboxSingleProps | ComboboxMultipleProps) {
  const { label, options, placeholder = "Search", hint, error, disabled, emptyText = "No results", className = "" } = props;
  const multiple = props.mode === "multiple";
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const [innerSingle, setInnerSingle] = useState<string | null>(null);
  const [innerMulti, setInnerMulti] = useState<string[]>([]);
  const selected: string[] = multiple
    ? ((props as ComboboxMultipleProps).value ?? innerMulti)
    : [((props as ComboboxSingleProps).value ?? innerSingle) ?? ""].filter(Boolean);

  const singleLabel = !multiple && selected[0] ? options.find((o) => o.value === selected[0])?.label ?? "" : "";
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const shown = useMemo(() => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())), [options, query]);
  const note = error ?? hint;

  useEffect(() => {
    const away = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, []);

  function pick(o: ComboboxOption) {
    if (multiple) {
      const p = props as ComboboxMultipleProps;
      const next = selected.includes(o.value) ? selected.filter((v) => v !== o.value) : [...selected, o.value];
      if (p.value === undefined) setInnerMulti(next);
      p.onChange?.(next);
      setQuery("");
    } else {
      const p = props as ComboboxSingleProps;
      if (p.value === undefined) setInnerSingle(o.value);
      p.onChange?.(o.value);
      setQuery("");
      setOpen(false);
    }
  }

  function remove(v: string) {
    const p = props as ComboboxMultipleProps;
    const next = selected.filter((x) => x !== v);
    if (p.value === undefined) setInnerMulti(next);
    p.onChange?.(next);
    input.current?.focus();
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((a) => Math.min(a + 1, shown.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && open && shown[active]) {
      e.preventDefault();
      pick(shown[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && multiple && !query && selected.length) {
      remove(selected[selected.length - 1]);
    }
  }

  const listId = `${id}-list`;
  const activeId = open && shown[active] ? `${id}-opt-${shown[active].value}` : undefined;

  return (
    <div ref={wrap} className={`relative flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className={`text-sm font-medium ${disabled ? "text-role-text-disabled" : "text-role-text-primary"}`}>
        {label}
      </label>
      <div
        onClick={() => !disabled && input.current?.focus()}
        className={`flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border px-3 py-1 ${
          disabled
            ? "border-role-border-disabled bg-role-bg-subtle"
            : error
              ? "border-role-border-danger bg-role-bg-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-role-border-danger"
              : "border-role-border-input bg-role-bg-surface hover:bg-role-bg-hover has-[:focus-visible]:border-role-border-focus has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-role-border-focus"
        }`}
      >
        <MagnifyingGlass size={16} aria-hidden="true" className="shrink-0 text-role-text-secondary" />
        {multiple &&
          selected.map((v) => (
            <Chip key={v} size="sm" tone="primary" label={options.find((o) => o.value === v)?.label ?? v} onRemove={disabled ? undefined : () => remove(v)} />
          ))}
        <input
          ref={input}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? `${id}-note` : undefined}
          autoComplete="off"
          disabled={disabled}
          value={open || multiple ? query : singleLabel}
          placeholder={!multiple && singleLabel ? singleLabel : placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={onKey}
          className="min-h-9 min-w-24 grow self-stretch bg-transparent text-sm text-role-text-primary outline-none placeholder:text-role-text-secondary disabled:cursor-not-allowed"
        />
        <CaretDown size={16} aria-hidden="true" className={`shrink-0 text-role-text-secondary transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && !disabled && (
        <ul id={listId} role="listbox" aria-label={label} aria-multiselectable={multiple || undefined} className="absolute top-full z-30 mt-1 max-h-64 w-full overflow-auto rounded-md border border-role-border-default bg-role-bg-surface p-1 shadow-md">
          {shown.length === 0 ? (
            <li role="presentation" className="px-2 py-3 text-center text-sm text-role-text-secondary">
              {emptyText}
            </li>
          ) : (
            shown.map((o, i) => {
              const on = selected.includes(o.value);
              return (
                <li
                  key={o.value}
                  id={`${id}-opt-${o.value}`}
                  role="option"
                  aria-selected={on}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => pick(o)}
                  onPointerEnter={() => setActive(i)}
                  className={`flex min-h-11 cursor-pointer items-center rounded-sm px-2 text-sm text-role-text-primary ${i === active ? "bg-role-bg-tone-info" : ""} ${on ? "font-medium" : ""}`}
                >
                  <Match text={o.label} query={query} />
                </li>
              );
            })
          )}
        </ul>
      )}
      {note && (
        <p id={`${id}-note`} className={`text-xs leading-[18px] ${error ? "text-role-text-danger" : "text-role-text-secondary"}`}>
          {note}
        </p>
      )}
    </div>
  );
}
