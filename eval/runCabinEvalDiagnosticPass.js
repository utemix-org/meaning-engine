#!/usr/bin/env node
/**
 * Cabin Eval — Diagnostic Pass Runner (v1)
 *
 * For each golden case: runs cabinDiagnose(), then matches the
 * resulting CabinDiagnosis against the expected shape from the case.
 * Prints a per-case and per-field pass/fail report.
 *
 * Deterministic, no LLM.
 *
 * Usage: node eval/runCabinEvalDiagnosticPass.js
 * Exit code 0 = all pass, 1 = at least one fail.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { cabinDiagnose } from '../src/cabin/index.js';
import { matchDiagnosis } from '../src/cabin/matcher.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');

const cases = JSON.parse(
  readFileSync(resolve(__dir, 'cabin_cases', 'golden_v1.json'), 'utf-8'),
);

const questions = JSON.parse(
  readFileSync(resolve(root, 'questions', 'tension-set-v1.json'), 'utf-8'),
);

function loadWorld(worldRef) {
  const worldDir = resolve(root, worldRef);
  const nodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const edges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
  return { nodes, edges };
}

console.log('# Cabin Eval — Diagnostic Pass Report (v1)');
console.log(`Cases: ${cases.length}`);
console.log('');

let totalPass = 0;
let totalFail = 0;

for (const c of cases) {
  const world = loadWorld(c.world_ref);

  const input = {
    world_ref: c.world_ref,
    mode: c.mode,
  };

  if (c.mode === 'question_driven') {
    input.question_id = c.input.question_id;
  } else {
    input.probe = c.input.probe;
  }

  let diagnoses;
  try {
    diagnoses = cabinDiagnose(input, world, questions);
  } catch (err) {
    console.log(`✗ [${c.case_id}] ${c.mode} — cabin error: ${err.message}`);
    totalFail++;
    continue;
  }

  if (diagnoses.length === 0) {
    console.log(`✗ [${c.case_id}] ${c.mode} — cabin returned 0 diagnoses`);
    totalFail++;
    continue;
  }

  const bestMatch = findBestMatch(diagnoses, c.expected, c.case_id);
  const icon = bestMatch.pass ? '✓' : '✗';
  console.log(`${icon} [${c.case_id}] ${c.mode} — ${c.expected.issue_type}`);
  for (const f of bestMatch.fields) {
    console.log(`    ${f.pass ? '✓' : '✗'} ${f.field}: expected=${fmt(f.expected)} actual=${fmt(f.actual)}`);
  }

  if (bestMatch.pass) totalPass++;
  else totalFail++;
}

console.log('');
console.log(`## Summary: ${totalPass}/${cases.length} pass, ${totalFail} fail`);

if (totalFail > 0) process.exit(1);

function findBestMatch(diagnoses, expected, caseId) {
  let best = null;
  for (const d of diagnoses) {
    const result = matchDiagnosis(d, expected, caseId);
    if (result.pass) return result;
    if (!best || result.fields.filter((f) => f.pass).length > best.fields.filter((f) => f.pass).length) {
      best = result;
    }
  }
  return best;
}

function fmt(v) {
  if (Array.isArray(v)) return `[${v.join(', ')}]`;
  if (typeof v === 'string' && v.length > 60) return `"${v.slice(0, 57)}..."`;
  return JSON.stringify(v);
}
