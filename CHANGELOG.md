# Changelog

## Unreleased

### Changed
- **Version alignment (Variant A):** single-version policy — `package.json` is the sole source of truth; `ENGINE_VERSION` now reads from `package.json` at runtime; `specification.json` version synced
- **Truthful `.d.ts`:** `graph.d.ts` rewritten to match actual `GraphModel` runtime — `getNeighbors` returns `Set<string>`, `toJSON` returns `{nodes, links}`, constructor accepts `{nodes, links}`, `computeScope` returns `Set<string>`
- **Specification paths:** all `engine/src/...` paths in `specification.json` corrected to `src/engine/...`; spec marked as `experimental`

### Added
- `docs/VERSIONING.md` — single-version policy and bump procedure
- `docs/API_SURFACE_POLICY.md` — public/experimental/internal classification
- `scripts/check-versions.js` — CI-runnable version consistency check (`npm run check:versions`)
- `tsconfig.check.json` + `npm run check:types` — CI typecheck for `.d.ts` files
- Public promise and stability table in README

### Fixed
- `ENGINE_VERSION` was `0.7.0` while `package.json` was `0.1.2`
- `specification.json` version was `0.5.0` and all paths pointed to non-existent `engine/src/...`
- `.d.ts` types were lying about `getNeighbors` (claimed `NodeData[]`, actual `Set<string>`), `toJSON` shape, `computeScope` return type, and `GraphData` key name (`edges` vs `links`)

## v0.1.2 (2026-03-17)

### Added
- CI badges (CI status, npm version, license, Node.js version) in README
- `package-lock.json` for reproducible CI builds
- `engines: { node: ">=18" }` in `package.json`
- `types` entry in `package.json`
- Coverage generation step in CI (Node 20.x)
- `package-check` job in CI

### Changed
- Test files excluded from npm tarball via refined `files` field

## v0.1.1 (2026-03-17)

### Fixed
- npm publish tag set to `latest` for correct version resolution

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
