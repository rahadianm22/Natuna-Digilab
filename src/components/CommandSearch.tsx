"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { componentGroup, components, statusText } from "@/lib/components-data";
import { palettes } from "@/lib/natuna-palette";

interface Entry {
  href: string;
  title: string;
  group: string;
  note?: string;
  /** Extra words that should find this entry, such as an old alias ("tag" finds Chip). */
  keywords?: string;
}

const pages: Entry[] = [
  { href: "/docs", title: "Introduction", group: "Page" },
  { href: "/foundation", title: "Foundation", group: "Page", note: "Color, type, number, effect" },
  { href: "/components", title: "Components overview", group: "Page" },
  { href: "/themes", title: "Themes", group: "Page", note: "Light and dark mode" },
  { href: "/naming", title: "Naming", group: "Page", note: "Property and page names", keywords: "property properties figma variant boolean show label tone state" },
  { href: "/privacy", title: "Privacy statement", group: "Page" },
];

// Tokens are searchable by every name a designer or engineer might type: the ramp name, the Tailwind
// class, the hex, or the Figma variable. They come after pages and components, so a word like "blue"
// still lists components first.
const tokens: Entry[] = [
  ...palettes.flatMap((p) =>
    p.steps.map((s) => ({
      href: "/foundation#color",
      title: `${p.label} ${s.step}`,
      group: "Color token",
      note: s.hex,
      keywords: `${p.token}-${s.step} ${s.hex} ${s.hex.slice(1)} color`,
    })),
  ),
  ...[
    ["sm", 4],
    ["md", 8],
    ["xl", 16],
    ["2xl", 24],
    ["3xl", 32],
    ["full", 1920],
  ].map(([name, px]) => ({
    href: "/foundation#radius",
    title: `Rounded/${px}`,
    group: "Radius token",
    note: name === "full" ? "rounded-full" : `rounded-${name}, ${px}px`,
    keywords: `rounded-${name} radius corner`,
  })),
  ...["Header 1", "Header 2", "Subheader", "Body 1", "Body 2", "Caption 1", "Caption 2"].map((t) => ({
    href: "/foundation#typography",
    title: t,
    group: "Text style",
    keywords: "typography type font urbanist",
  })),
  ...["sm", "md", "lg", "xl"].map((s) => ({
    href: "/foundation#effect",
    title: `shadow-${s}`,
    group: "Effect token",
    keywords: "shadow elevation effect",
  })),
];

const entries: Entry[] = [
  ...pages,
  ...components.map((c) => ({
    href: `/components/${c.slug}`,
    title: c.name,
    group: componentGroup(c.slug),
    note: statusText[c.status],
    keywords: c.tags.join(" "),
  })),
  ...tokens,
];

export default function CommandSearch() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 12);
    return entries.filter((e) => `${e.title} ${e.group} ${e.keywords ?? ""}`.toLowerCase().includes(q)).slice(0, 20);
  }, [query]);

  function open() {
    setQuery("");
    setIndex(0);
    // showModal throws on a dialog that is already open, so a second Ctrl K just refocuses the field.
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
    input.current?.focus();
  }

  function close() {
    dialog.current?.close();
  }

  function go(entry: Entry | undefined) {
    if (!entry) return;
    close();
    router.push(entry.href);
  }

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onInputKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[index]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search the documentation"
        className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-gray-300 px-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 sm:h-9 sm:min-w-9 lg:w-52 lg:justify-start"
      >
        <MagnifyingGlass size={16} aria-hidden="true" />
        <span className="hidden flex-1 text-left lg:block">Search docs</span>
        <kbd className="hidden rounded border border-gray-300 px-1.5 font-mono-code text-[11px] text-gray-600 lg:block">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialog}
        aria-label="Search the documentation"
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-surface p-0 text-gray-900 backdrop:bg-ink/60"
      >
        <div className="flex items-center gap-3 border-b border-gray-200 px-4">
          <MagnifyingGlass size={18} aria-hidden="true" className="text-gray-500" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Search components, pages, and tokens"
            aria-label="Search components, pages, and tokens"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={results[index] ? `result-${index}` : undefined}
            className="h-12 w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none"
          />
        </div>
        <ul id="command-results" role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-2">
          {results.map((r, i) => (
            <li
              key={`${r.href}|${r.title}`}
              id={`result-${i}`}
              role="option"
              aria-selected={i === index}
              onMouseMove={() => setIndex(i)}
              onClick={() => go(r)}
              className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md px-3 text-sm ${
                i === index ? "bg-blue-50 text-blue-800" : "text-gray-800"
              }`}
            >
              <span className="truncate font-medium">{r.title}</span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-gray-600">
                {r.note && <span>{r.note}</span>}
                <span>{r.group}</span>
              </span>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-gray-600">
              Nothing matches &ldquo;{query.trim()}&rdquo;. Try a component such as Button, or a token such as #026acc.
            </li>
          )}
        </ul>
        <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-600">
          Arrow keys to move, Enter to open, Esc to close.
        </div>
      </dialog>
    </>
  );
}
