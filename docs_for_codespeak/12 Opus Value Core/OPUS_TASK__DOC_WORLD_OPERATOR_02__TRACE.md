# OPUS_TASK__DOC_WORLD_OPERATOR_02__TRACE

---

title: OPUS_TASK__DOC_WORLD_OPERATOR_02__TRACE

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

**Goal:** реализовать **Trace operator** над Documentation World (без UI), который строит трассу между двумя узлами или явно показывает gap как `candidate bridge`.

Operator #1 = Inspect (подтверждён анализом).

Operator #2 = Trace.

</aside>

### Inputs

- Doc-world seed + runtime:
    - `world/documentation-world/seed.nodes.json`
    - `world/documentation-world/seed.edges.json`
    - `world/documentation-world/loader.js`
    - `world/documentation-world/analysis/analysis.json` (missing candidates)
- Текущие результаты анализа: [OPUS_TASK__DOC_WORLD_ANALYSIS_OPERATORS__CENTRALITY_BRIDGES_CYCLES_DISTANCE](OPUS_TASK__DOC_WORLD_ANALYSIS_OPERATORS__CENTRALITY_BRIDGES_CYCLES_DISTANCE.md)

---

## A) Constraints

- **Do:** добавить trace script/operator + tests + output artifacts.
- **Do not:** добавлять UI.
- **Do not:** менять engine pipeline (projection/navigation/knowledge).
- **Do not:** канонизировать автоматически новые concepts/edges — только suggestions.

---

## B) Operator definition

### B1. API (минимум)

Сделать функцию (чистую, детерминированную):

`trace(graph, fromId, toId, options) → TraceResult`

Где `TraceResult` одно из:

1) `{ ok: true, path: Array<{ nodeId, viaEdgeType? }> , hops: number }`

2) `{ ok: false, reason: 'no_path', gap: { fromId, toId, boundary }, candidates: Array<CandidateBridge> }`

Минимальный `options`:

- `maxHops` (default 6)
- `allowedEdgeTypes?` (если нужно для режимов)

### B2. CandidateBridge (suggestions only)

Если пути нет (или он слишком длинный), вернуть suggestion:

- `candidateConceptId` (например `concept:test-coverage`)
- `candidateEdges`: какие 2–3 edges нужно добавить, чтобы замкнуть gap
- `note`: почему (например: "spec↔evidence missing")

Важно: suggestion — это output оператора, не изменение seed.

---

## C) Implementation

### C1. Где код

- `world/documentation-world/operators/trace.js` (предпочтительно отдельная папка `operators/`)
- CLI runner: `world/documentation-world/operators/runTrace.js`

### C2. Алгоритм

- BFS shortest path по directed edges.
- Если `maxHops` превышен → treat as `no_path` (gap).

### C3. Конфигурация "мостовых" candidates

На этом шаге достаточно mapping v0 (hardcoded):

- gap `spec ↔ evidence` → candidate concept `concept:test-coverage`
- gap `evidence ↔ code_artifact` → candidate concept `concept:code-spec-alignment`
- gap `context ↔ SYSTEM_OVERVIEW` → candidate concept `concept:context-anchor`

(Это не онтология, а словарь suggestions v0.)

---

## D) Required scenarios (Acceptance)

Оператор считается готовым, если есть минимум 3 сценария:

1) `spec → evidence` trace (либо путь, либо gap + candidate)

2) `evidence → code_artifact` trace (либо путь, либо gap + candidate)

3) `context → SYSTEM_OVERVIEW` trace (либо путь, либо gap + candidate)

И дополнительно:

- trace никогда не падает на текущем seed (51/108)

---

## E) Tests

Добавить тесты, например:

- `packages/render/src/__tests__/documentationWorldTrace.test.js`

Минимум 6 тестов:

1) returns path when path exists

2) returns no_path when absent

3) returns candidate bridge for spec↔evidence

4) returns candidate bridge for evidence↔code_artifact

5) returns candidate bridge for context↔SYSTEM_OVERVIEW

6) deterministic output (same inputs → same result)

---

## F) Output artifacts

- `world/documentation-world/operators/trace.examples.json` (3 примера вызова + результат)
- (опционально) добавить секцию в `world/documentation-world/README.md`: как запускать trace

---

## G) Report (Opus)

### Snapshot

- Branch: `main` (ahead 13)
- Tests: **572 passed** (28 files), 0 failed — includes 6 new trace tests
- Date: 2026-03-13

### Files changed

| File | Action |
| --- | --- |
| `world/documentation-world/operators/trace.js` | **created** — trace() pure function |
| `world/documentation-world/operators/runTrace.js` | **created** — CLI runner |
| `world/documentation-world/operators/trace.examples.json` | **generated** — 3 scenario outputs |
| `packages/render/src/__tests__/documentationWorldTrace.test.js` | **created** — 6 tests |

### Trace scenarios

**1. SYSTEM_OVERVIEW → concept:projection** (spec:PROJECTION_SPEC → evidence — см. ниже)

- ✅ **PATH found** (1 hop): `SYSTEM_OVERVIEW → Projection`
- Edge type: `defines`
- Это подтверждает прямую семантическую связь page→concept.

**2. spec (PROJECTION_SPEC) → evidence (Phase 3A tests)**

- ❌ **GAP** — нет directed пути
- Candidate bridge: `concept:test-coverage`
- Suggested edges: `PROJECTION_SPEC →[constrains]→ concept:test-coverage →[applies_to]→ evidence:grounding-phase-3a-tests`
- Причина: specs и evidence находятся в разных кластерах DAG-структуры, нет исходящих рёбер от spec к evidence.

**3. evidence (Phase 3A) → code_artifact (protocol.ts)**

- ❌ **GAP** — нет directed пути
- Candidate bridge: `concept:code-spec-alignment`
- Suggested edges: `evidence →[proved_by]→ concept:code-spec-alignment →[applies_to]→ code_artifact:protocol-ts`

**4. concept:context → SYSTEM_OVERVIEW**

- ❌ **GAP** — нет directed пути (ребро идёт в обратную сторону: SYSTEM_OVERVIEW → concept:context)
- Candidate bridge: `concept:context-anchor`
- Показательно: undirected reachability = 51/51 (100%), т.e. граф связный, но directed DAG-структура не позволяет достичь concepts из target-концов рёбер.

### Engine unchanged — confirmed

Ни один файл в `packages/engine/` не менялся. Trace — чистый оператор над seed-данными.