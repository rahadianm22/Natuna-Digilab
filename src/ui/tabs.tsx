"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TabsType = "underline" | "pill" | "segmented";
export type TabsSize = "sm" | "md" | "lg";

export interface TabItem {
  id: string;
  label: string;
  /** A count or short value after the label, such as 12. */
  value?: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** The panel for this tab. Leave it out to render the panels yourself. */
  content?: ReactNode;
}

export interface TabsProps {
  /** Names the tab list for screen readers. */
  label: string;
  items: TabItem[];
  type?: TabsType;
  size?: TabsSize;
  /** Controlled id of the selected tab. Pass onChange with it. */
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
}

const HEIGHT: Record<TabsSize, string> = { sm: "min-h-11 text-xs", md: "min-h-11 text-sm", lg: "min-h-12 text-base" };

const LIST: Record<TabsType, string> = {
  underline: "border-b border-role-border-default gap-1",
  pill: "gap-1",
  segmented: "gap-1 rounded-lg bg-role-bg-subtle p-1 w-fit",
};

function tabClass(type: TabsType, active: boolean) {
  if (type === "underline") {
    return active
      ? "-mb-px border-b-2 border-role-bg-brand text-role-text-link"
      : "-mb-px border-b-2 border-transparent text-role-text-secondary hover:bg-role-bg-hover hover:text-role-text-primary";
  }
  if (type === "pill") {
    return active ? "rounded-full bg-role-bg-brand text-role-text-on-brand" : "rounded-full text-role-text-secondary hover:bg-role-bg-hover";
  }
  return active
    ? "rounded-md bg-role-bg-surface text-role-text-link shadow-sm"
    : "rounded-md text-role-text-secondary hover:text-role-text-primary";
}

export function Tabs({ label, items, type = "underline", size = "md", value, defaultValue, onChange, className = "" }: TabsProps) {
  const uid = useId();
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.disabled)?.id);
  const current = value ?? inner;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(id: string) {
    setInner(id);
    onChange?.(id);
  }

  // Arrow keys move focus and select, Home and End jump, and disabled tabs are skipped.
  function onKeyDown(e: KeyboardEvent) {
    const enabled = items.filter((i) => !i.disabled);
    const at = enabled.findIndex((i) => i.id === current);
    let next = -1;
    if (e.key === "ArrowRight") next = (at + 1) % enabled.length;
    else if (e.key === "ArrowLeft") next = (at - 1 + enabled.length) % enabled.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = enabled.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const id = enabled[next].id;
    select(id);
    refs.current[id]?.focus();
  }

  const active = items.find((i) => i.id === current);

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={`flex ${LIST[type]}`}>
        {items.map((item) => {
          const on = item.id === current;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[item.id] = el;
              }}
              id={`${uid}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={on && item.content !== undefined ? `${uid}-panel-${item.id}` : undefined}
              tabIndex={on ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 font-medium disabled:cursor-not-allowed disabled:text-role-text-disabled disabled:hover:bg-transparent ${HEIGHT[size]} ${tabClass(type, on)}`}
            >
              {item.icon && <span aria-hidden="true" className="inline-flex">{item.icon}</span>}
              {item.label}
              {item.value && (
                <span className={`rounded-full px-1.5 text-xs ${on && type !== "pill" ? "bg-role-bg-tone-info text-role-text-tone-info" : on ? "bg-role-bg-brand-hover" : "bg-role-bg-subtle text-role-text-secondary"}`}>
                  {item.value}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {active?.content !== undefined && (
        <div role="tabpanel" id={`${uid}-panel-${active.id}`} aria-labelledby={`${uid}-tab-${active.id}`} tabIndex={0} className="pt-4">
          {active.content}
        </div>
      )}
    </div>
  );
}
