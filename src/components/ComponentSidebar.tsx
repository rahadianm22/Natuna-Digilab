"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import { componentGroup, componentGroups, components, statusText } from "@/lib/components-data";

const sorted = [...components].sort((a, b) => a.name.localeCompare(b.name));

function SidebarBody({ idPrefix, onNavigate }: { idPrefix: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const current = components.find((c) => pathname === `/components/${c.slug}`);
  const activeCategory = current && componentGroup(current.slug);
  const q = query.trim().toLowerCase();
  const matches = sorted.filter((c) => `${c.name} ${c.tags.join(" ")}`.toLowerCase().includes(q));

  return (
    <>
      <label className="relative mb-5 block">
        <span className="sr-only">Filter components</span>
        <MagnifyingGlass size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter components"
          className="min-h-11 w-full rounded-md border border-gray-500 bg-surface py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-600 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:min-h-10"
        />
      </label>

      <div className="mb-3 space-y-0.5">
        {[
          { href: "/components", label: "Overview" },
          { href: "/naming", label: "Naming" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            aria-current={pathname === l.href ? "page" : undefined}
            className={`flex min-h-11 items-center rounded-md px-3 text-sm font-medium lg:min-h-9 ${
              pathname === l.href ? "bg-blue-50 text-blue-800" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <nav aria-label="Components" className="space-y-1">
        {componentGroups.map((name) => {
          const cat = { name };
          const items = matches.filter((c) => componentGroup(c.slug) === name);
          if (items.length === 0) return null;
          // The current page's category starts open; a search opens every category with a match.
          const isOpen = q ? true : (toggled[cat.name] ?? cat.name === activeCategory);
          const listId = `${idPrefix}-${cat.name.replace(/\s+/g, "-")}`;

          return (
            <div key={cat.name}>
              <button
                type="button"
                onClick={() => setToggled((t) => ({ ...t, [cat.name]: !isOpen }))}
                aria-expanded={isOpen}
                aria-controls={listId}
                className="flex min-h-11 w-full items-center justify-between rounded-md px-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 lg:min-h-9"
              >
                {cat.name}
                <span className="flex items-center gap-2 text-xs font-normal text-gray-600">
                  <span className="tabular-nums">{items.length}</span>
                  <CaretDown size={12} weight="bold" aria-hidden="true" className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
              <ul id={listId} hidden={!isOpen} className="mb-2 mt-0.5 space-y-0.5">
                {items.map((c) => {
                  const href = `/components/${c.slug}`;
                  const isActive = pathname === href;
                  return (
                    <li key={c.slug}>
                      <Link
                        href={href}
                        onClick={onNavigate}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex min-h-11 items-center justify-between gap-2 rounded-md px-3 text-sm lg:min-h-8 ${
                          isActive ? "bg-blue-50 font-medium text-blue-800" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {c.status !== "stable" && (
                          <span className="shrink-0 text-[11px] text-gray-600">{statusText[c.status]}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
        {matches.length === 0 && (
          <p className="px-3 py-2 text-sm text-gray-600">
            No component named &ldquo;{query.trim()}&rdquo;. Check the spelling or browse the{" "}
            <Link href="/components" onClick={onNavigate} className="text-blue-700 underline">overview</Link>.
          </p>
        )}
      </nav>
    </>
  );
}

export default function ComponentSidebar() {
  return (
    <aside className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-64 shrink-0 self-start overflow-y-auto overscroll-contain border-r border-gray-200 py-6 pl-6 pr-4 lg:block">
      <SidebarBody idPrefix="sidebar" />
    </aside>
  );
}

// Below the lg breakpoint the sidebar is hidden, so this disclosure gives phones the same list.
export function ComponentMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = components.find((c) => pathname === `/components/${c.slug}`);

  return (
    <div className="border-b border-gray-200 bg-surface lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-components"
        className="flex min-h-12 w-full items-center justify-between gap-3 px-6 text-left text-sm font-medium text-gray-900"
      >
        <span>All components</span>
        <span className="flex items-center gap-2 text-gray-600">
          {current?.name}
          <CaretDown size={14} weight="bold" aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && (
        <div id="mobile-components" className="max-h-[65vh] overflow-y-auto border-t border-gray-200 px-6 py-4">
          <SidebarBody idPrefix="mobile" onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
