/**
 * Projection pipeline types.
 *
 * Runtime constants and factory functions for the projection pipeline.
 * TypeScript interfaces/types live in types.d.ts (if needed).
 */

export const SemanticRole = {
  FOCUS: 'focus',
  NEIGHBOR: 'neighbor',
  STRUCTURAL: 'structural',
  CONTEXT: 'context',
  PERIPHERAL: 'peripheral',
  HIDDEN: 'hidden',
};

/** @returns {{ depth: number, visibilityMode: string, domainId: null, workbenchId: null, workbenches: [], characterId: null, characters: [] }} */
export function defaultParams() {
  return {
    depth: 1,
    visibilityMode: 'all',
    domainId: null,
    workbenchId: null,
    workbenches: [],
    characterId: null,
    characters: [],
  };
}

/** @returns {{ nodeId: null, path: [] }} */
export function emptyFocus() {
  return { nodeId: null, path: [] };
}
