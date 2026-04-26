# CodeSpeak Intent Spec Package

This folder contains a compact, spec-like reconstruction of the project intent behind Meaning Engine and its later continuation in the "Vova and Petrova" project.

It is intended as an additional layer on top of:

- exported Notion documentation already placed in `docs_for_codespeak/`;
- project documentation in `docs/`;
- raw agent sessions shared separately via `npx codespeak-vibe-share`.

## Why this package exists

The raw sessions contain the live process: prompts, agent responses, iterations, dead ends, and local decisions. The exported documentation contains a more stabilized record of architecture, tasks, tracks, and decisions.

This package is the bridge between them:

```text
raw sessions + Notion docs + repo docs -> reconstructed intent specs
```

It does not claim to be the entire history. It is a curated, explicit intent layer.

## Important context

The project evolved over more than one phase.

1. `meaning-engine` is the early engine/research history.
2. Later work continued in a refactored form in the separate "Vova and Petrova" project/repository.
3. Some currently shared agent sessions may refer to the later state rather than the early `meaning-engine` repository.
4. Some sessions may contain meta-work, such as packaging documentation for CodeSpeak. That is expected noise.

The useful signal is not perfect alignment between every session and every final artifact. The useful signal is the evolution of intent: how a vague knowledge-graph idea became a layered architecture with projection, knowledge substrate, canonical state, and epistemic review.

## Core intent in one paragraph

The project aims to build a knowledge operating environment: a graph-native system where knowledge is represented as structured statements, evolved through explicit epistemic operations, compiled into canonical graph state, and projected into user-facing views through a semantic projection engine. The system separates raw proposals, canonical knowledge, review/governance state, and visual/UI projections.

## Files

- `01_INTENT_OVERVIEW.md` — high-level reconstructed intent.
- `02_PROJECT_EVOLUTION.md` — how the project moved from early Meaning Engine to later Vova and Petrova work.
- `03_MEANING_ENGINE_SPEC.md` — formalized early engine intent.
- `04_PROJECTION_ENGINE_SPEC.md` — projection engine contract.
- `05_KNOWLEDGE_SUBSTRATE_SPEC.md` — knowledge log / canonical state / event-sourced model.
- `06_EPISTEMIC_REVIEW_WORKFLOW_SPEC.md` — proposal/review/canonical admission layer.
- `07_RAW_SESSIONS_CONTEXT.md` — how to interpret raw agent sessions.

## Reading strategy for CodeSpeak

Read this package as a hand-authored intent reconstruction, not as ordinary product documentation.

The exported documentation shows what stabilized.
The raw sessions show how work actually happened.
This package names the architectural intent that connects both.
