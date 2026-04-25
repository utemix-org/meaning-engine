# NAVIGATION_SPEC

---

title: NAVIGATION_SPEC

kind: spec

project: Meaning Engine

status: active

scope: v1

maturity: implemented

---

## Назначение

Навигация — детерминированное изменение фокуса с сохранением истории.

## Модель

`Focus = { nodeId: ID|null, path: ID[] }`

## Переходы

- `select(nodeId)` — меняет nodeId, history без изменений
- `drillDown(nodeId)` — push текущий nodeId в path, затем новый nodeId
- `drillUp` — pop из path (или пустой фокус)
- `reset` — пустой фокус

## Контракт

`applyTransition(focus, transition, graph) -> { ok, focus } | { ok:false, error }`

## Инварианты (ядро)

- Transition validity
- DrillDown/drillUp reversibility
- History integrity (+1 / -1 / 0)
- Determinism
- Projection compatibility (после перехода проекция должна быть ok)

## Примечание: scope

В repo-версии формализма иногда встречается `scope` как часть состояния наблюдения (видимый neighborhood).

В текущем каноне `scope` должен быть производным результатом проекции, а не обязательным полем Focus, чтобы избегать скрытых циклов состояния.