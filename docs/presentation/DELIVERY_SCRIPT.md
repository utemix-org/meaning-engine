# Delivery Script — Meaning Engine

Speaker notes for live delivery. Tied to the talk outline. Two versions: 5-minute and 15-minute.

Convention: `[SLOW]` = slow down and articulate clearly. `[PAUSE]` = brief silence for emphasis. `[AVOID]` = what NOT to say here. `[DISCLAIM]` = proactive limitation mention. `[DEMO]` = switch to terminal.

---

## 5-Minute Version

### Beat 1: Opening problem (0:00–1:00)

**Say**:

> "Engineering teams build knowledge structures every day — requirements, code, tests, constraints. These all form a graph. But we rarely compute over that graph."

> "When someone asks 'which test proves this requirement?' or 'are there two different paths from this spec to that evidence?' — the answer today requires manual traversal across disconnected tools."

> `[SLOW]` "The problem is not storage. The problem is computation over structure."

`[AVOID]`: Don't say "we solve traceability" — that sounds like a product claim. Say "we compute over structure."

**Transition**: "Let me show you what that computation looks like."

---

### Beat 2: What Meaning Engine does (1:00–2:00)

**Say**:

> "Meaning Engine is a deterministic computational substrate for typed semantic graphs."

> `[SLOW]` "Concretely: you give it a graph — nodes with types, edges with types, loaded from JSON files — and it gives you back projections, traces, rival-path clusters, and gap reports. All deterministically. All reproducible."

> "Core operations: projection — a 5-step pipeline that produces a render-ready view. Trace — BFS to find a path between any two nodes. Compare — finds all shortest paths and clusters them. Gap detection — when no path exists, it suggests what could bridge the gap."

> `[PAUSE]` "No LLM. No embeddings. No hidden state. Fully deterministic."

`[AVOID]`: Don't say "any graph works" — say "any graph conforming to the JSON input contract." Don't say "intelligent gap analysis" — say "heuristic bridge suggestions."

**Transition**: "Let me show you a concrete example."

---

### Beat 3: Live demo (2:00–4:00)

`[DEMO]` Switch to terminal. Command is already prepared (pre-run in rehearsal).

**Say before running**:

> "This is a traceability world — 21 nodes modeling an authentication module. Specs, concepts, code, tests, constraints. Small by design — the point is the mechanism, not the scale."

Run: `node --experimental-vm-modules worlds/traceability-world/demo.js`

**During output — Trace result**:

> "First question: can we trace from auth-login requirement to its test evidence? The engine finds a 2-hop path — requirement to concept to test. The path goes through the concept layer, not directly."

**During output — Gap result**:

> `[SLOW]` "Second question: does password-reset have test coverage? The engine finds no path. There's code for password reset, but no test reaches it. And the engine suggests bridge candidates — concept types that commonly connect specs to evidence."

> `[DISCLAIM]` "Those bridge candidates come from a type-pair lookup table — it's a heuristic hint, not structural analysis."

**If time permits** (check clock — only if under 3:30):

> "The engine also found two structurally different rival paths from spec to evidence — one through the concept layer, one through implementation. Clustered automatically by structural signature."

`[AVOID]`: Don't try to explain all 5 scenarios. Don't scroll back to show previous output. Don't apologize for the world being small.

**Transition**: "So what does the engine actually guarantee?"

---

### Beat 4: Close (4:00–5:00)

**Say**:

> "The engine has 44 invariants across 7 families — things like: projection output always conforms to the ViewModel schema. Every drill-down can be reversed. A rejected change proposal must not alter state."

> "All 44 are evidenced by automated tests. 930 tests total."

> `[DISCLAIM]` "Honest limits: benchmarked up to 2,500 nodes. Linear scaling for projection and trace. Compare has a known path explosion risk on dense graphs — we've documented this as a sharp edge."

> `[PAUSE]` "This is not GraphRAG. Not an ontology store. Not a UI framework. Not a product launch."

> `[SLOW]` "It's a proof-of-mechanism — demonstrating that you can compute deterministically over engineering knowledge graphs, with tested invariants and measured operational limits."

`[AVOID]`: Don't end with a feature list. Don't promise roadmap items. End on what IS, not what WILL BE.

---

## 15-Minute Version

### Beat 1: Opening problem (0:00–2:00)

**Say**:

> "Every engineering team builds graph-shaped knowledge — specs, code, tests, constraints. But we almost never compute over that structure."

> "Let me make this concrete. Think of an authentication module. You have requirements: 'users must log in with credentials.' You have a concept: credential validation. You have an invariant: no plaintext passwords. You have code: authService.js. You have tests: login-tests."

> `[SLOW]` "These form a graph. Requirements → concepts → invariants → code → tests. And the natural question is: can I trace from requirement to test evidence? Are there multiple routes? Are there gaps?"

> "The current answer to these questions is: manual, fragile, tool-dependent."

`[AVOID]`: Don't start with the solution. Start with the problem. Don't mention Meaning Engine by name until beat 2.

**Transition**: "Meaning Engine is built to answer these questions computationally."

---

### Beat 2: System identity (2:00–4:00)

**Say**:

> "Meaning Engine is a deterministic computational substrate for typed semantic graphs. `[SLOW]` Concretely: you give it a typed graph, and it gives you back projections, traces, rival-path clusters, and gap reports."

> "Core operations — five of them:"

List slowly, one at a time:

> "Projection: a 5-step deterministic pipeline that produces a render-ready view from any graph plus a focus point."

> "Navigation: type-safe, reversible transitions — select, drill down, drill up, reset."

> "Trace: directed BFS to find a path between any two nodes."

> "Compare: finds all shortest paths and clusters them by structural signature."

> "Gap detection: when no path exists, suggests bridge candidates based on node-type pair heuristics."

> `[PAUSE]` "Now, what it is NOT."

> "Not GraphRAG — no LLM, no embeddings, no community summaries. Not an ontology database — no SPARQL, no OWL. Not a UI framework — the engine produces data structures, rendering is separate. Not an autonomous agent — operators are invoked explicitly."

> "Architecture: 5-step projection pipeline, BFS-based operators, immutable graph snapshots. The engine is world-agnostic — you bring any graph conforming to the JSON input contract, the engine computes."

`[AVOID]`: Don't rush through the NOT list. Each "not" should land separately. Don't say "substrate" again — you've already anchored it.

---

### Beat 3: Guarantees and evidence (4:00–7:00)

**Say**:

> "The engine makes a small number of public guarantees. Let me give you concrete examples before I give you the numbers."

Give 2–3 examples first:

> "Projection output always conforms to the ViewModel schema — 5 required keys, every time."

> "Every drill-down transition can be reversed by drill-up."

> "A rejected change proposal must not alter graph state."

> `[PAUSE]` "These are invariants. The engine has 44 of them, across 7 families. All 44 are evidenced by automated tests. Zero gaps."

> "930 automated tests across 41 test files. The full evidence audit is in the repo — INVARIANT_MATRIX.md maps every invariant to its test coverage."

`[SLOW]`:

> "One thing worth noting: during the evidence development process, we found and fixed 4 real bugs in the change protocol. The evidence work caught real bugs. That's the point of doing it seriously."

`[AVOID]`: Don't rattle off all 7 family names. Don't show the matrix slide until after the examples land.

---

### Beat 4: Operational limits (7:00–9:00)

**Say**:

> "We benchmarked the engine — 43 cases across synthetic and reference-world graphs."

> "Projection: under 1 millisecond for graphs under 500 nodes. Measured."

> "Trace: under 1 millisecond for graphs under 1,000 nodes. Measured."

> "Navigation: effectively instantaneous — under 50 microseconds for a sequence of 20 transitions."

> `[SLOW]` "Compare: fast on sparse, tree-like graphs — 1.4 ms on the 116-node documentation world, 3 paths found."

> `[DISCLAIM]` "But on dense, grid-like graphs, compare has a combinatorial path explosion. 70 paths on a 5×5 grid in 6 ms. 3,432 paths on an 8×8 grid in 752 ms. There is no built-in path count limit. We've documented this as a known sharp edge."

> "Important distinction: projection and trace performance is measured. Behavior at 5,000+ nodes is inferred from complexity analysis, not proven by measurement."

`[AVOID]`: Don't bury the compare limitation. Lead with the good numbers, then deliver the limitation honestly. Don't say "it's probably fine at scale" — say what you measured and what you didn't.

---

### Beat 5: Traceability case demo (9:00–13:00)

`[DEMO]` Switch to terminal.

**Say before running**:

> "Let me show you the engine on a concrete case. This is a traceability world modeling an authentication module — 21 nodes, 22 edges, 5 entity types. Small by design."

> `[DISCLAIM]` "21 nodes is a mechanism proof, not an industrial demo. I'll be explicit about that."

Run: `node --experimental-vm-modules worlds/traceability-world/demo.js`

Walk through output. For each scenario, pause and explain:

**S1 — Trace** (~1 min):

> "First: can we trace from the auth-login requirement to its test evidence? Yes — 2-hop path through the credential-validation concept. The path goes through the concept layer, not directly to code. This is structural depth."

**S2 — Rival paths** (~1 min):

> "Second: are there multiple routes? Yes — two rival paths. One goes through the concept layer (concept-heavy), one goes through the code layer (code-heavy). The engine clusters these by structural signature automatically."

**S3 — Gap detection** (~1.5 min):

> `[SLOW]` "Third: does the password-reset feature have test coverage? No path. The engine finds no route from spec:password-reset to any evidence node. This is a genuine gap."

> "The engine suggests bridge candidates — concept types that commonly connect specs to evidence. `[DISCLAIM]` These are heuristic hints from a type-pair lookup table, not structural analysis. They point in a direction, not to a specific solution."

**S4 — Invariant trace** (~30s):

> "Fourth: the no-plaintext invariant traces directly to hash-tests — 1-hop proved_by link. Constraints reach their evidence."

**S5 — Projection** (~30s):

> "Fifth: focused projection around auth-login shows 4 nodes, 3 neighbors, and a drill-down option. This is the local neighborhood view."

**After demo**:

> "Three things to note. One: no changes to the engine were needed — this world works with existing operators. Two: deterministic — run it again, same output. Three: 21 nodes is deliberate. The mechanism is the point, not the scale."

`[AVOID]`: Don't rush through S3 (gap detection). This is the most interesting scenario to most audiences. Don't apologize for 21 nodes — frame it as design choice.

---

### Beat 6: Boundaries and non-claims (13:00–14:00)

**Say**:

> "Let me be explicit about what this does NOT demonstrate."

> "The traceability world is 21 nodes — not industrial scale. No integration with external tools. No real-time graph updates. No automated gap remediation. Compare has no path count limit."

> `[SLOW]` "This is a proof-of-mechanism, demonstrated on a compact, honest case."

`[AVOID]`: Don't read the whole non-claims list. Pick the 3–4 most important. Don't sound apologetic — sound deliberate.

---

### Beat 7: Next steps (14:00–15:00)

**Say**:

> "What's next: a larger proof case — potentially the engine tracing its own codebase. A path count safety limit in compare. Memory profiling at scale. And eventually, a visual rendering layer and integration with external data sources."

> `[PAUSE]` "These are natural next directions, not commitments."

> "Thank you. I'm happy to take questions."

`[AVOID]`: Don't end with a feature promise. End with "these are directions, not commitments" and move to Q&A.

---

## Q&A delivery notes

When fielding questions, follow these rules:

1. **Repeat the question** before answering — buys time and ensures the audience heard it.
2. **If you don't know, say so** — "I don't have data on that" is better than improvising a claim.
3. **Reference artifacts, not memory** — "That's documented in OPERATIONAL_LIMITS.md" is more credible than reciting numbers.
4. **Tier 1 objections (O1–O3) — use the shortest safe answers** from `DELIVERY_RISK_NOTE.md`. Don't elaborate unless asked to.
5. **If challenged on novelty** — lead with "the composition and the evidence discipline, not any single algorithm." Don't defend individual algorithms.
6. **If challenged on scale** — lead with "we've measured up to 2,500 nodes. We haven't tested at 10,000. We say so explicitly." Don't infer what hasn't been measured.
7. **If asked about GraphRAG / LLM** — "No. The core is fully deterministic. There's an experimental LLM module explicitly marked non-public."

### Emergency answer for any question you're not prepared for

> "That's a fair question. I don't have specific data on that right now — let me note it and follow up. What I can say is [redirect to nearest safe claim]."
