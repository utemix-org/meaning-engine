/**
 * Merge extracted code artifacts into seed.
 *
 * Usage:
 *   node world/documentation-world/tools/mergeSeed.js
 *
 * Reads: seed.nodes.json, seed.edges.json, extracted.nodes.json, extracted.edges.json
 * Writes: seed.nodes.json, seed.edges.json (updated in-place)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const worldDir = resolve(__dir, '..');

const seedNodes = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
const seedEdges = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
const extNodes = JSON.parse(readFileSync(resolve(__dir, 'extracted.nodes.json'), 'utf-8'));
const extEdges = JSON.parse(readFileSync(resolve(__dir, 'extracted.edges.json'), 'utf-8'));

const existingIds = new Set(seedNodes.map((n) => n.id));

let addedNodes = 0;
for (const n of extNodes) {
  if (!existingIds.has(n.id)) {
    seedNodes.push(n);
    existingIds.add(n.id);
    addedNodes++;
  }
}

const existingEdgeKeys = new Set(seedEdges.map((e) => `${e.source}→${e.target}→${e.type}`));

let addedEdges = 0;
let skippedDangling = 0;
for (const e of extEdges) {
  const key = `${e.source}→${e.target}→${e.type}`;
  if (existingEdgeKeys.has(key)) continue;
  if (!existingIds.has(e.source) || !existingIds.has(e.target)) {
    skippedDangling++;
    continue;
  }
  seedEdges.push(e);
  existingEdgeKeys.add(key);
  addedEdges++;
}

writeFileSync(resolve(worldDir, 'seed.nodes.json'), JSON.stringify(seedNodes, null, 2), 'utf-8');
writeFileSync(resolve(worldDir, 'seed.edges.json'), JSON.stringify(seedEdges, null, 2), 'utf-8');

console.log(`Merge complete:`);
console.log(`  Nodes: ${seedNodes.length} total (+${addedNodes} new)`);
console.log(`  Edges: ${seedEdges.length} total (+${addedEdges} new, ${skippedDangling} skipped dangling)`);
