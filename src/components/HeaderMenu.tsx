"use client";

import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type RefObject, type SetStateAction } from "react";
import Link from "next/link";
import { GithubLogo, List, X } from "@phosphor-icons/react";

// The menu button and the menu sit in different parts of the header, so they share state through
// context while the header around them stays a Server Component.
interface MenuState {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  button: RefObject<HTMLButtonElement | null>;
}

const MenuContext = createContext<MenuState | null>(null);

function useMenu() {
  const menu = useContext(MenuContext);
  if (!menu) throw new Error("Header menu parts must be inside MenuProvider");
  return menu;
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  // The open menu sits over the page, so Esc closes it and hands focus back to the button that opened it.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return <MenuContext.Provider value={{ open, setOpen, button }}>{children}</MenuContext.Provider>;
}

export function MenuButton() {
  const { open, setOpen, button } = useMenu();
  return (
    <button
      ref={button}
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={open}
      aria-controls="mobile-nav"
      className="flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 md:hidden"
    >
      {open ? <X size={18} aria-hidden="true" /> : <List size={18} aria-hidden="true" />}
    </button>
  );
}

export function MobileMenu({ items, active, repoUrl }: { items: { href: string; label: string }[]; active?: string; repoUrl: string }) {
  const { open, setOpen } = useMenu();
  if (!open) return null;

  return (
    <nav id="mobile-nav" aria-label="Main" className="border-t border-gray-200 bg-surface px-6 py-3 md:hidden">
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={item.label === active ? "page" : undefined}
              className={`flex min-h-11 items-center rounded-md px-3 ${
                item.label === active
                  ? "bg-blue-50 font-semibold text-blue-900"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="mt-1 border-t border-gray-200 pt-1">
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-2 rounded-md px-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <GithubLogo size={18} aria-hidden="true" />
            Source on GitHub
          </a>
        </li>
      </ul>
    </nav>
  );
}
