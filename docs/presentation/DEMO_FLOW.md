# Demo Flow — Meaning Engine

A reproducible demo sequence using existing repo artifacts. No external dependencies required.

---

## Prerequisites

```bash
git clone https://github.com/utemix-org/meaning-engine.git
cd meaning-engine
npm install
```

Verify:
```bash
npm test   # 930 tests, all green
```

---

## Primary demo path: Traceability World

**Duration**: 3–5 minutes
**Command**: `node --experimental-vm-modules worlds/traceability-world/demo.js`

### What to show

The demo script runs 5 scenarios automatically and prints results. Walk through each:

#### Step 1: World overview (30s)

Point out: 21 nodes, 22 edges, 5 entity types (spec, concept, invariant, code_artifact, evidence). This is a model of an authentication module — small enough to explain in one sentence.

```
World: Authentication Module Traceability
  Nodes: 21
  Edges: 22
  Node types: spec, concept, invariant, code_artifact, evidence
  supportsInspect: ok
  supportsTrace:   ok
```

**What this proves**: The engine loads any typed graph and validates operator compatibility automatically.

#### Step 2: Spec → Evidence trace (30s)

```
trace(spec:auth-login → evidence:login-tests)
Result: PATH FOUND (2 hops)
Path: spec:auth-login → concept:credential-validation → evidence:login-tests
```

**What this proves**: The engine can trace from a requirement to its test evidence through semantic layers. The path goes through the concept layer, not directly — this shows structural depth.

#### Step 3: Gap detection (1 min)

```
trace(spec:password-reset → any evidence): NO PATH

Bridge candidates suggested:
  - concept:test-coverage
  - concept:acceptance-criteria
  - concept:verification-method
```

**What this proves**: The engine detects missing coverage. The password-reset feature has code but no tests — and the engine finds this gap and suggests what could bridge it. This is the "what's missing" capability.

#### Step 4: Rival paths (1 min)

```
compare(spec:auth-login, evidence:login-tests)
Result: 2 RIVAL PATHS
  Path 1: spec → concept:credential-validation → evidence  (concept-heavy)
  Path 2: spec → code:authService → evidence               (code-heavy)
```

**What this proves**: The engine doesn't just find one path — it finds all shortest paths and clusters them by structural signature. Two paths exist: one through abstraction, one through implementation. This is structural analysis, not just connectivity checking.

#### Step 5: Invariant trace + Projection (30s)

```
trace(invariant:no-plaintext → evidence:hash-tests) → PATH FOUND (1 hop)
projectGraph(focus: spec:auth-login) → 4 nodes, 3 neighbors, drillDown=true
```

**What this proves**: Constraints trace to their evidence. Projection reveals local structure with navigation support.

### Demo talking points

After the demo, emphasize:
- **No changes to the engine were needed** — the traceability world works with existing operators
- **Deterministic** — re-run the demo and get the same output
- **21 nodes** — this is deliberately small. The mechanism is the point, not the scale

---

## Fallback path A: Benchmark harness

If the traceability demo is too long or the audience wants performance data:

**Command**: `node --experimental-vm-modules benchmarks/bench.js`

**Duration**: ~5 seconds, produces a summary table.

**What to show**:
- Projection scales linearly: 200 µs at 116 nodes, 2.6 ms at 2,500 nodes
- Navigation is instantaneous: < 50 µs for 20 steps
- Compare path explosion: 70 paths on 5×5 grid (6 ms) → 3,432 paths on 8×8 grid (752 ms)

**What this proves**: The engine has been benchmarked honestly, with sharp edges documented.

---

## Fallback path B: Documentation-world reasoning report

If the audience wants to see the engine on a larger, less toy-like graph:

**Command**: `node operators/runReasoningReport.js --baseline`

**Duration**: ~2 seconds, shows trace/compare/gap results on the 116-node documentation-world.

**What to show**:
- The engine traces its own specification structure (PROJECTION_SPEC → evaluate.js)
- 13 rival paths found and clustered into 3 groups
- Gap detection with bridge candidates on the self-referential graph

**What this proves**: The engine works on a non-trivial graph built from its own architecture documentation.

---

## Fallback path C: Test suite

Minimal fallback if nothing else works:

**Command**: `npm test`

**What to show**:
- 930 tests, 41 test files, all green
- Test families cover: core (GraphModel, Projection, Navigation, Knowledge, ChangeProtocol), operators (trace, compare, supports), worlds (documentation, authored-mini, traceability), engine (MeaningEngine, Schema, WorldAdapter)

**What this proves**: The engine has serious test coverage and CI discipline.

---

## Demo anti-patterns to avoid

| Don't | Why |
|-------|-----|
| Don't claim this works at 10,000 nodes | Benchmarked up to 2,500 — say "measured up to X, scales linearly for projection/trace" |
| Don't call it a "platform" | It's a computational substrate — no UI, no persistence, no user management |
| Don't compare to Neo4j/SPARQL | Different layer — the engine computes over graphs, it doesn't store them |
| Don't show experimental modules | LLMReflectionEngine, Cabin, etc. are explicitly non-public |
| Don't oversell the traceability world | 21 nodes is a proof-of-mechanism, not industrial scale — say so |
| Don't hide the compare limitation | Path explosion on dense graphs is real — mention it proactively |
