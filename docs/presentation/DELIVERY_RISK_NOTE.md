# Delivery Risk Note — Engineering Presentation v1.1

A compact note for the presenter: what to say carefully, what to proactively disclaim, and which audience questions are most important to prepare for.

---

## 1. Objections inventory

Prioritized by trust-damage risk (highest first).

### Tier 1 — Trust-destroying if answered poorly

| # | Objection | Risk | Why it's dangerous |
|---|-----------|------|--------------------|
| O1 | "What's actually novel here? BFS and subgraph extraction are textbook algorithms." | **Critical** | If the audience concludes the engine is just standard graph algorithms with a wrapper, every subsequent claim loses weight. |
| O2 | "21 nodes? I could do this in 20 lines of Python." | **Critical** | The traceability world is the only external proof case. If it looks trivial, the entire demo is dismissed. |
| O3 | "Who actually uses this? What's the target user?" | **High** | No users, no deployments, no integration story. If the audience expects production traction, they'll be disappointed immediately. |

### Tier 2 — Trust-eroding if not addressed

| # | Objection | Risk |
|---|-----------|------|
| O4 | "How is this different from Neo4j + Cypher / SPARQL?" | **High** — if the answer is vague, the audience assumes "it's a worse graph DB" |
| O5 | "Is this a library, a framework, or a product?" | **Medium** — "computational substrate" is abstract; engineers want to know what they'd `npm install` and call |
| O6 | "44 invariants sounds like padding. What kind of invariants?" | **Medium** — if examples aren't given, the number loses credibility |
| O7 | "Bridge candidates are just a hardcoded lookup table?" | **Medium** — yes, and being surprised by this is worse than admitting it upfront |

### Tier 3 — Important but manageable

| # | Objection | Risk |
|---|-----------|------|
| O8 | "What happens on a 10,000-node graph?" | **Low-medium** — honest answer exists (measured up to 2,500, linear for projection/trace, compare has known risk) |
| O9 | "Is there an LLM inside?" | **Low** — clear answer exists (no; experimental module is non-public) |
| O10 | "What about adversarial/malicious graphs?" | **Low** — documented sharp edge (compare has no cap) |

---

## 2. Weak-point analysis of P1

### WP1: "Computational substrate" is too abstract for a first encounter

**Where**: appears 4+ times across all docs (narrative §2, talk outline §2, claims sheet, demo flow).

**Problem**: Engineers hearing "computational substrate" for the first time will either (a) think it's a buzzword, or (b) not know what to do with it. It's precise but not grounding.

**Fix**: On first use, immediately follow with a concrete sentence: "You give it a graph, you get back projections, traces, and gap reports." After that, "substrate" is anchored.

### WP2: "Any typed semantic graph" is overclaiming

**Where**: Claims sheet — "The engine works on any typed semantic graph without modification."

**Problem**: The engine works on graphs that conform to the input contract (nodes with `id` and `type`, edges with `source` and `target`). Arbitrary "typed semantic graphs" (e.g., RDF, property graphs with complex schemas) are not supported without adaptation.

**Fix**: Change to "any graph that conforms to the JSON input contract."

### WP3: The "what's novel?" question is not in the Q&A

**Where**: TALK_OUTLINE.md Q&A section.

**Problem**: This is the most dangerous question (O1) and the current Q&A doesn't prepare for it. The existing questions ("How does this differ from a graph DB?", "Why not Neo4j?") are related but not the same as "What's novel?"

**Fix**: Add the question explicitly with a prepared answer that distinguishes the engine from raw graph algorithms.

### WP4: 5-minute talk tries to show 3 demo results in 2 minutes

**Where**: TALK_OUTLINE.md, 5-minute version, §3.

**Problem**: Showing trace, gap, AND rival paths in 2 minutes will feel rushed. The audience won't absorb three concepts that fast.

**Fix**: Show 2 results (trace + gap). Mention rival paths verbally if time permits.

### WP5: Invariant families are listed but never described

**Where**: PRESENTATION_NARRATIVE.md §4, TALK_OUTLINE.md §3.

**Problem**: "44 invariants across 7 families" invites the objection O6 ("what kind of invariants?"). Without at least one-line descriptions, the number looks like padding.

**Fix**: Add a compact example table showing 1 representative invariant per family.

### WP6: No answer prepared for "who uses this?"

**Where**: Q&A section of TALK_OUTLINE.md.

**Problem**: The audience will expect at least an answer about target users, even if it's "this is pre-production." Not having an answer prepared looks evasive.

**Fix**: Add Q&A entry for "Who uses this?" with honest answer.

### WP7: Bridge candidates described as "suggestions" but are actually a lookup table

**Where**: CLAIMS_AND_NONCLAIMS.md — "Candidates are type-pair heuristics, not graph-structural analysis."

**Problem**: This is correctly described in the non-claims section but the narrative (§2, gap detection) says "the engine suggests bridge concepts that could close the gap" — which sounds smarter than a hardcoded map.

**Fix**: Add parenthetical "(based on node-type pair heuristics)" to the narrative description of gap detection.

---

## 3. Shortest safe answers for the 5 hardest questions

### "What's actually novel here?"

> "The individual algorithms are standard — BFS, subgraph extraction, path enumeration. What the engine contributes is the combination: a deterministic pipeline that takes a typed graph and produces projections, rival-path clusters, and gap reports with bridge candidates, all with 44 tested invariants. The novelty is the composition and the evidence discipline, not any single algorithm."

### "21 nodes? Why should I take this seriously?"

> "The world is deliberately small — it proves the mechanism, not the scale. The same operations run unmodified on a 116-node graph built from the engine's own documentation, and benchmarks go up to 2,500 nodes. If the mechanism works on any graph that fits the input contract, the value is in the computation, not the size of the demo."

### "Who uses this?"

> "No external users yet. This is pre-production engineering work with a serious evidence foundation. The immediate goal is to demonstrate that the computational model works and to characterize its operational envelope honestly. Production adoption is a future step, not a current claim."

### "How is this different from a graph database?"

> "A graph database stores and queries. This engine computes: it takes a graph and produces projections with focus-dependent subgraph extraction, rival-path clustering with structural signatures, and gap detection with bridge candidates. These are domain-specific computations that a query language doesn't express naturally. The engine is storage-agnostic — you could put the graph in Neo4j and still need these computations on top."

### "What's novel compared to existing traceability tools?"

> "Existing traceability tools (DOORS, Jama) manage requirements and links. This engine computes over arbitrary typed graphs — it finds rival paths between any two nodes, clusters them by structural signature, and detects gaps with bridge candidates. It's not a requirements tool; it's a computational layer that could sit underneath one."

---

## 4. Hostile but fair reviewer perspective

A reviewer who is technically strong and intellectually honest would likely say:

> "The evidence discipline is genuinely unusual — 44 invariants with full test coverage is rare for a 0.x project. The benchmark honesty is good (proactively documenting the compare explosion). But the proof case is too small to be persuasive on its own, and the 'computational substrate' framing makes it hard to understand what I'd actually build with this. The project would benefit from one integration example showing the engine embedded in a real workflow, even a simple one."

**What this tells us**:
- The evidence story is a genuine strength — lead with it
- The "what do I do with it?" gap is real — address it in the opening, not the close
- An integration example (even toy-scale) would be more persuasive than a larger traceability world

---

## 5. Delivery risk summary

### Say carefully

| Topic | Risk | Guidance |
|-------|------|----------|
| "Computational substrate" | Sounds like a buzzword if not grounded | Always follow with a concrete example on first use |
| "44 invariants" | Sounds like padding if not illustrated | Give 2-3 specific examples before citing the number |
| "World-agnostic" | Implies any graph format works | Clarify: "any graph that conforms to the JSON input contract" |
| "Gap detection" | Implies intelligent analysis | Clarify: "based on node-type pair heuristics" (not structural reasoning) |
| "Bridge candidates" | Implies actionable recommendations | Clarify: "directional hints from a type-pair lookup, not graph analysis" |

### Proactively disclaim

1. **Scale**: "We've measured up to 2,500 nodes. We haven't tested at 10,000."
2. **Users**: "No external users yet. This is engineering groundwork."
3. **Compare limitation**: "The compare operator can be slow on dense graphs — we've documented this as a known sharp edge."
4. **Traceability world size**: "21 nodes is a mechanism proof, not an industrial demo."
5. **Bridge candidates**: "These are heuristic suggestions, not structural analysis."

### Most important questions to prepare for

1. **"What's novel?"** — If answered poorly, everything else loses weight. See shortest safe answer above.
2. **"Who uses this?"** — Honest pre-production answer is fine, but must be said confidently, not apologetically.
3. **"Why not just Neo4j?"** — Must articulate specific computations that a query language doesn't express.
4. **"What would I build with this?"** — Need at least one concrete integration scenario, even hypothetical.
5. **"21 nodes?"** — Must frame as deliberate choice, not inability to go larger.
