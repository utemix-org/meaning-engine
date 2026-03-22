# Abstract (Short)

**Meaning Engine: Deterministic Computation Over Graph-Structured Knowledge**

Engineering teams build graph-shaped knowledge every day — requirements trace to code, code traces to tests, invariants constrain both — but they rarely compute over that structure. Meaning Engine is a deterministic computational substrate that takes a typed semantic graph and produces projections, traces, rival-path clusters, and gap reports. You bring a graph as JSON seed files; the engine provides the computational layer.

The core pipeline is a 5-step deterministic projection, backed by 44 invariants across 7 families — all evidenced by 930+ automated tests. Operators detect traceability gaps and suggest bridge candidates via type-pair heuristics. The engine is benchmarked up to 2,500 nodes with linear scaling for projection and trace.

This talk demonstrates the mechanism on a compact traceability world (21 nodes modeling an authentication module): spec-to-test traces, rival-path detection, gap analysis, and invariant enforcement. The case is small by design — it proves the mechanism, not industrial scale. Every claim has a corresponding artifact in the repository. Every limitation is documented.

Meaning Engine is not GraphRAG, not an ontology store, not a UI framework, and not an autonomous agent. It is a tested, reproducible computation layer for structural reasoning over typed graphs.
