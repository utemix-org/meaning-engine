# OPUS_TASK__RELEASE_PACKAGING__V0_1__DOCS_AND_ENTRYPOINT

---

title: OPUS_TASK__RELEASE_PACKAGING__V0_1__DOCS_AND_ENTRYPOINT

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: keeper

---

## 1) Context

v0.1 = research snapshot. Правило: Don't improve the engine. Only improve reproducibility.

Цель этого task: упаковать документацию/entrypoint так, чтобы внешний человек мог за 5 минут понять и запустить demo.

## 2) Scope

Разрешено:

- README / docs файлы
- (минимально) wiring команд в package scripts, если нужно

Запрещено:

- изменения engine и operator algorithms
- изменения ontology/seed
- новый ingestion

## 3) Deliverables

### D0. GitHub traceability (обязательно)

- PR или commit+push.
- EN commit messages.
- Tests green.

### D1. README Quickstart (canonical demo)

Добавить в README:

- 1 paragraph: what it is (1 формула)
- 1 use case question + 1 output snippet
- Canonical demo: `node operators/runReasoningReport.js --baseline`
- Expected output: 2 worlds × 4 scenarios, с примерами ключевых чисел (rivals/candidates)

### D2. WORLD_INPUT_[FORMAT.md](http://FORMAT.md) (v0.1 world contract)

Сделать документ (короткий):

- формат `seed.nodes.json` / `seed.edges.json`
- минимальные поля
- правила валидности
- важное: node types and edge types are open vocabulary (нет фиксированной онтологии)

### D3. MAKE_YOUR_FIRST_[WORLD.md](http://WORLD.md)

Мини-гайд "5 минут":

- минимальный пример nodes/edges прямо в документе
- как запустить custom-world runner (можно пока ссылкой на следующий task)

### D4. [CHANGELOG.md](http://CHANGELOG.md) (минимальный)

- v0.1.0: First Architectural Cycle (list of entrypoints + baseline artifacts)

## 4) Acceptance criteria

- repo после clean clone: `npm install` + `npm test` ok
- README содержит canonical demo + expected output
- 3 дока присутствуют: WORLD_INPUT_[FORMAT.md](http://FORMAT.md), MAKE_YOUR_FIRST_[WORLD.md](http://WORLD.md), [CHANGELOG.md](http://CHANGELOG.md)

---

## 5) Opus Report

### A) GitHub traceability

- PR: Direct push
- Branch: main
- Commit SHA: `3d4cd52`
- Commit message (EN): `docs: add v0.1 release packaging — README quickstart, CHANGELOG, world format docs`
- Tests: `npm install && npm test` → **33 suites, 651 tests, all green**

### B) Files added/updated

- `README.md`: переписан — добавлен canonical demo (`node operators/runReasoningReport.js --baseline`), expected output snippet, таблица reference worlds, обновлённое дерево архитектуры
- `CHANGELOG.md` (new): v0.1.0 First Architectural Cycle — перечислены все entrypoints, operators, worlds, baseline artifacts
- `docs/WORLD_INPUT_FORMAT.md` (new): формат `seed.nodes.json` / `seed.edges.json`, required/optional fields, правила валидности, edge directionality, ID conventions, open vocabulary
- `docs/MAKE_YOUR_FIRST_WORLD.md` (new): 5-минутный гайд с inline-примером (6 nodes, 5 edges, «cooking» domain), trace/compare/gap демонстрации

### C) Non-changes

- Engine core: unchanged
- Operator algorithms: unchanged
- Ontology/seed: unchanged
- No new tests (docs-only task)

### D) Observations

- README canonical demo теперь показывает реальный output excerpt — 2 worlds × 4 scenarios, с примерами key numbers (rivals=13, clusters=3, hops=3)
- WORLD_INPUT_[FORMAT.md](http://FORMAT.md) фиксирует v0.1 контракт: node types и edge types — open vocabulary, без фиксированной онтологии
- MAKE_YOUR_FIRST_[WORLD.md](http://WORLD.md) использует standalone пример (не привязан к engine internals), чтобы новый пользователь мог начать за 5 минут