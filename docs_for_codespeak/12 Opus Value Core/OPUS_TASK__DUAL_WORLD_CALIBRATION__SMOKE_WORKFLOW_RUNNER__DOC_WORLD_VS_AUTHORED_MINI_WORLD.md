# OPUS_TASK__DUAL_WORLD_CALIBRATION__SMOKE_WORKFLOW_RUNNER__DOC_WORLD_VS_AUTHORED_MINI_WORLD

---

title: OPUS_TASK__DUAL_WORLD_CALIBRATION__SMOKE_WORKFLOW_RUNNER__DOC_WORLD_VS_AUTHORED_MINI_WORLD

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: keeper

---

## 1) Context (зачем сейчас)

У нас теперь есть два типа миров:

- extracted: `documentation-world`
- authored: `authored-mini-world`

Операторные workflows и паттерны показали переносимость дисциплины.

Следующий минимальный шаг — превратить это из “зафиксировано словами” в **воспроизводимый baseline**:

`same scenario set → runs across both worlds → comparable output`.

## 2) Scope (что можно трогать)

Разрешено:

- добавить runner (script) для dual-world smoke workflow
- добавить fixtures/outputs (json) для стабильной проверки
- добавить tests на детерминизм и соответствие baseline

Запрещено:

- менять `src/core/*` и `src/engine/*`
- менять алгоритмы operators (trace/compare/supports/bridgeCandidates)
- менять seed/онтологию обоих миров
- добавлять новые node/edge types
- governance

## 3) Deliverables

### D0. GitHub traceability (обязательно)

- PR или commit+push.
- В Opus Report: PR link + SHA + тесты.

Язык:

- Notion (task + report) — русский
- PR/commit messages — английский

### D1. Runner: dual-world smoke workflow

Добавить runnable script (предложение пути, можно изменить если уместнее):

- `operators/runDualWorldSmokeWorkflow.js`

Поведение:

- for world in `[documentation-world, authored-mini-world]`:
 - load world
 - run scenario set (4 шт.)
 - print (или сохранить) summary

### D2. Scenario set (одинаковый логический набор для обоих миров)

Сценарии:

1) **Path exists** (Trace → PATH)

2) **Directed boundary** (Trace(A→B)=no_path, Trace(B→A)=path)

3) **Rival explanations** (Compare → rival paths ≥ 2)

4) **True GAP + bridge candidates** (Trace=no_path + supportsBridgeCandidates ok + candidateCount ≥ 1)

Важно: конкретные from/to IDs будут различаться по мирам, но сценарная семантика должна совпадать.

### D3. Baseline output (fixtures)

- сохранить baseline summary в JSON (например `operators/dualWorldSmoke.baseline.json`)
- baseline должен включать:
 - world name
 - scenario name
 - ok/path|gap
 - rivalCount (для Compare)
 - candidateCount (для bridge)

### D4. Tests

Минимум 6 тестов:

- runner outputs deterministic
- baseline matches for doc-world
- baseline matches for authored-mini-world
- exploration ≠ acceptance (никаких полей/событий канонизации)
- scenarios satisfy acceptance thresholds (PATH exists / rivals≥2 / candidates≥1)
- negative guard: если scenario не выполняется, тест падает с понятной причиной

## 4) Acceptance criteria

- runner существует и запускается
- baseline сохранён
- tests green
- нет изменений в engine/operators algorithms/ontology/seed

## 5) Architectural note

Exploration ≠ Acceptance.

Этот runner — калибровка воспроизводимости reasoning patterns across worlds, не новое поведение системы.

---

## 6) Opus Report (fill here)

### A) GitHub traceability

- PR: Direct push
- Branch: main
- Commit SHA: `7db61b3`
- Commit message (EN): `feat(operators): add dual-world smoke workflow runner + baseline + 8 tests`
- Tests: `npm ci && npm test` → green, 32 suites / 639 tests

### B) Runner

- Path: `operators/runDualWorldSmokeWorkflow.js`
- How to run: `node operators/runDualWorldSmokeWorkflow.js`
- Также экспортирует `runDualWorldSmoke` для программного использования в тестах

### C) Scenario mapping (RU)

**Doc-world:**

- Path exists: `SYSTEM_OVERVIEW` → `concept:projection` (1 hop)
- Directed boundary: `NAVIGATION_SPEC` ↔ `applyTransition.js` (A→B=no_path, B→A=1 hop)
- Rival explanations: `PROJECTION_SPEC` → `evaluate.js` (13 rivals, 3 clusters)
- GAP+bridge: `evidence:grounding-phase-3a-tests` → `src/validate.js` (1 candidate)

**Authored-mini-world:**

- Path exists: `spec:type-theory-overview` → `evidence:coq-proof` (3 hops)
- Directed boundary: `spec:type-theory-overview` ↔ `code_artifact:type-checker` (A→B=no_path, B→A=1 hop)
- Rival explanations: `spec:type-theory-overview` → `code_artifact:inference-engine` (2 rivals, 2 clusters)
- GAP+bridge: `spec:type-theory-overview` → `evidence:rust-borrow-checker-test` (3 candidates)

### D) Baseline summary (RU)

- baseline file: `operators/dualWorldSmoke.baseline.json`
- Содержит для каждого мира: world name, 4 сценария с ok/path|gap, rivalCount, candidateCount
- Пороги: pathExists.hops ≥ 1, directedBoundary A→B=no_path + B→A=path, rivalCount ≥ 2, candidateCount ≥ 1
- Оба мира: все 8/8 сценариев ok=true

### E) Non-changes (RU)

- Engine (`src/core/*`, `src/engine/*`): unchanged
- Operators algorithms (`trace.js`, `compare.js`, `supports.js`): unchanged
- Seeds/ontology: unchanged (оба мира использованы as-is)

### F) Result Type + Architectural Status (RU)

- Result Type: runner + baseline fixture + 8 тестов
- Architectural Status:
 - Validated: **калибровка переносимости** — один и тот же набор сценариев стабильно воспроизводится на обоих мирах без изменений алгоритмов. Baseline зафиксирован.
 - Validated: **детерминизм** — повторные запуски дают идентичный результат.
 - Validated: **сценарная симметрия** — оба мира показывают одинаковые 4 сценария с ok=true, несмотря на разные масштабы (116/292 vs 25/27).
 - Not validated: масштабируемость на миры с 1000+ узлов.
 - Contamination/notes: exploration ≠ acceptance соблюдено. Никаких мутаций графа, никакой канонизации.