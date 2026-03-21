/**
 * Projection metadata invariant tests.
 *
 * Tests prove:
 * - INV-1: Schema Conformance — ViewModel output has the declared structure
 * - INV-2: Identity Stability — node IDs are preserved through projection
 * - INV-4: Graph Immutability — projection does not mutate input graph
 *
 * Uses the test-world fixture (10 nodes, 16 edges).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { GraphModel } from '../../GraphModel.js';
import { projectGraph } from '../projectGraph.js';
import { SemanticRole, defaultParams, emptyFocus } from '../types.js';

const testWorldPath = resolve(import.meta.dirname, '../../../../worlds/test-world/universe.json');
const raw = JSON.parse(readFileSync(testWorldPath, 'utf-8'));
const schema = raw.schema;

function loadGraph() {
  return new GraphModel({ nodes: raw.nodes, links: raw.edges });
}

// ── INV-1: Schema Conformance ────────────────────────────────────────────────

describe('INV-1: Schema Conformance', () => {
  it('ViewModel has all required top-level keys: scene, panels, navigation, meta, system', () => {
    const graph = loadGraph();
    const result = projectGraph(graph, { nodeId: 'alice', path: [] }, schema, defaultParams());
    expect(result.ok).toBe(true);
    const vm = result.viewModel;
    expect(vm).toHaveProperty('scene');
    expect(vm).toHaveProperty('panels');
    expect(vm).toHaveProperty('navigation');
    expect(vm).toHaveProperty('meta');
    expect(vm).toHaveProperty('system');
  });

  it('scene contains nodes and edges arrays', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, emptyFocus(), schema, defaultParams());
    expect(Array.isArray(vm.scene.nodes)).toBe(true);
    expect(Array.isArray(vm.scene.edges)).toBe(true);
  });

  it('every VisualNode has required fields: id, label, type, role, opacity, metadata', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: [] }, schema, defaultParams());
    for (const node of vm.scene.nodes) {
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('label');
      expect(node).toHaveProperty('type');
      expect(node).toHaveProperty('role');
      expect(node).toHaveProperty('opacity');
      expect(node).toHaveProperty('metadata');
      expect(typeof node.id).toBe('string');
      expect(typeof node.label).toBe('string');
      expect(typeof node.type).toBe('string');
      expect(typeof node.role).toBe('string');
      expect(typeof node.opacity).toBe('number');
      expect(typeof node.metadata).toBe('object');
    }
  });

  it('VisualNode role is always a valid SemanticRole', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'root', path: [] }, schema, { depth: 2, visibilityMode: 'all' });
    const validRoles = new Set(Object.values(SemanticRole));
    for (const node of vm.scene.nodes) {
      expect(validRoles.has(node.role)).toBe(true);
    }
  });

  it('VisualNode opacity is between 0 and 1', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: [] }, schema, defaultParams());
    for (const node of vm.scene.nodes) {
      expect(node.opacity).toBeGreaterThanOrEqual(0);
      expect(node.opacity).toBeLessThanOrEqual(1);
    }
  });

  it('VisualNode metadata always contains label', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, emptyFocus(), schema, defaultParams());
    for (const node of vm.scene.nodes) {
      expect(node.metadata).toHaveProperty('label');
      expect(typeof node.metadata.label).toBe('string');
    }
  });

  it('every VisualEdge has required fields: id, source, target, type, opacity, touchesFocus', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: [] }, schema, defaultParams());
    for (const edge of vm.scene.edges) {
      expect(edge).toHaveProperty('id');
      expect(edge).toHaveProperty('source');
      expect(edge).toHaveProperty('target');
      expect(edge).toHaveProperty('type');
      expect(edge).toHaveProperty('opacity');
      expect(edge).toHaveProperty('touchesFocus');
      expect(typeof edge.id).toBe('string');
      expect(typeof edge.source).toBe('string');
      expect(typeof edge.target).toBe('string');
      expect(typeof edge.type).toBe('string');
      expect(typeof edge.opacity).toBe('number');
      expect(typeof edge.touchesFocus).toBe('boolean');
    }
  });

  it('panels has focusNode, neighbors, breadcrumbs', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: ['root'] }, schema, defaultParams());
    expect(vm.panels).toHaveProperty('focusNode');
    expect(vm.panels).toHaveProperty('neighbors');
    expect(vm.panels).toHaveProperty('breadcrumbs');
    expect(Array.isArray(vm.panels.neighbors)).toBe(true);
    expect(Array.isArray(vm.panels.breadcrumbs)).toBe(true);
  });

  it('breadcrumbs have id and label', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: ['root', 'hub-people'] }, schema, defaultParams());
    expect(vm.panels.breadcrumbs.length).toBe(2);
    for (const crumb of vm.panels.breadcrumbs) {
      expect(crumb).toHaveProperty('id');
      expect(crumb).toHaveProperty('label');
      expect(typeof crumb.id).toBe('string');
      expect(typeof crumb.label).toBe('string');
    }
  });

  it('navigation has canDrillUp, canDrillDown, path', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: [] }, schema, defaultParams());
    expect(vm.navigation).toHaveProperty('canDrillUp');
    expect(vm.navigation).toHaveProperty('canDrillDown');
    expect(vm.navigation).toHaveProperty('path');
    expect(typeof vm.navigation.canDrillUp).toBe('boolean');
    expect(typeof vm.navigation.canDrillDown).toBe('boolean');
    expect(Array.isArray(vm.navigation.path)).toBe(true);
  });

  it('meta has totalNodes, visibleNodes, projectionParams', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, emptyFocus(), schema, defaultParams());
    expect(vm.meta).toHaveProperty('totalNodes');
    expect(vm.meta).toHaveProperty('visibleNodes');
    expect(vm.meta).toHaveProperty('projectionParams');
    expect(typeof vm.meta.totalNodes).toBe('number');
    expect(typeof vm.meta.visibleNodes).toBe('number');
    expect(typeof vm.meta.projectionParams).toBe('object');
  });

  it('system has enginePhase, activeFormula, satisfiedInvariants, relatedSpecs, transitions', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: [] }, schema, defaultParams());
    expect(vm.system).toHaveProperty('enginePhase');
    expect(vm.system).toHaveProperty('activeFormula');
    expect(vm.system).toHaveProperty('satisfiedInvariants');
    expect(vm.system).toHaveProperty('relatedSpecs');
    expect(vm.system).toHaveProperty('transitions');
    expect(typeof vm.system.enginePhase).toBe('string');
    expect(typeof vm.system.activeFormula).toBe('string');
    expect(Array.isArray(vm.system.satisfiedInvariants)).toBe(true);
    expect(Array.isArray(vm.system.relatedSpecs)).toBe(true);
    expect(typeof vm.system.transitions).toBe('object');
  });

  it('satisfiedInvariants always includes INV-1, INV-2, INV-3, INV-4, INV-7', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, emptyFocus(), schema, defaultParams());
    const invariants = vm.system.satisfiedInvariants;
    expect(invariants).toContain('INV-1: Schema Conformance');
    expect(invariants).toContain('INV-2: Identity Stability');
    expect(invariants).toContain('INV-3: Projection Determinism');
    expect(invariants).toContain('INV-4: Graph Immutability');
    expect(invariants).toContain('INV-7: Totality');
  });

  it('satisfiedInvariants includes NAV invariants when focus is valid', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: ['root'] }, schema, defaultParams());
    const invariants = vm.system.satisfiedInvariants;
    expect(invariants).toContain('NAV-1: Transition Validity');
    expect(invariants).toContain('NAV-4: Determinism');
    expect(invariants).toContain('NAV-5: Projection Compatibility');
    expect(invariants).toContain('NAV-2: DrillDown Reversibility');
    expect(invariants).toContain('NAV-3: History Integrity');
  });

  it('satisfiedInvariants excludes NAV-2/NAV-3 when path is empty', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: [] }, schema, defaultParams());
    const invariants = vm.system.satisfiedInvariants;
    expect(invariants).toContain('NAV-1: Transition Validity');
    expect(invariants).not.toContain('NAV-2: DrillDown Reversibility');
    expect(invariants).not.toContain('NAV-3: History Integrity');
  });

  it('transitions.select is always true', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, emptyFocus(), schema, defaultParams());
    expect(vm.system.transitions.select).toBe(true);
  });
});

// ── INV-2: Identity Stability ────────────────────────────────────────────────

describe('INV-2: Identity Stability', () => {
  it('every source node ID appears in ViewModel scene', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, emptyFocus(), schema, defaultParams());
    const sourceIds = new Set(graph.getNodes().map(n => n.id));
    const vmIds = new Set(vm.scene.nodes.map(n => n.id));
    for (const id of sourceIds) {
      expect(vmIds.has(id)).toBe(true);
    }
  });

  it('node IDs are preserved exactly (not transformed)', () => {
    const graph = loadGraph();
    const sourceIds = graph.getNodes().map(n => n.id).sort();
    const { viewModel: vm } = projectGraph(graph, emptyFocus(), schema, defaultParams());
    const vmIds = vm.scene.nodes.map(n => n.id).sort();
    expect(vmIds).toEqual(sourceIds);
  });

  it('edge source/target reference valid node IDs from graph', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, emptyFocus(), schema, defaultParams());
    const nodeIds = new Set(graph.getNodes().map(n => n.id));
    for (const edge of vm.scene.edges) {
      expect(nodeIds.has(edge.source)).toBe(true);
      expect(nodeIds.has(edge.target)).toBe(true);
    }
  });

  it('focused node ID matches focus input', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'bob', path: [] }, schema, defaultParams());
    const focusNode = vm.scene.nodes.find(n => n.role === SemanticRole.FOCUS);
    expect(focusNode).toBeDefined();
    expect(focusNode.id).toBe('bob');
  });

  it('identity is stable across repeated projections', () => {
    const graph = loadGraph();
    const focus = { nodeId: 'alice', path: [] };
    const r1 = projectGraph(graph, focus, schema, defaultParams());
    const r2 = projectGraph(graph, focus, schema, defaultParams());
    const ids1 = r1.viewModel.scene.nodes.map(n => n.id).sort();
    const ids2 = r2.viewModel.scene.nodes.map(n => n.id).sort();
    expect(ids1).toEqual(ids2);
  });

  it('with focus and depth restriction, visible IDs are a subset of graph IDs', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: [] }, schema, { depth: 0, visibilityMode: 'all' });
    const sourceIds = new Set(graph.getNodes().map(n => n.id));
    for (const node of vm.scene.nodes) {
      expect(sourceIds.has(node.id)).toBe(true);
    }
  });

  it('edge IDs are preserved from source graph', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, emptyFocus(), schema, defaultParams());
    const sourceEdgeIds = new Set(graph.getEdges().map(e => e.id));
    for (const edge of vm.scene.edges) {
      expect(sourceEdgeIds.has(edge.id)).toBe(true);
    }
  });

  it('panels.breadcrumbs IDs match path node IDs', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: ['root', 'hub-people'] }, schema, defaultParams());
    expect(vm.panels.breadcrumbs.map(b => b.id)).toEqual(['root', 'hub-people']);
  });

  it('navigation.path IDs match focus path IDs', () => {
    const graph = loadGraph();
    const { viewModel: vm } = projectGraph(graph, { nodeId: 'alice', path: ['root', 'hub-people'] }, schema, defaultParams());
    expect(vm.navigation.path).toEqual(['root', 'hub-people']);
  });
});

// ── INV-4: Graph Immutability ────────────────────────────────────────────────

describe('INV-4: Graph Immutability (projection does not mutate input)', () => {
  it('graph node count unchanged after projection', () => {
    const graph = loadGraph();
    const nodesBefore = graph.getNodes().length;
    projectGraph(graph, { nodeId: 'alice', path: [] }, schema, defaultParams());
    expect(graph.getNodes().length).toBe(nodesBefore);
  });

  it('graph edge count unchanged after projection', () => {
    const graph = loadGraph();
    const edgesBefore = graph.getEdges().length;
    projectGraph(graph, { nodeId: 'alice', path: [] }, schema, defaultParams());
    expect(graph.getEdges().length).toBe(edgesBefore);
  });

  it('node properties unchanged after projection', () => {
    const graph = loadGraph();
    const nodesBefore = JSON.parse(JSON.stringify(graph.getNodes()));
    projectGraph(graph, { nodeId: 'alice', path: ['root'] }, schema, defaultParams());
    const nodesAfter = graph.getNodes();
    expect(nodesAfter).toEqual(nodesBefore);
  });

  it('edge properties unchanged after projection', () => {
    const graph = loadGraph();
    const edgesBefore = JSON.parse(JSON.stringify(graph.getEdges()));
    projectGraph(graph, { nodeId: 'alice', path: ['root'] }, schema, defaultParams());
    const edgesAfter = graph.getEdges();
    expect(edgesAfter).toEqual(edgesBefore);
  });

  it('graph unchanged after multiple projections with different foci', () => {
    const graph = loadGraph();
    const snapshot = JSON.parse(JSON.stringify({
      nodes: graph.getNodes(),
      edges: graph.getEdges(),
    }));

    projectGraph(graph, emptyFocus(), schema, defaultParams());
    projectGraph(graph, { nodeId: 'alice', path: [] }, schema, defaultParams());
    projectGraph(graph, { nodeId: 'root', path: [] }, schema, { depth: 2, visibilityMode: 'all' });
    projectGraph(graph, { nodeId: 'bob', path: ['root', 'hub-people'] }, schema, defaultParams());

    expect(graph.getNodes()).toEqual(snapshot.nodes);
    expect(graph.getEdges()).toEqual(snapshot.edges);
  });

  it('graph unchanged after projection with invalid focus (error path)', () => {
    const graph = loadGraph();
    const snapshot = JSON.parse(JSON.stringify({
      nodes: graph.getNodes(),
      edges: graph.getEdges(),
    }));
    const result = projectGraph(graph, { nodeId: 'nonexistent', path: [] }, schema, defaultParams());
    expect(result.ok).toBe(false);
    expect(graph.getNodes()).toEqual(snapshot.nodes);
    expect(graph.getEdges()).toEqual(snapshot.edges);
  });

  it('getNodeById still works correctly after projection', () => {
    const graph = loadGraph();
    const aliceBefore = graph.getNodeById('alice');
    projectGraph(graph, { nodeId: 'bob', path: [] }, schema, defaultParams());
    const aliceAfter = graph.getNodeById('alice');
    expect(aliceAfter).toEqual(aliceBefore);
  });
});
