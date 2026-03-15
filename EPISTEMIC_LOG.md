# Epistemic Log

## What Is It?

The Epistemic Log is the engine's mechanism for tracking how knowledge evolves over time. Unlike a Git log (which records file changes), the Epistemic Log records **knowledge events** — proposals, verifications, approvals, and rejections of semantic statements.

## Core Distinction: Git Log vs. Epistemic Log

| Aspect | Git Log | Epistemic Log |
|--------|---------|---------------|
| Unit | File diff | Statement event |
| Granularity | Lines of code | `(Subject, Predicate, Object)` triples |
| Semantics | "What changed" | "What was proposed, by whom, and whether it was accepted" |
| Reduction | Checkout → file state | `evaluate(log)` → canonical statements → graph |
| Trust model | Commit authorship | Epistemic status (`PROPOSED → VERIFIED → CANONICAL`) |

## The Formula

```
Gₜ = BuildGraph(Canonical(Evaluate(Log₀..ₜ)))
```

The graph at any point in time is a **derived artifact** — it is computed by:

1. **Evaluating** the full event log up to time `t`
2. **Filtering** for canonical statements only
3. **Building** the graph from those statements

This means the graph is never edited directly. All changes flow through epistemic events.

## Statement Lifecycle

```
PROPOSED → VERIFIED → CANONICAL
                   ↘ REJECTED
```

- **PROPOSED**: A new statement has been suggested but not yet reviewed.
- **VERIFIED**: The statement has been checked for consistency but not yet approved.
- **CANONICAL**: The statement is accepted as part of the knowledge graph.
- **REJECTED**: The statement was reviewed and declined. Rejecting a statement never mutates the graph (invariant KE2).

## Event Types

Each event in the log has a type:

- `propose` — introduces a new statement
- `verify` — marks a statement as checked
- `approve` — promotes a statement to canonical status
- `reject` — declines a statement

## Key Invariants

- **KE1**: Only canonical statements produce graph nodes/edges.
- **KE2**: Reject never mutates the graph.
- **KE3**: Every graph change traces to an epistemic event.
- **KE4**: `evaluate()` is idempotent — running it twice produces the same result.
- **KE5**: Graph rebuild from canonical statements preserves ViewModel stability.

## Current Status

The knowledge substrate is implemented and tested at the engine level (`src/core/knowledge/`). It provides `propose()`, `verify()`, `approve()`, `reject()`, `evaluate()`, and `buildGraphFromStatements()` as pure functions.

The epistemic log is currently an internal mechanism used for testing knowledge evolution scenarios. It is not exposed as a user-facing feature or API endpoint. The schema and examples are available in the test suite.

## Why This Matters

Most knowledge systems treat their data as a mutable store — you edit records, and the previous state is lost (or hidden in an audit log). The Epistemic Log makes knowledge evolution **first-class**: every change is an event, every event has provenance, and the current state is always derivable from the full history.

This is the foundation for future capabilities like branching knowledge timelines, collaborative review workflows, and trust-weighted canonicalization — but those are not implemented yet.
