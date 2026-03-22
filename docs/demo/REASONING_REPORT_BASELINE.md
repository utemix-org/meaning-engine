# Meaning Engine — Reasoning Report (Baseline)

> **Generated**: 2026-03-22
> **Command**: `node --experimental-vm-modules operators/runReasoningReport.js --baseline`
> **Commit**: see git log for exact commit hash
>
> This is a pre-generated snapshot of the reasoning report output. You can read it without installing or running anything. To regenerate, run the command above from the repository root.

---

## documentation-world

Graph: 116 nodes, 292 edges

### Path Exists

- **Route:** SYSTEM_OVERVIEW → concept:projection
- **From:** `https://www.notion.so/e688cc28b25c40fabf27b2ab2577ab82`
- **To:** `concept:projection`
- **Result:** PATH (1 hop)

> **Strength:** medium
> concept-mediated: single defines edge, direct conceptual definition

### Directed Boundary

- **Route:** NAVIGATION_SPEC ↔ applyTransition.js
- **A:** `https://www.notion.so/b997b23c7bb94390be3351504e64d1fd`
- **B:** `code:file:src/core/navigation/applyTransition.js`
- **Trace(A→B):** no_path
- **Trace(B→A):** path (1 hop)

> **Strength:** medium
> implements-edge: structural dependency, directionality expresses responsibility

### Rival Explanations

- **Route:** PROJECTION_SPEC → evaluate.js
- **From:** `https://www.notion.so/435b2b96d0ec40b2a7262b1151a23380`
- **To:** `code:file:src/core/knowledge/evaluate.js`
- **Rival count:** 13
- **Clusters:** 3
- **Strength distribution:** 1 invariant-passing, 2 concept-mediated, 10 code-dependency

> **Strength:** mixed (strongest + medium + weaker)
> 1/13 invariant-passing (strongest), 2/13 concept-mediated (medium), 10/13 code-dependency (weaker)

### GAP + Bridge Candidates

- **Route:** evidence:grounding-phase-3a-tests → src/validate.js
- **From:** `evidence:grounding-phase-3a-tests`
- **To:** `code:file:src/validate.js`
- **Trace:** no_path
- **Bridge supported:** true
- **Candidate count:** 1
- **Candidates:** `concept:code-spec-alignment`

> **Strength:** weakest
> heuristic-only: candidate from type-pair mapping, no structural evidence in graph

---

## authored-mini-world

Graph: 25 nodes, 27 edges

### Path Exists

- **Route:** Type Theory Overview → Coq Proof
- **From:** `spec:type-theory-overview`
- **To:** `evidence:coq-proof`
- **Result:** PATH (3 hops)

> **Strength:** strong
> full epistemic chain: spec→concept→invariant→evidence with 3 typed edges (defines→constrains→proved_by)

### Directed Boundary

- **Route:** Type Theory Overview ↔ typeChecker.js
- **A:** `spec:type-theory-overview`
- **B:** `code_artifact:type-checker`
- **Trace(A→B):** no_path
- **Trace(B→A):** path (1 hop)

> **Strength:** medium
> implements-edge: code knows about spec, but not the other way around

### Rival Explanations

- **Route:** Type Theory Overview → inferenceEngine.js
- **From:** `spec:type-theory-overview`
- **To:** `code_artifact:inference-engine`
- **Rival count:** 2
- **Clusters:** 2
- **Strength distribution:** 0 invariant-passing, 1 concept-mediated, 1 code-dependency

> **Strength:** mixed (medium + weaker)
> 1/2 concept-mediated (medium), 1/2 code-dependency (weaker)

### GAP + Bridge Candidates

- **Route:** Type Theory Overview → Rust Borrow Checker Test
- **From:** `spec:type-theory-overview`
- **To:** `evidence:rust-borrow-checker-test`
- **Trace:** no_path
- **Bridge supported:** true
- **Candidate count:** 3
- **Candidates:** `concept:test-coverage`, `concept:acceptance-criteria`, `concept:verification-method`

> **Strength:** weakest
> heuristic-only: 3 candidates from type-pair mapping (spec→evidence), no path exists

---

*All results are compute artifacts. No acceptance.*

---

## How to regenerate

```bash
# Full baseline report (both reference worlds)
node --experimental-vm-modules operators/runReasoningReport.js --baseline

# Filtered by world
node --experimental-vm-modules operators/runReasoningReport.js --world authored-mini-world

# Filtered by scenario
node --experimental-vm-modules operators/runReasoningReport.js --world authored-mini-world --scenario rival_explanations
```

## Traceability world demo

A separate demo script runs 5 scenarios on the traceability world (21 nodes, 22 edges):

```bash
node --experimental-vm-modules worlds/traceability-world/demo.js
```

Scenarios: spec→evidence trace, rival paths, gap detection, invariant enforcement, focused projection. See `worlds/traceability-world/TRACEABILITY_CASE.md` for full documentation.
