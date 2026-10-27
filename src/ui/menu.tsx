"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type MenuSize = "sm" | "md";

export interface MenuItemData {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
  /** Draw a divider above this item, to start a new group. */
  separatorBefore?: boolean;
}

interface ListProps {
  items: MenuItemData[];
  size?: MenuSize;
  id?: string;
  labelledBy?: string;
  onClose?: () => void;
  className?: string;
}

// Items are 44 tall at both sizes so each one is a full touch target; sm only shrinks the text and icon.
const TEXT: Record<MenuSize, string> = { sm: "text-sm", md: "text-base" };

/** The open list on its own, for documentation. Menu adds the trigger button and the open state. */
export function MenuList({ items, size = "md", id, labelledBy, onClose, className = "" }: ListProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);

  function move(from: number, step: number) {
    const at = enabled.indexOf(from);
    const next = enabled[(at + step + enabled.length) % enabled.length];
    refs.current[next]?.focus();
  }

  function onKey(i: number, e: KeyboardEvent) {
    if (e.key === "Escape" || e.key === "Tab") return onClose?.();
    const target: Record<string, () => void> = {
      ArrowDown: () => move(i, 1),
      ArrowUp: () => move(i, -1),
      Home: () => refs.current[enabled[0]]?.focus(),
      End: () => refs.current[enabled[enabled.length - 1]]?.focus(),
    };
    if (target[e.key]) {
      e.preventDefault();
      target[e.key]();
    }
  }

  return (
    <div role="menu" id={id} aria-labelledby={labelledBy} className={`flex min-w-48 flex-col rounded-md border border-role-border-default bg-role-bg-surface p-1 shadow-md ${className}`}>
      {items.map((it, i) => (
        <div key={i} role="none">
          {it.separatorBefore && <div role="separator" className="my-1 h-px bg-role-border-default" />}
          <button
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="menuitem"
            type="button"
            tabIndex={-1}
            disabled={it.disabled}
            onKeyDown={(e) => onKey(i, e)}
            onClick={() => {
              it.onSelect?.();
              onClose?.();
            }}
            className={`flex min-h-11 w-full items-center gap-2 rounded-sm px-2 text-left focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:text-role-text-disabled ${TEXT[size]} ${
              it.danger ? "text-role-text-danger hover:bg-role-bg-tone-danger" : "text-role-text-primary hover:bg-role-bg-hover"
            }`}
          >
            {it.icon && <span aria-hidden="true" className="inline-flex shrink-0">{it.icon}</span>}
            {it.label}
          </button>
        </div>
      ))}
    </div>
  );
}

export interface MenuProps {
  /** The trigger content, such as a kebab icon. */
  trigger: ReactNode;
  /** Accessible name of the trigger. Required when the trigger is only an icon. */
  label: string;
  items: MenuItemData[];
  size?: MenuSize;
  align?: "start" | "end";
  className?: string;
}

/** A list of actions opened from a button. For choosing a value in a form, use Select or Combobox instead. */
export function Menu({ trigger, label, items, size = "md", align = "start", className = "" }: MenuProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    wrap.current?.querySelector<HTMLButtonElement>("[role=menuitem]:not(:disabled)")?.focus();
    const away = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  function close() {
    setOpen(false);
    button.current?.focus();
  }

  return (
    <div ref={wrap} className={`relative inline-flex ${className}`}>
      <button
        ref={button}
        type="button"
        id={`${id}-trigger`}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={() => setOpen(!open)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-role-text-secondary hover:bg-role-bg-hover"
      >
        {trigger}
      </button>
      {open && (
        <div className={`absolute top-full z-30 mt-1 ${align === "end" ? "right-0" : "left-0"}`}>
          <MenuList id={`${id}-menu`} labelledBy={`${id}-trigger`} items={items} size={size} onClose={close} />
        </div>
      )}
    </div>
  );
}
