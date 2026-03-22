/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GRAPH MODEL — Abstract graph data model
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * World-agnostic graph: stores nodes and edges, provides typed accessors,
 * and delegates highlight/scope computation. Knows nothing about rendering.
 *
 * Usage:
 *   const model = new GraphModel(graphData);
 *   const highlight = model.computeHighlight(context);
 *   const scope = model.computeScope(hubId);
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { computeHighlight, createContextFromState, createEmptyContext, INTENSITY } from "../highlight/highlightModel.js";

/**
 * @typedef {Object} NodeData
 * @property {string} id
 * @property {string} type
 * @property {string} [label]
 * @property {boolean} [isStart]
 */

/**
 * @typedef {Object} EdgeData
 * @property {string} id
 * @property {string} source
 * @property {string} target
 * @property {string|null} type
 * @property {string} [layer]
 */

/**
 * Canonical input key: `edges`. Legacy alias `links` accepted for backward compatibility.
 */
export class GraphModel {
  /**
   * @param {Object} data
   * @param {Array<NodeData>} data.nodes
   * @param {Array<EdgeData>} data.edges - Canonical edge array
   * @param {Array<EdgeData>} [data.links] - Legacy alias for edges
   */
  constructor(data = { nodes: [], edges: [] }) {
    /** @type {Map<string, NodeData>} */
    this.nodesById = new Map();
    
    /** @type {Map<string, Set<string>>} */
    this.neighborsById = new Map();
    
    /** @type {Array<EdgeData>} */
    this.edges = [];
    
    /** @type {Set<string>} */
    this.nodeTypes = new Set();
    
    /** @type {Map<string, Set<string>>} */
    this.nodesByType = new Map();
    
    this._loadData(data);
  }
  
  /** @private */
  _loadData(data) {
    this.nodesById.clear();
    this.neighborsById.clear();
    this.edges = [];
    this.nodeTypes.clear();
    this.nodesByType.clear();
    
    for (const node of data.nodes || []) {
      this.nodesById.set(node.id, node);
      this.neighborsById.set(node.id, new Set());
      
      if (node.type) {
        this.nodeTypes.add(node.type);
        if (!this.nodesByType.has(node.type)) {
          this.nodesByType.set(node.type, new Set());
        }
        this.nodesByType.get(node.type).add(node.id);
      }
    }
    
    const rawEdges = data.edges || data.links || [];
    for (const link of rawEdges) {
      const edge = {
        id: link.id || `${link.source}-${link.target}`,
        source: link.source,
        target: link.target,
        type: link.type || null,
      };
      if (link.layer != null) edge.layer = link.layer;
      this.edges.push(edge);
      
      const sourceId = this._getNodeId(link.source);
      const targetId = this._getNodeId(link.target);
      
      if (this.neighborsById.has(sourceId)) {
        this.neighborsById.get(sourceId).add(targetId);
      }
      if (this.neighborsById.has(targetId)) {
        this.neighborsById.get(targetId).add(sourceId);
      }
    }
  }
  
  /** @private */
  _getNodeId(endpoint) {
    if (typeof endpoint === "string") return endpoint;
    if (endpoint && typeof endpoint === "object" && endpoint.id) return endpoint.id;
    return String(endpoint);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // API: Data access
  // ═══════════════════════════════════════════════════════════════════════════
  
  /** @returns {Array<NodeData>} */
  getNodes() {
    return [...this.nodesById.values()];
  }
  
  /** @returns {Array<EdgeData>} */
  getEdges() {
    return this.edges;
  }
  
  /**
   * @param {string} nodeId
   * @returns {NodeData|undefined}
   */
  getNodeById(nodeId) {
    return this.nodesById.get(nodeId);
  }
  
  /**
   * @param {string} nodeId
   * @returns {Set<string>}
   */
  getNeighbors(nodeId) {
    return this.neighborsById.get(nodeId) || new Set();
  }
  
  /**
   * @param {string} nodeId
   * @returns {Array<NodeData>}
   */
  getNeighborNodes(nodeId) {
    const ids = this.neighborsById.get(nodeId);
    if (!ids) return [];
    return [...ids].map(id => this.nodesById.get(id)).filter(Boolean);
  }
  
  /**
   * @param {string} type
   * @returns {Array<NodeData>}
   */
  getNodesByType(type) {
    const ids = this.nodesByType.get(type) || new Set();
    return [...ids].map(id => this.nodesById.get(id)).filter(Boolean);
  }
  
  /** @returns {Array<string>} */
  getNodeTypes() {
    return [...this.nodeTypes];
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // API: Computation
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * @param {Object} context
   * @returns {import("../highlight/highlightModel.js").HighlightState}
   */
  computeHighlight(context) {
    const graphData = {
      nodesById: this.nodesById,
      neighborsById: this.neighborsById,
      edges: this.edges
    };
    return computeHighlight(context, graphData);
  }
  
  /**
   * @param {string} hubId
   * @returns {Set<string>}
   */
  computeScope(hubId) {
    const scope = new Set();
    const hub = this.nodesById.get(hubId);
    if (!hub) return scope;
    
    scope.add(hubId);
    
    const neighbors = this.neighborsById.get(hubId) || new Set();
    for (const neighborId of neighbors) {
      scope.add(neighborId);
    }
    
    return scope;
  }
  
  /**
   * @param {string} nodeId
   * @param {string} type
   * @returns {Array<string>}
   */
  getRelatedNodeIdsByType(nodeId, type) {
    const neighbors = this.neighborsById.get(nodeId);
    if (!neighbors) return [];
    
    const related = [];
    for (const neighborId of neighbors) {
      const node = this.nodesById.get(neighborId);
      if (node?.type === type) {
        related.push(neighborId);
      }
    }
    return related;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // API: Serialization
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Canonical output key: `edges` (preserves type, layer, and other fields).
   * @returns {{ nodes: NodeData[], edges: EdgeData[] }}
   */
  toJSON() {
    return {
      nodes: this.getNodes(),
      edges: this.edges.map(e => {
        const out = { id: e.id, source: e.source, target: e.target, type: e.type };
        if (e.layer != null) out.layer = e.layer;
        return out;
      })
    };
  }
  
  /**
   * @param {Object} json
   * @returns {GraphModel}
   */
  static fromJSON(json) {
    return new GraphModel(json);
  }
}

// Re-exports
export { createContextFromState, createEmptyContext, INTENSITY };
