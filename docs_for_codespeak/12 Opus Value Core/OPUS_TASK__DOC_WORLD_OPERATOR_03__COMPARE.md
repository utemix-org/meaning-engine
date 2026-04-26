# OPUS_TASK__DOC_WORLD_OPERATOR_03__COMPARE

---

title: OPUS_TASK__DOC_WORLD_OPERATOR_03__COMPARE

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

**Goal:** реализовать Operator #3 **Compare** для Documentation World (без UI, без изменений engine), который сравнивает альтернативные объяснительные цепочки (rival traces / rival bridges) и возвращает *diff/contrast* (compute), не выполняя канонизацию.

</aside>

### Preconditions (gate — уже выполнено)

Compare оправдан, когда:

- `findRivalTraces(from,to)` возвращает ≥2 shortest paths, или
- `rankBridgeCandidates(gap)` возвращает ≥2 кандидата с равным score.

Док‑мир сейчас уже даёт **естественный** rival case: `PROJECTION_SPEC → viewModelStore.ts` (2 rival paths).[[1]](../08%20Theory/HISTORY.md)

---

## A) Constraints

- **Do:** operator-layer compute + tests + output artifacts.
- **Do not:** менять engine pipeline.
- **Do not:** добавлять UI.
- **Do not:** выполнять canonicalization / писать в governance.
- **Do:** быть детерминированным (same inputs → same output).

---

## B) Inputs

- doc-world seed/loader + expanded code artifacts:
 - `world/documentation-world/seed.nodes.json`
 - `world/documentation-world/seed.edges.json`
 - `world/documentation-world/loader.js`
- existing operators:
 - `trace`
 - `supports.js` (`findRivalTraces`, `rankBridgeCandidates`)

Anchor docs:

- CARD__OPERATOR_VS_EPISTEMIC_ACTION
- OPERATORS_CONTRACTS_AND_CORE_MENTAL_MODEL
- REASONING_PRESSURE_MAP__OPERATORS_AS_RESPONSE_TO_TENSION

---

## C) Operator definition

### C1. API (минимум)

`compare(graph, fromId, toId, options?) → CompareResult`

Где CompareResult, минимум:

- `ok: true`
- `fromId`, `toId`
- `paths: Array<PathSummary>` (2+)
- `diff: DiffSummary`

Если нет rival paths/candidates:

- `ok: false`, `reason: 'no_rivals'`, `paths: []`, `note:...`

### C2. Что сравниваем (v0 — diff, не adjudication)

Compare(v0) **не выбирает “лучший”**, а объясняет различия.

Минимальные фичи PathSummary:

- `hops`
- `nodeTypeHistogram`
- `edgeTypeHistogram`
- `conceptVsProvenanceEdgeCounts`
- `hasInvariant: boolean`
- `codeArtifactCount`
- `evidenceCount`
- `implementsCount`

DiffSummary (v0):

- `sharedNodes`, `uniqueNodesByPath`
- `sharedEdgeTypes`, `uniqueEdgeTypesByPath`
- `featureDeltaByPath` (например codeArtifactCount, evidenceCount)
- `humanNotes[]` (1–5 коротких строк)

---

## D) Required scenario (acceptance)

### D1. One real emergent case

Сделать compare на кейсе:

- `from = PROJECTION_SPEC`
- `to = code:file:...viewModelStore.ts` (точный id из seed)

Ожидаемо:

- `paths.length >= 2`
- diff показывает различие “concept-heavy vs code-heavy chain”

### D2. One synthetic case

В тесте создать небольшой граф с 2 альтернативными shortest paths и проверить diff.

### D3. Rival bridge compare (optional v0)

Если удобнее, можно оставить compare только для paths (trace results).

Bridge compare — отдельным расширением v0.1.

---

## E) Implementation

- `world/documentation-world/operators/compare.js`
- `world/documentation-world/operators/runCompare.js` (CLI)
- `world/documentation-world/operators/compare.examples.json`

---

## F) Tests

Добавить тесты, например:

- `packages/render/src/__tests__/documentationWorldCompare.test.js`

Минимум 8 тестов:

1) returns no_rivals when unique shortest path

2) returns 2+ paths when rivals exist (synthetic)

3) deterministic output

4) path summary histograms stable

5) diff shared/unique nodes computed correctly (synthetic)

6) doc-world case returns 2+ paths

7) doc-world diff contains expected feature deltas (codeArtifactCount differs)

8) regression green

---

## G) Report (Opus)

### Snapshot

- **Branch:** `main`
- **SHA:** `c5c4261` (uncommitted — operator layer only, no engine changes)
- **Tests:** 607 passed (+8 new), 15 pre-existing legacy failures. 0 regressions.

### Files changed

| **File** | **Action** |
| --- | --- |
| `world/documentation-world/operators/compare.js` | **Created** — compare, PathSummary, DiffSummary, humanNotes |
| `world/documentation-world/operators/runCompare.js` | **Created** — CLI runner, 3 scenarios |
| `world/documentation-world/operators/compare.examples.json` | **Generated** — 3 compare results |
| `packages/render/src/__tests__/documentationWorldCompare.test.js` | **Created** — 8 tests |

### Compare output: synthetic case

```
A(spec) → B1(concept) → C(evidence) vs A(spec) → B2(code_artifact) → C(evidence)
```

- 2 rival paths, 2 hops
- diff: shared [A, C], unique [B1] vs [B2]
- Path 1: concept-layer (defines + applies_to), Path 2: provenance-layer (implements + proved_by)
- humanNotes: "2 rival paths with 2 shared nodes."

### Compare output: doc-world case (SPEC → viewModelStore)

**Path 1 (concept-heavy):**

`PROJECTION_SPEC → ViewModel → RENDER_SURFACES_SPEC → viewModelStore.ts`

- code=1, invariant=✗, concept edges=2, provenance edges=1

**Path 2 (code-heavy):**

`PROJECTION_SPEC → resolveFocus.js → Focus Preservation Rule → viewModelStore.ts`

- code=2, invariant=✓, concept edges=0, provenance edges=3

**Diff:**

- shared nodes: 2 (PROJECTION_SPEC, viewModelStore.ts)
- Path 1 unique: concept:view-model, RENDER_SURFACES_SPEC
- Path 2 unique: resolveFocus.js, invariant:focus-preservation
- humanNotes:
 1. 2 rival paths with 2 shared nodes.
 2. Path 2 is code-heavy (2 code artifacts).
 3. Path 1 is concept-heavy (2 concept edges).
 4. Only path(s) 2 pass through an invariant node.

### Вывод

**Compare(v0) остаётся compute (diff), без выбора канона.**

Оператор объясняет различия, но не выбирает. Факты:

1. **concept vs code**: два пути проходят через разные слои графа — concept-layer vs provenance/code-layer.
2. **invariant signal**: только code-heavy path проходит через invariant node. Это может быть сигналом для будущего ranking/adjudication.
3. **Следующий шаг (v0.1)**: добавить ranking heuristic (например: путь через invariant имеет больший эпистемический вес). Но это уже не compute, а policy — требует отдельного решения.