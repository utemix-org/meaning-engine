# Projection Spec (Repo Snapshot)

> **Status**: Descriptive snapshot of the projection specification. The canonical source is the internal Notion spec; this file captures the essential design contract for repository-local reference.
>
> **Notion origin**: `435b2b96d0ec40b2a7262b1151a23380`

## Purpose

The Projection Spec defines the 5-step deterministic pipeline that transforms a graph + focus point into a render-ready ViewModel.

## Pipeline steps

| Step | Function | Input | Output |
|------|----------|-------|--------|
| 1 | `validateInputs` | graph, focus, params | Validated inputs or error |
| 2 | `resolveFocus` | graph, focusId | Resolved focus node or null |
| 3 | `computeVisibleSubgraph` | graph, focus | Visible nodes + edges |
| 4 | `deriveSemanticRoles` | visible subgraph, focus | Nodes with semantic roles (hub, satellite, bridge) |
| 5 | `buildViewModel` | enriched subgraph, focus | ViewModel with nodes, edges, focus, stats, meta |

## Key invariants

| ID | Rule |
|----|------|
| INV-1 | ViewModel always conforms to the output schema (5 required keys: `nodes`, `edges`, `focus`, `stats`, `meta`) |
| INV-2 | Source node IDs are preserved through projection (identity stability) |
| INV-3 | Same inputs always produce the same output (determinism) |
| INV-4 | Projection does not mutate the input graph (immutability) |
| INV-7 | Projection produces a valid result for any well-formed input, including empty graphs (totality) |

## ViewModel output shape

```
{
  nodes: Array<{ id, type, label, role, ... }>,
  edges: Array<{ source, target, type, ... }>,
  focus: { nodeId, type, depth } | null,
  stats: { totalNodes, visibleNodes, totalEdges, visibleEdges },
  meta: { projectedAt, pipelineVersion, focusId }
}
```

## Implementation

- Entry point: `src/core/projection/projectGraph.js`
- Each step: `src/core/projection/{validateInputs,resolveFocus,computeVisibleSubgraph,deriveSemanticRoles,buildViewModel}.js`
- Tests: `src/core/projection/__tests__/projectGraph.test.js` (34 tests), `projectionMetadata.test.js` (32 tests)
