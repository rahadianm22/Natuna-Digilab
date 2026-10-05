"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import type { SearchEntry as Entry } from "@/lib/search-index";

export default function CommandSearch({ entries }: { entries: Entry[] }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 12);
    return entries.filter((e) => `${e.title} ${e.group} ${e.note ?? ""} ${e.keywords ?? ""}`.toLowerCase().includes(q)).slice(0, 20);
  }, [query, entries]);

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

  // Arrowing past the visible part of the list keeps the highlighted option on screen.
  useEffect(() => {
    document.getElementById(`result-${index}`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

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
    } else if (e.key === "Escape") {
      // A search field clears itself on the first Esc; here Esc should close the dialog in one press.
      e.preventDefault();
      close();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search the documentation"
        className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-gray-300 px-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 lg:w-52 lg:justify-start"
      >
        <MagnifyingGlass size={16} aria-hidden="true" />
        <span className="hidden flex-1 text-left lg:block">Search docs</span>
        <kbd className="hidden rounded border border-gray-300 px-1.5 font-mono-code text-[11px] text-gray-700 lg:block">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialog}
        aria-label="Search the documentation"
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-surface p-0 text-gray-900 backdrop:bg-ink/60"
      >
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600">
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
            className="h-12 w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-700 focus:outline-none"
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
                i === index ? "bg-blue-50 text-blue-900" : "text-gray-800"
              }`}
            >
              <span className="truncate font-medium">{r.title}</span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-gray-700">
                {r.note && r.note !== r.group && <span>{r.note}</span>}
                <span>{r.group}</span>
              </span>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-gray-700">
              Nothing matches &ldquo;{query.trim()}&rdquo;. Try a component such as Button, or a token such as #015099.
            </li>
          )}
        </ul>
        <p role="status" className="sr-only">
          {query.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}
        </p>
        <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-700">
          Arrow keys to move, Enter to open, Esc to close.
        </div>
      </dialog>
    </>
  );
}
