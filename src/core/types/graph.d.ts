/**
 * GRAPH TYPES — Truthful declarations matching GraphModel runtime
 *
 * These types describe the ACTUAL runtime behavior of GraphModel.
 * See docs/API_SURFACE_POLICY.md for public/experimental classification.
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
 * Note: constructor generates `id` from `${source}-${target}` if not provided.
 */
export interface EdgeData {
  /** Edge identifier (auto-generated if not provided) */
  id: string;
  /** Source node ID */
  source: string;
  /** Target node ID */
  target: string;
  /** Relationship type (preserved internally, but dropped by toJSON) */
  type: string | null;
}

/**
 * Input data accepted by the GraphModel constructor.
 * Uses `links` key (not `edges`) for historical reasons.
 */
export interface GraphInputData {
  nodes?: NodeData[];
  links?: Array<{
    id?: string;
    source: string;
    target: string;
    type?: string;
    [key: string]: unknown;
  }>;
}

/**
 * Shape returned by GraphModel.toJSON().
 * WARNING: currently drops `type` from edges (see P0.4 in audit plan).
 */
export interface GraphSerializedData {
  nodes: NodeData[];
  links: Array<{ id: string; source: string; target: string }>;
}

/**
 * GraphModel public API — matches actual runtime behavior.
 */
export interface IGraphModel {
  /** All nodes */
  getNodes(): NodeData[];

  /** All edges (internal representation, includes type) */
  getEdges(): EdgeData[];

  /** Node by ID */
  getNodeById(nodeId: string): NodeData | undefined;

  /**
   * Neighbor IDs for a node (undirected).
   * Returns Set<string> of node IDs, NOT node objects.
   */
  getNeighbors(nodeId: string): Set<string>;

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
   * WARNING: currently uses `links` (not `edges`) and drops edge `type`.
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
