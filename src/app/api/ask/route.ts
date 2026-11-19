import { buildAskSystemPrompt } from "@/lib/ask-knowledge";
import { providerKey, providerTimeoutMs, resolveAskProviders, type AskProvider } from "@/lib/ask-providers";

// The only caller of the model providers. Keys stay server-side; the browser talks to this route.
export const maxDuration = 60;

const MAX_MESSAGES = 8;
const MAX_CHARS = 2000;
const MAX_TOKENS = 2048;

// In-memory rate limit. On serverless this is per instance; move to a shared store (Upstash Redis or
// Vercel KV) before the site gets real traffic.
const HOURLY_LIMIT = 20;
const HOURLY_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, { count: number; reset: number }>();

// A provider that just failed is skipped for a minute, so a dead free tier does not cost every
// visitor the same timeout. Same idea as the fallback chain in a local router.
const COOLDOWN_MS = 60 * 1000;
const cooldown = new Map<string, number>();

type ChatMessage = { role: "user" | "assistant"; content: string };

type Chunk = {
  role: "system" | "user" | "assistant";
  content: string;
};

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "local";
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + HOURLY_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > HOURLY_LIMIT;
}

function parseMessages(raw: unknown): ChatMessage[] | null {
  if (typeof raw !== "object" || raw === null) return null;
  const list = (raw as { messages?: unknown }).messages;
  if (!Array.isArray(list) || list.length === 0) return null;
  const out: ChatMessage[] = [];
  for (const item of list) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text) return null;
    out.push({ role, content: text.slice(0, MAX_CHARS) });
  }
  if (out[out.length - 1]!.role !== "user") return null;
  return out;
}

/** Z.ai puts a numeric code in the error body: 1113 is no balance, 1305 is a busy free model. */
async function upstreamErrorCode(res: Response): Promise<string | undefined> {
  try {
    const data = (await res.clone().json()) as { error?: { code?: unknown } };
    return typeof data.error?.code === "string" ? data.error.code : undefined;
  } catch {
    return undefined;
  }
}

async function callProvider(provider: AskProvider, apiKey: string, messages: Chunk[], signal: AbortSignal) {
  const body = {
    model: provider.model,
    stream: true,
    max_tokens: MAX_TOKENS,
    temperature: 0.6,
    ...provider.extraBody,
    messages,
  };
  return fetch(`${provider.baseUrl}/chat/completions`, {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Z.ai sits behind Cloudflare; a bare Node user agent gets challenged from datacenter IPs.
      "User-Agent": "NatunaDigilab/1.0 (+https://natunadigilab.vercel.app)",
    },
    body: JSON.stringify(body),
  }).catch(() => null);
}

function markFailed(id: string) {
  cooldown.set(id, Date.now() + COOLDOWN_MS);
  if (cooldown.size > 500) {
    const now = Date.now();
    for (const [k, until] of cooldown) if (until < now) cooldown.delete(k);
  }
}

export async function POST(request: Request) {
  if (rateLimited(clientKey(request))) {
    return Response.json({ error: "Too many questions from this address for now. Try again in an hour." }, { status: 429 });
  }

  const providers = resolveAskProviders();
  if (!providers.length) {
    return Response.json({ error: "Ask Natuna is not available right now. Try again later." }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "The request body is not valid JSON." }, { status: 400 });
  }
  const messages = parseMessages(raw);
  if (!messages) {
    return Response.json({ error: "Messages must end with a non-empty user message." }, { status: 400 });
  }

  const now = Date.now();
  const fresh = providers.filter((p) => (cooldown.get(p.id) ?? 0) <= now);
  // When every provider is cooling down, try them all anyway: stale state must not block all traffic.
  const chain = fresh.length ? fresh : providers;
  const timeoutMs = providerTimeoutMs();

  // With a single provider, give it one short retry instead of failing on the first overload.
  const attempts = chain.length === 1 ? [chain[0]!, chain[0]!] : chain;

  let busy = false;
  let noBalance = false;
  let attempted = 0;

  for (let i = 0; i < attempts.length; i++) {
    const provider = attempts[i]!;
    if (request.signal.aborted) return new Response(null, { status: 499 });
    if (i > 0 && provider.id === attempts[i - 1]!.id) await new Promise((r) => setTimeout(r, 600));

    const apiKey = providerKey(provider);
    if (!apiKey) continue;

    attempted++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let upstream: Response | null = null;
    try {
      upstream = await callProvider(
        provider,
        apiKey,
        [{ role: "system", content: buildAskSystemPrompt() }, ...messages.slice(-MAX_MESSAGES)],
        AbortSignal.any([request.signal, controller.signal]),
      );
    } finally {
      clearTimeout(timer);
    }

    // The visitor closed the tab: drop the upstream call instead of writing into nothing.
    if (request.signal.aborted) {
      await upstream?.body?.cancel().catch(() => {});
      return new Response(null, { status: 499 });
    }

    if (upstream?.ok && upstream.body) {
      return new Response(upstream.body, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-store",
          // Vercel and proxies buffer unless told otherwise; SSE needs every chunk out immediately.
          "X-Accel-Buffering": "no",
        },
      });
    }

    if (upstream) {
      const code = await upstreamErrorCode(upstream);
      if (code === "1113") noBalance = true;
      if (code === "1305" || upstream.status === 429) busy = true;
      console.error(`[ask] ${provider.id} answered ${upstream.status}${code ? ` code ${code}` : ""}`);
      await upstream.body?.cancel().catch(() => {});
    } else {
      console.error(`[ask] ${provider.id} did not respond`);
    }
    markFailed(provider.id);
  }

  const error =
    busy && !noBalance
      ? "Natuna is busy right now. Try again in a minute."
      : !busy && noBalance
        ? "Natuna is unavailable right now. Try again later."
        : attempted === 0
          ? "Ask Natuna is not available right now. Try again later."
          : "Natuna could not answer. Try again in a moment.";
  return Response.json({ error }, { status: attempted === 0 ? 503 : 502 });
}
