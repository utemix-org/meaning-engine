/**
 * Documentation World loader.
 *
 * Reads seed.nodes.json + seed.edges.json and assembles a
 * GraphModel-compatible data object for the engine.
 *
 * Usage (in tests or scripts):
 *   import { loadDocumentationWorld } from '../../world/documentation-world/loader.js';
 *   const { graph, meta } = loadDocumentationWorld();
 *   // graph is a GraphModel instance
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GraphModel } from '../../src/core/index.js';

const __dirname_resolved =
  typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url));

export function loadDocumentationWorld() {
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

  const links = edgesRaw.map((e, i) => ({
    id: e.id ?? `docworld-edge-${i}`,
    source: e.source,
    target: e.target,
    type: e.type,
    layer: e.layer,
    note: e.note,
  }));

  const graph = new GraphModel({ nodes, links });

  const nodeTypes = [...new Set(nodes.map((n) => n.type))];
  const edgeTypes = [...new Set(links.map((e) => e.type))];

  return {
    graph,
    meta: {
      nodeCount: nodes.length,
      edgeCount: links.length,
      nodeTypes,
      edgeTypes,
    },
  };
}
