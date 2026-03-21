/**
 * GraphSnapshot dedicated tests.
 *
 * Tests prove:
 * - Snapshot creation from graph data
 * - Immutability via Object.freeze (documented runtime behavior)
 * - Accessor correctness (getNodeById, getEdgeById, hasNode, etc.)
 * - Statistics computation
 * - Serialization round-trip (toJSON / fromJSON)
 * - diffSnapshots correctness
 * - SnapshotHistory management
 */

import { describe, it, expect } from 'vitest';
import {
  GraphSnapshot,
  SnapshotHistory,
  diffSnapshots,
  CHANGE_TYPE,
  SNAPSHOT_VERSION,
} from '../GraphSnapshot.js';
import { SCHEMA_VERSION } from '../CanonicalGraphSchema.js';

function sampleNodes() {
  return [
    { id: 'n1', type: 'concept', label: 'Alpha' },
    { id: 'n2', type: 'concept', label: 'Beta' },
    { id: 'n3', type: 'person', label: 'Charlie' },
  ];
}

function sampleEdges() {
  return [
    { id: 'e1', source: 'n1', target: 'n2', type: 'relates' },
    { id: 'e2', source: 'n2', target: 'n3', type: 'knows' },
  ];
}

function createSample(opts = {}) {
  return new GraphSnapshot(
    { nodes: sampleNodes(), edges: sampleEdges() },
    opts,
  );
}

// ── Creation ─────────────────────────────────────────────────────────────────

describe('GraphSnapshot: creation', () => {
  it('stores nodes and edges from input', () => {
    const snap = createSample();
    expect(snap.nodes.length).toBe(3);
    expect(snap.edges.length).toBe(2);
  });

  it('accepts edges via "links" key', () => {
    const snap = new GraphSnapshot({ nodes: sampleNodes(), links: sampleEdges() });
    expect(snap.edges.length).toBe(2);
  });

  it('assigns auto-generated id when not provided', () => {
    const snap = createSample();
    expect(typeof snap.id).toBe('string');
    expect(snap.id.startsWith('snap-')).toBe(true);
  });

  it('uses provided id', () => {
    const snap = createSample({ id: 'custom-id' });
    expect(snap.id).toBe('custom-id');
  });

  it('stores timestamp (defaults to Date.now)', () => {
    const before = Date.now();
    const snap = createSample();
    const after = Date.now();
    expect(snap.timestamp).toBeGreaterThanOrEqual(before);
    expect(snap.timestamp).toBeLessThanOrEqual(after);
  });

  it('uses provided timestamp', () => {
    const snap = createSample({ timestamp: 1000 });
    expect(snap.timestamp).toBe(1000);
  });

  it('stores schemaVersion from CanonicalGraphSchema', () => {
    const snap = createSample();
    expect(snap.schemaVersion).toBe(SCHEMA_VERSION);
  });

  it('stores snapshotVersion', () => {
    const snap = createSample();
    expect(snap.snapshotVersion).toBe(SNAPSHOT_VERSION);
  });

  it('stores metadata with description, author, tags', () => {
    const snap = createSample({
      description: 'test snap',
      author: 'opus',
      tags: ['v1', 'test'],
    });
    expect(snap.metadata.description).toBe('test snap');
    expect(snap.metadata.author).toBe('opus');
    expect([...snap.metadata.tags]).toEqual(['v1', 'test']);
  });

  it('defaults metadata fields when not provided', () => {
    const snap = createSample();
    expect(snap.metadata.description).toBe('');
    expect(snap.metadata.author).toBe('');
    expect([...snap.metadata.tags]).toEqual([]);
  });

  it('handles empty graph data', () => {
    const snap = new GraphSnapshot({ nodes: [], edges: [] });
    expect(snap.nodes.length).toBe(0);
    expect(snap.edges.length).toBe(0);
  });

  it('handles missing nodes/edges gracefully', () => {
    const snap = new GraphSnapshot({});
    expect(snap.nodes.length).toBe(0);
    expect(snap.edges.length).toBe(0);
  });
});

// ── Immutability ─────────────────────────────────────────────────────────────

describe('GraphSnapshot: immutability (Object.freeze behavior)', () => {
  it('snapshot itself is frozen', () => {
    const snap = createSample();
    expect(Object.isFrozen(snap)).toBe(true);
  });

  it('nodes array is frozen', () => {
    const snap = createSample();
    expect(Object.isFrozen(snap.nodes)).toBe(true);
  });

  it('edges array is frozen', () => {
    const snap = createSample();
    expect(Object.isFrozen(snap.edges)).toBe(true);
  });

  it('each node object is frozen', () => {
    const snap = createSample();
    for (const node of snap.nodes) {
      expect(Object.isFrozen(node)).toBe(true);
    }
  });

  it('each edge object is frozen', () => {
    const snap = createSample();
    for (const edge of snap.edges) {
      expect(Object.isFrozen(edge)).toBe(true);
    }
  });

  it('metadata is frozen', () => {
    const snap = createSample();
    expect(Object.isFrozen(snap.metadata)).toBe(true);
  });

  it('metadata.tags array is frozen', () => {
    const snap = createSample({ tags: ['a', 'b'] });
    expect(Object.isFrozen(snap.metadata.tags)).toBe(true);
  });

  it('push to nodes array throws in strict mode', () => {
    const snap = createSample();
    expect(() => { snap.nodes.push({ id: 'x' }); }).toThrow();
  });

  it('property assignment on node throws in strict mode', () => {
    const snap = createSample();
    expect(() => { snap.nodes[0].label = 'mutated'; }).toThrow();
  });

  it('push to edges array throws in strict mode', () => {
    const snap = createSample();
    expect(() => { snap.edges.push({ id: 'x' }); }).toThrow();
  });

  it('property assignment on snapshot throws in strict mode', () => {
    const snap = createSample();
    expect(() => { snap.id = 'changed'; }).toThrow();
  });

  it('source data mutation does not affect snapshot', () => {
    const nodes = sampleNodes();
    const edges = sampleEdges();
    const snap = new GraphSnapshot({ nodes, edges });

    nodes.push({ id: 'n4', type: 'x', label: 'Extra' });
    edges[0].type = 'mutated';

    expect(snap.nodes.length).toBe(3);
    expect(snap.edges[0].type).toBe('relates');
  });
});

// ── Accessors ────────────────────────────────────────────────────────────────

describe('GraphSnapshot: accessors', () => {
  it('getNodeById returns correct node', () => {
    const snap = createSample();
    const node = snap.getNodeById('n2');
    expect(node).toBeDefined();
    expect(node.label).toBe('Beta');
  });

  it('getNodeById returns undefined for missing ID', () => {
    const snap = createSample();
    expect(snap.getNodeById('nonexistent')).toBeUndefined();
  });

  it('getEdgeById returns correct edge', () => {
    const snap = createSample();
    const edge = snap.getEdgeById('e1');
    expect(edge).toBeDefined();
    expect(edge.source).toBe('n1');
    expect(edge.target).toBe('n2');
  });

  it('getEdgeById returns undefined for missing ID', () => {
    const snap = createSample();
    expect(snap.getEdgeById('nonexistent')).toBeUndefined();
  });

  it('getNodeIds returns Set of all node IDs', () => {
    const snap = createSample();
    const ids = snap.getNodeIds();
    expect(ids instanceof Set).toBe(true);
    expect(ids.size).toBe(3);
    expect(ids.has('n1')).toBe(true);
    expect(ids.has('n2')).toBe(true);
    expect(ids.has('n3')).toBe(true);
  });

  it('getEdgeIds returns Set of all edge IDs', () => {
    const snap = createSample();
    const ids = snap.getEdgeIds();
    expect(ids instanceof Set).toBe(true);
    expect(ids.size).toBe(2);
    expect(ids.has('e1')).toBe(true);
    expect(ids.has('e2')).toBe(true);
  });

  it('hasNode returns true for existing, false for missing', () => {
    const snap = createSample();
    expect(snap.hasNode('n1')).toBe(true);
    expect(snap.hasNode('n99')).toBe(false);
  });

  it('hasEdge returns true for existing, false for missing', () => {
    const snap = createSample();
    expect(snap.hasEdge('e1')).toBe(true);
    expect(snap.hasEdge('e99')).toBe(false);
  });
});

// ── Statistics ───────────────────────────────────────────────────────────────

describe('GraphSnapshot: statistics', () => {
  it('getStats returns correct counts', () => {
    const snap = createSample({ id: 'stats-test', timestamp: 5000 });
    const stats = snap.getStats();
    expect(stats.id).toBe('stats-test');
    expect(stats.timestamp).toBe(5000);
    expect(stats.nodeCount).toBe(3);
    expect(stats.edgeCount).toBe(2);
    expect(stats.schemaVersion).toBe(SCHEMA_VERSION);
    expect(stats.snapshotVersion).toBe(SNAPSHOT_VERSION);
  });

  it('getStats computes nodeTypes distribution', () => {
    const snap = createSample();
    const stats = snap.getStats();
    expect(stats.nodeTypes.concept).toBe(2);
    expect(stats.nodeTypes.person).toBe(1);
  });

  it('getStats computes edgeTypes distribution', () => {
    const snap = createSample();
    const stats = snap.getStats();
    expect(stats.edgeTypes.relates).toBe(1);
    expect(stats.edgeTypes.knows).toBe(1);
  });

  it('getStats handles nodes without type (uses "unknown")', () => {
    const snap = new GraphSnapshot({
      nodes: [{ id: 'x', label: 'X' }],
      edges: [],
    });
    expect(snap.getStats().nodeTypes.unknown).toBe(1);
  });
});

// ── Serialization ────────────────────────────────────────────────────────────

describe('GraphSnapshot: serialization', () => {
  it('toJSON produces plain object with all data', () => {
    const snap = createSample({
      id: 'json-test',
      timestamp: 12345,
      description: 'desc',
      author: 'a',
      tags: ['t'],
    });
    const json = snap.toJSON();
    expect(json.id).toBe('json-test');
    expect(json.timestamp).toBe(12345);
    expect(json.nodes.length).toBe(3);
    expect(json.edges.length).toBe(2);
    expect(json.metadata.description).toBe('desc');
    expect(json.metadata.author).toBe('a');
    expect(json.metadata.tags).toEqual(['t']);
    expect(json.schemaVersion).toBe(SCHEMA_VERSION);
    expect(json.snapshotVersion).toBe(SNAPSHOT_VERSION);
  });

  it('toJSON returns unfrozen copies', () => {
    const snap = createSample();
    const json = snap.toJSON();
    expect(Object.isFrozen(json)).toBe(false);
    expect(Object.isFrozen(json.nodes)).toBe(false);
    expect(Object.isFrozen(json.nodes[0])).toBe(false);
  });

  it('fromJSON round-trips correctly', () => {
    const original = createSample({
      id: 'rt-test',
      timestamp: 99999,
      description: 'round-trip',
      author: 'opus',
      tags: ['a', 'b'],
    });
    const restored = GraphSnapshot.fromJSON(original.toJSON());
    expect(restored.id).toBe(original.id);
    expect(restored.timestamp).toBe(original.timestamp);
    expect(restored.nodes.length).toBe(original.nodes.length);
    expect(restored.edges.length).toBe(original.edges.length);
    expect(restored.metadata.description).toBe(original.metadata.description);
    expect(restored.metadata.author).toBe(original.metadata.author);
    expect([...restored.metadata.tags]).toEqual([...original.metadata.tags]);
  });

  it('fromJSON result is also frozen', () => {
    const snap = GraphSnapshot.fromJSON(createSample().toJSON());
    expect(Object.isFrozen(snap)).toBe(true);
    expect(Object.isFrozen(snap.nodes)).toBe(true);
  });
});

// ── Diff ─────────────────────────────────────────────────────────────────────

describe('diffSnapshots', () => {
  it('identical snapshots produce zero diff', () => {
    const snap = createSample({ id: 'a', timestamp: 1 });
    const snap2 = createSample({ id: 'b', timestamp: 2 });
    const diff = diffSnapshots(snap, snap2);
    expect(diff.summary.totalChanges).toBe(0);
    expect(diff.summary.hasChanges).toBe(false);
  });

  it('detects added node', () => {
    const before = createSample({ id: 'before', timestamp: 1 });
    const afterNodes = [...sampleNodes(), { id: 'n4', type: 'new', label: 'New' }];
    const after = new GraphSnapshot(
      { nodes: afterNodes, edges: sampleEdges() },
      { id: 'after', timestamp: 2 },
    );
    const diff = diffSnapshots(before, after);
    expect(diff.nodes.added.length).toBe(1);
    expect(diff.nodes.added[0].id).toBe('n4');
    expect(diff.summary.nodesAdded).toBe(1);
    expect(diff.summary.hasChanges).toBe(true);
  });

  it('detects removed node', () => {
    const before = createSample({ id: 'before', timestamp: 1 });
    const afterNodes = sampleNodes().slice(0, 2);
    const after = new GraphSnapshot(
      { nodes: afterNodes, edges: [sampleEdges()[0]] },
      { id: 'after', timestamp: 2 },
    );
    const diff = diffSnapshots(before, after);
    expect(diff.nodes.removed.length).toBe(1);
    expect(diff.nodes.removed[0].id).toBe('n3');
    expect(diff.summary.nodesRemoved).toBe(1);
  });

  it('detects modified node', () => {
    const before = createSample({ id: 'before', timestamp: 1 });
    const modifiedNodes = sampleNodes();
    modifiedNodes[0] = { ...modifiedNodes[0], label: 'AlphaV2' };
    const after = new GraphSnapshot(
      { nodes: modifiedNodes, edges: sampleEdges() },
      { id: 'after', timestamp: 2 },
    );
    const diff = diffSnapshots(before, after);
    expect(diff.nodes.modified.length).toBe(1);
    expect(diff.nodes.modified[0].id).toBe('n1');
    expect(diff.nodes.modified[0].changes[0].field).toBe('label');
    expect(diff.nodes.modified[0].changes[0].before).toBe('Alpha');
    expect(diff.nodes.modified[0].changes[0].after).toBe('AlphaV2');
  });

  it('detects added/removed edges', () => {
    const before = createSample({ id: 'before', timestamp: 1 });
    const newEdges = [
      sampleEdges()[0],
      { id: 'e3', source: 'n1', target: 'n3', type: 'new-edge' },
    ];
    const after = new GraphSnapshot(
      { nodes: sampleNodes(), edges: newEdges },
      { id: 'after', timestamp: 2 },
    );
    const diff = diffSnapshots(before, after);
    expect(diff.edges.added.length).toBe(1);
    expect(diff.edges.added[0].id).toBe('e3');
    expect(diff.edges.removed.length).toBe(1);
    expect(diff.edges.removed[0].id).toBe('e2');
  });

  it('diff before/after metadata is correct', () => {
    const before = createSample({ id: 'snap-a', timestamp: 100 });
    const after = createSample({ id: 'snap-b', timestamp: 200 });
    const diff = diffSnapshots(before, after);
    expect(diff.before.id).toBe('snap-a');
    expect(diff.before.timestamp).toBe(100);
    expect(diff.after.id).toBe('snap-b');
    expect(diff.after.timestamp).toBe(200);
  });
});

// ── SnapshotHistory ──────────────────────────────────────────────────────────

describe('SnapshotHistory', () => {
  it('starts empty', () => {
    const history = new SnapshotHistory();
    expect(history.size()).toBe(0);
    expect(history.getLatest()).toBeUndefined();
    expect(history.getFirst()).toBeUndefined();
  });

  it('add increments size', () => {
    const history = new SnapshotHistory();
    history.add(createSample({ id: 's1' }));
    history.add(createSample({ id: 's2' }));
    expect(history.size()).toBe(2);
  });

  it('rejects duplicate IDs', () => {
    const history = new SnapshotHistory();
    history.add(createSample({ id: 'dup' }));
    expect(() => history.add(createSample({ id: 'dup' }))).toThrow('already exists');
  });

  it('getById returns correct snapshot', () => {
    const history = new SnapshotHistory();
    const s1 = createSample({ id: 'a' });
    const s2 = createSample({ id: 'b' });
    history.add(s1);
    history.add(s2);
    expect(history.getById('a')).toBe(s1);
    expect(history.getById('b')).toBe(s2);
    expect(history.getById('c')).toBeUndefined();
  });

  it('getLatest returns last added', () => {
    const history = new SnapshotHistory();
    history.add(createSample({ id: 'first' }));
    history.add(createSample({ id: 'second' }));
    expect(history.getLatest().id).toBe('second');
  });

  it('getFirst returns first added', () => {
    const history = new SnapshotHistory();
    history.add(createSample({ id: 'first' }));
    history.add(createSample({ id: 'second' }));
    expect(history.getFirst().id).toBe('first');
  });

  it('getByIndex returns correct snapshot', () => {
    const history = new SnapshotHistory();
    const s1 = createSample({ id: 'x' });
    const s2 = createSample({ id: 'y' });
    history.add(s1);
    history.add(s2);
    expect(history.getByIndex(0)).toBe(s1);
    expect(history.getByIndex(1)).toBe(s2);
    expect(history.getByIndex(2)).toBeUndefined();
  });

  it('diff compares two snapshots by ID', () => {
    const history = new SnapshotHistory();
    history.add(createSample({ id: 'before', timestamp: 1 }));
    const afterNodes = [...sampleNodes(), { id: 'n4', type: 'x', label: 'New' }];
    history.add(new GraphSnapshot({ nodes: afterNodes, edges: sampleEdges() }, { id: 'after', timestamp: 2 }));
    const diff = history.diff('before', 'after');
    expect(diff).not.toBeNull();
    expect(diff.nodes.added.length).toBe(1);
  });

  it('diff returns null for missing IDs', () => {
    const history = new SnapshotHistory();
    history.add(createSample({ id: 'a' }));
    expect(history.diff('a', 'missing')).toBeNull();
    expect(history.diff('missing', 'a')).toBeNull();
  });

  it('diffRange produces sequential diffs', () => {
    const history = new SnapshotHistory();
    history.add(new GraphSnapshot({ nodes: [{ id: 'n1', type: 'a', label: 'A' }], edges: [] }, { id: 's1', timestamp: 1 }));
    history.add(new GraphSnapshot({ nodes: [{ id: 'n1', type: 'a', label: 'A' }, { id: 'n2', type: 'b', label: 'B' }], edges: [] }, { id: 's2', timestamp: 2 }));
    history.add(new GraphSnapshot({ nodes: [{ id: 'n1', type: 'a', label: 'A' }, { id: 'n2', type: 'b', label: 'B' }, { id: 'n3', type: 'c', label: 'C' }], edges: [] }, { id: 's3', timestamp: 3 }));
    const diffs = history.diffRange(0, 2);
    expect(diffs.length).toBe(2);
    expect(diffs[0].nodes.added.length).toBe(1);
    expect(diffs[1].nodes.added.length).toBe(1);
  });

  it('getFullEvolution compares first to last', () => {
    const history = new SnapshotHistory();
    history.add(new GraphSnapshot({ nodes: [], edges: [] }, { id: 'first', timestamp: 1 }));
    history.add(createSample({ id: 'last', timestamp: 2 }));
    const evo = history.getFullEvolution();
    expect(evo).not.toBeNull();
    expect(evo.nodes.added.length).toBe(3);
    expect(evo.edges.added.length).toBe(2);
  });

  it('getFullEvolution returns null for single snapshot', () => {
    const history = new SnapshotHistory();
    history.add(createSample({ id: 'only' }));
    expect(history.getFullEvolution()).toBeNull();
  });

  it('getStats returns correct summary', () => {
    const history = new SnapshotHistory();
    history.add(createSample({ id: 'a', timestamp: 100 }));
    history.add(createSample({ id: 'b', timestamp: 500 }));
    const stats = history.getStats();
    expect(stats.count).toBe(2);
    expect(stats.firstTimestamp).toBe(100);
    expect(stats.latestTimestamp).toBe(500);
    expect(stats.timespan).toBe(400);
    expect(stats.snapshotIds).toEqual(['a', 'b']);
  });

  it('getStats returns zeroed for empty history', () => {
    const history = new SnapshotHistory();
    const stats = history.getStats();
    expect(stats.count).toBe(0);
    expect(stats.firstTimestamp).toBeNull();
    expect(stats.latestTimestamp).toBeNull();
    expect(stats.timespan).toBe(0);
  });

  it('clear empties the history', () => {
    const history = new SnapshotHistory();
    history.add(createSample({ id: 'a' }));
    history.add(createSample({ id: 'b' }));
    history.clear();
    expect(history.size()).toBe(0);
    expect(history.getById('a')).toBeUndefined();
  });

  it('toJSON / fromJSON round-trip preserves history', () => {
    const history = new SnapshotHistory();
    history.add(createSample({ id: 'h1', timestamp: 10 }));
    history.add(createSample({ id: 'h2', timestamp: 20 }));
    const restored = SnapshotHistory.fromJSON(history.toJSON());
    expect(restored.size()).toBe(2);
    expect(restored.getById('h1').timestamp).toBe(10);
    expect(restored.getById('h2').timestamp).toBe(20);
    expect(Object.isFrozen(restored.getById('h1'))).toBe(true);
  });
});
