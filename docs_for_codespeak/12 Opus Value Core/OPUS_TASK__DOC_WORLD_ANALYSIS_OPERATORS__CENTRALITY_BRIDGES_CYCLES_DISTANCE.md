# OPUS_TASK__DOC_WORLD_ANALYSIS_OPERATORS__CENTRALITY_BRIDGES_CYCLES_DISTANCE

---

title: OPUS_TASK__DOC_WORLD_ANALYSIS_OPERATORS__CENTRALITY_BRIDGES_CYCLES_DISTANCE

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

**Goal:** добавить минимальные **analysis operators** для Documentation World (без UI), чтобы получать измеримые сигналы:

- central nodes
- weak bridges / islands
- cycles as abstraction hints
- distance anomalies / missing concept candidates
</aside>

### Почему это следующий шаг

Мы уже доказали:

- documentation world seed существует (JSON)
- loader + smoke (load/projection/navigation) проходят на стандартном engine

Теперь нужен слой *операторов наблюдения* над doc-graph, чтобы понять, **какой интерфейс требует система**, не уходя в UI.

---

## A) Inputs

Repo:

- `world/documentation-world/seed.nodes.json`
- `world/documentation-world/seed.edges.json`
- `world/documentation-world/loader.js`

Notion anchors:

- [HISTORY](../09%20Development/HISTORY.md)
- [OPUS_TASK__DOCUMENTATION_WORLD_SEED__NOTION_TO_JSON_GRAPH](OPUS_TASK__DOCUMENTATION_WORLD_SEED__NOTION_TO_JSON_GRAPH.md)
- [OPUS_TASK__DOC_WORLD_LOAD__LOADER_AND_SMOKE_TESTS](OPUS_TASK__DOC_WORLD_LOAD__LOADER_AND_SMOKE_TESTS.md)

---

## B) Constraints

- **Do:** analysis scripts + tests + output artifacts.
- **Do not:** менять engine pipeline, добавлять UI, менять seed структуру.

---

## C) Output artifacts (в repo)

Создать папку:

- `world/documentation-world/analysis/`

Файлы:

1) `analysis.json` (машинно-читаемо)

2) `analysis.md` (короткий человеко-читаемый отчёт)

3) `runAnalysis.js` (или `analysis.js`) — исполняемый скрипт

---

## D) Operators (минимальный набор)

### D1. Centrality (оси)

- Посчитать degree centrality (in+out) по edges.
- (Опционально) betweenness или pagerank, если несложно.
- Output: top-10 nodes с `id`, `type`, `title`, `score`, `topEdges`.

### D2. Weak bridges / острова

- Поскольку граф связный, ищем **слабые мосты**:
    - edge betweenness (если есть)
    - или эвристика: edges, соединяющие два кластера типов (например spec↔code_artifact) с редкой связностью.
- Output: top-10 bridge edges + какие подграфы они соединяют.

### D3. Cycles

- Найти простые циклы длины 3–6 (или SCC > 1) и вывести как кандидаты на абстракцию/слияние.
- Output: список циклов с узлами и типами рёбер.

### D4. Distance anomalies / missing concept candidates

- Посчитать shortest paths между:
    - `spec` ↔ `code_artifact`
    - `invariant` ↔ `evidence`
    - `decision` ↔ `spec`
- Если путь длиннее порога (например > 4), записать anomaly.
- Missing concept candidate: если есть много путей между двумя кластерами через разные "случайные" nodes, предложить candidate bridge concept (как *suggestion*, не канон).
- Output: 10 anomalies + 3–5 missing concept candidates.

---

## E) Tests

Добавить тест-файл, например:

- `packages/render/src/__tests__/documentationWorldAnalysis.test.js`

Минимум 4 теста:

1) analysis script runs and outputs valid JSON

2) `analysis.json` содержит разделы: centrality, bridges, cycles, anomalies

3) output устойчив по seed (не зависит от порядка чтения)

4) no crash on current seed (51/108)

---

## F) Acceptance

- [x]  В repo есть `world/documentation-world/analysis/analysis.json` и `analysis.md`
- [x]  Скрипт: `node world/documentation-world/analysis/runAnalysis.js`
- [x]  Тесты анализа зелёные (4/4)
- [x]  Никаких изменений engine

---

## G) Report (Opus)

### Snapshot

- Branch: `main` (ahead 13)
- Tests: **566 passed** (27 files), 0 failed — includes 4 new analysis tests + 7 doc-world load tests
- Date: 2026-03-13

### Files changed

| File | Action |
| --- | --- |
| `world/documentation-world/analysis/runAnalysis.js` | **created** — analysis script (4 operators) |
| `world/documentation-world/analysis/analysis.json` | **generated** — machine-readable output |
| `world/documentation-world/analysis/analysis.md` | **generated** — human-readable report |
| `packages/render/src/__tests__/documentationWorldAnalysis.test.js` | **created** — 4 smoke tests |

### Graph: 51 nodes, 108 edges (confirmed)

### Top-10 Central Nodes

| # | Title | Type | Degree | Betweenness | Score |
| --- | --- | --- | --- | --- | --- |
| 1 | Focus | concept | 10 | 311.66 | 321.7 |
| 2 | Workbench | concept | 12 | 280.86 | 292.9 |
| 3 | Focus Preservation Rule | invariant | 5 | 175.82 | 180.8 |
| 4 | Context | concept | 7 | 173.14 | 180.1 |
| 5 | Projection | concept | 10 | 165.34 | 175.3 |
| 6 | SYSTEM_OVERVIEW | page | 8 | 160.45 | 168.5 |
| 7 | INVARIANTS | page | 7 | 136.41 | 143.4 |
| 8 | Focus Continuity | concept | 4 | 103.02 | 107.0 |
| 9 | WorkbenchPolicy | concept | 5 | 90.09 | 95.1 |
| 10 | GraphModel | concept | 9 | 68.79 | 77.8 |

### 3 наиболее интересных наблюдения

**1. Focus — абсолютный центр графа.** `concept:focus` имеет максимальную betweenness (311.66) — почти все кратчайшие пути проходят через него. Это подтверждает архитектурную роль Focus как "атома внимания".

**2. Weak bridge: Context↔SYSTEM_OVERVIEW** (betweenness 117.75) — это самое уязвимое ребро; его удаление максимально увеличивает среднее расстояние между узлами. Сигнал: SYSTEM_OVERVIEW нуждается в дополнительных прямых связях с concept-слоем.

**3. Missing concept candidates:** `spec↔evidence` и `evidence↔code_artifact` не связаны напрямую и не имеют concept-мостов. Это значит, что тесты (evidence) и код (code_artifact) пока не связаны со спецификациями на уровне графа. Кандидаты на мостовой concept: `concept:test-coverage` или `concept:code-spec-alignment`.

### Cycles

0 циклов длины 3–6 в directed графе. Это ожидаемо: seed-граф имеет DAG-подобную структуру (pages/specs → concepts → invariants/evidence, обратных рёбер нет).

### Distance anomalies

0 аномалий. Все пары spec↔code_artifact и invariant↔evidence достижимы в пределах threshold=4 шагов.

### Recommendation

**Inspect** — первый интерфейсный оператор, который нужен: показать centrality + neighbors + bridges для фокусного узла, чтобы пользователь видел структурную роль узла в графе.