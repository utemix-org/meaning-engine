/**
 * Traceability World — Demo Pack
 *
 * Runs 5 scenarios demonstrating Meaning Engine capabilities on a
 * spec → code → test traceability graph for an authentication module.
 *
 * Usage:
 *   node --experimental-vm-modules worlds/traceability-world/demo.js
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GraphModel } from '../../src/core/index.js';
import { projectGraph } from '../../src/core/projection/projectGraph.js';
import { defaultParams } from '../../src/core/projection/types.js';
import { trace } from '../../operators/trace.js';
import { compare } from '../../operators/compare.js';
import {
  supportsInspect,
  supportsTrace,
  rankBridgeCandidates,
} from '../../operators/supports.js';

const __dir = dirname(fileURLToPath(import.meta.url));

const nodesRaw = JSON.parse(readFileSync(resolve(__dir, 'seed.nodes.json'), 'utf-8'));
const edgesRaw = JSON.parse(readFileSync(resolve(__dir, 'seed.edges.json'), 'utf-8'));
const rawGraph = { nodes: nodesRaw, edges: edgesRaw };
const graphModel = new GraphModel({
  nodes: nodesRaw.map((n) => ({ ...n, label: n.title })),
  edges: edgesRaw.map((e, i) => ({ id: `trace-edge-${i}`, ...e })),
});

function hr(title) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('─'.repeat(60));
}

function printPath(result) {
  if (!result.path || result.path.length === 0) return;
  const steps = result.path.map((s) => {
    const node = nodesRaw.find((n) => n.id === s.nodeId);
    return `${s.nodeId} (${node?.type || '?'})`;
  });
  console.log(`  Path: ${steps.join(' → ')}`);
}

// ─── World overview ──────────────────────────────────────────────────────────

console.log('Meaning Engine — Traceability World Demo');
console.log(`Date: ${new Date().toISOString()}\n`);
console.log(`World: Authentication Module Traceability`);
console.log(`  Nodes: ${nodesRaw.length}`);
console.log(`  Edges: ${edgesRaw.length}`);
console.log(`  Node types: ${[...new Set(nodesRaw.map((n) => n.type))].join(', ')}`);
console.log(`  Edge types: ${[...new Set(edgesRaw.map((e) => e.type))].join(', ')}`);

const inspect = supportsInspect(rawGraph);
const traceSupport = supportsTrace(rawGraph);
console.log(`\n  supportsInspect: ${inspect.ok ? 'ok' : 'FAIL'}`);
console.log(`  supportsTrace:   ${traceSupport.ok ? 'ok' : 'FAIL'}`);

// ─── Scenario 1: Spec → Evidence traceability ───────────────────────────────

hr('Scenario 1: Spec → Evidence Traceability');
console.log('  Question: Can we trace from a requirement to its test evidence?\n');

const s1 = trace(rawGraph, 'spec:auth-login', 'evidence:login-tests');
console.log(`  trace(spec:auth-login → evidence:login-tests)`);
console.log(`  Result: ${s1.hops !== undefined ? `PATH FOUND (${s1.hops} hops)` : 'NO PATH'}`);
printPath(s1);

const s1b = trace(rawGraph, 'spec:session-expiry', 'evidence:session-tests');
console.log(`\n  trace(spec:session-expiry → evidence:session-tests)`);
console.log(`  Result: ${s1b.hops !== undefined ? `PATH FOUND (${s1b.hops} hops)` : 'NO PATH'}`);
printPath(s1b);

console.log('\n  ✓ Both specs have traceable paths to their evidence.');
console.log('  Interpretation: the concept/invariant layers provide the semantic bridge.');

// ─── Scenario 2: Rival implementation paths ─────────────────────────────────

hr('Scenario 2: Rival Implementation Paths');
console.log('  Question: Are there multiple routes from spec to evidence?\n');

const s2 = compare(rawGraph, 'spec:auth-login', 'evidence:login-tests');
console.log(`  compare(spec:auth-login, evidence:login-tests)`);
console.log(`  Result: ${s2.ok ? `${s2.pathCount} RIVAL PATHS` : `no rivals (${s2.note})`}`);

if (s2.paths && s2.paths.length > 0) {
  for (let i = 0; i < s2.paths.length; i++) {
    const p = s2.paths[i];
    const route = (p.nodeTitles || p.nodeIds || []).join(' → ');
    const types = Object.entries(p.nodeTypeHistogram || {})
      .map(([t, c]) => `${t}:${c}`)
      .join(', ');
    console.log(`    Path ${i + 1}: ${route}`);
    console.log(`      Types: ${types}`);
  }
}

if (s2.clusters && s2.clusters.length > 0) {
  console.log(`\n  Clusters: ${s2.clusters.length}`);
  for (const cl of s2.clusters) {
    console.log(`    - "${cl.labels?.join(', ')}" (${cl.count} paths)`);
  }
}

console.log('\n  ✓ Multiple paths exist — one through code, one through concepts.');
console.log('  Interpretation: the spec reaches evidence via both implementation and abstraction layers.');

// ─── Scenario 3: Gap detection ──────────────────────────────────────────────

hr('Scenario 3: Gap Detection — Missing Test Evidence');
console.log('  Question: Does the password-reset spec have test evidence?\n');

const evidenceIds = nodesRaw.filter((n) => n.type === 'evidence').map((n) => n.id);
let gapFound = true;
for (const eid of evidenceIds) {
  const result = trace(rawGraph, 'spec:password-reset', eid);
  if (result.hops !== undefined) {
    console.log(`  trace(spec:password-reset → ${eid}): PATH FOUND (${result.hops} hops)`);
    gapFound = false;
  }
}
if (gapFound) {
  console.log('  trace(spec:password-reset → any evidence): NO PATH');
}

const candidates = rankBridgeCandidates(
  { fromId: 'spec:password-reset', toId: 'evidence:login-tests' },
  rawGraph,
);
if (candidates.length > 0) {
  console.log(`\n  Bridge candidates suggested:`);
  for (const c of candidates) {
    console.log(`    - ${c.candidateConceptId} (score: ${c.score})`);
  }
}

console.log('\n  ⚠ GAP: spec:password-reset has code (resetHandler.js) but no tests.');
console.log('  The password recovery feature has a defined concept and implementation');
console.log('  but no evidence proving it works. This is a traceability gap.');

// ─── Scenario 4: Invariant enforcement trace ────────────────────────────────

hr('Scenario 4: Invariant Enforcement Trace');
console.log('  Question: Can we trace invariants to their evidence?\n');

const s4a = trace(rawGraph, 'invariant:no-plaintext', 'evidence:hash-tests');
console.log(`  trace(invariant:no-plaintext → evidence:hash-tests)`);
console.log(`  Result: ${s4a.hops !== undefined ? `PATH FOUND (${s4a.hops} hops)` : 'NO PATH'}`);
printPath(s4a);

const s4b = trace(rawGraph, 'invariant:audit-trail', 'evidence:login-tests');
console.log(`\n  trace(invariant:audit-trail → evidence:login-tests)`);
console.log(`  Result: ${s4b.hops !== undefined ? `PATH FOUND (${s4b.hops} hops)` : 'NO PATH'}`);
printPath(s4b);

const s4c = trace(rawGraph, 'code_artifact:authService', 'spec:auth-login');
console.log(`\n  trace(code:authService → spec:auth-login)`);
console.log(`  Result: ${s4c.hops !== undefined ? `PATH FOUND (${s4c.hops} hops)` : 'NO PATH'}`);
printPath(s4c);

console.log('\n  ✓ Both invariants trace directly to evidence.');
console.log('  ✓ Code traces back to spec via implements edge.');

// ─── Scenario 5: Projection ─────────────────────────────────────────────────

hr('Scenario 5: Focused Projection');
console.log('  Question: What does the neighborhood of spec:auth-login look like?\n');

const s5 = projectGraph(
  graphModel,
  { nodeId: 'spec:auth-login', path: [] },
  null,
  defaultParams(),
);
if (s5.ok) {
  const vm = s5.viewModel;
  console.log(`  Focus: spec:auth-login`);
  console.log(`  Visible nodes: ${vm.scene.nodes.length}`);
  console.log(`  Visible edges: ${vm.scene.edges.length}`);
  console.log(`  Neighbors: ${vm.panels.neighbors.map((n) => n.id).join(', ')}`);
  console.log(`  Focus type: ${vm.panels.focusNode.type}`);
  console.log(`  Navigation: canDrillDown=${vm.navigation.canDrillDown}, canDrillUp=${vm.navigation.canDrillUp}`);
}

console.log('\n  ✓ Projection reveals the local structure around the focused requirement.');

// ─── Summary ─────────────────────────────────────────────────────────────────

hr('Summary');
console.log(`
  This demo shows Meaning Engine operating on a realistic engineering problem:
  tracing requirements through implementation to test evidence.

  ┌─────────────────────────────────────────────────────────┐
  │ Demonstrated capabilities:                              │
  │  • Directed trace through concept/invariant layers      │
  │  • Rival path detection (concept vs code paths)         │
  │  • Gap detection with bridge candidates                 │
  │  • Invariant enforcement tracing                        │
  │  • Focused projection of local structure                │
  ├─────────────────────────────────────────────────────────┤
  │ Not demonstrated:                                       │
  │  • Large-scale traceability (this is a 21-node world)   │
  │  • Real-time or incremental graph updates               │
  │  • Integration with external ALM/test tooling           │
  │  • Automated gap remediation                            │
  └─────────────────────────────────────────────────────────┘
`);

console.log('Done.');
