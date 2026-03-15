# Documentation World — Analysis Report

Generated: 2026-03-14T10:02:10.843Z
Graph: 141 nodes, 307 edges

## D1. Centrality (Top-10)

| # | Title | Type | Degree | Betweenness | Score |
|---|-------|------|--------|-------------|-------|
| 1 | Focus Preservation Rule | invariant | 7 | 1677.85 | 1684.9 |
| 2 | GraphModel.js | code_artifact | 10 | 1534.2 | 1544.2 |
| 3 | viewModelStore.ts | code_artifact | 12 | 1208.47 | 1220.5 |
| 4 | projectGraph.js | code_artifact | 21 | 1083.47 | 1104.5 |
| 5 | PROJECTION_SPEC | spec | 15 | 920.25 | 935.3 |
| 6 | resolveFocus.js | code_artifact | 6 | 856.56 | 862.6 |
| 7 | Focus | concept | 10 | 693.48 | 703.5 |
| 8 | LLMReflectionEngine.js | code_artifact | 6 | 679.51 | 685.5 |
| 9 | Workbench | concept | 12 | 616.77 | 628.8 |
| 10 | Context | concept | 7 | 553.1 | 560.1 |

## D2. Weak Bridges (Top-10 by edge betweenness)

| # | Node A | Node B | Betweenness | Cross-type |
|---|--------|--------|-------------|------------|
| 1 | viewModelStore.ts (code_artifact) | Focus Preservation Rule (invariant) | 1107.3 | yes |
| 2 | resolveFocus.js (code_artifact) | Focus Preservation Rule (invariant) | 876.36 | yes |
| 3 | GraphModel.js (code_artifact) | LLMReflectionEngine.js (code_artifact) | 746.98 | no |
| 4 | GraphModel.js (code_artifact) | index.js (code_artifact) | 624.79 | no |
| 5 | projectGraph.js (code_artifact) | Context Does Not Mutate Graph (invariant) | 497.22 | yes |
| 6 | Context (concept) | Context Does Not Mutate Graph (invariant) | 481.68 | yes |
| 7 | GraphModel.js (code_artifact) | buildGraph.js (code_artifact) | 439.28 | no |
| 8 | GraphModel.js (code_artifact) | projectGraph.test.js (code_artifact) | 394.28 | no |
| 9 | Focus (concept) | Focus Preservation Rule (invariant) | 374.24 | yes |
| 10 | ViewModel (concept) | PROJECTION_SPEC (spec) | 348.02 | yes |

## D3. Cycles (found: 0)

No cycles of length 3–6 detected in the directed graph.

## D4. Distance Anomalies (10 found)

1. **PROJECTION_SPEC** (spec) ↔ **index.js** (code_artifact) — distance: ∞ (unreachable)
2. **PROJECTION_SPEC** (spec) ↔ **CatalogLoader.js** (code_artifact) — distance: ∞ (unreachable)
3. **PROJECTION_SPEC** (spec) ↔ **CatalogRegistry.js** (code_artifact) — distance: ∞ (unreachable)
4. **PROJECTION_SPEC** (spec) ↔ **index.js** (code_artifact) — distance: ∞ (unreachable)
5. **PROJECTION_SPEC** (spec) ↔ **OperatorEngine.js** (code_artifact) — distance: ∞ (unreachable)
6. **PROJECTION_SPEC** (spec) ↔ **Schema.js** (code_artifact) — distance: ∞ (unreachable)
7. **PROJECTION_SPEC** (spec) ↔ **SpecificationReader.js** (code_artifact) — distance: ∞ (unreachable)
8. **PROJECTION_SPEC** (spec) ↔ **WorldAdapter.js** (code_artifact) — distance: ∞ (unreachable)
9. **PROJECTION_SPEC** (spec) ↔ **WorldInterface.js** (code_artifact) — distance: ∞ (unreachable)
10. **PROJECTION_SPEC** (spec) ↔ **CatalogLoader.test.js** (code_artifact) — distance: ∞ (unreachable)

## Missing Concept Candidates (0)

All type clusters are connected directly or through concept nodes.
