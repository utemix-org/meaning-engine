# Make Your First World (5 minutes)

This guide walks you through creating a minimal world and running operators on it.

## 1. Create a directory

```bash
mkdir worlds/my-first-world
```

## 2. Define nodes

Create `worlds/my-first-world/seed.nodes.json`:

```json
[
  { "id": "spec:cooking-basics",    "type": "spec",      "title": "Cooking Basics" },
  { "id": "concept:heat-transfer",  "type": "concept",   "title": "Heat Transfer" },
  { "id": "concept:maillard",       "type": "concept",   "title": "Maillard Reaction" },
  { "id": "invariant:temp-control", "type": "invariant",  "title": "Temperature Control" },
  { "id": "evidence:sear-test",     "type": "evidence",  "title": "Searing Experiment" },
  { "id": "concept:seasoning",      "type": "concept",   "title": "Seasoning" }
]
```

Six nodes, four types. Notice that `concept:seasoning` has no edges — it's intentionally isolated.

## 3. Define edges

Create `worlds/my-first-world/seed.edges.json`:

```json
[
  { "source": "spec:cooking-basics",    "target": "concept:heat-transfer",  "type": "defines" },
  { "source": "spec:cooking-basics",    "target": "concept:maillard",       "type": "defines" },
  { "source": "concept:heat-transfer",  "target": "invariant:temp-control", "type": "constrains" },
  { "source": "concept:maillard",       "target": "invariant:temp-control", "type": "constrains" },
  { "source": "invariant:temp-control", "target": "evidence:sear-test",     "type": "proved_by" }
]
```

This gives you:
- A **path** from `spec:cooking-basics` to `evidence:sear-test` (3 hops, through either heat-transfer or maillard)
- **Rival explanations** between the spec and the evidence (two routes via different concepts)
- A **gap** between the main cluster and `concept:seasoning` (isolated node)

## 4. Run operators

### Trace a path

```javascript
import { readFileSync } from 'fs';
import { trace } from '../../operators/trace.js';

const nodes = JSON.parse(readFileSync('worlds/my-first-world/seed.nodes.json', 'utf-8'));
const edges = JSON.parse(readFileSync('worlds/my-first-world/seed.edges.json', 'utf-8'));
const graph = { nodes, edges };

const result = trace(graph, 'spec:cooking-basics', 'evidence:sear-test');
console.log(result);
// { status: 'path', hops: 3, path: [...] }
```

### Detect a gap

```javascript
const gap = trace(graph, 'spec:cooking-basics', 'concept:seasoning');
console.log(gap);
// { status: 'no_path', hops: -1, ... }
```

### Find rival paths

```javascript
import { compare } from '../../operators/compare.js';

const rivals = compare(graph, 'spec:cooking-basics', 'evidence:sear-test');
console.log(rivals.pathCount);  // 2
console.log(rivals.paths.map(p => p.nodeTitles));
// Two routes: one via Heat Transfer, one via Maillard Reaction
```

## 5. What's next

- See [WORLD_INPUT_FORMAT.md](./WORLD_INPUT_FORMAT.md) for the full spec
- Look at `worlds/authored-mini-world/` for a more realistic example (25 nodes, 4 built-in scenarios)
- Look at `worlds/documentation-world/` for an extracted-from-code example (116 nodes)
