# Timing Plan — Meaning Engine

Realistic timing breakdowns for 5-minute and 15-minute versions. Includes optional cuts and demo-shortening guidance.

---

## 5-Minute Version

| Beat | Section | Target | Hard limit | Notes |
|------|---------|--------|------------|-------|
| 1 | Opening problem | 0:50 | 1:00 | If over 1:00, skip the second sentence about "manual traversal" |
| 2 | What ME does | 0:50 | 1:00 | Must say "concretely" sentence; can drop operation list |
| 3 | Live demo | 2:00 | 2:20 | Show 2 results (trace + gap); mention rivals only verbally if <3:30 |
| 4 | Close | 1:00 | 1:10 | Must include disclaimers; can drop the "not" list |
| — | **Total** | **4:40** | **5:00** | 20s buffer for transitions and terminal switching |

### Optional cuts if running long

| If at... | Cut |
|----------|-----|
| 1:10 after beat 1 | Drop "manual, fragile, tool-dependent" — go straight to "Let me show you" |
| 3:30 after beat 3 | Skip rival paths mention entirely |
| 4:15 after beat 4 starts | Drop the NOT list; say only "This is a proof-of-mechanism, not a product launch" |
| 4:45 | Say "930 tests, 44 invariants, all evidenced. Thank you." and stop |

### Demo shortening

The demo command runs 5 scenarios automatically. You only need to talk through 2:

1. **Trace result** — point at the 2-hop path line (30s)
2. **Gap result** — point at "NO PATH" and bridge candidates (45s)

Skip scenarios S2 (rival paths), S4 (invariant trace), S5 (projection) entirely during verbal walkthrough. The output scrolls past; audience doesn't need to read it.

If the demo output is already visible (pre-run), skip running the command live. Just narrate the pre-existing terminal output.

---

## 15-Minute Version

| Beat | Section | Target | Hard limit | Notes |
|------|---------|--------|------------|-------|
| 1 | Opening problem | 1:45 | 2:00 | Must include authentication module example |
| 2 | System identity | 1:45 | 2:00 | Must include NOT list and operations |
| 3 | Guarantees & evidence | 2:30 | 3:00 | Examples first, then numbers, then "4 bugs found" |
| 4 | Operational limits | 1:45 | 2:00 | Must include compare explosion; can drop navigation numbers |
| 5 | Demo | 3:30 | 4:00 | Walk all 5 scenarios; can shorten S4+S5 to 30s total |
| 6 | Boundaries | 0:45 | 1:00 | Pick 3–4 non-claims; don't read full list |
| 7 | Next steps | 0:45 | 1:00 | 3 items max; end on "directions, not commitments" |
| — | **Buffer** | 1:15 | — | For transitions, terminal switching, audience pauses |
| — | **Total** | **14:00** | **15:00** | |

### Optional cuts if running long

| If at... | Cut |
|----------|-----|
| 2:30 after beat 1 | Skip "current answer is manual, fragile" — transition directly |
| 5:00 after beat 2 | Combine beat 3 into beat 2: give 2 invariant examples, say "44 total, all evidenced" |
| 7:30 after beat 3 | Drop beat 4 (operational limits) entirely — mention "benchmarked up to 2,500 nodes" during close |
| 10:00 after beat 4 | Shorten demo to 3 scenarios: S1 (trace), S3 (gap), one other |
| 13:00 after beat 5 | Merge beats 6+7 into one sentence: "21 nodes is a mechanism proof, not industrial scale. Next: larger case, path limit, memory profiling. Thank you." |

### Demo shortening (15-min version)

Full walkthrough of all 5 scenarios targets 3:30. If behind schedule:

| Time available | Show |
|----------------|------|
| 3:30+ | All 5 scenarios |
| 2:30–3:30 | S1 (trace), S2 (rivals), S3 (gap) — mention S4/S5 verbally |
| 1:30–2:30 | S1 (trace) + S3 (gap) only — same as 5-min demo |
| < 1:30 | Show pre-run output, narrate S3 (gap) only — "this is the most interesting result" |

---

## Minimum viable talk (if only 3 minutes)

If time is severely limited or you're interrupted after your slot starts:

| Time | Say |
|------|-----|
| 0:00–0:30 | "Engineering knowledge forms a graph. We rarely compute over it." |
| 0:30–1:00 | "Meaning Engine: you give it a typed graph, you get projections, traces, and gap reports. Deterministic. No LLM." |
| 1:00–2:30 | Show pre-run demo output. Point at trace (path found) and gap (no path, bridge candidates). |
| 2:30–3:00 | "44 invariants, 930 tests, benchmarked up to 2,500 nodes. Proof-of-mechanism, not a product launch." |

This version sacrifices depth but lands the three essential points: what it does, what it found, and how seriously it's tested.

---

## If interrupted after 3 minutes (salvage plan)

If you're cut off mid-presentation (time ran out, fire alarm, moderator intervention):

**Immediate closing sentence** — pick ONE of these and deliver it clearly:

> "The core point: you can compute deterministically over engineering knowledge graphs — trace, compare, find gaps — with 44 tested invariants and measured limits. The repo is public, everything is reproducible."

OR (if you got through the demo):

> "You saw the engine find a real gap in test coverage and suggest what could bridge it. 930 tests, 44 invariants, benchmarked honestly. The repo is open."

**Then**: "Thank you. Happy to take questions offline." Stop.

Do NOT try to cram remaining content into 15 seconds. One clear sentence beats three rushed ones.
