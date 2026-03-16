/**
 * Reference Workflow — Reproducibility Tests
 *
 * Verifies 4 canonical exploration scenarios on documentation-world:
 *   1) Trace → path discovery (directed path exists)
 *   2) Trace → GAP (no directed path, candidates returned)
 *   3) Compare → rival explanatory paths (supportsCompare + compare)
 *   4) BridgeCandidates → GAP + candidate bridges (supportsBridgeCandidates + rank)
 *   5) Deterministic outputs across runs
 *   6) Exploration ≠ Acceptance invariant
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { trace } from '../trace.js';
import { compare } from '../compare.js';
import { normalizeGraphByRedirects } from '../normalizeGraphByRedirects.js';
import {
  supportsCompare,
  supportsBridgeCandidates,
  rankBridgeCandidates,
} from '../supports.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..', '..', 'worlds', 'documentation-world');

let graph;

const SYSTEM_OVERVIEW = 'https://www.notion.so/e688cc28b25c40fabf27b2ab2577ab82';
const CONCEPT_PROJECTION = 'concept:projection';
const CONCEPT_CONTEXT = 'concept:context';
const PROJECTION_SPEC = 'https://www.notion.so/435b2b96d0ec40b2a7262b1151a23380';
const EVIDENCE_3A = 'evidence:grounding-phase-3a-tests';
const ISOLATED_ENGINE_FILE = 'code:file:src/engine/WorldAdapter.js';

beforeAll(() => {
  const rawNodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const rawEdges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
  graph = normalizeGraphByRedirects({ nodes: rawNodes, edges: rawEdges });
});

describe('Reference Workflow — Exploration Only', () => {
  test('S1: Trace finds directed path (SYSTEM_OVERVIEW → concept:projection)', () => {
    const result = trace(graph, SYSTEM_OVERVIEW, CONCEPT_PROJECTION);

    expect(result.ok).toBe(true);
    expect(result.hops).toBe(1);
    expect(result.path[0].nodeId).toBe(SYSTEM_OVERVIEW);
    expect(result.path[result.path.length - 1].nodeId).toBe(CONCEPT_PROJECTION);
  });

  test('S2: Trace returns GAP with candidates (concept:context → SYSTEM_OVERVIEW)', () => {
    const result = trace(graph, CONCEPT_CONTEXT, SYSTEM_OVERVIEW);

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('no_path');
    expect(result.candidates).toBeDefined();
    expect(result.candidates.length).toBeGreaterThanOrEqual(1);
    expect(result.candidates[0].candidateConceptId).toBe('concept:context-anchor');
  });

  test('S3: Compare finds rival paths (PROJECTION_SPEC → EVIDENCE_3A)', () => {
    const sc = supportsCompare(graph, PROJECTION_SPEC, EVIDENCE_3A);
    expect(sc.ok).toBe(true);
    expect(sc.detail.paths).toBeGreaterThanOrEqual(2);

    const result = compare(graph, PROJECTION_SPEC, EVIDENCE_3A);
    expect(result.ok).toBe(true);
    expect(result.pathCount).toBe(3);
    expect(result.diff).toBeDefined();
    expect(result.diff.humanNotes.length).toBeGreaterThan(0);
  });

  test('S4: BridgeCandidates for isolated GAP (EVIDENCE → isolated engine file)', () => {
    const sc = supportsBridgeCandidates(graph, EVIDENCE_3A, ISOLATED_ENGINE_FILE);
    expect(sc.ok).toBe(true);
    expect(sc.detail.candidateCount).toBeGreaterThanOrEqual(1);

    const candidates = rankBridgeCandidates(
      { fromId: EVIDENCE_3A, toId: ISOLATED_ENGINE_FILE },
      graph,
    );
    expect(candidates.length).toBeGreaterThanOrEqual(1);
    expect(candidates[0].candidateConceptId).toBe('concept:code-spec-alignment');
  });

  test('S5: all scenarios are deterministic', () => {
    const t1a = trace(graph, SYSTEM_OVERVIEW, CONCEPT_PROJECTION);
    const t1b = trace(graph, SYSTEM_OVERVIEW, CONCEPT_PROJECTION);
    expect(t1a.hops).toBe(t1b.hops);
    expect(t1a.path.length).toBe(t1b.path.length);

    const c1 = compare(graph, PROJECTION_SPEC, EVIDENCE_3A);
    const c2 = compare(graph, PROJECTION_SPEC, EVIDENCE_3A);
    expect(c1.pathCount).toBe(c2.pathCount);
    expect(c1.diff.sharedNodes).toEqual(c2.diff.sharedNodes);
  });

  test('S6: exploration results carry no canonicalization markers', () => {
    const traceResult = trace(graph, SYSTEM_OVERVIEW, CONCEPT_PROJECTION);
    expect(traceResult).not.toHaveProperty('canonicalized');
    expect(traceResult).not.toHaveProperty('accepted');
    expect(traceResult).not.toHaveProperty('status');

    const compareResult = compare(graph, PROJECTION_SPEC, EVIDENCE_3A);
    expect(compareResult).not.toHaveProperty('canonicalized');
    expect(compareResult).not.toHaveProperty('accepted');
  });
});
