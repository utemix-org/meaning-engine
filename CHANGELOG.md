# Changelog

## v0.1.0 — First Architectural Cycle (2026-03-16)

Research snapshot. The engine core, operator stack, and reference worlds are functional and reproducible.

### Engine core (`src/`)
- `GraphModel` — world-agnostic graph (nodes + edges)
- `projection/` — focus → visible subgraph → semantic roles → ViewModel
- `navigation/` — formal transitions (select, drillDown, drillUp, reset) with invariants
- `knowledge/` — epistemic substrate (propose → verify → canonicalize)
- Named invariants: KE1–KE5, NAV, PROJ

### Operators (`operators/`)
- `trace.js` — directed BFS shortest-path or gap detection
- `compare.js` — rival path discovery + clustering + labeling
- `supports.js` — operator applicability checks (supportsInspect, supportsTrace, supportsCompare, supportsBridgeCandidates)
- `normalizeGraphByRedirects.js` — ADR-013 identity resolution
- `runReasoningReport.js` — CLI markdown report (2 worlds × 4 scenarios + strength rubric)
- `runDualWorldSmokeWorkflow.js` — dual-world calibration runner + JSON baseline

### Reference worlds (`worlds/`)
- `documentation-world/` — 116 nodes, 292 edges, extracted from engine's own docs and code
- `authored-mini-world/` — 25 nodes, 27 edges, Type Theory domain (manually authored stress test)

### Baseline artifacts
- `operators/dualWorldSmoke.baseline.json` — frozen dual-world scenario results
- 651 tests across 33 suites, all green
