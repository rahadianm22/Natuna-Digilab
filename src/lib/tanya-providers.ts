// The model chain behind /api/tanya, in the spirit of a small 9router: providers are tried in
// order, the first one that answers wins, and a busy or failing one is skipped for a while.
// Every entry speaks the OpenAI chat-completions dialect, so one request builder fits all.

export interface TanyaProvider {
  /** Stable id, also used by TANYA_PROVIDERS to set the order. */
  id: string;
  /** Shown to the visitor as "Answered by <label>". */
  label: string;
  baseUrl: string;
  /** Name of the env var that holds the key. The key itself never leaves the server. */
  keyEnv: string;
  model: string;
  /** Provider-specific body fields. Only fields that provider documents are sent. */
  extraBody?: Record<string, unknown>;
  /** Free tier, so the UI can say so honestly. */
  free: boolean;
}

const stripSlash = (url: string) => url.replace(/\/+$/, "");

/** GLM-5.x rejects thinking: disabled. GLM-4.x accepts it and then answers without a reasoning pause. */
function zaiExtras(model: string): Record<string, unknown> {
  return model.startsWith("glm-5")
    ? { thinking: { type: "enabled" }, reasoning_effort: "low" }
    : { thinking: { type: "disabled" } };
}

function label(model: string): string {
  const known: Record<string, string> = {
    "glm-4.7-flash": "GLM-4.7-Flash (Z.ai, free)",
    "glm-4.5-flash": "GLM-4.5-Flash (Z.ai, free)",
  };
  return known[model] ?? model;
}

function splitList(value: string | undefined, fallback: string[]): string[] {
  const source = value?.trim() ? value.split(",") : fallback;
  return source.map((s) => s.trim()).filter(Boolean).filter((s, i, all) => all.indexOf(s) === i);
}

function base(): TanyaProvider[] {
  const list: TanyaProvider[] = [];

  if (process.env.ZAI_API_KEY) {
    const baseUrl = stripSlash(process.env.ZAI_BASE_URL ?? "https://api.z.ai/api/paas/v4");
    // The configured model first, then the free GLMs. Setting ZAI_MODEL to a paid model keeps the
    // free ones as fallback, so an empty balance degrades to free instead of failing.
    const models = [...splitList(process.env.ZAI_MODEL, ["glm-4.7-flash"]), "glm-4.7-flash", "glm-4.5-flash"].filter(
      (model, i, all) => all.indexOf(model) === i,
    );
    for (const model of models) {
      list.push({ id: `zai:${model}`, label: label(model), baseUrl, keyEnv: "ZAI_API_KEY", model, extraBody: zaiExtras(model), free: true });
    }
  }

  if (process.env.NVIDIA_API_KEY) {
    // NVIDIA's hosted NIM trial is free but meant for testing, not production. See .env.example.
    for (const model of splitList(process.env.TANYA_NVIDIA_MODELS, [
      "deepseek-ai/deepseek-v4.1-flash",
      "qwen/qwen3-next-80b-a3b-instruct",
    ])) {
      list.push({
        id: `nvidia:${model}`,
        label: `${model} (NVIDIA trial)`,
        baseUrl: "https://integrate.api.nvidia.com/v1",
        keyEnv: "NVIDIA_API_KEY",
        model,
        free: true,
      });
    }
  }

  if (process.env.DASHSCOPE_API_KEY) {
    // Alibaba Model Studio gives a free quota per model on new Singapore accounts.
    const model = process.env.TANYA_DASHSCOPE_MODEL ?? "qwen3.8-flash";
    list.push({
      id: `dashscope:${model}`,
      label: `${model} (Qwen, free quota)`,
      baseUrl: stripSlash(process.env.TANYA_DASHSCOPE_BASE_URL ?? "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"),
      keyEnv: "DASHSCOPE_API_KEY",
      model,
      free: true,
    });
  }

  if (process.env.OPENROUTER_API_KEY) {
    // OpenRouter's free list rotates; set TANYA_OPENROUTER_MODEL to whatever is free today.
    const model = process.env.TANYA_OPENROUTER_MODEL ?? "google/gemma-4-31b-it:free";
    list.push({
      id: `openrouter:${model}`,
      label: `${model} (OpenRouter, free)`,
      baseUrl: "https://openrouter.ai/api/v1",
      keyEnv: "OPENROUTER_API_KEY",
      model,
      free: true,
    });
  }

  if (process.env.DEEPSEEK_API_KEY) {
    const model = process.env.TANYA_DEEPSEEK_MODEL ?? "deepseek-chat";
    list.push({
      id: `deepseek:${model}`,
      label: `${model} (DeepSeek)`,
      baseUrl: "https://api.deepseek.com/v1",
      keyEnv: "DEEPSEEK_API_KEY",
      model,
      free: false,
    });
  }

  // Any other OpenAI-compatible endpoint, such as Xiaomi MiMo or a local model. Fill the three
  // TANYA_CUSTOM_* vars to add it at the end of the chain.
  const customUrl = process.env.TANYA_CUSTOM_BASE_URL;
  const customKey = process.env.TANYA_CUSTOM_API_KEY;
  const customModel = process.env.TANYA_CUSTOM_MODEL;
  if (customUrl && customKey && customModel) {
    list.push({
      id: `custom:${customModel}`,
      label: process.env.TANYA_CUSTOM_LABEL ?? customModel,
      baseUrl: stripSlash(customUrl),
      keyEnv: "TANYA_CUSTOM_API_KEY",
      model: customModel,
      free: true,
    });
  }

  return list;
}

/**
 * The chain for this request. Providers without a key are dropped. TANYA_PROVIDERS, when set,
 * lists provider ids in priority order and narrows the chain to them.
 */
export function resolveTanyaProviders(): TanyaProvider[] {
  const all = base();
  const wanted = splitList(process.env.TANYA_PROVIDERS, []);
  if (!wanted.length) return all;
  return wanted.map((id) => all.find((p) => p.id === id)).filter((p): p is TanyaProvider => !!p);
}

/** How long to wait for response headers before trying the next provider. */
export function providerTimeoutMs(): number {
  const raw = Number(process.env.TANYA_PROVIDER_TIMEOUT_MS);
  if (!Number.isFinite(raw) || raw <= 0) return 8000;
  return Math.min(Math.max(raw, 1000), 30000);
}

export function providerKey(provider: TanyaProvider): string | undefined {
  return process.env[provider.keyEnv];
}
