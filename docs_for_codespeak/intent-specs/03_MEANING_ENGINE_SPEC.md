# Meaning Engine Spec

## Purpose

Define the core intent of the Meaning Engine as a knowledge runtime.

## Accepts

- Canonical statements (subject, predicate, object).
- Graph construction inputs derived from canonical statements.

## State

### GraphModel

- nodes: Set<Node>
- edges: Set<Edge>
- indices: nodesById, neighborsById, nodesByType

Properties:

- immutable;
- read-only;
- constructed from canonical statements.

## Behavior

- buildGraphFromStatements(statements) -> GraphModel
- getNodeById(id) -> Node
- getNeighbors(id) -> Node[]
- getNodesByType(type) -> Node[]

## Constraints

- GraphModel MUST NOT contain non-canonical (proposed/rejected) statements.
- GraphModel MUST NOT mutate after construction.
- GraphModel MUST be fully derived from canonical state.

## Output

A stable, queryable graph representation of canonical knowledge.

## Role in System

GraphModel is not the source of truth.

It is a compiled artifact derived from a deeper knowledge substrate.

## Interpretation

Meaning Engine functions as a knowledge compiler + runtime:

```text
Knowledge Log -> Evaluation -> Canonical Statements -> GraphModel
```

The graph is a projection-ready structure, not a mutable database.
