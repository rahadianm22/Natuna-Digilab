"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { ArrowCounterClockwise, PaperPlaneRight, Stop } from "@phosphor-icons/react";
import { IconButton } from "@/ui";
import { askSuggestions } from "@/lib/ask-knowledge";
import { useAskStream } from "./useAskStream";

// Inline markdown: bold, inline code. Everything else stays plain text, so no HTML can sneak in.
function inline(text: string, keyBase: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .map((part, i) => {
      const key = `${keyBase}-${i}`;
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return <strong key={key}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code key={key} className="rounded-sm bg-role-bg-subtle px-1 font-label text-[0.9em]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={key}>{part}</span>;
    });
}

function richText(text: string, keyBase: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (!list) return;
    const key = `${keyBase}-list-${blocks.length}`;
    blocks.push(
      list.ordered ? (
        <ol key={key} className="list-decimal pl-4">
          {list.items.map((item, i) => (
            <li key={i}>{inline(item, `${key}-${i}`)}</li>
          ))}
        </ol>
      ) : (
        <ul key={key} className="list-disc pl-4">
          {list.items.map((item, i) => (
            <li key={i}>{inline(item, `${key}-${i}`)}</li>
          ))}
        </ul>
      ),
    );
    list = null;
  };

  text.split("\n").forEach((line, i) => {
    const t = line.trim().replace(/^#{1,6}\s+/, ""); // Stray headings become plain text.
    const bullet = /^[-*•]\s+(.*)$/.exec(t);
    const ordered = /^\d+[.)]\s+(.*)$/.exec(t);
    if (bullet) {
      if (list && list.ordered) flush();
      list ??= { ordered: false, items: [] };
      list.items.push(bullet[1]!);
      return;
    }
    if (ordered) {
      if (list && !list.ordered) flush();
      list ??= { ordered: true, items: [] };
      list.items.push(ordered[1]!);
      return;
    }
    flush();
    if (t) blocks.push(<p key={`${keyBase}-p-${i}`}>{inline(t, `${keyBase}-p-${i}`)}</p>);
  });
  flush();
  return blocks;
}

export default function AskChat({ autoFocus = false, className = "" }: { autoFocus?: boolean; className?: string }) {
  const { messages, status, error, send, stop, retry } = useAskStream();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const streaming = status === "streaming";

  useEffect(() => {
    const el = scrollRef.current;
    // Instant, not smooth, so the follow never fights prefers-reduced-motion.
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function resize() {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim() || streaming) return;
    send(draft);
    setDraft("");
    requestAnimationFrame(() => {
      resize();
      areaRef.current?.focus();
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      (e.currentTarget.form as HTMLFormElement).requestSubmit();
    }
  }

  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      <div
        ref={scrollRef}
        role="log"
        aria-label="Conversation with Natuna"
        aria-live="polite"
        aria-busy={streaming || undefined}
        className="grow overflow-y-auto overscroll-contain px-4 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <Image src="/natuna-logo.svg" alt="" width={44} height={44} className="h-11 w-11" />
            <div className="flex flex-col gap-1">
              <p className="font-display text-lg font-bold text-role-text-primary">Hi, I am Natuna.</p>
              <p className="max-w-[300px] text-sm text-role-text-secondary">
                Ask me about the design system: components, tokens, statuses, and how to use them.
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-2 pt-1">
              {askSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="min-h-11 rounded-full border border-role-border-input px-4 py-2 text-sm text-role-text-strong transition-colors hover:bg-role-bg-hover"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-[640px] flex-col gap-4">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap rounded-lg bg-role-bg-brand px-3.5 py-2 text-sm leading-relaxed text-role-text-on-brand">
                    {m.content}
                  </p>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2.5">
                  <Image src="/natuna-logo.svg" alt="" width={24} height={24} className="mt-0.5 h-6 w-6 shrink-0" />
                  {/* The empty streaming bubble carries the pulse; a real answer renders in its place. */}
                  {m.content ? (
                    <div className="min-w-0 max-w-[92%] rounded-lg border border-role-border-default bg-role-bg-canvas px-3.5 py-2.5 text-sm leading-relaxed text-role-text-primary">
                      <div className="flex flex-col gap-2">{richText(m.content, `m-${i}`)}</div>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2.5 rounded-lg border border-role-border-default bg-role-bg-canvas px-3.5 py-2.5">
                      <span aria-hidden="true" className="flex animate-pulse gap-1 motion-reduce:animate-none">
                        <span className="size-1.5 rounded-full bg-role-text-tertiary" />
                        <span className="size-1.5 rounded-full bg-role-text-tertiary" />
                        <span className="size-1.5 rounded-full bg-role-text-tertiary" />
                      </span>
                      <span className="text-sm text-role-text-secondary">Thinking</span>
                    </span>
                  )}
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <div className="border-t border-role-border-default">
        {error && (
          <p className="flex items-center gap-2 px-4 pt-3 text-sm text-role-text-danger" role="alert">
            {error}
            <IconButton label="Try again" icon={<ArrowCounterClockwise size={16} aria-hidden="true" />} onClick={retry} />
          </p>
        )}
        <form onSubmit={submit} className="flex items-end gap-2 p-3">
          <textarea
            ref={areaRef}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              resize();
            }}
            onKeyDown={onKeyDown}
            rows={1}
            aria-label="Your message"
            placeholder="Ask about the design system"
            autoFocus={autoFocus}
            maxLength={2000}
            className="min-h-11 grow resize-none rounded-md border border-role-border-input bg-role-bg-surface px-3 py-2.5 text-base leading-6 text-role-text-primary placeholder:text-role-text-secondary focus-visible:border-role-border-focus focus-visible:outline-none"
          />
          {streaming ? (
            <IconButton label="Stop generating" icon={<Stop size={18} aria-hidden="true" />} variant="secondary" onClick={stop} />
          ) : (
            <IconButton label="Send message" icon={<PaperPlaneRight size={18} aria-hidden="true" />} variant="primary" disabled={!draft.trim()} type="submit" />
          )}
        </form>
        <p className="px-4 pb-3 text-xs text-role-text-secondary">
          Natuna can be wrong. The docs are the source of truth.
        </p>
      </div>
    </div>
  );
}
