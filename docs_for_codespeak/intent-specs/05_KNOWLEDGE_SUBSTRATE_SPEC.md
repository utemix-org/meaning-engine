# Knowledge Substrate Spec

## Purpose

Define the underlying system of knowledge evolution and canonicalization.

## Accepts

- Statement {subject, predicate, object}
- Event {type: propose | approve | reject}

## State

- log: Event[]
- canonicalStatements: Statement[]

## Behavior

- propose(statement) -> append Event
- approve(statement) -> mark as canonical
- reject(statement) -> mark as rejected
- evaluate(log) -> canonicalStatements

## Constraints

- canonicalStatements MUST be derived only from approved events.
- evaluate(log) MUST be deterministic.
- repeated evaluation MUST produce identical results.

## Output

- canonicalStatements

## Role in System

The knowledge substrate is the source of truth.

GraphModel is derived from canonicalStatements.

## Interpretation

This is an event-sourced model of knowledge:

```text
Events -> Log -> Evaluation -> Canonical State
```

It separates knowledge from its admission process.
