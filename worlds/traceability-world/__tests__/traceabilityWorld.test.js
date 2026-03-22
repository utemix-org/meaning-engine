/**
 * Traceability World — Smoke tests + Scenario pack (5 scenarios)
 *
 * Validates that:
 *   - the world loads correctly and graph integrity holds
 *   - spec → evidence traceability works through concept/invariant layers
 *   - rival implementation paths are detected (concept vs code path)
 *   - a deliberate gap is detected (password-reset has no test evidence)
 *   - invariant → evidence tracing works
 *   - projection produces a valid ViewModel with focus
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadTraceabilityWorld } from '../loader.js';
import { trace } from '../../../operators/trace.js';
import { compare } from '../../../operators/compare.js';
import {
  supportsInspect,
  supportsTrace,
  supportsCompare,
  supportsBridgeCandidates,
  rankBridgeCandidates,
} from '../../../operators/supports.js';
import { projectGraph } from '../../../src/core/projection/projectGraph.js';
import { defaultParams } from '../../../src/core/projection/types.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..');

let graphModel;
let rawGraph;

beforeAll(() => {
  const result = loadTraceabilityWorld();
  graphModel = result.graph;

  const rawN = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const rawE = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
  rawGraph = { nodes: rawN, edges: rawE };
});

describe('Traceability World — Smoke Tests', () => {
  test('loader returns graph and meta', () => {
    const { graph, meta } = loadTraceabilityWorld();
    expect(graph).toBeDefined();
    expect(meta.nodeCount).toBe(21);
    expect(meta.edgeCount).toBe(22);
    expect(meta.nodeTypes).toContain('spec');
    expect(meta.nodeTypes).toContain('concept');
    expect(meta.nodeTypes).toContain('invariant');
    expect(meta.nodeTypes).toContain('evidence');
    expect(meta.nodeTypes).toContain('code_artifact');
  });

  test('GraphModel instance has correct node/edge counts', () => {
    expect(graphModel.getNodes().length).toBe(21);
    expect(graphModel.getEdges().length).toBe(22);
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

describe('Traceability World — 5 Scenarios', () => {

  // ─── S1: Spec → Evidence traceability (success) ───────────────────────
  describe('S1: Spec → Evidence traceability', () => {
    test('trace(auth-login → login-tests) finds a directed path', () => {
      const result = trace(rawGraph, 'spec:auth-login', 'evidence:login-tests');
      expect(result.hops).toBeGreaterThanOrEqual(2);
      expect(result.hops).toBeLessThanOrEqual(4);
    });

    test('path passes through concept layer', () => {
      const result = trace(rawGraph, 'spec:auth-login', 'evidence:login-tests');
      const pathIds = result.path.map((s) => s.nodeId);
      expect(pathIds).toContain('spec:auth-login');
      expect(pathIds).toContain('evidence:login-tests');
      const middleTypes = result.path
        .slice(1, -1)
        .map((s) => rawGraph.nodes.find((n) => n.id === s.nodeId)?.type);
      expect(middleTypes).toContain('concept');
    });

    test('session-expiry also traces to session-tests', () => {
      const result = trace(rawGraph, 'spec:session-expiry', 'evidence:session-tests');
      expect(result.hops).toBeGreaterThanOrEqual(2);
    });
  });

  // ─── S2: Rival paths (concept path vs code path) ─────────────────────
  describe('S2: Rival implementation paths', () => {
    test('compare(auth-login, login-tests) finds ≥ 2 rival paths', () => {
      const result = compare(rawGraph, 'spec:auth-login', 'evidence:login-tests');
      expect(result.ok).toBe(true);
      expect(result.pathCount).toBeGreaterThanOrEqual(2);
    });

    test('supportsCompare returns ok for auth-login → login-tests', () => {
      const result = supportsCompare(rawGraph, 'spec:auth-login', 'evidence:login-tests');
      expect(result.ok).toBe(true);
    });

    test('rival paths show different structural signatures', () => {
      const result = compare(rawGraph, 'spec:auth-login', 'evidence:login-tests');
      const paths = result.paths;
      const hasConceptPath = paths.some(
        (p) => (p.nodeTypeHistogram['concept'] || 0) >= 1,
      );
      const hasCodePath = paths.some(
        (p) => (p.nodeTypeHistogram['code_artifact'] || 0) >= 1,
      );
      expect(hasConceptPath).toBe(true);
      expect(hasCodePath).toBe(true);
    });
  });

  // ─── S3: Gap detection (password-reset has no evidence) ───────────────
  describe('S3: Gap detection — password-reset has no test evidence', () => {
    test('trace(password-reset → login-tests) = no path', () => {
      const result = trace(rawGraph, 'spec:password-reset', 'evidence:login-tests');
      expect(result.hops).toBeUndefined();
    });

    test('trace(password-reset → any evidence) finds no path', () => {
      const evidenceIds = rawGraph.nodes
        .filter((n) => n.type === 'evidence')
        .map((n) => n.id);
      for (const eid of evidenceIds) {
        const result = trace(rawGraph, 'spec:password-reset', eid);
        expect(result.hops).toBeUndefined();
      }
    });

    test('bridge candidates are suggested for password-reset → evidence gap', () => {
      const result = supportsBridgeCandidates(
        rawGraph,
        'spec:password-reset',
        'evidence:login-tests',
      );
      expect(result.ok).toBe(true);
      expect(result.detail.candidateCount).toBeGreaterThanOrEqual(1);
    });

    test('rankBridgeCandidates returns concept:test-coverage as candidate', () => {
      const candidates = rankBridgeCandidates(
        { fromId: 'spec:password-reset', toId: 'evidence:login-tests' },
        rawGraph,
      );
      expect(candidates.length).toBeGreaterThanOrEqual(1);
      const conceptIds = candidates.map((c) => c.candidateConceptId);
      expect(conceptIds).toContain('concept:test-coverage');
    });
  });

  // ─── S4: Invariant → Evidence trace ──────────────────────────────────
  describe('S4: Invariant enforcement trace', () => {
    test('trace(no-plaintext → hash-tests) finds direct path', () => {
      const result = trace(rawGraph, 'invariant:no-plaintext', 'evidence:hash-tests');
      expect(result.hops).toBe(1);
    });

    test('trace(audit-trail → login-tests) finds direct path', () => {
      const result = trace(rawGraph, 'invariant:audit-trail', 'evidence:login-tests');
      expect(result.hops).toBe(1);
    });

    test('code implements spec: authService → auth-login in 1 hop', () => {
      const result = trace(rawGraph, 'code_artifact:authService', 'spec:auth-login');
      expect(result.hops).toBe(1);
    });
  });

  // ─── S5: Projection with focus ──────────────────────────────────────
  describe('S5: Projection', () => {
    test('projectGraph with focus on spec:auth-login returns ok', () => {
      const result = projectGraph(
        graphModel,
        { nodeId: 'spec:auth-login', path: [] },
        null,
        defaultParams(),
      );
      expect(result.ok).toBe(true);
      expect(result.viewModel.scene.nodes.length).toBeGreaterThanOrEqual(1);
    });

    test('focused projection shows neighbors of auth-login', () => {
      const result = projectGraph(
        graphModel,
        { nodeId: 'spec:auth-login', path: [] },
        null,
        defaultParams(),
      );
      const nodeIds = result.viewModel.scene.nodes.map((n) => n.id);
      expect(nodeIds).toContain('spec:auth-login');
      expect(nodeIds).toContain('concept:credential-validation');
    });

    test('no-focus projection includes all nodes', () => {
      const result = projectGraph(
        graphModel,
        { nodeId: null, path: [] },
        null,
        defaultParams(),
      );
      expect(result.ok).toBe(true);
      expect(result.viewModel.scene.nodes.length).toBe(21);
    });
  });

  // ─── Determinism + no-mutation ──────────────────────────────────────
  test('all scenarios are deterministic across runs', () => {
    const r1 = trace(rawGraph, 'spec:auth-login', 'evidence:login-tests');
    const r2 = trace(rawGraph, 'spec:auth-login', 'evidence:login-tests');
    expect(r1.hops).toBe(r2.hops);

    const c1 = compare(rawGraph, 'spec:auth-login', 'evidence:login-tests');
    const c2 = compare(rawGraph, 'spec:auth-login', 'evidence:login-tests');
    expect(c1.pathCount).toBe(c2.pathCount);
  });

  test('exploration does not mutate the graph', () => {
    const nodesBefore = rawGraph.nodes.length;
    const edgesBefore = rawGraph.edges.length;
    trace(rawGraph, 'spec:auth-login', 'evidence:login-tests');
    compare(rawGraph, 'spec:auth-login', 'evidence:login-tests');
    trace(rawGraph, 'spec:password-reset', 'evidence:login-tests');
    expect(rawGraph.nodes.length).toBe(nodesBefore);
    expect(rawGraph.edges.length).toBe(edgesBefore);
  });
});
