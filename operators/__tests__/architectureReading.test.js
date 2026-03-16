/**
 * Architecture Reading Workflow — Reproducibility Tests
 *
 * Verifies 3 canonical architecture-reading scenarios on documentation-world:
 *   Q1: Spec→Implementation traceability (Trace)
 *   Q2: World-facing ↔ Core boundary detection (Trace GAP + Compare)
 *   Q3: Cross-layer rival explanatory paths (Compare)
 *
 * Plus determinism and exploration-only invariant checks.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { trace } from '../trace.js';
import { compare } from '../compare.js';
import { normalizeGraphByRedirects } from '../normalizeGraphByRedirects.js';
import { supportsCompare } from '../supports.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..', '..', 'worlds', 'documentation-world');

let graph;

const PROJECTION_SPEC = 'https://www.notion.so/435b2b96d0ec40b2a7262b1151a23380';
const PROJECT_GRAPH_JS = 'code:file:src/core/projection/projectGraph.js';
const EVALUATE_JS = 'code:file:src/core/knowledge/evaluate.js';
const WORLD_ADAPTER_JS = 'code:file:src/engine/WorldAdapter.js';
const GRAPH_MODEL_JS = 'code:file:src/core/GraphModel.js';

beforeAll(() => {
  const rawNodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const rawEdges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
  graph = normalizeGraphByRedirects({ nodes: rawNodes, edges: rawEdges });
});

describe('Architecture Reading — Exploration Only', () => {
  test('Q1: projectGraph.js → PROJECTION_SPEC has direct implements path (1 hop)', () => {
    const result = trace(graph, PROJECT_GRAPH_JS, PROJECTION_SPEC);

    expect(result.ok).toBe(true);
    expect(result.hops).toBe(1);
    expect(result.path[0].nodeId).toBe(PROJECT_GRAPH_JS);
    expect(result.path[1].nodeId).toBe(PROJECTION_SPEC);
  });

  test('Q2: WorldAdapter.js has no directed path to GraphModel.js (layer boundary)', () => {
    const traceResult = trace(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
    expect(traceResult.ok).toBe(false);
    expect(traceResult.reason).toBe('no_path');
  });

  test('Q2: Compare finds rival undirected paths across the layer boundary', () => {
    const sc = supportsCompare(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
    expect(sc.ok).toBe(true);
    expect(sc.detail.paths).toBe(2);

    const result = compare(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
    expect(result.ok).toBe(true);
    expect(result.pathCount).toBe(2);
    expect(result.diff).toBeDefined();
    expect(result.diff.sharedNodes.length).toBeGreaterThanOrEqual(1);
  });

  test('Q3: PROJECTION_SPEC → evaluate.js has 13 rival cross-layer paths', () => {
    const sc = supportsCompare(graph, PROJECTION_SPEC, EVALUATE_JS);
    expect(sc.ok).toBe(true);
    expect(sc.detail.paths).toBe(13);

    const result = compare(graph, PROJECTION_SPEC, EVALUATE_JS);
    expect(result.ok).toBe(true);
    expect(result.pathCount).toBe(13);
    expect(result.diff.humanNotes.length).toBeGreaterThan(0);
  });

  test('all scenarios are deterministic across runs', () => {
    const t1a = trace(graph, PROJECT_GRAPH_JS, PROJECTION_SPEC);
    const t1b = trace(graph, PROJECT_GRAPH_JS, PROJECTION_SPEC);
    expect(t1a.hops).toBe(t1b.hops);

    const c1a = compare(graph, PROJECTION_SPEC, EVALUATE_JS);
    const c1b = compare(graph, PROJECTION_SPEC, EVALUATE_JS);
    expect(c1a.pathCount).toBe(c1b.pathCount);
    expect(c1a.diff.sharedNodes).toEqual(c1b.diff.sharedNodes);

    const c2a = compare(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
    const c2b = compare(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
    expect(c2a.pathCount).toBe(c2b.pathCount);
  });

  test('exploration results carry no canonicalization markers', () => {
    const traceResult = trace(graph, PROJECT_GRAPH_JS, PROJECTION_SPEC);
    expect(traceResult).not.toHaveProperty('canonicalized');
    expect(traceResult).not.toHaveProperty('accepted');
    expect(traceResult).not.toHaveProperty('status');

    const compareResult = compare(graph, PROJECTION_SPEC, EVALUATE_JS);
    expect(compareResult).not.toHaveProperty('canonicalized');
    expect(compareResult).not.toHaveProperty('accepted');
  });
});
