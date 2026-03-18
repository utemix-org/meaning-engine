# API Surface Policy

This document defines what is covered by SemVer, what is experimental, and what is internal.

See also: [VERSIONING.md](./VERSIONING.md) for the single-version policy.

## Versioning (0.y.z)

`package.json` is the single source of truth for the project version (Variant A).

During `0.y.z` development, the following rules apply:

- **Minor bumps** (`0.y.0`) may contain breaking changes to public API.
- **Patch bumps** (`0.x.z`) contain fixes, docs, and non-breaking additions only.
- Once `1.0.0` is reached, standard SemVer rules will apply.

## Public API (SemVer-covered)

The following are the declared public surface. Breaking changes to these require a minor version bump and a CHANGELOG entry.

### World input contract

- `seed.nodes.json` / `seed.edges.json` format as described in [WORLD_INPUT_FORMAT.md](./WORLD_INPUT_FORMAT.md)
- Node required fields: `id`, `type`, `title`
- Edge required fields: `source`, `target`, `type`

### Operators

| Export | Module | Description |
|--------|--------|-------------|
| `trace(graph, fromId, toId, options?)` | `operators/trace.js` | Directed BFS shortest-path or gap detection |
| `compare(graph, fromId, toId, options?)` | `operators/compare.js` | Rival path discovery + clustering |
| `supportsInspect(graph, context?)` | `operators/supports.js` | Operator applicability check |
| `supportsTrace(graph, context?)` | `operators/supports.js` | Operator applicability check |
| `supportsCompare(graph, fromId, toId, context?)` | `operators/supports.js` | Operator applicability check |
| `supportsBridgeCandidates(graph, fromId, toId, context?)` | `operators/supports.js` | Operator applicability check |
| `rankBridgeCandidates(gap, graph)` | `operators/supports.js` | Bridge candidate ranking |
| `findRivalTraces(graph, fromId, toId, options?)` | `operators/supports.js` | All shortest paths (undirected) |

### Core modules (package exports)

| Export path | Entry point | Status |
|-------------|-------------|--------|
| `meaning-engine` | `src/index.js` | public |
| `meaning-engine/core` | `src/core/index.js` | public |
| `meaning-engine/projection` | `src/core/projection/index.js` | public |
| `meaning-engine/navigation` | `src/core/navigation/index.js` | public |
| `meaning-engine/engine` | `src/engine/index.js` | public |
| `meaning-engine/highlight` | `src/highlight/highlightModel.js` | public |

### Core classes and functions (public)

| Symbol | Module | Description |
|--------|--------|-------------|
| `GraphModel` | `src/core/GraphModel.js` | World-agnostic graph (nodes + edges) |
| `projectGraph` | `src/core/projection/projectGraph.js` | Projection pipeline entry point |
| `applyTransition` | `src/core/navigation/applyTransition.js` | Navigation state transitions |
| `select`, `drillDown`, `drillUp`, `reset` | `src/core/navigation/applyTransition.js` | Transition factories |
| `evaluate` | `src/core/knowledge/evaluate.js` | Evaluate epistemic log |
| `buildGraphFromStatements` | `src/core/knowledge/buildGraph.js` | Build graph from canonical statements |
| `propose`, `verify`, `approve`, `reject` | `src/core/knowledge/operators.js` | Knowledge lifecycle operators |
| `MeaningEngine` | `src/engine/index.js` | Engine facade |
| `WorldAdapter` | `src/engine/WorldAdapter.js` | World loading adapter |
| `Schema` | `src/engine/Schema.js` | Schema validation |

### CLI workflows (public)

| Command | Description |
|---------|-------------|
| `node operators/runReasoningReport.js --baseline` | Markdown reasoning report |
| `node operators/runWorldSmokeWorkflow.js <path>` | Custom world smoke test |
| `node operators/runDualWorldSmokeWorkflow.js` | Dual-world calibration |

## Experimental

The following are present in the repository and may be exported, but are **not** covered by SemVer guarantees. They may change or be removed without notice.

| Symbol | Module | Reason |
|--------|--------|--------|
| `LLMReflectionEngine` | `src/core/LLMReflectionEngine.js` | No tests, no docs, no public demo |
| `OWLProjection` | `src/core/OWLProjection.js` | No tests, no docs |
| `GraphRAGProjection` | `src/core/GraphRAGProjection.js` | No tests, no docs |
| `ReflectiveProjection` | `src/core/ReflectiveProjection.js` | No tests, no docs |
| `OwnershipGraph` | `src/core/OwnershipGraph.js` | No tests, no docs |
| `PerformanceAuditor` | `src/core/PerformanceAudit.js` | Utility, not core contract |
| `CanonicalGraphSchema` | `src/core/CanonicalGraphSchema.js` | Empty type sets, design TBD |
| `DevProjection` | `src/core/DevProjection.js` | Internal development tool |
| `cabinDiagnose(input, world, questions)` | `src/cabin/index.js` | Deterministic diagnostic pass v1; no LLM |
| `matchDiagnosis(diagnosis, expected, caseId)` | `src/cabin/matcher.js` | Eval case matching layer |
| Workbench/character/domain projection modes | `src/core/projection/computeVisibleSubgraph.js` | Undocumented, untested as public API |

## Internal

The following are implementation details and should not be relied upon:

- All `__tests__/` directories
- `operators/__tests__/`, `operators/*.examples.json`, `operators/*.baseline.json`
- `worlds/*/tools/`, `worlds/*/analysis/`
- `specification/` directory
- File-level caching in operator modules (e.g., `_nodes`/`_edges` in `trace.js`)

## Deprecated

| Symbol | Context | Replacement |
|--------|---------|-------------|
| `links` key in `GraphModel` constructor | `new GraphModel({ nodes, links })` | Use `edges` instead. `links` still accepted as input alias but will be removed in a future minor. |
| `links` key in `toJSON()` output | Was `{ nodes, links }` | Now `{ nodes, edges }`. No backward-compatibility shim on output. |

## Policy for promoting experimental → public

An experimental module becomes public when it has:

1. At least one test suite covering its primary function
2. A description in this document or API reference
3. A CHANGELOG entry announcing promotion
4. A stable result shape that can be covered by SemVer
