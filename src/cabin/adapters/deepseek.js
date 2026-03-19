/**
 * DeepSeek model adapter for cabin diagnostic pass.
 *
 * Uses OpenAI-compatible API at https://api.deepseek.com/v1.
 *
 * Requires ENV: CABIN_DEEPSEEK_API_KEY
 * Optional ENV: CABIN_DEEPSEEK_MODEL (default: deepseek-chat)
 *
 * @implements {import('./types').ModelAdapter}
 * @experimental
 */

const DEFAULT_MODEL = 'deepseek-chat';
const API_BASE = 'https://api.deepseek.com/v1/chat/completions';

export function createDeepSeekAdapter(options = {}) {
  const apiKey = options.apiKey ?? process.env.CABIN_DEEPSEEK_API_KEY;
  const model = options.model ?? process.env.CABIN_DEEPSEEK_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error(
      'DeepSeek adapter requires CABIN_DEEPSEEK_API_KEY env variable or apiKey option.',
    );
  }

  return {
    name: `deepseek/${model}`,

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
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const text = await resp.text();
        return {
          raw: text,
          parsed: null,
          error: `DeepSeek API error ${resp.status}: ${text.slice(0, 300)}`,
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
