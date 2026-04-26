# OPUS_TASK__AUTHORED_WORLD__MINI_KNOWLEDGE_DOMAIN__GROUNDING_TEST

---

title: OPUS_TASK__AUTHORED_WORLD__MINI_KNOWLEDGE_DOMAIN__GROUNDING_TEST

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: keeper

---

## 1) Context (зачем сейчас)

Documentation-world доказал use case `documentation reasoning` (reference workflows → boundary grammar → rival archetypes).

Следующий стресс‑тест: проверка переносимости дисциплины ME на мир, где структура **намеренно создана**, а не извлечена из кода.

Цель: создать маленький authored world (20–40 nodes) и прогнать на нём существующий operator stack (Trace/Compare/BridgeCandidates) в exploration-only режиме.

## 2) Scope (что можно трогать)

Разрешено:

- добавить новый reference world в `worlds/` (например `worlds/authored-mini-world/` или `worlds/test-world/`)
- seed файлы мира (`seed.nodes.json`, `seed.edges.json`, README)
- loader/smoke tests для загрузки мира
- runners/examples для запуска 3–4 сценариев

Запрещено:

- менять `src/core/*` и `src/engine/*`
- добавлять новые операторы
- добавлять новые node/edge types (используем существующие типы doc-world)
- governance/канонизация результатов

## 3) World design constraints

Мир должен быть:

- маленький (20–40 узлов)
- связный (кроме 1 намеренного GAP)
- эпистемически типизированный теми же типами, что и doc-world (concept/spec/claim/evidence/invariant/artifact/code_artifact — если уже используется)

В мире должны быть встроены 4 контрольные ситуации:

1) **Path exists** (Trace возвращает path)

2) **Directed boundary** (Trace(A→B)=no_path, Trace(B→A)=path, через `implements`)

3) **Rival explanations** (Compare даёт ≥2 rival shortest paths)

4) **True GAP + bridge candidates** (Trace=no_path + supportsBridgeCandidates=true + ≥1 candidate)

## 4) Deliverables

### D0. GitHub traceability (обязательно)

- PR или commit+push.
- В Opus Report: PR link + SHA + тесты.

Язык:

- Notion (task + report) — русский
- PR/commit messages — английский

### D1. New world in repo

- `worlds/authored-mini-world/seed.nodes.json`
- `worlds/authored-mini-world/seed.edges.json`
- `worlds/authored-mini-world/README.md` (что это за мир и какие 4 контрольные ситуации встроены)

### D2. Loader + smoke tests

- loader, который читает seed и строит GraphModel
- smoke tests: мир грузится, инварианты графа не нарушены

### D3. Reference workflow on authored world

- runner/fixtures/tests для 4 сценариев (path, directed boundary, rivals, gap+bridge)
- результаты фиксируются как compute artifacts (exploration-only)

## 5) Acceptance criteria

- Мир добавлен, грузится, инварианты проходят
- 4 контрольные ситуации реализованы и проверены тестами
- Compare/Trace/BridgeCandidates работают на authored мире без изменений алгоритмов
- Exploration ≠ Acceptance соблюдено
- Все тесты зелёные

## 6) Architectural note

Exploration ≠ Acceptance.

Это тест переносимости дисциплины, не расширение онтологии и не новый операторный слой.

---

## 7) Opus Report (fill here)

### A) GitHub traceability

- PR: Direct push
- Branch: main
- Commit SHA: `a99c078`
- Commit message (EN): `feat(worlds): add authored-mini-world — type theory domain (25 nodes, 4 control scenarios, 19 tests)`
- Tests: `npm ci && npm test` → green, 31 suites / 631 tests

### B) World snapshot (RU)

- Node count: **25** (5 spec, 6 concept, 2 invariant, 4 evidence, 8 code_artifact — но code_artifact не обязательно файлы, здесь это authored conceptual artifacts)
- Edge count: **27** (defines, refines, constrains, proved_by, implements, depends_on)
- Intentional GAP: кластер Linear Types (`spec:linear-types`, `concept:affine-types`, `evidence:rust-borrow-checker-test`) намеренно отключён от основного компонента графа (нет ни одного ребра к остальным 22 узлам)
- Предметная область: Type Theory (лямбда-исчисление, Hindley-Milner, зависимые типы, линейные типы)

### C) 4 scenarios (RU)

**1) Path exists:**

- fromId: `spec:type-theory-overview`
- toId: `evidence:coq-proof`
- output: **PATH, 3 hops** (TTO → concept:soundness → invariant:progress-preservation → coq-proof)
- Маршрут проходит через concept и invariant слои, демонстрируя полную эпистемическую цепочку

**2) Directed boundary:**

- A: `spec:type-theory-overview`
- B: `code_artifact:type-checker`
- Trace(A→B): **no_path** (спецификация не «знает» о реализации — нет исходящих рёбер от spec к code)
- Trace(B→A): **path, 1 hop** (typeChecker.js `implements` Type Theory Overview)
- Вывод: направленность `implements` ребра выражает зависимость и ответственность

**3) Rival explanations:**

- fromId: `spec:type-theory-overview`
- toId: `code_artifact:inference-engine`
- Compare rival count: **2 rival paths** (3 hops каждый)
 - Concept-mediated: TTO → Polymorphism → Hindley-Milner → inferenceEngine.js
 - Code-dependency: TTO → typeChecker.js → typeChecker.test.js → inferenceEngine.js
- archetype note: повторяется **Archetype A** из Pack 3 (concept-mediated vs code-dependency route). На authored мире паттерн идентичен: одно и то же соединение объясняется и через концептуальное наследие, и через import-граф.

**4) GAP + bridge candidates:**

- fromId: `spec:type-theory-overview`
- toId: `evidence:rust-borrow-checker-test`
- Trace: **no_path** (undirected GAP — кластер Linear Types полностью отключён)
- supportsBridgeCandidates: **ok: true**, candidateCount: **3**
- Кандидаты: `concept:test-coverage`, `concept:acceptance-criteria`, `concept:verification-method` (heuristic: type-pair-mapping для пары spec→evidence)

### D) Non-changes (RU)

- Engine (`src/core/*`, `src/engine/*`): unchanged
- Operators algorithms (`operators/trace.js`, `compare.js`, `supports.js`): unchanged
- Ontology/types: unchanged (использованы существующие типы из doc-world)
- Seed doc-world: unchanged

### E) Result Type + Architectural Status (RU)

- Result Type: новый reference world + loader + 19 тестов
- Architectural Status:
 - Validated: **переносимость operator stack на authored мир** — Trace/Compare/BridgeCandidates работают без изменений алгоритмов на мире, созданном вручную. Все 4 контрольные ситуации воспроизводятся стабильно.
 - Validated: **Archetype A (concept-mediated vs code-dependency)** из Pack 3 воспроизводится и на authored мире — это устойчивый паттерн, не зависящий от конкретного графа.
 - Not validated: масштабируемость на большие authored миры (100+ узлов). Текущий тест — только minimum viable.
 - Contamination/notes: exploration ≠ acceptance соблюдено. Граф не мутируется. Никаких governance решений.