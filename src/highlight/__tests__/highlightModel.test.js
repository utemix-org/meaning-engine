/**
 * Highlight model dedicated tests.
 *
 * Tests prove:
 * - Public API exports: computeHighlight, createEmptyContext, createContextFromState, INTENSITY
 * - Pure-function behavior: no mutation of inputs, deterministic output
 * - Mode priority: scope > hover > type > selected > none
 * - Intensity assignments per mode
 * - Edge cases: empty graphs, unknown node IDs, object-form edge endpoints
 */

import { describe, it, expect } from 'vitest';
import {
  computeHighlight,
  createEmptyContext,
  createContextFromState,
  INTENSITY,
} from '../highlightModel.js';

// ── Test fixtures ────────────────────────────────────────────────────────────

function makeGraph(nodeIds, edges = []) {
  const nodesById = new Map(nodeIds.map(id => [id, { id, type: 'concept', label: id }]));
  const neighborsById = new Map(nodeIds.map(id => [id, new Set()]));
  for (const e of edges) {
    const src = typeof e.source === 'string' ? e.source : e.source.id;
    const tgt = typeof e.target === 'string' ? e.target : e.target.id;
    if (neighborsById.has(src)) neighborsById.get(src).add(tgt);
    if (neighborsById.has(tgt)) neighborsById.get(tgt).add(src);
  }
  return { nodesById, neighborsById, edges };
}

function triangleGraph() {
  return makeGraph(['a', 'b', 'c'], [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'b', target: 'c' },
    { id: 'e3', source: 'a', target: 'c' },
  ]);
}

function linearGraph() {
  return makeGraph(['n1', 'n2', 'n3', 'n4'], [
    { id: 'e1', source: 'n1', target: 'n2' },
    { id: 'e2', source: 'n2', target: 'n3' },
    { id: 'e3', source: 'n3', target: 'n4' },
  ]);
}

// ── INTENSITY constants ──────────────────────────────────────────────────────

describe('INTENSITY constants', () => {
  it('defines NONE, DIM, HALF, FULL', () => {
    expect(INTENSITY.NONE).toBe(0);
    expect(INTENSITY.DIM).toBe(0.15);
    expect(INTENSITY.HALF).toBe(0.5);
    expect(INTENSITY.FULL).toBe(1.0);
  });
});

// ── createEmptyContext ───────────────────────────────────────────────────────

describe('createEmptyContext', () => {
  it('returns context with all null/empty/false fields', () => {
    const ctx = createEmptyContext();
    expect(ctx.selectedNodeId).toBeNull();
    expect(ctx.hoveredNodeId).toBeNull();
    expect(ctx.widgetHoveredNodeId).toBeNull();
    expect(ctx.scopeNodeIds instanceof Set).toBe(true);
    expect(ctx.scopeNodeIds.size).toBe(0);
    expect(ctx.scopeActive).toBe(false);
    expect(ctx.typeHighlightNodeIds instanceof Set).toBe(true);
    expect(ctx.typeHighlightNodeIds.size).toBe(0);
    expect(ctx.typeHighlightActive).toBe(false);
  });

  it('returns a fresh object on each call', () => {
    const c1 = createEmptyContext();
    const c2 = createEmptyContext();
    expect(c1).not.toBe(c2);
    expect(c1.scopeNodeIds).not.toBe(c2.scopeNodeIds);
  });
});

// ── createContextFromState ───────────────────────────────────────────────────

describe('createContextFromState', () => {
  it('maps legacy state field names to context fields', () => {
    const ctx = createContextFromState({
      currentStepId: 'node-1',
      hoverNodeId: 'node-2',
      widgetHighlightedNodeId: 'node-3',
      scopeHighlightNodeIds: new Set(['s1', 's2']),
      scopeHighlightActive: true,
      typeHighlightedNodeIds: new Set(['t1']),
      typeHighlightActive: true,
    });
    expect(ctx.selectedNodeId).toBe('node-1');
    expect(ctx.hoveredNodeId).toBe('node-2');
    expect(ctx.widgetHoveredNodeId).toBe('node-3');
    expect(ctx.scopeNodeIds.has('s1')).toBe(true);
    expect(ctx.scopeNodeIds.has('s2')).toBe(true);
    expect(ctx.scopeActive).toBe(true);
    expect(ctx.typeHighlightNodeIds.has('t1')).toBe(true);
    expect(ctx.typeHighlightActive).toBe(true);
  });

  it('defaults all fields when called without arguments', () => {
    const ctx = createContextFromState();
    expect(ctx.selectedNodeId).toBeNull();
    expect(ctx.hoveredNodeId).toBeNull();
    expect(ctx.widgetHoveredNodeId).toBeNull();
    expect(ctx.scopeNodeIds.size).toBe(0);
    expect(ctx.scopeActive).toBe(false);
    expect(ctx.typeHighlightNodeIds.size).toBe(0);
    expect(ctx.typeHighlightActive).toBe(false);
  });

  it('copies scope/type sets (does not alias input)', () => {
    const inputScope = new Set(['x']);
    const ctx = createContextFromState({ scopeHighlightNodeIds: inputScope });
    inputScope.add('y');
    expect(ctx.scopeNodeIds.has('y')).toBe(false);
  });
});

// ── computeHighlight: mode "none" ────────────────────────────────────────────

describe('computeHighlight: mode "none"', () => {
  it('returns mode "none" for empty context', () => {
    const graph = triangleGraph();
    const state = computeHighlight(createEmptyContext(), graph);
    expect(state.mode).toBe('none');
  });

  it('all nodes DIM in mode "none"', () => {
    const graph = triangleGraph();
    const state = computeHighlight(createEmptyContext(), graph);
    for (const [, intensity] of state.nodeIntensities) {
      expect(intensity).toBe(INTENSITY.DIM);
    }
  });

  it('all edges DIM in mode "none"', () => {
    const graph = triangleGraph();
    const state = computeHighlight(createEmptyContext(), graph);
    for (const [, intensity] of state.edgeIntensities) {
      expect(intensity).toBe(INTENSITY.DIM);
    }
  });

  it('nodeIntensities and edgeIntensities are Maps', () => {
    const graph = triangleGraph();
    const state = computeHighlight(createEmptyContext(), graph);
    expect(state.nodeIntensities instanceof Map).toBe(true);
    expect(state.edgeIntensities instanceof Map).toBe(true);
  });

  it('nodeIntensities contains all graph node IDs', () => {
    const graph = triangleGraph();
    const state = computeHighlight(createEmptyContext(), graph);
    expect(state.nodeIntensities.size).toBe(3);
    expect(state.nodeIntensities.has('a')).toBe(true);
    expect(state.nodeIntensities.has('b')).toBe(true);
    expect(state.nodeIntensities.has('c')).toBe(true);
  });

  it('edgeIntensities contains all graph edge IDs', () => {
    const graph = triangleGraph();
    const state = computeHighlight(createEmptyContext(), graph);
    expect(state.edgeIntensities.size).toBe(3);
    expect(state.edgeIntensities.has('e1')).toBe(true);
    expect(state.edgeIntensities.has('e2')).toBe(true);
    expect(state.edgeIntensities.has('e3')).toBe(true);
  });
});

// ── computeHighlight: mode "selected" ────────────────────────────────────────

describe('computeHighlight: mode "selected"', () => {
  it('returns mode "selected" when selectedNodeId set', () => {
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'n2';
    const state = computeHighlight(ctx, linearGraph());
    expect(state.mode).toBe('selected');
  });

  it('selected node is FULL', () => {
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'n2';
    const state = computeHighlight(ctx, linearGraph());
    expect(state.nodeIntensities.get('n2')).toBe(INTENSITY.FULL);
  });

  it('direct neighbors are HALF', () => {
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'n2';
    const state = computeHighlight(ctx, linearGraph());
    expect(state.nodeIntensities.get('n1')).toBe(INTENSITY.HALF);
    expect(state.nodeIntensities.get('n3')).toBe(INTENSITY.HALF);
  });

  it('non-neighbors remain DIM', () => {
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'n2';
    const state = computeHighlight(ctx, linearGraph());
    expect(state.nodeIntensities.get('n4')).toBe(INTENSITY.DIM);
  });

  it('edges touching selected are HALF', () => {
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'n2';
    const state = computeHighlight(ctx, linearGraph());
    expect(state.edgeIntensities.get('e1')).toBe(INTENSITY.HALF);
    expect(state.edgeIntensities.get('e2')).toBe(INTENSITY.HALF);
  });

  it('edges not touching selected remain DIM', () => {
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'n2';
    const state = computeHighlight(ctx, linearGraph());
    expect(state.edgeIntensities.get('e3')).toBe(INTENSITY.DIM);
  });
});

// ── computeHighlight: mode "hover" ───────────────────────────────────────────

describe('computeHighlight: mode "hover"', () => {
  it('returns mode "hover" when hoveredNodeId set', () => {
    const ctx = createEmptyContext();
    ctx.hoveredNodeId = 'b';
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).toBe('hover');
  });

  it('returns mode "hover" for widgetHoveredNodeId', () => {
    const ctx = createEmptyContext();
    ctx.widgetHoveredNodeId = 'b';
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).toBe('hover');
  });

  it('hovered node and neighbors are FULL', () => {
    const ctx = createEmptyContext();
    ctx.hoveredNodeId = 'b';
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.nodeIntensities.get('b')).toBe(INTENSITY.FULL);
    expect(state.nodeIntensities.get('a')).toBe(INTENSITY.FULL);
    expect(state.nodeIntensities.get('c')).toBe(INTENSITY.FULL);
  });

  it('edges touching hovered are FULL', () => {
    const ctx = createEmptyContext();
    ctx.hoveredNodeId = 'b';
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.edgeIntensities.get('e1')).toBe(INTENSITY.FULL);
    expect(state.edgeIntensities.get('e2')).toBe(INTENSITY.FULL);
  });

  it('edges not touching hovered remain DIM', () => {
    const ctx = createEmptyContext();
    ctx.hoveredNodeId = 'n1';
    const graph = linearGraph();
    const state = computeHighlight(ctx, graph);
    expect(state.nodeIntensities.get('n1')).toBe(INTENSITY.FULL);
    expect(state.nodeIntensities.get('n2')).toBe(INTENSITY.FULL);
    expect(state.edgeIntensities.get('e1')).toBe(INTENSITY.FULL);
    expect(state.edgeIntensities.get('e2')).toBe(INTENSITY.DIM);
  });

  it('selected node stays FULL during hover', () => {
    const ctx = createEmptyContext();
    ctx.hoveredNodeId = 'n1';
    ctx.selectedNodeId = 'n4';
    const state = computeHighlight(ctx, linearGraph());
    expect(state.mode).toBe('hover');
    expect(state.nodeIntensities.get('n4')).toBe(INTENSITY.FULL);
  });
});

// ── computeHighlight: mode "scope" ───────────────────────────────────────────

describe('computeHighlight: mode "scope"', () => {
  it('returns mode "scope" when scopeActive and scopeNodeIds non-empty', () => {
    const ctx = createEmptyContext();
    ctx.scopeActive = true;
    ctx.scopeNodeIds = new Set(['a', 'b']);
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).toBe('scope');
  });

  it('scope nodes are FULL', () => {
    const ctx = createEmptyContext();
    ctx.scopeActive = true;
    ctx.scopeNodeIds = new Set(['a']);
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.nodeIntensities.get('a')).toBe(INTENSITY.FULL);
  });

  it('scope neighbors (via edges) are also FULL', () => {
    const ctx = createEmptyContext();
    ctx.scopeActive = true;
    ctx.scopeNodeIds = new Set(['a']);
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.nodeIntensities.get('b')).toBe(INTENSITY.FULL);
    expect(state.nodeIntensities.get('c')).toBe(INTENSITY.FULL);
  });

  it('edges touching scope are FULL', () => {
    const ctx = createEmptyContext();
    ctx.scopeActive = true;
    ctx.scopeNodeIds = new Set(['n2']);
    const state = computeHighlight(ctx, linearGraph());
    expect(state.edgeIntensities.get('e1')).toBe(INTENSITY.FULL);
    expect(state.edgeIntensities.get('e2')).toBe(INTENSITY.FULL);
    expect(state.edgeIntensities.get('e3')).toBe(INTENSITY.DIM);
  });

  it('non-connected nodes remain DIM', () => {
    const ctx = createEmptyContext();
    ctx.scopeActive = true;
    ctx.scopeNodeIds = new Set(['n1']);
    const state = computeHighlight(ctx, linearGraph());
    expect(state.nodeIntensities.get('n3')).toBe(INTENSITY.DIM);
    expect(state.nodeIntensities.get('n4')).toBe(INTENSITY.DIM);
  });

  it('scopeActive=false does not trigger scope mode', () => {
    const ctx = createEmptyContext();
    ctx.scopeActive = false;
    ctx.scopeNodeIds = new Set(['a']);
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).toBe('none');
  });

  it('scopeActive=true with empty scopeNodeIds does not trigger scope mode', () => {
    const ctx = createEmptyContext();
    ctx.scopeActive = true;
    ctx.scopeNodeIds = new Set();
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).not.toBe('scope');
  });
});

// ── computeHighlight: mode "type" ────────────────────────────────────────────

describe('computeHighlight: mode "type"', () => {
  it('returns mode "type" when typeHighlightActive and typeHighlightNodeIds non-empty', () => {
    const ctx = createEmptyContext();
    ctx.typeHighlightActive = true;
    ctx.typeHighlightNodeIds = new Set(['a', 'c']);
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).toBe('type');
  });

  it('type-highlighted nodes are FULL', () => {
    const ctx = createEmptyContext();
    ctx.typeHighlightActive = true;
    ctx.typeHighlightNodeIds = new Set(['a', 'c']);
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.nodeIntensities.get('a')).toBe(INTENSITY.FULL);
    expect(state.nodeIntensities.get('c')).toBe(INTENSITY.FULL);
  });

  it('non-type-highlighted nodes remain DIM', () => {
    const ctx = createEmptyContext();
    ctx.typeHighlightActive = true;
    ctx.typeHighlightNodeIds = new Set(['a', 'c']);
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.nodeIntensities.get('b')).toBe(INTENSITY.DIM);
  });

  it('selected node edges are HALF when type mode active', () => {
    const ctx = createEmptyContext();
    ctx.typeHighlightActive = true;
    ctx.typeHighlightNodeIds = new Set(['a']);
    ctx.selectedNodeId = 'a';
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.edgeIntensities.get('e1')).toBe(INTENSITY.HALF);
    expect(state.edgeIntensities.get('e3')).toBe(INTENSITY.HALF);
  });

  it('edges not touching selected remain DIM in type mode', () => {
    const ctx = createEmptyContext();
    ctx.typeHighlightActive = true;
    ctx.typeHighlightNodeIds = new Set(['a']);
    ctx.selectedNodeId = 'a';
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.edgeIntensities.get('e2')).toBe(INTENSITY.DIM);
  });

  it('typeHighlightActive=false does not trigger type mode', () => {
    const ctx = createEmptyContext();
    ctx.typeHighlightActive = false;
    ctx.typeHighlightNodeIds = new Set(['a']);
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).not.toBe('type');
  });
});

// ── Mode priority ────────────────────────────────────────────────────────────

describe('computeHighlight: mode priority (scope > hover > type > selected > none)', () => {
  it('scope beats hover', () => {
    const ctx = createEmptyContext();
    ctx.scopeActive = true;
    ctx.scopeNodeIds = new Set(['a']);
    ctx.hoveredNodeId = 'b';
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).toBe('scope');
  });

  it('hover beats type', () => {
    const ctx = createEmptyContext();
    ctx.hoveredNodeId = 'a';
    ctx.typeHighlightActive = true;
    ctx.typeHighlightNodeIds = new Set(['b']);
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).toBe('hover');
  });

  it('type beats selected', () => {
    const ctx = createEmptyContext();
    ctx.typeHighlightActive = true;
    ctx.typeHighlightNodeIds = new Set(['a']);
    ctx.selectedNodeId = 'b';
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).toBe('type');
  });

  it('selected beats none', () => {
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'a';
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).toBe('selected');
  });

  it('scope beats everything combined', () => {
    const ctx = createEmptyContext();
    ctx.scopeActive = true;
    ctx.scopeNodeIds = new Set(['a']);
    ctx.hoveredNodeId = 'b';
    ctx.typeHighlightActive = true;
    ctx.typeHighlightNodeIds = new Set(['c']);
    ctx.selectedNodeId = 'a';
    const state = computeHighlight(ctx, triangleGraph());
    expect(state.mode).toBe('scope');
  });
});

// ── Pure function behavior ───────────────────────────────────────────────────

describe('computeHighlight: pure function behavior', () => {
  it('does not mutate the context', () => {
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'a';
    const ctxBefore = JSON.stringify({
      selectedNodeId: ctx.selectedNodeId,
      hoveredNodeId: ctx.hoveredNodeId,
      widgetHoveredNodeId: ctx.widgetHoveredNodeId,
      scopeActive: ctx.scopeActive,
      typeHighlightActive: ctx.typeHighlightActive,
    });
    computeHighlight(ctx, triangleGraph());
    const ctxAfter = JSON.stringify({
      selectedNodeId: ctx.selectedNodeId,
      hoveredNodeId: ctx.hoveredNodeId,
      widgetHoveredNodeId: ctx.widgetHoveredNodeId,
      scopeActive: ctx.scopeActive,
      typeHighlightActive: ctx.typeHighlightActive,
    });
    expect(ctxAfter).toBe(ctxBefore);
  });

  it('does not mutate graph.nodesById', () => {
    const graph = triangleGraph();
    const nodesBefore = [...graph.nodesById.keys()];
    computeHighlight(createEmptyContext(), graph);
    expect([...graph.nodesById.keys()]).toEqual(nodesBefore);
  });

  it('does not mutate graph.edges', () => {
    const graph = triangleGraph();
    const edgesBefore = graph.edges.map(e => ({ ...e }));
    computeHighlight(createEmptyContext(), graph);
    expect(graph.edges).toEqual(edgesBefore);
  });

  it('deterministic: same inputs produce identical output', () => {
    const graph = triangleGraph();
    const ctx = createEmptyContext();
    ctx.hoveredNodeId = 'b';
    const s1 = computeHighlight(ctx, graph);
    const s2 = computeHighlight(ctx, graph);
    expect(s1.mode).toBe(s2.mode);
    expect([...s1.nodeIntensities.entries()]).toEqual([...s2.nodeIntensities.entries()]);
    expect([...s1.edgeIntensities.entries()]).toEqual([...s2.edgeIntensities.entries()]);
  });

  it('repeated calls (100x) return the same result', () => {
    const graph = linearGraph();
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'n2';
    const first = computeHighlight(ctx, graph);
    for (let i = 0; i < 100; i++) {
      const result = computeHighlight(ctx, graph);
      expect(result.mode).toBe(first.mode);
      expect([...result.nodeIntensities.entries()]).toEqual([...first.nodeIntensities.entries()]);
    }
  });
});

// ── Edge cases ───────────────────────────────────────────────────────────────

describe('computeHighlight: edge cases', () => {
  it('works on empty graph (0 nodes, 0 edges)', () => {
    const graph = makeGraph([], []);
    const state = computeHighlight(createEmptyContext(), graph);
    expect(state.mode).toBe('none');
    expect(state.nodeIntensities.size).toBe(0);
    expect(state.edgeIntensities.size).toBe(0);
  });

  it('handles selectedNodeId not in graph: ID added to map with FULL', () => {
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'nonexistent';
    const graph = triangleGraph();
    const state = computeHighlight(ctx, graph);
    expect(state.mode).toBe('selected');
    // The pure model adds the selected ID to intensities regardless of graph membership
    expect(state.nodeIntensities.has('nonexistent')).toBe(true);
    expect(state.nodeIntensities.get('nonexistent')).toBe(INTENSITY.FULL);
    for (const [id, v] of state.nodeIntensities) {
      if (id !== 'nonexistent') expect(v).toBe(INTENSITY.DIM);
    }
  });

  it('handles hoveredNodeId not in graph gracefully', () => {
    const ctx = createEmptyContext();
    ctx.hoveredNodeId = 'ghost';
    const graph = triangleGraph();
    const state = computeHighlight(ctx, graph);
    expect(state.mode).toBe('hover');
  });

  it('handles object-form edge endpoints', () => {
    const graph = makeGraph(['x', 'y'], [
      { id: 'eo1', source: { id: 'x' }, target: { id: 'y' } },
    ]);
    const ctx = createEmptyContext();
    ctx.hoveredNodeId = 'x';
    const state = computeHighlight(ctx, graph);
    expect(state.mode).toBe('hover');
    expect(state.nodeIntensities.get('x')).toBe(INTENSITY.FULL);
    expect(state.nodeIntensities.get('y')).toBe(INTENSITY.FULL);
    expect(state.edgeIntensities.get('eo1')).toBe(INTENSITY.FULL);
  });

  it('single-node graph with no edges', () => {
    const graph = makeGraph(['solo'], []);
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'solo';
    const state = computeHighlight(ctx, graph);
    expect(state.mode).toBe('selected');
    expect(state.nodeIntensities.get('solo')).toBe(INTENSITY.FULL);
    expect(state.edgeIntensities.size).toBe(0);
  });

  it('scope with nonexistent ID: added to map with FULL, graph nodes stay DIM', () => {
    const ctx = createEmptyContext();
    ctx.scopeActive = true;
    ctx.scopeNodeIds = new Set(['nonexistent']);
    const graph = triangleGraph();
    const state = computeHighlight(ctx, graph);
    expect(state.mode).toBe('scope');
    // The pure model adds scope IDs to the map before checking edges
    expect(state.nodeIntensities.get('nonexistent')).toBe(INTENSITY.FULL);
    for (const [id, v] of state.nodeIntensities) {
      if (id !== 'nonexistent') expect(v).toBe(INTENSITY.DIM);
    }
  });
});

// ── Output shape ─────────────────────────────────────────────────────────────

describe('computeHighlight: output shape (HighlightState contract)', () => {
  it('returns object with nodeIntensities, edgeIntensities, mode', () => {
    const state = computeHighlight(createEmptyContext(), triangleGraph());
    expect(state).toHaveProperty('nodeIntensities');
    expect(state).toHaveProperty('edgeIntensities');
    expect(state).toHaveProperty('mode');
    expect(Object.keys(state).sort()).toEqual(['edgeIntensities', 'mode', 'nodeIntensities']);
  });

  it('mode is one of: none, selected, hover, scope, type', () => {
    const validModes = ['none', 'selected', 'hover', 'scope', 'type'];
    const graph = triangleGraph();

    const contexts = [
      createEmptyContext(),
      (() => { const c = createEmptyContext(); c.selectedNodeId = 'a'; return c; })(),
      (() => { const c = createEmptyContext(); c.hoveredNodeId = 'a'; return c; })(),
      (() => { const c = createEmptyContext(); c.scopeActive = true; c.scopeNodeIds = new Set(['a']); return c; })(),
      (() => { const c = createEmptyContext(); c.typeHighlightActive = true; c.typeHighlightNodeIds = new Set(['a']); return c; })(),
    ];

    for (const ctx of contexts) {
      const state = computeHighlight(ctx, graph);
      expect(validModes).toContain(state.mode);
    }
  });

  it('intensity values are always one of NONE, DIM, HALF, FULL', () => {
    const validValues = new Set([INTENSITY.NONE, INTENSITY.DIM, INTENSITY.HALF, INTENSITY.FULL]);
    const ctx = createEmptyContext();
    ctx.selectedNodeId = 'n2';
    ctx.hoveredNodeId = 'n1';
    const state = computeHighlight(ctx, linearGraph());
    for (const [, v] of state.nodeIntensities) {
      expect(validValues.has(v)).toBe(true);
    }
    for (const [, v] of state.edgeIntensities) {
      expect(validValues.has(v)).toBe(true);
    }
  });
});
