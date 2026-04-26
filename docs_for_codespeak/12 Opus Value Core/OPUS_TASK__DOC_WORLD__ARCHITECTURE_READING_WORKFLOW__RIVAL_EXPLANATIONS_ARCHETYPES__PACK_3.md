# OPUS_TASK__DOC_WORLD__ARCHITECTURE_READING_WORKFLOW__RIVAL_EXPLANATIONS_ARCHETYPES__PACK_3

---

title: OPUS_TASK__DOC_WORLD__ARCHITECTURE_READING_WORKFLOW__RIVAL_EXPLANATIONS_ARCHETYPES__PACK_3

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: chatgpt-guided-next-step

---

## 1) Context (зачем сейчас)

После:

- reference exploration workflow (Trace/Compare/BridgeCandidates)
- architecture reading packs (#1, #2) + язык boundary patterns
- governance naming of residual canonical gap (`src/validate.js`)

следующий логичный шаг в use case `documentation reasoning` — не чинить граф и не менять operators, а **характеризовать повторяющиеся типы rival explanations**, которые Compare показывает при чтении архитектуры.

Фокус Pack #3:

- не доказать, что rivalry существует
- а описать, какие типы rivalry повторяются в architecture reading

## 2) Тип задачи

Предпочтительно: observation-only.

Допускается: observation + минимальные fixtures/examples (если нужно для воспроизводимости), но без изменения алгоритмов Compare.

## 3) Scope

Разрешено:

- запуск Compare на 2–3 парах узлов (architecture questions)
- (опционально) добавить 1–2 example fixtures, если без них результаты трудно повторять
- Notion closeout в этом документе

Запрещено:

- менять Compare алгоритм/кластеризацию/labels
- добавлять новые operator categories
- менять seed/онтологию
- governance решения

## 4) Deliverables

### D0. GitHub traceability

Если в репо **нет изменений**, GitHub не требуется.

Если добавляются fixtures/examples/tests — тогда PR или commit+push обязателен.

Язык:

- Notion — русский
- commit/PR — английский

### D1. 2–3 rival pairs + archetype labels

Выбрать 2–3 вопроса/пары, где Compare даёт конкурирующие объяснения (rival paths) и описать их как archetypes.

Рекомендованные archetype candidates (использовать только если реально наблюдаются):

- A: direct implementation route vs concept-mediated route
- B: core route vs adapter route
- C: constraint-preserving route vs workaround route

### D2. Output format (коротко)

В конце документа заполнить таблицу (можно списком):

- Pair / Question
- Observed rival paths (counts + 1 строка summary)
- Archetype label
- Why this archetype matters (1–2 строки)

И 2–4 вывода:

- what kinds of rival explanations recur
- what they say about architecture reading
- what does NOT yet justify formalization

Обязательная строка:

These archetypes are stable observations, not yet formal operator categories.

## 5) Acceptance criteria

- 2–3 пары обработаны Compare
- выделены 2–3 archetype labels (только наблюдаемые)
- зафиксирован короткий вывод + оговорка «не формализовано»
- exploration ≠ acceptance соблюдено

## 6) Architectural note

Exploration ≠ Acceptance.

Pack #3 — reading/observation, не развитие operator layer.

---

## 7) Opus Report (fill here)

### A) Task type

- observation + fixtures (runner + 12 тестов)

### B) GitHub traceability

- PR: Direct push
- Branch: main
- Commit SHA: `9a9690e`
- Commit message (EN): `feat(operators): add rival explanation archetypes observation (pack 3, 12 tests)`
- Tests: `npm ci && npm test` → green, 30 suites / 612 tests

### C) Rival explanation archetypes (RU)

**1) Archetype A: concept-mediated vs code-dependency route**

- fromId: [PROJECTION_SPEC](../04%20Specs/PROJECTION_SPEC.md) (PROJECTION_SPEC)
- toId: `code:file:src/core/knowledge/evaluate.js`
- Compare: **13 rival paths**, 3 hops, 3 clusters
- Наблюдение: 3 пути идут через concept/spec узлы (архитектурная линия: spec→concept→spec→code), 10 путей через зависимости кода (spec→code→test→code). Один и тот же вопрос «как проекция связана с вычислением знаний?» отвечается двумя механизмами: концептуальным наследием и импорт-графом.
- Why it matters: Показывает, что Compare различает «архитектурное объяснение» (через концепции) от «структурного объяснения» (через import-зависимости). Это ключевой паттерн для architecture reading.

**2) Archetype B: core barrel vs peripheral adapter route**

- fromId: `code:file:src/engine/WorldAdapter.js`
- toId: `code:file:src/core/GraphModel.js`
- Compare: **2 rival paths**, 4 hops, 1 cluster
- Наблюдение: оба пути — чисто кодовые (все узлы = code_artifact). Различаются только промежуточным модулем: один идёт через barrel-файл `index.js`, другой — через `highlightModel.js`. Нет концептуальной разницы, только различие во внутренней модульной проводке.
- Why it matters: Этот архетип выявляет «шум» в модульном слое — множественные re-export пути, которые не несут архитектурного смысла. Полезен для обнаружения barrel-файлов с избыточной связностью.

**3) Archetype C: constraint-preserving vs constraint-free route**

- fromId: [PROJECTION_SPEC](../04%20Specs/PROJECTION_SPEC.md) (PROJECTION_SPEC)
- toId: `code:file:src/core/knowledge/evaluate.js`
- Compare: среди 13 путей **ровно 1** проходит через invariant-узел (Canonical-Only Graph Build), остальные 12 — без формальных ограничений
- Наблюдение: путь через invariant формально сильнее — он проходит через доказанный engine law. Остальные пути валидны, но не подкреплены формальным ограничением. Этот же паттерн виден и в паре NAVIGATION_SPEC → evaluate.js (3 пути, все без invariant).
- Why it matters: Позволяет отличать «формально обоснованный» путь от «случайно существующего». В будущем это может стать основой для ранжирования rival explanations по силе.

### D) Summary conclusions (RU)

1. **Повторяются три типа rivalry**: concept-mediated vs code-dependency (A), barrel vs adapter (B), constraint-preserving vs constraint-free (C). Все три наблюдаются стабильно и детерминированно.
2. **Архетип A — самый информативный** для architecture reading: он разделяет «почему связано» (концепция) от «как связано» (import graph). Это главный инструмент для чтения архитектуры через граф.
3. **Архетип B — индикатор модульного шума**: когда все rival paths чисто кодовые и отличаются только barrel-файлом, это сигнал о структурной, а не архитектурной амбигуити.
4. **Архетип C — самый редкий, но самый ценный**: наличие invariant-node в пути делает его «формально сильным». Это единственный архетип, который указывает на фундированность объяснения.

These archetypes are stable observations, not yet formal operator categories.

### E) Non-goals check (RU)

- Compare algorithm unchanged: ✅ да
- Seed/ontology unchanged: ✅ да
- Governance unchanged: ✅ да

### F) Result Type + Architectural Status (RU)

- Result Type: observation + fixtures
- Architectural Status:
 - Validated: три архетипа rival explanations (A, B, C) стабильно воспроизводятся, покрыты 12 тестами
 - Not validated: пригодность архетипов для автоматического ранжирования путей (потенциал, но не реализовано)
 - Contamination/notes: никаких изменений в Compare, seed, онтологии или governance. exploration ≠ acceptance соблюдено.