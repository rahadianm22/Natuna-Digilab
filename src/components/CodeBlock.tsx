"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";

export type Lang = "js" | "ts";

// Fixed hex values from the Natuna palette: the code surface is always dark, so these must not
// follow the light/dark token flip.
const tone = {
  keyword: "text-[#cfaaff]",
  string: "text-[#aad98c]",
  tag: "text-[#85d0ff]",
  attr: "text-[#fcd97d]",
  comment: "text-[#9aa4b2] italic",
  number: "text-[#ffa293]",
  plain: "text-[#f1f5f9]",
};

const pattern =
  /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*)|(\b[a-zA-Z][\w-]*(?==))|(\b(?:import|from|export|default|function|return|const|let|type|interface|true|false|null|undefined|async|await|if|else|new)\b)|(\b[A-Z][A-Za-z0-9]*\b)|(\b\d[\d_.]*\b)/g;

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of code.matchAll(pattern)) {
    const i = m.index ?? 0;
    if (i > last) out.push(code.slice(last, i));
    const cls = m[1] ? tone.comment : m[2] ? tone.string : m[3] ? tone.tag : m[4] ? tone.attr : m[5] ? tone.keyword : m[6] ? tone.tag : tone.number;
    out.push(
      <span key={key++} className={cls}>
        {m[0]}
      </span>,
    );
    last = i + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export default function CodeBlock({
  code,
  label,
  collapseAfter = 12,
}: {
  /** One snippet, or a JavaScript and a TypeScript version. */
  code: string | Record<Lang, string>;
  label: string;
  collapseAfter?: number;
}) {
  const id = useId();
  const variants = typeof code === "string" ? null : code;
  const [lang, setLang] = useState<Lang>("ts");
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

  const text = variants ? variants[lang] : (code as string);
  const lines = text.split("\n").length;
  const collapsible = lines > collapseAfter;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    setTimeout(() => setCopied("idle"), 1800);
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const next = lang === "ts" ? "js" : "ts";
      setLang(next);
      document.getElementById(`${id}-${next}`)?.focus();
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#141b26]">
      <div className="flex min-h-12 items-center justify-between gap-3 border-b border-white/10 px-3">
        {variants ? (
          <div role="tablist" aria-label={`${label} language`} onKeyDown={onKey} className="flex rounded-lg bg-white/5 p-0.5">
            {(["ts", "js"] as const).map((l) => (
              <button
                key={l}
                id={`${id}-${l}`}
                type="button"
                role="tab"
                aria-selected={lang === l}
                aria-controls={`${id}-panel`}
                tabIndex={lang === l ? 0 : -1}
                onClick={() => setLang(l)}
                className={`min-h-8 rounded-md px-3 text-xs font-semibold transition-colors ${
                  lang === l ? "bg-[#026acc] text-white" : "text-[#cdd5df] hover:text-white"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        ) : (
          <span className="px-1 text-xs font-medium text-[#cdd5df]">{label}</span>
        )}
        <div className="flex items-center gap-1">
          {collapsible && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls={`${id}-panel`}
              className="min-h-8 rounded-md px-3 text-xs font-medium text-[#cdd5df] transition-colors hover:bg-white/10 hover:text-white"
            >
              {expanded ? "Collapse code" : "Expand code"}
            </button>
          )}
          <button
            type="button"
            onClick={copy}
            className="min-h-8 rounded-md bg-white/10 px-3 text-xs font-medium text-white transition-colors hover:bg-white/15 active:scale-[0.97]"
          >
            {copied === "done" ? "Copied" : copied === "failed" ? "Copy failed" : "Copy"}
          </button>
        </div>
      </div>
      <div
        id={`${id}-panel`}
        role={variants ? "tabpanel" : undefined}
        aria-labelledby={variants ? `${id}-${lang}` : undefined}
        className="relative"
      >
        <pre
          tabIndex={0}
          aria-label={`${label} code`}
          className={`overflow-x-auto p-5 font-mono-code text-[13px] leading-6 ${collapsible && !expanded ? "max-h-[18rem] overflow-y-hidden" : ""}`}
        >
          <code className={tone.plain}>{highlight(text)}</code>
        </pre>
        {collapsible && !expanded && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#141b26] to-transparent" />
        )}
      </div>
      <span role="status" className="sr-only">
        {copied === "done" ? "Code copied to clipboard" : copied === "failed" ? "Could not copy the code" : ""}
      </span>
    </div>
  );
}
