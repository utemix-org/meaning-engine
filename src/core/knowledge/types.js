/**
 * Knowledge Substrate types — Phase 4.5 / 5c
 *
 * Formula: Log → Statements → Graph → Projection → ViewModel → UI
 *
 * Knowledge lives in statements (S, P, O), not in the graph.
 * The graph is a derived structure built from canonical statements.
 */

export const StatementStatus = {
  PROPOSED: 'proposed',
  VERIFIED: 'verified',
  CANONICAL: 'canonical',
  REJECTED: 'rejected',
};

export const EpistemicEventType = {
  PROPOSE: 'propose',
  VERIFY: 'verify',
  APPROVE: 'approve',
  REJECT: 'reject',
};
