#!/usr/bin/env node
/**
 * Cabin Eval Stub Runner (v1)
 *
 * Loads a proof world, reads golden cases, and checks structural pass
 * criteria without any LLM. Deterministic, reproducible.
 *
 * Usage: node eval/runCabinEvalStub.js
 *
 * Exit code 0 = all pass, 1 = at least one fail.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');

const cases = JSON.parse(
  readFileSync(resolve(__dir, 'cabin_cases', 'golden_v1.json'), 'utf-8'),
);

const questions = JSON.parse(
  readFileSync(resolve(root, 'questions', 'tension-set-v1.json'), 'utf-8'),
);

const worldCache = new Map();

function loadWorld(worldRef) {
  if (worldCache.has(worldRef)) return worldCache.get(worldRef);
  const worldDir = resolve(root, worldRef);
  const nodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const edges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
  const world = { nodes, edges };
  worldCache.set(worldRef, world);
  return world;
}

function checkNodeExists(world, params) {
  const found = world.nodes.some((n) => n.id === params.node_id);
  return { pass: found, detail: found ? `node ${params.node_id} exists` : `node ${params.node_id} NOT FOUND` };
}

function checkEdgeExists(world, params) {
  const found = world.edges.some(
    (e) => e.source === params.source && e.target === params.target && e.type === params.edge_type,
  );
  return {
    pass: found,
    detail: found
      ? `edge ${params.source} →[${params.edge_type}]→ ${params.target} exists`
      : `edge ${params.source} →[${params.edge_type}]→ ${params.target} NOT FOUND`,
  };
}

function checkEdgeAbsent(world, params) {
  const found = world.edges.some(
    (e) => e.source === params.source && e.target === params.target && e.type === params.edge_type,
  );
  return {
    pass: !found,
    detail: !found
      ? `edge ${params.source} →[${params.edge_type}]→ ${params.target} correctly absent`
      : `edge ${params.source} →[${params.edge_type}]→ ${params.target} UNEXPECTEDLY PRESENT`,
  };
}

function checkNodeIsolated(world, params) {
  const hasEdge = world.edges.some(
    (e) => e.source === params.node_id || e.target === params.node_id,
  );
  return {
    pass: !hasEdge,
    detail: !hasEdge
      ? `node ${params.node_id} is isolated (0 edges)`
      : `node ${params.node_id} HAS EDGES (not isolated)`,
  };
}

function checkNodeWithoutEdgeType(world, params) {
  const { node_id, edge_type, direction } = params;
  let hasEdge;
  if (direction === 'outgoing') {
    hasEdge = world.edges.some((e) => e.source === node_id && e.type === edge_type);
  } else if (direction === 'incoming') {
    hasEdge = world.edges.some((e) => e.target === node_id && e.type === edge_type);
  } else {
    hasEdge = world.edges.some(
      (e) => (e.source === node_id || e.target === node_id) && e.type === edge_type,
    );
  }
  return {
    pass: !hasEdge,
    detail: !hasEdge
      ? `node ${node_id} has no ${direction || 'any'} ${edge_type} edge`
      : `node ${node_id} HAS ${direction || ''} ${edge_type} edge`,
  };
}

const CHECK_HANDLERS = {
  node_exists: checkNodeExists,
  edge_exists: checkEdgeExists,
  edge_absent: checkEdgeAbsent,
  node_isolated: checkNodeIsolated,
  node_without_edge_type: checkNodeWithoutEdgeType,
};

function runCase(c) {
  const result = { case_id: c.case_id, mode: c.mode, pass: true, checks: [] };

  let world;
  try {
    world = loadWorld(c.world_ref);
  } catch (err) {
    result.pass = false;
    result.checks.push({ pass: false, detail: `Failed to load world: ${err.message}` });
    return result;
  }

  if (c.mode === 'question_driven') {
    const q = questions.find((q) => q.id === c.input.question_id);
    if (!q) {
      result.pass = false;
      result.checks.push({ pass: false, detail: `Question ${c.input.question_id} not found` });
      return result;
    }
    result.checks.push({ pass: true, detail: `Question ${c.input.question_id} loaded` });
  }

  for (const check of c.expected.structural_checks) {
    const handler = CHECK_HANDLERS[check.type];
    if (!handler) {
      const r = { pass: false, detail: `Unknown check type: ${check.type}` };
      result.checks.push(r);
      result.pass = false;
      continue;
    }
    const r = handler(world, check.params);
    result.checks.push(r);
    if (!r.pass) result.pass = false;
  }

  return result;
}

console.log('# Cabin Eval Stub — Structural Pass Report');
console.log(`Cases: ${cases.length}`);
console.log('');

let totalPass = 0;
let totalFail = 0;

for (const c of cases) {
  const result = runCase(c);
  const icon = result.pass ? '✓' : '✗';
  console.log(`${icon} [${result.case_id}] ${result.mode} — ${c.expected.issue_type}`);
  for (const ch of result.checks) {
    console.log(`    ${ch.pass ? '✓' : '✗'} ${ch.detail}`);
  }
  if (result.pass) totalPass++;
  else totalFail++;
}

console.log('');
console.log(`## Summary: ${totalPass}/${cases.length} pass, ${totalFail} fail`);

if (totalFail > 0) {
  process.exit(1);
}
