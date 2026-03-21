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
| ViewModel stability after rebuild (KE5) | 6 tests; edge case gap noted | Medium-high |

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

### 2.3 Projection — strong evidence (core), partial (metadata invariants)

| Property | Tests | Confidence |
|----------|-------|------------|
| Determinism (INV-3) | 4+ tests across 4 test files (incl. 100-call loop) | High |
| Totality (INV-7) | 4 test cases (valid + 3 error paths) | High |
| 5-step pipeline correctness | Step-by-step tests in `projectGraph.test.js` | High |
| Schema conformance (INV-1) | No dedicated test | Low |
| Identity stability (INV-2) | No dedicated test | Low |
| Graph immutability (INV-4) | Enforced by design (pure functions), not by test | Low |

Evidence basis: `src/core/projection/__tests__/projectGraph.test.js` plus domain/workbench/character context test files.

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

### 3.1 Structural invariants (16 checkers, 0 dedicated tests)

`StructuralInvariants.js` implements 16 invariant checkers across 5 categories (Graph, Identity, Edge, Connectivity, Hierarchy). These are well-implemented pure functions, but:

- **No dedicated test file** for `StructuralInvariants.js`
- 5 checkers (G1–G3, I1–I2) are exercised indirectly via `ChangeProtocol.ProposalValidator` at `STRICTNESS.MINIMAL`
- 11 checkers (G4, I3–I4, E1–E3, C1–C3, H1–H2) have no known execution path in tests

**Risk:** A regression in any of these checkers would not be caught by CI.

### 3.2 Change Protocol (proposal → validate → apply)

`ChangeProtocol.js` implements managed graph mutation with history tracking. It composes `StructuralInvariants` and `GraphSnapshot`. However:

- **No dedicated test file** for `ChangeProtocol.js` or `ProposalValidator`
- The full proposal → validate → apply → history pipeline is not integration-tested
- `GraphSnapshot.js` immutability (`Object.freeze`) is not tested

**Risk:** The mutation control mechanism — arguably the most safety-critical component — has no direct test coverage.

### 3.3 Projection metadata invariants (INV-1, INV-2, INV-4)

`buildViewModel.js` declares these in its `satisfiedInvariants` metadata field, but they have no standalone tests:

- **INV-1 (Schema conformance):** ViewModel output conforms to a declared schema — no schema test
- **INV-2 (Identity stability):** Node identities are preserved through projection — no identity test
- **INV-4 (Graph immutability):** Projection does not mutate its input graph — no mutation test

These properties are enforced by design (pure functions, no mutation), but a defensive test would catch regressions.

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
| "ChangeProtocol is production-ready" | No test coverage |
| "Experimental modules are stable" | Explicitly marked experimental in API_SURFACE_POLICY.md |

---

## 5. Evidence gaps and suggested next proof artifacts

Listed in priority order based on risk and coverage impact.

### Critical (safety-relevant, no tests)

| # | Gap | Suggested artifact | Impact |
|---|-----|--------------------|--------|
| 1 | StructuralInvariants has no dedicated tests | `src/core/__tests__/StructuralInvariants.test.js` — test each of the 16 checker functions with valid and violation cases | 16 invariants gain direct evidence |
| 2 | ChangeProtocol has no tests | `src/core/__tests__/ChangeProtocol.test.js` — test proposal → validate → apply → history pipeline; test rejection on invariant violation; test simulate (dry-run) | Mutation safety gains direct evidence |
| 3 | GraphSnapshot immutability not tested | Test that `Object.freeze` is applied and mutation attempts throw | Snapshot integrity |

### Important (partially evidenced)

| # | Gap | Suggested artifact | Impact |
|---|-----|--------------------|--------|
| 4 | KE5 edge case: empty graph projection | Add assertion in `knowledgeInvariants.test.js` KE5 edge case that actually calls `projectGraph` on empty graph and checks `ok: false` | KE5 fully locked |
| 5 | INV-4 (graph immutability through projection) | Test that `projectGraph` input graph is unchanged after call | PROJ immutability proven |
| 6 | INV-1/INV-2 (schema conformance, identity stability) | Define and test ViewModel schema contract | PROJ metadata invariants promoted from intended to evidenced |

### Desirable (documentation gaps)

| # | Gap | Suggested artifact | Impact |
|---|-----|--------------------|--------|
| 7 | Highlight model has no tests | `src/highlight/__tests__/highlightModel.test.js` | Public API coverage |
| 8 | Cabin diagnostic pipeline evidence | Currently tracked separately in CABIN_CLAIM_POLICY.md — no overlap with this document | Experimental module |

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
