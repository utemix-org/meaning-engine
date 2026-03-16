# Documentation World — Analysis Report

Generated: 2026-03-16T09:27:27.585Z
Graph: 116 nodes, 276 edges

## D1. Centrality (Top-10)

| # | Title | Type | Degree | Betweenness | Score |
|---|-------|------|--------|-------------|-------|
| 1 | GraphModel.js | code_artifact | 10 | 1539.2 | 1549.2 |
| 2 | projectGraph.js | code_artifact | 21 | 971.67 | 992.7 |
| 3 | PROJECTION_SPEC | spec | 15 | 924.92 | 939.9 |
| 4 | KNOWLEDGE_LOG_SPEC | spec | 10 | 877.19 | 887.2 |
| 5 | buildGraph.js | code_artifact | 8 | 779.68 | 787.7 |
| 6 | LLMReflectionEngine.js | code_artifact | 6 | 666.84 | 672.8 |
| 7 | Workbench | concept | 12 | 576.43 | 588.4 |
| 8 | GraphModel | concept | 10 | 573.21 | 583.2 |
| 9 | Context | concept | 7 | 568.44 | 575.4 |
| 10 | Focus | concept | 10 | 564.73 | 574.7 |

## D2. Weak Bridges (Top-10 by edge betweenness)

| # | Node A | Node B | Betweenness | Cross-type |
|---|--------|--------|-------------|------------|
| 1 | GraphModel.js (code_artifact) | buildGraph.js (code_artifact) | 742.97 | no |
| 2 | GraphModel.js (code_artifact) | LLMReflectionEngine.js (code_artifact) | 732.31 | no |
| 3 | GraphModel.js (code_artifact) | index.js (code_artifact) | 612.45 | no |
| 4 | projectGraph.js (code_artifact) | Context Does Not Mutate Graph (invariant) | 509.5 | yes |
| 5 | buildGraph.js (code_artifact) | KNOWLEDGE_LOG_SPEC (spec) | 494.46 | yes |
| 6 | Context (concept) | Context Does Not Mutate Graph (invariant) | 460.15 | yes |
| 7 | resolveFocus.js (code_artifact) | Focus Preservation Rule (invariant) | 344.78 | yes |
| 8 | CatalogRegistry.js (code_artifact) | KNOWLEDGE_LOG_SPEC (spec) | 344.23 | yes |
| 9 | Schema.js (code_artifact) | GraphModel (concept) | 313.42 | yes |
| 10 | index.js (code_artifact) | SYSTEM_OVERVIEW (page) | 289.38 | yes |

## D3. Cycles (found: 0)

No cycles of length 3–6 detected in the directed graph.

## D4. Distance Anomalies (10 found)

1. **PROJECTION_SPEC** (spec) ↔ **index.js** (code_artifact) — distance: ∞ (unreachable)
2. **PROJECTION_SPEC** (spec) ↔ **WorldInterface.test.js** (code_artifact) — distance: ∞ (unreachable)
3. **PROJECTION_SPEC** (spec) ↔ **validate.js** (code_artifact) — distance: ∞ (unreachable)
4. **NAVIGATION_SPEC** (spec) ↔ **index.js** (code_artifact) — distance: ∞ (unreachable)
5. **NAVIGATION_SPEC** (spec) ↔ **WorldInterface.test.js** (code_artifact) — distance: ∞ (unreachable)
6. **NAVIGATION_SPEC** (spec) ↔ **validate.js** (code_artifact) — distance: ∞ (unreachable)
7. **KNOWLEDGE_LOG_SPEC** (spec) ↔ **index.js** (code_artifact) — distance: ∞ (unreachable)
8. **KNOWLEDGE_LOG_SPEC** (spec) ↔ **WorldInterface.test.js** (code_artifact) — distance: ∞ (unreachable)
9. **KNOWLEDGE_LOG_SPEC** (spec) ↔ **validate.js** (code_artifact) — distance: ∞ (unreachable)
10. **RENDER_SURFACES_SPEC** (spec) ↔ **index.js** (code_artifact) — distance: ∞ (unreachable)

## Missing Concept Candidates (1)

1. **evidence ↔ code_artifact** — No direct or concept-bridged path between evidence and code_artifact. Consider adding a bridging concept.
