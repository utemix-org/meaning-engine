# PROJECTION_SPEC

---

title: PROJECTION_SPEC

kind: spec

project: Meaning Engine

status: active

scope: v1

maturity: implemented

---

## Назначение

Проекция строит `ViewModel` из `(Graph, Focus, Schema, Params)`.

## Сигнатура

`projectGraph(graph, focus, schema, params) -> { ok, viewModel } | { ok, errors }`

## Входы (минимум)

- `Graph`: nodes/edges + индекс по id
- `Focus`: `nodeId|null`, `path[]`
- `Schema`: допустимые типы
- `Params`: как минимум `depth`, `visibilityMode`

## Visual rules (граница Engine↔Render)

Отдельный вход (из schema/type-system), который задаёт визуальные спецификации типов:

- `VisualRules = Map<TypeID, VisualSpec>`

Принцип: VisualRules не является частью графа и не изменяет смысл; это отображение типов в визуальные свойства.

## Выход

`ViewModel = { scene, panels, navigation, meta }`

## Пайплайн (6 шагов)

1. validateInputs
2. resolveFocus
3. computeVisibleSubgraph (BFS + глубина)
4. deriveSemanticRoles
5. buildViewModel
6. return ProjectionResult

## Инвариант

Детерминизм: одинаковые входы -> одинаковый результат. Побочных эффектов нет.