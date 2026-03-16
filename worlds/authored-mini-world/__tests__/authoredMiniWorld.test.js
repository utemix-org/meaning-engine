/**
 * Authored Mini-World — Smoke tests + Reference workflow (4 scenarios)
 *
 * Validates that:
 *   - the world loads correctly and graph invariants hold
 *   - all 4 control situations produce expected operator results
 *   - operators work without modification on an authored (non-extracted) world
 *   - exploration ≠ acceptance
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadAuthoredMiniWorld } from '../loader.js';
import { trace } from '../../../operators/trace.js';
import { compare } from '../../../operators/compare.js';
import {
  supportsInspect,
  supportsTrace,
  supportsCompare,
  supportsBridgeCandidates,
  rankBridgeCandidates,
} from '../../../operators/supports.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..');

let graphModel;
let rawGraph;

beforeAll(() => {
  const result = loadAuthoredMiniWorld();
  graphModel = result.graph;

  const rawN = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const rawE = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
  rawGraph = { nodes: rawN, edges: rawE };
});

describe('Authored Mini-World — Smoke Tests', () => {
  test('loader returns graph and meta', () => {
    const { graph, meta } = loadAuthoredMiniWorld();
    expect(graph).toBeDefined();
    expect(meta.nodeCount).toBe(25);
    expect(meta.edgeCount).toBe(27);
    expect(meta.nodeTypes).toContain('spec');
    expect(meta.nodeTypes).toContain('concept');
    expect(meta.nodeTypes).toContain('invariant');
    expect(meta.nodeTypes).toContain('evidence');
    expect(meta.nodeTypes).toContain('code_artifact');
  });

  test('GraphModel instance has correct node/edge counts', () => {
    expect(graphModel.getNodes().length).toBe(25);
    expect(graphModel.getEdges().length).toBe(27);
  });

  test('all nodes have id, type, and title', () => {
    for (const n of rawGraph.nodes) {
      expect(n.id).toBeTruthy();
      expect(n.type).toBeTruthy();
      expect(n.title).toBeTruthy();
    }
  });

  test('all edges reference existing nodes', () => {
    const nodeIds = new Set(rawGraph.nodes.map((n) => n.id));
    for (const e of rawGraph.edges) {
      expect(nodeIds.has(e.source)).toBe(true);
      expect(nodeIds.has(e.target)).toBe(true);
    }
  });

  test('no duplicate node IDs', () => {
    const ids = rawGraph.nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('supportsInspect returns ok', () => {
    expect(supportsInspect(rawGraph).ok).toBe(true);
  });

  test('supportsTrace returns ok', () => {
    expect(supportsTrace(rawGraph).ok).toBe(true);
  });
});

describe('Authored Mini-World — 4 Control Scenarios', () => {
  // ─── S1: Path exists ──────────────────────────────────────────────────
  describe('S1: Path exists', () => {
    test('Trace(TTO → coq-proof) finds a directed path', () => {
      const result = trace(rawGraph, 'spec:type-theory-overview', 'evidence:coq-proof');
      expect(result.hops).toBeGreaterThanOrEqual(2);
      expect(result.hops).toBeLessThanOrEqual(4);
    });

    test('path passes through concept and invariant layers', () => {
      const result = trace(rawGraph, 'spec:type-theory-overview', 'evidence:coq-proof');
      const path = result.path.map((s) => s.nodeId);
      expect(path).toContain('spec:type-theory-overview');
      expect(path).toContain('evidence:coq-proof');
      const middleTypes = result.path
        .slice(1, -1)
        .map((s) => rawGraph.nodes.find((n) => n.id === s.nodeId)?.type);
      expect(middleTypes.some((t) => t === 'concept' || t === 'invariant')).toBe(true);
    });
  });

  // ─── S2: Directed boundary ────────────────────────────────────────────
  describe('S2: Directed boundary', () => {
    test('Trace(TTO → typeChecker) = no_path', () => {
      const result = trace(rawGraph, 'spec:type-theory-overview', 'code_artifact:type-checker');
      expect(result.hops).toBeUndefined();
    });

    test('Trace(typeChecker → TTO) = path (1 hop via implements)', () => {
      const result = trace(rawGraph, 'code_artifact:type-checker', 'spec:type-theory-overview');
      expect(result.hops).toBe(1);
    });
  });

  // ─── S3: Rival explanations ───────────────────────────────────────────
  describe('S3: Rival explanations', () => {
    test('Compare(TTO → inferenceEngine) finds ≥ 2 rival paths', () => {
      const result = compare(rawGraph, 'spec:type-theory-overview', 'code_artifact:inference-engine');
      expect(result.ok).toBe(true);
      expect(result.pathCount).toBeGreaterThanOrEqual(2);
    });

    test('supportsCompare returns ok for TTO → inferenceEngine', () => {
      const result = supportsCompare(
        rawGraph,
        'spec:type-theory-overview',
        'code_artifact:inference-engine',
      );
      expect(result.ok).toBe(true);
    });

    test('rival paths show different structural signatures', () => {
      const result = compare(rawGraph, 'spec:type-theory-overview', 'code_artifact:inference-engine');
      const paths = result.paths;
      const conceptCounts = paths.map(
        (p) => p.nodeTypeHistogram['concept'] || 0,
      );
      const codeCounts = paths.map(
        (p) => p.nodeTypeHistogram['code_artifact'] || 0,
      );
      const hasConceptHeavy = conceptCounts.some((c) => c >= 1);
      const hasCodeHeavy = codeCounts.some((c) => c >= 3);
      expect(hasConceptHeavy).toBe(true);
      expect(hasCodeHeavy).toBe(true);
    });
  });

  // ─── S4: True GAP + bridge candidates ─────────────────────────────────
  describe('S4: True GAP + bridge candidates', () => {
    test('Trace(TTO → rust-borrow-checker-test) = no_path', () => {
      const result = trace(rawGraph, 'spec:type-theory-overview', 'evidence:rust-borrow-checker-test');
      expect(result.hops).toBeUndefined();
    });

    test('supportsBridgeCandidates returns ok', () => {
      const result = supportsBridgeCandidates(
        rawGraph,
        'spec:type-theory-overview',
        'evidence:rust-borrow-checker-test',
      );
      expect(result.ok).toBe(true);
      expect(result.detail.candidateCount).toBeGreaterThanOrEqual(1);
    });

    test('rankBridgeCandidates returns ≥ 1 candidate', () => {
      const candidates = rankBridgeCandidates(
        { fromId: 'spec:type-theory-overview', toId: 'evidence:rust-borrow-checker-test' },
        rawGraph,
      );
      expect(candidates.length).toBeGreaterThanOrEqual(1);
      expect(candidates[0].candidateConceptId).toBeTruthy();
    });
  });

  // ─── Determinism ──────────────────────────────────────────────────────
  test('all 4 scenarios are deterministic across runs', () => {
    const r1 = trace(rawGraph, 'spec:type-theory-overview', 'evidence:coq-proof');
    const r2 = trace(rawGraph, 'spec:type-theory-overview', 'evidence:coq-proof');
    expect(r1.hops).toBe(r2.hops);

    const c1 = compare(rawGraph, 'spec:type-theory-overview', 'code_artifact:inference-engine');
    const c2 = compare(rawGraph, 'spec:type-theory-overview', 'code_artifact:inference-engine');
    expect(c1.pathCount).toBe(c2.pathCount);
  });

  // ─── Exploration ≠ Acceptance ─────────────────────────────────────────
  test('exploration ≠ acceptance: no graph mutations', () => {
    const edgesBefore = rawGraph.edges.length;
    trace(rawGraph, 'spec:type-theory-overview', 'evidence:coq-proof');
    compare(rawGraph, 'spec:type-theory-overview', 'code_artifact:inference-engine');
    supportsBridgeCandidates(rawGraph, 'spec:type-theory-overview', 'evidence:rust-borrow-checker-test');
    expect(rawGraph.edges.length).toBe(edgesBefore);
  });
});
