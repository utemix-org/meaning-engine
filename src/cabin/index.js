/**
 * Cabin module v1 — deterministic diagnostic pass (no LLM).
 *
 * Produces structured CabinDiagnosis objects by inspecting a world's
 * structural tension patterns. All inputs are explicit; no hidden
 * global state.
 *
 * @module cabin
 * @experimental
 */

/**
 * Tension-signal detection rules for graph-relief-driven mode.
 * Each rule maps a probe signal_type to a function that scans the
 * world and returns zero or more diagnosis objects.
 */
const SIGNAL_DETECTORS = {
  edge_present(world, params) {
    const hits = world.edges.filter(
      (e) =>
        e.type === params.edge_type &&
        (!params.layer || e.layer === params.layer),
    );
    return hits.map((e) => ({
      detected_artifacts: [e.source, e.target],
      tension_class: e.tension_class ?? null,
      source_edge: e,
    }));
  },

  edge_absent(world, params) {
    const found = world.edges.some(
      (e) =>
        e.source === params.source &&
        e.target === params.target &&
        e.type === params.edge_type,
    );
    if (!found) {
      return [
        {
          detected_artifacts: [params.source, params.target],
          tension_class: null,
          note: `Expected edge ${params.source} →[${params.edge_type}]→ ${params.target} is absent`,
        },
      ];
    }
    return [];
  },

  node_isolated(world, _params) {
    const connected = new Set();
    for (const e of world.edges) {
      connected.add(e.source);
      connected.add(e.target);
    }
    const isolated = world.nodes.filter((n) => !connected.has(n.id));
    return isolated.map((n) => ({
      detected_artifacts: [n.id],
      tension_class: n.tension_class ?? null,
    }));
  },

  node_without_edge_type(world, params) {
    const { node_type, missing_edge_type, direction } = params;
    const candidates = node_type
      ? world.nodes.filter((n) => n.type === node_type)
      : world.nodes;

    return candidates
      .filter((n) => {
        if (direction === 'outgoing') {
          return !world.edges.some(
            (e) => e.source === n.id && e.type === missing_edge_type,
          );
        }
        if (direction === 'incoming') {
          return !world.edges.some(
            (e) => e.target === n.id && e.type === missing_edge_type,
          );
        }
        return !world.edges.some(
          (e) =>
            (e.source === n.id || e.target === n.id) &&
            e.type === missing_edge_type,
        );
      })
      .map((n) => ({
        detected_artifacts: [n.id],
        tension_class: n.tension_class ?? null,
      }));
  },
};

const TENSION_CLASS_TO_ISSUE_TYPE = {
  doc_runtime_mismatch: { issue_type: 'doc_runtime_mismatch', severity: 'P0' },
  type_contract_drift: { issue_type: 'type_contract_drift', severity: 'P0' },
  vocabulary_ambiguity: { issue_type: 'vocabulary_ambiguity', severity: 'P1' },
  unsupported_claim: { issue_type: 'unsupported_claim', severity: 'P1' },
  missing_bridge: { issue_type: 'missing_bridge', severity: 'P2' },
};

const SIGNAL_TYPE_DEFAULT_ISSUE = {
  edge_present: 'doc_runtime_mismatch',
  edge_absent: 'vocabulary_ambiguity',
  node_isolated: 'missing_bridge',
  node_without_edge_type: 'unsupported_claim',
};

/**
 * @param {import('./types').CabinInput} input
 * @param {import('./types').WorldSnapshot} world
 * @param {Array<Record<string, unknown>>} questions
 * @returns {import('./types').CabinDiagnosis[]}
 */
export function cabinDiagnose(input, world, questions) {
  if (input.mode === 'question_driven') {
    return diagnoseQuestionDriven(input, world, questions);
  }
  if (input.mode === 'graph_relief_driven') {
    return diagnoseGraphReliefDriven(input, world);
  }
  throw new Error(`Unknown cabin mode: ${input.mode}`);
}

function diagnoseQuestionDriven(input, world, questions) {
  const q = questions.find((item) => item.id === input.question_id);
  if (!q) {
    return [
      {
        mode: 'question_driven',
        issue_type: 'unknown',
        severity: 'P2',
        claim: `Question ${input.question_id} not found in question set.`,
        evidence_refs: { doc_refs: [], code_refs: [], graph_refs: [] },
        source_question_id: input.question_id,
      },
    ];
  }

  const graphRefs = q.evidence_refs?.graph_refs ?? [];
  const nodePresent = graphRefs.every((ref) =>
    world.nodes.some((n) => n.id === ref),
  );

  const claim = nodePresent
    ? `Tension detected: ${q.issue_type} — ${q.structural_signal || q.prompt}`
    : `Question references graph artifacts not found in world: ${graphRefs.join(', ')}`;

  return [
    {
      mode: 'question_driven',
      issue_type: q.issue_type,
      severity: q.severity,
      claim,
      evidence_refs: {
        doc_refs: q.evidence_refs?.doc_refs ?? [],
        code_refs: q.evidence_refs?.code_refs ?? [],
        graph_refs: graphRefs,
      },
      source_question_id: q.id,
      detected_artifacts: graphRefs.filter((ref) =>
        world.nodes.some((n) => n.id === ref),
      ),
    },
  ];
}

function diagnoseGraphReliefDriven(input, world) {
  const probe = input.probe;
  if (!probe) {
    throw new Error('graph_relief_driven mode requires a probe');
  }

  const detector = SIGNAL_DETECTORS[probe.signal_type];
  if (!detector) {
    throw new Error(`Unknown probe signal_type: ${probe.signal_type}`);
  }

  const hits = detector(world, probe.params);
  if (hits.length === 0) {
    return [];
  }

  const results = hits.map((hit) => {
    const tc = hit.tension_class;
    const meta = tc
      ? TENSION_CLASS_TO_ISSUE_TYPE[tc]
      : TENSION_CLASS_TO_ISSUE_TYPE[
          SIGNAL_TYPE_DEFAULT_ISSUE[probe.signal_type]
        ] ?? { issue_type: 'unknown', severity: 'P2' };

    return {
      mode: 'graph_relief_driven',
      issue_type: meta.issue_type,
      severity: meta.severity,
      claim: `Structural signal [${probe.signal_type}] detected: ${hit.detected_artifacts?.join(', ') ?? 'unknown artifacts'}`,
      evidence_refs: {
        doc_refs: [],
        code_refs: [],
        graph_refs: hit.detected_artifacts ?? [],
      },
      detected_artifacts: hit.detected_artifacts ?? [],
    };
  });

  results.sort((a, b) => {
    const key = (d) =>
      `${d.issue_type}::${d.detected_artifacts?.join(',') ?? ''}`;
    return key(a).localeCompare(key(b));
  });

  return results;
}
