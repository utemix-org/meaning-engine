/**
 * Adapter registry — resolves adapter name to instance.
 * @experimental
 */

import { stubAdapter } from './stub.js';
import { createOpenAIAdapter } from './openai.js';

export { stubAdapter, createOpenAIAdapter };

/**
 * @param {string} name
 * @param {object} [options]
 * @returns {import('./types').ModelAdapter}
 */
export function resolveAdapter(name, options = {}) {
  if (name === 'stub') return stubAdapter;
  if (name === 'openai') return createOpenAIAdapter(options);
  throw new Error(
    `Unknown model adapter: "${name}". Available: stub, openai`,
  );
}
