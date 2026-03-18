/**
 * Context assembly for model-backed cabin diagnostic pass.
 *
 * Builds a deterministic, size-limited CabinContext from explicit inputs.
 * No hidden global state; no file system reads.
 *
 * @module cabin/context
 * @experimental
 */

const SYSTEM_PROMPT = `You are a cabin diagnostic observer for the Meaning Engine.
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
    system_prompt: SYSTEM_PROMPT,
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
    ctx.probe = {
      signal_type: input.probe.signal_type,
      params: input.probe.params,
    };
  }

  return ctx;
}
