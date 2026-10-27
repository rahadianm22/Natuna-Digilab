"use client";

import { Check, Copy } from "@phosphor-icons/react/ssr";
import { useEffect, useState } from "react";

export interface CodeBlockProps {
  code: string;
  /** Shown in the header, such as "TSX" or "Terminal". Also names the scroll region. */
  language?: string;
  /** A file name or title in the header, shown before the language. */
  title?: string;
  showLineNumbers?: boolean;
  /** Wrap long lines instead of scrolling sideways. */
  wrap?: boolean;
  /** Show the Copy button. */
  copyable?: boolean;
  className?: string;
}

/**
 * Read-only code with a copy button. The text is plain, without syntax colors, so it reads the same in light and
 * dark mode and passes 7:1. Long lines scroll inside a focusable region, so keyboard users can scroll it too.
 */
export function CodeBlock({ code, language, title, showLineNumbers = false, wrap = false, copyable = true, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");
  const name = [title, language].filter(Boolean).join(" · ") || "Code";

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the text is still selectable.
    }
  }

  return (
    <figure className={`overflow-hidden rounded-lg border border-role-border-default bg-role-bg-subtle ${className}`}>
      {(title || language || copyable) && (
        <figcaption className="flex min-h-11 items-center justify-between gap-3 border-b border-role-border-default pl-4 pr-1">
          <span className="truncate text-xs font-medium text-role-text-secondary">
            {title && <span className="text-role-text-primary">{title}</span>}
            {title && language && " · "}
            {language}
          </span>
          {copyable && (
            <button
              type="button"
              onClick={copy}
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-role-text-strong hover:bg-role-bg-hover"
            >
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
            </button>
          )}
        </figcaption>
      )}
      <pre tabIndex={wrap ? undefined : 0} aria-label={wrap ? undefined : name} className={`p-4 font-mono text-sm leading-6 text-role-text-primary ${wrap ? "whitespace-pre-wrap break-words" : "overflow-x-auto"}`}>
        <code className={showLineNumbers ? "grid grid-cols-[auto_1fr] gap-x-4" : undefined}>
          {showLineNumbers
            ? lines.map((line, i) => (
                <span key={i} className="contents">
                  <span aria-hidden="true" className="select-none text-right tabular-nums text-role-text-secondary">
                    {i + 1}
                  </span>
                  <span>{line || " "}</span>
                </span>
              ))
            : code.replace(/\n$/, "")}
        </code>
      </pre>
    </figure>
  );
}
