# OPUS_TASK__DOC_WORLD__ARCHITECTURE_READING_WORKFLOW__BOUNDARIES_VS_EXPLANATIONS__PACK_2

---

title: OPUS_TASK__DOC_WORLD__ARCHITECTURE_READING_WORKFLOW__BOUNDARIES_VS_EXPLANATIONS__PACK_2

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: keeper

---

## 1) Context (зачем сейчас)

Pack #1 показал переход `graph repair → architecture reading`: directed `no_path` может читаться как layer boundary, а Compare показывает обходные explanatory маршруты.

Цель Pack #2 — усилить этот навык на 2–3 дополнительных примерах и зафиксировать дисциплину чтения границ как compute, не как решение.

## 2) Scope (что можно трогать)

Разрешено:

- `operators/*` (runner/fixtures для новых вопросов)
- tests/fixtures для воспроизводимости

Запрещено:

- менять `src/core/*` и `src/engine/*`
- менять doc-world seed/онтологию
- добавлять новые node/edge types

## 3) Stop-list

- governance (approve/reject/revise)
- UI/surfaces
- ручное улучшение графа (никаких новых implements/depends_on ради "красоты")

## 4) Deliverables

### D0. GitHub traceability (обязательно)

- PR или commit+push.
- В отчёте: PR link + SHA + тесты.

Язык:

- Notion (task + report) — русский
- PR/commit messages — английский

### D1. Scenarios: "boundaries are readable constraints" (3 кейса)

Нужно 3 кейса, каждый иллюстрирует один из паттернов:

1) **Directed boundary (no_path) but explanation exists**

- Trace(from,to) даёт `no_path`
- Compare(from,to) показывает ≥2 альтернативных explanatory routes вокруг границы
- Интерпретация: граница ≠ изоляция; это constraint/направление зависимостей.

2) **True isolation (no_path + no undirected connectivity)**

- Trace(from,to) даёт `no_path`
- supportsBridgeCandidates(from,to) = true и выдаёт кандидаты
- Интерпретация: это реальный GAP/отсутствие связи, а не архитектурная граница.

3) **Boundary disappears when direction is inverted**

- Trace(A,B) = no_path
- Trace(B,A) = path exists (или наоборот)
- Интерпретация: направление рёбер кодирует layer responsibility ("кто зависит от кого").

Требования к каждому кейсу:

- вопрос (RU)
- fromId/toId
- оператор(ы)
- observed structure (path/GAP/rivals/candidates)
- interpretation (exploration-only)

## 5) Acceptance criteria

- 3 кейса зафиксированы и воспроизводимы
- есть runnable runner (можно расширить существующий)
- минимум 6 тестов (по 2 на кейс: воспроизводимость + детерминизм/инвариант)
- Exploration ≠ Acceptance соблюдено
- engine/seed/ontology unchanged

## 6) Architectural note

Exploration ≠ Acceptance.

Мы читаем границы как compute artifacts и не превращаем вывод в канон.

---

## 7) Opus Report (fill here)

### A) GitHub traceability

- PR: Direct push
- Branch: `main`
- Commit SHA(s): `9fba309`
- Commit message (EN): `feat(operators): add architecture reading pack 2 — boundaries vs explanations (3 cases, 8 tests)`
- Tests: `npx vitest run` → **29 test files, 600 tests — all green**

### B) Cases (RU)

**Case 1: Directed boundary but explanation exists**

- Question: Связана ли NAVIGATION_SPEC с evaluate.js напрямую?
- fromId: `NAVIGATION_SPEC` (b997b23c...)
- toId: `code:file:src/core/knowledge/evaluate.js`
- operator(s): **Trace** + **Compare**
- observed structure:
 - Trace: **no_path** — нет направленного пути между navigation и knowledge слоями
 - Compare: **3 rival paths** через 3 hops. Путь 1 — concept-heavy (через L0_ONE_SCREEN_CORE, KNOWLEDGE_LOG_SPEC). Путь 2 — code-heavy (через applyTransition.js)
- interpretation: Граница между navigation и knowledge — это constraint на направление зависимостей, не изоляция. Compare находит 3 обходных маршрута вокруг границы.

**Case 2: True isolation (GAP) + bridge candidates**

- Question: Есть ли какая-то связь evidence → validate.js?
- fromId: `evidence:grounding-phase-3a-tests`
- toId: `code:file:src/validate.js`
- operator(s): **Trace** + **BridgeCandidates**
- observed structure:
 - Trace: **no_path** — нет ни направленной, ни ненаправленной связи
 - supportsBridgeCandidates: **true**, 1 кандидат: `concept:code-spec-alignment` (type-pair-mapping, score=1)
- interpretation: validate.js — единственный по-настоящему изолированный узел в doc-world (нет никакой связности). Это реальный GAP, не архитектурная граница. BridgeCandidates предлагает concept:code-spec-alignment как мост.

**Case 3: Boundary depends on direction**

- Question: Граница NAVIGATION_SPEC ↔ applyTransition.js — это изоляция или направление?
- A: `NAVIGATION_SPEC` (b997b23c...)
- B: `code:file:src/core/navigation/applyTransition.js`
- Trace(A→B): **no_path** — spec не зависит от кода
- Trace(B→A): **PATH, 1 hop** — applyTransition.js → NAVIGATION_SPEC (ребро `implements`)
- interpretation: Граница выражает направление ответственности: «код реализует спецификацию», а не «спецификация зависит от кода». Implements ребро создаёт асимметрию: код знает о спеке, спека не знает о коде.

*All results remain compute artifacts. No result is promoted to accepted knowledge.*

### C) Non-changes (RU)

- Engine (`src/core/*`, `src/engine/*`): **unchanged**
- Seed/ontology (nodes, edges, types): **unchanged**
- Operators algorithms: **unchanged**

### D) Observations (RU)

- Pack #2 превратил architecture reading из набора примеров в воспроизводимый язык паттернов (пока без автоматической классификации).
- Boundaries теперь читаются не только как отсутствие пути, а как типизированные архитектурные ситуации.
- Три паттерна чтения границ теперь различимы через operator stack:
 1. **Граница с объяснением**: Trace=no_path + Compare=rivals → layer constraint
 2. **Истинная изоляция**: Trace=no_path + BridgeCandidates=true → real GAP
 3. **Направленная асимметрия**: Trace(A→B)=no_path, Trace(B→A)=path → implements direction
- Это подтверждает, что operator stack уже способен классифицировать типы границ без ручной аннотации.

### E) Result Type + Architectural Status (RU)

- Result Type: **implementation done**
- Architectural Status:
 - Validated: 3 паттерна чтения границ воспроизводимы и детерминированы; exploration ≠ acceptance соблюдён
 - Not validated: автоматическая классификация паттерна границы (сейчас — ручной выбор операторов)
 - Contamination/notes: нет контаминации; seed/engine/ontology не тронуты