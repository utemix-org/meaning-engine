# OPUS_TASK__DOC_WORLD__ENGINE_LAYER_MIN_TRACEABILITY__SPEC_TO_CODE_MAP_MINIMAL

---

title: OPUS_TASK__DOC_WORLD__ENGINE_LAYER_MIN_TRACEABILITY__SPEC_TO_CODE_MAP_MINIMAL

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: chatgpt-guided-decision

---

## 1) Context (зачем сейчас)

В reference workflow обнаружено: в doc-world есть **изолированные code_artifact узлы** engine-слоя (`src/engine/*`). Это выглядит не как “out-of-scope”, а как **неполная spec→code трассируемость**.

Решение: выбираем вариант A (добавить минимальные, обоснованные implements links), чтобы doc-world оставался **честным reference reasoning world**, а не “витриной удобных частей”.

## 2) Scope (что можно трогать)

Разрешено:

- `worlds/documentation-world/tools/*` (если нужно для обновления seed/analysis)
- `worlds/documentation-world/specToCodeMap.json` (или текущий файл маппинга implements)
- seed/analysis doc-world (перегенерация после правок)
- тесты doc-world, если нужно закрепить отсутствие изоляций/регрессий

Цель (узкая): добавить **5–10** обоснованных `implements` связей для ключевых engine-adapter файлов, чтобы они стали минимально трассируемы из канона.

## 3) Stop-list (что нельзя менять)

Запрещено:

- менять `src/core/*` и `src/engine/*` (никаких правок кода движка)
- менять алгоритмы operators
- вводить новую онтологию/типы узлов/рёбер
- делать mass-linking ("свяжем всё со всем")

Принцип: только те связи, которые можно объяснить существующими спеками/дефинициями/семантикой имён.

## 4) Deliverables (что вернуть)

### D0. GitHub traceability (обязательно)

- PR или commit+push.
- В Notion-отчёте: PR link + SHA + результаты тестов.

Язык:

- Notion (task + report) — русский
- PR/commit messages — английский

### D1. Minimal implements mapping (5–10 links)

Добавить 5–10 links (примерный целевой набор файлов):

- `code:file:src/engine/WorldAdapter.js`
- `code:file:src/engine/WorldInterface.js`
- `code:file:src/engine/SpecificationReader.js`
- `code:file:src/engine/OperatorEngine.js`
- `code:file:src/engine/Schema.js`
- `code:file:src/engine/CatalogRegistry.js`
- `code:file:src/engine/CatalogLoader.js`

Источник (fromId) должен быть существующим Notion/spec/concept узлом (например spec про world/interface/adapters, или соответствующий architectural/definition page). Если подходящего узла нет — **не придумывать**; вместо этого оставить link не добавленным и записать в Observations как gap канона.

### D2. Regenerate doc-world artifacts

- Перегенерировать seed/analysis так, чтобы новые implements связи попали в doc-world.

### D3. Tests

- Прогнать `npm ci && npm test`.
- (Если нужно) добавить/обновить 1–2 smoke-теста: что число изолированных `src/engine/*` code_artifact узлов **снизилось materially** и что добавленные links не ломают инварианты graph validity.

## 5) Acceptance criteria

- Добавлено 5–10 обоснованных implements links для engine-layer code_artifacts.
- Число изолированных engine-layer code_artifact узлов заметно снизилось (зафиксировать число "до/после").
- Все добавленные links объяснимы из существующего канона (в отчёте — короткая причина на каждый link).
- Все тесты зелёные.
- Engine unchanged.

## 6) Architectural note (инвариант)

No invented ontology. No mass-linking.

Восстанавливаем минимальную видимость engine-layer в traceability, не расширяя модель мира.

---

## 7) Opus Report (fill here)

### A) GitHub traceability

- PR: Direct push
- Branch: `main`
- Commit SHA(s): `8bc0bc6`
- Commit message (EN): `feat(doc-world): add 9 implements links for engine-layer traceability`
- Tests: `npx vitest run` → **26 test files, 576 tests — all green**

### B) Before/After metrics (RU)

- isolated `src/engine/*` code_artifact nodes (source): before = **8**, after = **0**
- isolated `src/engine/__tests__/*` code_artifact nodes (test): before = **8**, after = **1** (WorldInterface.test.js — баг мультилайн-regex в экстракторе)
- isolated misc nodes (`src/index.js`, `src/validate.js`, `src/core/knowledge/index.js`): before = **3**, after = **3** (только validate.js и knowledge/index.js остались изолированными; src/index.js подключён через SYSTEM_OVERVIEW)
- всего изолированных: before = **19**, after = **3**
- рёбер в seed: before = **267**, after = **276** (+9 новых `implements`)

### C) Links added (RU)

9 новых `implements` рёбер:

1. `code:file:src/engine/WorldAdapter.js` → `WORLD_AS_INTERFACE`: адаптер реализует контракт "мир как интерфейс"
2. `code:file:src/engine/WorldInterface.js` → `WORLD_AS_INTERFACE`: определяет интерфейс Engine ↔ World
3. `code:file:src/engine/SpecificationReader.js` → `ENGINE_DEVELOPER_GUIDE`: читает/валидирует спецификации платформы
4. `code:file:src/engine/CatalogLoader.js` → `ENGINE_DEVELOPER_GUIDE`: загрузчик каталогов из файловой системы
5. `code:file:src/engine/OperatorEngine.js` → `KNOWLEDGE_LOG_SPEC`: оркестрирует эпистемические операторы (propose/verify/approve/reject)
6. `code:file:src/engine/CatalogRegistry.js` → `KNOWLEDGE_LOG_SPEC`: реестр каталогов для эпистемических операторов
7. `code:file:src/engine/Schema.js` → `concept:graph-model`: валидация структуры графа по модели
8. `code:file:src/engine/index.js` → `SYSTEM_OVERVIEW`: точка входа engine, реализует системный обзор
9. `code:file:src/index.js` → `SYSTEM_OVERVIEW`: верхнеуровневый публичный API

### D) Non-changes (RU)

- Engine code (`src/engine/*`, `src/core/*`): **unchanged**
- Operators algorithms (`operators/trace.js`, `compare.js`, `supports.js`): **unchanged**
- Node/edge type system: **unchanged** (использован существующий тип `implements`)
- Новых типов узлов/рёбер: **нет**

### E) Observations (RU)

- Все 9 связей обоснованы из существующего канона (заголовки файлов + семантика spec-страниц). Mass-linking не производился.
- `WorldInterface.test.js` остался изолированным из-за ограничения `extractCodeArtifacts.js`: regex парсит импорты построчно и не захватывает многострочные `import { … } from '…'`. Это pre-existing баг экстрактора, не в scope этой задачи.
- Reference workflow S4 обновлён: `ISOLATED_ENGINE_FILE` заменён на `src/validate.js`, т.к. `WorldAdapter.js` теперь в main component.
- `src/validate.js` и `src/core/knowledge/index.js` остались изолированными — у них нет обоснованных spec-связей в текущем каноне. Это **gap канона**, не инженерный дефект.

### F) Result Type + Architectural Status (RU)

### G) Observation (RU)

As spec→code traceability improved, doc-world began to reveal architectural zones naturally. Operators now explore real structure, rather than artifacts of incomplete mapping.

- Result Type: **implementation done**
- Architectural Status:
 - Validated: engine-layer source files полностью трассируемы через implements → spec/concept/page
 - Not validated: мультилайн-import парсинг в экстракторе; трассируемость 3 оставшихся изолированных утилит
 - Contamination/notes: нет контаминации; все связи — чистый `implements` на существующих типах