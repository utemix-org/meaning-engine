/**
 * Operator Support Checks & Rival Detection
 *
 * Pure, deterministic functions:
 *   - supportsInspect(graph, context?) — can Inspect operate on this graph?
 *   - supportsTrace(graph, context?)   — can Trace operate on this graph?
 *   - findRivalTraces(graph, fromId, toId, options?) — all shortest paths
 *   - rankBridgeCandidates(gap, graph) — ranked candidate bridges for a gap
 *
 * No engine changes. No UI. No side effects.
 */

const INSPECT_REQUIRED_NODE_TYPES = [];
const INSPECT_MIN_NODES = 2;
const INSPECT_MIN_EDGES = 1;

const TRACE_REQUIRED_NODE_CATEGORIES = [
  { category: 'epistemic-source', types: ['spec', 'claim', 'invariant'] },
  { category: 'evidence', types: ['evidence'] },
  { category: 'artifact', types: ['artifact', 'code_artifact'] },
];
const TRACE_REQUIRED_EDGE_TYPES = ['proved_by', 'implements', 'constrains', 'depends_on'];

/**
 * Check if Inspect can operate on a given graph.
 * Inspect needs: at least some nodes, at least some edges, and adjacency.
 */
export function supportsInspect(graph, context = {}) {
  const missing = [];

  if (!graph.nodes || graph.nodes.length < INSPECT_MIN_NODES) {
    missing.push(`nodes: need >= ${INSPECT_MIN_NODES}, got ${graph.nodes?.length ?? 0}`);
  }
  if (!graph.edges || graph.edges.length < INSPECT_MIN_EDGES) {
    missing.push(`edges: need >= ${INSPECT_MIN_EDGES}, got ${graph.edges?.length ?? 0}`);
  }

  if (missing.length > 0) return { ok: false, missing };
  return { ok: true };
}

/**
 * Check if Trace can operate meaningfully on a given graph.
 * Trace needs epistemic structure: spec/claim/invariant + evidence + artifact nodes,
 * and at least one epistemic edge type.
 */
export function supportsTrace(graph, context = {}) {
  const missing = [];
  const nodeTypes = new Set(graph.nodes.map((n) => n.type));
  const edgeTypes = new Set(graph.edges.map((e) => e.type));

  for (const cat of TRACE_REQUIRED_NODE_CATEGORIES) {
    const found = cat.types.some((t) => nodeTypes.has(t));
    if (!found) {
      missing.push(`nodeCategory '${cat.category}': need one of [${cat.types.join(', ')}], found none`);
    }
  }

  const hasEpistemicEdge = TRACE_REQUIRED_EDGE_TYPES.some((t) => edgeTypes.has(t));
  if (!hasEpistemicEdge) {
    missing.push(`edgeTypes: need at least one of [${TRACE_REQUIRED_EDGE_TYPES.join(', ')}], found [${[...edgeTypes].join(', ')}]`);
  }

  if (missing.length > 0) return { ok: false, missing };
  return { ok: true };
}

/**
 * Find all shortest paths between fromId and toId (undirected BFS).
 * Returns multiple paths if they exist at the same shortest distance.
 */
export function findRivalTraces(graph, fromId, toId, options = {}) {
  const { maxHops = 6, directed = false } = options;

  const nodeSet = new Set(graph.nodes.map((n) => n.id));
  if (!nodeSet.has(fromId)) return { paths: [], reason: `unknown_node: ${fromId}` };
  if (!nodeSet.has(toId)) return { paths: [], reason: `unknown_node: ${toId}` };
  if (fromId === toId) return { paths: [[fromId]], reason: 'same_node' };

  const adj = new Map();
  for (const n of graph.nodes) adj.set(n.id, []);
  for (const e of graph.edges) {
    adj.get(e.source)?.push({ target: e.target, type: e.type });
    if (!directed) {
      adj.get(e.target)?.push({ target: e.source, type: e.type });
    }
  }

  const dist = new Map();
  const allPreds = new Map();
  dist.set(fromId, 0);
  allPreds.set(fromId, []);
  const queue = [fromId];

  while (queue.length > 0) {
    const u = queue.shift();
    const d = dist.get(u);
    if (d >= maxHops) continue;
    for (const { target: v, type } of adj.get(u) || []) {
      if (!dist.has(v)) {
        dist.set(v, d + 1);
        allPreds.set(v, [{ from: u, edgeType: type }]);
        queue.push(v);
      } else if (dist.get(v) === d + 1) {
        allPreds.get(v).push({ from: u, edgeType: type });
      }
    }
  }

  if (!dist.has(toId)) {
    return { paths: [], reason: 'no_path' };
  }

  const paths = [];
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

  function backtrack(nodeId, currentPath) {
    if (nodeId === fromId) {
      paths.push([...currentPath].reverse());
      return;
    }
    for (const pred of allPreds.get(nodeId) || []) {
      currentPath.push({
        nodeId,
        nodeType: nodeMap.get(nodeId)?.type,
        nodeTitle: nodeMap.get(nodeId)?.title,
        viaEdgeType: pred.edgeType,
      });
      backtrack(pred.from, currentPath);
      currentPath.pop();
    }
  }

  backtrack(toId, []);

  for (const path of paths) {
    path.unshift({
      nodeId: fromId,
      nodeType: nodeMap.get(fromId)?.type,
      nodeTitle: nodeMap.get(fromId)?.title,
      viaEdgeType: null,
    });
  }

  return {
    paths,
    hops: dist.get(toId),
    isRival: paths.length > 1,
    reason: paths.length > 1 ? 'multiple_shortest_paths' : 'unique_path',
  };
}

const CANDIDATE_BRIDGE_MAP = [
  {
    gapPattern: { fromType: 'spec', toType: 'evidence' },
    candidateConceptId: 'concept:test-coverage',
    candidateEdges: [
      { source: '{from}', target: 'concept:test-coverage', type: 'constrains' },
      { source: 'concept:test-coverage', target: '{to}', type: 'applies_to' },
    ],
    note: 'spec↔evidence gap: specs should constrain test-coverage, which applies_to evidence',
    heuristic: 'type-pair-mapping',
  },
  {
    gapPattern: { fromType: 'spec', toType: 'evidence' },
    candidateConceptId: 'concept:acceptance-criteria',
    candidateEdges: [
      { source: '{from}', target: 'concept:acceptance-criteria', type: 'defines' },
      { source: 'concept:acceptance-criteria', target: '{to}', type: 'applies_to' },
    ],
    note: 'spec↔evidence gap: spec defines acceptance-criteria, which apply_to evidence',
    heuristic: 'type-pair-mapping',
  },
  {
    gapPattern: { fromType: 'spec', toType: 'evidence' },
    candidateConceptId: 'concept:verification-method',
    candidateEdges: [
      { source: '{from}', target: 'concept:verification-method', type: 'defines' },
      { source: 'concept:verification-method', target: '{to}', type: 'applies_to' },
    ],
    note: 'spec↔evidence gap: spec defines verification-method, which applies_to evidence',
    heuristic: 'type-pair-mapping',
  },
  {
    gapPattern: { fromType: 'evidence', toType: 'code_artifact' },
    candidateConceptId: 'concept:code-spec-alignment',
    candidateEdges: [
      { source: '{from}', target: 'concept:code-spec-alignment', type: 'proved_by' },
      { source: 'concept:code-spec-alignment', target: '{to}', type: 'applies_to' },
    ],
    note: 'evidence↔code_artifact gap: evidence proves alignment, which applies_to artifact',
    heuristic: 'type-pair-mapping',
  },
  {
    gapPattern: { fromType: 'concept', toType: 'page' },
    candidateConceptId: 'concept:context-anchor',
    candidateEdges: [
      { source: '{from}', target: 'concept:context-anchor', type: 'refines' },
      { source: 'concept:context-anchor', target: '{to}', type: 'applies_to' },
    ],
    note: 'concept↔page gap: add context-anchor as bridge',
    heuristic: 'type-pair-mapping',
  },
];

/**
 * Rank candidate bridges for a gap between two nodes.
 * Uses type-pair mapping heuristics + neighbor proximity analysis.
 */
export function rankBridgeCandidates(gap, graph) {
  const { fromId, toId } = gap;
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const fromType = nodeMap.get(fromId)?.type;
  const toType = nodeMap.get(toId)?.type;

  if (!fromType || !toType) return [];

  const candidates = [];

  for (const entry of CANDIDATE_BRIDGE_MAP) {
    const p = entry.gapPattern;
    if (p.fromType === fromType && p.toType === toType) {
      candidates.push({
        candidateConceptId: entry.candidateConceptId,
        candidateEdges: entry.candidateEdges.map((e) => ({
          source: e.source.replace('{from}', fromId).replace('{to}', toId),
          target: e.target.replace('{from}', fromId).replace('{to}', toId),
          type: e.type,
        })),
        note: entry.note,
        heuristic: entry.heuristic,
        score: 1.0,
      });
    }
    if (p.fromType === toType && p.toType === fromType) {
      candidates.push({
        candidateConceptId: entry.candidateConceptId,
        candidateEdges: entry.candidateEdges.map((e) => ({
          source: e.source.replace('{from}', toId).replace('{to}', fromId),
          target: e.target.replace('{from}', toId).replace('{to}', fromId),
          type: e.type,
        })),
        note: `(reverse) ${entry.note}`,
        heuristic: 'type-pair-mapping-reverse',
        score: 0.8,
      });
    }
  }

  const undirAdj = new Map();
  for (const n of graph.nodes) undirAdj.set(n.id, new Set());
  for (const e of graph.edges) {
    undirAdj.get(e.source)?.add(e.target);
    undirAdj.get(e.target)?.add(e.source);
  }

  const fromNeighbors = undirAdj.get(fromId) || new Set();
  const toNeighbors = undirAdj.get(toId) || new Set();
  const sharedNeighbors = [...fromNeighbors].filter((n) => toNeighbors.has(n));

  for (const shared of sharedNeighbors) {
    const alreadyListed = candidates.some((c) => c.candidateConceptId === shared);
    if (!alreadyListed) {
      candidates.push({
        candidateConceptId: shared,
        candidateEdges: [],
        note: `shared neighbor of both ${fromId} and ${toId}`,
        heuristic: 'shared-neighbor',
        score: 0.5,
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}
