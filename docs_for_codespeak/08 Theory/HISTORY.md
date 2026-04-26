# HISTORY

---

title: HISTORY

kind: development

project: Meaning Engine

status: active

source: canonized

---

Хронология архитектурных изменений и закрытий фаз.

Правило: фиксируем только события, которые меняют формулы/инварианты/границы слоёв.

(Исходный подробный лог сохранён в локальных исходниках; сюда переносим канонические вехи.)

### 2026-03-13 — Grounding Phase 3A: Explicit workbench practice identity (SUCCESS)

- Контекст: переход в Phase 3 (practice discovery) после Grounding Phase 2c clean validation.[[1]](FRONTS_AND_PRIORITIES%208c95328e0f5f4210bcb26290b4148023.md)[[2]](WORK_MOMENT_PHASE2C_VERDICT_AND_PHASE3_PRACTICES%204660ff8376964ea9b7dcaa99c755a2cd.md)
- Изменение: введена **явная practice identity** для grounded workbench как world-defined метаданные (`practiceId`) и протащена в render/store и `viewModel.meta.workbenchPracticeId` (read-only).
- Верификация: добавлен новый тестовый файл `groundingPhase3a.test.js` и 8 тестов Phase 3A (declared practice distinction + projection distinction + focus invariants). Результат: 544 passed / 0 failed (24 suites).[[3]](OPUS_TASK__GROUNDING_PHASE3A__EXPLICIT_WORKBENCH_P%2042f4237e5457470a9cebb4c84dfa2ace.md)
- Инварианты: engine pipeline не изменён: `Log → Evaluate → BuildGraph → Projection → ViewModel → Render`.[[4]](../02%20Overview/SYSTEM_OVERVIEW.md)

### 2026-03-13 — Grounding Phase 3B: Workbench switch focus continuity (SUCCESS)

- Решение: при `switch(workbench)` сохраняем focus, если фокусный узел остаётся видимым в новой проекции; иначе делаем fallback на nearest visible ancestor, и если не найден — на `null` как safe fallback.[[1]](OPUS_TASK__GROUNDING_PHASE3B__WORKBENCH_SWITCH_FOC%206eed3dcaafd4437fa690eb41b7781870.md)[[2]](FOCUS_AS_ATOM_OF_ATTENTION%207f6dd6875a7b443db4c20eb8eb782619.md)
- Реализация: `viewModelStore.setWorkbench()` выполняет `reproject()`, строит visibility set из `viewModel.scene.nodes`, затем применяет чистую `resolveFocusContinuity()` и при необходимости обновляет `focusStore`, вызывая повторный `reproject()`.[[1]](OPUS_TASK__GROUNDING_PHASE3B__WORKBENCH_SWITCH_FOC%206eed3dcaafd4437fa690eb41b7781870.md)
- Верификация: добавлен `groundingPhase3b.test.js`, 11 тестов (7 unit + 4 integration). Результат: 573 tests passed (packages). Engine не изменён.[[1]](OPUS_TASK__GROUNDING_PHASE3B__WORKBENCH_SWITCH_FOC%206eed3dcaafd4437fa690eb41b7781870.md)

### 2026-03-13 — Documentation World Seed (SUCCESS)

- Создан seed-граф документации как отдельный world: 51 узел, 108 рёбер, 0 broken refs, 0 isolated nodes, 1 связная компонента.
- Принято правило идентификаторов: `id = notion_url` для page/spec.
- Выделены два слоя связей: concept vs provenance.

### 2026-03-13 — Documentation World Load (SUCCESS)

- Реализация: добавлен `worlds/documentation-world/loader.js`, который читает `seed.nodes.json` + `seed.edges.json`, маппит `title → label` и собирает GraphModel для engine без изменения pipeline.[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_LOAD__LOADER_AND_SMOKE_TESTS.md)
- Верификация: добавлен smoke‑тест загрузки documentation-world (путь в исходных отчётах может быть историческим для monorepo snapshot; в текущем `utemix-org/meaning-engine` тесты и демо привязаны к `src/*`, `operators/*`, `worlds/*`).
    - Load: 51 nodes, 108 edges.
    - Projection: focus=null (full graph), focus=SYSTEM_OVERVIEW, focus=concept:focus.
    - Navigation: select → drillDown → drillUp → reset (OK).
    - Regression: 562 tests passed, 0 failed.[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_LOAD__LOADER_AND_SMOKE_TESTS.md)
- Ограничение: пока не подключено в dev UI как selectable world; только loader + tests.[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_LOAD__LOADER_AND_SMOKE_TESTS.md)

### 2026-03-13 — Documentation World Analysis Operators (SUCCESS)

- Реализация: добавлены analysis operators для doc-world (`runAnalysis.js`) и артефакты результата (`analysis.json`, `analysis.md`) + тест `documentationWorldAnalysis.test.js`.[[2]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_ANALYSIS_OPERATORS__CENTRALITY_BRIDGES_CYCLES_DISTANCE.md)
- Результаты:
    - Centrality: **Focus** — абсолютный центр (max betweenness), **Workbench** — второй центр → подтверждает модель Focus-driven и Workbench-as-operator.[[2]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_ANALYSIS_OPERATORS__CENTRALITY_BRIDGES_CYCLES_DISTANCE.md)
    - Bridges: самый слабый мост **Context ↔ SYSTEM_OVERVIEW** → сигнал укрепить связность между overview и concept-слоем.[[2]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_ANALYSIS_OPERATORS__CENTRALITY_BRIDGES_CYCLES_DISTANCE.md)
    - Cycles: 0 (DAG-подобная структура seed).
    - Missing concept candidates: мосты `spec↔evidence` и `evidence↔code_artifact` (например `test-coverage`, `code-spec-alignment`).
    - Regression: 566 tests passed, 0 failed.[[2]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_ANALYSIS_OPERATORS__CENTRALITY_BRIDGES_CYCLES_DISTANCE.md)
- Интерфейсный вывод (оператор №1): **Inspect** (centrality + neighbors + bridges вокруг focus).

### 2026-03-13 — Documentation World Operator #2: Trace (SUCCESS)

- Реализация: добавлен чистый `trace()` оператор над doc-world (`operators/trace.js` + `worlds/documentation-world/*`) + CLI runner + examples JSON + тесты.[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_OPERATOR_02__TRACE.md)
- Поведение: `trace(from, to)` возвращает либо кратчайший directed path, либо `GAP + candidate bridge` (suggestions-only; без канонизации).[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_OPERATOR_02__TRACE.md)
- Результаты сценариев:
    - `SYSTEM_OVERVIEW → concept:projection` — path найден (defines, 1 hop).
    - `PROJECTION_SPEC → evidence:grounding-phase-3a-tests` — GAP; candidate: `concept:test-coverage`.
    - `evidence:grounding-phase-3a-tests → code_artifact:protocol-ts` — GAP; candidate: `concept:code-spec-alignment`.
    - `concept:context → SYSTEM_OVERVIEW` — GAP из-за DAG-направленности (ребро в обратную сторону); candidate: `concept:context-anchor`.
- Верификация: 6 trace‑тестов, regression зелёный (572 passed, 0 failed). Engine не менялся.[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_OPERATOR_02__TRACE.md)

### 2026-03-14 — Operator supports() + rival paths/bridges check (SUCCESS)

- Реализация: добавлен `operators/supports.js`:
    - `supportsInspect(graph)` / `supportsTrace(graph)` (operator requirements)
    - `findRivalTraces(graph, from, to)` (все кратчайшие пути)
    - `rankBridgeCandidates(gap, graph)` (ранжирование bridge candidates)
- Верификация: добавлен `documentationWorldOperatorSupports.test.js` (8 тестов). Regression: 598 passed.[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__OPERATOR_SUPPORTS_AND_RIVAL_PATHS_CHECK.md)
- Результат: на doc-world (51/108) Compare изначально не оправдан: rival paths = 0, rival bridge candidates = 0.[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__OPERATOR_SUPPORTS_AND_RIVAL_PATHS_CHECK.md)
- Вывод: Compare требует измеримой неоднозначности.

### 2026-03-14 — Controlled ambiguity experiment: rival bridges (SUCCESS)

- Эксперимент: минимально усложнён doc-world вокруг паттерна `spec ↔ evidence`: +3 concept nodes, +8 edges (51/108 → 54/116), без новых типов.[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_CONTROLLED_AMBIGUITY_EXPERIMENT__RIVAL_BRIDGES.md)
- Результат: получена измеримая неоднозначность:
    - `findRivalTraces(spec→evidence)` = 3 rival shortest paths (2 hops)
    - `rankBridgeCandidates(spec→evidence)` = 3 кандидата с равным score
- Критерий оправданности Compare теперь формализован: Compare оправдан, когда `rankBridgeCandidates()` возвращает ≥2 кандидата с равным score или `findRivalTraces()` возвращает ≥2 shortest paths.[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_CONTROLLED_AMBIGUITY_EXPERIMENT__RIVAL_BRIDGES.md)
- Engine unchanged; все тесты зелёные (599 passed).[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_CONTROLLED_AMBIGUITY_EXPERIMENT__RIVAL_BRIDGES.md)

### 2026-03-14 — Documentation World: code_artifact expansion (SUCCESS)

- Реализация: добавлен авто‑extractor code artifacts (file-level) + merge seed; вручную задан `specToCodeMap.json` для implements edges.
- Рост графа: 54/116 → **141/307** (+87 code_artifact, +191 edges: +165 depends_on, +26 implements).
- Результат: получены **естественные rival paths** (не controlled): `PROJECTION_SPEC → viewModelStore.ts` имеет 2 альтернативные цепочки через разные слои (concept-path vs code-path).
- Аналитика: centrality сместилась в сторону code artifacts; появились distance anomalies (10) по spec↔code; missing concept candidates обнулились (теперь мосты проходят через code layer).
- Engine unchanged; tests green (per Opus report).

### 2026-03-14 — Documentation World Operator #3: Compare (SUCCESS)

- Реализация: добавлен `compare()` оператор (diff/contrast, не adjudication) + CLI runner + examples + tests.[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_OPERATOR_03__COMPARE.md)
- Поведение: `compare(G, from, to)` возвращает `PathSummary[]` (fingerprints) + `DiffSummary` (shared/unique/features/humanNotes).
- Верификация: 8 тестов Compare; regression green (per Opus report).[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__DOC_WORLD_OPERATOR_03__COMPARE.md)
- Реальный кейс (emergent): `PROJECTION_SPEC → viewModelStore.ts` даёт 2 rival shortest paths:
    - concept-heavy chain: `SPEC → ViewModel → RENDER_SURFACES_SPEC → viewModelStore.ts`
    - code/invariant-heavy chain: `SPEC → resolveFocus.js → invariant:focus-preservation → viewModelStore.ts`
- Каноническая граница сохранена: Compare(v0)=diff, не выбирает "истину" и не пишет в governance.

### 2026-03-14 — Compare v0.1: clustering + labels (SUCCESS)

- Реализация: добавлен `clusterRivalPaths()` (deterministic) + fingerprint key + derived labels; CompareResult расширен backward-compatible (`clusters`, `clusterCount`).[[1]](../12%20Opus%20Value%20Core/OPUS_TASK__COMPARE_V0_1__CLUSTER_AND_LABEL_RIVAL_PATHS.md)
- Результат (real cases):
    - `KNOWLEDGE_LOG_SPEC → projection/index.js`: 53 paths → 3 clusters (~18×)
    - `PROJECTION_SPEC → evaluate.test.js`: 35 paths → 3 clusters (~12×)
    - synthetic stress: 11 paths → 3 clusters
- Каноническая граница сохранена: compression без ranking/adjudication.

### 2026-03-14 — Validate Compare v0.1 on 20 emergent cases (SUCCESS)

- Валидация: прогнано 20 кейсов из 312 (spec|invariant → code_artifact), с покрытием разных подсетей и диапазоном paths 2–54.[[1]] *(задача OPUS_TASK__VALIDATE_COMPARE_V0_1__ON_20_EMERGENT_CASES не включена в docs_for_codespeak)*
- Результаты:
    - clusterCount distribution: min=1, median=2, max=4; ≤3 clusters в 95% кейсов.
    - 3-cluster паттерн не универсален (4/20), но устойчив как baseline для cross-domain пар.
    - entropy рассчитана на уровне отчёта (mean ~0.976 bits для multi-cluster кейсов; max ~1.485).
- Вывод: fingerprint v0.1 достаточен; v0.1.1 refinement не требуется на текущем этапе.[[1]] *(задача OPUS_TASK__VALIDATE_COMPARE_V0_1__ON_20_EMERGENT_CASES не включена в docs_for_codespeak)*

### 2026-03-15 — Repository migration: meaning-engine showcase refresh (SUCCESS)

- Репозиторий: [https://github.com/utemix-org/meaning-engine](https://github.com/utemix-org/meaning-engine)
- Событие: устаревший snapshot движка заменён актуальным engine; витрина приведена к структуре `src + operators + worlds (+ root docs)`.
- Изменения:
    - Добавлены operators: Trace, Compare, Supports (в `operators/`).
    - Добавлены reference worlds: Documentation World + test-world (в `worlds/`).
    - `package.json`: `private: true`, npm‑ориентированная подача убрана, demo‑скрипты добавлены.
    - Root docs: README (English, problem → idea → demo), ARCHITECTURE, EPISTEMIC_LOG.
    - LICENSE (MIT) и CI workflow сохранены.
- Верификация: 25 suites / 555 tests passed (green).
- Коммиты: 3 structured commits (engine import → operators/worlds → docs).

### 2026-03-16 — v0.1 research release published (SUCCESS)

- Tags: `v0.1.0`, `v0.1.1`.
- GitHub Release: [https://github.com/utemix-org/meaning-engine/releases/tag/v0.1.0](https://github.com/utemix-org/meaning-engine/releases/tag/v0.1.0)
- npm: `meaning-engine@0.1.1` опубликован как `latest` (v0.1.0 в npm был занят старым snapshot).
- Entrypoints (quickstart):
    - `node operators/runReasoningReport.js --baseline`
    - `node operators/runDualWorldSmokeWorkflow.js`
    - `node operators/runWorldSmokeWorkflow.js ./path/to/world`
- Смысл: зафиксирован воспроизводимый research snapshot "First Architectural Cycle" (baseline artifacts + tests), без претензии на production platform.
- Evidence: [OWNER_RELEASE_STEPS__V0_1_0__TAG_GITHUB_RELEASE_NPM](OWNER_RELEASE_STEPS__V0_1_0__TAG_GITHUB_RELEASE_NP%20df57b56e77fb409698e88e82dd3f8679.md) (owner release steps + report).