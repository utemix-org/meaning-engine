/**
 * Authored Mini-World loader.
 *
 * Reads seed.nodes.json + seed.edges.json and assembles a
 * GraphModel-compatible data object.
 *
 * Usage:
 *   import { loadAuthoredMiniWorld } from './loader.js';
 *   const { graph, meta } = loadAuthoredMiniWorld();
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GraphModel } from '../../src/core/index.js';

const __dirname_resolved =
  typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url));

export function loadAuthoredMiniWorld() {
  const nodesRaw = JSON.parse(
    readFileSync(resolve(__dirname_resolved, 'seed.nodes.json'), 'utf-8'),
  );
  const edgesRaw = JSON.parse(
    readFileSync(resolve(__dirname_resolved, 'seed.edges.json'), 'utf-8'),
  );

  const nodes = nodesRaw.map((n) => ({
    id: n.id,
    type: n.type,
    label: n.title,
    ...n,
  }));

  const edges = edgesRaw.map((e, i) => ({
    id: e.id ?? `authored-edge-${i}`,
    source: e.source,
    target: e.target,
    type: e.type,
    layer: e.layer,
  }));

  const graph = new GraphModel({ nodes, edges });

  const nodeTypes = [...new Set(nodes.map((n) => n.type))];
  const edgeTypes = [...new Set(edges.map((e) => e.type))];

  return {
    graph,
    meta: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodeTypes,
      edgeTypes,
    },
  };
}
