# Architecture

## Design Model

> **Explanatory framing** — the formula below describes the engine's design intent.
> It is not a formally proven property; it is an internal shorthand for the projection pipeline.
> See the [Public Promise](./README.md#public-promise) for what is SemVer-covered.

```
ViewModel = P(G, F, S, Params)
```

Where **G** is the graph, **F** is the focus node, **S** is the current state, and **Params** are projection parameters (depth, filters, etc.). The projection is deterministic — same inputs always produce the same output.

## Layers

```
┌─────────────────────────────────────────────┐
│  World Layer                                │
│  Schema + Seed + Config (your domain)       │
├─────────────────────────────────────────────┤
│  Operator Layer                             │
│  Trace, Compare, Supports, Analysis         │
├─────────────────────────────────────────────┤
│  Engine Layer                               │
│  WorldAdapter, Schema, SpecificationReader  │
├─────────────────────────────────────────────┤
│  Core Layer                                 │
│  GraphModel, Projection, Navigation,        │
│  Knowledge Substrate, Identity, Invariants  │
└─────────────────────────────────────────────┘
```

### Core Layer (`src/core/`)

The world-agnostic computational substrate.

- **GraphModel** — Typed graph: nodes with `{id, type, label}`, edges with `{source, target, type}`. Canonical input/output key is `edges`; legacy alias `links` accepted at the constructor boundary only. Provides neighbor lookup (`getNeighbors(): Set<string>`, `getNeighborNodes(): NodeData[]`) and serialization (`toJSON()` preserves `type` and `layer`). Edges are stored directed (source → target); the neighbor index is undirected.
- **Projection Pipeline** (`src/core/projection/`) — 5-step deterministic function chain: `validateInputs → resolveFocus → computeVisibleSubgraph → deriveSemanticRoles → buildViewModel`. Each step has a single responsibility and is independently testable.
- **Navigation** (`src/core/navigation/`) — Formal state transitions: `select`, `drillDown`, `drillUp`, `reset`. Each transition has a precondition and postcondition.
- **Knowledge Substrate** (`src/core/knowledge/`) — Epistemic event log with `propose → verify → approve/reject` lifecycle. Statements have statuses (`PROPOSED`, `VERIFIED`, `CANONICAL`, `REJECTED`). The `evaluate()` function reduces the event log into canonical statements. `buildGraphFromStatements()` constructs the graph only from canonical knowledge.
- **Identity** — Node identity model: canonical name, slug, aliases, immutable ID.
- **Invariants** — Structural invariants (unique IDs, no dangling edges, no self-loops) enforced at validation time.

### Engine Layer (`src/engine/`)

Adapters that connect the core to specific world configurations.

- **WorldAdapter** — Loads schema + seed data, creates a GraphModel-compatible graph. `getNeighbors()` returns `Set<string>` (consistent with GraphModel).
- **Schema** — Declares valid node types, edge types, and constraints for a world.
- **SpecificationReader** — Reads the engine's own specification. *Note: the specification is `experimental` and not a source of truth; `package.json` is authoritative for versioning.*

### Operator Layer (`operators/`)

Pure functions that derive structural insights from graphs. No side effects, no engine mutations.

- **Trace** — Finds directed shortest path between two nodes. When no path exists, identifies the gap boundary and suggests candidate bridge concepts.
- **Compare** — Given two nodes with multiple shortest paths (rival traces), computes per-path summaries (node/edge type histograms, code artifact counts, invariant presence) and a diff. Clusters rival paths into archetypes with descriptive labels (`code-heavy`, `concept-heavy`, `invariant-heavy`, etc.).
- **Supports** — Checks whether an operator can meaningfully run on a given graph (e.g., does the graph have the required node/edge types for Trace?).

Operators accept raw `{nodes, edges}` objects and do not require `GraphModel` instances.

### World Layer (`worlds/`)

Reference world implementations that demonstrate the engine's capabilities.

- **Documentation World** — The engine's own documentation modeled as a semantic graph. 116 nodes, 292 edges across multiple node types (`page`, `concept`, `spec`, `invariant`, `evidence`, `decision`, `code_artifact`, etc.) and edge types (`defines`, `constrains`, `implements`, `depends_on`, etc.), separated into `concept` and `provenance` layers.
- **Authored Mini-World** — A hand-crafted Type Theory domain (25 nodes, 27 edges) used as a stress test and calibration point.

## World-Agnostic Principle

The engine does not know about specific domains. It provides:
- A typed graph model (edges with `type` and optional `layer`)
- A deterministic projection pipeline
- Navigation transitions
- An epistemic event lifecycle
- Structural invariant checks

The **world** provides:
- A schema (what node/edge types are valid)
- Seed data (initial graph content via `seed.nodes.json` + `seed.edges.json`)
- Configuration (projection parameters, workbench policies)

This separation allows the same engine to power a documentation knowledge base, a research ontology, a codebase dependency graph, or any other domain where typed relationships between entities matter.

## Graph Contract

| Aspect | Canonical value |
|--------|----------------|
| Edge key | `edges` (constructor, `toJSON()`, seeds) |
| Legacy alias | `links` (constructor input only, deprecated) |
| Neighbor IDs | `getNeighbors(nodeId): Set<string>` |
| Neighbor objects | `getNeighborNodes(nodeId): NodeData[]` |
| Edge storage | Directed (source → target) |
| Neighbor index | Undirected (both directions) |
| Traversal mode | Chosen per operator (`trace` = directed, `compare` = undirected) |
| Serialization | `toJSON()` → `{ nodes, edges }` with `type` and `layer` preserved |

## Invariant System

Every architectural rule is expressed as a named, testable invariant:

- **KE1–KE5**: Knowledge substrate invariants (canonical-only graph, reject safety, event causality, idempotent evaluation, ViewModel stability)
- **PROJ**: Projection is deterministic — same `(graph, focus, params)` always produces the same ViewModel
- **NAV**: Navigation transitions are type-safe and reversible
- **Structural**: Graph integrity (unique IDs, no dangling edges)

Invariants are enforced by tests in the CI pipeline.

## Specification Status

The `specification/` directory contains a machine-readable description of the engine's API. It is marked as **experimental** and is not a source of truth for versioning or behavior. `package.json` is the authoritative version source. See [VERSIONING.md](./docs/VERSIONING.md).
