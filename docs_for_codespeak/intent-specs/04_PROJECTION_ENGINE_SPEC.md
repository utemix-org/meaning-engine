# Projection Engine Spec

## Purpose

Define the projection mechanism that transforms graph state into user-facing views.

## Accepts

- GraphModel G
- Focus F
- Context C

## State

- VisibleSubgraph VS
- FocusState FS
- SemanticRoles R

## Behavior

1. validateInputs(G, F, C)
2. resolveFocus(G, F) -> FS
3. computeVisibleSubgraph(G, F) -> VS
4. deriveSemanticRoles(G, VS, FS) -> R
5. buildViewModel(G, VS, R, FS, C) -> ViewModel

## Core Function

```
P(G, F, C) -> ViewModel
```

## Constraints

- Projection MUST be total (always returns a valid ViewModel).
- Projection MUST NOT mutate GraphModel.
- Projection MUST depend only on G, F, C.

## Output

- ViewModel

## Role in System

Projection is the primary interaction mechanism with knowledge.

The graph is not directly consumed by users.

Users interact with projections.
