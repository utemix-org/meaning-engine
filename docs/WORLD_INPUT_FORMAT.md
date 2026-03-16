# World Input Format (v0.1)

A **world** is a directory containing two JSON files: `seed.nodes.json` and `seed.edges.json`.

## seed.nodes.json

A JSON array of node objects. Each node must have:

| Field    | Type   | Required | Description |
|----------|--------|----------|-------------|
| `id`     | string | yes      | Globally unique identifier |
| `type`   | string | yes      | Node type (open vocabulary) |
| `title`  | string | yes      | Human-readable label |
| `status` | string | no       | `"active"` (default) or `"legacy"` |

Additional fields are allowed and preserved (e.g. `source`, `tags`, `url`).

```json
[
  { "id": "concept:gravity", "type": "concept", "title": "Gravity", "status": "active" },
  { "id": "spec:newton-laws",  "type": "spec",    "title": "Newton's Laws" }
]
```

### ID conventions

IDs are arbitrary strings. Common patterns:

- `concept:<name>` — abstract idea
- `spec:<name>` — specification or document
- `evidence:<name>` — empirical test or proof
- `invariant:<name>` — formal constraint
- `code_artifact:<name>` — code file or module
- Full URLs (e.g. Notion page IDs) are also valid

### Open vocabulary

Node types and edge types are **not** constrained by a fixed ontology. You define whatever types make sense for your domain. The engine treats them as opaque labels.

## seed.edges.json

A JSON array of edge objects. Each edge must have:

| Field    | Type   | Required | Description |
|----------|--------|----------|-------------|
| `source` | string | yes      | ID of the source node |
| `target` | string | yes      | ID of the target node |
| `type`   | string | yes      | Edge type (open vocabulary) |

Optional fields:

| Field   | Type   | Description |
|---------|--------|-------------|
| `layer` | string | Grouping hint (e.g. `"concept"`, `"provenance"`, `"code"`) |
| `note`  | string | Human-readable annotation |

```json
[
  { "source": "spec:newton-laws", "target": "concept:gravity", "type": "defines", "layer": "concept" },
  { "source": "concept:gravity",  "target": "evidence:apple-test", "type": "proved_by", "layer": "provenance" }
]
```

## Validity rules

1. Every `source` and `target` in edges must refer to an existing node `id`.
2. Node IDs must be unique within the file.
3. Self-loops (`source === target`) are allowed but discouraged.
4. Duplicate edges (same source + target + type) are merged by operators.
5. Both files must be valid JSON arrays (not objects).

## Edge directionality

Edges are **directed**: `source → target`. This is significant — the `trace` operator performs a directed BFS, so `trace(A, B)` may succeed while `trace(B, A)` fails. Operators like `compare` use undirected traversal for finding rival paths.

## Loader

To load a world programmatically:

```javascript
import { readFileSync } from 'fs';
import { GraphModel } from 'meaning-engine';

const nodes = JSON.parse(readFileSync('my-world/seed.nodes.json', 'utf-8'));
const edges = JSON.parse(readFileSync('my-world/seed.edges.json', 'utf-8'));
const graph = { nodes, edges };
```
