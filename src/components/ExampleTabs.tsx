"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Tab = "preview" | "code";

export default function ExampleTabs({ preview, code }: { preview: ReactNode; code?: string }) {
  const [tab, setTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const id = useId();
  const tabs: Tab[] = code ? ["preview", "code"] : ["preview"];
  const refs = useRef<Record<Tab, HTMLButtonElement | null>>({ preview: null, code: null });

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    setTimeout(() => setCopied("idle"), 2000);
  }

  // Arrow keys move between tabs, as in the WAI-ARIA tabs pattern.
  function onKey(e: KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(tabs.indexOf(tab) + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setTab(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-surface">
      <div className="flex items-center justify-between border-b border-gray-200 px-2">
        <div role="tablist" aria-label="Example" className="flex" onKeyDown={onKey}>
          {tabs.map((t) => (
            <button
              key={t}
              ref={(el) => {
                refs.current[t] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-${t}-tab`}
              aria-selected={tab === t}
              aria-controls={`${id}-${t}-panel`}
              tabIndex={tab === t ? 0 : -1}
              onClick={() => setTab(t)}
              className={`relative min-h-11 px-3 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "text-gray-900 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "code" && (
          <button
            type="button"
            onClick={copy}
            className="min-h-9 rounded-md px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            {copied === "done" ? "Copied" : copied === "failed" ? "Copy failed" : "Copy code"}
          </button>
        )}
      </div>

      <div
        role="tabpanel"
        id={`${id}-preview-panel`}
        aria-labelledby={`${id}-preview-tab`}
        hidden={tab !== "preview"}
        className="flex min-h-56 items-center justify-center bg-canvas/60 px-6 py-8"
      >
        <div className="w-full">{preview}</div>
      </div>
      {code && (
        <div role="tabpanel" id={`${id}-code-panel`} aria-labelledby={`${id}-code-tab`} hidden={tab !== "code"}>
          <pre className="overflow-x-auto bg-ink p-5 text-[13px] leading-6 text-white">
            <code className="font-mono-code">{code}</code>
          </pre>
        </div>
      )}
      <span role="status" className="sr-only">
        {copied === "done" ? "Code copied to clipboard" : copied === "failed" ? "Could not copy the code" : ""}
      </span>
    </div>
  );
}
