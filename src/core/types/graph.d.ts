/**
 * GRAPH TYPES — Truthful declarations matching GraphModel runtime
 *
 * These types describe the ACTUAL runtime behavior of GraphModel.
 * See docs/API_SURFACE_POLICY.md for public/experimental classification.
 *
 * Canonical key for edges: `edges` (not `links`).
 * The constructor accepts both for backward compatibility.
 */

import type { IdentityMeta } from "./identity";
import type { HighlightContext, HighlightState } from "./highlight";

/**
 * Node data. Stored and returned by GraphModel.
 */
export interface NodeData {
  /** Machine identity (immutable) */
  readonly id: string;
  /** Node type */
  type?: string;
  /** Display label (legacy, prefer canonicalName) */
  label?: string;
  /** Ontological name */
  canonicalName?: string;
  /** Alternative names */
  aliases?: string[];
  /** Metadata */
  meta?: IdentityMeta;
  /** Additional properties */
  [key: string]: unknown;
}

/**
 * Edge data as stored internally by GraphModel.
 * Constructor generates `id` from `${source}-${target}` if not provided.
 */
export interface EdgeData {
  /** Edge identifier (auto-generated if not provided) */
  id: string;
  /** Source node ID */
  source: string;
  /** Target node ID */
  target: string;
  /** Relationship type */
  type: string | null;
  /** Grouping hint (e.g. "concept", "provenance", "code") */
  layer?: string;
}

/**
 * Input data accepted by the GraphModel constructor.
 * Canonical key: `edges`. Legacy alias `links` accepted for backward compatibility.
 */
export interface GraphInputData {
  nodes?: NodeData[];
  /** Canonical edge array */
  edges?: Array<{
    id?: string;
    source: string;
    target: string;
    type?: string;
    layer?: string;
    [key: string]: unknown;
  }>;
  /** @deprecated Legacy alias for `edges`. Use `edges` instead. */
  links?: Array<{
    id?: string;
    source: string;
    target: string;
    type?: string;
    layer?: string;
    [key: string]: unknown;
  }>;
}

/**
 * Shape returned by GraphModel.toJSON().
 * Uses canonical `edges` key. Preserves `type` and `layer`.
 */
export interface GraphSerializedData {
  nodes: NodeData[];
  edges: Array<{ id: string; source: string; target: string; type: string | null; layer?: string }>;
}

/**
 * GraphModel public API — matches actual runtime behavior.
 *
 * Neighbor methods return undirected results (both directions).
 * Edges are stored directed (source → target).
 * Operators choose traversal mode (directed/undirected) independently.
 */
export interface IGraphModel {
  /** All nodes */
  getNodes(): NodeData[];

  /** All edges (directed, includes type and layer) */
  getEdges(): EdgeData[];

  /** Node by ID */
  getNodeById(nodeId: string): NodeData | undefined;

  /**
   * Neighbor IDs for a node (undirected).
   * Returns Set<string> of node IDs.
   */
  getNeighbors(nodeId: string): Set<string>;

  /**
   * Neighbor node objects (undirected).
   * Convenience method that resolves IDs to NodeData.
   */
  getNeighborNodes(nodeId: string): NodeData[];

  /** Nodes filtered by type */
  getNodesByType(type: string): NodeData[];

  /** All known node type strings */
  getNodeTypes(): string[];

  /** Compute highlight state */
  computeHighlight(context: HighlightContext): HighlightState;

  /**
   * Compute scope (1-hop neighborhood).
   * Returns Set<string> of node IDs in scope.
   */
  computeScope(hubId: string): Set<string>;

  /** Related node IDs filtered by neighbor type */
  getRelatedNodeIdsByType(nodeId: string, type: string): string[];

  /**
   * Serialize to JSON.
   * Uses canonical `edges` key. Preserves type and layer.
   */
  toJSON(): GraphSerializedData;
}

/**
 * GraphModel constructor.
 */
export interface GraphModelConstructor {
  new (data?: GraphInputData): IGraphModel;
  fromJSON(json: GraphInputData): IGraphModel;
}

/**
 * GraphModel class.
 */
export declare const GraphModel: GraphModelConstructor;
