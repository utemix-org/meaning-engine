# Abstract (Long)

**Meaning Engine: Deterministic Computation Over Graph-Structured Knowledge**

## Problem

Engineering teams build graph-shaped knowledge every day: requirements define concepts, concepts constrain code, code is validated by tests, and invariants tie the whole structure together. But this knowledge lives in disconnected tools, and questions like "which test proves this requirement?" or "are there two structurally different paths from this spec to its evidence?" require manual traversal across systems. The underlying problem is not storage — it is computation over structure.

## Solution

Meaning Engine is a deterministic computational substrate for graph-structured knowledge. You provide a typed semantic graph (nodes with `id` and `type`, edges with `source`, `target`, and `type`, loaded from JSON seed files), and the engine provides:

- **Projection**: a 5-step deterministic pipeline that produces a render-ready ViewModel from any graph and focus point
- **Navigation**: type-safe, reversible transitions (select, drill down, drill up, reset)
- **Trace**: directed BFS to find paths between any two nodes
- **Compare**: rival-path detection — finds all shortest paths between two nodes and clusters them by structural signature
- **Gap detection**: when no path exists, the engine suggests bridge concepts based on node-type pair heuristics

The engine is fully deterministic (no hidden state, no randomness, no LLM in the core), world-agnostic (you bring any typed graph), and reproducible (same inputs always produce the same output).

## Evidence Discipline

The engine maintains 44 invariants across 7 families (projection, navigation, knowledge evolution, structural integrity, change protocol, operators, engineering constraints) — all evidenced by automated tests. The evidence stack includes an invariant matrix, proof obligation audit, and operational limits document. During evidence development, 4 real bugs were found and fixed in the change protocol — demonstrating that evidence work catches real defects.

Total automated tests: 930+, across 41 test files.

## Operational Limits

The engine has been benchmarked on graphs up to 2,500 nodes across 43 benchmark cases:

- Projection: < 1 ms for graphs under 500 nodes (linear scaling)
- Trace: < 1 ms for graphs under 1,000 nodes (single BFS)
- Navigation: < 50 µs per transition sequence
- Compare: fast on sparse graphs, but path enumeration grows combinatorially on dense, grid-like topologies (known, documented)

Memory usage is proportional to graph size but has not been profiled at scale. These are laptop-scale measurements on reference-world fixtures.

## Demonstration

The talk includes a live demo on a compact traceability world (21 nodes, 22 edges) modeling an authentication module with requirements, code, tests, invariants, and concepts. Five scenarios demonstrate:

1. Spec-to-test trace (2-hop path through concept layer)
2. Rival-path detection (concept-heavy vs code-heavy routes)
3. Gap detection with bridge candidates (deliberate missing coverage)
4. Invariant enforcement (constraint-to-evidence links)
5. Focused projection with drill-down navigation

The case is small by design: it demonstrates the mechanism, not industrial scale. The operations run without modification on any graph that conforms to the input contract.

## What It Is Not

Meaning Engine is not GraphRAG (no LLM entity extraction, no embeddings), not an ontology database (no SPARQL, no OWL reasoning), not a UI framework (it produces data structures, not visuals), and not an autonomous agent (operators are invoked explicitly). It is a tested, reproducible computation layer for structural reasoning over typed graphs. There are no external users yet — this is pre-production engineering work with a measured evidence foundation.
