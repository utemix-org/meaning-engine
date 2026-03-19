/**
 * OpenRouter model adapter for cabin diagnostic pass.
 *
 * Uses OpenAI-compatible API at https://openrouter.ai/api/v1.
 * Supports any model available on OpenRouter (DeepSeek, Claude, GPT, etc.)
 *
 * Requires ENV: CABIN_OPENROUTER_API_KEY
 * Optional ENV: CABIN_OPENROUTER_MODEL (default: deepseek/deepseek-chat)
 *
 * @implements {import('./types').ModelAdapter}
 * @experimental
 */

const DEFAULT_MODEL = 'deepseek/deepseek-chat';
const API_BASE = 'https://openrouter.ai/api/v1/chat/completions';

export function createOpenRouterAdapter(options = {}) {
  const apiKey = options.apiKey ?? process.env.CABIN_OPENROUTER_API_KEY;
  const model = options.model ?? process.env.CABIN_OPENROUTER_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error(
      'OpenRouter adapter requires CABIN_OPENROUTER_API_KEY env variable or apiKey option.',
    );
  }

  return {
    name: `openrouter/${model}`,

    async invoke(request) {
      const messages = [
        { role: 'system', content: request.context.system_prompt },
        {
          role: 'user',
          content: JSON.stringify({
            mode: request.context.mode,
            world_summary: request.context.world_summary,
            question: request.context.question ?? null,
            probe: request.context.probe ?? null,
            output_schema: request.context.output_schema,
          }),
        },
      ];

      const body = {
        model,
        messages,
        temperature: request.model_config?.temperature ?? 0,
        max_tokens: request.model_config?.max_tokens ?? 2048,
        response_format: { type: 'json_object' },
      };

      const resp = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/utemix-org/meaning-engine',
          'X-Title': 'Meaning Engine Cabin Eval',
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const text = await resp.text();
        return {
          raw: text,
          parsed: null,
          error: `OpenRouter API error ${resp.status}: ${text.slice(0, 300)}`,
        };
      }

      const data = await resp.json();
      const raw = data.choices?.[0]?.message?.content ?? '';
      const usage = data.usage
        ? {
            prompt_tokens: data.usage.prompt_tokens,
            completion_tokens: data.usage.completion_tokens,
          }
        : undefined;

      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return { raw, parsed: null, error: `JSON parse failed: ${raw.slice(0, 200)}`, usage };
      }

      return { raw, parsed, usage };
    },
  };
}
