# Documentation World

A knowledge graph built from the system's own Notion documentation.

## What this is

Documentation World is a **test world** — a JSON graph that models the system's
documentation as a typed knowledge structure. It serves as:

- The first **real content graph** (as opposed to the structural/operational graph
  in `world/graph/universe.json`).
- A test bed for the engine on semantically rich, typed data.
- A self-referential proof: the system models its own knowledge.

## What this is NOT

- Not a replacement for `universe.json` (the authored world graph).
- Not a visualization target — this graph is not rendered in the 3D scene.
- Not a generated artifact — it is hand-curated from Notion pages.

## Files

| File | Description |
|------|-------------|
| `seed.nodes.json` | Array of node objects (pages, concepts, invariants, evidence, code artifacts) |
| `seed.edges.json` | Array of edge objects with typed relationships and layer classification |

## Schema

### Node types
`page`, `concept`, `invariant`, `spec`, `decision`, `evidence`, `drift_item`, `code_artifact`

### Core node fields
- `id` — stable identifier. For Notion pages: `id = notion_url`. For concepts: `concept:<slug>`.
- `type` — one of the node types above.
- `title` — human-readable name.
- `source` — `notion | repo | chat | opus_report`.
- `url` — Notion URL (for page nodes).
- `tags` — string array for classification.
- `status` — lifecycle status if applicable.

### Edge types

**Concept graph** (what is connected to what):
- `defines` — page defines/introduces a concept
- `constrains` — invariant constrains a spec or concept
- `refines` — page or concept refines/extends another
- `depends_on` — structural dependency
- `applies_to` — concept applies to another entity
- `implements` — code or evidence implements a concept

**Provenance graph** (why/where something comes from):
- `proved_by` — evidence proves an invariant or concept
- `reported_by` — history page reports an event
- `introduced_by` — entity introduced by a specific source
- `drift_against` — drift item against a target

### Edge fields
- `source` — source node id
- `target` — target node id
- `type` — edge type (see above)
- `layer` — `concept | provenance`
- `note` — optional explanation

## How to update the seed

1. **Manual curation.** Read new/changed Notion pages and add/update nodes and edges.
2. **Opus regeneration.** Ask the IDE agent to re-extract from Notion via MCP.
3. **Incremental.** Add new nodes/edges without removing existing ones (append-only preferred).

## ID stability rule

- Page node IDs are Notion URLs — they are stable as long as the page exists.
- Concept/invariant/evidence IDs use `type:slug` format — do not rename without updating all edges.
- Never reuse a deleted ID for a different entity.

## Scope

The seed targets 30–50 nodes and 40–120 edges. It is intentionally limited
to a connected subgraph suitable for a first projection experiment, not
exhaustive coverage of all documentation.
