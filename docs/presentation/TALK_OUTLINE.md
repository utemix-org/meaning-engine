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

Show two results (pick the two that land best with this audience):
1. **Trace**: spec:auth-login traces to evidence:login-tests through concept layer (2 hops) — "the engine can trace from requirement to test"
2. **Gap**: spec:password-reset has no path to any evidence — bridge candidates suggested — "the engine finds what's missing"

If time permits, mention verbally: "There's also rival-path detection — the engine found two structurally different routes to the same evidence."

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
- Give 2–3 concrete examples before citing the number:
  - "Projection output always conforms to the ViewModel schema" (PROJ)
  - "Every DRILL_DOWN can be reversed by DRILL_UP" (NAV)
  - "A rejected proposal must not alter graph state" (CP)
- All 44 evidenced — zero gaps
- 930 automated tests
- Evidence audit trail: `INVARIANT_MATRIX.md` + `PROOF_OBLIGATIONS.md`

**Slide**: summary table (44/44 evidenced) with 2–3 example invariants visible

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

**Q: What's actually novel here? These are standard graph algorithms.**
A: The individual algorithms are standard — BFS, subgraph extraction, path enumeration. What the engine contributes is the composition: a deterministic pipeline that takes a typed graph and produces projections, rival-path clusters, and gap reports with bridge candidates, all under 44 tested invariants. The novelty is in the composition and the evidence discipline, not in any single algorithm.

**Q: Who uses this? What's the target user?**
A: No external users yet. This is pre-production engineering work with a serious evidence foundation. The immediate goal is to demonstrate that the computational model works and to characterize its operational envelope honestly. Production adoption is a future step, not a current claim.

**Q: How does this differ from a graph database with queries?**
A: A graph database stores and retrieves. Meaning Engine computes deterministic projections and structural diagnostics (rival paths, gap detection, bridge candidates) that a query language doesn't naturally express. The engine also guarantees determinism and immutability by construction.

**Q: Why not just use Neo4j / SPARQL?**
A: You could store the graph there. But the projection pipeline, rival-path clustering, and bridge candidate detection are domain-specific computations that live above the storage layer. The engine is storage-agnostic — it loads from flat JSON files today.

**Q: 21 nodes is tiny. Does this work at 10,000 nodes?**
A: Projection, navigation, and trace scale linearly (O(n+m)) — measured up to 2,500 nodes. Compare has a known path explosion risk on dense graphs, documented honestly. We haven't tested at 10,000 nodes, and we say so explicitly.

**Q: What's the practical use case beyond a demo?**
A: Spec-to-test traceability is the first case. The mechanism is general: any graph conforming to the JSON input contract where you need to trace paths, find gaps, or compare alternative routes. Requirements traceability, dependency analysis, and invariant verification are natural applications.

**Q: Is this a library, a framework, or a product?**
A: Currently a library — you import functions and call them with graph data. There is no framework, no CLI product, no UI. "Computational substrate" means it's the computation layer that a product could be built on top of.

**Q: Is there an LLM inside?**
A: No. The core is fully deterministic. There is an experimental `LLMReflectionEngine` class that is explicitly marked non-public and not part of the stable contract.

**Q: What happens if someone passes a malicious graph?**
A: The engine processes whatever graph you give it. Dense or adversarial graphs can trigger combinatorial path enumeration in `compare`. There is currently no built-in cap — this is documented as a known sharp edge.

**Q: How are bridge candidates computed? Is it intelligent analysis?**
A: No — bridge candidates come from a hardcoded type-pair lookup table (`CANDIDATE_BRIDGE_MAP`). Given the types of the two disconnected nodes, it suggests concept types that commonly bridge that pair. This is a heuristic hint, not structural graph analysis. We describe it as a directional suggestion, not a recommendation.

---

### Shortest safe answers for the 5 hardest questions

If pressed for time or under adversarial questioning, these are the most defensible one-sentence answers:

1. **"What's novel?"** — "The composition of deterministic projection, rival-path clustering, and gap detection under 44 tested invariants — not any single algorithm."
2. **"21 nodes?"** — "The world proves the mechanism; benchmarks go up to 2,500 nodes; the operations run unmodified at any size that fits in memory."
3. **"Who uses this?"** — "No external users yet — this is pre-production engineering work with measured evidence."
4. **"Why not Neo4j?"** — "You could store the graph in Neo4j — you'd still need projection, rival-path clustering, and gap detection on top."
5. **"What's novel vs. DOORS/Jama?"** — "This computes over arbitrary typed graphs, not just requirements links — rival paths and structural gap detection are the distinguishing operations."
