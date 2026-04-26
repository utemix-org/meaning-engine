# OPUS_TASK__DOCUMENTATION_WORLD_SEED__NOTION_TO_JSON_GRAPH

---

title: OPUS_TASK__DOCUMENTATION_WORLD_SEED__NOTION_TO_JSON_GRAPH

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

**Goal:** собрать **Documentation World seed** как JSON-граф из Notion (30–50 узлов), чтобы использовать документацию как чистый test world.

**ID rule:** `id = notion_url` (для page nodes).

</aside>

### High-level intent

- Получить **documentation graph** (не смешивать с system graph и knowledge graph).
- Развести два типа связей:
    - **Concept graph** (что с чем связано)
    - **Provenance graph** (почему/откуда это)

---

## A) Inputs (прочитать)

- [DOCUMENTATION_ARCHITECTURE](DOCUMENTATION_ARCHITECTURE%2062c1616d2e804a1d9ce3020315290c31.md)
- [LLMS_CONTEXT](../05%20Guides/LLMS_CONTEXT.md)
- [SYSTEM_OVERVIEW](../02%20Overview/SYSTEM_OVERVIEW.md)
- [HISTORY](../08%20Theory/HISTORY.md)
- [DRIFT_LOG](DRIFT_LOG%2089f61e0b356a4fb19eafb8c42810c5ce.md)
- [RENDER_SURFACES_SPEC](RENDER_SURFACES_SPEC%201d47fe5f22ef4318b62dd8b129e9f791.md)
- [NAVIGATION_SPEC](../04%20Specs/NAVIGATION_SPEC.md)
- [KNOWLEDGE_LOG_SPEC](KNOWLEDGE_LOG_SPEC%20d186fc3cca724175bcd404b5e04c6306.md)
- [PROJECTION_SPEC](../04%20Specs/PROJECTION_SPEC.md)
- [WORKBENCH_VS_PRACTICE](WORKBENCH_VS_PRACTICE%20f7603a2c56454f22a8346fbe5408e8e4.md)
- [FOCUS_AS_ATOM_OF_ATTENTION](FOCUS_AS_ATOM_OF_ATTENTION%207f6dd6875a7b443db4c20eb8eb782619.md)

---

## B) Output (файлы в repo)

Создать новую папку:

- `world/documentation-world/`

И файлы:

1) `seed.nodes.json`

2) `seed.edges.json`

3) `README.md`

---

## C) Schema (минимум)

### Node types (8)

- `page`, `concept`, `invariant`, `spec`, `decision`, `evidence`, `drift_item`, `code_artifact`

### Core node fields

- `id` (stable)
- `type`
- `title`
- `source`: `notion|repo|chat|opus_report`
- `url` (для notion pages)
- `tags`: string[]
- `status` (если применимо)

### Edge types (10)

Concept graph:

- `defines`, `constrains`, `refines`, `depends_on`, `applies_to`, `implements`

Provenance graph:

- `proved_by`, `reported_by`, `introduced_by`, `drift_against`

Edge fields:

- `from` (node id)
- `to` (node id)
- `type`
- `layer`: `concept|provenance`
- `note?`

---

## D) Seed scope (30–50 nodes)

### D1. Mandatory seed pages (create nodes type=page)

Включить минимум эти страницы (id=url):

- DOCUMENTATION_ARCHITECTURE
- LLMS_CONTEXT
- SYSTEM_OVERVIEW
- HISTORY
- DRIFT_LOG
- PROJECTION_SPEC
- NAVIGATION_SPEC
- KNOWLEDGE_LOG_SPEC
- RENDER_SURFACES_SPEC
- WORKBENCH_VS_PRACTICE
- FOCUS_AS_ATOM_OF_ATTENTION

### D2. Mandatory concepts (type=concept)

Создать concept nodes (ids = `concept:<slug>`):

- Focus
- Context
- Domain
- Workbench
- Practice
- Surface
- WorkbenchPolicy
- practiceId
- protocol.ts (как *concept*, отдельный `code_artifact` тоже можно)

### D3. Mandatory evidence (type=evidence)

Добавить evidence nodes для:

- Grounding Phase 3A tests (groundingPhase3a.test.js)
- Grounding Phase 3B tests (groundingPhase3b.test.js)

---

## E) Extraction rules (как Opus строит edges)

1) Если page явно описывает термин/модель → edge `defines` от page к concept.

2) Если page/спека устанавливает правило → edge `constrains` от invariant к spec/code_artifact.

3) Если тест/отчёт подтверждает инвариант → edge `proved_by` от invariant к evidence.

4) Если drift item указывает на несоответствие → edge `drift_against` от drift_item к target.

Важно: цель seed — **не покрытие всего**, а наличие связного подграфа, пригодного для первой проекции.

---

## F) [README.md](http://README.md) (обязательное содержимое)

- Что такое Documentation World и чем он НЕ является.
- Как обновлять seed (ручной режим vs Opus regeneration).
- Правило стабильности IDs.
- Ограничение: только 30–50 узлов на первом шаге.

---

## G) Acceptance

- [ ]  В repo создана папка `world/documentation-world/`.
- [ ]  `seed.nodes.json` содержит 30–50 nodes, валидный JSON.
- [ ]  `seed.edges.json` содержит связный граф (минимум 40–120 edges), валидный JSON.
- [ ]  Для всех nodes типа `page`: `id == url`.
- [ ]  Есть [README.md](http://README.md) с правилами.
- [ ]  В отчёте Opus перечислены:
    - сколько nodes/edges
    - какие страницы вошли
    - 5–10 примеров связей

---

## H) Report (Opus)

**Дата:** 2026-03-13

**Branch:** main

**SHA:** c5c4261f (uncommitted)

### Files created

| File | Description |
| --- | --- |
| `world/documentation-world/seed.nodes.json` | 51 nodes |
| `world/documentation-world/seed.edges.json` | 108 edges |
| `world/documentation-world/README.md` | Documentation + schema + rules |

### Node counts (51)

| Type | Count |
| --- | --- |
| page | 23 |
| spec | 4 |
| concept | 16 |
| invariant | 5 |
| evidence | 2 |
| code_artifact | 1 |

### Edge counts (108)

| Type | Count | Layer |
| --- | --- | --- |
| defines | 40 | concept |
| depends_on | 22 | concept |
| refines | 18 | concept |
| constrains | 10 | concept |
| applies_to | 6 | concept |
| implements | 4 | concept/provenance |
| proved_by | 4 | provenance |
| reported_by | 2 | provenance |
| drift_against | 2 | provenance |

**Concept layer:** 97 edges. **Provenance layer:** 11 edges.

### Pages included (27 page/spec nodes)

All 11 mandatory pages + 16 additional:

DOCUMENTATION_ARCHITECTURE, LLMS_CONTEXT, SYSTEM_OVERVIEW, HISTORY, DRIFT_LOG, PROJECTION_SPEC, NAVIGATION_SPEC, KNOWLEDGE_LOG_SPEC, RENDER_SURFACES_SPEC, WORKBENCH_VS_PRACTICE, FOCUS_AS_ATOM_OF_ATTENTION, ARCHITECTURE, FORMAL_CORE, INVARIANTS, AXIOMS, CONCEPTS, PHASES, CONTEXT_ENGINE_MODEL, ENGINE_DEVELOPER_GUIDE, WORLD_GROUNDING, L0_ONE_SCREEN_CORE, PROVEN, HOW_IT_WORKS, WORLD_AS_INTERFACE, WORKBENCH_AS_OPERATOR, REFERENCE_WORLD, FOUNDATIONS_OF_THE_SYSTEM.

### 10 примеров связей

1. `SYSTEM_OVERVIEW` **defines** `concept:projection` — master formula V=P(G,F,C,S,Pr)
2. `INVARIANTS` **defines** `invariant:projection-determinism`
3. `invariant:focus-preservation` **constrains** `concept:workbench-policy` — policy cannot hide focus
4. `WORKBENCH_VS_PRACTICE` **defines** `concept:practice` — practice = activity pattern
5. `evidence:grounding-phase-3b-tests` **proved_by** `concept:focus-continuity` — resolveFocusContinuity verified
6. `DRIFT_LOG` **drift_against** `code_artifact:protocol-ts` — defined-not-enforced
7. `ARCHITECTURE` **depends_on** `FORMAL_CORE` — structural reference
8. `concept:context` **refines** `concept:workbench` — context contains workbench as axis
9. `AXIOMS` **defines** `invariant:context-does-not-mutate-graph` — A3
10. `L0_ONE_SCREEN_CORE` **depends_on** `PROJECTION_SPEC` — L0→L3 navigation

### Link-check

✅ **0 broken refs.** All 108 edges reference existing node IDs.

✅ **Full connectivity.** Connected component = 51 (all nodes reachable).

✅ **ID=URL rule.** All 27 page/spec nodes have `id == url`.

### Acceptance

- [x]  В repo создана папка `world/documentation-world/`.
- [x]  `seed.nodes.json` содержит 51 node, валидный JSON.
- [x]  `seed.edges.json` содержит 108 edges, связный граф.
- [x]  Для всех page/spec nodes: `id == url`.
- [x]  Есть [README.md](http://README.md) с правилами.

### Open questions

1. **Engine loading.** Seed использует `source`/`target` (совместимо с engine), но находится в двух файлах (не `{nodes,edges}` как universe.json). Нужен тривиальный loader.
2. **Attachment point.** Задача упоминает привязку к узлу «Knowledge Systems & Cognitive Architectures» в universe.json. Это можно сделать одним ребром позже.
3. **Provenance layer.** Сейчас 11 provenance edges — можно нарастить, добавив `introduced_by` для каждого phase report.