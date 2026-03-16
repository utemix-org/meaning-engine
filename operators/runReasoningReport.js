/**
 * CLI Reasoning Report Generator
 *
 * Prints a human-readable markdown report for reasoning scenarios
 * from the dual-world baseline.
 *
 * Usage:
 *   node operators/runReasoningReport.js
 *   node operators/runReasoningReport.js --world documentation-world
 *   node operators/runReasoningReport.js --world authored-mini-world --scenario rival_explanations
 *   node operators/runReasoningReport.js --format md
 *
 * Scenarios: path_exists, directed_boundary, rival_explanations, gap_and_bridge
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { runDualWorldSmoke, WORLD_SCENARIOS } from './runDualWorldSmokeWorkflow.js';
import { compare } from './compare.js';
import { rankBridgeCandidates } from './supports.js';
import { normalizeGraphByRedirects } from './normalizeGraphByRedirects.js';

const __dir = dirname(fileURLToPath(import.meta.url));

const SCENARIO_KEY_MAP = {
  path_exists: 'pathExists',
  directed_boundary: 'directedBoundary',
  rival_explanations: 'rivalExplanations',
  gap_and_bridge: 'gapBridge',
};

const STRENGTH_RUBRIC = {
  pathExists: {
    'documentation-world': {
      label: 'medium',
      reason: 'concept-mediated: single defines edge, direct conceptual definition',
    },
    'authored-mini-world': {
      label: 'strong',
      reason: 'full epistemic chain: spec→concept→invariant→evidence with 3 typed edges (defines→constrains→proved_by)',
    },
  },
  directedBoundary: {
    'documentation-world': {
      label: 'medium',
      reason: 'implements-edge: structural dependency, directionality expresses responsibility',
    },
    'authored-mini-world': {
      label: 'medium',
      reason: 'implements-edge: code knows about spec, but not the other way around',
    },
  },
  rivalExplanations: {
    'documentation-world': {
      label: 'mixed (strongest + medium + weaker)',
      reason: '1/13 invariant-passing (strongest), 2/13 concept-mediated (medium), 10/13 code-dependency (weaker)',
    },
    'authored-mini-world': {
      label: 'mixed (medium + weaker)',
      reason: '1/2 concept-mediated (medium), 1/2 code-dependency (weaker)',
    },
  },
  gapBridge: {
    'documentation-world': {
      label: 'weakest',
      reason: 'heuristic-only: candidate from type-pair mapping, no structural evidence in graph',
    },
    'authored-mini-world': {
      label: 'weakest',
      reason: 'heuristic-only: 3 candidates from type-pair mapping (spec→evidence), no path exists',
    },
  },
};

function loadWorldGraph(worldName) {
  const worldDir = resolve(__dir, '..', 'worlds', worldName);
  const rawN = JSON.parse(readFileSync(resolve(worldDir, 'seed.nodes.json'), 'utf-8'));
  const rawE = JSON.parse(readFileSync(resolve(worldDir, 'seed.edges.json'), 'utf-8'));
  if (worldName === 'documentation-world') {
    return normalizeGraphByRedirects({ nodes: rawN, edges: rawE });
  }
  return { nodes: rawN, edges: rawE };
}

function renderScenario(worldName, scenarioKey, scenarioData, graph) {
  const lines = [];
  const status = scenarioData.ok ? '✓' : '✗';
  const rubric = STRENGTH_RUBRIC[scenarioKey]?.[worldName];

  if (scenarioKey === 'pathExists') {
    lines.push(`### ${status} Path Exists`);
    lines.push('');
    lines.push(`- **Route:** ${scenarioData.label}`);
    lines.push(`- **From:** \`${scenarioData.fromId}\``);
    lines.push(`- **To:** \`${scenarioData.toId}\``);
    lines.push(`- **Result:** PATH (${scenarioData.hops} hop${scenarioData.hops !== 1 ? 's' : ''})`);
  } else if (scenarioKey === 'directedBoundary') {
    lines.push(`### ${status} Directed Boundary`);
    lines.push('');
    lines.push(`- **Route:** ${scenarioData.label}`);
    lines.push(`- **A:** \`${scenarioData.A}\``);
    lines.push(`- **B:** \`${scenarioData.B}\``);
    lines.push(`- **Trace(A→B):** ${scenarioData.traceAB}`);
    lines.push(`- **Trace(B→A):** ${scenarioData.traceBA} (${scenarioData.hopsBA} hop)`);
  } else if (scenarioKey === 'rivalExplanations') {
    lines.push(`### ${status} Rival Explanations`);
    lines.push('');
    lines.push(`- **Route:** ${scenarioData.label}`);
    lines.push(`- **From:** \`${scenarioData.fromId}\``);
    lines.push(`- **To:** \`${scenarioData.toId}\``);
    lines.push(`- **Rival count:** ${scenarioData.rivalCount}`);
    lines.push(`- **Clusters:** ${scenarioData.clusterCount}`);

    if (graph) {
      const scenarios = WORLD_SCENARIOS[worldName];
      const cmp = compare(graph, scenarios.rivalExplanations.fromId, scenarios.rivalExplanations.toId);
      if (cmp.paths) {
        const inv = cmp.paths.filter((p) => p.hasInvariant).length;
        const concept = cmp.paths.filter((p) => !p.hasInvariant && p.codeArtifactCount <= 1).length;
        const code = cmp.paths.filter((p) => p.codeArtifactCount >= 3).length;
        lines.push(`- **Strength distribution:** ${inv} invariant-passing, ${concept} concept-mediated, ${code} code-dependency`);
      }
    }
  } else if (scenarioKey === 'gapBridge') {
    lines.push(`### ${status} GAP + Bridge Candidates`);
    lines.push('');
    lines.push(`- **Route:** ${scenarioData.label}`);
    lines.push(`- **From:** \`${scenarioData.fromId}\``);
    lines.push(`- **To:** \`${scenarioData.toId}\``);
    lines.push(`- **Trace:** ${scenarioData.traceResult}`);
    lines.push(`- **Bridge supported:** ${scenarioData.supportsBridge}`);
    lines.push(`- **Candidate count:** ${scenarioData.candidateCount}`);

    if (graph) {
      const candidates = rankBridgeCandidates(
        { fromId: scenarioData.fromId, toId: scenarioData.toId },
        graph,
      );
      if (candidates.length > 0) {
        lines.push(`- **Candidates:** ${candidates.map((c) => '`' + c.candidateConceptId + '`').join(', ')}`);
      }
    }
  }

  if (rubric) {
    lines.push('');
    lines.push(`> **Strength:** ${rubric.label}`);
    lines.push(`> ${rubric.reason}`);
  }

  return lines.join('\n');
}

export function generateReport(options = {}) {
  const { world, scenario, fromBaseline } = options;

  let data;
  if (fromBaseline) {
    const baselinePath = resolve(__dir, 'dualWorldSmoke.baseline.json');
    data = JSON.parse(readFileSync(baselinePath, 'utf-8'));
  } else {
    data = runDualWorldSmoke();
  }

  const worlds = world ? data.filter((d) => d.world === world) : data;

  const lines = [];
  lines.push('# Meaning Engine — Reasoning Report');
  lines.push('');

  for (const worldResult of worlds) {
    const graph = loadWorldGraph(worldResult.world);
    const nodeCount = graph.nodes.length;
    const edgeCount = graph.edges.length;

    lines.push(`## ${worldResult.world}`);
    lines.push('');
    lines.push(`Graph: ${nodeCount} nodes, ${edgeCount} edges`);
    lines.push('');

    const scenarioKeys = scenario
      ? [SCENARIO_KEY_MAP[scenario] || scenario]
      : Object.keys(worldResult.scenarios);

    for (const key of scenarioKeys) {
      const s = worldResult.scenarios[key];
      if (!s) continue;
      lines.push(renderScenario(worldResult.world, key, s, graph));
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('*All results remain compute artifacts. No acceptance.*');
  lines.push('');

  return lines.join('\n');
}

// ── CLI entry point ─────────────────────────────────────────────────────
const isMain =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  (process.argv[1].endsWith('runReasoningReport.js') ||
    process.argv[1].includes('runReasoningReport'));

if (isMain) {
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const idx = args.indexOf(name);
    return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  const world = getArg('--world');
  const scenario = getArg('--scenario');
  const useBaseline = args.includes('--baseline');

  const report = generateReport({ world, scenario, fromBaseline: useBaseline });
  console.log(report);
}
