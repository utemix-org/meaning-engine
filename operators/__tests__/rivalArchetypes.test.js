/**
 * Pack 3 — Rival Explanation Archetypes (reproducibility tests)
 *
 * Validates that the three observed archetypes are stable:
 *   A: concept-mediated vs code-dependency route
 *   B: core barrel vs peripheral adapter route
 *   C: constraint-preserving vs constraint-free route
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { compare } from '../compare.js';
import { normalizeGraphByRedirects } from '../normalizeGraphByRedirects.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..', '..', 'worlds', 'documentation-world');

const PROJECTION_SPEC = 'https://www.notion.so/435b2b96d0ec40b2a7262b1151a23380';
const NAVIGATION_SPEC = 'https://www.notion.so/b997b23c7bb94390be3351504e64d1fd';
const EVALUATE_JS = 'code:file:src/core/knowledge/evaluate.js';
const WORLD_ADAPTER_JS = 'code:file:src/engine/WorldAdapter.js';
const GRAPH_MODEL_JS = 'code:file:src/core/GraphModel.js';

let graph;

beforeAll(() => {
  const rawN = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const rawE = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
  graph = normalizeGraphByRedirects({ nodes: rawN, edges: rawE });
});

describe('Pack 3 — Rival Explanation Archetypes', () => {
  // ─── Archetype A ───────────────────────────────────────────────────────
  describe('Archetype A: concept-mediated vs code-dependency route', () => {
    let result;
    beforeAll(() => {
      result = compare(graph, PROJECTION_SPEC, EVALUATE_JS);
    });

    test('Compare finds ≥ 5 rival paths for PROJECTION_SPEC → evaluate.js', () => {
      expect(result.ok).toBe(true);
      expect(result.pathCount).toBeGreaterThanOrEqual(5);
    });

    test('at least 2 paths are concept-mediated (codeArtifactCount ≤ 1)', () => {
      const conceptPaths = result.paths.filter((p) => p.codeArtifactCount <= 1);
      expect(conceptPaths.length).toBeGreaterThanOrEqual(2);
    });

    test('at least 3 paths are code-dependency (codeArtifactCount ≥ 3)', () => {
      const codePaths = result.paths.filter((p) => p.codeArtifactCount >= 3);
      expect(codePaths.length).toBeGreaterThanOrEqual(3);
    });

    test('concept-mediated paths traverse spec/concept/invariant nodes', () => {
      const conceptPaths = result.paths.filter((p) => p.codeArtifactCount <= 1);
      for (const p of conceptPaths) {
        const nonCode = Object.entries(p.nodeTypeHistogram)
          .filter(([t]) => t !== 'code_artifact')
          .reduce((sum, [, v]) => sum + v, 0);
        expect(nonCode).toBeGreaterThanOrEqual(2);
      }
    });
  });

  // ─── Archetype B ───────────────────────────────────────────────────────
  describe('Archetype B: core barrel vs peripheral adapter route', () => {
    let result;
    beforeAll(() => {
      result = compare(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
    });

    test('Compare finds exactly 2 rivals for WorldAdapter → GraphModel', () => {
      expect(result.ok).toBe(true);
      expect(result.pathCount).toBe(2);
    });

    test('both paths are all-code-artifact (no concept/spec nodes in middle)', () => {
      for (const p of result.paths) {
        expect(p.codeArtifactCount).toBe(p.nodeIds.length);
      }
    });

    test('paths diverge through different intermediary modules', () => {
      const sets = result.paths.map((p) => new Set(p.nodeIds));
      const unique0 = [...sets[0]].filter((id) => !sets[1].has(id));
      const unique1 = [...sets[1]].filter((id) => !sets[0].has(id));
      expect(unique0.length).toBeGreaterThanOrEqual(1);
      expect(unique1.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Archetype C ───────────────────────────────────────────────────────
  describe('Archetype C: constraint-preserving vs constraint-free route', () => {
    let result;
    beforeAll(() => {
      result = compare(graph, PROJECTION_SPEC, EVALUATE_JS);
    });

    test('exactly 1 path passes through an invariant node', () => {
      const invariantPaths = result.paths.filter((p) => p.hasInvariant);
      expect(invariantPaths.length).toBe(1);
    });

    test('the invariant path contains Canonical-Only Graph Build', () => {
      const invariantPath = result.paths.find((p) => p.hasInvariant);
      expect(invariantPath).toBeDefined();
      expect(invariantPath.nodeTitles).toContain('Canonical-Only Graph Build');
    });

    test('remaining paths are constraint-free (hasInvariant = false)', () => {
      const freePaths = result.paths.filter((p) => !p.hasInvariant);
      expect(freePaths.length).toBeGreaterThanOrEqual(10);
      freePaths.forEach((p) => expect(p.hasInvariant).toBe(false));
    });
  });

  // ─── Determinism ──────────────────────────────────────────────────────
  test('archetype observations are deterministic across runs', () => {
    const r1 = compare(graph, PROJECTION_SPEC, EVALUATE_JS);
    const r2 = compare(graph, PROJECTION_SPEC, EVALUATE_JS);
    expect(r1.pathCount).toBe(r2.pathCount);
    expect(r1.clusterCount).toBe(r2.clusterCount);
    expect(r1.paths.map((p) => p.nodeIds.join(','))).toEqual(
      r2.paths.map((p) => p.nodeIds.join(',')),
    );
  });

  // ─── Exploration ≠ Acceptance ─────────────────────────────────────────
  test('exploration ≠ acceptance: no graph mutations from observation', () => {
    const before = graph.edges.length;
    compare(graph, PROJECTION_SPEC, EVALUATE_JS);
    compare(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
    compare(graph, NAVIGATION_SPEC, EVALUATE_JS);
    expect(graph.edges.length).toBe(before);
  });
});
