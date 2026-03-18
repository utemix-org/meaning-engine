/**
 * Cabin eval matcher (v1).
 *
 * Compares a CabinDiagnosis against an eval case's expected shape.
 * Returns a structured MatchResult with per-field pass/fail + diff.
 *
 * @module cabin/matcher
 * @experimental
 */

/**
 * @param {import('./types').CabinDiagnosis} diagnosis
 * @param {object} expected  - from eval case expected shape
 * @param {string} caseId
 * @returns {import('./types').MatchResult}
 */
export function matchDiagnosis(diagnosis, expected, caseId) {
  const fields = [];

  fields.push(matchScalar('issue_type', expected.issue_type, diagnosis.issue_type));
  fields.push(matchScalar('severity', expected.severity, diagnosis.severity));
  fields.push(matchNonEmpty('claim', diagnosis.claim));

  if (expected.evidence_refs) {
    const er = expected.evidence_refs;
    const dr = diagnosis.evidence_refs ?? { doc_refs: [], code_refs: [], graph_refs: [] };

    if (er.graph_refs?.length) {
      fields.push(matchSubset('evidence_refs.graph_refs', er.graph_refs, dr.graph_refs));
    }
    if (er.doc_refs?.length) {
      fields.push(matchSubset('evidence_refs.doc_refs', er.doc_refs, dr.doc_refs));
    }
    if (er.code_refs?.length) {
      fields.push(matchSubsetPrefix('evidence_refs.code_refs', er.code_refs, dr.code_refs));
    }
  }

  const pass = fields.every((f) => f.pass);

  return { case_id: caseId, pass, fields };
}

function matchScalar(field, expected, actual) {
  return {
    field,
    expected,
    actual,
    pass: expected === actual,
  };
}

function matchNonEmpty(field, actual) {
  const pass = typeof actual === 'string' && actual.length > 0;
  return {
    field,
    expected: '<non-empty string>',
    actual: actual ?? null,
    pass,
  };
}

function matchSubset(field, expected, actual) {
  const actualSet = new Set(actual ?? []);
  const missing = expected.filter((x) => !actualSet.has(x));
  return {
    field,
    expected,
    actual: actual ?? [],
    pass: missing.length === 0,
  };
}

/**
 * Prefix-aware subset match for code refs. `src/core/GraphModel.js`
 * matches `src/core/GraphModel.js:254` (line numbers are optional detail).
 */
function matchSubsetPrefix(field, expected, actual) {
  const act = actual ?? [];
  const missing = expected.filter(
    (exp) => !act.some((a) => a === exp || a.startsWith(exp + ':')),
  );
  return {
    field,
    expected,
    actual: act,
    pass: missing.length === 0,
  };
}
