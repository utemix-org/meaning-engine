# Architecture Decision Records

This file records explicit naming, terminology, and architecture decisions for the Meaning Engine project.

---

## ADR-014: Rename `GraphRAGProjection` → `GraphIndexProjection`

**Date:** 2026-03-21
**Status:** Implemented
**Track:** ME_READINESS / Block A (code: Block C follow-up)

### Context

The repository contained an experimental class whose former name implied a relationship with Microsoft's [GraphRAG](https://github.com/microsoft/graphrag) pattern or the broader "GraphRAG" concept in the AI/ML community. That created a misleading identity signal for external readers.

### Actual Behavior

`GraphIndexProjection` is a **deterministic text indexer with BFS context expansion**:

- Builds an inverted text index over graph nodes (tokenize label/id/aliases → token map)
- Provides `queryByText()` for token-intersection search (no embeddings, no LLM)
- Provides `expandContext()` for BFS neighbor expansion
- Provides `toLLMContext()` for flat JSON export (does not invoke any LLM)
- Fully deterministic, no external dependencies
- No entity extraction, no community summaries, no vector search

None of these features correspond to the GraphRAG pattern.

### Decision

**Canonical name: `GraphIndexProjection`** (`src/core/GraphIndexProjection.js`) — deterministic graph indexing and structural search.

### Deprecation policy

- **`GraphRAGProjection`** remains available only as a **deprecated export alias** of `GraphIndexProjection` (same class identity: `GraphRAGProjection === GraphIndexProjection`).
- Marked in source via JSDoc on the re-export in `src/core/index.js` and in this ADR.
- **Removal:** next minor release after the one that ships this alias (one minor courtesy cycle), unless the experimental surface is revised sooner.

### Compatibility Note

The class is classified as **experimental** (SemVer does not cover it). The alias exists to avoid surprising early adopters of the old symbol name; new code should import `GraphIndexProjection`.

---

## ADR-015: Canonical Project Identity — "Deterministic Computational Substrate"

**Date:** 2026-03-21
**Status:** Accepted
**Track:** ME_READINESS / Block A

### Context

The project's identity has been ambiguous to external readers. Different documents emphasized different aspects (graph engine, knowledge system, semantic projection engine), and the former misleading export name for the graph index projection could suggest an LLM-powered retrieval system.

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
