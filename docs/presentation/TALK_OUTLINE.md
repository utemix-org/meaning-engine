# Talk Outline — Meaning Engine

Two versions: a 5-minute lightning talk and a 15-minute engineering presentation. Both use the same structure with different depth.

---

## 5-Minute Version

### 1. Opening problem (1 min)

> "Requirements, code, tests, invariants — they all form a graph. But we rarely compute over that graph."

- Engineering knowledge lives in disconnected tools
- Traceability questions require manual traversal
- The problem is not storage — it's computation over structure

### 2. What Meaning Engine does (1 min)

- Deterministic computational substrate for typed semantic graphs
- You bring a graph (JSON seed files), the engine computes: projection, trace, compare, gap detection
- No LLM, no embeddings, no hidden state — fully deterministic and reproducible

### 3. Live demo: traceability case (2 min)

Run: `node --experimental-vm-modules worlds/traceability-world/demo.js`

Show three results:
1. **Trace**: spec:auth-login traces to evidence:login-tests through concept layer (2 hops)
2. **Gap**: spec:password-reset has no path to any evidence — bridge candidates suggested
3. **Rival paths**: two structurally different paths from spec to evidence (concept-heavy vs code-heavy)

### 4. Close: what it guarantees and what it doesn't (1 min)

- 44 invariants, all evidenced, 930 tests
- Honest limits: benchmarked up to 2,500 nodes, compare has path explosion risk on dense graphs
- Not GraphRAG, not an ontology store, not a UI framework
- This is a proof-of-mechanism, not a product launch

---

## 15-Minute Version

### 1. Opening problem (2 min)

> "Every engineering team builds graph-shaped knowledge — specs, code, tests, constraints. But we almost never compute over that structure."

- Show the authentication module as a concrete example
- Requirements → concepts → invariants → code → tests
- The question: "Can I trace from requirement to test evidence?"
- Current answer: manual, fragile, tool-dependent

### 2. System identity (2 min)

- Meaning Engine: deterministic computation over typed semantic graphs
- Core operations: projection, navigation, trace, compare, gap detection
- What it is NOT: not GraphRAG, not an ontology, not a UI, not an agent
- Architecture: 5-step projection pipeline, BFS-based operators, immutable graph snapshots
- World-agnostic: engine computes, you bring the graph

**Slide**: canonical definition + non-promise list (from `POSITIONING_MEMO.md`)

### 3. Guarantees and evidence (3 min)

- 44 invariants across 7 families: KE (knowledge evolution), NAV (navigation), PROJ (projection), Structural, OP (operators), ENG (engineering), CP (change protocol)
- All 44 evidenced — zero gaps
- 930 automated tests
- Evidence audit trail: `INVARIANT_MATRIX.md` + `PROOF_OBLIGATIONS.md`

**Slide**: summary table (44/44 evidenced)

- Change protocol: every mutation goes through proposal → validate → apply
- 4 bugs found and fixed during evidence development — evidence work catches real bugs

### 4. Operational limits (2 min)

- Benchmarked 43 cases across synthetic and reference-world graphs
- Projection: < 1 ms for graphs under 500 nodes (measured)
- Trace: < 1 ms for graphs under 1,000 nodes (measured)
- Navigation: effectively instantaneous (< 50 µs)
- Compare: fast on sparse graphs, combinatorial risk on dense graphs

**Slide**: compare path explosion table (5×5: 70 paths/6ms → 8×8: 3,432 paths/752ms)

- Honest distinction: measured vs inferred vs unknown
- Reference worlds are 10 and 116 nodes — behavior at 5,000+ is inferred, not proven

### 5. Traceability case demo (4 min)

Run: `node --experimental-vm-modules worlds/traceability-world/demo.js`

Walk through all 5 scenarios:

1. **S1: Spec → Evidence trace** — "Can we trace auth-login to its tests?" → 2-hop path through credential-validation concept
2. **S2: Rival paths** — "Are there multiple routes?" → concept-heavy vs code-heavy, clustered automatically
3. **S3: Gap detection** — "Does password-reset have tests?" → No path, bridge candidates suggested → this is how the engine finds what's missing
4. **S4: Invariant enforcement** — "Can we trace constraints to evidence?" → Direct proved_by links
5. **S5: Projection** — "What does the neighborhood look like?" → Focused view with drill-down

**Slide**: graph topology diagram (from `TRACEABILITY_CASE.md`)

### 6. Boundaries and non-claims (1 min)

- The traceability world is 21 nodes — not industrial scale
- No integration with external tools yet
- No real-time graph updates
- No automated gap remediation
- Compare has no path count limit — dense graphs can be slow
- This is a proof-of-mechanism, demonstrated on a compact, honest case

### 7. Next steps (1 min)

- Larger proof case (self-traceability or real-project graph)
- Path count safety limit in compare
- Memory profiling at scale
- Visual rendering layer
- Integration with external data sources

---

## Suggested Q&A Preparation

### Likely engineering objections and honest answers

**Q: How does this differ from a graph database with queries?**
A: A graph database stores and retrieves. Meaning Engine computes deterministic projections and structural diagnostics (rival paths, gap detection, bridge candidates) that a query language doesn't naturally express. The engine also guarantees determinism and immutability by construction.

**Q: Why not just use Neo4j / SPARQL?**
A: You could store the graph there. But the projection pipeline, rival-path clustering, and bridge candidate detection are domain-specific computations that live above the storage layer. The engine is storage-agnostic — it loads from flat JSON files today.

**Q: 21 nodes is tiny. Does this work at 10,000 nodes?**
A: Projection, navigation, and trace scale linearly (O(n+m)) — measured up to 2,500 nodes. Compare has a known path explosion risk on dense graphs, documented honestly. We haven't tested at 10,000 nodes, and we say so explicitly.

**Q: What's the practical use case beyond a demo?**
A: Spec-to-test traceability is the first case. The mechanism is general: any typed graph where you need to trace paths, find gaps, or compare alternative routes. Requirements traceability, dependency analysis, and invariant verification are natural applications.

**Q: Is there an LLM inside?**
A: No. The core is fully deterministic. There is an experimental `LLMReflectionEngine` class that is explicitly marked non-public and not part of the stable contract.

**Q: What happens if someone passes a malicious graph?**
A: The engine processes whatever graph you give it. Dense or adversarial graphs can trigger combinatorial path enumeration in `compare`. There is currently no built-in cap — this is documented as a known sharp edge.
