# ENGINE_DEVELOPER_GUIDE

---

title: ENGINE_DEVELOPER_GUIDE

kind: guide

project: Meaning Engine

status: active

scope: v1

maturity: canon

---

## Правила изменения движка

1) Не мутировать граф напрямую: `Graph = BuildGraph(CanonicalStatements)`

2) Источник истины — log: `State = Evaluate(Log)`

3) Проекция чистая: `P(G,F,C)` без сайд-эффектов

4) Навигация меняет только focus: `F' = T(F,a,G)`

5) Контекст влияет на наблюдение, не на структуру

## Как добавлять оператор

- определить событие
- обработка в Evaluate
- тесты на инварианты/переходы
- обновить specs (knowledge log / workflow)

## Требование

Любое изменение сопровождается тестами и не нарушает INVARIANTS.

## Protocol types: defined-not-enforced

`src/core/types/protocol.ts` определяет TypeScript-типы для Focus Node Protocol и Attachment Protocol.

**Важно:** эти типы являются vocabulary, а **не runtime enforcement**. Engine не импортирует и не проверяет эти типы при проекции или навигации.

Do not assume runtime enforcement. Атрибуты протокола могут присутствовать в world data и игнорироваться runtime.

См. DRIFT_LOG — записи от 2026-03-13.