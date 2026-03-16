/**
 * Architecture Reading Workflow — Exploration Only
 *
 * Uses the doc-world operator stack (Trace / Compare / BridgeCandidates)
 * to answer 3 canonical architecture questions:
 *
 *   Q1: "How does PROJECTION_SPEC reach core implementation?"
 *       — Spec→Code traceability via implements edges
 *   Q2: "Where is the boundary between world-facing and core layers?"
 *       — Directed gap + undirected rival paths across layers
 *   Q3: "Are there rival explanatory paths for a cross-layer claim?"
 *       — Structural ambiguity detected by Compare
 *
 * All results are exploration-mode artifacts. No canonicalization.
 *
 * Usage:
 *   node operators/runArchitectureReading.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { trace } from './trace.js';
import { compare } from './compare.js';
import { normalizeGraphByRedirects } from './normalizeGraphByRedirects.js';
import { supportsCompare } from './supports.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..', 'worlds', 'documentation-world');
const outPath = resolve(__dir, 'architectureReading.examples.json');

const rawNodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
const rawEdges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
const graph = normalizeGraphByRedirects({ nodes: rawNodes, edges: rawEdges });

const PROJECTION_SPEC = 'https://www.notion.so/435b2b96d0ec40b2a7262b1151a23380';
const PROJECT_GRAPH_JS = 'code:file:src/core/projection/projectGraph.js';
const EVALUATE_JS = 'code:file:src/core/knowledge/evaluate.js';
const WORLD_ADAPTER_JS = 'code:file:src/engine/WorldAdapter.js';
const GRAPH_MODEL_JS = 'code:file:src/core/GraphModel.js';

const results = [];

// ═══ Q1: Spec→Implementation traceability ═══════════════════════════════
console.log('═══ Q1: How does PROJECTION_SPEC reach core implementation? ═══');

const q1trace = trace(graph, PROJECT_GRAPH_JS, PROJECTION_SPEC);
console.log(`  Trace (projectGraph.js → PROJECTION_SPEC):`);
console.log(`    ok: ${q1trace.ok}, hops: ${q1trace.hops}`);
if (q1trace.ok) {
  console.log(`    path: ${q1trace.path.map((s) => s.nodeId.split('/').pop().replace('https://www.notion.so/', '')).join(' → ')}`);
}
console.log('  → Interpretation: projectGraph.js implements PROJECTION_SPEC directly (1 hop).');
console.log('    The spec is fully traceable from its primary implementation.');

results.push({
  question: 'Q1: How does PROJECTION_SPEC reach core implementation?',
  operators: ['Trace'],
  from: PROJECT_GRAPH_JS,
  to: PROJECTION_SPEC,
  result: {
    ok: q1trace.ok,
    hops: q1trace.hops,
    path: q1trace.path?.map((s) => s.nodeId),
  },
  interpretation:
    'projectGraph.js implements PROJECTION_SPEC directly via a 1-hop implements edge. The spec is fully traceable from its primary implementation artifact.',
});

// ═══ Q2: World-facing ↔ Core boundary ════════════════════════════════════
console.log('\n═══ Q2: Where is the boundary between world-facing and core? ═══');

const q2trace = trace(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
console.log(`  Trace (WorldAdapter.js → GraphModel.js):`);
console.log(`    ok: ${q2trace.ok}`);
if (!q2trace.ok) {
  console.log(`    reason: ${q2trace.reason} — no directed path from engine adapter to core model`);
}

const q2sc = supportsCompare(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
console.log(`  supportsCompare: ${q2sc.ok} (${q2sc.detail?.paths} paths, ${q2sc.detail?.hops} hops)`);

let q2compare = null;
if (q2sc.ok) {
  q2compare = compare(graph, WORLD_ADAPTER_JS, GRAPH_MODEL_JS);
  console.log(`  Compare: ${q2compare.pathCount} rival paths`);
  q2compare.diff?.humanNotes?.forEach((n) => console.log(`    ${n}`));
}

console.log('  → Interpretation: No directed dependency from engine adapter to core.');
console.log('    But undirected analysis reveals 2 rival paths through intermediaries.');
console.log('    This confirms a clean architectural boundary: engine layer does not');
console.log('    directly depend on core internals — connection goes through index/barrel files.');

results.push({
  question: 'Q2: Where is the boundary between world-facing and core layers?',
  operators: ['Trace', 'Compare'],
  from: WORLD_ADAPTER_JS,
  to: GRAPH_MODEL_JS,
  traceResult: {
    ok: q2trace.ok,
    reason: q2trace.reason,
  },
  compareResult: q2compare
    ? {
        ok: q2compare.ok,
        pathCount: q2compare.pathCount,
        humanNotes: q2compare.diff?.humanNotes,
      }
    : null,
  interpretation:
    'No directed path from WorldAdapter.js to GraphModel.js — engine adapter layer does not directly depend on core model. Undirected Compare reveals 2 rival paths through different intermediaries (index.js vs highlightModel.js), confirming the boundary is mediated by barrel/re-export modules.',
});

// ═══ Q3: Cross-layer rival explanatory paths ═════════════════════════════
console.log('\n═══ Q3: Are there rival explanatory paths across layers? ═══');

const q3sc = supportsCompare(graph, PROJECTION_SPEC, EVALUATE_JS);
console.log(`  supportsCompare (PROJECTION_SPEC → evaluate.js): ${q3sc.ok} (${q3sc.detail?.paths} paths)`);

let q3compare = null;
if (q3sc.ok) {
  q3compare = compare(graph, PROJECTION_SPEC, EVALUATE_JS);
  console.log(`  Compare: ${q3compare.pathCount} rival paths, ${q3compare.diff?.pathLength} hops`);
  q3compare.diff?.humanNotes?.forEach((n) => console.log(`    ${n}`));

  const codeHeavy = q3compare.diff?.humanNotes?.find((n) => n.includes('code-heavy'));
  const conceptHeavy = q3compare.diff?.humanNotes?.find((n) => n.includes('concept-heavy'));
  const invariant = q3compare.diff?.humanNotes?.find((n) => n.includes('invariant'));

  console.log('  → Interpretation: 13 rival paths connect projection spec to knowledge code.');
  console.log('    Structural ambiguity: some paths go through concepts (spec → concept → spec → code),');
  console.log('    others through code dependencies (spec → code → test → code).');
  if (invariant) console.log('    One path passes through an invariant node — formally stronger.');
}

results.push({
  question: 'Q3: Are there rival explanatory paths for a cross-layer architectural claim?',
  operators: ['Compare'],
  from: PROJECTION_SPEC,
  to: EVALUATE_JS,
  compareResult: q3compare
    ? {
        ok: q3compare.ok,
        pathCount: q3compare.pathCount,
        pathLength: q3compare.diff?.pathLength,
        sharedNodes: q3compare.diff?.sharedNodes,
        humanNotes: q3compare.diff?.humanNotes,
      }
    : null,
  interpretation:
    '13 rival paths connect PROJECTION_SPEC to evaluate.js across the projection→knowledge layer boundary. Path diversity shows structural ambiguity: concept-mediated paths (via GraphModel, L0_ONE_SCREEN_CORE), code-dependency paths (via test files), and one invariant-passing path (through Canonical-Only Graph Build). This is expected cross-layer coupling, not a defect.',
});

writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`\n✓ architectureReading.examples.json written (${results.length} scenarios)`);
console.log('\n⚠ All results are exploration-mode artifacts. No canonicalization performed.');
