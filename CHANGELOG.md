# Changelog

## Unreleased

### Changed
- **Canonical edge key: `edges`** — `GraphModel` constructor now accepts `edges` as the canonical key; `links` remains as a deprecated legacy alias at the constructor boundary only
- **`toJSON()` output shape:** now returns `{ nodes, edges }` (was `{ nodes, links }`) and **preserves `type` and `layer`** on edges (previously dropped)
- **`getNeighbors` unified:** returns `Set<string>` (node IDs) consistently across `GraphModel`, `WorldAdapter`, and `MeaningEngine`; previously `WorldAdapter` returned `NodeData[]`
- **Added `getNeighborNodes(nodeId)`:** convenience method returning `NodeData[]` on `GraphModel`, `WorldAdapter` graph, and `MeaningEngine`
- **Directedness policy:** edges stored directed (source → target); neighbor index is undirected; operators choose traversal mode
- **Version alignment (Variant A):** single-version policy — `package.json` is the sole source of truth; `ENGINE_VERSION` now reads from `package.json` at runtime; `specification.json` version synced
- **Specification paths:** all `engine/src/...` paths in `specification.json` corrected to `src/engine/...`; spec marked as `experimental`

### Docs
- **ARCHITECTURE.md truthfulness sweep:** formula marked as explanatory framing (not formally proven); `links` → `edges` terminology; outdated doc-world counts corrected (116/292); Graph Contract table added; spec marked experimental; overclaims softened
- **README.md:** `nodes + links` → `nodes + edges`; removed hardcoded test count
- **EPISTEMIC_LOG.md:** formula marked as explanatory framing
- **API_SURFACE_POLICY.md:** `links` added to Deprecated section with migration guidance

### Track B Foundations
- `docs/QUESTION_FORMAT.md` — canonical question schema (id, status, issue_type, severity, prompt, evidence_refs, expected_output_shape)
- `docs/ISSUE_TAXONOMY.md` — 10 tension classes derived from Phase 2 Audit findings, with severity mapping and code prefixes
- `docs/TENSION_EMBEDDING_POLICY.md` — questions-as-metadata vs tensions-embedded-in-graph-relief; 6 tension patterns; embedding rules; Tension Set v1 (5 classes with materialization examples)
- `questions/tension-set-v1.json` — 5 sample question instances covering doc_runtime_mismatch, type_contract_drift, vocabulary_ambiguity, unsupported_claim, missing_bridge

### Track B Provider Calibration v1 (DeepSeek via OpenRouter)
- `src/cabin/adapters/deepseek.js` — DeepSeek direct adapter (OpenAI-compatible API)
- `src/cabin/adapters/openrouter.js` — OpenRouter adapter (provider-agnostic routing, DeepSeek default)
- `eval/cabin_grades/openrouter.json` — first real model calibration: QD 4/4 pass, GR 1/4 pass (5/8 total)
- `eval/cabin_grades/deepseek.json` — DeepSeek direct: 0/8 (402 Insufficient Balance — adapter functional, account empty)
- `docs/CABIN_CLAIM_POLICY.md` — upgraded to v3 with measured model claims, failure pattern analysis, observed GR weaknesses
- `docs/MODEL_ADAPTER_BOUNDARY.md` — adapter table updated with deepseek and openrouter entries
- Key finding: question-driven mode is model-ready (100%); graph-relief mode needs prompt/context improvement (25%)

### Track B Cabin Scoring / Calibration v2
- `docs/CABIN_SCORING_RUBRIC.md` — 7 quality dimensions (D1–D7), grading scale (pass/weak_pass/fail/structured_wrong/parse_fail), failure pattern catalog
- `docs/CABIN_CLAIM_POLICY.md` — measured claim policy: allowed/prohibited/conditional claims based on calibration evidence
- `eval/cabin_grades/` — per-adapter grade files: deterministic (8/8 pass), stub (4/8, 4 structured_wrong on GR), openrouter (5/8, 2 structured_wrong on GR)
- `eval/runCabinCalibrationReport.js` — multi-adapter calibration runner with comparison matrix, grade summaries, failure pattern counts; `--save` writes JSON report
- `reports/cabin-calibration-v2.json` — serialized calibration snapshot

### Track B Model Adapter Boundary (P1.B8)
- `src/cabin/adapters/` — provider-agnostic adapter interface: `ModelAdapter`, `ModelRequest`, `ModelResponse`, `DiagnosisEnvelope`
- `src/cabin/adapters/stub.js` — stub adapter for pipeline testing without credentials
- `src/cabin/adapters/openai.js` — OpenAI adapter (gpt-4o-mini, json_object response format, temperature=0)
- `src/cabin/adapters/deepseek.js` — DeepSeek adapter (deepseek-chat, direct API)
- `src/cabin/adapters/openrouter.js` — OpenRouter adapter (provider-agnostic routing via OpenAI-compatible API)
- `src/cabin/context.js` — `buildCabinContext()`: deterministic, size-limited context assembly (system prompt + world summary + question/probe)
- `src/cabin/normalize.js` — `normalizeCabinOutput()`: strict envelope parser with explicit `_parse_error` diagnostics on failure
- `src/cabin/index.js` — `cabinDiagnoseModelBacked()`: 3-phase pipeline (context → invoke → normalize), same `CabinDiagnosis[]` contract
- `eval/runCabinEvalDiagnosticPass.js` — updated with `--model <name>` and `--trace` flags; runs deterministic baseline or model-backed mode through same matcher
- `docs/MODEL_ADAPTER_BOUNDARY.md` — pipeline diagram, adapter interface, secrets policy, running instructions
- Secrets via ENV only (`CABIN_OPENAI_API_KEY`); safe default: no key = mode unavailable, `npm test` unaffected

### Track B Cabin Module v1
- `src/cabin/index.js` — cabin module with `cabinDiagnose()`: deterministic rule-based diagnostic pass (question-driven + graph-relief-driven modes), no LLM
- `src/cabin/matcher.js` — `matchDiagnosis()`: structured comparison of cabin output vs eval case expected shape (issue_type, severity, claim, evidence_refs)
- `src/cabin/types.d.ts` — TypeScript types: `CabinInput`, `CabinDiagnosis`, `EvidenceRef`, `MatchResult`
- `docs/CABIN_INTERFACE.md` — cabin interface spec: inputs, outputs, determinism contract, matching rules, LLM adapter boundary
- `eval/runCabinEvalDiagnosticPass.js` — diagnostic pass runner: cabin produces diagnosis objects, matcher validates against golden cases (8/8 pass)
- `docs/API_SURFACE_POLICY.md` — cabin listed as experimental module

### Track B Cabin Eval Harness v1
- `docs/CABIN_EVAL.md` — eval framework spec: two modes (question-driven, graph-relief-driven), two levels (structural pass, diagnostic pass), scoring dimensions, pass/fail criteria
- `eval/cabin_cases/README.md` — case schema (case_id, mode, world_ref, input, expected, structural_checks)
- `eval/cabin_cases/golden_v1.json` — 8 golden cases: 4 question-driven (DRM, TCD, VOC, USC) + 4 graph-relief-driven (DRM, TCD, USC, MBR)
- `eval/runCabinEvalStub.js` — deterministic stub runner: loads world, verifies structural observability, prints pass/fail report (8/8 pass without LLM)

### Track B Demo/Test World
- `worlds/tension-test-world/` — intentional world (14 nodes, 14 edges) materializing all 5 Tension Set v1 classes as graph relief
- Tension edge types: `drift_against` (DRM), `contradicts` (TCD); structural absence: no `same_as` (VOC), no `proved_by` (USC), isolated node (MBR)
- `operators/runTensionSmokeCheck.js` — structural observability smoke check (5/5 detected)
- `questions/tension-set-v1.json` — updated with `graph_refs`, `world`, and `structural_signal` bindings to tension-test-world

### Added
- `docs/VERSIONING.md` — single-version policy and bump procedure
- `docs/API_SURFACE_POLICY.md` — public/experimental/internal classification
- `scripts/check-versions.js` — CI-runnable version consistency check (`npm run check:versions`)
- `tsconfig.check.json` + `npm run check:types` — CI typecheck for `.d.ts` files
- Public promise and stability table in README

### Fixed
- `toJSON()` round-trip no longer loses edge `type` and `layer`
- `ENGINE_VERSION` was `0.7.0` while `package.json` was `0.1.2`
- `specification.json` version was `0.5.0` and all paths pointed to non-existent `engine/src/...`
- `.d.ts` types aligned with runtime for `getNeighbors`, `toJSON`, `computeScope`, constructor input, and edge shape

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
