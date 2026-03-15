/**
 * Operator Supports & Rival Paths — Tests
 *
 * 1) supportsInspect returns ok on doc-world
 * 2) supportsTrace returns ok on doc-world
 * 3) supportsTrace returns missing on non-epistemic toy graph
 * 4) findRivalTraces returns 1 path on doc-world example
 * 5) findRivalTraces returns 2+ paths on synthetic graph
 * 6) rankBridgeCandidates returns at least 1 candidate for known GAP
 * 7) deterministic outputs
 * 8) regression: no crash on current seed (51/108)
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  supportsInspect,
  supportsTrace,
  supportsCompare,
  supportsBridgeCandidates,
  findRivalTraces,
  rankBridgeCandidates,
} from '../supports.js';
import { normalizeGraphByRedirects } from '../normalizeGraphByRedirects.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..', '..', 'worlds', 'documentation-world');

let docGraph;

const SYSTEM_OVERVIEW = 'https://www.notion.so/e688cc28b25c40fabf27b2ab2577ab82';
const CONCEPT_PROJECTION = 'concept:projection';
const CONCEPT_FOCUS = 'concept:focus';
const PROJECTION_SPEC = 'https://www.notion.so/435b2b96d0ec40b2a7262b1151a23380';
const EVIDENCE_3A = 'evidence:grounding-phase-3a-tests';
const CODE_ARTIFACT_PROTOCOL = 'code_artifact:protocol-ts';

const TOY_NON_EPISTEMIC = {
  nodes: [
    { id: 'a', type: 'note', title: 'Note A' },
    { id: 'b', type: 'note', title: 'Note B' },
    { id: 'c', type: 'tag', title: 'Tag C' },
  ],
  edges: [
    { source: 'a', target: 'b', type: 'links_to' },
    { source: 'b', target: 'c', type: 'tagged' },
  ],
};

const SYNTHETIC_RIVAL = {
  nodes: [
    { id: 'start', type: 'concept', title: 'Start' },
    { id: 'mid-a', type: 'concept', title: 'Mid A' },
    { id: 'mid-b', type: 'concept', title: 'Mid B' },
    { id: 'end', type: 'concept', title: 'End' },
  ],
  edges: [
    { source: 'start', target: 'mid-a', type: 'defines' },
    { source: 'start', target: 'mid-b', type: 'defines' },
    { source: 'mid-a', target: 'end', type: 'refines' },
    { source: 'mid-b', target: 'end', type: 'refines' },
  ],
};

beforeAll(() => {
  const rawNodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const rawEdges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
  docGraph = normalizeGraphByRedirects({ nodes: rawNodes, edges: rawEdges });
});

describe('Operator Supports & Rival Paths', () => {
  test('1) supportsInspect returns ok on doc-world', () => {
    const result = supportsInspect(docGraph);
    expect(result.ok).toBe(true);
    expect(result.missing).toBeUndefined();
  });

  test('2) supportsTrace returns ok on doc-world', () => {
    const result = supportsTrace(docGraph);
    expect(result.ok).toBe(true);
    expect(result.missing).toBeUndefined();

    console.log('\n[supportsTrace] doc-world: ok');
  });

  test('3) supportsTrace returns missing on non-epistemic toy graph', () => {
    const result = supportsTrace(TOY_NON_EPISTEMIC);
    expect(result.ok).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);

    console.log(`\n[supportsTrace] toy graph: MISSING ${result.missing.length} requirements`);
    result.missing.forEach((m) => console.log(`  - ${m}`));
  });

  test('4) findRivalTraces returns 1 path on doc-world (SYSTEM_OVERVIEW → concept:projection)', () => {
    const result = findRivalTraces(docGraph, SYSTEM_OVERVIEW, CONCEPT_PROJECTION, { directed: true });

    expect(result.paths.length).toBeGreaterThanOrEqual(1);
    expect(result.hops).toBe(1);
    expect(result.paths[0][0].nodeId).toBe(SYSTEM_OVERVIEW);
    expect(result.paths[0][result.paths[0].length - 1].nodeId).toBe(CONCEPT_PROJECTION);

    console.log(`\n[findRivalTraces] SYSTEM_OVERVIEW → concept:projection: ${result.paths.length} path(s), ${result.hops} hops, rival=${result.isRival}`);
  });

  test('5) findRivalTraces returns 2+ paths on synthetic graph with two alternatives', () => {
    const result = findRivalTraces(SYNTHETIC_RIVAL, 'start', 'end', { directed: true });

    expect(result.paths.length).toBe(2);
    expect(result.isRival).toBe(true);
    expect(result.reason).toBe('multiple_shortest_paths');
    expect(result.hops).toBe(2);

    const pathA = result.paths[0].map((p) => p.nodeId);
    const pathB = result.paths[1].map((p) => p.nodeId);
    expect(pathA).not.toEqual(pathB);

    console.log('\n[findRivalTraces] synthetic rival graph:');
    result.paths.forEach((p, i) => {
      console.log(`  path ${i + 1}: ${p.map((n) => n.nodeTitle).join(' → ')}`);
    });
  });

  test('6) rankBridgeCandidates returns >=2 rival candidates for spec→evidence GAP', () => {
    const gap = { fromId: PROJECTION_SPEC, toId: EVIDENCE_3A };
    const candidates = rankBridgeCandidates(gap, docGraph);

    expect(candidates.length).toBeGreaterThanOrEqual(2);
    expect(candidates[0].candidateConceptId).toBeDefined();
    expect(candidates[0].score).toBeGreaterThan(0);

    const conceptIds = candidates.map((c) => c.candidateConceptId);
    expect(conceptIds).toContain('concept:test-coverage');
    expect(conceptIds).toContain('concept:acceptance-criteria');
    expect(conceptIds).toContain('concept:verification-method');

    console.log(`\n[rankBridgeCandidates] spec→evidence: ${candidates.length} RIVAL candidate(s)`);
    candidates.forEach((c) => {
      console.log(`  ${c.candidateConceptId} (score=${c.score}, heuristic=${c.heuristic})`);
    });
  });

  test('6b) findRivalTraces detects rival paths on doc-world (SPEC → EVIDENCE)', () => {
    const result = findRivalTraces(docGraph, PROJECTION_SPEC, EVIDENCE_3A, { directed: true });

    expect(result.paths.length).toBeGreaterThanOrEqual(2);
    expect(result.isRival).toBe(true);
    expect(result.reason).toBe('multiple_shortest_paths');
    expect(result.hops).toBe(2);

    const midNodes = result.paths.map((p) => p[1].nodeId);
    expect(new Set(midNodes).size).toBe(result.paths.length);

    console.log(`\n[findRivalTraces] doc-world SPEC→EVIDENCE: ${result.paths.length} RIVAL paths`);
    result.paths.forEach((p, i) => {
      console.log(`  path ${i + 1}: ${p.map((n) => n.nodeTitle || n.nodeId).join(' → ')}`);
    });
  });

  test('7) deterministic outputs (same inputs → same results)', () => {
    const s1 = supportsTrace(docGraph);
    const s2 = supportsTrace(docGraph);
    expect(s1.ok).toBe(s2.ok);

    const r1 = findRivalTraces(SYNTHETIC_RIVAL, 'start', 'end', { directed: true });
    const r2 = findRivalTraces(SYNTHETIC_RIVAL, 'start', 'end', { directed: true });
    expect(r1.paths.length).toBe(r2.paths.length);
    expect(r1.isRival).toBe(r2.isRival);

    const gap = { fromId: PROJECTION_SPEC, toId: EVIDENCE_3A };
    const c1 = rankBridgeCandidates(gap, docGraph);
    const c2 = rankBridgeCandidates(gap, docGraph);
    expect(c1.length).toBe(c2.length);
    expect(c1.map((c) => c.candidateConceptId)).toEqual(c2.map((c) => c.candidateConceptId));
  });

  test('8) no crash on current seed — all functions return valid data', () => {
    expect(supportsInspect(docGraph).ok).toBe(true);
    expect(supportsTrace(docGraph).ok).toBe(true);

    const rivalResult = findRivalTraces(docGraph, SYSTEM_OVERVIEW, CONCEPT_FOCUS);
    expect(rivalResult.paths.length).toBeGreaterThanOrEqual(1);
    expect(rivalResult.hops).toBeGreaterThan(0);

    const gapEvidence = { fromId: EVIDENCE_3A, toId: CODE_ARTIFACT_PROTOCOL };
    const candidates = rankBridgeCandidates(gapEvidence, docGraph);
    expect(candidates.length).toBeGreaterThanOrEqual(1);

    const specEvidenceGap = { fromId: PROJECTION_SPEC, toId: EVIDENCE_3A };
    const rivalCandidates = rankBridgeCandidates(specEvidenceGap, docGraph);
    expect(rivalCandidates.length).toBeGreaterThanOrEqual(2);

    console.log(`\n[Regression] doc-world ${docGraph.nodes.length}/${docGraph.edges.length}:`);
    console.log(`  supportsInspect: ok`);
    console.log(`  supportsTrace: ok`);
    console.log(`  SYSTEM_OVERVIEW↔concept:focus: ${rivalResult.paths.length} paths, rival=${rivalResult.isRival}`);
    console.log(`  evidence→code_artifact candidates: ${candidates.length}`);
    console.log(`  spec→evidence RIVAL candidates: ${rivalCandidates.length}`);
  });
});

// ═══════════════════════════════════════════
// supportsCompare & supportsBridgeCandidates
// ═══════════════════════════════════════════

describe('supportsCompare', () => {
  test('9) returns ok:false on unique shortest path (no ambiguity)', () => {
    const result = supportsCompare(docGraph, SYSTEM_OVERVIEW, CONCEPT_PROJECTION);
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('ambiguity_not_detected');
    expect(result.detail.paths).toBe(1);
  });

  test('10) returns ok:true on synthetic rival graph', () => {
    const result = supportsCompare(SYNTHETIC_RIVAL, 'start', 'end');
    expect(result.ok).toBe(true);
    expect(result.detail.paths).toBe(2);
    expect(result.detail.hops).toBe(2);
  });

  test('11) returns ok:true on doc-world rival pair (SPEC → EVIDENCE)', () => {
    const result = supportsCompare(docGraph, PROJECTION_SPEC, EVIDENCE_3A);
    expect(result.ok).toBe(true);
    expect(result.detail.paths).toBeGreaterThanOrEqual(2);
  });

  test('12) returns ok:false on trivial graph (< 3 nodes)', () => {
    const tiny = {
      nodes: [{ id: 'a', type: 'x' }, { id: 'b', type: 'y' }],
      edges: [{ source: 'a', target: 'b', type: 'z' }],
    };
    const result = supportsCompare(tiny, 'a', 'b');
    expect(result.ok).toBe(false);
    expect(result.missing.some((m) => m.includes('nodes'))).toBe(true);
  });

  test('13) deterministic output', () => {
    const r1 = supportsCompare(docGraph, PROJECTION_SPEC, EVIDENCE_3A);
    const r2 = supportsCompare(docGraph, PROJECTION_SPEC, EVIDENCE_3A);
    expect(r1.ok).toBe(r2.ok);
    expect(r1.detail.paths).toBe(r2.detail.paths);
  });
});

describe('supportsBridgeCandidates', () => {
  test('14) returns ok:false when path exists (no gap)', () => {
    const result = supportsBridgeCandidates(docGraph, SYSTEM_OVERVIEW, CONCEPT_PROJECTION);
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('no_gap: path exists between nodes');
  });

  test('15) returns ok:false for unknown node', () => {
    const result = supportsBridgeCandidates(docGraph, 'nonexistent-xyz', CONCEPT_PROJECTION);
    expect(result.ok).toBe(false);
    expect(result.missing.some((m) => m.includes('unknown_node'))).toBe(true);
  });

  test('16) returns ok:true on gap with candidates (synthetic)', () => {
    const gapGraph = {
      nodes: [
        { id: 'from', type: 'spec', title: 'Spec' },
        { id: 'to', type: 'evidence', title: 'Evidence' },
        { id: 'mid', type: 'concept', title: 'Bridge' },
      ],
      edges: [
        { source: 'from', target: 'mid', type: 'constrains' },
      ],
    };
    const result = supportsBridgeCandidates(gapGraph, 'from', 'to');
    expect(result.ok).toBe(true);
    expect(result.detail.candidateCount).toBeGreaterThanOrEqual(1);
  });

  test('17) returns ok:false on gap without candidates', () => {
    const isolatedGraph = {
      nodes: [
        { id: 'alpha', type: 'unknown_type_x', title: 'Alpha' },
        { id: 'beta', type: 'unknown_type_y', title: 'Beta' },
      ],
      edges: [],
    };
    const result = supportsBridgeCandidates(isolatedGraph, 'alpha', 'beta');
    expect(result.ok).toBe(false);
    expect(result.missing).toContain('no_candidate_bridges');
  });

  test('18) deterministic output', () => {
    const gapGraph = {
      nodes: [
        { id: 'from', type: 'spec', title: 'Spec' },
        { id: 'to', type: 'evidence', title: 'Evidence' },
      ],
      edges: [],
    };
    const r1 = supportsBridgeCandidates(gapGraph, 'from', 'to');
    const r2 = supportsBridgeCandidates(gapGraph, 'from', 'to');
    expect(r1.ok).toBe(r2.ok);
    expect(r1.detail?.candidateCount).toBe(r2.detail?.candidateCount);
  });
});

describe('Regression: full support symmetry', () => {
  test('19) all four supports() run without crash on doc-world', () => {
    expect(supportsInspect(docGraph).ok).toBe(true);
    expect(supportsTrace(docGraph).ok).toBe(true);

    const cmp = supportsCompare(docGraph, PROJECTION_SPEC, EVIDENCE_3A);
    expect(cmp.ok).toBe(true);

    const bc = supportsBridgeCandidates(docGraph, CONCEPT_FOCUS, CODE_ARTIFACT_PROTOCOL);
    expect(typeof bc.ok).toBe('boolean');

    console.log(`\n[Support symmetry] doc-world:`);
    console.log(`  supportsInspect: ok`);
    console.log(`  supportsTrace: ok`);
    console.log(`  supportsCompare(SPEC→EVIDENCE): ok=${cmp.ok}, paths=${cmp.detail?.paths}`);
    console.log(`  supportsBridgeCandidates(concept:focus→protocol): ok=${bc.ok}`);
  });
});
