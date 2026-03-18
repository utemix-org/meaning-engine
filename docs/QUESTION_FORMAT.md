# Question Format (v1)

This document defines the canonical schema for **questions** — structured prompts that can be evaluated against a graph-structured world, its documentation, or its code.

Questions are the primary input material for cabin evaluation. They are metadata artifacts, not graph nodes (see [TENSION_EMBEDDING_POLICY.md](./TENSION_EMBEDDING_POLICY.md) for the distinction).

## Schema

Each question is a JSON object with the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique identifier (pattern: `Q-<taxonomy_code>-NNN`) |
| `status` | enum | yes | `open`, `resolved`, `stale` |
| `issue_type` | string | yes | Tension class from [ISSUE_TAXONOMY.md](./ISSUE_TAXONOMY.md) |
| `severity` | enum | yes | `P0` (blocks release), `P1` (should fix), `P2` (nice to fix) |
| `prompt` | string | yes | The question text (natural language) |
| `evidence_refs` | object | yes | Typed references to supporting evidence |
| `expected_output_shape` | string | yes | What a correct answer looks like (structure, not content) |

### Evidence references

The `evidence_refs` object contains typed pointers:

| Key | Type | Description |
|-----|------|-------------|
| `doc_refs` | string[] | Paths to documentation files (e.g. `docs/ARCHITECTURE.md`) |
| `code_refs` | string[] | Paths to source files with optional line hints (e.g. `src/core/GraphModel.js:254`) |
| `graph_refs` | string[] | Node or edge IDs in a world (e.g. `concept:projection`, `edge:defines-01`) |

All ref arrays may be empty but the object must be present.

### Status lifecycle

```
open → resolved    (question answered, tension closed)
open → stale       (question no longer relevant due to refactoring/removal)
resolved → open    (regression: tension reappears)
```

## Example

```json
{
  "id": "Q-DRM-001",
  "status": "resolved",
  "issue_type": "doc_runtime_mismatch",
  "severity": "P0",
  "prompt": "Does GraphModel.toJSON() preserve the `type` field on edges, as documented in WORLD_INPUT_FORMAT.md?",
  "evidence_refs": {
    "doc_refs": ["docs/WORLD_INPUT_FORMAT.md"],
    "code_refs": ["src/core/GraphModel.js:254"],
    "graph_refs": []
  },
  "expected_output_shape": "Boolean yes/no with file:line evidence from runtime and doc."
}
```

## Conventions

- Question IDs use the taxonomy code prefix (e.g. `DRM` for `doc_runtime_mismatch`).
- `prompt` should be answerable by inspecting the referenced evidence — no external knowledge required.
- Questions target a specific tension class; compound questions should be split.
- Questions are stored in `questions/` as JSON files, one file per tension set or batch.

## Relationship to other artifacts

| Artifact | Role |
|----------|------|
| Questions | Input prompts (this format) |
| [ISSUE_TAXONOMY.md](./ISSUE_TAXONOMY.md) | Classification vocabulary for `issue_type` |
| [TENSION_EMBEDDING_POLICY.md](./TENSION_EMBEDDING_POLICY.md) | How tension patterns manifest in graph structure |
| Worlds (`seed.nodes.json` / `seed.edges.json`) | Graph data where tensions may be embedded |
| Cabin eval (future) | Runtime that evaluates questions against worlds |
