# Cabin Scoring Rubric (v2)

This document defines quality dimensions and grading criteria for cabin diagnostic outputs. It applies to both deterministic and model-backed modes.

## Scoring dimensions

| # | Dimension | What it measures | Weight |
|---|-----------|------------------|--------|
| D1 | **Issue-type correctness** | Does the diagnosis name the correct tension class from ISSUE_TAXONOMY? | High |
| D2 | **Severity correctness** | Does the severity match the expected level (P0/P1/P2)? | Medium |
| D3 | **Evidence adequacy** | Does the diagnosis cite at least the expected evidence refs (doc/code/graph)? | High |
| D4 | **Grounding quality** | Do cited refs actually exist in the world and support the claim? | High |
| D5 | **Boundedness** | Does the diagnosis avoid overclaiming (no hallucinated nodes, no invented evidence)? | High |
| D6 | **Specificity** | Does the diagnosis name exact node IDs, edge types, file paths (not vague categories)? | Medium |
| D7 | **Actionability** | Does the claim suggest a concrete fix or next step? | Low |

## Grading scale

### Per-dimension grades

| Grade | Meaning |
|-------|---------|
| `pass` | Fully correct on this dimension |
| `weak_pass` | Partially correct — right direction but missing detail or slightly off |
| `fail` | Incorrect or missing |
| `n/a` | Dimension not applicable to this case |

### Overall case grades

| Grade | Definition |
|-------|------------|
| `pass` | D1–D5 all pass; D6–D7 at least weak_pass |
| `weak_pass` | D1–D3 pass; at most 1 fail in D4–D7 |
| `structured_wrong` | Output parsed correctly but diagnosis is wrong (issue_type or severity mismatch) |
| `parse_fail` | Output could not be parsed into valid envelope |
| `fail` | 2+ fails in D1–D5, or hallucinated evidence |

### Structural pass (orthogonal)

Structural pass (from v1 eval harness) checks whether the world contains expected artifacts. It is evaluated independently from diagnostic quality and is always deterministic.

## Failure patterns (catalog)

| Pattern | Description | How to detect |
|---------|-------------|---------------|
| `wrong_issue_type` | Model returns a different tension class than expected | D1 = fail |
| `wrong_severity` | Severity level does not match | D2 = fail |
| `missing_evidence` | Expected evidence refs not present in output | D3 = fail |
| `hallucinated_evidence` | Output cites node IDs or file paths not in the world | D5 = fail |
| `overclaiming` | Diagnosis makes claims stronger than evidence supports | D5 = fail |
| `vague_claim` | Claim uses generic language without specific artifacts | D6 = fail |
| `no_action` | No fix or next step suggested | D7 = fail |
| `parse_failure` | Model output not valid JSON or missing required fields | overall = parse_fail |

## Reproducibility metadata

Each grading record must include:

| Field | Description |
|-------|-------------|
| `timestamp` | ISO 8601 timestamp of the run |
| `adapter` | Adapter name (deterministic, stub, openai/gpt-4o-mini) |
| `model` | Model name/version if applicable |
| `context_limits` | maxNodes / maxEdges used |
| `case_set` | File path and version of golden cases |
