# Positioning Memo

## Canonical Definition

> **Meaning Engine** is a deterministic computational substrate for graph-structured knowledge:
> you bring a typed semantic graph, the engine provides projection, navigation, diagnostic operators, and evidence-grounded reports.

## Public Promise

Meaning Engine publicly guarantees:

| Guarantee | Artifact |
|-----------|----------|
| A documented world input contract (JSON seed files) | [WORLD_INPUT_FORMAT.md](./WORLD_INPUT_FORMAT.md) |
| A declared public API surface with SemVer discipline | [API_SURFACE_POLICY.md](./API_SURFACE_POLICY.md) |
| Deterministic projection: same inputs → same output | `projectGraph`, tested |
| Deterministic diagnostic operators over graph-structured worlds | `trace`, `compare`, `supports` |
| Reproducible CLI workflows with explicit evidence grounding | `runReasoningReport.js` |
| World-agnostic: you bring your own graph, the engine computes | Two reference worlds shipped |

## Non-Promise List (What It Is Not)

| It is not… | Why |
|------------|-----|
| **GraphRAG** | No LLM-powered entity extraction, no community summaries, no vector embeddings. See [explanation below](#not-graphrag). |
| **An ontology database / RDF store** | No SPARQL, no OWL reasoning, no triple-store persistence. Graphs are loaded from flat JSON seed files. |
| **A UI framework** | No rendering, no DOM, no components. The engine produces data structures; rendering is a separate concern. |
| **A world engine / game engine** | No physics, no simulation loop, no spatial model. "World" here means a named knowledge graph with schema. |
| **An autonomous reasoning agent** | No goals, no planning, no self-directed exploration. Operators are invoked explicitly by the caller. |

## Public vs Experimental Boundary

| Status | Scope | SemVer |
|--------|-------|--------|
| **Public (stable)** | GraphModel, Projection, Navigation, Knowledge Substrate, Operators (trace/compare/supports), CLI workflows, World input format | Covered: breaking changes require minor bump + CHANGELOG |
| **Experimental** | LLMReflectionEngine, OWLProjection, GraphIndexProjection, ReflectiveProjection, Cabin (diagnostic observer), Workbench/character/domain projection modes | Not covered: may change or be removed without notice |
| **Internal** | Test suites, operator baselines, world tools, specification directory | Implementation details — do not depend on them |

Full classification: [API_SURFACE_POLICY.md](./API_SURFACE_POLICY.md).

## Not GraphRAG

The experimental class **`GraphIndexProjection`** (canonical name; the former misleading name `GraphRAGProjection` is a deprecated export alias) has **nothing in common with Microsoft GraphRAG** or the broader "GraphRAG" pattern:

| Property | Microsoft GraphRAG | Meaning Engine's `GraphIndexProjection` |
|----------|-------------------|--------------------------------------|
| Entity extraction | LLM-powered | None — nodes come from seed files |
| Community summaries | LLM-generated | None |
| Embeddings / vector search | Yes | None — token-based text index |
| Context window assembly | LLM-optimized | Deterministic BFS expansion |
| LLM dependency | Required | None — fully deterministic |

The class is a deterministic text indexer with BFS context expansion over an existing graph. See [DECISIONS.md](./DECISIONS.md#adr-014) for the rename and deprecation policy.

## Versioning

The project is at `0.y.z`. `package.json` is the single source of truth for the version. During `0.y.z`, minor bumps may contain breaking changes to the public API. See [VERSIONING.md](./VERSIONING.md).
