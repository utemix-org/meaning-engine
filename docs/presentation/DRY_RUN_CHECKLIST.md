# Dry-Run Checklist — Meaning Engine

A practical checklist for rehearsing the engineering presentation. Run through this completely at least once before any external delivery.

---

## 1. Preflight sequence (ordered — run in this order)

Run these commands and verify the expected outputs before the rehearsal. The full sequence takes under 2 minutes.

### Step 1: Verify repo state

```bash
cd meaning-engine
git status
```

**Expected**: clean working tree, on `main` branch (or the latest release branch).

```bash
node --version
```

**Expected**: Node.js v18+ (required for `--experimental-vm-modules`).

### Step 2: Install dependencies

```bash
npm install
```

**Expected**: clean install, no errors, no vulnerability warnings that would distract the audience.

### Step 3: Run test suite

```bash
npm test
```

**Expected**: `930 passed (930)`, 41 test files, 0 failed. If any test fails, DO NOT proceed with the demo until fixed.

**Record**: note the exact duration (should be ~7–10s). If it takes longer, something is wrong.

### Step 4: Run the traceability demo

```bash
node --experimental-vm-modules worlds/traceability-world/demo.js
```

**Expected output — verify these specific lines exist**:

- [ ] `Nodes: 21` and `Edges: 22`
- [ ] `supportsInspect: ok` and `supportsTrace: ok`
- [ ] Scenario 1: `PATH FOUND` with a 2-hop path through `credential-validation`
- [ ] Scenario 2: at least 2 rival paths listed
- [ ] Scenario 3: `NO PATH` for password-reset + bridge candidates listed
- [ ] Scenario 4: `PATH FOUND` for invariant:no-plaintext → evidence:hash-tests
- [ ] Scenario 5: projection output with `drillDown: true`

### Step 5: Run the benchmark harness

```bash
node --experimental-vm-modules benchmarks/bench.js
```

**Expected**: runs in ~5 seconds, prints a summary table. Verify the table is readable and no errors appear.

### Step 6: Run the documentation-world reasoning report (fallback B)

```bash
node operators/runReasoningReport.js --baseline
```

**Expected**: runs in ~2 seconds, shows trace/compare/gap results on the 116-node documentation-world. Verify no errors.

### Step 7: Pre-position terminal

After all commands succeed:
1. Open a fresh terminal
2. `cd` to the repo root
3. Run the traceability demo once so output is already visible
4. Size the terminal window appropriately (font size readable from 3 meters away if presenting in person)
5. Clear any distracting shell prompts or command history

---

## 2. What to memorize vs. what to read

### Memorize (these must come naturally)

- [ ] The opening sentence: "Engineering teams build knowledge structures every day — they form a graph. But we rarely compute over that graph."
- [ ] The grounding sentence after "substrate": "You give it a graph, you get projections, traces, and gap reports."
- [ ] The three numbers: 44 invariants, 930 tests, 2,500 nodes (benchmarked)
- [ ] The compare limitation framing: "70 paths on 5×5, 3,432 paths on 8×8"
- [ ] The closing: "Proof-of-mechanism, not a product launch"
- [ ] The shortest safe answer for "What's novel?": "The composition and the evidence discipline, not any single algorithm."

### OK to read or glance at notes

- [ ] The specific invariant examples (PROJ/NAV/CP)
- [ ] The exact demo output interpretation
- [ ] The non-claims list
- [ ] The operational limits numbers
- [ ] The next steps list

### Never read verbatim

- [ ] The delivery script — it's for rehearsal, not teleprompter use
- [ ] The claims table — summarize, don't recite
- [ ] The Q&A answers — paraphrase naturally

---

## 3. Rehearsal runs

### Solo rehearsal (do at least 2)

- [ ] **Run 1: Full 15-minute version with timer**
  - Set a visible countdown timer
  - Speak aloud, including demo narration
  - Note where you run long and which cuts you'd make
  - Record timestamps for each beat transition

- [ ] **Run 2: 5-minute version**
  - Same setup, strict 5-minute timer
  - Practice the 2-result demo (trace + gap only)
  - Practice the close under time pressure

### Timed rehearsal notes

After each run, note:

| Beat | Target time | Actual time | Issue |
|------|-------------|-------------|-------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |

---

## 4. Objection rehearsal

Practice answering these 5 objections aloud. Each answer should take 15–30 seconds. If you find yourself going over 30 seconds, you're explaining too much — use the shortest safe answer instead.

- [ ] **O1: "What's actually novel here?"**
  - Rehearse: "The composition and the evidence discipline, not any single algorithm."
  - Time yourself. If over 20s, you're over-explaining.

- [ ] **O2: "21 nodes? I could do this in 20 lines of Python."**
  - Rehearse: "The world proves the mechanism; benchmarks go up to 2,500 nodes; operations run unmodified at any size."
  - Don't apologize. Frame as design choice.

- [ ] **O3: "Who uses this?"**
  - Rehearse: "No external users yet — pre-production engineering work with measured evidence."
  - Say it confidently, not apologetically. Practice the confident delivery.

- [ ] **O4: "Why not just Neo4j?"**
  - Rehearse: "You could store the graph in Neo4j — you'd still need projection, rival-path clustering, and gap detection on top."
  - Don't trash Neo4j. Position as different layer.

- [ ] **O5: "What would I build with this?"**
  - Rehearse: "A requirements traceability layer. A dependency impact analyzer. An invariant coverage tracker. The engine computes, you decide the interface."
  - This is the weakest answer — rehearse it until it sounds natural.

---

## 5. Environment checklist

### Before leaving for the venue (if presenting externally)

- [ ] Laptop charged / charger packed
- [ ] Repo cloned and all preflight commands verified
- [ ] Wi-Fi NOT required (all demos run offline — verify this)
- [ ] Terminal font size increased (≥16pt for projector)
- [ ] Dark terminal theme (better projector contrast)
- [ ] Notifications disabled (Do Not Disturb mode)
- [ ] No distracting browser tabs open
- [ ] Presentation notes accessible (phone, printout, or second screen)
- [ ] Backup: `npm test` output screenshot on phone (fallback C)

### At the venue

- [ ] Test projector/screen connection before your slot
- [ ] Run the traceability demo once to verify it works on this machine/display
- [ ] Verify terminal output is readable from the back of the room
- [ ] Know where the timer/clock is visible during your talk

---

## 6. Post-rehearsal review

After each rehearsal, answer honestly:

1. Did I stay within time? Which beat ran long?
2. Did I remember to disclaim scale, bridge candidates, and users proactively?
3. Did I say "substrate" without immediately grounding it?
4. Did the demo output look readable or was it overwhelming?
5. Which objection answer felt weakest?
6. Would a non-technical observer understand what the engine does after beat 2?

If the answer to #6 is "no," the beat 2 grounding sentence needs work. Rehearse variations until one clicks.
