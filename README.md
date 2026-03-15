# Meaning Engine

A semantic graph engine that treats knowledge as a computable, projectable, navigable structure.

## The Problem

Knowledge systems typically store data as records or documents — flat structures that lose the relationships between ideas. When you need to understand how concepts connect, evolve, or depend on each other, traditional databases force you to reconstruct context manually.

## The Idea

Meaning Engine models knowledge as a **typed semantic graph** where:

- **Nodes** represent entities (concepts, specifications, evidence, code artifacts)
- **Edges** encode typed relationships (`defines`, `constrains`, `implements`, `depends_on`, ...)
- **Projection** computes what is visible from any point in the graph — focus + depth + filters → a coherent subgraph
- **Navigation** provides formal transitions (`select`, `drillDown`, `drillUp`, `reset`) with provable invariants
- **Operators** derive structural insights: trace paths, detect gaps, compare alternative explanations

The engine is **world-agnostic**: it doesn't know about your domain. You bring your own schema, seed data, and configuration. The engine provides the computational substrate.

## Quick Start

```bash
git clone https://github.com/utemix-org/meaning-engine.git
cd meaning-engine
npm install
npm test
```

## Demo: Documentation World

The repo includes a reference world — the engine's own documentation modeled as a graph (~80 nodes, ~120 edges, 8 node types, 11 edge types).

```bash
# Run structural analysis (centrality, bridges, cycles)
npm run demo:analysis

# Trace shortest path between two concepts
npm run demo:trace

# Compare rival explanatory paths
npm run demo:compare
```

Output artifacts are written to `worlds/documentation-world/analysis/` and `operators/`.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full breakdown.

```
src/                     Engine core
├── core/
│   ├── GraphModel       World-agnostic graph (nodes + links)
│   ├── projection/      Focus → visible subgraph → roles → ViewModel
│   ├── navigation/      Formal state transitions with invariants
│   ├── knowledge/       Epistemic substrate (propose → verify → canonicalize)
│   └── types/           Protocol types (node, edge, statement)
├── engine/              WorldAdapter, Schema, SpecificationReader
└── highlight/           Highlight model

operators/               Graph analysis operators
├── trace.js             Shortest-path trace or gap detection
├── compare.js           Rival path comparison + clustering
└── supports.js          Operator applicability checks

worlds/                  Reference worlds
└── documentation-world/ Engine docs as a semantic graph
```

## Key Invariants

The engine enforces named, testable invariants:

| ID | Rule |
|----|------|
| KE1 | Only canonical statements produce graph nodes |
| KE2 | Reject never mutates the graph |
| KE3 | Every graph change traces to an epistemic event |
| KE4 | Evaluate is idempotent |
| KE5 | Graph rebuild preserves ViewModel stability |
| NAV | Navigation transitions are reversible and type-safe |
| PROJ | Projection is a pure function of (graph, focus, params) |

## Tests

```bash
npm test              # ~530 tests, all engine + operator coverage
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

## License

[MIT](./LICENSE)
