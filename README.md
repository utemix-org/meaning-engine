# Meaning Engine

[![CI](https://github.com/utemix-org/meaning-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/utemix-org/meaning-engine/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/meaning-engine.svg)](https://www.npmjs.com/package/meaning-engine)
[![license](https://img.shields.io/npm/l/meaning-engine.svg)](https://github.com/utemix-org/meaning-engine/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/meaning-engine.svg)](https://nodejs.org)

A deterministic engine for graph-based engineering knowledge, with reproducible diagnostic operators and evidence-grounded report artifacts.

## Quick Start

```bash
git clone https://github.com/utemix-org/meaning-engine.git
cd meaning-engine
npm install
npm test    # all tests, all green
```

## Canonical Demo

**Question:** *"How is the Projection spec connected to the knowledge evaluation code?"*

```bash
node operators/runReasoningReport.js --baseline
```

**Expected output** (excerpt):

```
## documentation-world
Graph: 116 nodes, 292 edges

### ✓ Rival Explanations
- Route: PROJECTION_SPEC → evaluate.js
- Rival count: 13
- Clusters: 3
- Strength distribution: 1 invariant-passing, 2 concept-mediated, 10 code-dependency
> Strength: mixed (strongest + medium + weaker)

## authored-mini-world
Graph: 25 nodes, 27 edges

### ✓ Path Exists
- Route: Type Theory Overview → Coq Proof
- Result: PATH (3 hops)
> Strength: strong
> full epistemic chain: spec→concept→invariant→evidence
```

The report runs **4 scenarios** on **2 worlds** (extracted + authored): path discovery, directed boundaries, rival explanations, and gap detection with bridge candidates.

See also:
- `node operators/runDualWorldSmokeWorkflow.js` — raw dual-world baseline
- `node operators/runReasoningReport.js --world authored-mini-world --scenario rival_explanations` — filtered view

## Public Promise

This project publicly promises only the following:

- A documented [world input contract](./docs/WORLD_INPUT_FORMAT.md) (JSON seed files)
- A declared [public API surface](./docs/API_SURFACE_POLICY.md) with SemVer discipline
- Deterministic diagnostic operators over graph-structured worlds
- Reproducible CLI workflows and report artifacts with explicit evidence grounding

Meaning Engine does not promise general "thinking", full self-reflection, or universal internal understanding of arbitrary systems.

## The Idea

Meaning Engine models knowledge as a **typed semantic graph** where:

- **Nodes** represent entities (concepts, specifications, evidence, code artifacts)
- **Edges** encode typed relationships (`defines`, `constrains`, `implements`, `depends_on`, ...)
- **Projection** computes what is visible from any point in the graph
- **Navigation** provides formal transitions (`select`, `drillDown`, `drillUp`, `reset`)
- **Operators** derive structural insights: trace paths, detect gaps, compare rival explanations

The engine is **world-agnostic**: you bring your own graph, the engine provides the computational substrate.

## Stability

| Layer | Status |
|-------|--------|
| World input format (`seed.nodes.json` / `seed.edges.json`) | **stable** |
| Operators (`trace`, `compare`, `supports`) | **stable** |
| Projection pipeline (`projectGraph`) | **stable** |
| Navigation (`applyTransition`) | **stable** |
| Knowledge substrate (`propose` → `evaluate` → `buildGraph`) | **stable** |
| Engine facade (`MeaningEngine`, `WorldAdapter`, `Schema`) | **stable** |
| CLI workflows (`runReasoningReport`, `runWorldSmokeWorkflow`) | **stable** |
| LLMReflectionEngine, OWLProjection, GraphRAGProjection | **experimental** |
| Internal observer / cabin workflows | **experimental** |

See [API_SURFACE_POLICY.md](./docs/API_SURFACE_POLICY.md) for the full breakdown of what is covered by SemVer.

## Worlds

The repo ships with two reference worlds:

| World | Type | Nodes | Edges | Purpose |
|-------|------|-------|-------|---------|
| `documentation-world` | extracted | 116 | 292 | Engine docs as semantic graph |
| `authored-mini-world` | authored | 25 | 27 | Type Theory domain (stress test) |

To create your own world, see [MAKE_YOUR_FIRST_WORLD.md](./docs/MAKE_YOUR_FIRST_WORLD.md) and [WORLD_INPUT_FORMAT.md](./docs/WORLD_INPUT_FORMAT.md).

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full breakdown.

```
src/                     Engine core
├── core/
│   ├── GraphModel       World-agnostic graph (nodes + edges)
│   ├── projection/      Focus → visible subgraph → roles → ViewModel
│   ├── navigation/      Formal state transitions with invariants
│   ├── knowledge/       Epistemic substrate (propose → verify → canonicalize)
│   └── types/           Protocol types (node, edge, statement)
├── engine/              WorldAdapter, Schema, SpecificationReader
└── highlight/           Highlight model

operators/               Graph analysis operators
├── trace.js             Shortest-path trace or gap detection
├── compare.js           Rival path comparison + clustering
├── supports.js          Operator applicability checks + bridge candidates
├── runReasoningReport.js   CLI markdown report generator
└── runDualWorldSmokeWorkflow.js   Dual-world calibration runner

worlds/                  Reference worlds
├── documentation-world/ Engine docs as a semantic graph (extracted)
└── authored-mini-world/ Type Theory domain (authored)
```

## Key Invariants

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
npm test              # all tests
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

## Contributing

See [API_SURFACE_POLICY.md](./docs/API_SURFACE_POLICY.md) for the public/experimental/internal classification.

## License

[MIT](./LICENSE)
