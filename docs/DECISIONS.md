# Architecture Decision Records

This file records explicit naming, terminology, and architecture decisions for the Meaning Engine project.

---

## ADR-014: Rename `GraphRAGProjection` → `GraphIndexProjection`

**Date:** 2026-03-21
**Status:** Proposed (decision recorded; code rename deferred)
**Track:** ME_READINESS / Block A

### Context

The repository contains an experimental class `GraphRAGProjection` (`src/core/GraphRAGProjection.js`). The name implies a relationship with Microsoft's [GraphRAG](https://github.com/microsoft/graphrag) pattern or the broader "GraphRAG" concept in the AI/ML community. This creates a misleading identity signal for external readers.

### Actual Behavior

`GraphRAGProjection` is a **deterministic text indexer with BFS context expansion**:

- Builds an inverted text index over graph nodes (tokenize label/id/aliases → token map)
- Provides `queryByText()` for token-intersection search (no embeddings, no LLM)
- Provides `expandContext()` for BFS neighbor expansion
- Provides `toLLMContext()` for flat JSON export (does not invoke any LLM)
- Fully deterministic, no external dependencies
- No entity extraction, no community summaries, no vector search

None of these features correspond to the GraphRAG pattern.

### Decision

**Rename to `GraphIndexProjection`** to accurately describe the class behavior: deterministic graph indexing and structural search.

### Implementation Plan

1. Rename class and file: `GraphRAGProjection` → `GraphIndexProjection`, `GraphRAGProjection.js` → `GraphIndexProjection.js`
2. Update all imports in `src/core/index.js`, `src/index.js`, `LLMReflectionEngine.js`, `ReflectiveProjection.js`
3. Add a deprecated re-export alias for backward compatibility: `export { GraphIndexProjection as GraphRAGProjection }` (to be removed in next minor)
4. Update `API_SURFACE_POLICY.md` and `README.md` references
5. Update documentation-world seed nodes/edges (artifact IDs containing the old name)

**Implementation is deferred** — this ADR records the decision. The rename will be executed in a separate task when approved.

### Compatibility Note

The class is classified as **experimental** (no tests, no docs, no SemVer coverage). Renaming an experimental export does not require a minor version bump under current policy. A deprecated alias will be provided for one minor release cycle as a courtesy.

---

## ADR-015: Canonical Project Identity — "Deterministic Computational Substrate"

**Date:** 2026-03-21
**Status:** Accepted
**Track:** ME_READINESS / Block A

### Context

The project's identity has been ambiguous to external readers. Different documents emphasized different aspects (graph engine, knowledge system, semantic projection engine), and the presence of `GraphRAGProjection` in exports could suggest an LLM-powered retrieval system.

### Decision

The canonical one-line definition is:

> **Meaning Engine** is a deterministic computational substrate for graph-structured knowledge: you bring a typed semantic graph, the engine provides projection, navigation, diagnostic operators, and evidence-grounded reports.

Key identity boundaries:

| It is | It is not |
|-------|-----------|
| Deterministic engine | Autonomous agent |
| World-agnostic computational substrate | World engine / game engine |
| Graph projection + operators | GraphRAG / vector search |
| Evidence-grounded reports | LLM-powered reasoning |
| JSON seed files as input | Ontology database / RDF store |

This definition is recorded in `docs/POSITIONING_MEMO.md` and `README.md`.
