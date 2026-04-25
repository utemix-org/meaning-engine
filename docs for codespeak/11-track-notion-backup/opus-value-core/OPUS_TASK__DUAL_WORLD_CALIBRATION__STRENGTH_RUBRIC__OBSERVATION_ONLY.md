# OPUS_TASK__DUAL_WORLD_CALIBRATION__STRENGTH_RUBRIC__OBSERVATION_ONLY

---

title: OPUS_TASK__DUAL_WORLD_CALIBRATION__STRENGTH_RUBRIC__OBSERVATION_ONLY

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: keeper

---

## 1) Context (зачем сейчас)

У нас зафиксирован dual-world reasoning baseline:

- runner: `operators/runDualWorldSmokeWorkflow.js`
- baseline artifact: `operators/dualWorldSmoke.baseline.json`
- 8/8 сценариев ok=true на двух мирах (extracted + authored)

Следующий шаг — не добавлять новые операторы и не вводить алгоритм ранжирования, а сделать **наблюдательную strength rubric** поверх уже калиброванного поведения.

Цель: научиться различать "формально сильные" vs "структурно случайные" explanatory routes, не формализуя это в код.

## 2) Тип задачи

Observation-only + допускается минимальное улучшение отчётности runner (например печать метаданных маршрута), но без изменения алгоритмов operators.

## 3) Scope (что можно трогать)

Разрешено:

- Notion closeout (основной deliverable)
- (опционально) добавить небольшой вывод/экспорт из runner (без изменения логики operators), если иначе трудно повторять rubric

Запрещено:

- новые операторы
- изменение Compare/Trace/BridgeCandidates
- изменение seed/онтологии миров
- автоматический scoring/ranking алгоритм

## 4) Deliverables

### D0. GitHub traceability

Если в репо **нет изменений**, GitHub не требуется.

Если добавляется хоть минимальная правка runner/fixtures/tests — тогда PR или commit+push обязателен.

Язык:

- Notion — русский
- commit/PR — английский

### D1. Strength rubric (RU)

Сформулировать простую rubric (не алгоритм) для интерпретации 8 baseline scenarios.

Rubric должна быть:

- короткой (≤ 10 строк)
- объяснимой
- привязанной к наблюдаемым признакам в путях (например invariant-passing, concept-mediated, code-dependency, workaround)

Пример допустимых labels (можно переименовать):

- stronger: invariant-passing / constraint-preserving
- medium: concept-mediated
- weaker: code-dependency-only
- weaker: workaround / peripheral wiring (barrel noise)

### D2. Rubric application to baseline (RU)

Для каждого мира и каждого сценария (8 строк):

- World
- Scenario
- Observed route type (из архетипов A/B/C если применимо)
- Strength label
- Reason (1 строка)

Обязательная оговорка:

stable observation, not formal ranking logic

### D3. Summary

2–4 вывода:

- какие типы путей регулярно оказываются сильнее/слабее
- что НЕ следует формализовывать пока

## 5) Acceptance criteria

- rubric сформулирована
- rubric применена к 8 baseline сценариям (оба мира)
- нет изменений operator algorithms и онтологии
- если были изменения в репо — есть GitHub след + тесты зелёные

## 6) Architectural note

Exploration ≠ Acceptance.

Rubric — это интерпретация compute artifacts человеком, не часть kernel и не новый оператор.

---

## 7) Opus Report (fill here)

### A) Task type

- observation-only (без изменений в репо)

### B) GitHub traceability

- Изменений нет. GitHub не требуется.

### C) Strength Rubric (RU)

Критерии интерпретации силы explanatory route (наблюдательная шкала, не алгоритм):

| Label | Признак | Почему сильнее/слабее |
| --- | --- | --- |
| **strongest** | invariant-passing | Путь проходит через доказанный engine law (invariant node). Это объяснение, подкреплённое формальным ограничением. |
| **strong** | полная эпистемическая цепочка | Путь пересекает несколько эпистемических слоёв (spec→concept→invariant→evidence) с типизированными рёбрами (defines, constrains, proved_by). |
| **medium** | concept-mediated | Путь идёт через concept/spec узлы, выражая архитектурное наследие. Не случайный, но без формального ограничения. |
| **medium** | implements-edge | Однорёберная связь через `implements`. Чистая структурная зависимость, но тонкая (без промежуточных концепций). |
| **weaker** | code-dependency | Путь из чистых code_artifact узлов (import/depends_on). Структурно случайный — он существует, потому что тест-файлы импортируют оба модуля, не потому что есть архитектурный смысл. |
| **weakest** | heuristic-only | Кандидат предложен type-pair эвристикой, нет структурного подтверждения в графе. Это гипотеза, а не объяснение. |

stable observation, not formal ranking logic

### D) Baseline strength table (RU)

**Doc-world (116/292):**

| # | Сценарий | Маршрут | Archetype | Strength | Почему |
| --- | --- | --- | --- | --- | --- |
| 1 | Path exists | SYSTEM_OVERVIEW → concept:projection (1 hop, defines) | — | **medium** | concept-mediated: одно ребро defines, прямое концептуальное определение |
| 2 | Directed boundary | AT → NAV_SPEC (1 hop, implements) | — | **medium** | implements-edge: чистая структурная зависимость, дирекциональность выражает ответственность |
| 3 | Rival explanations | 13 rivals PROJECTION_SPEC → evaluate.js | A + C | **mixed**: 1 path **strongest** (invariant-passing через Canonical-Only Graph Build), 2 path **medium** (concept-mediated через GraphModel/L0), 10 paths **weaker** (code-dependency через test-файлы) | Среди 13 маршрутов ровно 1 проходит через invariant — он формально сильнее остальных. 10 code-dependency путей — шум импорт-графа. |
| 4 | GAP + bridge | EV3A → validate.js, 1 candidate | — | **weakest** | heuristic-only: кандидат `concept:code-spec-alignment` предложен type-pair эвристикой, нет пути в графе |

**Authored-mini-world (25/27):**

| # | Сценарий | Маршрут | Archetype | Strength | Почему |
| --- | --- | --- | --- | --- | --- |
| 1 | Path exists | TTO → Type Safety → Progress & Preservation → Coq Proof (3 hops: defines→constrains→proved_by) | — | **strong** | полная эпистемическая цепочка: spec→concept→invariant→evidence с 3 типизированными рёбрами. Каждый шаг сменяет эпистемический слой. |
| 2 | Directed boundary | typeChecker → TTO (1 hop, implements) | — | **medium** | implements-edge: аналогично doc-world, код знает о спеке, но не наоборот |
| 3 | Rival explanations | 2 rivals TTO → inferenceEngine | A | **mixed**: 1 path **medium** (concept-mediated: TTO→Polymorphism→HM→inferenceEngine), 1 path **weaker** (code-dependency: TTO→typeChecker→test→inferenceEngine) | Archetype A воспроизводится: концептуальный путь сильнее кодового |
| 4 | GAP + bridge | TTO → rust-borrow, 3 candidates | — | **weakest** | heuristic-only: 3 кандидата из type-pair mapping (spec→evidence), нет пути в графе |

stable observation, not formal ranking logic

### E) Summary conclusions (RU)

1. **Invariant-passing пути регулярно оказываются сильнее всех остальных.** В doc-world среди 13 rivals ровно 1 проходит через invariant (Canonical-Only Graph Build). В authored-world invariant входит в единственный путь S1 (Progress & Preservation). Это устойчивый паттерн на обоих мирах.
2. **Code-dependency пути регулярно оказываются слабее.** Они существуют лишь потому, что тест-файлы импортируют оба модуля, а не потому что есть архитектурный смысл. Это подтверждается на обоих мирах (10/13 в doc-world, 1/2 в authored-world).
3. **Heuristic-only bridge candidates — самый слабый тип «объяснения».** Это гипотезы, не маршруты. Но именно они указывают на места, где граф неполон, и это ценно.
4. **Что НЕ следует формализовать пока:** автоматический скоринг путей не оправдан. Рубрика работает как интерпретационная линза для человека, но вводить её в код преждевременно — слишком мало миров для калибровки весов.

### F) Non-goals check (RU)

- Operators unchanged: ✅ да
- Seeds/ontology unchanged: ✅ да
- No scoring algorithm introduced: ✅ да (рубрика — это человеческая интерпретация, не код)

### G) Result Type + Architectural Status (RU)

- Result Type: observation-only (только Notion)
- Architectural Status:
    - Validated: **6-уровневая strength rubric** стабильно применяется ко всем 8 baseline сценариям на двух мирах. Invariant-passing всегда сильнее, code-dependency всегда слабее. Паттерн воспроизводим.
    - Not validated: пригодность рубрики для автоматического скоринга (не достаточно данных для калибровки весов)
    - Contamination/notes: exploration ≠ acceptance. Рубрика — интерпретация человеком, не часть kernel.