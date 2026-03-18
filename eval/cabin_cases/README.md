# Cabin Eval Cases

This directory contains **golden cases** for the cabin eval harness. Each case defines an input, expected output shape, and structural pass criteria.

See [docs/CABIN_EVAL.md](../../docs/CABIN_EVAL.md) for the full evaluation framework.

## Case schema

Each case is a JSON object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `case_id` | string | yes | Stable identifier (pattern: `CE-<mode>-NNN`) |
| `mode` | enum | yes | `question_driven` or `graph_relief_driven` |
| `world_ref` | string | yes | Path to the proof world (e.g. `worlds/tension-test-world`) |
| `input` | object | yes | Mode-specific input (see below) |
| `expected` | object | yes | Expected output shape + structural checks |

### Input (question_driven mode)

| Field | Type | Description |
|-------|------|-------------|
| `question_id` | string | ID from a question set (e.g. `Q-DRM-001`) |

### Input (graph_relief_driven mode)

| Field | Type | Description |
|-------|------|-------------|
| `probe` | object | What structural signal to look for |
| `probe.signal_type` | string | Signal pattern: `edge_present`, `edge_absent`, `node_isolated`, `node_without_edge_type` |
| `probe.params` | object | Signal-specific parameters |

### Expected output

| Field | Type | Description |
|-------|------|-------------|
| `issue_type` | string | Expected tension class from ISSUE_TAXONOMY |
| `severity` | string | Expected severity (P0/P1/P2) |
| `claim` | string | Human-readable description of what should be found |
| `evidence_refs` | object | Expected doc/code/graph references |
| `structural_checks` | array | List of structural assertions (see below) |

### Structural checks

Each check is an object with:

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Check type: `node_exists`, `edge_exists`, `edge_absent`, `node_isolated` |
| `params` | object | Check-specific parameters (node_id, source, target, edge_type, etc.) |

## Files

| File | Cases | Description |
|------|-------|-------------|
| `golden_v1.json` | 8 | First golden set: 4 question-driven + 4 graph-relief-driven |

## Running

```bash
node eval/runCabinEvalStub.js
```
