# Tiny World

A minimal 6-node example world for testing and as a starting template.

## Domain

A small "cooking science" graph:

```
spec:cooking-basics
  ├──defines──► concept:heat-transfer ──constrains──► invariant:temp-control ──proved_by──► evidence:sear-test
  └──defines──► concept:maillard ──────constrains──┘

concept:seasoning  (isolated — no edges)
```

## Built-in situations

- **Path exists:** `spec:cooking-basics` → `evidence:sear-test` (3 hops, two routes)
- **Rival explanations:** two paths via different concepts (heat-transfer vs maillard)
- **GAP:** `concept:seasoning` is isolated — no path from the main cluster

## How to use

Run the smoke workflow:

```bash
node operators/runWorldSmokeWorkflow.js worlds/tiny-world
```

## How to copy and modify

```bash
cp -r worlds/tiny-world worlds/my-world
# Edit seed.nodes.json and seed.edges.json
# Run: node operators/runWorldSmokeWorkflow.js worlds/my-world
```

See [WORLD_INPUT_FORMAT.md](../../docs/WORLD_INPUT_FORMAT.md) for the seed file spec.
