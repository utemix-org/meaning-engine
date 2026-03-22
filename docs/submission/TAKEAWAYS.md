# Key Takeaways

1. **Graph-structured knowledge is computable.** Requirements, code, tests, and invariants form a typed graph. Meaning Engine provides deterministic projection, trace, rival-path detection, and gap analysis over that graph.

2. **44 invariants, all evidenced.** Seven invariant families (projection, navigation, knowledge evolution, structural integrity, change protocol, operators, engineering) — each backed by automated tests. Evidence development found and fixed 4 real bugs.

3. **Honest operational limits.** Benchmarked up to 2,500 nodes. Projection and trace scale linearly. Compare has a documented path-explosion risk on dense graphs. Memory is not yet profiled at scale.

4. **Demonstrated on a compact traceability case.** A 21-node authentication module shows spec-to-test traces, rival paths, gap detection, and invariant enforcement — proving the mechanism, not industrial scale.

5. **Strict claim discipline.** Every claim has an artifact. Every non-claim has a reason. The engine is not GraphRAG, not an ontology store, not a UI framework, and not an autonomous agent.

6. **World-agnostic by design.** You bring a typed graph as JSON seed files; the engine provides the computational layer. Four reference worlds demonstrate different topologies and type vocabularies.
