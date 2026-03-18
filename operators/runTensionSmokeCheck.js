#!/usr/bin/env node
/**
 * Tension Smoke Check — structural observability report.
 *
 * Loads the tension-test-world and checks whether each embedded tension
 * pattern from Tension Set v1 is structurally detectable.
 *
 * Usage: node operators/runTensionSmokeCheck.js
 *
 * No LLM, no scoring — pure structural detection.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { trace } from './trace.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..', 'worlds', 'tension-test-world');

const nodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
const edges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
const graph = { nodes, edges };

const results = [];

function check(id, name, fn) {
  const detected = fn();
  results.push({ id, name, detected });
}

// DRM: drift_against edge exists between code artifact and spec
check('DRM', 'doc_runtime_mismatch', () => {
  return edges.some(
    (e) => e.type === 'drift_against' &&
           e.source === 'code_artifact:toJSON' &&
           e.target === 'spec:serialization-format',
  );
});

// TCD: contradicts edge exists between code artifact and type declaration
check('TCD', 'type_contract_drift', () => {
  return edges.some(
    (e) => e.type === 'contradicts' &&
           e.source === 'code_artifact:getNeighbors' &&
           e.target === 'spec:type-declarations',
  );
});

// VOC: two concept nodes linked to same code via used_by, no same_as between them
check('VOC', 'vocabulary_ambiguity', () => {
  const linksUsedBy = edges.filter(
    (e) => e.source === 'concept:links' && e.type === 'used_by',
  );
  const edgesUsedBy = edges.filter(
    (e) => e.source === 'concept:edges' && e.type === 'used_by',
  );
  const sharedTargets = linksUsedBy
    .map((e) => e.target)
    .filter((t) => edgesUsedBy.some((e2) => e2.target === t));
  const hasSameAs = edges.some(
    (e) =>
      (e.type === 'same_as' || e.type === 'alias_of') &&
      ((e.source === 'concept:links' && e.target === 'concept:edges') ||
       (e.source === 'concept:edges' && e.target === 'concept:links')),
  );
  return sharedTargets.length > 0 && !hasSameAs;
});

// USC: decision node with applies_to but no proved_by
check('USC', 'unsupported_claim', () => {
  const hasAppliesTo = edges.some(
    (e) => e.source === 'decision:projection-formula' && e.type === 'applies_to',
  );
  const hasProvedBy = edges.some(
    (e) => e.source === 'decision:projection-formula' && e.type === 'proved_by',
  );
  return hasAppliesTo && !hasProvedBy;
});

// MBR: concept:epistemic-log is isolated (no edges)
check('MBR', 'missing_bridge', () => {
  const hasAnyEdge = edges.some(
    (e) => e.source === 'concept:epistemic-log' || e.target === 'concept:epistemic-log',
  );
  if (hasAnyEdge) return false;

  const traceResult = trace(graph, 'concept:graph-model', 'concept:epistemic-log');
  return traceResult.ok === false || traceResult.status === 'no_path';
});

// Report
console.log('# Tension Smoke Check — tension-test-world');
console.log(`Graph: ${nodes.length} nodes, ${edges.length} edges`);
console.log('');
console.log('## Results');
console.log('');

let allDetected = true;
for (const r of results) {
  const icon = r.detected ? '✓' : '✗';
  console.log(`${icon} [${r.id}] ${r.name}: ${r.detected ? 'DETECTED' : 'NOT DETECTED'}`);
  if (!r.detected) allDetected = false;
}

console.log('');
console.log(`## Summary: ${results.filter((r) => r.detected).length}/${results.length} tensions structurally observable`);

if (!allDetected) {
  console.error('\nWARNING: Not all tensions detected. Check world seed data.');
  process.exit(1);
}
