#!/usr/bin/env node
/**
 * Cabin Calibration Report (v2)
 *
 * Runs cabin diagnostic pass for each available adapter, grades results,
 * and produces a calibration summary comparing adapters and modes.
 *
 * Usage:
 *   node eval/runCabinCalibrationReport.js
 *   node eval/runCabinCalibrationReport.js --save   (writes JSON report)
 *   node eval/runCabinCalibrationReport.js --trace  (verbose model logging)
 *
 * Exit code: always 0 (report, not gate).
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { cabinDiagnose, cabinDiagnoseModelBacked } from '../src/cabin/index.js';
import { matchDiagnosis } from '../src/cabin/matcher.js';
import { stubAdapter } from '../src/cabin/adapters/stub.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');

const args = process.argv.slice(2);
const saveFlag = args.includes('--save');
const traceFlag = args.includes('--trace');

const cases = JSON.parse(
  readFileSync(resolve(__dir, 'cabin_cases', 'golden_v1.json'), 'utf-8'),
);
const questions = JSON.parse(
  readFileSync(resolve(root, 'questions', 'tension-set-v1.json'), 'utf-8'),
);

function loadWorld(worldRef) {
  const worldDir = resolve(root, worldRef);
  return {
    nodes: JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8')),
    edges: JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8')),
  };
}

function loadGrades(adapterName) {
  const path = resolve(__dir, 'cabin_grades', `${adapterName}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function buildInput(c) {
  const input = { world_ref: c.world_ref, mode: c.mode };
  if (c.mode === 'question_driven') input.question_id = c.input.question_id;
  else input.probe = c.input.probe;
  return input;
}

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

const DIMENSION_KEYS = [
  'issue_type_correctness', 'severity_correctness', 'evidence_adequacy',
  'grounding_quality', 'boundedness', 'specificity', 'actionability',
];

function gradeSummary(grades) {
  const counts = { pass: 0, weak_pass: 0, structured_wrong: 0, parse_fail: 0, fail: 0 };
  for (const g of grades) counts[g.overall] = (counts[g.overall] ?? 0) + 1;

  const dimStats = {};
  for (const k of DIMENSION_KEYS) {
    dimStats[k] = { pass: 0, weak_pass: 0, fail: 0, na: 0 };
    for (const g of grades) {
      const v = g.dimensions?.[k] ?? 'n/a';
      if (v === 'n/a') dimStats[k].na++;
      else dimStats[k][v] = (dimStats[k][v] ?? 0) + 1;
    }
  }

  return { counts, dimStats, total: grades.length };
}

async function runAdapter(adapterName, adapter, isAsync) {
  const results = [];
  for (const c of cases) {
    const world = loadWorld(c.world_ref);
    const input = buildInput(c);
    let diagnoses;
    try {
      if (isAsync) {
        diagnoses = await cabinDiagnoseModelBacked(input, world, questions, adapter, { trace: traceFlag });
      } else {
        diagnoses = cabinDiagnose(input, world, questions);
      }
    } catch (err) {
      results.push({ case_id: c.case_id, mode: c.mode, match_pass: false, error: err.message, diagnoses_count: 0 });
      continue;
    }
    const match = diagnoses.length > 0 ? findBestMatch(diagnoses, c.expected, c.case_id) : null;
    results.push({
      case_id: c.case_id,
      mode: c.mode,
      match_pass: match?.pass ?? false,
      diagnoses_count: diagnoses.length,
    });
  }
  return results;
}

async function main() {
  const timestamp = new Date().toISOString();
  const report = { timestamp, case_count: cases.length, adapters: {} };

  console.log('# Cabin Calibration Report (v2)');
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Cases: ${cases.length}`);
  console.log('');

  const adaptersToRun = [
    { name: 'deterministic', adapter: null, async: false },
    { name: 'stub', adapter: stubAdapter, async: true },
  ];

  let openaiAvailable = false;
  if (process.env.CABIN_OPENAI_API_KEY) {
    try {
      const { createOpenAIAdapter } = await import('../src/cabin/adapters/openai.js');
      adaptersToRun.push({ name: 'openai', adapter: createOpenAIAdapter(), async: true });
      openaiAvailable = true;
    } catch (err) {
      console.log(`[warn] OpenAI adapter failed to load: ${err.message}\n`);
    }
  }

  for (const { name, adapter, async: isAsync } of adaptersToRun) {
    console.log(`## Adapter: ${name}`);
    const results = await runAdapter(name, adapter, isAsync);
    const matchPass = results.filter((r) => r.match_pass).length;
    const matchFail = results.length - matchPass;

    console.log(`  Match: ${matchPass}/${results.length} pass, ${matchFail} fail`);

    const byMode = {};
    for (const r of results) {
      byMode[r.mode] = byMode[r.mode] ?? { pass: 0, fail: 0 };
      if (r.match_pass) byMode[r.mode].pass++;
      else byMode[r.mode].fail++;
    }
    for (const [mode, stats] of Object.entries(byMode)) {
      console.log(`    ${mode}: ${stats.pass} pass, ${stats.fail} fail`);
    }

    const grades = loadGrades(name);
    if (grades) {
      const summary = gradeSummary(grades);
      console.log(`  Grades (from file):`);
      console.log(`    overall: ${JSON.stringify(summary.counts)}`);
      for (const [dim, stats] of Object.entries(summary.dimStats)) {
        const parts = Object.entries(stats).filter(([, v]) => v > 0).map(([k, v]) => `${k}=${v}`);
        console.log(`    ${dim}: ${parts.join(', ')}`);
      }

      const patterns = {};
      for (const g of grades) {
        for (const p of g.failure_patterns ?? []) patterns[p] = (patterns[p] ?? 0) + 1;
      }
      if (Object.keys(patterns).length > 0) {
        console.log(`  Failure patterns: ${JSON.stringify(patterns)}`);
      }
    } else {
      console.log(`  Grades: no grade file found (eval/cabin_grades/${name}.json)`);
    }

    report.adapters[name] = {
      match_pass: matchPass,
      match_fail: matchFail,
      by_mode: byMode,
      grades_available: !!grades,
    };

    console.log('');
  }

  if (!openaiAvailable) {
    console.log('Note: OpenAI adapter not tested (CABIN_OPENAI_API_KEY not set).');
    console.log('Set the env var and re-run to include model-backed calibration.\n');
  }

  console.log('## Comparison matrix');
  console.log('| Adapter | QD pass | QD fail | GR pass | GR fail | Total |');
  console.log('|---------|---------|---------|---------|---------|-------|');
  for (const [name, data] of Object.entries(report.adapters)) {
    const qd = data.by_mode.question_driven ?? { pass: 0, fail: 0 };
    const gr = data.by_mode.graph_relief_driven ?? { pass: 0, fail: 0 };
    console.log(`| ${name} | ${qd.pass} | ${qd.fail} | ${gr.pass} | ${gr.fail} | ${data.match_pass}/${data.match_pass + data.match_fail} |`);
  }
  console.log('');

  if (saveFlag) {
    const reportPath = resolve(root, 'reports', 'cabin-calibration-v2.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`Report saved to: ${reportPath}`);
  }
}

main();
