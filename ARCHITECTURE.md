# Architecture

## Core Formula

```
ViewModel = P(G, F, S, Params)
```

Where **G** is the graph, **F** is the focus node, **S** is the current state, and **Params** are projection parameters (depth, filters, etc.). The projection is a **pure function** — same inputs always produce the same output.

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

- **GraphModel** — Typed graph: nodes with `{id, type, label}`, links with `{source, target, type}`. Provides traversal, neighbor lookup, subgraph extraction.
- **Projection Pipeline** (`src/core/projection/`) — 5-step pure function chain: `validateInputs → resolveFocus → computeVisibleSubgraph → deriveSemanticRoles → buildViewModel`. Each step has a single responsibility and is independently testable.
- **Navigation** (`src/core/navigation/`) — Formal state transitions: `select`, `drillDown`, `drillUp`, `reset`. Each transition has a precondition, postcondition, and is reversible.
- **Knowledge Substrate** (`src/core/knowledge/`) — Epistemic event log with `propose → verify → approve/reject` lifecycle. Statements have statuses (`PROPOSED`, `VERIFIED`, `CANONICAL`, `REJECTED`). The `evaluate()` function reduces the event log into canonical statements. `buildGraphFromStatements()` constructs the graph only from canonical knowledge.
- **Identity** — Node identity model: canonical name, slug, aliases, immutable ID.
- **Invariants** — Structural invariants (unique IDs, no dangling edges, no self-loops, connectivity, containment DAG) enforced at validation time.

### Engine Layer (`src/engine/`)

Adapters that connect the core to specific world configurations.

- **WorldAdapter** — Loads schema + seed data, validates against the specification.
- **Schema** — Declares valid node types, edge types, and constraints for a world.
- **SpecificationReader** — Reads the engine's own formal specification.

### Operator Layer (`operators/`)

Pure functions that derive structural insights from graphs. No side effects, no engine mutations.

- **Trace** — Finds directed shortest path between two nodes. When no path exists, identifies the gap boundary and suggests candidate bridge concepts.
- **Compare** — Given two nodes with multiple shortest paths (rival traces), computes per-path summaries (node/edge type histograms, code artifact counts, invariant presence) and a diff. Clusters rival paths into archetypes with descriptive labels (`code-heavy`, `concept-heavy`, `invariant-heavy`, etc.).
- **Supports** — Checks whether an operator can meaningfully run on a given graph (e.g., does the graph have the required node/edge types for Trace or Inspect?).

### World Layer (`worlds/`)

Reference world implementations that demonstrate the engine's capabilities.

- **Documentation World** — The engine's own documentation modeled as a semantic graph. ~80 nodes across 8 types (`page`, `concept`, `spec`, `invariant`, `evidence`, `decision`, `drift_item`, `code_artifact`), ~120 edges across 11 types (`defines`, `constrains`, `refines`, `depends_on`, `applies_to`, `implements`, `proved_by`, `reported_by`, `introduced_by`, `drift_against`, `relates`), separated into `concept` and `provenance` layers.

## World-Agnostic Principle

The engine does not know about specific domains. It provides:
- A typed graph model
- A projection pipeline
- Navigation transitions
- An epistemic event lifecycle
- Structural invariant checks

The **world** provides:
- A schema (what node/edge types are valid)
- Seed data (initial graph content)
- Configuration (projection parameters, workbench policies)

This separation allows the same engine to power a documentation knowledge base, a research ontology, a codebase dependency graph, or any other domain where typed relationships between entities matter.

## Invariant System

Every architectural rule is expressed as a named, testable invariant:

- **KE1–KE5**: Knowledge substrate invariants (canonical-only graph, reject safety, event causality, idempotent evaluation, ViewModel stability)
- **PROJ**: Projection is pure — `P(G, F, Params) = P(G, F, Params)` always
- **NAV**: Navigation transitions are type-safe and reversible
- **Structural**: Graph integrity (unique IDs, no dangling edges, DAG containment, connectivity)

Invariants are not aspirational — they are enforced by tests that run on every commit.
