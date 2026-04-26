# Project Evolution Spec

## Purpose

Describe how the project intent evolved across repositories and documentation layers.

## Accepts

- Early `meaning-engine` repository documentation.
- Exported Notion documentation in `docs_for_codespeak/`.
- Later Notion tracks and tasks for the refactored "Vova and Petrova" project.
- Raw agent sessions shared separately.

## State

### Phase: Early Meaning Engine

Intent:

- explore graph-native representation of meaning;
- build a semantic projection engine;
- move from static authored graph data toward a reusable knowledge runtime.

Primary artifact:

- `utemix-org/meaning-engine`.

### Phase: Structured Documentation / Notion Tracks

Intent:

- stabilize the project language;
- extract tracks, tasks, ADRs, specs, and architecture notes;
- convert exploratory reasoning into reusable documentation.

Primary artifact:

- exported Notion documentation in `docs_for_codespeak/`.

### Phase: Vova and Petrova

Intent:

- continue the engine in a refactored product/world context;
- separate authored world content from the reusable projection/knowledge engine;
- make the engine a substrate under an authored knowledge world.

Primary artifact:

- later repository/project context, not fully represented by the early `meaning-engine` repo.

## Behavior

The project does not evolve as a single linear codebase.

It evolves as:

```text
idea -> engine prototype -> documentation system -> refactored project/world -> reusable knowledge runtime
```

## Constraints

- Do not assume that all raw sessions map to the early `meaning-engine` repository.
- Do not assume that old docs are obsolete; many contain stabilized intent.
- Do not require one-to-one alignment between session logs and final files.
- Treat the documentation as a semantic artifact, not merely README material.

## Output

A layered understanding of the project:

1. early engine intent;
2. stabilized documentation intent;
3. later refactored runtime/product intent;
4. raw session traces as process evidence.

## Interpretation for CodeSpeak

This project is valuable for intent extraction because it contains both:

- raw development traces;
- manually stabilized intent artifacts.

That allows comparison between extracted intent and an explicit reconstructed intent layer.
