"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface AskMessage {
  role: "user" | "assistant";
  content: string;
}

export type AskStatus = "idle" | "streaming" | "error";

const FALLBACK_ERROR = "The answer could not be loaded. Try again in a moment.";

/** Streams answers from /api/ask and keeps the message list. One conversation per mount. */
export function useAskStream() {
  const [messages, setMessages] = useState<AskMessage[]>([]);
  const [status, setStatus] = useState<AskStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  // A mirror for callbacks, so send and retry always see the latest list without re-creating them.
  const messagesRef = useRef<AskMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const stop = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  const run = useCallback(async (history: AskMessage[]) => {
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus("streaming");
    setError(null);
    // The empty assistant bubble is the typing indicator: content grows into it.
    setMessages([...history, { role: "assistant", content: "" }]);
    let content = "";
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok) {
        let message = FALLBACK_ERROR;
        try {
          const data = await res.json();
          if (typeof data?.error === "string") message = data.error;
        } catch {
          // Keep the fallback: an error body can be anything.
        }
        throw new Error(message);
      }
      if (!res.body) throw new Error(FALLBACK_ERROR);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        // SSE events are separated by a blank line; each data line is one JSON chunk of the answer.
        let separator = buffer.indexOf("\n\n");
        while (separator !== -1) {
          const event = buffer.slice(0, separator);
          buffer = buffer.slice(separator + 2);
          for (const line of event.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta) {
                content += delta;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = { role: "assistant", content };
                  return next;
                });
              }
            } catch {
              // A malformed chunk is skipped; the rest of the stream still renders.
            }
          }
          separator = buffer.indexOf("\n\n");
        }
      }
      if (!content.trim()) throw new Error(FALLBACK_ERROR);
      setStatus("idle");
    } catch (e) {
      if (controller.signal.aborted) {
        // A deliberate stop keeps whatever arrived and returns to idle, not to an error state.
        setStatus("idle");
        return;
      }
      setError(e instanceof Error && e.message ? e.message : FALLBACK_ERROR);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        return last?.role === "assistant" && !last.content ? prev.slice(0, -1) : prev;
      });
      setStatus("error");
    } finally {
      controllerRef.current = null;
    }
  }, []);

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || controllerRef.current) return;
      void run([...messagesRef.current, { role: "user", content }]);
    },
    [run],
  );

  const retry = useCallback(() => {
    if (controllerRef.current) return;
    const history = messagesRef.current;
    const lastUser = history.findLast((m) => m.role === "user");
    if (!lastUser) return;
    const end = history.lastIndexOf(lastUser);
    void run(history.slice(0, end + 1));
  }, [run]);

  return { messages, status, error, send, stop, retry };
}
