/**
 * Adapter registry — resolves adapter name to instance.
 * @experimental
 */

import { stubAdapter } from './stub.js';
import { createOpenAIAdapter } from './openai.js';
import { createDeepSeekAdapter } from './deepseek.js';
import { createOpenRouterAdapter } from './openrouter.js';

export { stubAdapter, createOpenAIAdapter, createDeepSeekAdapter, createOpenRouterAdapter };

/**
 * @param {string} name
 * @param {object} [options]
 * @returns {import('./types').ModelAdapter}
 */
export function resolveAdapter(name, options = {}) {
  if (name === 'stub') return stubAdapter;
  if (name === 'openai') return createOpenAIAdapter(options);
  if (name === 'deepseek') return createDeepSeekAdapter(options);
  if (name === 'openrouter') return createOpenRouterAdapter(options);
  throw new Error(
    `Unknown model adapter: "${name}". Available: stub, openai, deepseek, openrouter`,
  );
}
