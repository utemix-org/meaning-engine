/**
 * Stub model adapter — returns a valid envelope without calling any API.
 * Used for testing the adapter pipeline without credentials.
 *
 * @implements {import('./types').ModelAdapter}
 * @experimental
 */

export const stubAdapter = {
  name: 'stub',

  async invoke(request) {
    const ctx = request.context;

    let issue_type = 'unknown';
    let severity = 'P2';
    let claim = 'Stub adapter: no real model invocation.';
    const graph_refs = [];

    if (ctx.mode === 'question_driven' && ctx.question) {
      issue_type = ctx.question.issue_type;
      severity = ctx.question.severity;
      claim = `[stub] ${ctx.question.prompt}`;
      graph_refs.push(...(ctx.question.evidence_refs?.graph_refs ?? []));
    }

    if (ctx.mode === 'graph_relief_driven' && ctx.probe) {
      claim = `[stub] Probe ${ctx.probe.signal_type} over world ${ctx.world_summary.world_ref}`;
    }

    const envelope = {
      diagnoses: [
        {
          issue_type,
          severity,
          claim,
          evidence_refs: {
            doc_refs: ctx.question?.evidence_refs?.doc_refs ?? [],
            code_refs: ctx.question?.evidence_refs?.code_refs ?? [],
            graph_refs,
          },
        },
      ],
    };

    return {
      raw: JSON.stringify(envelope),
      parsed: envelope,
    };
  },
};
