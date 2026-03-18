# Cabin Interface (v1)

The cabin is an **experimental/internal** module that produces structured diagnostic outputs over a knowledge world. It is not part of the public SemVer-covered API surface.

See [CABIN_EVAL.md](./CABIN_EVAL.md) for the eval framework that validates cabin outputs.

## Module location

`src/cabin/` (Variant A — internal module within `src/`).

Engine does **not** depend on cabin. Cabin may import from engine/core.

## Inputs

```typescript
interface CabinInput {
  world_ref: string;                   // path to proof world
  mode: 'question_driven' | 'graph_relief_driven';
  question_id?: string;                // required for question_driven
  probe?: GraphReliefProbe;            // required for graph_relief_driven
}

interface GraphReliefProbe {
  signal_type: 'edge_present' | 'edge_absent' | 'node_isolated' | 'node_without_edge_type';
  params: Record<string, string>;
}
```

### Question-driven mode

Cabin receives a question ID from a question set (e.g. `questions/tension-set-v1.json`). It loads the question's metadata (issue_type, severity, evidence_refs, structural_signal) and checks whether the referenced artifacts exist in the world.

### Graph-relief-driven mode

Cabin receives a structural probe and scans the world for matching patterns (specific edge types, absent edges, isolated nodes, nodes missing required edge types). It returns one diagnosis per detected tension.

## Outputs

```typescript
interface CabinDiagnosis {
  mode: 'question_driven' | 'graph_relief_driven';
  issue_type: string;           // from ISSUE_TAXONOMY
  severity: string;             // P0 / P1 / P2
  claim: string;                // structured description of finding
  evidence_refs: EvidenceRef;   // doc/code/graph references
  source_question_id?: string;  // present in question_driven mode
  detected_artifacts?: string[];// node/edge IDs found in world
}

interface EvidenceRef {
  doc_refs: string[];
  code_refs: string[];
  graph_refs: string[];
}
```

`cabinDiagnose()` always returns `CabinDiagnosis[]` (zero or more). Order is deterministic (stable sort by issue_type + detected_artifacts).

## Determinism contract

- `cabinDiagnose()` does not read hidden global state.
- All essential inputs (world snapshot, questions, probe) are explicit parameters.
- Multiple diagnoses are returned in stable sorted order.

## Matching (eval integration)

`matchDiagnosis(diagnosis, expected, caseId)` compares a cabin output against an eval case's expected shape:

| Check | Rule |
|-------|------|
| `issue_type` | Exact match |
| `severity` | Exact match |
| `claim` | Non-empty string |
| `evidence_refs.graph_refs` | Expected is a subset of actual |
| `evidence_refs.doc_refs` | Expected is a subset of actual (if specified) |
| `evidence_refs.code_refs` | Expected is a subset of actual (if specified) |

## Running

```bash
# Structural pass only (eval harness v1):
node eval/runCabinEvalStub.js

# Diagnostic pass — cabin produces diagnosis + matching:
node eval/runCabinEvalDiagnosticPass.js
```

## Future: LLM adapter boundary

v1 is fully deterministic (rule-based). When an LLM is connected (P1.B8), the adapter will:
1. Replace `cabinDiagnose()` internals with model inference
2. Keep the same `CabinInput` → `CabinDiagnosis[]` contract
3. Use the same matcher for evaluation
