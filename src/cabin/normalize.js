/**
 * Output normalization for model-backed cabin diagnostic pass.
 *
 * Parses a ModelResponse into CabinDiagnosis[] with strict envelope
 * validation. Parsing failures produce explicit error diagnostics
 * (no silent fallback).
 *
 * @module cabin/normalize
 * @experimental
 */

/**
 * @param {import('./adapters/types').ModelResponse} response
 * @param {'question_driven' | 'graph_relief_driven'} mode
 * @returns {import('./types').CabinDiagnosis[]}
 */
export function normalizeCabinOutput(response, mode) {
  if (response.error && !response.parsed) {
    return [
      makeErrorDiagnosis(mode, `Model error: ${response.error}`),
    ];
  }

  const envelope = response.parsed;
  if (!envelope || !Array.isArray(envelope.diagnoses)) {
    return [
      makeErrorDiagnosis(
        mode,
        `Invalid envelope: expected {diagnoses: [...]}, got: ${truncate(response.raw, 200)}`,
      ),
    ];
  }

  if (envelope.diagnoses.length === 0) {
    return [];
  }

  const results = [];

  for (let i = 0; i < envelope.diagnoses.length; i++) {
    const d = envelope.diagnoses[i];
    const validation = validateDiagnosis(d, i);
    if (validation.error) {
      results.push(makeErrorDiagnosis(mode, validation.error));
      continue;
    }

    results.push({
      mode,
      issue_type: d.issue_type,
      severity: d.severity,
      claim: d.claim,
      evidence_refs: {
        doc_refs: toStringArray(d.evidence_refs?.doc_refs),
        code_refs: toStringArray(d.evidence_refs?.code_refs),
        graph_refs: toStringArray(d.evidence_refs?.graph_refs),
      },
      detected_artifacts: toStringArray(d.evidence_refs?.graph_refs),
    });
  }

  results.sort((a, b) => {
    const key = (x) =>
      `${x.issue_type}::${x.detected_artifacts?.join(',') ?? ''}`;
    return key(a).localeCompare(key(b));
  });

  return results;
}

function validateDiagnosis(d, index) {
  if (!d || typeof d !== 'object') {
    return { error: `diagnoses[${index}]: not an object` };
  }
  if (typeof d.issue_type !== 'string' || !d.issue_type) {
    return { error: `diagnoses[${index}]: missing or empty issue_type` };
  }
  if (typeof d.severity !== 'string' || !d.severity) {
    return { error: `diagnoses[${index}]: missing or empty severity` };
  }
  if (typeof d.claim !== 'string' || !d.claim) {
    return { error: `diagnoses[${index}]: missing or empty claim` };
  }
  return { error: null };
}

function makeErrorDiagnosis(mode, message) {
  return {
    mode,
    issue_type: '_parse_error',
    severity: 'P0',
    claim: message,
    evidence_refs: { doc_refs: [], code_refs: [], graph_refs: [] },
    detected_artifacts: [],
  };
}

function toStringArray(val) {
  if (!Array.isArray(val)) return [];
  return val.filter((x) => typeof x === 'string');
}

function truncate(str, len) {
  if (typeof str !== 'string') return String(str);
  return str.length > len ? str.slice(0, len) + '...' : str;
}
