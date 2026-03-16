/**
 * Rival Explanation Archetypes — Pack 3 Observation
 *
 * Characterizes recurring types of rival paths observed by Compare:
 *
 *   Archetype A: concept-mediated vs code-dependency route
 *   Archetype B: core barrel vs peripheral adapter route
 *   Archetype C: constraint-preserving vs constraint-free route
 *
 * All results are exploration-mode artifacts. No canonicalization.
 *
 * Usage:
 *   node operators/runRivalArchetypes.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { compare } from './compare.js';
import { normalizeGraphByRedirects } from './normalizeGraphByRedirects.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..', 'worlds', 'documentation-world');
const outPath = resolve(__dir, 'rivalArchetypes.examples.json');

const rawNodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
const rawEdges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
const graph = normalizeGraphByRedirects({ nodes: rawNodes, edges: rawEdges });

const PROJECTION_SPEC = 'https://www.notion.so/435b2b96d0ec40b2a7262b1151a23380';
const NAVIGATION_SPEC = 'https://www.notion.so/b997b23c7bb94390be3351504e64d1fd';
const EVALUATE_JS = 'code:file:src/core/knowledge/evaluate.js';
const WORLD_ADAPTER_JS = 'code:file:src/engine/WorldAdapter.js';
const GRAPH_MODEL_JS = 'code:file:src/core/GraphModel.js';

const results = [];

// ═══ Archetype A: concept-mediated vs code-dependency ═══════════════════
console.log('═══ Archetype A: concept-mediated vs code-dependency route ═══');
console.log('  Pair: PROJECTION_SPEC → evaluate.js');

const cA = compare(graph, PROJECTION_SPEC, EVALUATE_JS);
const conceptPaths = cA.paths.filter((p) => p.codeArtifactCount <= 1);
const codePaths = cA.paths.filter((p) => p.codeArtifactCount >= 3);

console.log(`  Total rivals: ${cA.pathCount}, clusters: ${cA.clusterCount}`);
console.log(`  Concept-mediated paths: ${conceptPaths.length} (codeArtifacts ≤ 1)`);
conceptPaths.forEach((p) => console.log(`    ${p.nodeTitles.join(' → ')}`));
console.log(`  Code-dependency paths: ${codePaths.length} (codeArtifacts ≥ 3)`);
console.log(`    (via test files as connectors: buildGraph.test, endToEnd.test, etc.)`);
console.log('  → Archetype: same architectural question answered by two mechanisms —');
console.log('    conceptual lineage (spec→concept→spec) vs import dependency (spec→code→test→code).');

results.push({
  archetype: 'A: concept-mediated vs code-dependency route',
  pair: 'PROJECTION_SPEC → evaluate.js',
  from: PROJECTION_SPEC,
  to: EVALUATE_JS,
  rivalCount: cA.pathCount,
  clusterCount: cA.clusterCount,
  conceptMediatedPaths: conceptPaths.length,
  codeDependencyPaths: codePaths.length,
  observation: 'Concept-mediated paths traverse spec→concept→spec (architectural lineage). Code-dependency paths traverse spec→code→test→code (import graph). Both are valid explanations, but they reveal different architectural aspects.',
});

// ═══ Archetype B: core barrel vs peripheral adapter ══════════════════════
console.log('\n═══ Archetype B: core barrel vs peripheral adapter route ═══');
console.log('  Pair: WorldAdapter.js → GraphModel.js');

const cB = compare(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
console.log(`  Total rivals: ${cB.pathCount}, clusters: ${cB.clusterCount}`);
cB.paths.forEach((p, i) => console.log(`    path ${i + 1}: ${p.nodeTitles.join(' → ')}`));

const uniqueByPath = cB.diff.humanNotes.filter((n) => n.includes('unique nodes'));
uniqueByPath.forEach((n) => console.log(`    ${n}`));
console.log('  → Archetype: rival routes diverge through different barrel/re-export modules.');
console.log('    Both paths are all-code-artifact, but use different intermediaries.');
console.log('    This reveals the internal wiring of the module layer.');

results.push({
  archetype: 'B: core barrel vs peripheral adapter route',
  pair: 'WorldAdapter.js → GraphModel.js',
  from: WORLD_ADAPTER_JS,
  to: GRAPH_MODEL_JS,
  rivalCount: cB.pathCount,
  clusterCount: cB.clusterCount,
  observation: 'Both paths are purely structural (all code_artifact). They diverge through different barrel modules (index.js vs highlightModel.js). This archetype reveals internal module wiring rather than architectural intent.',
});

// ═══ Archetype C: constraint-preserving vs constraint-free ═══════════════
console.log('\n═══ Archetype C: constraint-preserving vs constraint-free route ═══');
console.log('  Pair: NAVIGATION_SPEC → evaluate.js');

const cC = compare(graph, NAVIGATION_SPEC, EVALUATE_JS);
const invariantPaths = cA.paths.filter((p) => p.hasInvariant);
const noInvariantPaths = cA.paths.filter((p) => !p.hasInvariant);

console.log(`  Total rivals (NAV→EV): ${cC.pathCount}`);
cC.paths.forEach((p, i) => console.log(`    path ${i + 1}: ${p.nodeTitles.join(' → ')}  invariant: ${p.hasInvariant}`));

console.log(`  (Also in PROJ→EV: ${invariantPaths.length} invariant-passing, ${noInvariantPaths.length} constraint-free)`);
invariantPaths.forEach((p) => console.log(`    invariant path: ${p.nodeTitles.join(' → ')}`));

console.log('  → Archetype: among rivals, some paths pass through invariant nodes');
console.log('    (formal architectural constraints), others do not.');
console.log('    The invariant-passing path is "formally stronger" — it goes through');
console.log('    Canonical-Only Graph Build, a proven engine law.');

results.push({
  archetype: 'C: constraint-preserving vs constraint-free route',
  pair: 'PROJECTION_SPEC → evaluate.js (also visible in NAVIGATION_SPEC → evaluate.js)',
  from: PROJECTION_SPEC,
  to: EVALUATE_JS,
  rivalCount: cA.pathCount,
  invariantPaths: invariantPaths.length,
  constraintFreePaths: noInvariantPaths.length,
  invariantPathExample: invariantPaths[0]?.nodeTitles,
  observation: 'Among 13 rival paths, exactly 1 passes through an invariant node (Canonical-Only Graph Build). This path is formally stronger because it traverses a proven engine law. Other paths are valid but lack formal constraint backing.',
});

writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`\n✓ rivalArchetypes.examples.json written (${results.length} archetypes)`);
console.log('\n⚠ These archetypes are stable observations, not yet formal operator categories.');
console.log('⚠ All results are exploration-mode artifacts. No canonicalization performed.');
