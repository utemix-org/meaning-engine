# Tension Embedding Policy (v1)

This document defines how **tension patterns** are represented within a system — as metadata, as graph structure, or both — and establishes the rules for the first intentional tension set.

## Two modes of tension representation

### Questions-as-metadata

Questions (see [QUESTION_FORMAT.md](./QUESTION_FORMAT.md)) are **metadata artifacts** stored outside the graph. They reference graph nodes, code files, and documentation but do not add nodes or edges to any world.

Use this mode when:
- The tension is about the relationship between code and documentation (not between graph entities)
- The tension requires human or LLM judgment to evaluate
- The tension is transient (will be resolved by a code change)

### Tensions-embedded-in-graph-relief

Some tensions can be **structurally encoded** in a world's graph. This means the tension is visible to operators (trace, compare, supports) without external metadata.

Use this mode when:
- The tension manifests as a structural pattern (missing edge, contradictory paths, isolated cluster)
- The tension can be detected by graph analysis alone
- The tension is meant to calibrate or stress-test operators

## Tension patterns

Each pattern describes how a tension class from [ISSUE_TAXONOMY.md](./ISSUE_TAXONOMY.md) can appear in graph structure:

| Pattern | Graph manifestation | Detectable by |
|---------|-------------------|---------------|
| **Contradiction** | Two edges of opposing types between the same nodes (e.g. `defines` + `contradicts`) | Compare operator (rival paths with conflicting edge types) |
| **Contract drift** | A `spec` node linked to a `code_artifact` node, but the code artifact has `status: legacy` or `status: missing` | Trace operator (path exists but endpoint is stale) |
| **Doc/code mismatch** | A `page` node claims a relationship that has no corresponding `code_artifact` edge | Supports operator (missing expected edge type) |
| **Unsupported claim** | A node with type `claim` or `decision` has no `proved_by` or `implements` edges | Supports operator (no evidence path) |
| **Missing bridge** | Two clusters with no path between them despite conceptual relatedness | Trace operator (returns `no_path`); Compare operator (no rival paths) |
| **Vocabulary split** | Two nodes represent the same concept under different IDs (no `alias_of` or `same_as` edge) | Compare operator + manual review |

## Tension Set v1

The following 5 tension classes are selected for the first intentional demo/test world material. Selection criteria: (1) observed during Phase 2 Audit, (2) representable as both question-metadata and graph-relief, (3) testable with existing operators.

### 1. `doc_runtime_mismatch` (DRM)

**Why selected:** Most frequently encountered P0 class in Track A. Directly threatens public promise.

**Materialization example:**
- **Question-as-metadata:** "Does `toJSON()` output match the shape documented in `WORLD_INPUT_FORMAT.md`?" → references code + doc
- **Graph-relief:** In a test world, a `page:world-input-format` node links to `code_artifact:GraphModel.toJSON` via `documents`. If the code artifact has a `contract_shape` property that differs from the page's description, a `drift_against` edge can encode the mismatch.

### 2. `type_contract_drift` (TCD)

**Why selected:** Critical for TypeScript consumers. Undermines trust in `.d.ts` declarations.

**Materialization example:**
- **Question-as-metadata:** "Does `graph.d.ts` declare the same return type for `getNeighbors()` as the runtime implementation?" → references `.d.ts` + `.js`
- **Graph-relief:** A `spec:graph-types` node linked to `code_artifact:GraphModel.getNeighbors` via `declares`. If the declared type differs from the actual type, a `contradicts` edge encodes the drift.

### 3. `vocabulary_ambiguity` (VOC)

**Why selected:** `links` vs `edges` caused confusion across the entire stack. Affects onboarding and documentation clarity.

**Materialization example:**
- **Question-as-metadata:** "Is there a single canonical term for edge collections in GraphModel constructor, `toJSON()`, and seed files?" → references multiple code + doc locations
- **Graph-relief:** Two concept nodes `concept:links` and `concept:edges` both connected to `code_artifact:GraphModel` via `used_by`. The absence of a `same_as` or `alias_of` edge between them encodes the ambiguity.

### 4. `unsupported_claim` (USC)

**Why selected:** Overclaims in architecture docs undermine credibility. Track A already addressed the formula; this generalizes the pattern.

**Materialization example:**
- **Question-as-metadata:** "Does `ARCHITECTURE.md` present the projection formula as formally proven, or as explanatory framing?" → references `ARCHITECTURE.md`
- **Graph-relief:** A `decision:projection-formula` node with an `applies_to` edge to `spec:projection` but no `proved_by` edge to any `evidence` or `invariant` node. The `supports` operator would report "no evidence path".

### 5. `missing_bridge` (MBR)

**Why selected:** Already detected by operators in both reference worlds. Natural calibration material for trace/compare.

**Materialization example:**
- **Question-as-metadata:** "Is there a path from `concept:seasoning` to the main knowledge cluster in the cooking world?" → references world seed
- **Graph-relief:** An intentionally isolated node or cluster with no edges to the main graph. Trace returns `no_path`; Supports offers bridge candidates.

## Rules for embedding tensions in a world

1. **Explicit node types:** Tension-bearing nodes should use standard types from the world's vocabulary (`concept`, `spec`, `code_artifact`, `evidence`, etc.). Do not introduce special "tension" node types — tensions emerge from structural patterns, not from labels.

2. **Edge type signals:** Use existing edge types where possible. When a tension requires an edge type not in the world's vocabulary, prefer these canonical additions:
   - `contradicts` — explicit disagreement between two nodes
   - `drift_against` — a declared relationship that has drifted from reality
   - `alias_of` / `same_as` — duplicate identity (presence resolves VOC tension; absence encodes it)

3. **Operator detectability:** Every embedded tension must be detectable by at least one existing operator (trace, compare, supports) or by a trivial graph query. If an operator cannot surface the tension, the embedding is wrong — use question-as-metadata instead.

4. **No synthetic worlds for tensions only:** Tensions should be embedded in worlds that also have legitimate content. A world of pure tensions is not useful for calibration because it lacks the "normal" structure that operators need to distinguish signal from noise.

5. **Documentation:** Each intentionally embedded tension should be documented in the world's README with: tension class, node/edge IDs involved, expected operator output.

## What this policy does NOT cover

- **Cabin eval runtime:** How questions are evaluated at runtime (future).
- **LLM integration:** How an LLM observer would use these tensions (future).
- **Scoring/grading:** How to measure quality of tension detection (future).
- **Full demo world population:** This policy defines rules; actual world construction follows separately.

## Relationship to other artifacts

| Artifact | Role |
|----------|------|
| [QUESTION_FORMAT.md](./QUESTION_FORMAT.md) | Schema for question-as-metadata instances |
| [ISSUE_TAXONOMY.md](./ISSUE_TAXONOMY.md) | Vocabulary for tension classes |
| [WORLD_INPUT_FORMAT.md](./WORLD_INPUT_FORMAT.md) | Format for worlds where tensions are embedded |
| [API_SURFACE_POLICY.md](./API_SURFACE_POLICY.md) | Defines what is public/experimental (anchors "unsupported claim" detection) |
| Operators (`trace`, `compare`, `supports`) | Detection layer for graph-embedded tensions |
