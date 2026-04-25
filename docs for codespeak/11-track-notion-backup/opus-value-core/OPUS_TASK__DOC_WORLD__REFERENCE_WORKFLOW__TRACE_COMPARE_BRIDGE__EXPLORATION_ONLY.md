# OPUS_TASK__DOC_WORLD__REFERENCE_WORKFLOW__TRACE_COMPARE_BRIDGE__EXPLORATION_ONLY

---

title: OPUS_TASK__DOC_WORLD__REFERENCE_WORKFLOW__TRACE_COMPARE_BRIDGE__EXPLORATION_ONLY

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: architect-task-package

---

## 1) Context (зачем сейчас)

Мы на «плато стабильности»: repo structure (`src/ + operators/ + worlds/`) вычищена, doc-world tooling устойчив (ADR-013 redirects/normalization), support contracts для базовых операторов симметричны.

Следующий шаг — зафиксировать наблюдаемое end-to-end поведение operator stack на `documentation-world` как **reference workflow**.

Цель: показать, что система работает в **exploration режиме**, без смешения exploration/acceptance и без governance.

## 2) Scope (что можно трогать)

Разрешено:

- `operators/*` (CLI runners / examples / минимальные утилиты)
- `worlds/documentation-world/*` (только если нужно для сценариев или артефактов демо; seed по умолчанию НЕ менять)
- тесты, которые проверяют воспроизводимость сценариев

Запрещено:

- менять `src/core/*` и `src/engine/*`
- менять алгоритмы Compare/Trace/BridgeCandidates (только запуск/упаковка/демо)

## 3) Stop-list (что нельзя менять)

- Engine core (projection/navigation/knowledge pipeline)
- GraphModel и протоколы типов
- Governance модель (approve/reject/revise)
- Никакой канонизации результатов операторов

## 4) Deliverables (что вернуть)

### D0. GitHub traceability (для этого task — обязательно)

- Сделать PR или commit+push.
- В Notion-отчёте вернуть PR link + SHA + результаты тестов.

Язык:

- Notion (task + report) — русский
- PR title/description + commit messages — английский

### D1. Reference workflow (3 canonical scenarios)

Зафиксировать 3 сценария на `documentation-world` (как runnable, и как документируемый вывод):

1) **Trace → path discovery**

- показать случай, где directed path существует

2) **Trace → path termination in GAP**

- показать случай, где path не существует, и Trace корректно возвращает GAP

3) **Compare → rival explanatory paths**

- показать случай, где есть ≥2 rival shortest paths (или controlled ambiguity case)

4) **BridgeCandidates → GAP → candidate structural bridges**

- показать случай GAP и выдачу ≥1 кандидата моста

Примечание: допускается объединить (2) и (4) в одном сценарии, если это один и тот же from/to.

### D2. Expected output (Notion closeout)

В конце этого документа заполнить секцию `Opus Report` (шаблон ниже) и добавить один короткий блок "Reference workflow outputs" с перечислением:

- input nodes
- operator invocation
- structural result
- interpretation (exploration-only)

Важно: все сценарии остаются в exploration mode. Никакой результат не повышается до accepted knowledge.

### D3. Tests

- Минимум 4 теста, которые подтверждают:
    - сценарии воспроизводимы
    - supportsCompare/supportsBridgeCandidates корректно согласованы со сценариями (ok/false где ожидается)
    - deterministic outputs

## 5) Acceptance criteria

- Есть runnable reference workflow (через CLI runner или test harness)
- Есть 3–4 canonical scenarios (Trace path, Trace GAP, Compare rival explanations, BridgeCandidates кандидаты)
- Все тесты зелёные
- Engine unchanged
- Exploration ≠ Acceptance соблюдено (нет канонизации)
- В документе заполнен Opus Report (PR/SHA/tests/changes)

## 6) Architectural note (инвариант)

Exploration ≠ Acceptance.

Операторы производят compute artifacts (paths/GAP/rivals/candidates) и не продвигают их в accepted knowledge.

---

## 7) Opus Report

### A) GitHub traceability

- PR: Direct push
- Branch: `main`
- Commit SHA: `f16b7f0`
- Commit message (EN): `feat(operators): add reference workflow runner and reproducibility tests for 4 canonical exploration scenarios`
- Tests: `npm ci && npm test` → **green** — 26 suites, 576 tests

### B) Changes (что добавлено / изменено)

- `operators/runReferenceWorkflow.js`: CLI runner для 4 канонических сценариев (Trace path, Trace GAP, Compare rivals, BridgeCandidates). Запуск: `node operators/runReferenceWorkflow.js`
- `operators/referenceWorkflow.examples.json`: зафиксированный вывод 4 сценариев
- `operators/__tests__/referenceWorkflow.test.js`: 6 тестов воспроизводимости (S1–S4 + детерминизм + инвариант exploration≠acceptance)

Новые функции/экспорты: нет (используются существующие операторы)

### C) Non-changes

- Engine core: unchanged
- Operators algorithms: unchanged (только запуск/упаковка/демо)
- Seed graph: unchanged
- GraphModel / projection / navigation: unchanged

### D) Reference workflow outputs

**S1: Trace → path discovery**

- fromId: `SYSTEM_OVERVIEW` (page)
- toId: `concept:projection`
- output: ok=true, 1 hop. Путь: SYSTEM_OVERVIEW → Projection. Направленная связь существует (edge `defines`).

**S2: Trace → GAP + candidate bridges**

- fromId: `concept:context`
- toId: `SYSTEM_OVERVIEW` (page)
- output: ok=false, reason=no_path. Направленный путь не существует. 1 кандидат-мост: `concept:context-anchor` (concept↔page gap: add context-anchor as bridge).

**S3: Compare → rival explanatory paths**

- fromId: `PROJECTION_SPEC` (spec)
- toId: `evidence:grounding-phase-3a-tests`
- output: supportsCompare=true. 3 rival shortest paths (2 hops). Каждый проходит через свой concept-мост (test-coverage / acceptance-criteria / verification-method). diff: 2 shared nodes, 3 unique bridge nodes.

**S4: BridgeCandidates → structural bridge for isolated GAP**

- fromId: `evidence:grounding-phase-3a-tests`
- toId: `code:file:src/engine/WorldAdapter.js` (изолированный engine-файл, нет рёбер в основной компонент)
- output: supportsBridgeCandidates=true. 1 кандидат: `concept:code-spec-alignment` (heuristic: type-pair-mapping, score=1). Это настоящий undirected GAP — файл WorldAdapter.js не связан ни с одним узлом в seed.

### E) Observations

- **19 изолированных узлов**: в doc-world есть 19 code_artifact узлов engine-слоя (`src/engine/*`), которые не имеют рёбер в основной компонент. Это естественно: `specToCodeMap.json` не содержит mapping’ов для engine-adapter файлов. В будущем можно либо добавить implements-связи, либо убрать эти узлы из seed.
- **Directed vs undirected GAP**: `trace()` использует направленный BFS, `supportsBridgeCandidates()` — ненаправленный. Поэтому пара concept:context→SYSTEM_OVERVIEW — это GAP для trace (нет направленного пути), но НЕ GAP для bridgeCandidates (ненаправленный путь существует). Для S4 использован настоящий изолированный узел.
- **Exploration ≠ Acceptance**: ни один результат не содержит полей `canonicalized`, `accepted`, `status`. Это проверено тестом S6.

### F) Result Type + Architectural Status

- Result Type: **implementation done**
- Architectural Status:
    - Validated: 4 canonical exploration scenarios воспроизводимы и детерминированы; инвариант exploration≠acceptance соблюдён; симметрия supports()→compute() подтверждена
    - Not validated: governance модель (не в scope)
    - Contamination/notes: нет