# Tension Test World

A minimal, intentionally constructed world that embeds all 5 tension classes from Tension Set v1. This world exists for **cabin evaluation** and **structural observability testing** — it is internal proof material, not part of the public promise.

## Purpose

- Provide graph-embedded tension patterns that operators can detect structurally
- Bind question instances to concrete graph artifacts
- Serve as calibration material for future cabin eval harness

## Graph summary

- **14 nodes** across 6 types: `spec`, `concept`, `code_artifact`, `invariant`, `evidence`, `decision`
- **14 edges** across 8 types: `defines`, `constrains`, `proved_by`, `documents`, `drift_against`, `declares`, `contradicts`, `used_by`, `applies_to`, `implements`
- **3 layers**: `concept`, `provenance`, `tension`

## Embedded tension classes

### 1. `doc_runtime_mismatch` (DRM)

| Artifact | ID |
|----------|----|
| Spec documenting serialization | `spec:serialization-format` |
| Code artifact that drifted | `code_artifact:toJSON` |
| Documents edge | `spec:serialization-format → code_artifact:toJSON` (type: `documents`) |
| Drift signal | `code_artifact:toJSON → spec:serialization-format` (type: `drift_against`, layer: `tension`) |

**Structural signal:** Presence of `drift_against` edge between a code artifact and its documenting spec.

**Bound question:** Q-DRM-001

### 2. `type_contract_drift` (TCD)

| Artifact | ID |
|----------|----|
| Type declaration spec | `spec:type-declarations` |
| Code artifact with different runtime type | `code_artifact:getNeighbors` |
| Declares edge | `spec:type-declarations → code_artifact:getNeighbors` (type: `declares`) |
| Contradiction signal | `code_artifact:getNeighbors → spec:type-declarations` (type: `contradicts`, layer: `tension`) |

**Structural signal:** Presence of `contradicts` edge between a code artifact and its type declaration.

**Bound question:** Q-TCD-001

### 3. `vocabulary_ambiguity` (VOC)

| Artifact | ID |
|----------|----|
| Legacy term | `concept:links` |
| Canonical term | `concept:edges` |
| Both link to same code | `concept:links → code_artifact:toJSON` and `concept:edges → code_artifact:toJSON` (type: `used_by`) |

**Structural signal:** Two concept nodes linked to the same code artifact via `used_by`, but **no `same_as` or `alias_of` edge** between them.

**Bound question:** Q-VOC-001

### 4. `unsupported_claim` (USC)

| Artifact | ID |
|----------|----|
| Claim without evidence | `decision:projection-formula` |
| Concept it applies to | `concept:projection` |
| Applies-to edge | `decision:projection-formula → concept:projection` (type: `applies_to`) |

**Structural signal:** `decision` node with `applies_to` edge but **no `proved_by` edge** to any `evidence` or `invariant` node.

**Bound question:** Q-USC-001

### 5. `missing_bridge` (MBR)

| Artifact | ID |
|----------|----|
| Isolated concept | `concept:epistemic-log` |

**Structural signal:** Node with **zero edges** — completely disconnected from the main graph. Trace from any node to this node returns `no_path`.

**Bound question:** Q-MBR-001

## What this world proves

- Each tension class from TENSION_EMBEDDING_POLICY v1 can be materialized as graph relief
- Operators (trace, compare, supports) can detect these patterns structurally
- Questions can be bound to concrete graph artifacts with stable IDs

## What this world does NOT prove

- That an LLM can diagnose these tensions (future cabin eval)
- That the scoring/grading rubric is correct (not defined yet)
- That these tensions represent all possible failure modes (taxonomy may grow)

## Loading

```javascript
import { loadTensionTestWorld } from './loader.js';
const { graph, meta, raw } = loadTensionTestWorld();
```

## Smoke check

```bash
node operators/runTensionSmokeCheck.js
```

This prints a structural observability report showing which tension patterns are detected.
