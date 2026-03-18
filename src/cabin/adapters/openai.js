/**
 * OpenAI model adapter for cabin diagnostic pass.
 *
 * Requires ENV: CABIN_OPENAI_API_KEY
 * Optional ENV: CABIN_OPENAI_MODEL (default: gpt-4o-mini)
 *
 * @implements {import('./types').ModelAdapter}
 * @experimental
 */

const DEFAULT_MODEL = 'gpt-4o-mini';

export function createOpenAIAdapter(options = {}) {
  const apiKey = options.apiKey ?? process.env.CABIN_OPENAI_API_KEY;
  const model = options.model ?? process.env.CABIN_OPENAI_MODEL ?? DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error(
      'OpenAI adapter requires CABIN_OPENAI_API_KEY env variable or apiKey option.',
    );
  }

  return {
    name: `openai/${model}`,

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

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
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
          error: `OpenAI API error ${resp.status}: ${text.slice(0, 300)}`,
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
