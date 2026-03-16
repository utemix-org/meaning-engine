/**
 * Custom World Smoke Workflow Runner
 *
 * Usage:
 *   node operators/runWorldSmokeWorkflow.js ./path/to/world [--from <id>] [--to <id>]
 *
 * Loads a world directory (seed.nodes.json + seed.edges.json) and runs
 * Inspect, Trace, Compare, and BridgeCandidates operators on it.
 *
 * If --from / --to are not given, picks the first and last node by array order.
 *
 * Exit code 0 = all operators ran (even if some are unsupported).
 * Exit code 1 = load failure or unexpected error.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { trace } from './trace.js';
import { compare } from './compare.js';
import {
  supportsInspect,
  supportsTrace,
  supportsCompare,
  supportsBridgeCandidates,
  rankBridgeCandidates,
} from './supports.js';

function loadWorld(worldPath) {
  const absPath = resolve(worldPath);
  const nodesRaw = readFileSync(resolve(absPath, 'seed.nodes.json'), 'utf-8');
  const edgesRaw = readFileSync(resolve(absPath, 'seed.edges.json'), 'utf-8');
  const nodes = JSON.parse(nodesRaw);
  const edges = JSON.parse(edgesRaw);

  if (!Array.isArray(nodes)) throw new Error('seed.nodes.json must be a JSON array');
  if (!Array.isArray(edges)) throw new Error('seed.edges.json must be a JSON array');
  if (nodes.length === 0) throw new Error('seed.nodes.json is empty');

  for (const n of nodes) {
    if (!n.id || !n.type || !n.title) {
      throw new Error(`Invalid node (missing id/type/title): ${JSON.stringify(n)}`);
    }
  }
  for (const e of edges) {
    if (!e.source || !e.target || !e.type) {
      throw new Error(`Invalid edge (missing source/target/type): ${JSON.stringify(e)}`);
    }
  }

  const nodeIds = new Set(nodes.map((n) => n.id));
  for (const e of edges) {
    if (!nodeIds.has(e.source))
      throw new Error(`Edge references unknown source: ${e.source}`);
    if (!nodeIds.has(e.target))
      throw new Error(`Edge references unknown target: ${e.target}`);
  }

  return { nodes, edges };
}

function section(title) {
  return `\n## ${title}\n`;
}

export function runWorldSmoke(worldPath, options = {}) {
  const graph = loadWorld(worldPath);
  const fromId = options.from || graph.nodes[0].id;
  const toId = options.to || graph.nodes[graph.nodes.length - 1].id;
  const lines = [];

  lines.push(`# Smoke Workflow: ${worldPath}`);
  lines.push('');
  lines.push(`Graph: ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
  lines.push(`Pair: \`${fromId}\` → \`${toId}\``);

  // --- Inspect ---
  lines.push(section('Inspect'));
  const inspect = supportsInspect(graph);
  if (inspect.ok) {
    lines.push('- supportsInspect: **ok**');
  } else {
    lines.push(`- supportsInspect: **not supported** — missing: ${inspect.missing.join(', ')}`);
  }

  // --- Trace ---
  lines.push(section('Trace'));
  const traceSupp = supportsTrace(graph);
  lines.push(`- supportsTrace: ${traceSupp.ok ? '**ok**' : `**limited** (missing: ${traceSupp.missing.join(', ')})`}`);

  const t = trace(graph, fromId, toId);
  if (t.ok) {
    const titles = t.path.map((p) => p.title || p.nodeId).join(' → ');
    lines.push(`- Trace result: **PATH** (${t.hops} hops)`);
    lines.push(`- Route: ${titles}`);
  } else if (t.reason === 'unknown_node') {
    lines.push(`- Trace result: **error** — ${t.detail}`);
  } else {
    lines.push(`- Trace result: **${t.reason}**`);
    if (t.gap?.candidates?.length) {
      lines.push(`- Bridge candidates: ${t.gap.candidates.map((c) => c.candidateConceptId).join(', ')}`);
    }
  }

  // --- Compare ---
  lines.push(section('Compare'));
  const compSupp = supportsCompare(graph, fromId, toId);
  if (!compSupp.ok) {
    const reasons = compSupp.missing?.join(', ') || 'ambiguity_not_detected';
    lines.push(`- supportsCompare: **not supported** — ${reasons}`);
  } else {
    lines.push('- supportsCompare: **ok**');
    const c = compare(graph, fromId, toId);
    lines.push(`- Rival paths: **${c.pathCount}**`);
    lines.push(`- Clusters: **${c.clusterCount}**`);
  }

  // --- BridgeCandidates ---
  lines.push(section('Bridge Candidates'));
  const bridgeSupp = supportsBridgeCandidates(graph, fromId, toId);
  if (!bridgeSupp.ok) {
    const reasons = bridgeSupp.missing?.join(', ') || 'not applicable';
    lines.push(`- supportsBridgeCandidates: **not supported** — ${reasons}`);
  } else {
    lines.push('- supportsBridgeCandidates: **ok**');
    const candidates = rankBridgeCandidates({ fromId, toId }, graph);
    lines.push(`- Candidates: **${candidates.length}**`);
    for (const c of candidates) {
      lines.push(`  - \`${c.candidateConceptId}\` (score=${c.score})`);
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('*All results remain compute artifacts. No acceptance.*');
  lines.push('');

  return { report: lines.join('\n'), graph, fromId, toId };
}

// ── CLI entry point ─────────────────────────────────────────────────────
const isMain =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  (process.argv[1].endsWith('runWorldSmokeWorkflow.js') ||
    process.argv[1].includes('runWorldSmokeWorkflow'));

if (isMain) {
  const args = process.argv.slice(2);

  const worldPath = args.find((a) => !a.startsWith('--'));
  if (!worldPath) {
    console.error('Usage: node operators/runWorldSmokeWorkflow.js ./path/to/world [--from <id>] [--to <id>]');
    process.exit(1);
  }

  const getArg = (name) => {
    const idx = args.indexOf(name);
    return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  try {
    const { report } = runWorldSmoke(worldPath, {
      from: getArg('--from'),
      to: getArg('--to'),
    });
    console.log(report);
    process.exit(0);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}
