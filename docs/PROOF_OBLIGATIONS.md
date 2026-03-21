# Proof Obligations

This document describes what Meaning Engine claims, what evidence currently supports those claims, what is not proven, and where future evidence is needed.

For the full invariant-by-invariant breakdown, see [INVARIANT_MATRIX.md](./INVARIANT_MATRIX.md).

---

## 1. What the project claims

Meaning Engine's public promise (from [README.md](../README.md)) is:

1. A documented **world input contract** (JSON seed files with required fields)
2. A declared **public API surface** with SemVer discipline
3. **Deterministic** diagnostic operators over graph-structured worlds
4. **Reproducible** CLI workflows and report artifacts with explicit evidence grounding

These claims decompose into verifiable properties at three levels:

| Level | What it means | How it is checked |
|-------|--------------|-------------------|
| **Deterministic behavior** | Same inputs always produce the same output; no hidden state, no randomness | Unit tests with repeated execution (100-call loops, idempotency checks) |
| **Documented contract** | Public API shape, input/output formats, SemVer boundaries | API_SURFACE_POLICY.md + WORLD_INPUT_FORMAT.md + type declarations |
| **Structural integrity** | Graph invariants hold before and after any operation | StructuralInvariants.js checker functions |

---

## 2. What is currently proven (by tests)

### 2.1 Knowledge substrate — strong evidence

The epistemic pipeline (`propose → verify → approve/reject → evaluate → buildGraph`) is the most thoroughly tested subsystem.

| Property | Tests | Confidence |
|----------|-------|------------|
| Canonical-only graph build (KE1) | 7 tests across 4 test files | High |
| Reject safety (KE2) | 5 tests across 3 test files | High |
| Event causality (KE3) | 5 tests across 3 test files | High |
| Idempotent evaluation (KE4) | 3 tests across 2 test files | High |
| ViewModel stability after rebuild (KE5) | 7 tests; edge case closed in B3 | High |

Evidence basis: `src/core/knowledge/__tests__/knowledgeInvariants.test.js` contains dedicated KE1–KE5 tests. Additional coverage in `evaluate.test.js`, `buildGraph.test.js`, `reviewWorkflow.test.js`, `verificationWorkflow.test.js`, `endToEnd.test.js`.

### 2.2 Navigation — strong evidence

| Property | Tests | Confidence |
|----------|-------|------------|
| Valid focus from valid transition (NAV-1) | 7 test cases | High |
| DrillDown/DrillUp reversibility (NAV-2) | 3 test cases | High |
| History path integrity (NAV-3) | 5 test cases | High |
| Navigation determinism (NAV-4) | 3 tests (incl. 100-call loop) | High |
| Navigation–Projection compatibility (NAV-5) | 5 test cases (full sequence) | High |

Evidence basis: `src/core/navigation/__tests__/applyTransition.test.js` — dedicated NAV-1 through NAV-5 describe blocks.

### 2.3 Projection — strong evidence

| Property | Tests | Confidence |
|----------|-------|------------|
| Determinism (INV-3) | 4+ tests across 4 test files (incl. 100-call loop) | High |
| Totality (INV-7) | 4 test cases (valid + 3 error paths) | High |
| 5-step pipeline correctness | Step-by-step tests in `projectGraph.test.js` | High |
| Schema conformance (INV-1) | 15 tests in `projectionMetadata.test.js` | High |
| Identity stability (INV-2) | 9 tests in `projectionMetadata.test.js` | High |
| Graph immutability (INV-4) | 7 tests in `projectionMetadata.test.js` | High |

Evidence basis: `src/core/projection/__tests__/projectGraph.test.js`, `projectionMetadata.test.js`, plus domain/workbench/character context test files.

### 2.4 Operators — strong evidence

| Property | Tests | Confidence |
|----------|-------|------------|
| Trace: deterministic, directed BFS | `documentationWorldTrace.test.js` | High |
| Compare: deterministic, no ranking | `documentationWorldCompare.test.js` | High |
| Supports: applicability checks | `documentationWorldOperatorSupports.test.js` | High |
| Report: deterministic, no graph mutation | `reasoningReport.test.js` | High |
| Dual-world smoke: baseline matching | `dualWorldSmoke.test.js` | High |

### 2.5 Engine layer — strong evidence

| Property | Tests | Confidence |
|----------|-------|------------|
| WorldAdapter contract | `WorldAdapter.test.js` | High |
| Schema validation | `Schema.test.js` | High |
| MeaningEngine facade | `MeaningEngine.test.js` | High |
| WorldInterface contract | `WorldInterface.test.js` | High |
| CatalogRegistry validation | `CatalogRegistry.test.js` | High |
| World-agnostic (no hardcoded types) | Explicit anti-pattern tests | High |

---

## 3. What is documented but not fully proven

### ~~3.1 Structural invariants~~ — CLOSED in B2

All 16 checkers now have dedicated tests (48 tests in `StructuralInvariants.test.js`). Status upgraded from intended/partially evidenced to **evidenced**.

### ~~3.2 Change Protocol~~ — CLOSED in B2

Full pipeline tested (36 tests in `ChangeProtocol.test.js`): happy path, rejection, simulate, history, strictness. Four bugs discovered and fixed in `ProposalValidator` (see INVARIANT_MATRIX.md for details). Status upgraded to **evidenced**.

### ~~3.3 Projection metadata invariants (INV-1, INV-2, INV-4)~~ — CLOSED in B3

All three projection metadata invariants now have dedicated tests (32 tests in `projectionMetadata.test.js`):

- **INV-1 (Schema conformance):** 15 tests verify ViewModel structure: top-level keys, VisualNode/VisualEdge fields and types, panels/navigation/meta/system structure, `satisfiedInvariants` content, and `transitions`.
- **INV-2 (Identity stability):** 9 tests verify ID preservation: all source IDs appear in output, IDs not transformed, edge references valid, focused node matches input, stability across repeated projections, breadcrumb/path IDs match.
- **INV-4 (Graph immutability):** 7 tests verify input graph is unchanged: node/edge counts, deep property comparison, immutability after multiple projections with different foci, immutability on error path.

### 3.4 Highlight model

`src/highlight/highlightModel.js` documents itself as a pure function with no side effects, but has no test file. It is part of the public API (`meaning-engine/highlight` export path).

---

## 4. What is not claimed (and should not be)

Per [POSITIONING_MEMO.md](./POSITIONING_MEMO.md) and the README:

| Not claimed | Why |
|-------------|-----|
| "Engine understands knowledge" | No evidence of understanding — engine applies typed operations |
| "Operators generalize to arbitrary graphs" | Only tested on 2 reference worlds |
| "Projection handles all edge cases" | Empty graphs, disconnected components not fully tested |
| "ChangeProtocol is production-ready" | Tested but experimental; schema-dependent checkers use empty default types |
| "Experimental modules are stable" | Explicitly marked experimental in API_SURFACE_POLICY.md |

---

## 5. Evidence gaps and suggested next proof artifacts

Listed in priority order based on risk and coverage impact.

### ~~Critical~~ — CLOSED in B2

Gaps #1 (StructuralInvariants) and #2 (ChangeProtocol) are now closed with dedicated test suites. See B2 PR for details.

### ~~Important~~ — CLOSED in B3

Gaps #1–#4 are now closed:

- **#1 GraphSnapshot immutability:** 62 tests in `GraphSnapshot.test.js` cover creation, `Object.freeze` behavior (snapshot/nodes/edges/metadata all frozen, mutation attempts throw), accessors, statistics, serialization round-trip, `diffSnapshots`, and `SnapshotHistory`.
- **#2 KE5 edge case:** Updated test now calls `projectGraph` on empty graph and asserts `{ ok: false, errors: ['graph has no nodes'] }`.
- **#3 INV-4 (graph immutability):** 7 tests in `projectionMetadata.test.js` verify input graph unchanged after projection.
- **#4 INV-1/INV-2:** 24 tests in `projectionMetadata.test.js` verify ViewModel schema and identity preservation.

### Desirable (documentation gaps)

| # | Gap | Suggested artifact | Impact |
|---|-----|--------------------|--------|
| 1 | Highlight model has no tests | `src/highlight/__tests__/highlightModel.test.js` | Public API coverage |
| 2 | Cabin diagnostic pipeline evidence | Currently tracked separately in CABIN_CLAIM_POLICY.md — no overlap with this document | Experimental module |

---

## 6. Source-of-truth rule

When evidence conflicts:

1. **Current test behavior** is the strongest evidence
2. **Current code behavior** overrides older documentation
3. **Documentation** (README, ARCHITECTURE, this file) is explanatory framing, not normative

This rule applies to all claims in this document and in [INVARIANT_MATRIX.md](./INVARIANT_MATRIX.md).

---

## 7. How to update this document

1. When adding a new invariant: add it to INVARIANT_MATRIX.md first, then assess its evidence here
2. When adding tests for a gap: update the evidence status in INVARIANT_MATRIX.md and remove the gap from this document
3. Never upgrade a "not proven" item to "proven" without a passing test in CI
4. Record the commit SHA of evidence changes in commit messages
