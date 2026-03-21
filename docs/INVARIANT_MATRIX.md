# Invariant Matrix

This document maps every named invariant in Meaning Engine to its definition, enforcement mechanism, and evidence basis.

**Evidence status definitions:**

| Status | Meaning |
|--------|---------|
| **evidenced** | Dedicated tests verify this invariant; it passes in CI |
| **partially evidenced** | Tested indirectly or with known gaps in coverage |
| **intended** | Documented or implemented but no dedicated tests yet |

---

## KE — Knowledge Evolution Invariants

Subsystem: `src/core/knowledge/`
Defined in: [README.md](../README.md), [EPISTEMIC_LOG.md](../EPISTEMIC_LOG.md), [ARCHITECTURE.md](../ARCHITECTURE.md)

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| KE1 | Only canonical statements produce graph nodes | Test suite | `knowledgeInvariants.test.js` — "KE1: only canonical statements build the graph"; `buildGraph.test.js` — "only canonical statements enter the graph"; `reviewWorkflow.test.js` — RW2, RW6; `verificationWorkflow.test.js` — VW2; `endToEnd.test.js` — "rejected statements do not appear in graph" | **evidenced** |
| KE2 | Reject never mutates the graph | Test suite | `knowledgeInvariants.test.js` — "KE2: reject does not affect the graph"; `verificationWorkflow.test.js` — VW4; `reviewWorkflow.test.js` — RW4, RW5; `endToEnd.test.js` | **evidenced** |
| KE3 | Every graph change traces to an epistemic event | Test suite + architecture | `knowledgeInvariants.test.js` — "KE3: approve deterministically adds to the graph"; `reviewWorkflow.test.js` — RW3, RW6; `verificationWorkflow.test.js` — VW3; `endToEnd.test.js` — "incremental log"; pipeline enforced by `evaluate()` → `getCanonicalStatements()` → `buildGraphFromStatements()` | **evidenced** |
| KE4 | Evaluate is idempotent | Test suite | `knowledgeInvariants.test.js` — "KE4: repeated evaluate(log) is stable"; `evaluate.test.js` — "approve on already canonical → idempotent", "determinism: same log evaluated twice → identical result" | **evidenced** |
| KE5 | Graph rebuild preserves ViewModel stability | Test suite (partial) | `knowledgeInvariants.test.js` — "KE5: projection remains total after any valid event sequence", edge case test; `verificationWorkflow.test.js` — VW11; `reviewWorkflow.test.js` — RW7; `buildGraph.test.js` — "graph from statements passes projectGraph"; `endToEnd.test.js` — full cycle | **partially evidenced** |

### KE5 evidence gap

The KE5 edge case test ("empty canonical set → projection on empty graph still total") asserts that `buildGraphFromStatements([])` yields an empty graph but does not call `projectGraph` on it. Meanwhile, `validateInputs.js` rejects empty graphs (`"graph has no nodes"`), so `projectGraph` on an empty graph returns `{ ok: false }`. The invariant holds for non-empty graphs; the edge case boundary is documented but not fully tested.

---

## NAV — Navigation Invariants

Subsystem: `src/core/navigation/`
Defined in: [README.md](../README.md), [ARCHITECTURE.md](../ARCHITECTURE.md), `applyTransition.js` (lines 15–19)

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| NAV-1 | Valid transition produces valid focus | Test suite | `applyTransition.test.js` — "NAV-1: Valid transition produces valid focus" (select valid, select nonexistent, drillDown valid, drillDown from empty, drillDown nonexistent, drillUp, reset) | **evidenced** |
| NAV-2 | DrillDown / DrillUp reversibility | Test suite | `applyTransition.test.js` — "NAV-2: DrillDown/DrillUp reversibility" (down+up restores, two down/two up, down→select→up) | **evidenced** |
| NAV-3 | History integrity | Test suite | `applyTransition.test.js` — "NAV-3: History integrity" (drillDown adds to path, drillUp removes, select unchanged, reset clears, path length +1) | **evidenced** |
| NAV-4 | Navigation determinism | Test suite | `applyTransition.test.js` — "NAV-4: Navigation determinism" (same focus+transition → same result, 100 repeated calls, all transition types) | **evidenced** |
| NAV-5 | Navigation → Projection compatibility | Test suite | `applyTransition.test.js` — "NAV-5: Navigation → Projection compatibility" (after select/drillDown/drillUp/reset, `projectGraph` yields valid ViewModel) | **evidenced** |

---

## PROJ — Projection Invariants

Subsystem: `src/core/projection/`
Defined in: [README.md](../README.md), [ARCHITECTURE.md](../ARCHITECTURE.md), `projectGraph.js` (lines 18–22), `buildViewModel.js` (lines 117–130)

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| INV-3 | Projection determinism: same `(graph, focus, params)` → same ViewModel | Test suite | `projectGraph.test.js` — "INV-3: Projection Determinism" (no focus, alice, root/depth 2, 100 repeated calls); `domainProjection.test.js` — Theorem 7; `workbenchProjection.test.js` — Theorem 4; `characterContext.test.js` — Theorem 8 | **evidenced** |
| INV-7 | Projection totality: always returns ViewModel or typed error | Test suite | `projectGraph.test.js` — "INV-7: Projection Totality" (ok for valid input; ok:false for null graph, nonexistent focus, negative depth) | **evidenced** |
| INV-1 | Schema conformance | Metadata only | `buildViewModel.js` — listed in `satisfiedInvariants`; no dedicated test | **intended** |
| INV-2 | Identity stability | Metadata only | `buildViewModel.js` — listed in `satisfiedInvariants`; no dedicated test | **intended** |
| INV-4 | Graph immutability (projection does not mutate input) | Architecture | `buildViewModel.js` — listed in `satisfiedInvariants`; enforced by pure-function design of all 5 pipeline steps; no dedicated mutation test | **intended** |

### PROJ purity note

The projection pipeline (`validateInputs → resolveFocus → computeVisibleSubgraph → deriveSemanticRoles → buildViewModel`) is implemented as a chain of pure, synchronous functions with no external I/O or shared state. Each step documents "no side effects" in its JSDoc header. INV-3 (determinism) and INV-7 (totality) are the formalized, tested projections of the PROJ invariant. INV-1, INV-2, INV-4 are declared in metadata but lack standalone tests.

---

## Structural — Graph Integrity Invariants

Subsystem: `src/core/StructuralInvariants.js`
Enforced via: `InvariantChecker.checkAll()`, consumed by `ChangeProtocol.ProposalValidator`

### Graph invariants

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| INV-G1 | All node IDs are unique | Test suite | `StructuralInvariants.test.js` — "INV-G1: holds on valid/empty graph, detects duplicate"; `ChangeProtocol.test.js` — validated at `STRICTNESS.MINIMAL` | **evidenced** |
| INV-G2 | All edge IDs are unique | Test suite | `StructuralInvariants.test.js` — "INV-G2: holds on valid, detects duplicate/missing id" | **evidenced** |
| INV-G3 | No dangling edges (source/target exist) | Test suite | `StructuralInvariants.test.js` — "INV-G3: holds on valid, detects dangling source/target" | **evidenced** |
| INV-G4 | No self-loops | Test suite | `StructuralInvariants.test.js` — "INV-G4: holds on valid, detects self-loop" | **evidenced** |

### Identity invariants

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| INV-I1 | All nodes have id | Test suite | `StructuralInvariants.test.js` — "INV-I1: holds on valid, detects missing/empty id" | **evidenced** |
| INV-I2 | All nodes have type | Test suite | `StructuralInvariants.test.js` — "INV-I2: holds on valid, detects missing type" | **evidenced** |
| INV-I3 | All node types are known to schema | Test suite | `StructuralInvariants.test.js` — "INV-I3: flags all with empty NODE_TYPES, holds on empty graph". Note: `NODE_TYPES` is empty by design; checker is vacuously strict. | **evidenced** |
| INV-I4 | All nodes have label | Test suite | `StructuralInvariants.test.js` — "INV-I4: holds on valid, detects missing/empty label" | **evidenced** |

### Edge invariants

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| INV-E1 | All edges have type | Test suite | `StructuralInvariants.test.js` — "INV-E1: holds on valid, detects missing edge type" | **evidenced** |
| INV-E2 | All edge types are known to schema | Test suite | `StructuralInvariants.test.js` — "INV-E2: flags all with empty EDGE_TYPES, holds on empty graph". Note: same design as INV-I3. | **evidenced** |
| INV-E3 | No duplicate edges (same source, target, type) | Test suite | `StructuralInvariants.test.js` — "INV-E3: holds on valid, detects duplicate, allows different types" | **evidenced** |

### Connectivity invariants

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| INV-C1 | Graph is connected (one component) | Test suite | `StructuralInvariants.test.js` — "INV-C1: holds on connected/empty graph, detects disconnected" | **evidenced** |
| INV-C2 | No isolated nodes | Test suite | `StructuralInvariants.test.js` — "INV-C2: holds on valid, detects isolated node" | **evidenced** |
| INV-C3 | Root node exists | Test suite | `StructuralInvariants.test.js` — "INV-C3: always fails with empty NODE_TYPES; holds with matching type". Note: depends on world schema. | **evidenced** |

### Hierarchy invariants

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| INV-H1 | No cycles in `contains` hierarchy | Test suite | `StructuralInvariants.test.js` — "INV-H1: holds vacuously with typed edges, detects cycle, holds on acyclic" | **evidenced** |
| INV-H2 | Single parent in `contains` | Test suite | `StructuralInvariants.test.js` — "INV-H2: holds vacuously, detects multiple parents" | **evidenced** |

### Structural invariants note

All 16 structural invariants now have dedicated unit tests in `StructuralInvariants.test.js` (48 tests). Schema-dependent checkers (INV-I3, INV-E2, INV-C3) behave vacuously with the default empty `NODE_TYPES`/`EDGE_TYPES` — this is by design, as worlds override types via `WorldAdapter`. Tests document this behavior explicitly.

---

## OP — Operator Guarantees

Subsystem: `operators/`
Defined in: [API_SURFACE_POLICY.md](./API_SURFACE_POLICY.md), [ARCHITECTURE.md](../ARCHITECTURE.md)

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| OP-PURE | All operators are pure functions (no side effects, no engine mutation) | Test suite | `reasoningReport.test.js` — "generating report does not mutate underlying graphs"; `documentationWorldCompare.test.js` — "deterministic output"; `documentationWorldTrace.test.js` — "deterministic output"; `documentationWorldOperatorSupports.test.js` — "deterministic outputs" | **evidenced** |
| OP-DET | Operators produce deterministic output | Test suite | Same test files as OP-PURE; `dualWorldSmoke.test.js` — "deterministic across runs"; `reasoningReport.test.js` — "report is deterministic" | **evidenced** |
| OP-NORANK | Compare does not rank rival paths (no bestPath/winner field) | Test suite | `documentationWorldCompare.test.js` — "no ranking — no bestPath/winner field" | **evidenced** |

---

## ENG — Engine Layer Guarantees

Subsystem: `src/engine/`
Defined in: `WorldInterface.js`, [API_SURFACE_POLICY.md](./API_SURFACE_POLICY.md)

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| ENG-1 | WorldAdapter requires schemaData; throws without it | Test suite | `WorldAdapter.test.js` — "should throw without schemaData" | **evidenced** |
| ENG-2 | Schema validates node/edge types against declared definitions | Test suite | `Schema.test.js` — isValidNodeType, isValidEdgeType, isEdgeAllowed, validateNode, validateEdge | **evidenced** |
| ENG-3 | MeaningEngine requires a valid world; throws otherwise | Test suite | `MeaningEngine.test.js` — "should throw without world", "should throw with invalid world" | **evidenced** |
| ENG-4 | Engine is world-agnostic (no hardcoded types) | Test suite | `WorldAdapter.test.js` — "should NOT contain hardcoded types"; `MeaningEngine.test.js` — "should NOT contain hardcoded types" | **evidenced** |
| ENG-5 | WorldInterface contract: getSchema(), getGraph() required | Test suite | `WorldInterface.test.js` — full validation chain | **evidenced** |
| ENG-6 | CatalogRegistry validates catalogs before loading | Test suite | `CatalogRegistry.test.js` — "should throw on invalid catalogs" | **evidenced** |
| ENG-7 | GraphModel serialization preserves `type` and `layer` | Test suite | `MeaningEngine.test.js` — round-trip tests | **evidenced** |

---

## CP — Change Protocol Guarantees

Subsystem: `src/core/ChangeProtocol.js`
Defined in: `ChangeProtocol.js` header comments

| ID | Statement | Evidence type | Where evidenced | Status |
|----|-----------|---------------|-----------------|--------|
| CP-1 | Every mutation goes through proposal → validate → apply | Test suite | `ChangeProtocol.test.js` — happy path (add/remove/update node, add/remove edge, batch); rejection on invalid proposals; simulate path | **evidenced** |
| CP-2 | Validation checks structural invariants at MINIMAL strictness | Test suite | `ChangeProtocol.test.js` — "validates at MINIMAL strictness (5 checks)"; schema validation via `SchemaValidator` static calls | **evidenced** |
| CP-3 | Change history is preserved | Test suite | `ChangeProtocol.test.js` — "records each applied proposal in history"; "failed apply does not add to history"; "snapshots grow with each apply"; "history diff captures added node"; "exportHistory returns structured data" | **evidenced** |

### CP bugs found and fixed in B2

Four bugs were discovered in `ProposalValidator` during test development:

1. **Static method called on instance:** `this.schemaValidator.validateNode(node)` — `SchemaValidator.validateNode` is static, calling on instance throws TypeError. Fixed: call `SchemaValidator.validateNode(node)` directly.
2. **Count checked as boolean:** `!invariantResult.passed` checks count (number), not validity (boolean). Fixed: `!invariantResult.valid`.
3. **Number iterated as array:** `for (const failure of invariantResult.failed)` — `failed` is a count. Fixed: `invariantResult.violations`.
4. **Wrong property name:** `failure.error` — InvariantResult has `message`, not `error`. Fixed: `failure.message`.

---

## Summary Table

| Family | Count | Evidenced | Partially evidenced | Intended |
|--------|-------|-----------|---------------------|----------|
| KE | 5 | 4 | 1 (KE5) | 0 |
| NAV | 5 | 5 | 0 | 0 |
| PROJ | 5 | 2 (INV-3, INV-7) | 0 | 3 (INV-1, INV-2, INV-4) |
| Structural | 16 | 16 | 0 | 0 |
| OP | 3 | 3 | 0 | 0 |
| ENG | 7 | 7 | 0 | 0 |
| CP | 3 | 3 | 0 | 0 |
| **Total** | **44** | **40** | **1** | **3** |
