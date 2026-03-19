/**
 * Context assembly for model-backed cabin diagnostic pass.
 *
 * Builds a deterministic, size-limited CabinContext from explicit inputs.
 * No hidden global state; no file system reads.
 *
 * @module cabin/context
 * @experimental
 */

const SYSTEM_PROMPT_BASE = `You are a cabin diagnostic observer for the Meaning Engine.
Your task is to inspect a knowledge world and produce structured diagnoses of tensions (inconsistencies, contract violations, missing bridges, vocabulary ambiguity, unsupported claims).

You MUST respond with a JSON object matching this exact schema:
{
  "diagnoses": [
    {
      "issue_type": "<string from taxonomy>",
      "severity": "<P0|P1|P2>",
      "claim": "<concise description of the tension found>",
      "evidence_refs": {
        "doc_refs": ["<file paths>"],
        "code_refs": ["<file paths with optional :line>"],
        "graph_refs": ["<node IDs from the world>"]
      },
      "reasoning": "<optional: brief reasoning chain>"
    }
  ]
}

Issue taxonomy codes: doc_runtime_mismatch, type_contract_drift, vocabulary_ambiguity, unsupported_claim, missing_bridge, graph_interface_divergence, version_drift, spec_path_drift, purity_boundary_violation, mode_ambiguity.

Severity: P0 = blocks release, P1 = should fix, P2 = nice to fix.

Rules:
- Be specific: name exact node IDs, edge types, file paths.
- Be grounded: only reference artifacts present in the world data.
- Do not invent nodes or edges not in the provided data.
- If no tension is found, return {"diagnoses": []}.`;

const GR_PROMPT_SUPPLEMENT = `

## Graph-Relief Mode Instructions

You are diagnosing tensions by reading STRUCTURAL SIGNALS in the graph — edge types, absence of edges, and isolated nodes. The probe below describes what structural pattern to look for. Your job is to classify it using the taxonomy.

### Semantic Legend — Structural Signals → Issue Types

Edge-based signals (presence in the "tension" layer):
- \`drift_against\` edge: a code artifact drifted from a documented spec → issue_type = "doc_runtime_mismatch", severity = P0
- \`contradicts\` edge: runtime behavior contradicts a type declaration → issue_type = "type_contract_drift", severity = P0

Absence-based signals:
- Two concept nodes referring to the same thing but NO \`same_as\` or \`alias_of\` edge between them → issue_type = "vocabulary_ambiguity", severity = P1
- A \`decision\` node with NO outgoing \`proved_by\` edge to evidence or invariant → issue_type = "unsupported_claim", severity = P1
- A node with ZERO edges (completely isolated) → issue_type = "missing_bridge", severity = P2

### Rules for Graph-Relief Diagnosis
1. Use the probe to identify which specific nodes/edges match the structural signal.
2. List ALL matching node IDs in evidence_refs.graph_refs.
3. The severity is determined by the signal type (see legend above), not by your judgment.
4. Produce exactly ONE diagnosis per structural pattern found.
5. Do NOT diagnose tensions unrelated to the probe signal.
6. Do NOT speculate beyond what the graph data shows.`;

function buildSystemPrompt(mode) {
  if (mode === 'graph_relief_driven') {
    return SYSTEM_PROMPT_BASE + GR_PROMPT_SUPPLEMENT;
  }
  return SYSTEM_PROMPT_BASE;
}

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    diagnoses: {
      type: 'array',
      items: {
        type: 'object',
        required: ['issue_type', 'severity', 'claim', 'evidence_refs'],
        properties: {
          issue_type: { type: 'string' },
          severity: { type: 'string', enum: ['P0', 'P1', 'P2'] },
          claim: { type: 'string' },
          evidence_refs: {
            type: 'object',
            properties: {
              doc_refs: { type: 'array', items: { type: 'string' } },
              code_refs: { type: 'array', items: { type: 'string' } },
              graph_refs: { type: 'array', items: { type: 'string' } },
            },
          },
          reasoning: { type: 'string' },
        },
      },
    },
  },
  required: ['diagnoses'],
};

/**
 * Pre-compute which graph elements match a GR probe.
 * Returns concrete node IDs and edge descriptions so the model
 * can ground its diagnosis in specific artifacts.
 */
function resolveProbeMatches(probe, nodes, edges) {
  const matches = { matching_edges: [], matching_nodes: [], description: '' };

  if (probe.signal_type === 'edge_present') {
    const filtered = edges.filter(
      (e) =>
        e.type === probe.params.edge_type &&
        (!probe.params.layer || e.layer === probe.params.layer),
    );
    matches.matching_edges = filtered.map((e) => ({
      source: e.source,
      target: e.target,
      type: e.type,
      layer: e.layer,
    }));
    matches.description = `Found ${filtered.length} edge(s) of type "${probe.params.edge_type}"${probe.params.layer ? ` in layer "${probe.params.layer}"` : ''}. Diagnose the tension each edge represents.`;
  }

  if (probe.signal_type === 'node_isolated') {
    const connected = new Set();
    for (const e of edges) {
      connected.add(e.source);
      connected.add(e.target);
    }
    const isolated = nodes.filter((n) => !connected.has(n.id));
    matches.matching_nodes = isolated.map((n) => ({ id: n.id, type: n.type, title: n.title }));
    matches.description = `Found ${isolated.length} isolated node(s) with zero edges. Each isolated node is a missing_bridge tension.`;
  }

  if (probe.signal_type === 'node_without_edge_type') {
    const nodesOfType = probe.params.node_type
      ? nodes.filter((n) => n.type === probe.params.node_type)
      : nodes;
    const missingEdge = probe.params.missing_edge_type;
    const dir = probe.params.direction ?? 'outgoing';

    const hasEdge = new Set();
    for (const e of edges) {
      if (e.type === missingEdge) {
        hasEdge.add(dir === 'outgoing' ? e.source : e.target);
      }
    }
    const missing = nodesOfType.filter((n) => !hasEdge.has(n.id));
    matches.matching_nodes = missing.map((n) => ({ id: n.id, type: n.type, title: n.title }));
    matches.description = `Found ${missing.length} ${probe.params.node_type ?? ''} node(s) without ${dir} "${missingEdge}" edge. Each is an unsupported claim.`;
  }

  return matches;
}

/**
 * @param {import('./types').CabinInput} input
 * @param {import('./types').WorldSnapshot} world
 * @param {Array<Record<string, unknown>>} questions
 * @param {{ maxNodes?: number; maxEdges?: number }} [options]
 * @returns {import('./adapters/types').CabinContext}
 */
export function buildCabinContext(input, world, questions, options = {}) {
  const maxNodes = options.maxNodes ?? 200;
  const maxEdges = options.maxEdges ?? 500;

  const nodes = world.nodes.slice(0, maxNodes).map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title ?? n.id,
  }));

  const edges = world.edges.slice(0, maxEdges).map((e) => ({
    source: e.source,
    target: e.target,
    type: e.type,
    ...(e.layer ? { layer: e.layer } : {}),
  }));

  const worldSummary = {
    world_ref: input.world_ref,
    node_count: world.nodes.length,
    edge_count: world.edges.length,
    nodes,
    edges,
  };

  const ctx = {
    mode: input.mode,
    world_summary: worldSummary,
    system_prompt: buildSystemPrompt(input.mode),
    output_schema: OUTPUT_SCHEMA,
  };

  if (input.mode === 'question_driven' && input.question_id) {
    const q = questions.find((item) => item.id === input.question_id);
    if (q) {
      ctx.question = {
        id: q.id,
        prompt: q.prompt,
        issue_type: q.issue_type,
        severity: q.severity,
        evidence_refs: q.evidence_refs ?? { doc_refs: [], code_refs: [], graph_refs: [] },
        ...(q.structural_signal ? { structural_signal: q.structural_signal } : {}),
      };
    }
  }

  if (input.mode === 'graph_relief_driven' && input.probe) {
    const probeMatches = resolveProbeMatches(input.probe, nodes, edges);
    ctx.probe = {
      signal_type: input.probe.signal_type,
      params: input.probe.params,
      resolved_matches: probeMatches,
    };
  }

  return ctx;
}
