# Cabin Eval (v1)

This document defines the evaluation framework for the **cabin** — a future internal observer that diagnoses tensions in a knowledge system. v1 establishes the harness (structure, cases, pass/fail criteria) without LLM integration.

## What is cabin eval?

Cabin eval is a controlled test of whether an observer (human or machine) can correctly identify and describe structural tensions in a world, given either a question prompt or raw graph data.

The eval does **not** test general intelligence or free-form reasoning. It tests whether the observer can:
1. Identify the correct tension class
2. Point to the correct graph/code/doc evidence
3. Produce an output that matches the expected shape

## Two modes

### Question-driven mode

**Input:** A question from `questions/tension-set-v1.json` (or future sets).
**Task:** Answer the question using the bound evidence refs and world data.
**Output:** A diagnosis object matching the expected shape.

This mode tests: *"Given a specific prompt, can the observer find the right answer?"*

### Graph-relief-driven mode

**Input:** A world reference + a structural probe (what pattern to look for).
**Task:** Inspect the graph and identify the tension pattern structurally.
**Output:** A diagnosis object identifying the tension class, affected nodes/edges, and severity.

This mode tests: *"Given a graph, can the observer detect embedded tensions without being told what to look for?"*

## Evaluation levels

### Level 1: Structural pass (v1 — fully covered)

The world contains the expected tension/evidence pattern. This is verified by the stub runner without any model.

Checks:
- Referenced nodes exist in the world
- Referenced edges exist with the expected types
- Structural signal is observable (e.g., `drift_against` edge present, `same_as` absent, node isolated)
- Expected `issue_type` matches the tension class embedded in the world

### Level 2: Diagnostic pass (future — shape only in v1)

A cabin observer produces a diagnosis that matches the expected output shape.

v1 defines the shape but does **not** execute LLM diagnosis. The expected shape is recorded in each case for future validation.

## Scoring dimensions (future, recorded for design)

When Level 2 is implemented, diagnosis quality will be scored on:

| Dimension | Description |
|-----------|-------------|
| **Specificity** | Does the diagnosis name the exact tension class (not a vague category)? |
| **Grounding** | Does the diagnosis cite concrete evidence (node IDs, file paths, line numbers)? |
| **Relevance** | Is the cited evidence actually related to the tension? |
| **Actionability** | Does the diagnosis suggest a concrete fix or next step? |
| **Non-decorativeness** | Is the diagnosis substantive (not just restating the question)? |

v1 does not score these — they are recorded as design intent for v2.

## Pass/fail criteria (v1)

### Structural pass (deterministic, automated)

A case passes if **all** of the following hold:

1. `world_ref` points to a loadable world
2. All `evidence_refs.graph_refs` resolve to existing nodes or edges
3. The `structural_signal` is observable in the graph (checked by signal-specific logic)
4. The `issue_type` in the case matches the tension class embedded in the referenced artifacts

### Diagnostic pass (v1: shape validation only)

A case's expected output shape is recorded but not yet evaluated against model output. When a model is connected, pass requires:

1. Output contains `issue_type` matching expected
2. Output contains `severity` within expected range
3. Output contains at least one valid `evidence_ref` pointing to a real artifact
4. Output `claim` is a non-empty string

## Case format

See `eval/cabin_cases/README.md` for the full case schema.

## Running

```bash
node eval/runCabinEvalStub.js
```

This runs all cases in structural-pass mode and prints a pass/fail report.

## Relationship to other artifacts

| Artifact | Role |
|----------|------|
| [QUESTION_FORMAT.md](./QUESTION_FORMAT.md) | Schema for question inputs |
| [ISSUE_TAXONOMY.md](./ISSUE_TAXONOMY.md) | Vocabulary for `issue_type` |
| [TENSION_EMBEDDING_POLICY.md](./TENSION_EMBEDDING_POLICY.md) | How tensions are embedded in worlds |
| `worlds/tension-test-world/` | Proof world with materialized tensions |
| `questions/tension-set-v1.json` | Bound question instances |
| `eval/cabin_cases/` | Golden cases for eval harness |
| `eval/runCabinEvalStub.js` | Stub runner (structural pass only) |
