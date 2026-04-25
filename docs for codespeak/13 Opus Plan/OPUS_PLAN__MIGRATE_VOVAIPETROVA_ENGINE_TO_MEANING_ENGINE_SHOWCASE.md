# OPUS_PLAN__MIGRATE_VOVAIPETROVA_ENGINE_TO_MEANING_ENGINE_SHOWCASE

---

title: OPUS_PLAN__MIGRATE_VOVAIPETROVA_ENGINE_TO_MEANING_ENGINE_SHOWCASE

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: synthesis

---

## Purpose

Составить исполнимый план миграции: сделать `utemix-org/meaning-engine` основным публичным репозиторием Meaning Engine (витрина + место разработки), перенеся в него актуальное ядро/операторы/демо из `utemix-org/vovaipetrova`, при этом:

- не тащить внутрь витрины “vovaipetrova” как внешний авторский проект
- убрать legacy/дубли/шум
- сохранить воспроизводимость (fresh clone → demo)

## Inputs

- Repo A (source): `utemix-org/vovaipetrova`
- Repo B (target): `utemix-org/meaning-engine`
- License: MIT (decision)
- Language policy for public repo: English-only (decision)
- NPM: do not treat as primary distribution channel (decision)

## Non-goals

- Не переносить старый 3D render (уже вынесен в отдельный repo)
- Не публиковать vovaipetrova как часть ME
- Не “доделывать продукт”; цель — репо‑порядок и упаковка системы

## Decision gates (answer before executing)

### Gate 1 — Where active engine development lives today

Ответить: какая директория в `vovaipetrova` является “источником истины” для движка сейчас:

- `packages/engine` (как указано в audit) — ожидаемо yes

### Gate 2 — What becomes public

Подтвердить набор публичных компонент:

- kernel (log/evaluate/buildGraph)
- projection + navigation
- operators (inspect/trace/compare)
- reference worlds (documentation world + code-artifact/dependency world)
- tests
- minimal docs (README, ARCHITECTURE, EPISTEMIC_LOG)

### Gate 3 — Epistemic logs publishing policy

Выбрать один режим для публичного репо:

- A) publish only derived artifacts (graph + operator outputs)
- B) publish a small demo epistemic log (toy / sanitized)
- C) do not publish logs (only schema/examples)

## Target layout (meaning-engine)

Target repo must read as:

- engine = kernel
- operators = extensions
- worlds = datasets
- examples = reproducible demos

Proposed tree:

- [README.md](http://README.md)
- LICENSE
- [ARCHITECTURE.md](http://ARCHITECTURE.md)
- EPISTEMIC_[LOG.md](http://LOG.md)
- engine/
    - kernel/
    - projection/
    - navigation/
    - types/
    - speculative/ (optional)
- operators/
    - inspect/
    - trace/
    - compare/
- worlds/
    - documentation-world/
    - code-artifact-world/
- examples/
    - doc-world-demo/
    - traceability-demo/
- papers/
    - [meaning-engine-paper.md](http://meaning-engine-paper.md)
- scripts/ (only if referenced)
- tests/

## Plan (high-level)

### Step 1 — Freeze and backup

- Create a backup tag/branch in both repos before moving.
- Confirm old render is already removed or stays outside.

### Step 2 — Bring target repo to “accepting skeleton”

In `meaning-engine`:

- add MIT LICENSE file
- remove/rename any misleading NPM messaging
- ensure minimal root docs exist (README/ARCHITECTURE/EPISTEMIC_LOG placeholders)

### Step 3 — Copy engine core from vovaipetrova to meaning-engine

From `vovaipetrova/packages/engine/src`:

- move/copy kernel, projection, navigation, core types
- preserve test suite
- ensure path stability (imports)

### Step 4 — Copy operators + doc-world tooling

From `vovaipetrova/world/documentation-world/` and its operators:

- move/copy to `meaning-engine/worlds/documentation-world/`
- move reusable operators to `meaning-engine/operators/`
- leave world-specific runners under `examples/` or `worlds/.../tools/`

### Step 5 — Copy code-artifact/dependency world components

- move extractor scripts and fixtures
- decide: keep generated artifacts in repo or regenerate on demand

### Step 6 — Sanitize

In target repo:

- delete legacy/duplicate trees
- ensure “speculative” code is clearly separated (not in kernel)
- remove Russian internal docs and vovaipetrova-specific narrative material

### Step 7 — Developer experience

Implement commands:

- `npm install`
- `npm test`
- `npm run demo:doc-world`
- `npm run demo:traceability`

Acceptance:

- fresh clone → `npm install` → `npm test` green
- fresh clone → `npm run demo:doc-world` produces stable output

### Step 8 — Release hygiene (not necessarily publish)

- create first tag (e.g. v0.1.0) after sanitation
- create CHANGELOG (optional)
- set contribution guidance ([CONTRIBUTING.md](http://CONTRIBUTING.md) optional)

## Commit strategy (to keep history meaningful)

Use a small number of large, explicit commits:

1) `repo: add target skeleton + MIT license`

2) `engine: import kernel/projection/navigation from source`

3) `operators: import inspect/trace/compare`

4) `worlds: add documentation-world + demo runner`

5) `worlds: add code-artifact world + extractor`

6) `docs: rewrite README/ARCHITECTURE/EPISTEMIC_LOG (English)`

7) `cleanup: remove legacy/duplicates`

## Deliverables

- PR(s) into `utemix-org/meaning-engine`
- Updated README (English): problem → idea → demo
- `EPISTEMIC_LOG.md` explaining Git log vs epistemic log
- Demo runners + stable outputs

## Definition of Done

- [ ]  MIT LICENSE exists
- [ ]  Repo tree reflects architecture (engine/operators/worlds/examples)
- [ ]  Tests are green
- [ ]  Demo runnable in ≤ 2 commands
- [ ]  No vovaipetrova dependency or narrative leakage
- [ ]  NPM is not treated as primary channel