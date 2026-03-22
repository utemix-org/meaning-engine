# Failure Handling Checklist — Meaning Engine

What to do when things go wrong during delivery. Each failure scenario has a detection, response, and recovery.

---

## 1. Demo failures

### F1: Demo command fails to run

**Detection**: Error message in terminal after running the demo command.

**Likely causes**: wrong directory, missing `npm install`, Node version mismatch, file system permissions.

**Response** (pick one, in order of preference):

1. **Try fixing live** (only if it's a trivial issue like wrong directory):
   ```bash
   cd meaning-engine
   node --experimental-vm-modules worlds/traceability-world/demo.js
   ```
   Time limit: 15 seconds. If not fixed in 15 seconds, move to option 2.

2. **Switch to pre-run output**: "I ran this earlier — let me show you the results." Navigate to a terminal tab with pre-existing demo output (you should have one from preflight).

3. **Switch to Fallback A (benchmarks)**: "Let me show you the performance data instead."
   ```bash
   node --experimental-vm-modules benchmarks/bench.js
   ```

4. **Switch to Fallback C (tests)**: "Let me show you the test suite."
   ```bash
   npm test
   ```

5. **Abandon demo entirely**: "The demo environment has an issue. Let me walk you through the results verbally — I have the data." Then narrate from DEMO_FLOW.md output examples.

**Say to audience**: "Let me switch to a backup." Do NOT apologize repeatedly. One "bear with me" is fine. Then move on.

### F2: Demo output is noisy or hard to read

**Detection**: Audience squints. Output has warnings, debug logs, or extra whitespace making key results hard to find.

**Response**:

1. **Narrate over it**: "Let me highlight the key lines." Point at or read aloud the specific results.
2. **Use pre-run clean output**: Switch to a terminal where you ran the demo earlier and scrolled to the right position.
3. **Read from notes**: "The key result is: the engine found a 2-hop path from auth-login to login-tests through the concept layer."

**Prevention**: During preflight, run the demo and verify the output is clean. If Node.js warnings appear (like `--experimental-vm-modules`), they scroll past quickly — just don't draw attention to them.

### F3: Demo runs but results look different than expected

**Detection**: Numbers, paths, or scenario outcomes don't match what's in the script.

**Response**:

1. **If the difference is cosmetic** (different formatting, extra whitespace): ignore it. Don't mention it.
2. **If the result is substantively different** (wrong path, wrong count): "Interesting — let me check if there's been a recent change." Don't try to debug live.
3. **Switch to talking points**: "The expected result here is [read from DEMO_FLOW.md]. Let me show you the test that verifies this behavior."

**Prevention**: Run preflight step 4 completely. If any expected line is missing, investigate BEFORE the presentation.

---

## 2. Time failures

### F4: Time is cut short (told to wrap up early)

**Response by remaining time**:

| Time left | What to do |
|-----------|------------|
| 3+ min | Skip to close (beat 4/7). Deliver disclaimers + one key result. |
| 1–3 min | One sentence: "The engine traces engineering knowledge deterministically, with 44 tested invariants and measured limits. Proof-of-mechanism, not a product launch." |
| < 1 min | "Thank you. The repo is public and everything is reproducible." Stop. |

**Rule**: Never try to speed-talk through remaining material. Cut cleanly.

### F5: Running long (behind schedule, no external cut)

**Detection**: Check your timer at each beat transition. See TIMING_PLAN.md for cut points.

**Response**:

| Situation | Cut |
|-----------|-----|
| Beat 1 over 2:00 (15-min) | Skip "current answer is manual, fragile" |
| Beat 3 over 7:00 (15-min) | Drop operational limits (beat 4) entirely |
| Beat 5 (demo) over 13:00 | Merge beats 6+7 into one sentence |
| Beat 3 (demo) over 3:30 (5-min) | Skip rival paths mention |

**Rule**: Always protect the close. Better to cut middle content than to skip disclaimers.

### F6: Interrupted after 3 minutes (salvage plan)

If cut off mid-talk due to any reason:

> "The core point: you can compute deterministically over engineering knowledge graphs — trace, compare, find gaps — with 44 tested invariants and measured limits. The repo is public, everything is reproducible."

Stop. Don't try to squeeze more in.

---

## 3. Audience pressure failures

### F7: Audience pushes hard on "what's novel?"

**Detection**: Someone asks "What's novel?" and isn't satisfied with the first answer.

**Response escalation**:

1. **First answer** (15s): "The composition and the evidence discipline, not any single algorithm."

2. **If pressed** (30s): "The individual algorithms are standard — BFS, subgraph extraction. What's unusual is composing them into a deterministic pipeline with 44 tested invariants, producing projections, rival-path clusters, and gap reports from any typed graph. The novelty claim is about the composition and the evidence discipline."

3. **If still pressed** (15s): "That's fair — if the value to you is in novel algorithms, this isn't that. The value proposition is the composition under tested guarantees. Whether that's compelling is a judgment call."

**Rule**: Don't get defensive. Concede gracefully after level 3 and move on.

### F8: Audience pushes hard on scale / 21 nodes

**Detection**: "21 nodes is toy-scale" or "this doesn't prove anything about real systems."

**Response escalation**:

1. **First answer**: "21 nodes is deliberate — it proves the mechanism. Benchmarks go up to 2,500 nodes. The operations are size-agnostic."

2. **If pressed**: "You're right that 21 nodes isn't industrially persuasive. The documentation-world has 116 nodes and the engine runs unmodified on it. Benchmarks show linear scaling up to 2,500 for projection and trace. We haven't tested at 10,000 — and we say so."

3. **If still pressed**: "A larger proof case is the next planned step. Today I'm showing the mechanism works, not that it's production-ready at scale."

**Rule**: Don't claim what you haven't measured. Acknowledge the limitation and redirect to what IS measured.

### F9: Audience asks about GraphRAG / LLM / AI

**Detection**: "Is this like GraphRAG?" or "Does it use an LLM?"

**Response**: Quick and definitive.

> "No. The core is fully deterministic. No LLM, no embeddings, no community summaries. There is an experimental LLM module explicitly marked non-public and excluded from the stable contract."

**If they ask why no LLM**: "Determinism is a design choice. We wanted to guarantee same inputs → same outputs, always. An LLM would break that."

**Rule**: Don't elaborate unless asked. Short, definitive answers are more credible here.

### F10: Audience asks about production readiness / users

**Detection**: "Who uses this in production?" or "Is this production-ready?"

**Response**:

> "No external users yet. This is pre-production engineering work. The core operations are tested and benchmarked; integration and scale are next steps. This is a proof-of-mechanism, not a product launch."

**Say confidently, not apologetically.** The audience respects honest pre-production work with evidence more than vague production claims.

### F11: Audience asks "what would I build with this?"

**Detection**: "What's the integration story?" or "How would I actually use this?"

**Response**:

> "Today it's a library — you import functions, pass graph data, get results. Concrete applications: a requirements traceability layer that shows which specs have test evidence and which don't. A dependency impact analyzer. An invariant coverage tracker. The engine provides the computation; you provide the graph and the interface."

**If pressed for a demo**: "We don't have an integration demo yet. That's a natural next step. Today I'm showing the computational foundation."

### F12: Unexpected technical question you can't answer

**Response**:

> "That's a fair question. I don't have specific data on that right now. What I can say is [redirect to nearest safe claim]. Let me note your question and follow up."

**Rule**: Never improvise a technical claim. "I don't know" is always better than a wrong answer in an engineering room.

---

## 4. Technical environment failures

### F13: Projector / screen not working

**Response**:
1. Talk without visuals. The talk is designed to be deliverable verbally.
2. If you have the demo output on your laptop, turn the laptop toward the audience (for small groups).
3. Read the key demo results aloud from notes.

### F14: Laptop crashes / freezes

**Response**:
1. If you have a phone with notes: deliver the minimum viable talk (3 minutes) from memory + phone notes.
2. If no backup: deliver the opening sentence + close from memory. Two minutes, done.

**Prevention**: Save a screenshot of the demo output to your phone as a backup.

### F15: Node.js / npm not available on presentation machine

**Response**: You should never need to install Node.js during a presentation. All demos should be pre-run on your own machine.

If presenting on someone else's machine:
1. Copy the repo + node_modules to the machine in advance.
2. Run preflight on that machine before your slot.
3. If all else fails, show pre-captured terminal output (screenshot or text file).

---

## 5. Quick reference: failure → action

| Failure | First action | Fallback |
|---------|-------------|----------|
| Demo won't run | Pre-run output tab | Verbal narration from DEMO_FLOW.md |
| Output is noisy | Narrate key lines | Switch to clean pre-run tab |
| Time cut to 3 min | Salvage sentence (F6) | Stop gracefully |
| Running long | Cut per TIMING_PLAN.md | Protect the close |
| "What's novel?" | Composition + evidence discipline | Concede after level 3 |
| "21 nodes?" | Deliberate + benchmarks up to 2,500 | Acknowledge, redirect to what's measured |
| "GraphRAG/LLM?" | "No. Fully deterministic." | One sentence, stop |
| "Who uses this?" | "No users yet — pre-production" | Say confidently |
| "What would I build?" | 3 concrete applications | "Integration demo is next step" |
| Can't answer a question | "I don't have data on that" | Note and follow up |
| Projector fails | Verbal delivery | Laptop turned to audience |
| Laptop crashes | Phone notes | Memory: opening + close |
