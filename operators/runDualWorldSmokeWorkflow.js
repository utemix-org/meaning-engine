/**
 * Dual-World Smoke Workflow Runner
 *
 * Runs the same 4-scenario set on both documentation-world and authored-mini-world,
 * producing comparable output for calibration.
 *
 * Scenarios:
 *   S1: Path exists (Trace → PATH)
 *   S2: Directed boundary (Trace(A→B)=no_path, Trace(B→A)=path)
 *   S3: Rival explanations (Compare → ≥2 rivals)
 *   S4: True GAP + bridge candidates (supportsBridgeCandidates ok, ≥1 candidate)
 *
 * Usage:
 *   node operators/runDualWorldSmokeWorkflow.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { trace } from './trace.js';
import { compare } from './compare.js';
import { supportsBridgeCandidates, rankBridgeCandidates } from './supports.js';
import { normalizeGraphByRedirects } from './normalizeGraphByRedirects.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const baselinePath = resolve(__dir, 'dualWorldSmoke.baseline.json');

function loadWorld(name) {
  const worldDir = resolve(__dir, '..', 'worlds', name);
  const rawN = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const rawE = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));

  if (name === 'documentation-world') {
    return normalizeGraphByRedirects({ nodes: rawN, edges: rawE });
  }
  return { nodes: rawN, edges: rawE };
}

const WORLD_SCENARIOS = {
  'documentation-world': {
    pathExists: {
      fromId: 'https://www.notion.so/e688cc28b25c40fabf27b2ab2577ab82',
      toId: 'concept:projection',
      label: 'SYSTEM_OVERVIEW → concept:projection',
    },
    directedBoundary: {
      A: 'https://www.notion.so/b997b23c7bb94390be3351504e64d1fd',
      B: 'code:file:src/core/navigation/applyTransition.js',
      label: 'NAVIGATION_SPEC ↔ applyTransition.js',
    },
    rivalExplanations: {
      fromId: 'https://www.notion.so/435b2b96d0ec40b2a7262b1151a23380',
      toId: 'code:file:src/core/knowledge/evaluate.js',
      label: 'PROJECTION_SPEC → evaluate.js',
    },
    gapBridge: {
      fromId: 'evidence:grounding-phase-3a-tests',
      toId: 'code:file:src/validate.js',
      label: 'evidence:grounding-phase-3a-tests → src/validate.js',
    },
  },
  'authored-mini-world': {
    pathExists: {
      fromId: 'spec:type-theory-overview',
      toId: 'evidence:coq-proof',
      label: 'Type Theory Overview → Coq Proof',
    },
    directedBoundary: {
      A: 'spec:type-theory-overview',
      B: 'code_artifact:type-checker',
      label: 'Type Theory Overview ↔ typeChecker.js',
    },
    rivalExplanations: {
      fromId: 'spec:type-theory-overview',
      toId: 'code_artifact:inference-engine',
      label: 'Type Theory Overview → inferenceEngine.js',
    },
    gapBridge: {
      fromId: 'spec:type-theory-overview',
      toId: 'evidence:rust-borrow-checker-test',
      label: 'Type Theory Overview → Rust Borrow Checker Test',
    },
  },
};

function runScenarios(worldName, graph, scenarios) {
  const results = { world: worldName, scenarios: {} };

  // S1: Path exists
  const s1 = scenarios.pathExists;
  const t1 = trace(graph, s1.fromId, s1.toId);
  results.scenarios.pathExists = {
    label: s1.label,
    fromId: s1.fromId,
    toId: s1.toId,
    ok: t1.hops != null,
    hops: t1.hops ?? null,
  };

  // S2: Directed boundary
  const s2 = scenarios.directedBoundary;
  const t2a = trace(graph, s2.A, s2.B);
  const t2b = trace(graph, s2.B, s2.A);
  results.scenarios.directedBoundary = {
    label: s2.label,
    A: s2.A,
    B: s2.B,
    traceAB: t2a.hops != null ? 'path' : 'no_path',
    traceBA: t2b.hops != null ? 'path' : 'no_path',
    ok: t2a.hops == null && t2b.hops != null,
    hopsBA: t2b.hops ?? null,
  };

  // S3: Rival explanations
  const s3 = scenarios.rivalExplanations;
  const c3 = compare(graph, s3.fromId, s3.toId);
  results.scenarios.rivalExplanations = {
    label: s3.label,
    fromId: s3.fromId,
    toId: s3.toId,
    ok: c3.ok === true && c3.pathCount >= 2,
    rivalCount: c3.pathCount ?? 0,
    clusterCount: c3.clusterCount ?? 0,
  };

  // S4: GAP + bridge candidates
  const s4 = scenarios.gapBridge;
  const t4 = trace(graph, s4.fromId, s4.toId);
  const sb4 = supportsBridgeCandidates(graph, s4.fromId, s4.toId);
  const cands = sb4.ok
    ? rankBridgeCandidates({ fromId: s4.fromId, toId: s4.toId }, graph)
    : [];
  results.scenarios.gapBridge = {
    label: s4.label,
    fromId: s4.fromId,
    toId: s4.toId,
    traceResult: t4.hops != null ? 'path' : 'no_path',
    ok: t4.hops == null && sb4.ok === true && cands.length >= 1,
    supportsBridge: sb4.ok,
    candidateCount: cands.length,
  };

  return results;
}

export function runDualWorldSmoke() {
  const allResults = [];

  for (const worldName of Object.keys(WORLD_SCENARIOS)) {
    const graph = loadWorld(worldName);
    const scenarios = WORLD_SCENARIOS[worldName];
    const result = runScenarios(worldName, graph, scenarios);
    allResults.push(result);
  }

  return allResults;
}

export { WORLD_SCENARIOS };

// ── CLI entry point ─────────────────────────────────────────────────────
const isMain =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  (process.argv[1].endsWith('runDualWorldSmokeWorkflow.js') ||
    process.argv[1].includes('runDualWorldSmokeWorkflow'));

if (isMain) {
  const results = runDualWorldSmoke();

  for (const worldResult of results) {
    console.log(`\n═══ ${worldResult.world} ═══`);
    for (const [name, s] of Object.entries(worldResult.scenarios)) {
      const status = s.ok ? '✓' : '✗';
      const detail =
        name === 'pathExists'
          ? `hops=${s.hops}`
          : name === 'directedBoundary'
            ? `A→B=${s.traceAB}, B→A=${s.traceBA}`
            : name === 'rivalExplanations'
              ? `rivals=${s.rivalCount}, clusters=${s.clusterCount}`
              : `bridge=${s.supportsBridge}, candidates=${s.candidateCount}`;
      console.log(`  ${status} ${name}: ${s.label} — ${detail}`);
    }
  }

  writeFileSync(baselinePath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n✓ Baseline written to dualWorldSmoke.baseline.json`);
  console.log(`⚠ All results are exploration-mode artifacts. No canonicalization.`);
}
