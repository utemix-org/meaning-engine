/**
 * Architecture Reading — Pack 2: Boundaries vs Explanations
 *
 * 3 cases that explore how directed graph structure encodes architecture:
 *
 *   Case 1: Directed boundary exists, but undirected explanation routes exist
 *   Case 2: True isolation — no connectivity at all, bridge candidates proposed
 *   Case 3: Boundary is direction-dependent — implements edges create asymmetry
 *
 * All results are exploration-mode artifacts. No canonicalization.
 *
 * Usage:
 *   node operators/runArchitectureReadingPack2.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { trace } from './trace.js';
import { compare } from './compare.js';
import { normalizeGraphByRedirects } from './normalizeGraphByRedirects.js';
import { supportsCompare, supportsBridgeCandidates, rankBridgeCandidates } from './supports.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..', 'worlds', 'documentation-world');
const outPath = resolve(__dir, 'architectureReadingPack2.examples.json');

const rawNodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
const rawEdges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
const graph = normalizeGraphByRedirects({ nodes: rawNodes, edges: rawEdges });

const NAVIGATION_SPEC = 'https://www.notion.so/b997b23c7bb94390be3351504e64d1fd';
const EVALUATE_JS = 'code:file:src/core/knowledge/evaluate.js';
const EVIDENCE_3A = 'evidence:grounding-phase-3a-tests';
const VALIDATE_JS = 'code:file:src/validate.js';
const APPLY_TRANSITION_JS = 'code:file:src/core/navigation/applyTransition.js';

const results = [];

// ═══ Case 1: Directed boundary but explanation exists ═════════════════════
console.log('═══ Case 1: Directed boundary but explanation routes exist ═══');
console.log('  Q: "Связана ли NAVIGATION_SPEC с evaluate.js напрямую?"');

const c1trace = trace(graph, NAVIGATION_SPEC, EVALUATE_JS);
console.log(`  Trace (NAVIGATION_SPEC → evaluate.js): ${c1trace.ok ? 'PATH' : 'no_path'}`);

const c1sc = supportsCompare(graph, NAVIGATION_SPEC, EVALUATE_JS);
console.log(`  supportsCompare: ${c1sc.ok} (${c1sc.detail?.paths} paths, ${c1sc.detail?.hops} hops)`);

let c1compare = null;
if (c1sc.ok) {
  c1compare = compare(graph, NAVIGATION_SPEC, EVALUATE_JS);
  console.log(`  Compare: ${c1compare.pathCount} rival paths`);
  c1compare.diff?.humanNotes?.forEach((n) => console.log(`    ${n}`));
}

console.log('  → Interpretation: Нет прямой направленной связи (граница между');
console.log('    navigation и knowledge слоями). Но Compare находит 3 обходных');
console.log('    маршрута — граница ≠ изоляция, это constraint на направление зависимостей.');

results.push({
  case: 'Case 1: Directed boundary but explanation exists',
  question: 'Связана ли NAVIGATION_SPEC с evaluate.js напрямую?',
  from: NAVIGATION_SPEC,
  to: EVALUATE_JS,
  traceResult: { ok: c1trace.ok, reason: c1trace.reason },
  compareResult: c1compare ? {
    ok: c1compare.ok,
    pathCount: c1compare.pathCount,
    humanNotes: c1compare.diff?.humanNotes,
  } : null,
  interpretation: 'No directed path from NAVIGATION_SPEC to evaluate.js — this is a layer boundary between navigation and knowledge. Compare finds 3 undirected rival routes, confirming the boundary is a dependency-direction constraint, not isolation.',
});

// ═══ Case 2: True isolation (GAP) + bridge candidates ════════════════════
console.log('\n═══ Case 2: True isolation — GAP with bridge candidates ═══');
console.log('  Q: "Есть ли какая-то связь evidence → validate.js?"');

const c2trace = trace(graph, EVIDENCE_3A, VALIDATE_JS);
console.log(`  Trace (evidence → validate.js): ${c2trace.ok ? 'PATH' : 'no_path'}`);

const c2bc = supportsBridgeCandidates(graph, EVIDENCE_3A, VALIDATE_JS);
console.log(`  supportsBridgeCandidates: ${c2bc.ok} (candidates: ${c2bc.detail?.candidateCount})`);

let c2candidates = [];
if (c2bc.ok) {
  c2candidates = rankBridgeCandidates({ fromId: EVIDENCE_3A, toId: VALIDATE_JS }, graph);
  c2candidates.forEach((c) =>
    console.log(`    → ${c.candidateConceptId} (${c.heuristic}, score=${c.score})`),
  );
}

console.log('  → Interpretation: validate.js — единственный по-настоящему изолированный');
console.log('    узел (нет ни направленной, ни ненаправленной связи). Это реальный GAP,');
console.log('    а не архитектурная граница. BridgeCandidates предлагает concept:code-spec-alignment');
console.log('    как возможный мост.');

results.push({
  case: 'Case 2: True isolation (GAP) + bridge candidates',
  question: 'Есть ли какая-то связь evidence → validate.js?',
  from: EVIDENCE_3A,
  to: VALIDATE_JS,
  traceResult: { ok: c2trace.ok, reason: c2trace.reason },
  bridgeCandidates: {
    supported: c2bc.ok,
    candidateCount: c2bc.detail?.candidateCount,
    candidates: c2candidates.map((c) => ({
      id: c.candidateConceptId,
      heuristic: c.heuristic,
      score: c.score,
    })),
  },
  interpretation: 'validate.js is the only truly isolated node in doc-world (no undirected connectivity). This is a real GAP, not an architectural boundary. BridgeCandidates proposes concept:code-spec-alignment as a potential bridge concept.',
});

// ═══ Case 3: Boundary depends on direction ════════════════════════════════
console.log('\n═══ Case 3: Boundary disappears when direction is inverted ═══');
console.log('  Q: "Граница NAVIGATION_SPEC ↔ applyTransition.js — это изоляция или направление?"');

const c3ab = trace(graph, NAVIGATION_SPEC, APPLY_TRANSITION_JS);
const c3ba = trace(graph, APPLY_TRANSITION_JS, NAVIGATION_SPEC);
console.log(`  Trace (NAVIGATION_SPEC → applyTransition.js): ${c3ab.ok ? 'PATH ' + c3ab.hops + ' hops' : 'no_path'}`);
console.log(`  Trace (applyTransition.js → NAVIGATION_SPEC): ${c3ba.ok ? 'PATH ' + c3ba.hops + ' hop' : 'no_path'}`);
if (c3ba.ok) {
  console.log(`    path: ${c3ba.path.map((s) => s.nodeId.split('/').pop().replace('https://www.notion.so/', '')).join(' → ')}`);
}

console.log('  → Interpretation: NAVIGATION_SPEC → applyTransition.js: нет пути (spec не');
console.log('    зависит от кода). applyTransition.js → NAVIGATION_SPEC: 1 hop (implements).');
console.log('    Граница — не изоляция, а выражение направления ответственности:');
console.log('    "код реализует спецификацию", а не "спецификация зависит от кода".');

results.push({
  case: 'Case 3: Boundary depends on direction',
  question: 'Граница NAVIGATION_SPEC ↔ applyTransition.js — это изоляция или направление?',
  nodeA: NAVIGATION_SPEC,
  nodeB: APPLY_TRANSITION_JS,
  traceAtoB: { ok: c3ab.ok, reason: c3ab.reason },
  traceBtoA: { ok: c3ba.ok, hops: c3ba.hops, path: c3ba.path?.map((s) => s.nodeId) },
  interpretation: 'NAVIGATION_SPEC → applyTransition.js: no directed path (spec does not depend on code). applyTransition.js → NAVIGATION_SPEC: 1 hop via implements edge. The boundary encodes responsibility direction: "code implements spec", not "spec depends on code". This is a dependency-direction constraint, not isolation.',
});

writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`\n✓ architectureReadingPack2.examples.json written (${results.length} cases)`);
console.log('\n⚠ All results are exploration-mode artifacts. No canonicalization performed.');
