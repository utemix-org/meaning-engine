import { describe, it, expect } from "vitest";
import {
  checkUniqueNodeIds,
  checkUniqueEdgeIds,
  checkNoDanglingEdges,
  checkNoSelfLoops,
  checkAllNodesHaveId,
  checkAllNodesHaveType,
  checkKnownNodeTypes,
  checkAllNodesHaveLabel,
  checkAllEdgesHaveType,
  checkKnownEdgeTypes,
  checkNoDuplicateEdges,
  checkGraphConnected,
  checkNoIsolatedNodes,
  checkHasRootNode,
  checkNoContainsCycles,
  checkSingleParent,
  InvariantChecker,
  STRICTNESS,
} from "../StructuralInvariants.js";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function validGraph() {
  return {
    nodes: [
      { id: "a", type: "concept", label: "Alpha" },
      { id: "b", type: "concept", label: "Beta" },
      { id: "c", type: "spec", label: "Gamma" },
    ],
    edges: [
      { id: "e1", source: "a", target: "b", type: "defines" },
      { id: "e2", source: "b", target: "c", type: "implements" },
    ],
  };
}

function emptyGraph() {
  return { nodes: [], edges: [] };
}

// ---------------------------------------------------------------------------
// INV-G1: Unique Node IDs
// ---------------------------------------------------------------------------

describe("INV-G1: Unique Node IDs", () => {
  it("holds on valid graph", () => {
    const result = checkUniqueNodeIds(validGraph());
    expect(result.holds).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("holds on empty graph", () => {
    const result = checkUniqueNodeIds(emptyGraph());
    expect(result.holds).toBe(true);
  });

  it("detects duplicate node IDs", () => {
    const graph = {
      nodes: [
        { id: "a", type: "concept", label: "Alpha" },
        { id: "a", type: "spec", label: "Alpha copy" },
        { id: "b", type: "concept", label: "Beta" },
      ],
      edges: [],
    };
    const result = checkUniqueNodeIds(graph);
    expect(result.holds).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].type).toBe("duplicate_id");
    expect(result.violations[0].id).toBe("a");
  });
});

// ---------------------------------------------------------------------------
// INV-G2: Unique Edge IDs
// ---------------------------------------------------------------------------

describe("INV-G2: Unique Edge IDs", () => {
  it("holds on valid graph", () => {
    const result = checkUniqueEdgeIds(validGraph());
    expect(result.holds).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("detects duplicate edge IDs", () => {
    const graph = {
      nodes: [{ id: "a" }, { id: "b" }],
      edges: [
        { id: "e1", source: "a", target: "b", type: "defines" },
        { id: "e1", source: "b", target: "a", type: "implements" },
      ],
    };
    const result = checkUniqueEdgeIds(graph);
    expect(result.holds).toBe(false);
    expect(result.violations[0].type).toBe("duplicate_id");
  });

  it("detects missing edge ID", () => {
    const graph = {
      nodes: [{ id: "a" }, { id: "b" }],
      edges: [{ source: "a", target: "b", type: "defines" }],
    };
    const result = checkUniqueEdgeIds(graph);
    expect(result.holds).toBe(false);
    expect(result.violations[0].type).toBe("missing_id");
  });
});

// ---------------------------------------------------------------------------
// INV-G3: No Dangling Edges
// ---------------------------------------------------------------------------

describe("INV-G3: No Dangling Edges", () => {
  it("holds on valid graph", () => {
    const result = checkNoDanglingEdges(validGraph());
    expect(result.holds).toBe(true);
  });

  it("detects dangling source", () => {
    const graph = {
      nodes: [{ id: "b" }],
      edges: [{ id: "e1", source: "missing", target: "b", type: "defines" }],
    };
    const result = checkNoDanglingEdges(graph);
    expect(result.holds).toBe(false);
    expect(result.violations.some(v => v.type === "dangling_source")).toBe(true);
  });

  it("detects dangling target", () => {
    const graph = {
      nodes: [{ id: "a" }],
      edges: [{ id: "e1", source: "a", target: "missing", type: "defines" }],
    };
    const result = checkNoDanglingEdges(graph);
    expect(result.holds).toBe(false);
    expect(result.violations.some(v => v.type === "dangling_target")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// INV-G4: No Self-Loops
// ---------------------------------------------------------------------------

describe("INV-G4: No Self-Loops", () => {
  it("holds on valid graph", () => {
    const result = checkNoSelfLoops(validGraph());
    expect(result.holds).toBe(true);
  });

  it("detects self-loop", () => {
    const graph = {
      nodes: [{ id: "a" }],
      edges: [{ id: "e1", source: "a", target: "a", type: "defines" }],
    };
    const result = checkNoSelfLoops(graph);
    expect(result.holds).toBe(false);
    expect(result.violations[0].type).toBe("self_loop");
    expect(result.violations[0].nodeId).toBe("a");
  });
});

// ---------------------------------------------------------------------------
// INV-I1: All Nodes Have ID
// ---------------------------------------------------------------------------

describe("INV-I1: All Nodes Have ID", () => {
  it("holds on valid graph", () => {
    const result = checkAllNodesHaveId(validGraph());
    expect(result.holds).toBe(true);
  });

  it("detects missing id", () => {
    const graph = { nodes: [{ type: "concept", label: "No ID" }], edges: [] };
    const result = checkAllNodesHaveId(graph);
    expect(result.holds).toBe(false);
    expect(result.violations[0].type).toBe("missing_id");
  });

  it("detects empty string id", () => {
    const graph = { nodes: [{ id: "  ", type: "concept" }], edges: [] };
    const result = checkAllNodesHaveId(graph);
    expect(result.holds).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// INV-I2: All Nodes Have Type
// ---------------------------------------------------------------------------

describe("INV-I2: All Nodes Have Type", () => {
  it("holds on valid graph", () => {
    const result = checkAllNodesHaveType(validGraph());
    expect(result.holds).toBe(true);
  });

  it("detects missing type", () => {
    const graph = { nodes: [{ id: "a", label: "Alpha" }], edges: [] };
    const result = checkAllNodesHaveType(graph);
    expect(result.holds).toBe(false);
    expect(result.violations[0].type).toBe("missing_type");
  });
});

// ---------------------------------------------------------------------------
// INV-I3: Known Node Types
// ---------------------------------------------------------------------------

describe("INV-I3: Known Node Types", () => {
  // NODE_TYPES is empty {} by design — worlds override via WorldAdapter.
  // With empty NODE_TYPES, every typed node is "unknown".
  it("flags all types as unknown when NODE_TYPES is empty", () => {
    const result = checkKnownNodeTypes(validGraph());
    expect(result.holds).toBe(false);
    expect(result.violations.length).toBe(3);
    expect(result.violations.every(v => v.type === "unknown_type")).toBe(true);
  });

  it("holds on empty graph (vacuously)", () => {
    const result = checkKnownNodeTypes(emptyGraph());
    expect(result.holds).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// INV-I4: All Nodes Have Label
// ---------------------------------------------------------------------------

describe("INV-I4: All Nodes Have Label", () => {
  it("holds on valid graph", () => {
    const result = checkAllNodesHaveLabel(validGraph());
    expect(result.holds).toBe(true);
  });

  it("detects missing label", () => {
    const graph = { nodes: [{ id: "a", type: "concept" }], edges: [] };
    const result = checkAllNodesHaveLabel(graph);
    expect(result.holds).toBe(false);
    expect(result.violations[0].type).toBe("missing_label");
  });

  it("detects empty string label", () => {
    const graph = { nodes: [{ id: "a", type: "concept", label: "  " }], edges: [] };
    const result = checkAllNodesHaveLabel(graph);
    expect(result.holds).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// INV-E1: All Edges Have Type
// ---------------------------------------------------------------------------

describe("INV-E1: All Edges Have Type", () => {
  it("holds on valid graph", () => {
    const result = checkAllEdgesHaveType(validGraph());
    expect(result.holds).toBe(true);
  });

  it("detects missing edge type", () => {
    const graph = {
      nodes: [{ id: "a" }, { id: "b" }],
      edges: [{ id: "e1", source: "a", target: "b" }],
    };
    const result = checkAllEdgesHaveType(graph);
    expect(result.holds).toBe(false);
    expect(result.violations[0].type).toBe("missing_type");
  });
});

// ---------------------------------------------------------------------------
// INV-E2: Known Edge Types
// ---------------------------------------------------------------------------

describe("INV-E2: Known Edge Types", () => {
  // EDGE_TYPES is empty {} by design — same as INV-I3.
  it("flags all types as unknown when EDGE_TYPES is empty", () => {
    const result = checkKnownEdgeTypes(validGraph());
    expect(result.holds).toBe(false);
    expect(result.violations.every(v => v.type === "unknown_type")).toBe(true);
  });

  it("holds on empty graph (vacuously)", () => {
    const result = checkKnownEdgeTypes(emptyGraph());
    expect(result.holds).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// INV-E3: No Duplicate Edges
// ---------------------------------------------------------------------------

describe("INV-E3: No Duplicate Edges", () => {
  it("holds on valid graph", () => {
    const result = checkNoDuplicateEdges(validGraph());
    expect(result.holds).toBe(true);
  });

  it("detects duplicate edge (same source, target, type)", () => {
    const graph = {
      nodes: [{ id: "a" }, { id: "b" }],
      edges: [
        { id: "e1", source: "a", target: "b", type: "defines" },
        { id: "e2", source: "a", target: "b", type: "defines" },
      ],
    };
    const result = checkNoDuplicateEdges(graph);
    expect(result.holds).toBe(false);
    expect(result.violations[0].type).toBe("duplicate_edge");
  });

  it("allows same endpoints with different types", () => {
    const graph = {
      nodes: [{ id: "a" }, { id: "b" }],
      edges: [
        { id: "e1", source: "a", target: "b", type: "defines" },
        { id: "e2", source: "a", target: "b", type: "implements" },
      ],
    };
    const result = checkNoDuplicateEdges(graph);
    expect(result.holds).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// INV-C1: Graph Connected
// ---------------------------------------------------------------------------

describe("INV-C1: Graph Connected", () => {
  it("holds on connected graph", () => {
    const result = checkGraphConnected(validGraph());
    expect(result.holds).toBe(true);
  });

  it("holds on empty graph (trivially)", () => {
    const result = checkGraphConnected(emptyGraph());
    expect(result.holds).toBe(true);
  });

  it("detects disconnected graph", () => {
    const graph = {
      nodes: [
        { id: "a", type: "concept" },
        { id: "b", type: "concept" },
        { id: "c", type: "concept" },
      ],
      edges: [{ id: "e1", source: "a", target: "b", type: "defines" }],
    };
    const result = checkGraphConnected(graph);
    expect(result.holds).toBe(false);
    expect(result.violations.some(v => v.nodeId === "c")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// INV-C2: No Isolated Nodes
// ---------------------------------------------------------------------------

describe("INV-C2: No Isolated Nodes", () => {
  it("holds on valid graph (all nodes have edges)", () => {
    const result = checkNoIsolatedNodes(validGraph());
    expect(result.holds).toBe(true);
  });

  it("detects isolated node", () => {
    const graph = {
      nodes: [
        { id: "a", type: "concept" },
        { id: "b", type: "concept" },
        { id: "lonely", type: "concept", label: "Lonely" },
      ],
      edges: [{ id: "e1", source: "a", target: "b", type: "defines" }],
    };
    const result = checkNoIsolatedNodes(graph);
    expect(result.holds).toBe(false);
    expect(result.violations[0].nodeId).toBe("lonely");
    expect(result.violations[0].type).toBe("isolated");
  });
});

// ---------------------------------------------------------------------------
// INV-C3: Has Root Node
// ---------------------------------------------------------------------------

describe("INV-C3: Has Root Node", () => {
  // NODE_TYPES.ROOT is undefined (empty NODE_TYPES), so no node can match.
  it("always fails with empty NODE_TYPES (no type matches undefined)", () => {
    const result = checkHasRootNode(validGraph());
    expect(result.holds).toBe(false);
  });

  it("holds when a node has type matching NODE_TYPES.ROOT", () => {
    // Manually simulate what would happen if NODE_TYPES.ROOT were defined:
    // Since NODE_TYPES is empty, NODE_TYPES.ROOT === undefined,
    // so n.type === undefined matches nodes without a type field.
    const graph = {
      nodes: [{ id: "root" }],
      edges: [],
    };
    const result = checkHasRootNode(graph);
    expect(result.holds).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// INV-H1: No Contains Cycles
// ---------------------------------------------------------------------------

describe("INV-H1: No Contains Cycles", () => {
  // EDGE_TYPES.CONTAINS is undefined, so no edge matches the filter.
  it("holds vacuously when no edges match EDGE_TYPES.CONTAINS", () => {
    const result = checkNoContainsCycles(validGraph());
    expect(result.holds).toBe(true);
  });

  it("detects cycle in contains hierarchy with matching edge type", () => {
    // Since EDGE_TYPES.CONTAINS is undefined, edges with type=undefined match.
    const graph = {
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      edges: [
        { id: "e1", source: "a", target: "b" },
        { id: "e2", source: "b", target: "c" },
        { id: "e3", source: "c", target: "a" },
      ],
    };
    const result = checkNoContainsCycles(graph);
    expect(result.holds).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.violations[0].type).toBe("cycle");
  });

  it("holds on acyclic contains hierarchy", () => {
    const graph = {
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      edges: [
        { id: "e1", source: "a", target: "b" },
        { id: "e2", source: "a", target: "c" },
      ],
    };
    const result = checkNoContainsCycles(graph);
    expect(result.holds).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// INV-H2: Single Parent in Contains
// ---------------------------------------------------------------------------

describe("INV-H2: Single Parent in Contains", () => {
  it("holds vacuously when no edges match EDGE_TYPES.CONTAINS", () => {
    const result = checkSingleParent(validGraph());
    expect(result.holds).toBe(true);
  });

  it("detects multiple parents in contains hierarchy", () => {
    // edges without type → type === undefined === EDGE_TYPES.CONTAINS
    const graph = {
      nodes: [{ id: "a" }, { id: "b" }, { id: "child" }],
      edges: [
        { id: "e1", source: "a", target: "child" },
        { id: "e2", source: "b", target: "child" },
      ],
    };
    const result = checkSingleParent(graph);
    expect(result.holds).toBe(false);
    expect(result.violations[0].type).toBe("multiple_parents");
    expect(result.violations[0].nodeId).toBe("child");
  });
});

// ---------------------------------------------------------------------------
// InvariantChecker — aggregated checking
// ---------------------------------------------------------------------------

describe("InvariantChecker", () => {
  it("MINIMAL strictness checks G1, G2, G3, I1, I2 (5 checks)", () => {
    const checker = new InvariantChecker();
    const result = checker.checkAll(validGraph(), STRICTNESS.MINIMAL);
    expect(result.total).toBe(5);
    expect(result.valid).toBe(true);
    expect(result.passed).toBe(5);
    expect(result.failed).toBe(0);
  });

  it("STANDARD strictness adds E1, C2, G4 (8 checks total)", () => {
    const checker = new InvariantChecker();
    const result = checker.checkAll(validGraph(), STRICTNESS.STANDARD);
    expect(result.total).toBe(8);
    expect(result.valid).toBe(true);
  });

  it("STRICT strictness runs all 16 checks", () => {
    const checker = new InvariantChecker();
    const result = checker.checkAll(validGraph(), STRICTNESS.STRICT);
    expect(result.total).toBe(16);
    // Some fail due to empty NODE_TYPES/EDGE_TYPES (I3, E2 always fail; C3 fails)
    expect(result.failed).toBeGreaterThan(0);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it("reports violations on graph with errors", () => {
    const broken = {
      nodes: [
        { id: "a", type: "concept" },
        { id: "a", type: "spec" },
      ],
      edges: [{ source: "a", target: "missing", type: "defines" }],
    };
    const checker = new InvariantChecker();
    const result = checker.checkAll(broken, STRICTNESS.MINIMAL);
    expect(result.valid).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });

  it("checkOne returns result for known invariant", () => {
    const checker = new InvariantChecker();
    const result = checker.checkOne("INV-G1", validGraph());
    expect(result).not.toBeNull();
    expect(result.holds).toBe(true);
  });

  it("checkOne returns null for unknown invariant", () => {
    const checker = new InvariantChecker();
    const result = checker.checkOne("INV-FAKE", validGraph());
    expect(result).toBeNull();
  });

  it("listInvariants returns 16 entries", () => {
    const list = InvariantChecker.listInvariants();
    expect(list).toHaveLength(16);
    expect(list.every(i => i.id && i.name && i.category)).toBe(true);
  });

  it("reset clears previous results", () => {
    const checker = new InvariantChecker();
    checker.checkAll(validGraph(), STRICTNESS.MINIMAL);
    expect(checker.results.length).toBe(5);
    checker.reset();
    expect(checker.results.length).toBe(0);
  });
});
