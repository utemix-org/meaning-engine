# OPUS_TASK__ME_READINESS__D1__BENCHMARK_HARNESS_AND_OPERATIONAL_LIMITS_NOTE

---

title: OPUS_TASK__ME_READINESS__D1__BENCHMARK_HARNESS_AND_OPERATIONAL_LIMITS_NOTE

kind: engineering-task

project: Meaning Engine

owner: Opus

status: accepted

track: ME_READINESS

block: D (Operational envelope)

languages:

repo: en

notion: ru

---

## Context

Block A (identity lock) is accepted.

Block C (trust surface cleanup) is accepted.

Block B (stable core evidence lock) is effectively complete for the current stable core:

- invariant matrix exists
- proof obligations exist
- StructuralInvariants / ChangeProtocol have direct tests
- projection metadata / GraphSnapshot / KE5 edge case have direct tests
- highlight model stable-surface evidence is in place

The next readiness step is to make the operational envelope legible:

- what is fast / acceptable / risky
- where operator complexity may grow sharply
- what practical limits should be stated honestly in an engineering presentation

This task should produce the first benchmark/limits artifact for Meaning Engine.

References:

- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAF%205a71404eb00941458c78832a43fc5446.md)
- Accepted tasks: [OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA](OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_%20528a1e43590546dabaf0dcef6c1ed9b9.md), [COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP](COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTI%20633bcba49a7642b9802c990cdf66c689.md), [COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP](COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AU%20d478a89ce4fc43178b42f0c14bc7983d.md), [OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS](OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_%20b7cff57410cf48ce85d82efd4483be70.md), [OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS](OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS%20980826696a86409f9cd00e6af074c2f6.md), [OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE](OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_A%20e56f91b182d94e2e8baadbd43db43358.md), [OPUS_TASK__ME_READINESS__B4__HIGHLIGHT_MODEL_EVIDENCE_AND_BLOCK_B_CONSOLIDATION](OPUS_TASK__ME_READINESS__B4__HIGHLIGHT_MODEL_EVIDE%2022cefc3a2ea04c268bce2c6b32b6a9e6.md)
- Evidence docs: `docs/INVARIANT_MATRIX.md`, `docs/PROOF_OBLIGATIONS.md`

## Goal

Produce a first operational-envelope package for Meaning Engine:

1) a narrow benchmark harness,

2) an operational limits note,

3) grounded wording about expected runtime behavior and risk areas,

without changing public promise or overclaiming scalability.

## Opus — operating mode

You are Opus. This is an operational-evidence task.

Your job is to:

- characterize the current runtime envelope honestly
- distinguish between measured behavior and inferred complexity
- avoid marketing language around scale/performance
- prefer small reproducible benchmark scripts over elaborate benchmarking frameworks
- record sharp edges explicitly (e.g. path explosion, graph density effects, compare complexity)

## Scope

### Must do

1) Add a small benchmark harness

Create a lightweight, reproducible benchmark script or scripts for the most important stable-core operations.

Minimum candidates:

- projection (`projectGraph`)
- navigation/applyTransition sequence
- `trace`
- `compare`
- optionally `supports` if it is cheap to include

Benchmark harness should:

- run locally without exotic dependencies
- use explicit synthetic or fixture-based graphs
- test a few graph sizes / densities rather than trying to be exhaustive
- emit human-readable output
- note that numbers are indicative and environment-sensitive, not strict cross-machine performance guarantees

2) Produce `docs/OPERATIONAL_LIMITS.md`

This document should explain, in engineering terms:

- what was measured
- what was not measured
- which operations appear cheap/stable
- which operations are sensitive to graph size/density/path multiplicity
- what practical limits or caution notes should currently be stated

It must clearly distinguish between:

- measured benchmark observations
- code-level/inferred complexity expectations
- unresolved performance unknowns

3) Record the main sharp edges honestly

At minimum discuss:

- path explosion risk in `compare`
- graph density effects
- fixture/synthetic benchmark limitations
- laptop-scale vs unknown larger-scale behavior

4) Link the new operational note cleanly

Add one short pointer from an appropriate public-facing doc if this can be done without clutter.

### Should do (only if small and clearly in-scope)

- Include one benchmark case using a reference world and one using synthetic graphs.
- Include a short “how to rerun” section in the note.

### Must NOT do

- Do not build a complex benchmarking framework.
- Do not optimize code in this task unless a trivial fix is required for the harness to run.
- Do not claim production-scale readiness from small benchmarks.
- Do not expand public promise.
- Do not broaden into industrial use-case packaging yet.

## Acceptance criteria

- A reproducible benchmark harness exists.
- `docs/OPERATIONAL_LIMITS.md` exists and clearly separates measured vs inferred vs unknown.
- The note records the main runtime sharp edges honestly.
- Any public-facing link added is narrow and non-cluttering.
- All tests pass (`npm test`).
- No unrelated runtime/API behavior changes.

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
    - What was measured
    - What remains unknown

## Deliverables (report back here, RU)

### Implementation report

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- Tests run + result

### What changed (RU)

- List files changed
- Summarize the benchmark harness
- Summarize the operational note
- Note whether any implementation fixes were needed

### Operational findings (RU)

- Which operations appear cheap/stable
- Which operations show risk or growth sensitivity
- Which conclusions are measured vs inferred
- What remains unknown
- Include one compact summary table of measured cases and observations

### Open questions / risks

- Any benchmark design weakness
- Any operational envelope area still too unclear
- What should be measured next before external engineering presentation

## Notes

- This task is about operational clarity, not performance theater.
- Honest limits are more valuable than attractive numbers.
- Small reproducible measurements are better than ambitious but noisy benchmark machinery.

---

## Closeout (Notion)

Status: **accepted**

### Summary

D1 opened Block D and made the project’s operational envelope observable:

- reproducible benchmark harness added
- operational limits note created
- measured vs inferred vs unknown claims fixed explicitly
- main runtime sharp edge (`compare` path explosion) now described from data

### Completed

- benchmark harness exists and is rerunnable
- stable-core runtime behavior now has a first measured envelope
- `compare` complexity risk is explicitly documented
- project is better prepared for engineering questions about practical runtime limits

### Important claim-discipline note

D1 is NOT a performance proof and does not provide production-scale guarantees.

It provides a first honest operational baseline on single-machine measurements and code-informed analysis.

### Management note

After D1, the next step should move to Block E (first external proof via real use-case), not deeper benchmarks yet.

---

**Status: ✅ Done**

## Implementation report

- GitHub issue: [https://github.com/utemix-org/meaning-engine/issues/15](https://github.com/utemix-org/meaning-engine/issues/15)
- PR: [https://github.com/utemix-org/meaning-engine/pull/16](https://github.com/utemix-org/meaning-engine/pull/16)
- Branch: `readiness/d1-benchmark-harness-operational-limits`
- Commit: `8a112ed`
- Tests: 905/905 passed (`npm test`)

## Что изменено (RU)

### Файлы

- `benchmarks/bench.js` (новый) — лёгкий бенчмарк-харнесс, 43 кейса
- `docs/OPERATIONAL_LIMITS.md` (новый) — operational limits note
- `README.md` (изменён) — добавлен указатель на OPERATIONAL_[LIMITS.md](http://LIMITS.md)

### Бенчмарк-харнесс

Скрипт (`node --experimental-vm-modules benchmarks/bench.js`) запускается за ~5 секунд без внешних зависимостей. Тестирует 6 категорий операций:

- GraphModel construction (chain 100–5000)
- projectGraph с фокусом и без (chain, tree, grid, reference worlds)
- applyTransition (20-step sequence на reference worlds)
- trace (chain, grid, doc-world)
- compare / findRivalTraces (chain, grid 5×5–8×8, doc-world)
- supportsInspect / supportsTrace

Используются синтетические графы (chain, tree, grid) и два reference world (test-world 10N/16E, documentation-world 116N/292E).

### Operational limits note

Чётко разделяет measured / inferred / unknown. Включает:

- таблицы замеров по каждой операции
- анализ path explosion в compare
- sharp edges (maxHops=6, raw graph format, бенчмарк-ограничения)
- practical limits для инженерных презентаций
- инструкцию «как перезапустить»
- список того, что измерять следующим

### Фиксы

Никаких implementation-фиксов не потребовалось. Операторы `trace`/`compare`/`supports*` ожидают `{ nodes, edges }` (raw format), а не `GraphModel` — это задокументировано как sharp edge.

## Операционные находки (RU)

### Дешёвые/стабильные операции

| Операция | Масштабирование | Время (doc-world 116N/292E) |
| --- | --- | --- |
| projectGraph | O(n+m), линейное | ~200 µs |
| applyTransition | O(1) | ~30 µs (20 шагов) |
| trace | O(V+E), одна BFS | ~210 µs |
| supportsInspect | O(n+m) | < 5 µs |
| supportsTrace | O(n+m) | ~15 µs |
| GraphModel constructor | O(n+m) | ~180 µs |

### Операции с риском

| Операция | Риск | Наблюдение |
| --- | --- | --- |
| compare (findRivalTraces) | **Path explosion** на плотных графах | grid-5×5: 70 путей/6ms, grid-7×7: 924/97ms, grid-8×8: 3432/752ms |
| supportsCompare | Та же стоимость (вызывает findRivalTraces) | Не замерено отдельно |

### Measured vs inferred

| Утверждение | Базис |
| --- | --- |
| Проекция < 1 ms для графов < 500 узлов | Measured |
| Навигация < 50 µs | Measured |
| Trace < 1 ms для < 1000 узлов | Measured |
| Compare быстр на sparse графах | Measured (doc-world: 3 пути, 1.4 ms) |
| Compare даёт комбинаторный взрыв на grid-like топологиях | Measured (3432 пути на 8×8 = 752 ms) |
| Поведение на графах > 5000 узлов | **Unknown** |
| Memory usage | **Unknown** |

### Компактная таблица ключевых замеров

| Операция | chain-100 | chain-1000 | grid-10×10 | grid-50×50 | doc-world |
| --- | --- | --- | --- | --- | --- |
| projectGraph | 215 µs | 687 µs | 68 µs | 2.6 ms | 204 µs |
| trace | — | 733 µs | 76 µs | 1.5 ms | 213 µs |
| compare | — | — | N/A | N/A | 1.4 ms |

## Open questions / risks

- `compare` не имеет встроенного лимита на количество путей — на grid-like графах возможен таймаут
- Бенчмарки на синтетических графах не отражают реальную структуру семантических графов
- Reference worlds малы (10 и 116 узлов) — поведение на 1000+ узлов экстраполировано
- Нет cross-platform валидации
- Следующий приоритет: path count limit в compare, memory profiling, ChangeProtocol throughput