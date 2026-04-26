# OPUS_TASK__ME_READINESS__E1__SPEC_CODE_TEST_TRACEABILITY_WORLD_AND_DEMO_PACK

---

title: OPUS_TASK__ME_READINESS__E1__SPEC_CODE_TEST_TRACEABILITY_WORLD_AND_DEMO_PACK

kind: engineering-task

project: Meaning Engine

owner: Opus

status: accepted

track: ME_READINESS

block: E (External proof via use-case)

languages:

repo: en

notion: ru

---

## Context

Blocks A–D are now in place at a first serious level:

- Block A: identity lock
- Block C: trust-surface cleanup
- Block B: stable-core evidence lock
- Block D: first operational envelope

The next readiness step is to create the first external, engineering-recognizable proof case:

a small, public, reproducible world centered on spec → code → test traceability.

This should demonstrate that Meaning Engine is not only internally coherent, but also externally useful on an engineering-shaped problem.

References:

- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT.md)
- Accepted tasks: [OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA](OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA.md), [COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP](COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP.md), [COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP](COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP.md), [OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS](OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS.md), [OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS](OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS.md), [OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE](OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE.md), [OPUS_TASK__ME_READINESS__B4__HIGHLIGHT_MODEL_EVIDENCE_AND_BLOCK_B_CONSOLIDATION](OPUS_TASK__ME_READINESS__B4__HIGHLIGHT_MODEL_EVIDENCE_AND_BLOCK_B_CONSOLIDATION.md), [OPUS_TASK__ME_READINESS__D1__BENCHMARK_HARNESS_AND_OPERATIONAL_LIMITS_NOTE](OPUS_TASK__ME_READINESS__D1__BENCHMARK_HARNESS_AND_OPERATIONAL_LIMITS_NOTE.md)
- Evidence docs: `docs/INVARIANT_MATRIX.md`, `docs/PROOF_OBLIGATIONS.md`, `docs/OPERATIONAL_LIMITS.md`

## Goal

Create the first public industrial-style proof pack for Meaning Engine:

1) a small traceability reference world,

2) a reproducible scenario/demo pack,

3) an evidence-oriented explanation of what the engine demonstrates on that world,

…without expanding public promise or pretending to be a full ALM/requirements platform.

## Opus — operating mode

You are Opus. This is a use-case proof task.

Your job is to:

- construct a small but credible engineering case
- prefer clarity and traceability over realism theater
- ensure the case uses current engine strengths rather than forcing new capabilities
- keep claims narrow: this is a proof-of-utility case, not a product vertical

## Scope

### Must do

1) Create a small public traceability world

Design a compact reference world representing:

- requirements/specs
- implementation/code artifacts
- tests/evidence
- invariants/constraints where helpful

Use existing graph model conventions and current stable-core capabilities.

The world should be:

- small enough to understand quickly
- large enough to show nontrivial trace paths and at least one meaningful gap or missing bridge
- enough entities to show at least 2–3 meaningful trace chains and at least 1 deliberate gap
- self-contained and reproducible in repo

2) Define a scenario/demo pack

Create a small set of reproducible scenarios, such as:

- trace from requirement/spec to code
- trace from requirement/spec to test/evidence
- detect a missing bridge / gap
- optionally compare rival implementation paths if the world naturally supports it

The scenarios should be runnable in a simple reproducible way (CLI/script/doc procedure).

3) Add explanatory docs for the use-case

Create a concise doc explaining:

- what the world models
- what each scenario demonstrates
- why this is an engineering-relevant proof case
- what it does NOT demonstrate

4) Keep the case honest

Do not turn this into:

- a fake enterprise ALM platform
- a broad compliance solution
- a generated “realistic” corpus with lots of noise

The world should be deliberately small and clean enough to explain.

### Should do (only if small and clearly in-scope)

- Include one scenario with a deliberate missing link/gap.
- Include one scenario that produces more than one plausible path if the graph naturally supports it.
- Add one small report artifact or markdown output example if easy.

### Must NOT do

- Do not redesign the engine for the use-case.
- Do not add new core capabilities just to make the scenario prettier.
- Do not expand public promise.
- Do not claim industrial completeness from a compact proof case.
- Do not introduce AW/worldbuilding framing.

## Acceptance criteria

- A small public traceability world exists in repo.
- A reproducible scenario/demo pack exists.
- A concise explanatory doc exists for the use-case.
- The case clearly demonstrates at least traceability and at least one gap/boundary.
- No unrelated runtime/API behavior changes.
- All tests pass (`npm test`).

## Observability / process

- Issue-first:
 - Create a GitHub issue for this task unless one already exists.
 - Open a PR that links the issue and closes it.
- Commit messages: EN.
- PR description must include:
 - Goal
 - Non-goals
 - Acceptance checklist
 - Files changed
 - Which scenarios were added
 - What the case demonstrates
 - What the case does not demonstrate

## Deliverables (report back here, RU)

### Implementation report

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- Tests run + result

### What changed (RU)

- List files changed
- Summarize the traceability world
- Summarize the scenarios/demo pack
- Summarize the explanatory doc

### Use-case value (RU)

- What this case demonstrates about Meaning Engine
- Which engine strengths it shows clearly
- Which limitations remain visible by design

### Open questions / risks

- Any part of the case that still feels too toy-like
- Any part that risks overstating industrial relevance
- What the next use-case should be after E1

## Notes

- This is a proof-of-utility task, not a productization task.
- Small, legible, reproducible beats large and noisy.
- Honest scope is more persuasive than fake realism.
- The world should adapt to current engine vocabulary, not drive new core/domain semantics.

---

## Closeout (Notion)

Status: **accepted**

### Summary

E1 created the first external, engineering-recognizable proof case for Meaning Engine:

- compact traceability world added
- reproducible demo pack added
- explanatory case document added
- use-case demonstrates traceability, rival paths, gap detection, invariant→evidence tracing, and focused projection

### Completed

- project now has a public engineering-shaped proof-of-utility case
- demo pack exists in repo and is test-backed

### Important claim-discipline note

E1 is NOT proof of industrial completeness.

It is a compact, legible, reproducible proof case showing current engine strengths on a small world.

### Follow-up note (doc↔world literal alignment)

Quickly verify that narrative bridge-candidate examples in `TRACEABILITY_CASE.md` do not mention concepts absent from the actual world seed.

### Management note

After E1, next step should move to presentation-facing packaging (P1) rather than adding more worlds.

---

**Status: ✅ Done**

## Implementation report

- GitHub issue: [https://github.com/utemix-org/meaning-engine/issues/17](https://github.com/utemix-org/meaning-engine/issues/17)
- PR: [https://github.com/utemix-org/meaning-engine/pull/18](https://github.com/utemix-org/meaning-engine/pull/18)
- Branch: `readiness/e1-traceability-world-demo-pack`
- Commit: `87fe955`
- Tests: 930/930 passed (`npm test`), в т.ч. 25 новых для traceability world

## Что изменено (RU)

### Файлы

- `worlds/traceability-world/seed.nodes.json` (новый) — 21 узел (4 spec, 6 concept, 2 invariant, 5 code_artifact, 4 evidence)
- `worlds/traceability-world/seed.edges.json` (новый) — 22 ребра (defines, constrains, proved_by, implements, depends_on)
- `worlds/traceability-world/loader.js` (новый) — loader по конвенции authored-mini-world
- `worlds/traceability-world/demo.js` (новый) — demo-скрипт с 5 сценариями
- `worlds/traceability-world/__tests__/traceabilityWorld.test.js` (новый) — 25 автотестов
- `worlds/traceability-world/TRACEABILITY_CASE.md` (новый) — пояснительная документация

### Traceability world

Моделирует модуль аутентификации (auth-login, session-expiry, account-lockout, password-reset) с полной цепочкой spec → concept → invariant → evidence и code_artifact → spec (implements).

Ключевые конструктивные решения:

- **Намеренный gap**: spec:password-reset имеет концепт и код, но нет evidence — полностью изолированный подграф
- **Два ривальных пути**: spec:auth-login → evidence:login-tests через concept (concept-heavy) и через code (code-heavy)
- **Bridge-концепты**: concept:test-coverage и concept:code-spec-alignment для работы bridge candidate detection

### Сценарии (demo pack)

| Сценарий | Операция | Результат |
| --- | --- | --- |
| S1: Spec→Evidence | trace | 2-hop путь через concept |
| S2: Rival paths | compare | 2 rival пути (concept-heavy vs code-heavy) |
| S3: Gap detection | trace + bridge | NO PATH + 3 bridge candidates |
| S4: Invariant→Evidence | trace | 1-hop proved_by |
| S5: Projection | projectGraph | 4 узла, 3 соседа, drillDown=true |

### Фиксы

Никаких implementation-фиксов не потребовалось. Все операторы (trace, compare, supports*, projectGraph) работают на новом мире без изменений.

## Use-case value (RU)

### Что этот кейс демонстрирует

- **Экстернальную полезность**: движок решает реальную инженерную задачу (spec→test traceability), которая понятна любой инженерной команде
- **Структурный анализ**: rival path detection показывает глубину анализа больше простого «yes/no»
- **Честный gap**: намеренный пробел показывает, что движок находит не только связи, но и их отсутствие

### Сильные стороны движка, которые видны

- Directed trace через семантические слои
- Undirected compare с кластеризацией путей
- Bridge candidate suggestion для gaps
- Focused projection с навигацией
- Всё работает на новом мире без изменений движка

### Ограничения, которые остаются видимыми

- Мир мал (21 узел) — не доказывает масштабируемость
- Нет интеграции с внешними инструментами (CI, Jira, etc.)
- Нет real-time обновлений графа
- Нет автоматического исправления gaps

## Open questions / risks

- Мир может казаться слишком toy-like для презентации серьёзным инженерам — но честность масштаба лучше, чем fake realism
- Следующий use-case должен быть больше и использовать реальные данные из проекта (e.g., self-traceability — Meaning Engine трейсит сам себя)
- Bridge candidate scoring основан на type-pair mapping, не на graph structure — можно улучшить