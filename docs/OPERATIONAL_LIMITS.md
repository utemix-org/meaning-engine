# Operational Limits

This document describes the measured and inferred runtime behavior of Meaning Engine's stable-core operations. It is intended for engineering audiences who need to understand what is fast, what is acceptable, and where risk lives.

**Key distinction:**

| Label | Meaning |
|-------|---------|
| **Measured** | Timed with the benchmark harness on synthetic and reference-world graphs |
| **Inferred** | Derived from code analysis (algorithmic complexity) without exhaustive measurement |
| **Unknown** | Not yet measured or analyzed with confidence |

All measurements were taken on a single developer laptop (Node.js v20, Windows x64). Numbers are indicative and environment-sensitive — they are not cross-machine performance guarantees.

---

## 1. Operations that appear cheap and stable

### GraphModel construction — O(n + m)

Builds internal `Map` and adjacency structures in a single pass.

| Graph size | Avg time |
|-----------|----------|
| 100 nodes / 99 edges | ~0.2 ms |
| 500 nodes / 499 edges | ~0.5 ms |
| 1,000 nodes / 999 edges | ~0.5 ms |
| 5,000 nodes / 4,999 edges | ~2.6 ms |

Linear scaling. No concern at current world sizes.

### Projection (`projectGraph`) — O(n + m) per call

The 5-step pipeline (validate → resolveFocus → computeSubgraph → deriveRoles → buildViewModel) processes all nodes and edges in a single pass. With focus, only the visible subgraph is materialized.

| Graph | No focus | With focus |
|-------|---------|------------|
| 10 nodes (test-world) | ~20 µs | ~15 µs |
| 100 nodes (grid) | ~70 µs | ~50 µs |
| 116 nodes (doc-world) | ~200 µs | ~75 µs |
| 400 nodes (grid) | ~350 µs | ~200 µs |
| 1,000 nodes (chain) | ~700 µs | ~300 µs |
| 2,500 nodes (grid) | ~2.6 ms | ~1.6 ms |

Linear scaling. Sub-millisecond for graphs under ~500 nodes. The two reference worlds (10 and 116 nodes) project in well under 1 ms.

### Navigation (`applyTransition`) — O(1) per transition

Pure state computation. A 20-step sequence (select → drillDown → drillUp → reset) completes in ~20–35 µs regardless of graph size. Navigation cost is negligible.

### `supportsInspect` / `supportsTrace` — O(n + m)

Simple node/edge type counting. Both complete in < 20 µs on the documentation world (116 nodes, 292 edges). Negligible cost.

### Trace (`trace`) — O(V + E) per BFS

Single directed BFS for the first shortest path. Falls back to undirected BFS and bridge candidate search if no path exists within `maxHops`.

| Graph | Avg time |
|-------|----------|
| chain-50 (50 nodes) | ~65 µs |
| chain-500 (500 nodes) | ~360 µs |
| chain-1,000 (1,000 nodes) | ~730 µs |
| grid-10×10 (100 nodes) | ~76 µs |
| grid-20×20 (400 nodes) | ~255 µs |
| grid-50×50 (2,500 nodes) | ~1.5 ms |
| doc-world (116 nodes) | ~210 µs |

Linear scaling. Single path return means no path explosion risk.

---

## 2. Operations sensitive to graph structure

### Compare (`compare` / `findRivalTraces`) — O(V + E) BFS + path enumeration

**This is the primary runtime risk area.**

Compare finds all shortest paths between two nodes and then enumerates them. The BFS itself is O(V + E), but the path backtracking step can produce an exponential number of paths when the graph is dense and many nodes share the same shortest distance.

#### Measured path explosion on grid graphs

| Grid | Nodes | Edges | Shortest distance | Paths found | Avg time |
|------|-------|-------|-------------------|-------------|----------|
| 5×5 | 25 | 40 | 8 | 70 | 6 ms |
| 7×7 | 49 | 84 | 12 | 924 | 97 ms |
| 8×8 | 64 | 112 | 14 | 3,432 | 752 ms |

The path count follows C(2(n-1), n-1) = central binomial coefficients. For a 10×10 grid, the expected count is 48,620 paths — estimated time > 10 seconds. **Grid-like topologies are the worst case for compare.**

#### Reference world behavior

The documentation world (116 nodes, 292 edges) produces only 3 rival paths for a spec→evidence comparison, completing in ~1.4 ms. Real-world semantic graphs are typically sparse and tree-like, not grid-like, so path explosion is unlikely at current scales.

#### Risk summary

| Condition | Risk level |
|-----------|-----------|
| Tree-like graph, < 200 nodes | **Low** — few or no rival paths |
| Sparse semantic graph, < 500 nodes | **Low** — moderate path count |
| Dense graph or grid topology | **High** — exponential path growth |
| Any graph > 1,000 nodes with high connectivity | **Unknown** — not yet measured |

---

## 3. What was not measured

| Area | Why not measured | Risk expectation |
|------|-----------------|------------------|
| Graphs > 5,000 nodes | No reference world of that size exists | Projection/trace should scale linearly; compare risk increases with density |
| `supportsCompare` | Runs full `findRivalTraces` internally — same cost as `compare` | Same risk as compare |
| Highlight model (`computeHighlight`) | Pure Map iteration — expected O(n + m) | Low risk based on code analysis |
| ChangeProtocol (`apply` sequence) | Includes structural invariant checks on each mutation | Expected O(n + m) per mutation; not measured under high mutation rates |
| GraphSnapshot creation/diff | Deep-copies and freezes all nodes/edges | O(n + m) per snapshot; not measured on large graphs |
| Concurrent/async behavior | Engine is synchronous and single-threaded by design | No concurrency risk, but no parallelism benefit either |
| Memory usage | Not profiled | Expected proportional to graph size; no lazy loading |

---

## 4. Sharp edges

### 4.1 Path explosion in `compare`

The `findRivalTraces` backtracking produces all shortest paths. On grid-like or lattice-like subgraphs, the path count grows combinatorially. There is no built-in cap on the number of enumerated paths.

**Mitigation options (not implemented):**
- Path count limit (bail out after N paths)
- Early termination when cluster diversity is sufficient
- Lazy path enumeration

### 4.2 `maxHops` default is 6

Both `trace` and `compare` default to `maxHops = 6`. In graphs where the relevant path length exceeds 6, the operation will return "no path" rather than an error. This is by design to bound BFS depth, but it means longer paths require explicit configuration.

### 4.3 Operators expect raw graph format

`trace`, `compare`, and `supports*` functions expect `{ nodes: Array, edges: Array }`, not `GraphModel`. Callers must convert via `{ nodes: graph.getNodes(), edges: graph.getEdges() }`.

### 4.4 Benchmark limitations

- **Synthetic graphs** (chain, tree, grid) test extreme topologies but may not reflect real-world semantic graph structure.
- **Reference worlds** are small (10 and 116 nodes). Behavior at 1,000+ node scale is inferred, not proven.
- **Wall-clock timing** is sensitive to garbage collection, OS scheduling, and JIT warm-up. First-call times are often 2–10× higher than steady-state.
- **Single machine** — no cross-platform or cross-runtime validation.

---

## 5. Practical limits for engineering presentations

Based on measured data and code analysis:

| Statement | Basis |
|-----------|-------|
| Projection completes in < 1 ms for graphs under 500 nodes | Measured |
| Navigation is effectively instantaneous (< 50 µs) | Measured |
| Trace finds a single shortest path in < 1 ms for graphs under 1,000 nodes | Measured |
| Compare is fast on sparse, tree-like graphs (< 5 ms for the 116-node doc-world) | Measured |
| Compare can become slow on dense graphs — 752 ms on a 64-node grid producing 3,432 paths | Measured |
| Compare has no built-in path count limit and can produce combinatorial explosion on grid-like topologies | Code analysis |
| All stable-core operations are synchronous, deterministic, and single-threaded | Architecture |
| The engine has been tested on graphs up to 2,500 nodes (benchmark) and 116 nodes (reference world) | Measured |
| Behavior on graphs > 5,000 nodes is untested | Honest gap |

---

## 6. How to rerun benchmarks

```bash
node --experimental-vm-modules benchmarks/bench.js
```

The script runs in ~5 seconds and produces a human-readable summary table. No exotic dependencies required — only Node.js and the project's own modules.

To add a new benchmark case, edit `benchmarks/bench.js` and add entries to the appropriate `run*Benchmarks()` function.

---

## 7. What should be measured next

In priority order:

1. **Compare with path count limit** — implement and benchmark a cap to make compare safe on dense graphs.
2. **Memory profiling** — measure heap usage for GraphModel and snapshot creation at 1,000+ nodes.
3. **ChangeProtocol mutation throughput** — time a sequence of apply operations with invariant checks.
4. **Real-world graph > 500 nodes** — if a larger reference world becomes available, run the full harness on it.
