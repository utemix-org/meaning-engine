# OPUS_TASK__DOC_WORLD_LOAD__LOADER_AND_SMOKE_TESTS

---

title: OPUS_TASK__DOC_WORLD_LOAD__LOADER_AND_SMOKE_TESTS

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: keeper

---

<aside>
🎯

**Goal:** подключить **Documentation World seed** к runtime в репозитории через минимальный loader и сделать smoke‑проверки, что world загружается, проецируется и навигация работает.

</aside>

### Inputs (прочитать)

- Repo: `world/documentation-world/seed.nodes.json`, `seed.edges.json`, `README.md` (уже созданы)
- Канон: [SYSTEM_OVERVIEW](../02%20Overview/SYSTEM_OVERVIEW.md)
- Specs: [PROJECTION_SPEC](../04%20Specs/PROJECTION_SPEC.md), [NAVIGATION_SPEC](../04%20Specs/NAVIGATION_SPEC.md)

---

## A) Constraints

- **Do:** добавить loader + минимальные тесты/скрипт проверки.
- **Do not:** менять engine алгоритмы проекции/навигации/knowledge log.
- **Do not:** связывать documentation world с authored world в `universe.json` (никаких мостов).

---

## B) Implementation

### B1. Loader

Сделать функцию, которая:

1) читает `seed.nodes.json` и `seed.edges.json`

2) собирает из них GraphModel в формате, который понимает engine (`nodes[]`, `edges[]`, `schema?`)

3) возвращает `{ graph, meta }`

Рекомендация по месту:

- `world/documentation-world/loader.ts` (или `.js`)

### B2. Minimal schema / mapping

Так как seed — documentation graph (не knowledge log), достаточно минимального mapping:

- node: `{ id, type, label/title, properties }`
- edge: `{ id?, source, target, type, properties }`

Если engine требует `schema`, сделать самый простой `schema`:

- nodeTypes = уникальные `node.type`
- edgeTypes = уникальные `edge.type`
- constraints = empty

### B3. Smoke checks (tests)

Добавить 2–4 теста (или один test file) уровня “smoke”, например:

- `__tests__/documentationWorldLoad.test.ts`

Минимальные проверки:

1) Loader загружает world: counts совпадают (nodes=51, edges=108)

2) `projectGraph(graph, focus, schema, params)` возвращает ok для:

- focus = null
- focus = любой узел, например SYSTEM_OVERVIEW page node

3) `applyTransition` + reproject не падает на простом сценарии:

- select → drillDown → drillUp → reset

---

## C) Acceptance

- [x]  loader добавлен и работает локально
- [x]  smoke tests зелёные (7/7)
- [x]  Documentation world загружается без ручных правок seed файлов
- [x]  Engine pipeline не менялся

---

## D) Report (Opus)

### Snapshot

- Branch: `main` (ahead 13)
- Tests: **562 passed** (26 files), 0 failed — includes 7 new doc-world smoke tests
- Date: 2026-03-13

### Files changed

| File | Action |
| --- | --- |
| `world/documentation-world/loader.js` | **created** — loader function |
| `packages/render/src/__tests__/documentationWorldLoad.test.js` | **created** — 7 smoke tests |

### GraphModel format

Loader reads `seed.nodes.json` + `seed.edges.json`, maps:

- `node.title` → `node.label` (GraphModel convention)
- edges passed as `links[]` with auto-generated `id` where absent
- No schema object needed — `GraphModel` derives `nodeTypes`/`nodesByType` internally

Resulting graph: **51 nodes, 108 edges**, 6 node types, 9 edge types.

### Focus IDs used in smoke

| ID | Type | Result |
| --- | --- | --- |
| `null` | — | 51 nodes, 108 edges (full graph) |
| [SYSTEM_OVERVIEW](../02%20Overview/SYSTEM_OVERVIEW.md) | page (SYSTEM_OVERVIEW) | 9 nodes, 8 neighbors |
| `concept:focus` | concept | 11 nodes, 10 neighbors |
| `invariant:projection-determinism` | invariant | existence check |

### Navigation smoke

Full cycle: `select(SYSTEM_OVERVIEW)` → `drillDown(concept:projection)` → `drillUp()` → `reset()` — all transitions OK, projections valid at each step.

### Verdict

**Да, готово** для использования как отдельный world в dev-режиме.

- Loader корректно собирает GraphModel из двух seed-файлов без ручных правок.
- Engine pipeline (projection + navigation) работает штатно на documentation graph.
- Граф связный, навигация по concept/page/invariant узлам даёт осмысленные проекции.
- Engine не менялся — loader адаптирует данные к существующему контракту.

**Ограничение:** documentation world пока не подключён к dev UI (нет маршрута загрузки в render store). Это следующий шаг, если потребуется визуальная работа с documentation graph.