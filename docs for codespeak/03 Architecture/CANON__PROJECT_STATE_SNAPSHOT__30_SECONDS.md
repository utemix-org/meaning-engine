# CANON__PROJECT_STATE_SNAPSHOT__30_SECONDS

---

title: PROJECT_STATE_SNAPSHOT__30_SECONDS

kind: architecture

project: Meaning Engine

status: active

scope: now

maturity: draft

source: keeper

---

<aside>
⚡

**Purpose:** быстрый вход в проект за 30 секунд для нового чата/участника. Это не заменяет SYSTEM_OVERVIEW; это “где мы сейчас и что доказано”.

</aside>

## 1) One-line

Meaning Engine = log-first knowledge substrate + focus-driven projection/navigation + operator layer над мирами.

---

## 2) Canonical core (не ломать)

- Источник истины: **Knowledge Log**.
- Граф: вычисляемая структура: `G = BuildGraph(Evaluate(Log))`.
- Наблюдение: `VM = P(G, F, C)`.
- Навигация: `F' = T(F, a, G)`.
- Граница: `Operator ≠ Epistemic action` (canonization живёт в governance).

---

## 3) Reference world: Documentation World

- Документация → JSON seed → loader → standard engine.
- Используется как calibration dataset для operators и тестов.

Текущее состояние seed:

- 54 nodes / 116 edges (после controlled ambiguity experiment для spec↔evidence).

---

## 4) Operators (с измеримыми критериями)

### Operator #1: Inspect (confirmed)

- Смысл: локальная структура узла (neighbors/локальные сигналы).

### Operator #2: Trace (confirmed)

- `trace(from, to) → path | GAP + candidate bridge` (suggestions-only).

### Operator supports + ambiguity (confirmed)

- `supportsInspect/Trace(graph)` + missing checklist.
- `findRivalTraces(from, to)` (все shortest paths).
- `rankBridgeCandidates(gap)`.

### Compare (next, now justified)

Compare оправдан, когда:

- `rankBridgeCandidates()` возвращает ≥2 кандидата с равным score, или
- `findRivalTraces()` возвращает ≥2 shortest paths.

---

## 5) What’s happening right now (why this step)

Compare перешёл из режима "2 rival paths" в режим **комбинаторики** (22–53 rival shortest paths в emergent cases из-за code dependency graph). Compare(v0.1) уже добавил compression (clustering + labels) без ranking/governance.

Текущий фокус — проверить, что 3 archetypes это свойство графа, а не грубость fingerprint: прогнать clustering на 10–20 кейсах из каталога.

## 6) Current next technical step

- Validate Compare(v0.1) on 10–20 emergent cases (стабильность archetypes; проверка fingerprint coarse-graining).
- (параллельно) `OPUS_TASK__DOC_WORLD_CODE_ARTIFACT_EXPANSION__REPO_TO_EPISTEMIC_GRAPH`: расширение doc-world реальными code artifacts/deps + links к specs/evidence (если продолжится).

---

## 7) Fast links

- SYSTEM_OVERVIEW: [SYSTEM_OVERVIEW](../02%20Overview/SYSTEM_OVERVIEW.md)
- HISTORY: [HISTORY](../09%20Development/HISTORY.md)
- Operator boundary: [CARD__OPERATOR_VS_EPISTEMIC_ACTION](CARD__OPERATOR_VS_EPISTEMIC_ACTION%2011a243b3e50d40418b69208a318a3b5b.md)
- Mental model + contracts: [OPERATORS_CONTRACTS_AND_CORE_MENTAL_MODEL](OPERATORS_CONTRACTS_AND_CORE_MENTAL_MODEL%20bb73275edc5b450aa26dda862c1d8940.md)
- Formula card: [CARD__FORMULA_CARD__OPERATORS_AND_CANONICALIZATION](CARD__FORMULA_CARD__OPERATORS_AND_CANONICALIZATION%20406c691b789642ea9b4421a562b061d9.md)
- Kernel boundary checklist: [KERNEL_BOUNDARY__WHAT_GOES_IN_AND_WHAT_DOESNT](KERNEL_BOUNDARY__WHAT_GOES_IN_AND_WHAT_DOESNT%20742c17176b60461a9742a4beaadbedaf.md)