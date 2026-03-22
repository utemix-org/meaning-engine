# Presentation Narrative — Meaning Engine

This document tells the engineering story of Meaning Engine in presentation order. It is designed for a first serious engineering audience. Every claim made here has a corresponding artifact in the repository.

---

## 1. The problem

Engineering teams build knowledge structures every day — requirements, code, tests, invariants, specifications — but these structures live in disconnected tools. When someone asks "which test proves this requirement?" or "are there two different paths from this spec to its evidence?", the answer requires manual traversal across systems.

The underlying problem is not storage — it's computation over structure. You need to trace, compare, project, and detect gaps in a typed graph of engineering knowledge.

## 2. What Meaning Engine is

Meaning Engine is a deterministic computational substrate for graph-structured knowledge. Concretely: you give it a typed graph, and it gives you back projections, traces, rival-path clusters, and gap reports — all deterministically, all reproducible.

You bring a typed semantic graph (nodes with `id` and `type`, edges with `source` and `target`, loaded from JSON seed files). The engine provides:

- **Projection**: a 5-step deterministic pipeline that produces a render-ready ViewModel from any graph + focus point
- **Navigation**: type-safe, reversible transitions (select, drill down, drill up, reset)
- **Trace**: directed BFS to find a path between any two nodes
- **Compare**: rival-path detection — finds all shortest paths and clusters them by structural signature
- **Gap detection**: when no path exists, the engine suggests bridge concepts based on node-type pair heuristics

The engine is:

- **Deterministic**: same inputs always produce the same output. No hidden state, no randomness, no LLM inside the core.
- **World-agnostic**: you bring any typed graph; the engine provides the computational layer.
- **Reproducible**: every operation can be re-run from seed files with identical results.

## 3. What it is not

This is important to state clearly:

- **Not GraphRAG.** No LLM entity extraction, no embeddings, no community summaries. The engine is fully deterministic.
- **Not an ontology database.** No SPARQL, no OWL reasoning, no triple-store persistence.
- **Not a UI framework.** The engine produces data structures. Rendering is a separate concern.
- **Not an autonomous agent.** Operators are invoked explicitly. There are no goals, no planning, no self-directed exploration.

## 4. What it guarantees

The engine makes a small number of public guarantees, each backed by evidence:

| Guarantee | Evidence |
|-----------|----------|
| Deterministic projection (same inputs → same output) | 34 tests in `projectGraph.test.js` + 32 in `projectionMetadata.test.js` |
| Identity stability (source IDs preserved through projection) | `INV-2` — 9 dedicated tests |
| Graph immutability (projection does not mutate input) | `INV-4` — 7 dedicated tests |
| Knowledge evolution invariants (KE1–KE5) | 6 tests in `knowledgeInvariants.test.js` |
| Navigation reversibility and type safety | 24 tests in `applyTransition.test.js` |
| Structural invariants (16 rules checked on every mutation) | 48 tests in `StructuralInvariants.test.js` |
| Change protocol (proposal → validate → apply) | 36 tests in `ChangeProtocol.test.js` |

To illustrate what "invariant" means concretely:

| Family | Example invariant |
|--------|-------------------|
| PROJ | Projection output always conforms to the ViewModel schema (5 required keys) |
| KE | Adding a valid statement never makes an existing valid statement unreachable |
| NAV | Every `DRILL_DOWN` transition can be reversed by `DRILL_UP` |
| Structural | Every edge's source and target must reference existing nodes |
| CP | A rejected proposal must not alter graph state |

**44 invariants across 7 families. 44 evidenced. 0 gaps.**

The full mapping is in `docs/INVARIANT_MATRIX.md`. The evidence audit is in `docs/PROOF_OBLIGATIONS.md`.

## 5. What evidence exists

The evidence stack, bottom to top:

| Layer | Artifact | Status |
|-------|----------|--------|
| **Identity lock** | `POSITIONING_MEMO.md`, `API_SURFACE_POLICY.md`, README | Accepted |
| **Trust surface cleanup** | Renamed misleading exports, enforced public/experimental boundary | Accepted |
| **Invariant matrix** | 44 invariants across 7 families, all evidenced | Complete |
| **Proof obligations** | All critical/important gaps closed; 1 experimental gap remaining | Complete |
| **Operational limits** | 43 benchmark cases, measured + inferred limits, sharp edges documented | Complete |
| **Engineering proof case** | Traceability world (21 nodes, 22 edges), 5 scenarios, 25 tests | Complete |

Total automated tests: **930 passing**.

## 6. The first engineering proof case

The traceability world models an authentication module with requirements, code, tests, invariants, and concepts. It demonstrates:

| Scenario | What it shows | Result |
|----------|--------------|--------|
| Spec → Evidence trace | Can we trace a requirement to its test? | 2-hop path through concept layer |
| Rival paths | Are there multiple routes? | 2 rival paths: concept-heavy vs code-heavy |
| Gap detection | Does password-reset have tests? | No path found — deliberate gap with bridge candidates |
| Invariant enforcement | Can we trace a constraint to its evidence? | Direct 1-hop proved_by |
| Focused projection | What's the neighborhood of a requirement? | 4 nodes, 3 neighbors, drillable |

This case is small by design. It demonstrates the mechanism, not industrial scale. The world is 21 nodes — real engineering graphs would be larger. But the operations are the same, and they work without modification on any graph that fits the input contract.

## 7. Operational limits

The engine has been benchmarked on graphs up to 2,500 nodes:

| Operation | Scaling | Measured at doc-world (116 nodes) |
|-----------|---------|----------------------------------|
| Projection | O(n+m), linear | ~200 µs |
| Navigation | O(1) per transition | ~30 µs for 20 steps |
| Trace | O(V+E), single BFS | ~210 µs |
| Compare | O(V+E) + path enumeration | ~1.4 ms (3 paths) |
| Supports | O(n+m), simple checks | < 20 µs |

**The primary risk area is `compare`**: on dense, grid-like graphs, the path enumeration grows combinatorially (70 paths on a 5×5 grid in 6 ms → 3,432 paths on 8×8 in 752 ms). Real semantic graphs are sparse and tree-like, so this is unlikely at current scales — but there is no built-in path count limit. This is documented honestly.

Full details: `docs/OPERATIONAL_LIMITS.md`.

## 8. What comes next

This presentation represents V1 of the engineering readiness package. What remains:

- **Larger proof case**: a self-traceability world where Meaning Engine traces its own codebase
- **Path count limit in compare**: a safety cap to prevent combinatorial explosion on adversarial graphs
- **Memory profiling**: heap usage at 1,000+ node scale
- **Integration demo**: connecting the engine to an external data source (e.g., GitHub repository structure)
- **Visual rendering**: a simple UI showing projection, navigation, and trace results

These are not commitments. They are the natural next directions based on current evidence.
