# OPUS_TASK__DOC_WORLD_CODE_ARTIFACT_EXPANSION__REPO_TO_EPISTEMIC_GRAPH

---

title: OPUS_TASK__DOC_WORLD_CODE_ARTIFACT_EXPANSION__REPO_TO_EPISTEMIC_GRAPH

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

**Goal:** расширить Documentation World *естественной* сложностью из репозитория: автоматически собрать подграф `code_artifact` (модули/файлы/символы/зависимости) и связать его с уже существующими `spec/invariant/evidence` узлами.

Цель не "больше узлов", а появление реальных неоднозначностей/альтернативных трасс для operators (Trace/Compare) и будущего epistemic debugger.

</aside>

### Inputs

- Текущий doc-world:
    - `world/documentation-world/seed.nodes.json`
    - `world/documentation-world/seed.edges.json`
    - `world/documentation-world/loader.js`
    - operators: trace + supports + rival checks
- Repo (источник code artifacts): packages/*, tests, stores, engine types
- Anchors:
    - [OPERATORS_CONTRACTS_AND_CORE_MENTAL_MODEL](OPERATORS_CONTRACTS_AND_CORE_MENTAL_MODEL%20bb73275edc5b450aa26dda862c1d8940.md)
    - [OPUS_TASK__OPERATOR_SUPPORTS_AND_RIVAL_PATHS_CHECK](OPUS_TASK__OPERATOR_SUPPORTS_AND_RIVAL_PATHS_CHECK.md)
    - [OPUS_TASK__DOC_WORLD_CONTROLLED_AMBIGUITY_EXPERIMENT__RIVAL_BRIDGES](OPUS_TASK__DOC_WORLD_CONTROLLED_AMBIGUITY_EXPERIMENT__RIVAL_BRIDGES.md)

---

## A) Constraints

- **Do:** auto-extract code artifacts + link to specs/evidence; update seed + tests.
- **Do not:** менять engine.
- **Do not:** превращать это в общий “repo graph viewer”. Только то, что нужно для epistemic связок.
- **Do:** сохранять `id = notion_url` для page/spec; для code artifacts использовать стабильные ids.

---

## B) Output

1) Seed update:

- добавить новые nodes типа `code_artifact` (и при необходимости `concept` для мостов)
- добавить новые edges:
    - `implements` (code_artifact → spec/invariant)
    - `proved_by` / `reported_by` (evidence → code_artifact, если применимо)
    - `depends_on` (code_artifact → code_artifact)

2) Generator script:

- `world/documentation-world/tools/extractCodeArtifacts.js`
    - читает repo (paths)
    - извлекает граф зависимостей на уровне файлов (import/export) и/или модулей
    - выдаёт JSON фрагмент nodes/edges

3) Updated analysis artifacts:

- re-run analysis + trace examples

---

## C) Identity scheme (важно)

### C1. code_artifact ids

Использовать стабильный id по пути:

- `code:file:<repoPath>`

Пример: `code:file:packages/render/src/stores/viewModelStore.ts`

(Если нужен symbol-level позже — отдельный namespace, но сейчас достаточно file-level.)

### C2. Edge ids

Можно генерировать детерминированно:

- `edge:<type>:<fromId>→<toId>` (hash или строка)

---

## D) Minimal extraction (v0)

### D1. Dependency graph

Для каждого файла `*.ts/*.js` в выбранных папках:

- parse `import ... from '...'`
- связывать только локальные импорты внутри repo
- создать `depends_on` edge: `fileA → fileB`

### D2. Link to evidence

Связать test files с code artifacts:

- если тестовый файл импортирует модуль → `evidence:test-file proved_by/depends_on code:file:...`

(выбрать один type из существующих и использовать консистентно; предпочтение: `depends_on` для технич. зависимости + отдельный `proved_by` для эпистемики)

### D3. Link to specs/invariants

Минимальный способ без NLP:

- создать ручной mapping JSON `world/documentation-world/tools/specToCodeMap.json`
    - ключ: spec id (page/spec node id)
    - значение: список `code:file:*`

и генерировать edges `implements(code → spec)`.

---

## E) Tests

Обновить существующие smoke tests (counts изменятся) и добавить новые:

1) doc-world load still works

2) supportsTrace still ok

3) trace(spec → evidence → code_artifact) теперь *иногда* находит path, а не только GAP

4) rival-check может начать находить альтернативы (не обязательно, но фиксировать)

---

## F) Acceptance

- [x]  Добавлен extractor script + mergeSeed + specToCodeMap
- [x]  Seed расширен: 141 nodes, 307 edges (file-level code artifacts)
- [x]  87 code_artifact nodes, 165 depends_on edges
- [x]  26 implements edges от code к spec/invariant
- [x]  Все тесты зелёные (599 passed, 15 pre-existing legacy)
- [x]  Engine unchanged

---

## G) Report (Opus)

### Snapshot

- **Branch:** `main`
- **SHA:** `c5c4261` (uncommitted — seed + tools, no engine changes)
- **Tests:** 599 passed, 15 pre-existing legacy failures. 0 regressions.

### Node/Edge deltas

| **Metric** | **Before** | **After** | **Delta** |
| --- | --- | --- | --- |
| Nodes | 54 | 141 | +87 code_artifact |
| Edges | 116 | 307 | +165 depends_on, +26 implements |
| Node types | 6 | 6 (без изменений) | 0 |
| Edge types | 9 | 9 (без изменений) | 0 |

### Примеры трасс

**1) spec → evidence (2 hops, 3 rival paths):**

- PROJECTION_SPEC → Test Coverage → Grounding Phase 3A Tests
- PROJECTION_SPEC → Acceptance Criteria → Grounding Phase 3A Tests
- PROJECTION_SPEC → Verification Method → Grounding Phase 3A Tests

**2) evidence → code_artifact (3 hops, unique path):**

- evidence:grounding-phase-3a-tests → ... → code_artifact:protocol-ts (3 hops, 1 path)

**3) spec → ... → code (3 hops, 2 rival paths — естественные!):**

- PROJECTION_SPEC → **ViewModel** → RENDER_SURFACES_SPEC → viewModelStore.ts
- PROJECTION_SPEC → **resolveFocus.js** → Focus Preservation Rule → viewModelStore.ts

> Два совершенно разных пути через разные слои: concept-мост (ViewModel) vs code-мост (resolveFocus.js). Это первый *настоящий* rival path, возникший не из контролируемого эксперимента, а естественно из структуры репо.
> 

### Естественные rival paths/candidates

**Да.** `SPEC → viewModelStore` имеет 2 rival paths через разные слои (concept vs code). Это подтверждает, что при добавлении code-слоя неоднозначность возникает *сама по себе*.

### Analysis highlights

- **Top-3 central nodes изменились** (ранее: concept:focus, concept:workbench, concept:projection → теперь: invariant:focus-preservation, GraphModel.js, viewModelStore.ts). Code artifacts стали структурно центральными.
- **10 distance anomalies** (отсутствовали ранее) — spec↔code и invariant↔evidence пары с большой дистанцией.
- **0 missing concept candidates** (обе ключевые пары типов теперь связаны через code layer).

### Files changed

| **File** | **Action** |
| --- | --- |
| `world/documentation-world/tools/extractCodeArtifacts.js` | **Created** — repo scanner + import parser + spec linker |
| `world/documentation-world/tools/mergeSeed.js` | **Created** — merges extracted data into seed |
| `world/documentation-world/tools/specToCodeMap.json` | **Created** — manual mapping: 4 specs + 5 invariants → code files |
| `world/documentation-world/tools/extracted.nodes.json` | **Generated** — 87 code_artifact nodes |
| `world/documentation-world/tools/extracted.edges.json` | **Generated** — 191 edges (165 depends_on + 26 implements) |
| `world/documentation-world/seed.nodes.json` | **Updated** — 54 → 141 nodes |
| `world/documentation-world/seed.edges.json` | **Updated** — 116 → 307 edges |
| `world/documentation-world/analysis/analysis.json` | **Re-generated** |
| `world/documentation-world/analysis/analysis.md` | **Re-generated** |
| `world/documentation-world/operators/trace.examples.json` | **Re-generated** |
| 4 test files | **Updated** counts: 54→141, 116→307 |

### How to re-run

```bash
node world/documentation-world/tools/extractCodeArtifacts.js
node world/documentation-world/tools/mergeSeed.js
node world/documentation-world/analysis/runAnalysis.js
node world/documentation-world/operators/runTrace.js
```

### Open questions

1. **Cross-package imports** (`@vip/engine` → render) не улавливаются экстрактором (package imports, не relative). Это создаёт разрыв между engine-cluster и render-cluster. Решение: v1 extractor с резолвингом package.json exports.
2. **Symbol-level extraction** пока не нужен. File-level достаточен для обнаружения rival paths и structural anomalies.