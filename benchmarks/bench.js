/**
 * Meaning Engine — Benchmark Harness
 *
 * Lightweight, reproducible benchmarks for the stable-core operations.
 * Measures wall-clock time for projection, navigation, trace, and compare
 * across synthetic and reference-world graphs.
 *
 * Usage:
 *   node --experimental-vm-modules benchmarks/bench.js
 *
 * Output: human-readable table with operation, graph size, and timing.
 *
 * NOTE: These numbers are indicative and environment-sensitive.
 * They are not strict cross-machine performance guarantees.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { GraphModel } from '../src/core/GraphModel.js';
import { projectGraph } from '../src/core/projection/projectGraph.js';
import { defaultParams, emptyFocus } from '../src/core/projection/types.js';
import { applyTransition, TransitionType } from '../src/core/navigation/index.js';
import { trace } from '../operators/trace.js';
import { compare } from '../operators/compare.js';
import { supportsTrace, supportsInspect } from '../operators/supports.js';

const __filename_resolved = fileURLToPath(import.meta.url);
const __dirname_resolved = dirname(__filename_resolved);

// ── Synthetic graph generators ───────────────────────────────────────────────

function generateChain(n) {
  const nodes = [];
  const edges = [];
  for (let i = 0; i < n; i++) {
    nodes.push({ id: `n${i}`, type: 'concept', label: `Node ${i}` });
    if (i > 0) {
      edges.push({ id: `e${i}`, source: `n${i - 1}`, target: `n${i}`, type: 'relates' });
    }
  }
  return new GraphModel({ nodes, edges });
}

function generateTree(depth, branching) {
  const nodes = [{ id: 'root', type: 'root', label: 'Root' }];
  const edges = [];
  let edgeId = 0;
  const queue = [{ id: 'root', level: 0 }];
  let nodeId = 0;

  while (queue.length > 0) {
    const { id: parentId, level } = queue.shift();
    if (level >= depth) continue;
    for (let b = 0; b < branching; b++) {
      nodeId++;
      const childId = `t${nodeId}`;
      nodes.push({ id: childId, type: 'concept', label: `T${nodeId}` });
      edges.push({ id: `te${edgeId++}`, source: parentId, target: childId, type: 'contains' });
      queue.push({ id: childId, level: level + 1 });
    }
  }
  return new GraphModel({ nodes, edges });
}

function generateGrid(rows, cols) {
  const nodes = [];
  const edges = [];
  let edgeId = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `g${r}_${c}`;
      nodes.push({ id, type: 'concept', label: `Grid(${r},${c})` });
      if (c > 0) {
        edges.push({ id: `ge${edgeId++}`, source: `g${r}_${c - 1}`, target: id, type: 'relates' });
      }
      if (r > 0) {
        edges.push({ id: `ge${edgeId++}`, source: `g${r - 1}_${c}`, target: id, type: 'relates' });
      }
    }
  }
  return new GraphModel({ nodes, edges });
}

// ── Reference world loaders ──────────────────────────────────────────────────

function loadTestWorld() {
  const raw = JSON.parse(readFileSync(
    resolve(__dirname_resolved, '../worlds/test-world/universe.json'), 'utf-8',
  ));
  return {
    graph: new GraphModel({ nodes: raw.nodes, links: raw.edges }),
    schema: raw.schema,
    name: 'test-world',
    nodes: raw.nodes.length,
    edges: raw.edges.length,
  };
}

function loadDocWorld() {
  const nodesRaw = JSON.parse(readFileSync(
    resolve(__dirname_resolved, '../worlds/documentation-world/seed.nodes.json'), 'utf-8',
  ));
  const edgesRaw = JSON.parse(readFileSync(
    resolve(__dirname_resolved, '../worlds/documentation-world/seed.edges.json'), 'utf-8',
  ));
  const nodes = nodesRaw.map(n => ({
    id: n.id,
    type: n.type || 'concept',
    label: n.label || n.id,
    ...n,
  }));
  const edges = edgesRaw.map((e, i) => ({
    id: e.id || `doc-e${i}`,
    source: e.source,
    target: e.target,
    type: e.type || 'relates',
  }));
  return {
    graph: new GraphModel({ nodes, edges }),
    schema: null,
    name: 'documentation-world',
    nodes: nodes.length,
    edges: edges.length,
  };
}

// ── Graph adapters ───────────────────────────────────────────────────────────

function toRawGraph(graphModel) {
  return {
    nodes: graphModel.getNodes(),
    edges: graphModel.getEdges(),
  };
}

// ── Timing utilities ─────────────────────────────────────────────────────────

function timeMs(fn, iterations = 1) {
  const times = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  return { avg, min, max, iterations };
}

function fmt(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

// ── Benchmark suites ─────────────────────────────────────────────────────────

const results = [];

function record(operation, graphDesc, size, timing, notes = '') {
  results.push({ operation, graphDesc, size, ...timing, notes });
}

function runProjectionBenchmarks() {
  console.log('\n=== Projection (projectGraph) ===\n');

  const sizes = [
    { name: 'chain-10', graph: generateChain(10), nodes: 10 },
    { name: 'chain-100', graph: generateChain(100), nodes: 100 },
    { name: 'chain-500', graph: generateChain(500), nodes: 500 },
    { name: 'chain-1000', graph: generateChain(1000), nodes: 1000 },
    { name: 'tree-3x4', graph: generateTree(4, 3), nodes: null },
    { name: 'tree-3x5', graph: generateTree(5, 3), nodes: null },
    { name: 'grid-10x10', graph: generateGrid(10, 10), nodes: 100 },
    { name: 'grid-20x20', graph: generateGrid(20, 20), nodes: 400 },
    { name: 'grid-50x50', graph: generateGrid(50, 50), nodes: 2500 },
  ];

  for (const { name, graph, nodes: expectedNodes } of sizes) {
    const n = graph.getNodes().length;
    const e = graph.getEdges().length;
    const firstNodeId = graph.getNodes()[0].id;

    const tNoFocus = timeMs(() => projectGraph(graph, emptyFocus(), null, defaultParams()), 50);
    record('projectGraph (no focus)', name, `${n}N/${e}E`, tNoFocus);
    console.log(`  ${name} (${n}N/${e}E) no-focus: avg=${fmt(tNoFocus.avg)} min=${fmt(tNoFocus.min)} [${tNoFocus.iterations}x]`);

    const tFocus = timeMs(() => projectGraph(graph, { nodeId: firstNodeId, path: [] }, null, defaultParams()), 50);
    record('projectGraph (focus)', name, `${n}N/${e}E`, tFocus);
    console.log(`  ${name} (${n}N/${e}E) focus: avg=${fmt(tFocus.avg)} min=${fmt(tFocus.min)} [${tFocus.iterations}x]`);
  }

  // Reference worlds
  for (const loader of [loadTestWorld, loadDocWorld]) {
    const w = loader();
    const firstNodeId = w.graph.getNodes()[0].id;
    const t = timeMs(() => projectGraph(w.graph, { nodeId: firstNodeId, path: [] }, w.schema, defaultParams()), 100);
    record('projectGraph (ref world)', w.name, `${w.nodes}N/${w.edges}E`, t);
    console.log(`  ${w.name} (${w.nodes}N/${w.edges}E): avg=${fmt(t.avg)} min=${fmt(t.min)} [${t.iterations}x]`);
  }
}

function runNavigationBenchmarks() {
  console.log('\n=== Navigation (applyTransition) ===\n');

  for (const loader of [loadTestWorld, loadDocWorld]) {
    const w = loader();
    const nodes = w.graph.getNodes();
    const nodeIds = nodes.map(n => n.id);

    const t = timeMs(() => {
      let focus = emptyFocus();
      for (let i = 0; i < Math.min(nodeIds.length, 20); i++) {
        const r = applyTransition(focus, { type: TransitionType.SELECT, nodeId: nodeIds[i % nodeIds.length] }, w.graph);
        if (r.ok) focus = r.focus;
        if (i > 0) {
          const dd = applyTransition(focus, { type: TransitionType.DRILL_DOWN, nodeId: nodeIds[(i + 1) % nodeIds.length] }, w.graph);
          if (dd.ok) focus = dd.focus;
          const du = applyTransition(focus, { type: TransitionType.DRILL_UP }, w.graph);
          if (du.ok) focus = du.focus;
        }
      }
      applyTransition(focus, { type: TransitionType.RESET }, w.graph);
    }, 100);
    record('navigation sequence (20 steps)', w.name, `${w.nodes}N/${w.edges}E`, t);
    console.log(`  ${w.name}: 20-step sequence avg=${fmt(t.avg)} [${t.iterations}x]`);
  }
}

function runTraceBenchmarks() {
  console.log('\n=== Trace ===\n');

  // Synthetic chains
  for (const n of [50, 200, 500, 1000]) {
    const graph = generateChain(n);
    const raw = toRawGraph(graph);
    const t = timeMs(() => trace(raw, 'n0', `n${n - 1}`), 50);
    record('trace (chain end-to-end)', `chain-${n}`, `${n}N/${n - 1}E`, t);
    console.log(`  chain-${n}: avg=${fmt(t.avg)} min=${fmt(t.min)} [${t.iterations}x]`);
  }

  // Grid (higher connectivity)
  for (const side of [10, 20, 50]) {
    const graph = generateGrid(side, side);
    const raw = toRawGraph(graph);
    const n = graph.getNodes().length;
    const e = graph.getEdges().length;
    const t = timeMs(() => trace(raw, 'g0_0', `g${side - 1}_${side - 1}`), 20);
    record('trace (grid corner-to-corner)', `grid-${side}x${side}`, `${n}N/${e}E`, t);
    console.log(`  grid-${side}x${side} (${n}N/${e}E): avg=${fmt(t.avg)} min=${fmt(t.min)} [${t.iterations}x]`);
  }

  // Reference worlds
  const docWorld = loadDocWorld();
  const docRaw = toRawGraph(docWorld.graph);
  const docNodes = docWorld.graph.getNodes();
  if (docNodes.length >= 2) {
    const fromId = docNodes[0].id;
    const toId = docNodes[docNodes.length - 1].id;
    const t = timeMs(() => trace(docRaw, fromId, toId), 50);
    record('trace (doc-world)', docWorld.name, `${docWorld.nodes}N/${docWorld.edges}E`, t, `${fromId} → ${toId}`);
    console.log(`  doc-world: avg=${fmt(t.avg)} min=${fmt(t.min)} [${t.iterations}x]`);
  }
}

function runCompareBenchmarks() {
  console.log('\n=== Compare (findRivalTraces) ===\n');

  // Small chain — no path explosion (only 1 shortest path)
  {
    const graph = generateChain(20);
    const raw = toRawGraph(graph);
    const t = timeMs(() => compare(raw, 'n0', 'n19'), 50);
    record('compare (chain, 1 path)', 'chain-20', '20N/19E', t);
    console.log(`  chain-20: avg=${fmt(t.avg)} [${t.iterations}x]`);
  }

  // Grids — path explosion zone (maxHops set to 2*(side-1) to reach corners)
  for (const side of [5, 7, 8]) {
    const graph = generateGrid(side, side);
    const raw = toRawGraph(graph);
    const n = graph.getNodes().length;
    const e = graph.getEdges().length;
    const hops = 2 * (side - 1);
    let pathCount = 0;
    const t = timeMs(() => {
      const result = compare(raw, 'g0_0', `g${side - 1}_${side - 1}`, { maxHops: hops });
      if (result.paths) pathCount = result.paths.length;
    }, 3);
    record('compare (grid)', `grid-${side}x${side}`, `${n}N/${e}E`, t, `${pathCount} paths (hops=${hops})`);
    console.log(`  grid-${side}x${side} (${n}N/${e}E): avg=${fmt(t.avg)} paths=${pathCount} [${t.iterations}x]`);
  }

  // Reference world
  const docWorld = loadDocWorld();
  const docRaw = toRawGraph(docWorld.graph);
  const specs = docWorld.graph.getNodes().filter(n => n.type === 'spec');
  const evidence = docWorld.graph.getNodes().filter(n => n.type === 'evidence');
  if (specs.length > 0 && evidence.length > 0) {
    let pathCount = 0;
    const t = timeMs(() => {
      const result = compare(docRaw, specs[0].id, evidence[0].id);
      if (result.paths) pathCount = result.paths.length;
    }, 20);
    record('compare (doc-world)', docWorld.name, `${docWorld.nodes}N/${docWorld.edges}E`, t, `${pathCount} paths, ${specs[0].id} → ${evidence[0].id}`);
    console.log(`  doc-world spec→evidence: avg=${fmt(t.avg)} paths=${pathCount} [${t.iterations}x]`);
  }
}

function runSupportsBenchmarks() {
  console.log('\n=== Supports ===\n');

  for (const loader of [loadTestWorld, loadDocWorld]) {
    const w = loader();
    const raw = toRawGraph(w.graph);
    const tInspect = timeMs(() => supportsInspect(raw), 200);
    record('supportsInspect', w.name, `${w.nodes}N/${w.edges}E`, tInspect);
    console.log(`  ${w.name} supportsInspect: avg=${fmt(tInspect.avg)} [${tInspect.iterations}x]`);

    const tTrace = timeMs(() => supportsTrace(raw), 200);
    record('supportsTrace', w.name, `${w.nodes}N/${w.edges}E`, tTrace);
    console.log(`  ${w.name} supportsTrace: avg=${fmt(tTrace.avg)} [${tTrace.iterations}x]`);
  }
}

function runGraphModelBenchmarks() {
  console.log('\n=== GraphModel construction ===\n');

  for (const n of [100, 500, 1000, 5000]) {
    const nodes = [];
    const edges = [];
    for (let i = 0; i < n; i++) {
      nodes.push({ id: `n${i}`, type: 'concept', label: `N${i}` });
      if (i > 0) edges.push({ id: `e${i}`, source: `n${i - 1}`, target: `n${i}`, type: 'relates' });
    }
    const t = timeMs(() => new GraphModel({ nodes, edges }), 20);
    record('GraphModel constructor', `chain-${n}`, `${n}N/${n - 1}E`, t);
    console.log(`  chain-${n} (${n}N/${n - 1}E): avg=${fmt(t.avg)} [${t.iterations}x]`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('Meaning Engine — Benchmark Harness');
console.log(`Date: ${new Date().toISOString()}`);
console.log(`Node: ${process.version}`);
console.log(`Platform: ${process.platform} ${process.arch}`);
console.log('NOTE: Numbers are indicative and environment-sensitive.\n');

runGraphModelBenchmarks();
runProjectionBenchmarks();
runNavigationBenchmarks();
runTraceBenchmarks();
runCompareBenchmarks();
runSupportsBenchmarks();

console.log('\n=== Summary Table ===\n');
console.log('| Operation | Graph | Size | Avg | Min | Max | Notes |');
console.log('|-----------|-------|------|-----|-----|-----|-------|');
for (const r of results) {
  console.log(`| ${r.operation} | ${r.graphDesc} | ${r.size} | ${fmt(r.avg)} | ${fmt(r.min)} | ${fmt(r.max)} | ${r.notes} |`);
}

console.log(`\nTotal benchmark cases: ${results.length}`);
console.log('Done.');
