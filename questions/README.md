# Questions

This directory contains **question instances** — structured prompts used for cabin evaluation and system auditing.

## Format

All question files follow the schema defined in [docs/QUESTION_FORMAT.md](../docs/QUESTION_FORMAT.md).

## Files

| File | Tension set | Count | Description |
|------|-------------|-------|-------------|
| `tension-set-v1.json` | v1 | 5 | First intentional tension set from Phase 2 Audit |

## Tension Set v1

The first set covers 5 tension classes selected from real audit findings:

| ID | Class | Status | Severity |
|----|-------|--------|----------|
| Q-DRM-001 | doc_runtime_mismatch | resolved | P0 |
| Q-TCD-001 | type_contract_drift | resolved | P0 |
| Q-VOC-001 | vocabulary_ambiguity | resolved | P1 |
| Q-USC-001 | unsupported_claim | resolved | P1 |
| Q-MBR-001 | missing_bridge | open | P2 |

4 of 5 were resolved during Track A work. Q-MBR-001 remains open as calibration material.

## Usage

Questions are metadata artifacts. They are not loaded by the engine or operators. They serve as:

1. **Audit checklists** — verify that known tensions are resolved
2. **Cabin eval input** — future automated evaluation against worlds
3. **Regression anchors** — detect if a resolved tension reappears
