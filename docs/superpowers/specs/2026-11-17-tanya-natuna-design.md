# Tanya Natuna: design

Date: 17 November 2026
Status: draft for review

## Overview

A conversational AI agent on the Natuna Digilab site. Visitors ask about the design system (components, tokens, build status, usage) and get answers in their own language. Backend is GLM through the Z.ai OpenAI-compatible API, called from a server route so the API key never reaches the browser. The default model is the free GLM-4.7-Flash.

Name in the UI: "Tanya Natuna". Site copy stays English; the name is a brand.

## Goals

- Visitors can ask about the design system from any page.
- Answers are grounded in the site's own data, not generic LLM output.
- Streaming responses, so the agent feels alive.
- The API key and any upstream access stay server-side.
- Abuse and cost controls from day one.

## Non-goals (v1)

- No 3D avatar or animated character. Text chat first.
- No RAG or vector database. The site data is small and already structured.
- No chat history persistence. State lives in the component; a page reload resets it.
- No accounts or login.
- No tool calling. The agent answers; it does not act.

## Architecture

```
Browser
  ├─ /tanya page (full-page chat)
  └─ floating launcher on every page (opens a Drawer)
        └─ POST /api/tanya ──► Z.ai chat/completions (stream: true)
                                   ▲
                    system prompt built from site data
```

The route is the only caller of Z.ai. It validates input, applies rate limits, and forwards the SSE stream.

## Files

| File | Purpose |
|---|---|
| `src/lib/tanya-knowledge.ts` | Builds the system prompt from `componentDocs`, `productTracker`, `palettes`, `roleByToken`, `components-data`, `site.ts`. One source of truth; no hand-copied facts. |
| `src/app/api/tanya/route.ts` | POST handler. Validation, rate limit, upstream call, SSE passthrough, error JSON. |
| `src/components/tanya/useTanyaStream.ts` | Client hook: fetch with AbortController, SSE parser, streaming state. |
| `src/components/tanya/TanyaChat.tsx` | Message list, input, send/stop/retry, suggested questions, empty state, disclaimer. |
| `src/components/tanya/TanyaLauncher.tsx` | Floating button + Drawer, reusing `src/ui/drawer.tsx`. |
| `src/app/tanya/page.tsx` | Full-page chat, same chat component without the Drawer. |
| `src/app/layout.tsx` | Mounts the launcher globally. |
| `Header.tsx`, `Footer.tsx` | "Tanya Natuna" links. |
| `e2e/tanya.spec.ts` | UI tests with the API route mocked. |

## API contract

`POST /api/tanya`

Request: `{ messages: Array<{ role: "user" | "assistant", content: string }> }`
- Maximum 8 messages kept; the route trims older ones.
- Each message at most 2,000 characters.
- Invalid shape: 400 with `{ error }`.

Response: SSE passthrough from Z.ai (`text/event-stream`), `Cache-Control: no-store`.
Client abort: the route aborts the upstream fetch via `request.signal`.
Upstream failure: 502 `{ error }`. No stack traces in responses.

Errors are plain JSON, never leaked internals.

## Agent behavior

System prompt includes:
- Identity: Natuna, the assistant for the Natuna Digilab design system.
- Scope: only answer about this design system and its pages. If a detail is not in the provided facts, say it is not available and link the relevant page. Never invent component statuses, token values, or dates.
- Language rule: answer in the language of the user's last message.
- Formatting: short paragraphs and lists; no markdown tables (the bubble renderer is lightweight).

Grounded facts injected into the prompt: page list, tracked components and their statuses, coded components with props and a11y notes, color ramps and role tokens, responsive range, how to get the Figma file and code. GLM always thinks; reasoning effort is set to "low" for speed and cost.

## UI

- Desktop: right Drawer, 400px. Phone: full width. Native `<dialog>` gives focus trap, Escape close, inert page.
- Bubbles: user `bg-brand` white text; assistant `bg-role-bg-surface` with border. Only existing role tokens.
- Streaming text appears word by word. Stop button while streaming. Retry on failure. Until the first token arrives the bubble shows "Thinking", so a busy free model never looks frozen.
- Empty state with three suggested questions.
- Small disclaimer: "Natuna can be wrong. The docs are the source of truth." The model name, provider and the fact that answers come from an AI are not shown to visitors.
- Accessibility: 44px tap targets, AAA contrast, `aria-live` on the message list, visible focus, respects `prefers-reduced-motion` (no entrance animation beyond what the site already uses).
- Light text formatting only (paragraphs, lists, bold, inline code). All user and model text is escaped; never `dangerouslySetInnerHTML`.

## Security and cost controls

- `ZAI_API_KEY`, `ZAI_BASE_URL`, `ZAI_MODEL` are server-only env vars, documented in `.env.example`. Optional provider keys (`NVIDIA_API_KEY`, `DASHSCOPE_API_KEY`, `OPENROUTER_API_KEY`, `DEEPSEEK_API_KEY`, `TANYA_CUSTOM_*`) are documented there too.
- In-memory per-IP rate limit plus a daily cap. On Vercel this is per-instance; upgrade to Upstash Redis before the site gets real traffic. Acknowledged v1 limitation.
- `max_tokens` capped (2048), history trimmed, upstream timeout 60s (`maxDuration = 60`).
- `.env.local` is git-ignored (already in `.gitignore`).

## Model chain and cost

- The route is a small fallback router, in the spirit of 9router. Providers speak the OpenAI chat-completions API and are tried in order; the first one that answers wins.
- Default chain: `ZAI_MODEL` (default `glm-4.7-flash`), then `glm-4.5-flash`, both free on Z.ai ($0 in, out and cache). If `ZAI_MODEL` is a paid model, the free models stay in the chain as fallback, so an empty balance degrades to free instead of failing.
- Optional providers join automatically when their key is set: NVIDIA NIM trial (DeepSeek and Qwen), Alibaba Model Studio (Qwen free quota), OpenRouter free models, DeepSeek's paid API, and one custom slot for Xiaomi MiMo or a local model server. `TANYA_PROVIDERS` sets the order; `TANYA_PROVIDER_TIMEOUT_MS` sets the per-provider wait (default 8s).
- A provider that fails is skipped for 60 seconds, so a dead free tier does not cost every visitor the same timeout. When every provider is cooling down, the route tries them all anyway.
- The response does not carry the provider or model name. Visitors see a single assistant called Natuna; the chain is an internal detail.
- Thinking is disabled on GLM-4.x, so answers start without a reasoning pause. GLM-5.x rejects that flag, so it gets `thinking: enabled` with `reasoning_effort: low`.
- NVIDIA's free trial terms limit it to testing and evaluation, not production. Noted in `.env.example`.
- Base URL `https://api.z.ai/api/paas/v4` (standard API; free models work without balance, paid models need one).
- The GLM Coding Plan endpoint is not used; it is meant for dev tools, not public sites.

## Testing

- Playwright intercepts `**/api/tanya` with a fake SSE stream: open launcher, send a message, see streamed text, Stop, Escape close, /tanya page, axe checks in light and dark.
- CI never calls Z.ai; no tokens spent.
- Checks: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test:e2e`.

## Open questions

None blocking. The only external dependency is API balance on Z.ai.
