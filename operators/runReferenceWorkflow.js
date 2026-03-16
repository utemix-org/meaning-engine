/**
 * Reference Workflow — Exploration Only
 *
 * Demonstrates 4 canonical scenarios on the Documentation World:
 *   S1: Trace → path discovery
 *   S2: Trace → GAP (no directed path) + candidate bridges
 *   S3: Compare → rival explanatory paths
 *   S4: BridgeCandidates → structural bridge suggestion for isolated GAP
 *
 * All results are exploration-mode artifacts. No canonicalization.
 *
 * Usage:
 *   node operators/runReferenceWorkflow.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { trace } from './trace.js';
import { compare } from './compare.js';
import { normalizeGraphByRedirects } from './normalizeGraphByRedirects.js';
import {
  supportsCompare,
  supportsBridgeCandidates,
  rankBridgeCandidates,
} from './supports.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..', 'worlds', 'documentation-world');

const rawNodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
const rawEdges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
const graph = normalizeGraphByRedirects({ nodes: rawNodes, edges: rawEdges });

const SYSTEM_OVERVIEW = 'https://www.notion.so/e688cc28b25c40fabf27b2ab2577ab82';
const CONCEPT_PROJECTION = 'concept:projection';
const CONCEPT_CONTEXT = 'concept:context';
const PROJECTION_SPEC = 'https://www.notion.so/435b2b96d0ec40b2a7262b1151a23380';
const EVIDENCE_3A = 'evidence:grounding-phase-3a-tests';
const ISOLATED_ENGINE_FILE = 'code:file:src/engine/WorldAdapter.js';

const results = [];

// ── S1: Trace → path discovery ──────────────────────────────────────────
console.log('═══ S1: Trace → path discovery ═══');
const s1 = trace(graph, SYSTEM_OVERVIEW, CONCEPT_PROJECTION);
console.log(`  from: SYSTEM_OVERVIEW`);
console.log(`  to:   concept:projection`);
console.log(`  ok: ${s1.ok}, hops: ${s1.hops}`);
if (s1.ok) {
  const pathStr = s1.path.map((p) => p.nodeTitle || p.nodeId).join(' → ');
  console.log(`  path: ${pathStr}`);
}
results.push({
  scenario: 'S1: Trace → path discovery',
  from: SYSTEM_OVERVIEW,
  to: CONCEPT_PROJECTION,
  result: s1,
});

// ── S2: Trace → GAP ────────────────────────────────────────────────────
console.log('\n═══ S2: Trace → GAP ═══');
const s2 = trace(graph, CONCEPT_CONTEXT, SYSTEM_OVERVIEW);
console.log(`  from: concept:context`);
console.log(`  to:   SYSTEM_OVERVIEW`);
console.log(`  ok: ${s2.ok}, reason: ${s2.reason}`);
if (!s2.ok && s2.candidates) {
  console.log(`  candidates: ${s2.candidates.length}`);
  for (const c of s2.candidates) {
    console.log(`    → ${c.candidateConceptId}: ${c.note}`);
  }
}
results.push({
  scenario: 'S2: Trace → GAP + candidate bridges',
  from: CONCEPT_CONTEXT,
  to: SYSTEM_OVERVIEW,
  result: s2,
});

// ── S3: Compare → rival explanatory paths ───────────────────────────────
console.log('\n═══ S3: Compare → rival explanatory paths ═══');
const s3sc = supportsCompare(graph, PROJECTION_SPEC, EVIDENCE_3A);
console.log(`  from: PROJECTION_SPEC`);
console.log(`  to:   evidence:grounding-phase-3a-tests`);
console.log(`  supportsCompare: ${s3sc.ok} (${s3sc.detail?.paths} paths)`);

let s3compare = null;
if (s3sc.ok) {
  s3compare = compare(graph, PROJECTION_SPEC, EVIDENCE_3A);
  console.log(`  pathCount: ${s3compare.pathCount}, clusters: ${s3compare.clusterCount}`);
  console.log(`  diff.humanNotes:`);
  for (const n of s3compare.diff.humanNotes) {
    console.log(`    → ${n}`);
  }
}
results.push({
  scenario: 'S3: Compare → rival explanatory paths',
  from: PROJECTION_SPEC,
  to: EVIDENCE_3A,
  supportsCompare: s3sc,
  result: s3compare,
});

// ── S4: BridgeCandidates → structural bridges ───────────────────────────
console.log('\n═══ S4: BridgeCandidates → structural bridges ═══');
const s4sc = supportsBridgeCandidates(graph, EVIDENCE_3A, ISOLATED_ENGINE_FILE);
console.log(`  from: evidence:grounding-phase-3a-tests`);
console.log(`  to:   code:file:src/engine/WorldAdapter.js (isolated node)`);
console.log(`  supportsBridgeCandidates: ${s4sc.ok} (candidates: ${s4sc.detail?.candidateCount})`);

let s4candidates = [];
if (s4sc.ok) {
  s4candidates = rankBridgeCandidates({ fromId: EVIDENCE_3A, toId: ISOLATED_ENGINE_FILE }, graph);
  for (const c of s4candidates) {
    console.log(`    → ${c.candidateConceptId} (${c.heuristic}, score=${c.score})`);
    console.log(`      ${c.note}`);
  }
}
results.push({
  scenario: 'S4: BridgeCandidates → structural bridges',
  from: EVIDENCE_3A,
  to: ISOLATED_ENGINE_FILE,
  supportsBridgeCandidates: s4sc,
  candidates: s4candidates,
});

// ── Output ──────────────────────────────────────────────────────────────
const outPath = resolve(__dir, 'referenceWorkflow.examples.json');
writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`\n✓ referenceWorkflow.examples.json written (${results.length} scenarios)`);
console.log('\n⚠ All results are exploration-mode artifacts. No canonicalization performed.');
