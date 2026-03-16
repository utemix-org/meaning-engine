# Documentation World — Analysis Report

Generated: 2026-03-16T09:50:16.922Z
Graph: 116 nodes, 292 edges

## D1. Centrality (Top-10)

| # | Title | Type | Degree | Betweenness | Score |
|---|-------|------|--------|-------------|-------|
| 1 | index.js | code_artifact | 17 | 1398.12 | 1415.1 |
| 2 | SYSTEM_OVERVIEW | page | 10 | 918.12 | 928.1 |
| 3 | PROJECTION_SPEC | spec | 15 | 879.52 | 894.5 |
| 4 | index.js | code_artifact | 4 | 810.72 | 814.7 |
| 5 | index.js | code_artifact | 10 | 777.57 | 787.6 |
| 6 | projectGraph.js | code_artifact | 21 | 760.74 | 781.7 |
| 7 | Context | concept | 7 | 601.92 | 608.9 |
| 8 | Workbench | concept | 12 | 596.3 | 608.3 |
| 9 | Focus | concept | 10 | 597.59 | 607.6 |
| 10 | KNOWLEDGE_LOG_SPEC | spec | 10 | 567.37 | 577.4 |

## D2. Weak Bridges (Top-10 by edge betweenness)

| # | Node A | Node B | Betweenness | Cross-type |
|---|--------|--------|-------------|------------|
| 1 | index.js (code_artifact) | index.js (code_artifact) | 745.62 | no |
| 2 | index.js (code_artifact) | SYSTEM_OVERVIEW (page) | 496.35 | yes |
| 3 | index.js (code_artifact) | index.js (code_artifact) | 404.1 | no |
| 4 | index.js (code_artifact) | index.js (code_artifact) | 379.97 | no |
| 5 | Context (concept) | SYSTEM_OVERVIEW (page) | 365.79 | yes |
| 6 | projectGraph.js (code_artifact) | Context Does Not Mutate Graph (invariant) | 355.6 | yes |
| 7 | Context (concept) | Context Does Not Mutate Graph (invariant) | 318.56 | yes |
| 8 | resolveFocus.js (code_artifact) | Focus Preservation Rule (invariant) | 296.05 | yes |
| 9 | Context (concept) | Workbench (concept) | 291 | no |
| 10 | index.js (code_artifact) | SYSTEM_OVERVIEW (page) | 288.53 | yes |

## D3. Cycles (found: 0)

No cycles of length 3–6 detected in the directed graph.

## D4. Distance Anomalies (10 found)

1. **PROJECTION_SPEC** (spec) ↔ **validate.js** (code_artifact) — distance: ∞ (unreachable)
2. **NAVIGATION_SPEC** (spec) ↔ **validate.js** (code_artifact) — distance: ∞ (unreachable)
3. **KNOWLEDGE_LOG_SPEC** (spec) ↔ **validate.js** (code_artifact) — distance: ∞ (unreachable)
4. **RENDER_SURFACES_SPEC** (spec) ↔ **validate.js** (code_artifact) — distance: ∞ (unreachable)
5. **RENDER_SURFACES_SPEC** (spec) ↔ **CanonicalGraphSchema.js** (code_artifact) — distance: 7
6. **RENDER_SURFACES_SPEC** (spec) ↔ **ChangeProtocol.js** (code_artifact) — distance: 6
7. **RENDER_SURFACES_SPEC** (spec) ↔ **DevProjection.js** (code_artifact) — distance: 6
8. **RENDER_SURFACES_SPEC** (spec) ↔ **GraphRAGProjection.js** (code_artifact) — distance: 6
9. **RENDER_SURFACES_SPEC** (spec) ↔ **GraphSnapshot.js** (code_artifact) — distance: 6
10. **RENDER_SURFACES_SPEC** (spec) ↔ **Identity.js** (code_artifact) — distance: 6

## Missing Concept Candidates (1)

1. **evidence ↔ code_artifact** — No direct or concept-bridged path between evidence and code_artifact. Consider adding a bridging concept.
