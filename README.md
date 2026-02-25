# MeaningEngine

Universal semantic graph engine for building knowledge systems.

## Overview

MeaningEngine is an abstract platform for working with semantic graphs. It provides:

- **Schema validation** — define and validate node/edge types
- **Structural invariants** — ensure graph integrity
- **Change protocol** — controlled graph evolution with proposals
- **Snapshots** — graph state history and diffing
- **Projections** — multiple views of the same graph (OWL, RAG, Dev)
- **LLM reflection** — AI-assisted graph analysis and suggestions
- **Operators** — catalog-based queries through graph nodes

## Installation

```bash
npm install meaning-engine
```

## Quick Start

```javascript
import { MeaningEngine, WorldAdapter } from 'meaning-engine';

// Define your world schema
const schema = {
  name: "my-world",
  version: "1.0.0",
  nodeTypes: [
    { id: "concept", description: "A concept node" },
    { id: "relation", description: "A relation node" }
  ],
  edgeTypes: [
    { id: "connects", description: "Connects two nodes" }
  ]
};

// Define initial graph data
const seed = {
  nodes: [
    { id: "node-1", type: "concept", label: "First Concept" }
  ],
  edges: []
};

// Create world adapter and engine
const world = WorldAdapter.fromJSON(schema, seed);
const engine = new MeaningEngine(world);

// Use the engine
console.log(engine.getStats());
console.log(engine.isValidNodeType("concept")); // true
console.log(engine.getNodeById("node-1"));
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      MeaningEngine                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Schema    │  │  Invariants │  │  Snapshots  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Protocol   │  │ Projections │  │     LLM     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      WorldAdapter                            │
│         (Your schema.json + seed.json + catalogs)           │
└─────────────────────────────────────────────────────────────┘
```

## Key Concepts

### World Contract

A world must implement the `WorldInterface`:

```javascript
interface WorldInterface {
  getSchema(): Schema;      // Node/edge type definitions
  getGraph(): Graph;        // Nodes and edges
  getCatalogs?(): Catalogs; // Optional catalog data
}
```

### Projections

Different views of the same graph:

- **OWLProjection** — export to OWL/RDF format
- **GraphRAGProjection** — prepare context for RAG queries
- **DevProjection** — debugging and analysis view
- **ReflectiveProjection** — self-analysis capabilities

### Change Protocol

Controlled graph mutations:

```javascript
import { ChangeProtocol, createProposal } from 'meaning-engine/core';

const protocol = new ChangeProtocol(graph, schema);
const proposal = createProposal({
  type: 'ADD_NODE',
  payload: { id: 'new-node', type: 'concept', label: 'New' }
});

const simulation = protocol.simulate(proposal);
if (simulation.valid) {
  protocol.apply(proposal);
}
```

### Operators (Epistemic)

Query catalogs through graph structure:

```javascript
// Project catalog entries through a graph node
const entries = engine.project('domain-music', 'vst-plugins');

// Filter results
const synths = engine.filter(entries, { category: 'synthesizer' });
```

## API Reference

### MeaningEngine

| Method | Description |
|--------|-------------|
| `getVersion()` | Engine version |
| `getWorldName()` | Connected world name |
| `getSchema()` | World schema |
| `getGraph()` | World graph |
| `isValidNodeType(type)` | Check if node type is valid |
| `isValidEdgeType(type)` | Check if edge type is valid |
| `validateNode(node)` | Validate node against schema |
| `getNodeById(id)` | Get node by ID |
| `getNeighbors(id)` | Get node neighbors |
| `getStats()` | Engine statistics |
| `project(nodeId, catalogId)` | Project catalog through node |
| `filter(entries, predicate)` | Filter catalog entries |

### Static Methods

| Method | Description |
|--------|-------------|
| `MeaningEngine.getSpecification()` | Platform specification |
| `MeaningEngine.getCapabilities()` | Platform capabilities |
| `MeaningEngine.toLLMContext()` | Compressed context for LLM |

## License

MIT © utemix-lab
