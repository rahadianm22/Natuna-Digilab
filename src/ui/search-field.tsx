"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react/ssr";
import { useId, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";

export type SearchFieldType = "basic" | "withButton" | "inline";

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "onChange" | "value" | "defaultValue"> {
  /** Names the field for screen readers. There is no visible label in the design, so this is required. */
  label: string;
  type?: SearchFieldType;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the query on Enter, or on the Search button. */
  onSearch?: (value: string) => void;
  error?: string;
  buttonLabel?: string;
  /** Show the search icon on the left. */
  showIcon?: boolean;
}

/** A search field. The clear button only appears once there is text. */
export function SearchField({
  label,
  type = "basic",
  value,
  defaultValue = "",
  onValueChange,
  onSearch,
  error,
  buttonLabel = "Search",
  showIcon = true,
  disabled,
  placeholder = "Search",
  className = "",
  ...rest
}: SearchFieldProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [inner, setInner] = useState(defaultValue);
  const query = value ?? inner;

  function set(next: string) {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    onSearch?.(query);
  }

  const inline = type === "inline";
  const field = (
    <div
      className={`relative flex min-h-11 grow items-center gap-2 border px-3 ${inline ? "rounded-full" : "rounded-md"} ${
        disabled
          ? "border-role-border-disabled bg-role-bg-subtle"
          : error
            ? "border-role-border-danger bg-role-bg-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-role-border-danger"
            : `${inline ? "border-transparent bg-role-bg-subtle" : "border-role-border-input bg-role-bg-surface"} hover:bg-role-bg-hover has-[:focus-visible]:border-role-border-focus has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-role-border-focus`
      }`}
    >
      {showIcon && <MagnifyingGlass size={16} aria-hidden="true" className="shrink-0 text-role-text-secondary" />}
      <input
        ref={input}
        id={id}
        type="search"
        aria-label={label}
        value={query}
        onChange={(e) => set(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        // The field draws the focus ring, so the input itself does not.
        className="min-w-0 grow self-stretch bg-transparent text-sm text-role-text-primary outline-none placeholder:text-role-text-secondary disabled:cursor-not-allowed disabled:text-role-text-disabled [&::-webkit-search-cancel-button]:hidden"
        {...rest}
      />
      {query && !disabled && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            set("");
            input.current?.focus();
          }}
          className="-mr-3 flex size-11 shrink-0 items-center justify-center rounded-full text-role-text-secondary hover:text-role-text-primary"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );

  return (
    <form role="search" onSubmit={submit} className={`flex flex-col gap-1 ${className}`}>
      <div className="flex gap-2">
        {field}
        {type === "withButton" && (
          <button
            type="submit"
            disabled={disabled}
            className="min-h-11 shrink-0 rounded-md bg-role-bg-brand px-4 text-sm font-medium text-role-text-on-brand hover:bg-role-bg-brand-hover disabled:cursor-not-allowed disabled:bg-role-bg-subtle disabled:text-role-text-disabled"
          >
            {buttonLabel}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs leading-[18px] text-role-text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
