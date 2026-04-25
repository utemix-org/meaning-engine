# ARCHITECTURE

---

title: ARCHITECTURE

kind: architecture

project: Meaning Engine

status: active

scope: v1

maturity: canon

---

## Ссылки

- См. [SYSTEM_OVERVIEW](../02%20Overview/SYSTEM_OVERVIEW.md) (overview)
- См. [FORMAL_CORE](FORMAL_CORE%204aed885f3386419bb2c46172c92b17d8.md) (formal core)
- См. [INVARIANTS](./INVARIANTS.md) (invariants)
- См. [PROJECTION_SPEC](../04%20Specs/PROJECTION_SPEC.md) и [NAVIGATION_SPEC](../04%20Specs/NAVIGATION_SPEC.md) (specs)
- См. [AXIOMS](./AXIOMS.md) (axioms)

## Формулы (трезво)

Инженерная часть (pipeline):

- `G = BuildGraph(Evaluate(Log))`
- `V = P(G, F, C, S, Pr)`
- `UI = R(V)`

Удобное чтение: `VisibleReality = P(G, F, C, S, Pr)` и `UI = R(VisibleReality)`.

Полная запись:

`UI = R( P( BuildGraph( Evaluate(Log) ), F, C, S, Pr ) )`

## Раскладка

- `Log` — эпистемическая история (append-only)
- `Evaluate(Log)` -> `Statements(t)`
- `BuildGraph(Statements)` -> `G(t)` (граф вычисляется)
- `P(G,F,C,S,Pr)` -> `V` (проекция, чистая)
- `R(V)` -> UI (рендерер без семантики)

## Законы (коротко)

1. Знание первично, граф производен.
2. Проекция чистая и детерминированная.
3. Навигация — детерминированная алгебра переходов `F' = T(F, a, G)`.
4. Контекст управляет наблюдением, а не изменяет граф: `C = {domain?, workbench?, character?}`.
5. Эволюция знания идёт через эпистемические действия и log.
6. Независимость слоёв: Ontology -> Knowledge -> Engine -> World -> Renderer -> (Service).

## Границы слоёв (правило маршрутизации)

- Закон для любого графа -> engine/core.
- Доменные типы/словарь -> ontology.
- Как этот мир переживается -> authored world.
- Как показываем вычисленное -> renderer.
- Пользователи/доверие/экономика -> service.

## Возможная путаница: «всё — граф» vs «источник истины — log»

Эти тезисы совместимы, если различать:

- Графовую форму представления (все сущности мира выражаются узлами/связями).
- Источник истины для эволюции знания (что считается изменяемым знанием проходит через Log/Evaluate).

То есть: всё может жить в графе, но не всё обязано быть event-sourced через Log (seed/конфиг мира может быть статическим вводом).