# Intent Overview

## Core goal

Build a knowledge graph system where:

- knowledge is explicitly represented as statements;
- knowledge evolves through controlled epistemic operations;
- a canonical graph is derived from that process;
- user-facing views are produced by a projection engine.

## Core formula

Projection is the central operation:

```
P(Graph, Focus, Context) -> ViewModel
```

The graph itself remains stable, while views change depending on focus and context.

## Core components

### GraphModel

- immutable, read-only structure;
- contains only canonical knowledge;
- no mutation operations.

### Knowledge Substrate

- event-sourced log of statements and epistemic events;
- source of truth for what is proposed, accepted, or rejected.

### Evaluation

- transforms the log into canonical statements;
- deterministic;
- repeatable.

### Projection Engine

- computes visible subgraph;
- assigns semantic roles;
- builds view model.

### Epistemic Layer

- proposal / approval / rejection workflow;
- separates knowledge from its validation process.

## Key separation

The system enforces strict boundaries:

- canonical graph vs epistemic process;
- data vs interpretation;
- structure vs view.

## Result

A system where knowledge is not just stored, but:

- evolves through explicit operations;
- is observable as a graph;
- is navigable through projections;
- is explainable through its epistemic history.
