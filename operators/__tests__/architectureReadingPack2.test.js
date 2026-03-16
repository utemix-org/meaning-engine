/**
 * Architecture Reading Pack 2 — Boundaries vs Explanations
 *
 * 3 cases × 2 tests each:
 *   Case 1: Directed boundary with undirected explanation
 *   Case 2: True isolation (GAP) with bridge candidates
 *   Case 3: Direction-dependent boundary (implements asymmetry)
 *
 * Plus determinism and exploration-only invariant.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { trace } from '../trace.js';
import { compare } from '../compare.js';
import { normalizeGraphByRedirects } from '../normalizeGraphByRedirects.js';
import { supportsCompare, supportsBridgeCandidates, rankBridgeCandidates } from '../supports.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..', '..', 'worlds', 'documentation-world');

let graph;

const NAVIGATION_SPEC = 'https://www.notion.so/b997b23c7bb94390be3351504e64d1fd';
const EVALUATE_JS = 'code:file:src/core/knowledge/evaluate.js';
const EVIDENCE_3A = 'evidence:grounding-phase-3a-tests';
const VALIDATE_JS = 'code:file:src/validate.js';
const APPLY_TRANSITION_JS = 'code:file:src/core/navigation/applyTransition.js';

beforeAll(() => {
  const rawNodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const rawEdges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
  graph = normalizeGraphByRedirects({ nodes: rawNodes, edges: rawEdges });
});

describe('Architecture Reading Pack 2 — Boundaries vs Explanations', () => {
  describe('Case 1: Directed boundary but explanation exists', () => {
    test('Trace NAVIGATION_SPEC → evaluate.js returns no_path (layer boundary)', () => {
      const result = trace(graph, NAVIGATION_SPEC, EVALUATE_JS);
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('no_path');
    });

    test('Compare finds 3 rival undirected routes around the boundary', () => {
      const sc = supportsCompare(graph, NAVIGATION_SPEC, EVALUATE_JS);
      expect(sc.ok).toBe(true);
      expect(sc.detail.paths).toBe(3);

      const result = compare(graph, NAVIGATION_SPEC, EVALUATE_JS);
      expect(result.ok).toBe(true);
      expect(result.pathCount).toBe(3);
      expect(result.diff.sharedNodes.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Case 2: True isolation (GAP) + bridge candidates', () => {
    test('Trace evidence → validate.js returns no_path (true GAP)', () => {
      const result = trace(graph, EVIDENCE_3A, VALIDATE_JS);
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('no_path');
    });

    test('supportsBridgeCandidates returns true with candidate concept', () => {
      const bc = supportsBridgeCandidates(graph, EVIDENCE_3A, VALIDATE_JS);
      expect(bc.ok).toBe(true);
      expect(bc.detail.candidateCount).toBeGreaterThanOrEqual(1);

      const candidates = rankBridgeCandidates(
        { fromId: EVIDENCE_3A, toId: VALIDATE_JS },
        graph,
      );
      expect(candidates.length).toBeGreaterThanOrEqual(1);
      expect(candidates[0].candidateConceptId).toBe('concept:code-spec-alignment');
    });
  });

  describe('Case 3: Boundary depends on direction', () => {
    test('Trace NAVIGATION_SPEC → applyTransition.js = no_path (spec does not depend on code)', () => {
      const result = trace(graph, NAVIGATION_SPEC, APPLY_TRANSITION_JS);
      expect(result.ok).toBe(false);
      expect(result.reason).toBe('no_path');
    });

    test('Trace applyTransition.js → NAVIGATION_SPEC = 1 hop path (code implements spec)', () => {
      const result = trace(graph, APPLY_TRANSITION_JS, NAVIGATION_SPEC);
      expect(result.ok).toBe(true);
      expect(result.hops).toBe(1);
      expect(result.path[0].nodeId).toBe(APPLY_TRANSITION_JS);
      expect(result.path[1].nodeId).toBe(NAVIGATION_SPEC);
    });
  });

  test('all cases are deterministic across runs', () => {
    const t1a = trace(graph, NAVIGATION_SPEC, EVALUATE_JS);
    const t1b = trace(graph, NAVIGATION_SPEC, EVALUATE_JS);
    expect(t1a.ok).toBe(t1b.ok);

    const c1a = compare(graph, NAVIGATION_SPEC, EVALUATE_JS);
    const c1b = compare(graph, NAVIGATION_SPEC, EVALUATE_JS);
    expect(c1a.pathCount).toBe(c1b.pathCount);
    expect(c1a.diff.sharedNodes).toEqual(c1b.diff.sharedNodes);

    const t3a = trace(graph, APPLY_TRANSITION_JS, NAVIGATION_SPEC);
    const t3b = trace(graph, APPLY_TRANSITION_JS, NAVIGATION_SPEC);
    expect(t3a.hops).toBe(t3b.hops);
  });

  test('exploration results carry no canonicalization markers', () => {
    const traceResult = trace(graph, APPLY_TRANSITION_JS, NAVIGATION_SPEC);
    expect(traceResult).not.toHaveProperty('canonicalized');
    expect(traceResult).not.toHaveProperty('accepted');
    expect(traceResult).not.toHaveProperty('status');

    const compareResult = compare(graph, NAVIGATION_SPEC, EVALUATE_JS);
    expect(compareResult).not.toHaveProperty('canonicalized');
    expect(compareResult).not.toHaveProperty('accepted');
  });
});
