# Navigation Spec (Repo Snapshot)

> **Status**: Descriptive snapshot of the navigation specification. The canonical source is the internal Notion spec; this file captures the essential design contract for repository-local reference.
>
> **Notion origin**: `b997b23c7bb94390be3351504e64d1fd`

## Purpose

The Navigation Spec defines how users move through a projected graph using type-safe, reversible transitions.

## Transition types

| Transition | Action | Reversible by |
|------------|--------|---------------|
| `SELECT` | Set focus to a specific node | `RESET` |
| `DRILL_DOWN` | Navigate into a node's neighborhood | `DRILL_UP` |
| `DRILL_UP` | Return to previous focus level | `DRILL_DOWN` |
| `RESET` | Clear focus, return to full graph view | — |

## Key invariants

| ID | Rule |
|----|------|
| NAV | Every `DRILL_DOWN` can be reversed by `DRILL_UP` |
| NAV | Transitions are type-safe: only valid transition types are accepted |
| NAV | `RESET` always returns to a well-defined initial state |
| NAV | Navigation state is deterministic given the same sequence of transitions |

## State shape

```
{
  focusNodeId: string | null,
  focusStack: Array<string>,
  depth: number
}
```

## Implementation

- Entry point: `src/core/navigation/applyTransition.js`
- Tests: `src/core/navigation/__tests__/applyTransition.test.js` (24 tests)
