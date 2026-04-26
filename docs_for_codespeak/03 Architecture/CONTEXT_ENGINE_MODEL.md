# CONTEXT_ENGINE_MODEL

---

title: CONTEXT_ENGINE_MODEL

kind: architecture

project: Meaning Engine

status: active

scope: v1

maturity: draft

source: repo-ingest (vovaipetrova/docs/architecture)

---

Канонизированная выжимка repo-документа (Phase 4 model). Полный текст — в репо.

## Master formula (read-only graph phase)

`UI = R(P(G*, F, C))`, где `G* = Assemble(O, W, M)` и `C={domain?, workbench?, character?}`.

## 5 proven laws (Phase 4)

1) Static: `V = P(G,F)`

2) Dynamic: `F' = T(F,a,G)`

3) Semantic: `V = P(G,F,D)`

4) Composite: `V = P_wb(G,F,Wb) = ⋃ DM(G, D_i)`

5) Context organizer: Character задаёт меню доступных workbench и делегирует фильтрацию выбранному workbench.

## Surface (концепт)

Repo вводит понятие Surface как тип наблюдения: `V = P(G,F,C,S)` с `S ∈ {Scope, Story, System, Service}`.

Статус: концепт, не обязательный для текущих engine-контрактов.

## Axis decomposition

Repo фиксирует ортогональные оси: Focus × Context × Surface × (Practice future).

## Важное отличие от Notion-канона

- Notion-канон включает Log/Evaluate как источник истины для knowledge; repo-док описывает Phase 4 read-only граф.
- Эти слои совместимы при различении: "как граф собирается" vs "как наблюдается".