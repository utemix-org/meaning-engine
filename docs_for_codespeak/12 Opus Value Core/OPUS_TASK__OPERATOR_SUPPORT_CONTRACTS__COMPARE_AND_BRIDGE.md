# OPUS_TASK__OPERATOR_SUPPORT_CONTRACTS__COMPARE_AND_BRIDGE

---

title: OPUS_TASK__OPERATOR_SUPPORT_CONTRACTS__COMPARE_AND_BRIDGE

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: chatgpt-task-package

---

## 1) Context (зачем сейчас)

После канонизации:

- WORLD_CAPABILITIES_AND_OPERATOR_SUPPORTS

operator-layer Meaning Engine требует симметричной модели support-контрактов.

Сейчас:

- `supportsInspect()`
- `supportsTrace()`

реализованы и используются.

Но:

- Compare
- BridgeCandidates

имеют gate-логику (rival paths / candidate bridges), но не имеют формализованного support-контракта.

Задача: ввести support contracts, не изменяя поведение существующих операторов.

## 2) Scope (что можно трогать)

Добавить support-контракты для:

- Compare
- BridgeCandidates

в operator-layer documentation-world.

Минимальные функции:

- `supportsCompare(graph, context?)`
- `supportsBridgeCandidates(graph, context?)`

Контракт:

- `{ ok: true }`
- или `{ ok: false, missing: [...] }`

### Compare support rule

Compare поддерживается если:

- `findRivalTraces() ≥ 2`
    
    или
    
- `rankBridgeCandidates() ≥ 2`

Иначе:

- `ok: false`
- `missing: ["ambiguity_not_detected"]`

### BridgeCandidates support rule

BridgeCandidates поддерживается если:

- GAP detected

и

- `≥ 1` candidate concept

## 3) Stop-list (что запрещено)

Запрещено:

- изменять engine core
- изменять GraphModel
- изменять projection
- изменять navigation

Запрещено:

- добавлять UI
- канонизировать результаты
- изменять Compare алгоритм

Это operator-layer task only.

## 4) Deliverables (что вернуть)

### D0. GitHub traceability (обязательно)

- Оформить изменения через PR или (минимум) осмысленный commit+push.
- В отчёте Opus вернуть:
    - PR link
    - merge commit SHA (или список commit SHA)
    - результат тестов (например `npm ci && npm test`).

Язык:

- рабочее общение и документация (Notion, отчёт Opus) — русский
- commit messages / PR titles / PR descriptions — английский

Реализация:

- либо новые файлы:
    - `operators/supportsCompare.js`
    - `operators/supportsBridgeCandidates.js`
- либо расширение существующего `operators/supports.js` (предпочтительно, чтобы контракт был собран в одном месте)

Тесты:

- либо новые тестовые файлы:
    - `operators/__tests__/supportsCompare.test.js`
    - `operators/__tests__/supportsBridgeCandidates.test.js`
- либо расширение существующих operator supports тестов

Минимум: 8 тестов.

Проверки:

- supportsCompare false on unique path
- supportsCompare true on synthetic rival graph
- supportsBridgeCandidates false if no GAP
- supportsBridgeCandidates true on GAP graph
- deterministic outputs

## 5) Acceptance criteria

- supportsCompare() реализован
- supportsBridgeCandidates() реализован
- tests green
- engine unchanged
- existing operators behaviour unchanged

## 6) Architectural note (инвариант)

Эта задача завершает symmetry of operator support layer.

После неё базовый reasoning stack имеет единую форму:

`supports() → compute()`

для:

- Inspect
- Trace
- Compare
- BridgeCandidates

---

## 7) Opus Report

### 1) GitHub traceability

- PR: Direct push
- Branch: `main`
- Commit SHA: `9fdca5b`
- Commit message (EN): `feat(operators): add supportsCompare and supportsBridgeCandidates support contracts`
- Tests: `npm ci && npm test` → **green** — 25 suites, 570 tests

### 2) Changes (что добавлено / изменено)

- `operators/supports.js`: добавлены `supportsCompare()` и `supportsBridgeCandidates()`, обновлён header-комментарий
- `operators/__tests__/documentationWorldOperatorSupports.test.js`: 11 новых тестов (##9–19), добавлены импорты `supportsCompare`, `supportsBridgeCandidates`

Новые функции/экспорты:

- `supportsCompare(graph, fromId, toId, context?)` → `{ ok, missing?, detail: { paths, hops } }`
- `supportsBridgeCandidates(graph, fromId, toId, context?)` → `{ ok, missing?, detail: { candidateCount } }`

Новые missing codes:

- `ambiguity_not_detected` — Compare: менее 2 rival paths
- `nodes: need >= 3...` — Compare: граф слишком мал
- `edges: need >= 2...` — Compare: недостаточно рёбер для альтернативных путей
- `unknown_node: <id>` — BridgeCandidates: узел не найден
- `no_gap: path exists between nodes` — BridgeCandidates: путь существует, gap нет
- `no_candidate_bridges` — BridgeCandidates: gap есть, но кандидатов нет

### 3) Non-changes

- Engine core: unchanged
- GraphModel: unchanged
- Projection/navigation: unchanged
- Compare algorithm: unchanged
- UI: none

### 4) Observations

- Реализация в едином `supports.js` (а не в отдельных файлах) — по предпочтению из задачи.
- `supportsCompare` вызывает `findRivalTraces` внутри — это compute на этапе gate-проверки. На текущем графе (116/267) это мгновенно, но на больших графах может потребоваться оптимизация (early exit, кэширование).
- `supportsBridgeCandidates` семантически противоположен `supportsCompare`: один требует наличие путей (≥ 2), другой — их отсутствие (GAP). Это подтверждает, что Compare и BridgeCandidates — комплементарные операторы.
- Operator support layer теперь симметричен. Формула: `supports(graph, from, to) → { ok } → compute(graph, from, to) → result` для всех 4 операторов (Inspect, Trace, Compare, BridgeCandidates).