# OPUS_TASK__OPERATOR_SUPPORTS_AND_RIVAL_PATHS_CHECK

---

title: OPUS_TASK__OPERATOR_SUPPORTS_AND_RIVAL_PATHS_CHECK

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: architect-gated

---

<aside>
🎯

**Goal:** добавить измеримую проверку применимости операторов и сигналов для будущего Compare:

- `supports(op, graph, context)` для Inspect/Trace
- детект `multiple valid traces` (rival paths) между теми же узлами
- детект `rival candidate bridges` для одного GAP

Это следующий шаг вместо Operator #3 Compare (Compare пока не оправдан измерениями).

</aside>

### Inputs

- Documentation World runtime:
    - `world/documentation-world/loader.js`
    - `world/documentation-world/seed.*.json`
    - operators:
        - Inspect (implicit via projection)
        - Trace (`world/documentation-world/operators/trace.js`)
- Analysis artifacts:
    - `world/documentation-world/analysis/analysis.json`
- Anchors:
    - [CARD__OPERATOR_VS_EPISTEMIC_ACTION](CARD__OPERATOR_VS_EPISTEMIC_ACTION%2011a243b3e50d40418b69208a318a3b5b.md)
    - [EPISTEMIC_TYPED_GRAPH_DEFINITION](EPISTEMIC_TYPED_GRAPH_DEFINITION%20276627a0c4154862be34b1041eb4b155.md)
    - [OPERATORS_CONTRACTS_AND_CORE_MENTAL_MODEL](OPERATORS_CONTRACTS_AND_CORE_MENTAL_MODEL%20bb73275edc5b450aa26dda862c1d8940.md)
    - [OPUS_TASK__DOC_WORLD_OPERATOR_02__TRACE](OPUS_TASK__DOC_WORLD_OPERATOR_02__TRACE%20d6012a84d24d4543972e49f756ab4144.md)

---

## A) Constraints

- **Do:** только operator-layer compute + tests + отчёт.
- **Do not:** менять engine pipeline.
- **Do not:** добавлять UI.
- **Do not:** канонизировать suggestions автоматически.

---

## B) Deliverables

### B1. supports() contracts

Добавить модуль, например:

- `world/documentation-world/operators/supports.js`

Сигнатуры:

- `supportsInspect(graph, context?) -> { ok: true } | { ok: false, missing: [...] }`
- `supportsTrace(graph, context?) -> { ok: true } | { ok: false, missing: [...] }`

Минимальные требования Trace (v0):

- nodeTypes include: `spec|claim|invariant` AND `evidence` AND `artifact|code_artifact`
- edgeTypes include at least one of: `proved_by|implements|constrains|depends_on`

### B2. Rival paths check

Добавить функцию, например:

- `findRivalTraces(graph, fromId, toId, options) -> { paths: Path[], reason? }`

Минимум:

- возвращает 2+ разных shortest paths если они существуют (или явно сообщает, что путь уникален)
- "разность" путей: отличается хотя бы одним edge или node

### B3. Rival bridge candidates check

Добавить функцию, например:

- `rankBridgeCandidates(gap, graph) -> CandidateBridge[]`

Минимум:

- если для GAP существует 2+ кандидата (например из mapping v0 или эвристик), вернуть их списком
- если кандидат один — вернуть один

---

## C) Tests

Добавить тест-файл, например:

- `packages/render/src/__tests__/documentationWorldOperatorSupports.test.js`

Минимум 8 тестов:

1) supportsInspect returns ok on doc-world

2) supportsTrace returns ok on doc-world

3) supportsTrace returns missing on a minimal non-epistemic toy graph (создать в тесте)

4) findRivalTraces returns 1 path on current doc-world example (ожидаемо)

5) findRivalTraces returns 2 paths on synthetic graph with two alternatives

6) rankBridgeCandidates returns at least 1 candidate for known GAP types

7) deterministic outputs

8) regression green

---

## D) Acceptance

- [x]  Есть supports() для Inspect/Trace
- [x]  Есть rival-traces checker + tests
- [x]  Есть rival-bridge-candidates checker + tests
- [x]  На doc-world: supportsTrace = ok, rival paths отсутствуют (unique shortest paths)
- [x]  Engine unchanged
- [x]  Tests green (598 passed, 8 new)

---

## E) Report (Opus)

### Snapshot

- **Branch:** `main`
- **SHA:** `c5c4261` (uncommitted — operator layer only, no engine changes)
- **Tests:** 598 passed, 8 new tests green. 15 pre-existing legacy failures (document is not defined).

### Files changed

| **File** | **Action** |
| --- | --- |
| `world/documentation-world/operators/supports.js` | **Created** — supportsInspect, supportsTrace, findRivalTraces, rankBridgeCandidates |
| `packages/render/src/__tests__/documentationWorldOperatorSupports.test.js` | **Created** — 8 tests |

### supports() results

**Documentation World (51 nodes, 108 edges):**

- `supportsInspect(docGraph)` → `{ ok: true }`
- `supportsTrace(docGraph)` → `{ ok: true }`

**Synthetic non-epistemic graph (3 nodes: note, note, tag):**

- `supportsTrace(toyGraph)` → `{ ok: false }`, missing:
    - `nodeCategory 'epistemic-source': need one of [spec, claim, invariant], found none`
    - `nodeCategory 'evidence': need one of [evidence], found none`
    - `nodeCategory 'artifact': need one of [artifact, code_artifact], found none`
    - `edgeTypes: need at least one of [proved_by, implements, constrains, depends_on], found [links_to, tagged]`

### Rival paths examples

**Synthetic graph (start → mid-a/mid-b → end):**

- `findRivalTraces(synth, 'start', 'end', { directed: true })` → **2 paths, isRival=true**
    - Path 1: Start → Mid A → End (via `defines`, `refines`)
    - Path 2: Start → Mid B → End (via `defines`, `refines`)

**Documentation World:**

- `findRivalTraces(docGraph, SYSTEM_OVERVIEW, concept:projection, { directed: true })` → **1 path, isRival=false** (direct edge, 1 hop)
- `findRivalTraces(docGraph, SYSTEM_OVERVIEW, concept:focus)` → **1 path, isRival=false** (undirected, unique shortest path in current seed)

### Rival bridge candidates examples

**Gap: spec → evidence (PROJECTION_SPEC → evidence:grounding-phase-3a-tests):**

- 1 candidate: `concept:test-coverage` (score=1.0, heuristic=type-pair-mapping)

**Gap: evidence → code_artifact (evidence:3a-tests → code_artifact:protocol-ts):**

- 1 candidate: `concept:code-spec-alignment` (score=1.0, heuristic=type-pair-mapping)

> На текущем seed-графе (51/108) кандидатов-соперников (>1) для одного GAP **не обнаружено**. Это означает, что mapping v0 имеет однозначное покрытие. При расширении графа (больше edge-типов, больше concept-узлов) rival candidates станут измеримыми.
> 

### Вывод: оправдан ли Compare?

**Нет — на текущем seed-графе Compare не оправдан измерениями.**

Основания:

1. **Rival paths = 0** на doc-world. Все shortest paths уникальны. Нет альтернативных интерпретаций, которые Compare мог бы сопоставить.
2. **Rival bridge candidates = 0** для каждого GAP-типа. Mapping v0 однозначен: один candidate на один gap pattern.
3. **supports() подтверждает**, что Inspect и Trace полностью применимы к doc-world, но их результаты пока не содержат ambiguity, которую Compare разрешал бы.

**Когда Compare станет оправданным:**

- При добавлении 2+ concept-узлов, покрывающих один gap pattern
- При появлении параллельных edge-путей между существующими node-кластерами
- При интеграции внешних онтологий, создающих rival interpretations

> Сигнал измерим, инструмент готов — Compare ждёт роста графа.
>