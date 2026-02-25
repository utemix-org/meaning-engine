/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEANING ENGINE — Universal Semantic Graph Engine
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Main entry point for the meaning-engine package.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Engine exports
export {
  MeaningEngine,
  ENGINE_VERSION,
  WorldInterface,
  SchemaValidator,
  GraphValidator,
  WorldValidator,
  CatalogValidator,
  Schema,
  WorldAdapter,
  SpecificationReader,
  CatalogRegistry,
  OperatorEngine,
  CatalogLoader,
} from "./engine/index.js";

// Core exports
export {
  GraphModel,
  createContextFromState,
  createEmptyContext,
  INTENSITY,
  Projection,
  ProjectionRegistry,
  projectionRegistry,
  DevProjection,
  OWLProjection,
  NAMESPACES,
  GraphRAGProjection,
  ReflectiveProjection,
  NODE_TYPES,
  NODE_TYPE_META,
  EDGE_TYPES,
  EDGE_TYPE_META,
  VISIBILITY,
  STATUS,
  IDENTITY_REQUIRED_FIELDS,
  IDENTITY_RECOMMENDED_FIELDS,
  SchemaValidator as CoreSchemaValidator,
  SCHEMA_VERSION,
  SCHEMA_META,
  checkUniqueNodeIds,
  checkUniqueEdgeIds,
  checkNoDanglingEdges,
  checkNoSelfLoops,
  checkAllNodesHaveId,
  checkAllNodesHaveType,
  checkKnownNodeTypes,
  checkAllNodesHaveLabel,
  checkAllEdgesHaveType,
  checkKnownEdgeTypes,
  checkNoDuplicateEdges,
  checkGraphConnected,
  checkNoIsolatedNodes,
  checkHasRootNode,
  checkNoContainsCycles,
  checkSingleParent,
  InvariantChecker,
  STRICTNESS,
  GraphSnapshot,
  SnapshotHistory,
  diffSnapshots,
  CHANGE_TYPE,
  SNAPSHOT_VERSION,
  SyntheticGraphGenerator,
  PerformanceAuditor,
  benchmark,
  benchmarkAsync,
  formatTime,
  formatSize,
  analyzeScalability,
  ChangeProtocol,
  ProposalValidator,
  createProposal,
  MUTATION_TYPE,
  AUTHOR_TYPE,
  PROPOSAL_STATUS,
  LLMReflectionEngine,
  ContextAssembler,
  PromptBuilder,
  SuggestionParser,
  ENGINE_MODE,
  PROMPT_TYPE,
  OwnershipGraph,
  ownershipGraph,
  createIdentity,
  getDisplayName,
  generateSlug,
  validateIdImmutability,
  updateCanonicalName,
  addAlias,
  matchesName,
  extractIdentityFromNode,
  serializeIdentity,
} from "./core/index.js";

// Highlight model
export {
  computeHighlight,
  INTENSITY as HIGHLIGHT_INTENSITY,
} from "./highlight/highlightModel.js";

// Default export
export { MeaningEngine as default } from "./engine/index.js";
