/**
 * Compare Operator — Documentation World
 *
 * Compares rival explanatory chains (traces) between two nodes.
 * Returns a diff/contrast (compute) without canonization.
 *
 * Pure, deterministic function — no side effects, no engine changes.
 */

import { findRivalTraces } from './supports.js';

/**
 * Build a PathSummary from a path returned by findRivalTraces.
 * Each path element: { nodeId, nodeType, nodeTitle, viaEdgeType }
 */
function summarizePath(path, graph) {
  const nodeTypeHist = {};
  const edgeTypeHist = {};
  let conceptEdges = 0;
  let provenanceEdges = 0;
  let hasInvariant = false;
  let codeArtifactCount = 0;
  let evidenceCount = 0;
  let implementsCount = 0;

  const edgeMap = new Map();
  for (const e of graph.edges) {
    const key = `${e.source}→${e.target}`;
    edgeMap.set(key, e);
    const rKey = `${e.target}→${e.source}`;
    if (!edgeMap.has(rKey)) edgeMap.set(rKey, e);
  }

  for (const step of path) {
    const nt = step.nodeType || 'unknown';
    nodeTypeHist[nt] = (nodeTypeHist[nt] || 0) + 1;

    if (nt === 'invariant') hasInvariant = true;
    if (nt === 'code_artifact') codeArtifactCount++;
    if (nt === 'evidence') evidenceCount++;

    if (step.viaEdgeType) {
      const et = step.viaEdgeType;
      edgeTypeHist[et] = (edgeTypeHist[et] || 0) + 1;
      if (et === 'implements') implementsCount++;
    }
  }

  for (let i = 0; i < path.length - 1; i++) {
    const fwd = `${path[i].nodeId}→${path[i + 1].nodeId}`;
    const rev = `${path[i + 1].nodeId}→${path[i].nodeId}`;
    const edge = edgeMap.get(fwd) || edgeMap.get(rev);
    if (edge) {
      const layer = edge.layer || 'unknown';
      if (layer === 'concept') conceptEdges++;
      if (layer === 'provenance') provenanceEdges++;
    }
  }

  return {
    hops: path.length - 1,
    nodeIds: path.map((s) => s.nodeId),
    nodeTitles: path.map((s) => s.nodeTitle || s.nodeId),
    nodeTypeHistogram: nodeTypeHist,
    edgeTypeHistogram: edgeTypeHist,
    conceptVsProvenanceEdgeCounts: { concept: conceptEdges, provenance: provenanceEdges },
    hasInvariant,
    codeArtifactCount,
    evidenceCount,
    implementsCount,
  };
}

function computeDiff(summaries) {
  const allNodeSets = summaries.map((s) => new Set(s.nodeIds));
  const sharedNodes = [...allNodeSets[0]].filter((id) => allNodeSets.every((set) => set.has(id)));

  const uniqueNodesByPath = summaries.map((s, i) => {
    const others = allNodeSets.filter((_, j) => j !== i);
    return s.nodeIds.filter((id) => others.every((set) => !set.has(id)));
  });

  const allEdgeTypeSets = summaries.map((s) => new Set(Object.keys(s.edgeTypeHistogram)));
  const sharedEdgeTypes = [...allEdgeTypeSets[0]].filter((t) => allEdgeTypeSets.every((set) => set.has(t)));

  const uniqueEdgeTypesByPath = summaries.map((s, i) => {
    const others = allEdgeTypeSets.filter((_, j) => j !== i);
    return Object.keys(s.edgeTypeHistogram).filter((t) => others.every((set) => !set.has(t)));
  });

  const featureKeys = ['codeArtifactCount', 'evidenceCount', 'implementsCount', 'hasInvariant'];
  const featureDeltaByPath = summaries.map((s) => {
    const features = {};
    for (const k of featureKeys) features[k] = s[k];
    return features;
  });

  const humanNotes = generateHumanNotes(summaries, sharedNodes, uniqueNodesByPath);

  return {
    sharedNodes,
    uniqueNodesByPath,
    sharedEdgeTypes,
    uniqueEdgeTypesByPath,
    featureDeltaByPath,
    humanNotes,
  };
}

function generateHumanNotes(summaries, sharedNodes, uniqueNodesByPath) {
  const notes = [];

  notes.push(`${summaries.length} rival paths with ${sharedNodes.length} shared nodes.`);

  const codeHeavy = summaries.reduce((max, s, i) =>
    s.codeArtifactCount > (summaries[max]?.codeArtifactCount || 0) ? i : max, 0);
  const conceptHeavy = summaries.reduce((max, s, i) =>
    s.conceptVsProvenanceEdgeCounts.concept > (summaries[max]?.conceptVsProvenanceEdgeCounts.concept || 0) ? i : max, 0);

  if (codeHeavy !== conceptHeavy) {
    notes.push(`Path ${codeHeavy + 1} is code-heavy (${summaries[codeHeavy].codeArtifactCount} code artifacts).`);
    notes.push(`Path ${conceptHeavy + 1} is concept-heavy (${summaries[conceptHeavy].conceptVsProvenanceEdgeCounts.concept} concept edges).`);
  }

  const invPaths = summaries.map((s, i) => s.hasInvariant ? i + 1 : null).filter(Boolean);
  if (invPaths.length > 0 && invPaths.length < summaries.length) {
    notes.push(`Only path(s) ${invPaths.join(', ')} pass through an invariant node.`);
  }

  for (let i = 0; i < uniqueNodesByPath.length; i++) {
    if (uniqueNodesByPath[i].length > 0) {
      const shortIds = uniqueNodesByPath[i].map((id) => id.split('/').pop().split(':').pop());
      notes.push(`Path ${i + 1} unique nodes: ${shortIds.join(', ')}.`);
    }
  }

  return notes.slice(0, 5);
}

// ═══════════════════════════════════════════════
// Clustering (v0.1)
// ═══════════════════════════════════════════════

function fingerprintKey(summary) {
  const c = summary.conceptVsProvenanceEdgeCounts;
  return [
    c.concept,
    summary.codeArtifactCount,
    summary.hasInvariant ? 1 : 0,
    c.provenance,
    summary.evidenceCount,
  ].join(':');
}

function deriveLabels(summary) {
  const labels = [];
  const c = summary.conceptVsProvenanceEdgeCounts;
  const conceptNodes = summary.nodeTypeHistogram['concept'] || 0;

  if (summary.codeArtifactCount > 0 && summary.codeArtifactCount >= conceptNodes) labels.push('code-heavy');
  if (c.concept > 0 && c.concept >= c.provenance && conceptNodes >= summary.codeArtifactCount) labels.push('concept-heavy');
  if (summary.hasInvariant) labels.push('invariant-heavy');
  if (c.provenance > 0 && c.provenance > c.concept && summary.codeArtifactCount === 0 && !summary.hasInvariant) labels.push('provenance-heavy');
  if (summary.evidenceCount > 0) labels.push('evidence-bearing');

  if (labels.length === 0) labels.push('mixed');
  return labels;
}

/**
 * Cluster rival paths by structural fingerprint.
 * Pure, deterministic. No ranking / adjudication.
 */
export function clusterRivalPaths(summaries) {
  const buckets = new Map();

  for (let i = 0; i < summaries.length; i++) {
    const s = summaries[i];
    const key = fingerprintKey(s);
    if (!buckets.has(key)) {
      buckets.set(key, { indices: [], prototype: s });
    }
    buckets.get(key).indices.push(i);
  }

  const clusters = [];
  let clusterId = 0;

  for (const [key, bucket] of buckets) {
    const members = bucket.indices.map((i) => summaries[i]);
    const proto = bucket.prototype;

    const codeRange = members.map((m) => m.codeArtifactCount);
    const evRange = members.map((m) => m.evidenceCount);

    clusters.push({
      clusterId: clusterId++,
      fingerprint: key,
      count: bucket.indices.length,
      prototypePath: proto.nodeTitles,
      labels: deriveLabels(proto),
      featureRanges: {
        codeArtifactCount: { min: Math.min(...codeRange), max: Math.max(...codeRange) },
        evidenceCount: { min: Math.min(...evRange), max: Math.max(...evRange) },
        hasInvariant: proto.hasInvariant,
        conceptEdges: proto.conceptVsProvenanceEdgeCounts.concept,
        provenanceEdges: proto.conceptVsProvenanceEdgeCounts.provenance,
      },
    });
  }

  clusters.sort((a, b) => b.count - a.count);
  return clusters;
}

/**
 * Compare rival paths between two nodes.
 * v0.1: includes clusters field (backward-compatible).
 *
 * @param {object} graph - { nodes, edges }
 * @param {string} fromId
 * @param {string} toId
 * @param {object} [options] - { directed?: boolean, maxHops?: number }
 * @returns {CompareResult}
 */
export function compare(graph, fromId, toId, options = {}) {
  const { directed = false, maxHops = 6 } = options;

  const rivalResult = findRivalTraces(graph, fromId, toId, { directed, maxHops });

  if (!rivalResult.isRival || rivalResult.paths.length < 2) {
    return {
      ok: false,
      reason: 'no_rivals',
      fromId,
      toId,
      paths: rivalResult.paths.map((p) => summarizePath(p, graph)),
      clusters: [],
      diff: null,
      note: rivalResult.paths.length === 0
        ? 'No path found between nodes.'
        : `Only ${rivalResult.paths.length} shortest path — no rivals to compare.`,
    };
  }

  const summaries = rivalResult.paths.map((p) => summarizePath(p, graph));
  const diff = computeDiff(summaries);
  const clusters = clusterRivalPaths(summaries);

  return {
    ok: true,
    fromId,
    toId,
    hops: rivalResult.hops,
    pathCount: summaries.length,
    clusterCount: clusters.length,
    paths: summaries,
    clusters,
    diff,
  };
}
