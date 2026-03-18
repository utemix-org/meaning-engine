# Cabin Grades

Per-case quality grades for cabin diagnostic outputs, organized by adapter.

See [CABIN_SCORING_RUBRIC.md](../../docs/CABIN_SCORING_RUBRIC.md) for dimension definitions and grading scale.

## Grade file schema

Each file is a JSON array of grade records:

| Field | Type | Description |
|-------|------|-------------|
| `case_id` | string | Eval case ID (e.g. `CE-QD-001`) |
| `adapter` | string | `deterministic`, `stub`, `openai/<model>` |
| `match_pass` | boolean | Did the matcher pass? |
| `dimensions` | object | Per-dimension grades (D1–D7) |
| `overall` | string | `pass`, `weak_pass`, `structured_wrong`, `parse_fail`, `fail` |
| `failure_patterns` | string[] | Detected failure patterns from rubric catalog |
| `notes` | string | Free-text observations |
| `meta` | object | Reproducibility metadata |

### Dimensions object

```json
{
  "issue_type_correctness": "pass",
  "severity_correctness": "pass",
  "evidence_adequacy": "pass",
  "grounding_quality": "pass",
  "boundedness": "pass",
  "specificity": "pass",
  "actionability": "weak_pass"
}
```

## Files

| File | Adapter | Description |
|------|---------|-------------|
| `deterministic.json` | deterministic | Baseline — always 8/8 by construction |
| `stub.json` | stub | Stub adapter — echo-based, no graph analysis |
