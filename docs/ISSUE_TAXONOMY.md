# Issue / Tension Taxonomy (v1)

This document defines the canonical vocabulary for classifying **tensions** — structural inconsistencies, mismatches, or unsupported claims within a system.

The taxonomy is derived from real audit findings during the Meaning Engine Phase 2 Audit. Each class maps to a pattern that can be detected through graph analysis, document inspection, or code review.

## Tension classes

| Code | Name | Description | Audit origin |
|------|------|-------------|--------------|
| `doc_runtime_mismatch` | Doc/Runtime Mismatch | A documentation claim does not match observed runtime behavior. | P0.4: `toJSON()` dropped `type`; P1.5: `getNeighbors` return type inconsistency |
| `type_contract_drift` | Type Contract Drift | `.d.ts` declarations diverge from JavaScript runtime. | P0.2b: `graph.d.ts` claimed `NodeData[]` for `getNeighbors`, actual was `Set<string>` |
| `graph_interface_divergence` | Graph Interface Divergence | The same method name has different semantics in different layers. | P1.5: `GraphModel.getNeighbors` → `Set<string>` vs `WorldAdapter.getNeighbors` → `NodeData[]` |
| `vocabulary_ambiguity` | Vocabulary Ambiguity | Two terms refer to the same concept, or one term has two meanings. | `links` vs `edges` ambiguity in constructor, seeds, and `toJSON()` |
| `unsupported_claim` | Unsupported Architectural Claim | A document makes a claim stronger than what tests or evidence support. | "Core Formula" presented without qualification; invariant claims without test coverage |
| `missing_bridge` | Missing Bridge | Two concepts that should be connected have no path between them. | Graph gap detection in doc-world (e.g. isolated concepts with no edges to spec) |
| `version_drift` | Version Drift | Multiple version declarations are out of sync. | P0.1: `package.json` 0.1.2, `ENGINE_VERSION` 0.7.0, `specification.json` 0.5.0 |
| `spec_path_drift` | Specification Path Drift | Specification references point to non-existent file paths. | P0.6: `specification.json` used `engine/src/...` paths, actual was `src/engine/...` |
| `purity_boundary_violation` | Purity Boundary Violation | A function documented as pure has observable side effects or hidden state. | Potential: operator modules with file-level caching (`_nodes`/`_edges` in `trace.js`) |
| `mode_ambiguity` | Mode Ambiguity | A configurable mode exists but its semantics are undocumented or untested. | Workbench/character/domain projection modes in `computeVisibleSubgraph.js` |

## Severity mapping

Tension classes are not inherently tied to a severity level. Severity is assigned per question instance based on impact:

| Severity | Meaning | Typical classes |
|----------|---------|-----------------|
| `P0` | Blocks release; breaks public promise or contract | `doc_runtime_mismatch`, `type_contract_drift`, `version_drift` |
| `P1` | Should fix; creates confusion or inconsistency | `graph_interface_divergence`, `vocabulary_ambiguity`, `unsupported_claim` |
| `P2` | Nice to fix; low user impact | `missing_bridge`, `mode_ambiguity`, `purity_boundary_violation` |

## Code prefixes for question IDs

Each tension class has a short code used in question IDs:

| Class | Prefix |
|-------|--------|
| `doc_runtime_mismatch` | `DRM` |
| `type_contract_drift` | `TCD` |
| `graph_interface_divergence` | `GID` |
| `vocabulary_ambiguity` | `VOC` |
| `unsupported_claim` | `USC` |
| `missing_bridge` | `MBR` |
| `version_drift` | `VDR` |
| `spec_path_drift` | `SPD` |
| `purity_boundary_violation` | `PBV` |
| `mode_ambiguity` | `MOD` |

## Extension rules

New tension classes may be added when:

1. A new pattern is observed during audit or cabin evaluation
2. The pattern does not fit any existing class
3. The new class is added to this table with a code, description, and at least one concrete example
4. A CHANGELOG entry records the addition

Classes should not be removed — they may be marked `retired` if no longer relevant.

## Relationship to other artifacts

| Artifact | Role |
|----------|------|
| [QUESTION_FORMAT.md](./QUESTION_FORMAT.md) | Uses `issue_type` from this taxonomy |
| [TENSION_EMBEDDING_POLICY.md](./TENSION_EMBEDDING_POLICY.md) | Defines how these classes manifest in graph structure |
| CHANGELOG.md | Records when tension classes are first detected and resolved |
| Phase 2 Audit plan (Notion) | Source of original tension observations |
