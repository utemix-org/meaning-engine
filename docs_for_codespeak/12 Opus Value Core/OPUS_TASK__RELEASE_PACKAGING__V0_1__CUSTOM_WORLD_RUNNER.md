# OPUS_TASK__RELEASE_PACKAGING__V0_1__CUSTOM_WORLD_RUNNER

---

title: OPUS_TASK__RELEASE_PACKAGING__V0_1__CUSTOM_WORLD_RUNNER

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: keeper

---

## 1) Context

v0.1 должен показывать не только "our demo", но и "your graph works too".

Для этого нужен минимальный custom-world runner.

Правило: Don't improve the engine. Only improve reproducibility.

## 2) Scope

Разрешено:

- добавить CLI runner: `operators/runWorldSmokeWorkflow.js`
- добавить tiny example world (например `worlds/tiny-world/`), который можно копировать
- добавить smoke tests

Запрещено:

- ingestion framework
- новые operator categories
- новые node/edge types
- изменения engine/operators algorithms

## 3) Runner contract

Команда:

- `node operators/runWorldSmokeWorkflow.js./path/to/world`

Вход:

- каталог, содержащий `seed.nodes.json` и `seed.edges.json` (по WORLD_INPUT_[FORMAT.md](http://FORMAT.md))

Поведение (минимум):

- load world
- run Inspect (ok)
- run Trace on one pair (PATH или GAP) — допускается выбор пары через CLI args
- run Compare: если supportsCompare=false → честно сообщить; если true → выполнить
- run BridgeCandidates: если supports=false → честно; если true → выполнить

Вывод:

- текст/markdown summary + exit code (0 если ok)

## 4) Deliverables

### D0. GitHub traceability (обязательно)

- PR или commit+push.
- EN commit messages.
- Tests green.

### D1. Tiny example world

- `worlds/tiny-world/seed.nodes.json`
- `worlds/tiny-world/seed.edges.json`
- `worlds/tiny-world/README.md` (как копировать и модифицировать)

### D2. Tests

- мир загружается
- runner работает на tiny-world
- runner не мутирует граф
- supports деградация честная (если compare/bridge не поддержаны)

## 5) Acceptance criteria

- `node operators/runWorldSmokeWorkflow.js worlds/tiny-world` работает
- внешний человек может скопировать tiny-world и запустить
- tests green
- engine/operators algorithms unchanged

---

## 6) Opus Report

### A) GitHub traceability

- PR: Direct push
- Branch: main
- Commit SHA: `076820c`
- Commit message (EN): `feat: add custom world smoke workflow runner + tiny-world example (11 tests)`
- Tests: `npm install && npm test` → **34 suites, 662 tests, all green**

### B) How to run

```bash
# Default (picks first/last node)
node operators/runWorldSmokeWorkflow.js worlds/tiny-world

# With custom pair
node operators/runWorldSmokeWorkflow.js worlds/tiny-world --from spec:cooking-basics --to evidence:sear-test

# Works on any world
node operators/runWorldSmokeWorkflow.js worlds/authored-mini-world --from spec:type-theory-overview --to evidence:coq-proof
```

### C) Files added

- `operators/runWorldSmokeWorkflow.js`: CLI runner — загружает любой world directory, запускает Inspect/Trace/Compare/BridgeCandidates с честной деградацией
- `worlds/tiny-world/seed.nodes.json`: 6 узлов (spec, concept, invariant, evidence)
- `worlds/tiny-world/seed.edges.json`: 5 рёбер (defines, constrains, proved_by)
- `worlds/tiny-world/README.md`: как копировать и модифицировать
- `operators/__tests__/worldSmokeWorkflow.test.js`: 11 тестов (load, trace path, rivals, honest degradation, no-mutation, determinism)

### D) Non-changes

- Engine core: unchanged
- Operator algorithms: unchanged
- Ontology/seed: unchanged

### E) Notes

- supportsTrace показывает «imited» для tiny-world (нет code_artifact), но trace всё равно выполняется — это честная деградация, а не блокировка
- Runner валидирует seed при загрузке: проверяет required fields (id/type/title у узлов, source/target/type у рёбер) и referential integrity