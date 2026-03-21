import { describe, it, expect } from "vitest";
import {
  ChangeProtocol,
  ProposalValidator,
  createProposal,
  MUTATION_TYPE,
  AUTHOR_TYPE,
  PROPOSAL_STATUS,
} from "../ChangeProtocol.js";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function seedGraph() {
  return {
    nodes: [
      { id: "a", type: "concept", label: "Alpha" },
      { id: "b", type: "concept", label: "Beta" },
    ],
    edges: [
      { id: "e1", source: "a", target: "b", type: "defines" },
    ],
  };
}

// ---------------------------------------------------------------------------
// createProposal
// ---------------------------------------------------------------------------

describe("createProposal", () => {
  it("creates a valid proposal with defaults", () => {
    const p = createProposal({
      type: MUTATION_TYPE.ADD_NODE,
      payload: { id: "c", type: "spec", label: "Gamma" },
    });
    expect(p.id).toMatch(/^prop-/);
    expect(p.type).toBe(MUTATION_TYPE.ADD_NODE);
    expect(p.status).toBe(PROPOSAL_STATUS.PENDING);
    expect(p.author).toBe(AUTHOR_TYPE.HUMAN);
    expect(p.rationale).toBe("");
  });

  it("throws on invalid mutation type", () => {
    expect(() => createProposal({ type: "bogus", payload: {} })).toThrow("Invalid mutation type");
  });

  it("throws without payload", () => {
    expect(() => createProposal({ type: MUTATION_TYPE.ADD_NODE })).toThrow("Payload is required");
  });
});

// ---------------------------------------------------------------------------
// ProposalValidator — structure checks
// ---------------------------------------------------------------------------

describe("ProposalValidator — structure", () => {
  const validator = new ProposalValidator();

  it("rejects proposal without type", () => {
    const result = validator.validate({ payload: {} }, seedGraph());
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "MISSING_TYPE")).toBe(true);
  });

  it("rejects ADD_NODE without node id", () => {
    const p = createProposal({ type: MUTATION_TYPE.ADD_NODE, payload: { type: "spec" } });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "MISSING_NODE_ID")).toBe(true);
  });

  it("rejects REMOVE_NODE without node id", () => {
    const p = createProposal({ type: MUTATION_TYPE.REMOVE_NODE, payload: {} });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(false);
  });

  it("rejects UPDATE_NODE without changes", () => {
    const p = createProposal({ type: MUTATION_TYPE.UPDATE_NODE, payload: { id: "a" } });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "MISSING_CHANGES")).toBe(true);
  });

  it("rejects ADD_EDGE without source or target", () => {
    const p = createProposal({ type: MUTATION_TYPE.ADD_EDGE, payload: { type: "defines" } });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "MISSING_EDGE_ENDPOINTS")).toBe(true);
  });

  it("rejects BATCH without mutations array", () => {
    const p = createProposal({ type: MUTATION_TYPE.BATCH, payload: {} });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "INVALID_BATCH")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// ProposalValidator — simulation errors
// ---------------------------------------------------------------------------

describe("ProposalValidator — simulation", () => {
  const validator = new ProposalValidator();

  it("rejects adding a node with duplicate id", () => {
    const p = createProposal({
      type: MUTATION_TYPE.ADD_NODE,
      payload: { id: "a", type: "spec", label: "Duplicate" },
    });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "SIMULATION_FAILED")).toBe(true);
  });

  it("rejects removing a nonexistent node", () => {
    const p = createProposal({
      type: MUTATION_TYPE.REMOVE_NODE,
      payload: { id: "nonexistent" },
    });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(false);
  });

  it("rejects adding edge with nonexistent source", () => {
    const p = createProposal({
      type: MUTATION_TYPE.ADD_EDGE,
      payload: { id: "e2", source: "missing", target: "a", type: "defines" },
    });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// ProposalValidator — invariant checking
// ---------------------------------------------------------------------------

describe("ProposalValidator — invariant checks", () => {
  const validator = new ProposalValidator();

  it("rejects proposal that creates dangling edge", () => {
    const graph = {
      nodes: [{ id: "a", type: "concept" }, { id: "b", type: "concept" }],
      edges: [{ id: "e1", source: "a", target: "b", type: "defines" }],
    };
    const p = createProposal({
      type: MUTATION_TYPE.REMOVE_NODE,
      payload: { id: "b" },
    });
    // Removing "b" also removes edge e1 (implemented in _simulateApply),
    // so this should NOT cause dangling edges.
    const result = validator.validate(p, graph);
    expect(result.valid).toBe(true);
  });

  it("validates add-node with schema (static call fix)", () => {
    const p = createProposal({
      type: MUTATION_TYPE.ADD_NODE,
      payload: { id: "c", type: "spec", label: "Gamma" },
    });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(true);
    expect(result.schemaResult).toBeDefined();
  });

  it("validates add-edge with schema (static call fix)", () => {
    const p = createProposal({
      type: MUTATION_TYPE.ADD_EDGE,
      payload: { id: "e2", source: "b", target: "a", type: "implements" },
    });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(true);
    expect(result.schemaResult).toBeDefined();
  });

  it("schema validation rejects node without type", () => {
    const p = createProposal({
      type: MUTATION_TYPE.ADD_NODE,
      payload: { id: "c", label: "No type" },
    });
    const result = validator.validate(p, seedGraph());
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.code === "SCHEMA_ERROR")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// ChangeProtocol — happy path
// ---------------------------------------------------------------------------

describe("ChangeProtocol — happy path", () => {
  it("add node: validate → apply → graph updated", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeAddNode(
      { id: "c", type: "spec", label: "Gamma" },
      "add spec node",
    );

    const result = cp.apply(p);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);

    const graph = cp.getGraph();
    expect(graph.nodes).toHaveLength(3);
    expect(graph.nodes.find(n => n.id === "c")).toBeDefined();
  });

  it("remove node: graph shrinks and related edges removed", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeRemoveNode("b", "remove beta");

    const result = cp.apply(p);
    expect(result.success).toBe(true);

    const graph = cp.getGraph();
    expect(graph.nodes).toHaveLength(1);
    expect(graph.edges).toHaveLength(0);
  });

  it("update node: label changed", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeUpdateNode("a", { label: "Alpha Prime" }, "rename");

    const result = cp.apply(p);
    expect(result.success).toBe(true);

    const graph = cp.getGraph();
    expect(graph.nodes.find(n => n.id === "a").label).toBe("Alpha Prime");
  });

  it("add edge: new connection created", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeAddEdge(
      { id: "e2", source: "b", target: "a", type: "implements" },
      "add reverse edge",
    );

    const result = cp.apply(p);
    expect(result.success).toBe(true);

    const graph = cp.getGraph();
    expect(graph.edges).toHaveLength(2);
  });

  it("remove edge: edge deleted", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeRemoveEdge("e1", "remove defines");

    const result = cp.apply(p);
    expect(result.success).toBe(true);

    const graph = cp.getGraph();
    expect(graph.edges).toHaveLength(0);
  });

  it("batch: multiple mutations in one proposal", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeBatch([
      { type: MUTATION_TYPE.ADD_NODE, payload: { id: "c", type: "spec", label: "Gamma" } },
      { type: MUTATION_TYPE.ADD_EDGE, payload: { id: "e2", source: "a", target: "c", type: "implements" } },
    ], "batch add");

    const result = cp.apply(p);
    expect(result.success).toBe(true);

    const graph = cp.getGraph();
    expect(graph.nodes).toHaveLength(3);
    expect(graph.edges).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// ChangeProtocol — rejection
// ---------------------------------------------------------------------------

describe("ChangeProtocol — rejection", () => {
  it("apply rejects invalid proposal and does not modify graph", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeAddNode(
      { id: "a", type: "concept", label: "Duplicate" },
      "should fail",
    );

    const result = cp.apply(p);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);

    const graph = cp.getGraph();
    expect(graph.nodes).toHaveLength(2);
  });

  it("proposal status is set to REJECTED on validation failure", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeRemoveNode("nonexistent", "should fail");

    cp.validate(p);
    expect(p.status).toBe(PROPOSAL_STATUS.REJECTED);
  });

  it("proposal status is set to VALIDATED on success", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeAddNode(
      { id: "c", type: "spec", label: "Gamma" },
      "should pass",
    );

    cp.validate(p);
    expect(p.status).toBe(PROPOSAL_STATUS.VALIDATED);
  });
});

// ---------------------------------------------------------------------------
// ChangeProtocol — simulate (dry-run)
// ---------------------------------------------------------------------------

describe("ChangeProtocol — simulate", () => {
  it("simulate returns diff without modifying graph", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeAddNode(
      { id: "c", type: "spec", label: "Gamma" },
      "dry-run",
    );

    const result = cp.simulate(p);
    expect(result.valid).toBe(true);
    expect(result.diff).toBeDefined();
    expect(result.diff.summary.nodesAdded).toBe(1);
    expect(result.diff.summary.hasChanges).toBe(true);

    expect(p.status).toBe(PROPOSAL_STATUS.SIMULATED);

    const graph = cp.getGraph();
    expect(graph.nodes).toHaveLength(2);
  });

  it("simulate returns errors on invalid proposal", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeAddNode(
      { id: "a", type: "concept" },
      "duplicate",
    );

    const result = cp.simulate(p);
    expect(result.valid).toBe(false);
    expect(result.simulatedGraph).toBeNull();
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// ChangeProtocol — history
// ---------------------------------------------------------------------------

describe("ChangeProtocol — history", () => {
  it("records each applied proposal in history", () => {
    const cp = new ChangeProtocol(seedGraph());

    const p1 = cp.proposeAddNode({ id: "c", type: "spec", label: "C" }, "first");
    cp.apply(p1);

    const p2 = cp.proposeAddNode({ id: "d", type: "spec", label: "D" }, "second");
    cp.apply(p2);

    const history = cp.getHistory();
    expect(history).toHaveLength(2);
    expect(history[0].proposal.rationale).toBe("first");
    expect(history[1].proposal.rationale).toBe("second");
  });

  it("failed apply does not add to history", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeAddNode({ id: "a", type: "concept" }, "fail");
    cp.apply(p);

    expect(cp.getHistory()).toHaveLength(0);
  });

  it("snapshots grow with each apply", () => {
    const cp = new ChangeProtocol(seedGraph());
    expect(cp.getSnapshots()).toHaveLength(1);

    cp.apply(cp.proposeAddNode({ id: "c", type: "spec", label: "C" }, "one"));
    expect(cp.getSnapshots()).toHaveLength(2);

    cp.apply(cp.proposeAddNode({ id: "d", type: "spec", label: "D" }, "two"));
    expect(cp.getSnapshots()).toHaveLength(3);
  });

  it("history diff captures added node", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeAddNode({ id: "c", type: "spec", label: "C" }, "add");
    const result = cp.apply(p);

    expect(result.diff.summary.nodesAdded).toBe(1);
    expect(result.diff.nodes.added[0].id).toBe("c");
  });

  it("getStats reflects current state", () => {
    const cp = new ChangeProtocol(seedGraph());
    cp.apply(cp.proposeAddNode({ id: "c", type: "spec", label: "C" }, "one"));

    const stats = cp.getStats();
    expect(stats.nodeCount).toBe(3);
    expect(stats.edgeCount).toBe(1);
    expect(stats.historyLength).toBe(1);
    expect(stats.snapshotCount).toBe(2);
  });

  it("exportHistory returns structured data", () => {
    const cp = new ChangeProtocol(seedGraph());
    cp.apply(cp.proposeAddNode({ id: "c", type: "spec", label: "C" }, "add C"));

    const exported = cp.exportHistory();
    expect(exported.graph.nodes).toHaveLength(3);
    expect(exported.history).toHaveLength(1);
    expect(exported.history[0].type).toBe(MUTATION_TYPE.ADD_NODE);
    expect(exported.history[0].rationale).toBe("add C");
  });
});

// ---------------------------------------------------------------------------
// ChangeProtocol — STRICTNESS.MINIMAL is used
// ---------------------------------------------------------------------------

describe("ChangeProtocol — strictness level", () => {
  it("validates at MINIMAL strictness (G1, G2, G3, I1, I2)", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeAddNode(
      { id: "c", type: "spec", label: "Gamma" },
      "test strictness",
    );

    const validation = cp.validate(p);
    expect(validation.valid).toBe(true);
    expect(validation.invariantResult.total).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// ChangeProtocol — author types
// ---------------------------------------------------------------------------

describe("ChangeProtocol — author types", () => {
  it("accepts LLM author", () => {
    const cp = new ChangeProtocol(seedGraph());
    const p = cp.proposeAddNode(
      { id: "c", type: "spec", label: "LLM node" },
      "llm proposed",
      AUTHOR_TYPE.LLM,
    );
    expect(p.author).toBe(AUTHOR_TYPE.LLM);

    const result = cp.apply(p);
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// ChangeProtocol — getGraph returns copy
// ---------------------------------------------------------------------------

describe("ChangeProtocol — isolation", () => {
  it("getGraph returns a copy (not a reference)", () => {
    const cp = new ChangeProtocol(seedGraph());
    const g1 = cp.getGraph();
    g1.nodes.push({ id: "injected" });

    const g2 = cp.getGraph();
    expect(g2.nodes).toHaveLength(2);
  });
});
