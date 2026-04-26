# OPUS_TASK__DOC_WORLD__ARCHITECTURE_READING_WORKFLOW__LAYER_PATHS_AND_EXPLANATIONS

---

title: OPUS_TASK__DOC_WORLD__ARCHITECTURE_READING_WORKFLOW__LAYER_PATHS_AND_EXPLANATIONS

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: chatgpt-guided-next-step

---

## 1) Context (зачем сейчас)

После последних трёх задач doc-world стал существенно честнее:

- устранены ложные изоляции (extractor blind spot fixed)
- engine-layer минимально трассируем
- reference exploration workflow уже воспроизводим

Следующий шаг: перейти от `graph repair` к `architecture reading`.

То есть использовать текущий doc-world как инструмент чтения архитектуры через operator stack — без новых типов, без новых операторов, без governance.

## 2) Scope (что можно трогать)

Разрешено:

- `operators/*` (runner/скрипт/fixtures для сценариев чтения)
- `worlds/documentation-world/analysis/*` (если нужно перегенерировать артефакты анализа)
- тесты, которые фиксируют воспроизводимость выводов

Запрещено:

- менять `src/core/*` и `src/engine/*`
- менять seed/онтологию (nodes/edges/types)
- добавлять новые node/edge types

## 3) Stop-list (что нельзя делать)

- UI / surfaces
- governance (approve/reject/revise)
- любые изменения, которые "улучшают" граф вручную

## 4) Deliverables (что вернуть)

### D0. GitHub traceability (обязательно)

- PR или commit+push.
- В Opus Report: PR link + SHA + тесты.

Язык:

- Notion (task + report) — русский
- PR/commit messages — английский

### D1. Architecture reading scenarios (2–3 вопроса)

Выбрать 2–3 канонических архитектурных вопроса и ответить на них через текущий operator stack.

Требование к каждому вопросу:

- формулировка вопроса (RU)
- входные узлы (fromId/toId)
- какой оператор(ы) используются (Trace/Compare/BridgeCandidates)
- observed structure (path/GAP/rivals/candidates)
- interpretation (exploration-only)

Рекомендуемые вопросы (можно взять 2–3 из списка):

1) "Как PROJECTION_SPEC доходит до core implementation?" (spec → core code artifact)

2) "Где проходит граница world-facing layer ↔ core?" (WORLD_AS_INTERFACE → core implementation / adapters)

3) "Есть ли rival explanatory paths для одного architectural claim?" (выбрать пару, где Compare даёт rivals; если rivals нет — зафиксировать как наблюдение)

### D2. Output format (closeout)

В секции `Opus Report` ниже добавить компактный блок:

- `Question | Operator path/result | Interpretation | Status`

И отдельной строкой:

All results remain compute artifacts. No result is promoted to accepted knowledge.

### D3. Tests

- Минимум 3 теста:
    - сценарии воспроизводимы/детерминированы
    - outputs совпадают со снапшотом/fixtures
    - Exploration ≠ Acceptance (нет канонизации)

## 5) Acceptance criteria

- Есть runnable runner/скрипт для architecture reading scenarios
- 2–3 сценария зафиксированы и воспроизводимы
- тесты зелёные
- engine/seed/ontology unchanged

## 6) Architectural note (инвариант)

Exploration ≠ Acceptance.

Цель — читать архитектуру из графа, а не менять её.

---

## 7) Opus Report (fill here)

### A) GitHub traceability

- PR: Direct push
- Branch: `main`
- Commit SHA(s): `1808fd9`
- Commit message (EN): `feat(operators): add architecture reading workflow with 3 canonical scenarios and 6 tests`
- Tests: `npx vitest run` → **28 test files, 592 tests — all green**

### B) Scenarios (RU)

**1) Q1: Как PROJECTION_SPEC доходит до core implementation?**

- fromId: `code:file:src/core/projection/projectGraph.js`
- toId: `PROJECTION_SPEC` (435b2b96...)
- operator(s): **Trace**
- observed structure: **Путь 1 hop** — projectGraph.js → PROJECTION_SPEC (ребро `implements`)
- interpretation: Спецификация полностью трассируема из её первичной реализации. Прямая связь spec→code через 1 ребро.

**2) Q2: Где проходит граница world-facing ↔ core?**

- fromId: `code:file:src/engine/WorldAdapter.js`
- toId: `code:file:src/core/GraphModel.js`
- operator(s): **Trace** + **Compare**
- observed structure:
    - Trace: **no_path** — нет направленного пути от engine adapter к core model
    - Compare: **2 rival paths** через 4 hops (разветвление через index.js vs highlightModel.js)
- interpretation: Engine adapter не имеет прямой зависимости от core model — чистая архитектурная граница. Связь идёт через barrel/re-export модули. Compare подтверждает: два альтернативных пути опосредованы разными посредниками.

**3) Q3: Есть ли rival explanatory paths между слоями?**

- fromId: `PROJECTION_SPEC` (435b2b96...)
- toId: `code:file:src/core/knowledge/evaluate.js`
- operator(s): **Compare**
- observed structure: **13 rival paths**, 3 hops. Разнообразие:
    - concept-mediated пути (через GraphModel, L0_ONE_SCREEN_CORE)
    - code-dependency пути (через test-файлы)
    - invariant-passing путь (через Canonical-Only Graph Build)
- interpretation: 13 конкурирующих путей соединяют projection spec с knowledge code. Это ожидаемое cross-layer coupling: спецификация проекции полагается на knowledge substrate через множество маршрутов. Один путь проходит через инвариант — формально сильнее остальных.

*All results remain compute artifacts. No result is promoted to accepted knowledge.*

### C) Non-changes (RU)

- Engine (`src/core/*`, `src/engine/*`): **unchanged**
- Seed/ontology (nodes, edges, types): **unchanged**
- Operators algorithms (`trace.js`, `compare.js`, `supports.js`): **unchanged**

### D) Observations (RU)

- Это первый workflow, где operators используются не для self-validation, а для чтения архитектуры из графа.
- В частности: directed `no_path` теперь интерпретируется как осмысленная layer boundary, а Compare выявляет альтернативные explanatory маршруты вокруг этой границы.
- Это фиксирует переход: `graph repair → architecture reading`.
- Q2 показывает, что Trace+Compare в паре эффективны для обнаружения архитектурных границ: Trace находит направленный GAP, Compare показывает через что идёт обходной путь.
- Q3 показывает, что 13 rival paths — это не дефект, а признак cross-layer coupling. Compare позволяет классифицировать пути (code-heavy, concept-heavy, invariant-passing).
- Система уже способна отвечать на архитектурные вопросы как compute, не требуя ручной аннотации.

### E) Result Type + Architectural Status (RU)

- Result Type: **implementation done**
- Architectural Status:
    - Validated: 3 сценария чтения архитектуры воспроизводимы и детерминированы; exploration ≠ acceptance инвариант соблюдён
    - Not validated: масштабируемость подхода на графы большего размера; автоматическая генерация вопросов
    - Contamination/notes: нет контаминации; seed/engine/ontology не тронуты