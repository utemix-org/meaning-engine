# Claims and Non-Claims

A compact reference sheet for engineering presentations. Every claim has a source artifact. Every non-claim has a reason.

---

## Strongest justified claims

These are statements that can be made confidently in an engineering presentation, with evidence pointers.

### Architecture claims

| Claim | Evidence |
|-------|----------|
| The engine is fully deterministic: same inputs always produce the same output | `INV-3` (Projection Determinism) — tested; no random state, no LLM in core |
| Projection is a pure function of (graph, focus, params) | 5-step pipeline tested in `projectGraph.test.js` (34 tests) + `projectionMetadata.test.js` (32 tests) |
| The graph is immutable through projection | `INV-4` — 7 dedicated tests verify input unchanged after projection |
| Navigation transitions are reversible and type-safe | 24 tests in `applyTransition.test.js` |
| Every mutation goes through proposal → validate → apply | 36 tests in `ChangeProtocol.test.js`; 4 real bugs found during testing |

### Evidence claims

| Claim | Evidence |
|-------|----------|
| 44 invariants across 7 families, all evidenced by automated tests | `docs/INVARIANT_MATRIX.md` — summary table: 44 evidenced, 0 gaps |
| 930 automated tests across 41 test files | `npm test` output |
| Evidence development found and fixed 4 real bugs in ChangeProtocol | `docs/PROOF_OBLIGATIONS.md` — CP bugs section |

### Operational claims

| Claim | Evidence |
|-------|----------|
| Projection completes in < 1 ms for graphs under 500 nodes | Measured — `docs/OPERATIONAL_LIMITS.md`, 43 benchmark cases |
| Navigation is effectively instantaneous (< 50 µs per sequence) | Measured |
| Trace finds a path in < 1 ms for graphs under 1,000 nodes | Measured |
| Compare is fast on sparse, tree-like graphs | Measured — 1.4 ms on 116-node doc-world (3 paths) |

### Utility claims

| Claim | Evidence |
|-------|----------|
| The engine can trace from a requirement to its test evidence | Traceability world demo — S1 |
| The engine detects missing coverage (traceability gaps) | Traceability world demo — S3 |
| The engine finds multiple structural paths and clusters them | Traceability world demo — S2 |
| The engine works on any typed semantic graph without modification | 3 reference worlds (test-world, documentation-world, traceability-world) + authored-mini-world |

---

## Explicit non-claims

These are statements that should NOT be made. For each, the reason is given.

### Scale non-claims

| Non-claim | Reason |
|-----------|--------|
| "Production-ready at industrial scale" | Benchmarked up to 2,500 nodes. Real-world behavior at 10,000+ is untested. |
| "Compare is always fast" | Path explosion on dense/grid-like graphs: 3,432 paths on 8×8 grid = 752 ms. No built-in cap. |
| "Memory-efficient at large scale" | Memory not profiled. Expected proportional to graph size, but not measured. |

### Capability non-claims

| Non-claim | Reason |
|-----------|--------|
| "A GraphRAG system" | No LLM entity extraction, no embeddings, no community summaries. Fully deterministic. |
| "An ontology / RDF store" | No SPARQL, no OWL reasoning, no triple-store persistence. |
| "A requirements management platform" | No UI, no user management, no persistence layer, no integration with Jira/ALM tools. |
| "An automated remediation system" | The engine detects gaps but does not generate fixes, tests, or code. |
| "A real-time system" | Static graph processing. No live mutation, no streaming updates. |

### Proof case non-claims

| Non-claim | Reason |
|-----------|--------|
| "The traceability world proves industrial readiness" | 21 nodes. This proves the mechanism works, not that it scales to enterprise requirements. |
| "The engine replaces existing traceability tools" | No tool integration. The engine computes over structure — it does not manage it. |
| "Bridge candidates are actionable recommendations" | Candidates are type-pair heuristics, not graph-structural analysis. They point in a direction, not to a solution. |

---

## Wording guidance

### Preferred phrasing

| Instead of | Say |
|------------|-----|
| "Meaning Engine is a platform for..." | "Meaning Engine is a computational substrate that..." |
| "It scales to enterprise workloads" | "It has been benchmarked up to 2,500 nodes with linear scaling for projection and trace" |
| "It guarantees..." | "It provides, with evidence: ..." |
| "Production-ready" | "The core operations are tested and benchmarked; integration and scale are next steps" |
| "AI-powered" | Do not use. The core is deterministic. Experimental LLM modules are explicitly non-public. |
| "Finds all gaps" | "Detects missing paths between node pairs and suggests bridge candidates" |

### Tone guidance

- **Engineering precision over marketing enthusiasm.** Say what was measured, what was inferred, what is unknown.
- **Narrow claims are more credible.** "Projection is deterministic and tested" is stronger than "the engine is reliable."
- **Acknowledge limitations proactively.** Mentioning the compare path explosion before being asked is more credible than being surprised by the question.
- **Small, reproducible, honest.** The traceability world is 21 nodes by design. If the audience wants scale, point to the benchmark harness and say what the numbers actually show.
