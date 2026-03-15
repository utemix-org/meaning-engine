/**
 * Documentation World — Analysis Operators
 *
 * Computes structural metrics over the documentation-world seed graph:
 *   D1. Centrality (degree + betweenness)
 *   D2. Weak bridges
 *   D3. Cycles (length 3–6)
 *   D4. Distance anomalies & missing concept candidates
 *
 * Usage:
 *   node world/documentation-world/analysis/runAnalysis.js
 *
 * Outputs:
 *   world/documentation-world/analysis/analysis.json
 *   world/documentation-world/analysis/analysis.md
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..');

const nodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
const edges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));

const nodeMap = new Map(nodes.map((n) => [n.id, n]));
const nodeIds = [...nodeMap.keys()];

// ── adjacency (directed + undirected views) ──

const outAdj = new Map();
const inAdj = new Map();
const undirAdj = new Map();

for (const id of nodeIds) {
  outAdj.set(id, []);
  inAdj.set(id, []);
  undirAdj.set(id, new Set());
}

for (const e of edges) {
  outAdj.get(e.source)?.push(e);
  inAdj.get(e.target)?.push(e);
  undirAdj.get(e.source)?.add(e.target);
  undirAdj.get(e.target)?.add(e.source);
}

// ═══════════════════════════════════════════════
// D1 — Centrality
// ═══════════════════════════════════════════════

function degreeCentrality() {
  return nodeIds.map((id) => ({
    id,
    type: nodeMap.get(id).type,
    title: nodeMap.get(id).title,
    inDeg: inAdj.get(id).length,
    outDeg: outAdj.get(id).length,
    degree: inAdj.get(id).length + outAdj.get(id).length,
  }));
}

function bfs(startId) {
  const dist = new Map();
  const pred = new Map();
  dist.set(startId, 0);
  pred.set(startId, []);
  const queue = [startId];

  while (queue.length > 0) {
    const u = queue.shift();
    const d = dist.get(u);
    for (const v of undirAdj.get(u)) {
      if (!dist.has(v)) {
        dist.set(v, d + 1);
        pred.set(v, [u]);
        queue.push(v);
      } else if (dist.get(v) === d + 1) {
        pred.get(v).push(u);
      }
    }
  }
  return { dist, pred };
}

function betweennessCentrality() {
  const bc = new Map();
  for (const id of nodeIds) bc.set(id, 0);

  for (const s of nodeIds) {
    const { dist, pred } = bfs(s);

    const sigma = new Map();
    for (const id of nodeIds) sigma.set(id, 0);
    sigma.set(s, 1);

    const sorted = [...dist.entries()]
      .sort((a, b) => a[1] - b[1])
      .map(([id]) => id);

    for (const v of sorted) {
      for (const p of pred.get(v) || []) {
        sigma.set(v, sigma.get(v) + sigma.get(p));
      }
    }

    const delta = new Map();
    for (const id of nodeIds) delta.set(id, 0);

    for (const v of sorted.reverse()) {
      if (v === s) continue;
      for (const p of pred.get(v) || []) {
        const portion = (sigma.get(p) / sigma.get(v)) * (1 + delta.get(v));
        delta.set(p, delta.get(p) + portion);
      }
      bc.set(v, bc.get(v) + delta.get(v));
    }
  }

  for (const [id, val] of bc) {
    bc.set(id, val / 2);
  }

  return bc;
}

function computeCentrality() {
  const deg = degreeCentrality();
  const bc = betweennessCentrality();

  return deg
    .map((d) => ({
      ...d,
      betweenness: Math.round(bc.get(d.id) * 100) / 100,
      score: d.degree + Math.round(bc.get(d.id) * 10) / 10,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((d) => ({
      id: d.id,
      type: d.type,
      title: d.title,
      degree: d.degree,
      inDeg: d.inDeg,
      outDeg: d.outDeg,
      betweenness: d.betweenness,
      score: d.score,
      topEdges: [
        ...outAdj.get(d.id).map((e) => `→${nodeMap.get(e.target)?.title ?? e.target} [${e.type}]`),
        ...inAdj.get(d.id).map((e) => `←${nodeMap.get(e.source)?.title ?? e.source} [${e.type}]`),
      ].slice(0, 5),
    }));
}

// ═══════════════════════════════════════════════
// D2 — Weak Bridges
// ═══════════════════════════════════════════════

function edgeBetweenness() {
  const eb = new Map();

  for (const s of nodeIds) {
    const { dist, pred } = bfs(s);

    const sigma = new Map();
    for (const id of nodeIds) sigma.set(id, 0);
    sigma.set(s, 1);

    const sorted = [...dist.entries()]
      .sort((a, b) => a[1] - b[1])
      .map(([id]) => id);

    for (const v of sorted) {
      for (const p of pred.get(v) || []) {
        sigma.set(v, sigma.get(v) + sigma.get(p));
      }
    }

    const delta = new Map();
    for (const id of nodeIds) delta.set(id, 0);

    for (const v of [...sorted].reverse()) {
      if (v === s) continue;
      for (const p of pred.get(v) || []) {
        const portion = (sigma.get(p) / sigma.get(v)) * (1 + delta.get(v));
        delta.set(p, delta.get(p) + portion);
        const eKey = [p, v].sort().join('↔');
        eb.set(eKey, (eb.get(eKey) || 0) + portion / 2);
      }
    }
  }

  return [...eb.entries()]
    .map(([key, val]) => {
      const [a, b] = key.split('↔');
      return {
        nodeA: { id: a, type: nodeMap.get(a)?.type, title: nodeMap.get(a)?.title },
        nodeB: { id: b, type: nodeMap.get(b)?.type, title: nodeMap.get(b)?.title },
        betweenness: Math.round(val * 100) / 100,
        crossType: nodeMap.get(a)?.type !== nodeMap.get(b)?.type,
      };
    })
    .sort((a, b) => b.betweenness - a.betweenness)
    .slice(0, 10);
}

// ═══════════════════════════════════════════════
// D3 — Cycles (length 3–6)
// ═══════════════════════════════════════════════

function findCycles(maxLen = 6) {
  const cycles = [];
  const idxOf = new Map(nodeIds.map((id, i) => [id, i]));

  function dfs(start, current, path, visited) {
    if (path.length > maxLen) return;
    for (const e of outAdj.get(current)) {
      const next = e.target;
      if (next === start && path.length >= 3) {
        cycles.push({
          length: path.length,
          nodes: path.map((p) => ({
            id: p.nodeId,
            type: nodeMap.get(p.nodeId)?.type,
            title: nodeMap.get(p.nodeId)?.title,
          })),
          edgeTypes: path.map((p) => p.edgeType),
        });
        continue;
      }
      if (visited.has(next)) continue;
      if (idxOf.get(next) < idxOf.get(start)) continue;
      visited.add(next);
      path.push({ nodeId: next, edgeType: e.type });
      dfs(start, next, path, visited);
      path.pop();
      visited.delete(next);
    }
  }

  for (const start of nodeIds) {
    const visited = new Set([start]);
    dfs(start, start, [{ nodeId: start, edgeType: null }], visited);
  }

  cycles.sort((a, b) => a.length - b.length);
  return cycles;
}

// ═══════════════════════════════════════════════
// D4 — Distance anomalies & missing concept candidates
// ═══════════════════════════════════════════════

function computeDistanceAnomalies() {
  const THRESHOLD = 4;
  const pairs = [
    { fromType: 'spec', toType: 'code_artifact', label: 'spec↔code_artifact' },
    { fromType: 'invariant', toType: 'evidence', label: 'invariant↔evidence' },
  ];

  const distCache = new Map();
  function getDistMap(id) {
    if (!distCache.has(id)) {
      distCache.set(id, bfs(id).dist);
    }
    return distCache.get(id);
  }

  const anomalies = [];

  for (const { fromType, toType, label } of pairs) {
    const fromNodes = nodes.filter((n) => n.type === fromType);
    const toNodes = nodes.filter((n) => n.type === toType);

    for (const fn of fromNodes) {
      const dists = getDistMap(fn.id);
      for (const tn of toNodes) {
        const d = dists.get(tn.id);
        if (d === undefined || d > THRESHOLD) {
          anomalies.push({
            from: { id: fn.id, type: fn.type, title: fn.title },
            to: { id: tn.id, type: tn.type, title: tn.title },
            distance: d ?? Infinity,
            pair: label,
          });
        }
      }
    }
  }

  anomalies.sort((a, b) => b.distance - a.distance);
  return anomalies.slice(0, 10);
}

function findMissingConceptCandidates() {
  const typeClusters = new Map();
  for (const n of nodes) {
    if (!typeClusters.has(n.type)) typeClusters.set(n.type, []);
    typeClusters.get(n.type).push(n.id);
  }

  const candidates = [];
  const conceptIds = typeClusters.get('concept') || [];

  const typeArr = [...typeClusters.keys()].filter((t) => t !== 'concept');
  for (let i = 0; i < typeArr.length; i++) {
    for (let j = i + 1; j < typeArr.length; j++) {
      const tA = typeArr[i];
      const tB = typeArr[j];
      const idsA = typeClusters.get(tA);
      const idsB = typeClusters.get(tB);

      let directEdges = 0;
      for (const e of edges) {
        const sType = nodeMap.get(e.source)?.type;
        const tType = nodeMap.get(e.target)?.type;
        if ((sType === tA && tType === tB) || (sType === tB && tType === tA)) {
          directEdges++;
        }
      }

      if (directEdges > 0) continue;

      const bridgeConcepts = new Map();
      for (const cId of conceptIds) {
        const cNeighbors = undirAdj.get(cId);
        const touchesA = idsA.some((a) => cNeighbors?.has(a));
        const touchesB = idsB.some((b) => cNeighbors?.has(b));
        if (touchesA && touchesB) {
          bridgeConcepts.set(cId, (bridgeConcepts.get(cId) || 0) + 1);
        }
      }

      if (bridgeConcepts.size === 0) {
        candidates.push({
          clusterA: tA,
          clusterB: tB,
          directEdges: 0,
          bridgeConcepts: 0,
          suggestion: `No direct or concept-bridged path between ${tA} and ${tB}. Consider adding a bridging concept.`,
        });
      }
    }
  }

  return candidates.slice(0, 5);
}

// ═══════════════════════════════════════════════
// Run all & write output
// ═══════════════════════════════════════════════

export function runAnalysis() {
  const centrality = computeCentrality();
  const bridges = edgeBetweenness();
  const cycles = findCycles(6);
  const anomalies = computeDistanceAnomalies();
  const missingConcepts = findMissingConceptCandidates();

  return {
    meta: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodeTypes: [...new Set(nodes.map((n) => n.type))],
      edgeTypes: [...new Set(edges.map((e) => e.type))],
      generatedAt: new Date().toISOString(),
    },
    centrality,
    bridges,
    cycles,
    anomalies,
    missingConcepts,
  };
}

function formatMarkdown(result) {
  const lines = [];
  lines.push('# Documentation World — Analysis Report');
  lines.push('');
  lines.push(`Generated: ${result.meta.generatedAt}`);
  lines.push(`Graph: ${result.meta.nodeCount} nodes, ${result.meta.edgeCount} edges`);
  lines.push('');

  lines.push('## D1. Centrality (Top-10)');
  lines.push('');
  lines.push('| # | Title | Type | Degree | Betweenness | Score |');
  lines.push('|---|-------|------|--------|-------------|-------|');
  result.centrality.forEach((c, i) => {
    lines.push(`| ${i + 1} | ${c.title} | ${c.type} | ${c.degree} | ${c.betweenness} | ${c.score} |`);
  });
  lines.push('');

  lines.push('## D2. Weak Bridges (Top-10 by edge betweenness)');
  lines.push('');
  lines.push('| # | Node A | Node B | Betweenness | Cross-type |');
  lines.push('|---|--------|--------|-------------|------------|');
  result.bridges.forEach((b, i) => {
    lines.push(`| ${i + 1} | ${b.nodeA.title} (${b.nodeA.type}) | ${b.nodeB.title} (${b.nodeB.type}) | ${b.betweenness} | ${b.crossType ? 'yes' : 'no'} |`);
  });
  lines.push('');

  lines.push(`## D3. Cycles (found: ${result.cycles.length})`);
  lines.push('');
  if (result.cycles.length === 0) {
    lines.push('No cycles of length 3–6 detected in the directed graph.');
  } else {
    result.cycles.slice(0, 10).forEach((c, i) => {
      const path = c.nodes.map((n) => `${n.title}(${n.type})`).join(' → ');
      lines.push(`${i + 1}. **Length ${c.length}:** ${path}`);
      lines.push(`   Edge types: ${c.edgeTypes.filter(Boolean).join(', ')}`);
    });
  }
  lines.push('');

  lines.push(`## D4. Distance Anomalies (${result.anomalies.length} found)`);
  lines.push('');
  if (result.anomalies.length === 0) {
    lines.push('No distance anomalies detected (all spec↔code_artifact, invariant↔evidence pairs within threshold 4).');
  } else {
    result.anomalies.forEach((a, i) => {
      lines.push(`${i + 1}. **${a.from.title}** (${a.from.type}) ↔ **${a.to.title}** (${a.to.type}) — distance: ${a.distance === Infinity ? '∞ (unreachable)' : a.distance}`);
    });
  }
  lines.push('');

  lines.push(`## Missing Concept Candidates (${result.missingConcepts.length})`);
  lines.push('');
  if (result.missingConcepts.length === 0) {
    lines.push('All type clusters are connected directly or through concept nodes.');
  } else {
    result.missingConcepts.forEach((c, i) => {
      lines.push(`${i + 1}. **${c.clusterA} ↔ ${c.clusterB}** — ${c.suggestion}`);
    });
  }
  lines.push('');

  return lines.join('\n');
}

// CLI entry point
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(__dir, 'runAnalysis.js');
if (isMain) {
  const result = runAnalysis();
  const outDir = __dir;

  writeFileSync(resolve(outDir, 'analysis.json'), JSON.stringify(result, null, 2), 'utf-8');
  console.log(`✓ analysis.json written (${JSON.stringify(result, null, 2).length} bytes)`);

  const md = formatMarkdown(result);
  writeFileSync(resolve(outDir, 'analysis.md'), md, 'utf-8');
  console.log(`✓ analysis.md written (${md.length} bytes)`);

  console.log(`\nTop-3 central nodes:`);
  result.centrality.slice(0, 3).forEach((c) => {
    console.log(`  ${c.title} (${c.type}) — degree: ${c.degree}, betweenness: ${c.betweenness}`);
  });
  console.log(`Cycles found: ${result.cycles.length}`);
  console.log(`Distance anomalies: ${result.anomalies.length}`);
  console.log(`Missing concept candidates: ${result.missingConcepts.length}`);
}
