# CFP Fields — Meaning Engine

## Title

Meaning Engine: Deterministic Computation Over Graph-Structured Knowledge

## Target audience

Software engineers, architects, and technical leads interested in:
- Structural reasoning over typed knowledge graphs
- Requirements-to-test traceability beyond link management
- Deterministic, reproducible computation without ML/AI dependency
- Evidence-grounded engineering practices

## Level

Intermediate. Assumes familiarity with graph data structures and engineering traceability concepts. No specialized math or ML background required.

## Format

Talk with live demo. Terminal-based demonstration using committed repository artifacts.

## Learning objectives

By the end of this talk, attendees will be able to:

1. Describe what deterministic projection over a typed semantic graph produces and why it differs from a graph database query
2. Explain how rival-path detection and gap analysis work on a concrete traceability example
3. Evaluate the operational limits of graph-based structural reasoning (what scales, what doesn't)
4. Distinguish between justified claims and common overclaims when presenting engineering tools

## Outline by minute

### 5-minute version

| Time | Section | Content |
|------|---------|---------|
| 0:00–1:00 | Problem | Engineering knowledge forms graphs; computation over structure is missing |
| 1:00–2:00 | Solution | Meaning Engine: projection, trace, compare, gap detection — deterministic, reproducible |
| 2:00–4:00 | Demo | Traceability world: spec→test trace + gap detection with bridge candidates |
| 4:00–5:00 | Close | 44 invariants, 930 tests, honest limits, non-claims |

### 15-minute version

| Time | Section | Content |
|------|---------|---------|
| 0:00–2:00 | Problem | Disconnected engineering knowledge; manual traceability; auth module as example |
| 2:00–4:00 | System identity | What ME is, what it isn't; 5-step projection pipeline; architecture overview |
| 4:00–7:00 | Guarantees | 44 invariants, 7 families; concrete examples; 930 tests; 4 bugs found by evidence |
| 7:00–9:00 | Limits | 43 benchmarks; linear scaling; compare path explosion; measured vs inferred |
| 9:00–13:00 | Demo | All 5 scenarios: trace, rivals, gap, invariant, projection |
| 13:00–14:00 | Boundaries | 21-node case; no integration; no real-time; proof of mechanism |
| 14:00–15:00 | Next steps | Larger case, path limit, memory profiling, visual rendering |

## Keywords

graph computation, deterministic projection, traceability, invariant testing, structural reasoning, knowledge engineering, gap detection

## Prerequisites for attendees

- Familiarity with graph structures (nodes, edges, directed traversal)
- Basic understanding of software testing and requirements traceability
- No ML/AI background required

## Materials provided

- Repository with all code, tests, benchmarks, and documentation
- Pre-generated baseline report (no installation required to read)
- Structured feedback template for post-talk observations
