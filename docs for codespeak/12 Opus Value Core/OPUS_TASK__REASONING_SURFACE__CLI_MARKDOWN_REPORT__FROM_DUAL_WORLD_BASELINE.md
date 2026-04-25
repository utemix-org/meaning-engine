# OPUS_TASK__REASONING_SURFACE__CLI_MARKDOWN_REPORT__FROM_DUAL_WORLD_BASELINE

---

title: OPUS_TASK__REASONING_SURFACE__CLI_MARKDOWN_REPORT__FROM_DUAL_WORLD_BASELINE

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: keeper

---

## 1) Context (зачем сейчас)

Первый архитектурный цикл закрыт: есть два мира + dual-world runner + baseline artifact + strength rubric.

Следующий маленький шаг следующего цикла: сделать reasoning *видимым* как engineering surface.

Это **не UI** и не продукт. Это CLI/markdown report в духе `git log` / `kubectl describe`.

## 2) Scope

Разрешено:

- добавить CLI скрипт, который печатает/генерирует markdown отчёт
- использовать существующие runner'ы/fixtures: `runDualWorldSmokeWorkflow` + baseline + strength rubric
- добавить тесты на детерминизм отчёта

Запрещено:

- менять engine
- менять алгоритмы operators
- менять ontology/seed
- добавлять новые операторы
- добавлять scoring logic (используем уже зафиксированную human rubric как текст)

## 3) Deliverables

### D0. GitHub traceability (обязательно)

- PR или commit+push.
- В Opus Report: PR link + SHA + тесты.

Язык:

- Notion (task + report) — RU
- PR/commit messages — EN

### D1. CLI report generator

Добавить скрипт (имя можно предложить лучше):

- `operators/runReasoningReport.js`

Режимы:

1) `--world documentation-world` или `--world authored-mini-world`

2) `--scenario <name>` (path_exists | directed_boundary | rival_explanations | gap_and_bridge)

3) `--format md` (по умолчанию)

Вывод:

- заголовок мира и сценария
- Trace result (path или no_path + hops)
- если Compare: rivalCount + (краткое распределение по strength classes, если доступно)
- если GAP: candidateCount + список candidate ids
- Strength rubric interpretation (текстом, без scoring)
- явная строка: All results remain compute artifacts. No acceptance.

### D2. Baseline integration

- report должен уметь использовать `operators/dualWorldSmoke.baseline.json` как вход, чтобы печатать consistent summary.

### D3. Tests

Минимум 6 тестов:

- report deterministic (snapshot)
- report works for both worlds
- report works for all 4 scenarios
- report includes Exploration ≠ Acceptance disclaimer
- report does not mutate graph

## 4) Acceptance criteria

- `node operators/runReasoningReport.js ...` работает
- markdown отчёт читаем и стабилен
- tests green
- никаких изменений engine/operators algorithms/ontology

## 5) Architectural note

Surface = adapter. Kernel = source of truth.

Это engineering surface для reasoning, не продуктовый UI.

---

## 6) Opus Report (fill here)

### A) GitHub traceability

- PR: Direct push
- Branch: main
- Commit SHA: `e386529`
- Commit message (EN): `feat(operators): add CLI reasoning report generator with strength rubric (12 tests)`
- Tests: `npm ci && npm test` → green, 33 suites / 651 tests

### B) How to run

```bash
# Полный отчёт по обоим мирам (из baseline)
node operators/runReasoningReport.js --baseline

# Один мир
node operators/runReasoningReport.js --baseline --world documentation-world

# Один сценарий
node operators/runReasoningReport.js --baseline --world authored-mini-world --scenario rival_explanations

# Live run (без --baseline, вычисляет на лету)
node operators/runReasoningReport.js
```

Сценарии: `path_exists`, `directed_boundary`, `rival_explanations`, `gap_and_bridge`

### C) Example outputs

**doc-world / path_exists:**

```
### ✓ Path Exists
- Route: SYSTEM_OVERVIEW → concept:projection
- Result: PATH (1 hop)
> Strength: medium
> concept-mediated: single defines edge, direct conceptual definition
```

**authored-mini-world / rival_explanations:**

```
### ✓ Rival Explanations
- Route: Type Theory Overview → inferenceEngine.js
- Rival count: 2
- Clusters: 2
- Strength distribution: 0 invariant-passing, 1 concept-mediated, 1 code-dependency
> Strength: mixed (medium + weaker)
> 1/2 concept-mediated (medium), 1/2 code-dependency (weaker)
```

**Особенности отчёта:**

- Заголовок мира с количеством узлов/рёбер
- Trace result (path/no_path + hops)
- Для Compare: rivalCount + strength distribution (сколько invariant-passing, concept-mediated, code-dependency)
- Для GAP: candidateCount + список candidate IDs
- Strength rubric интерпретация (текстом, без scoring)
- Обязательный disclaimer: *All results remain compute artifacts. No acceptance.*

### D) Non-changes

- Engine unchanged: ✅
- Operators algorithms unchanged: ✅
- Ontology/seed unchanged: ✅

### E) Notes

- Отчёт работает в двух режимах: `--baseline` (из зафиксированного JSON) и live (вычисляет на лету). Baseline-режим гарантирует стабильность вывода.
- Экспортирует `generateReport()` для программного использования в тестах.
- Strength rubric встроена как текстовые константы, не как scoring алгоритм.
- Это engineering surface для reasoning, не продуктовый UI. В духе `git log` / `kubectl describe`.