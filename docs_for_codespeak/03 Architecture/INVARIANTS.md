# INVARIANTS

---

title: INVARIANTS

kind: architecture

project: Meaning Engine

status: active

scope: v1

maturity: canon

---

Инварианты — свойства, которые должны сохраняться при любых операциях. Каждый инвариант должен быть покрыт тестами.

## System (верхний запрет)

- Exploration ≠ Acceptance: Meaning Engine must never confuse exploration with acceptance.
 - Коротко: Explore freely. Accept explicitly.
 - Следствие: ни operator, ни retrieval/ingestion, ни LLM не могут "тихо" продвинуть candidate структуру в accepted knowledge.
 - Acceptance происходит только через governance + эпистемический лог (explicit epistemic action).

## Группы

- G: Graph
- P: Projection
- N: Navigation
- K: Knowledge (log/statements/build)
- RW: Review workflow
- VW: Verification workflow

## Graph (ядро)

- Identity stability (id неизменен)
- Edge validity (нет ссылок на несуществующие узлы)
- Schema conformance
- Canonical-only graph build / graph determinism
- Graph immutability (не редактируется напрямую)

## Projection

- Determinism
- Purity (не мутирует граф)
- Totality (ok или типизированная ошибка)
- Focus visibility (фокус не «теряется» в модели)

## Navigation

- Purity/independence
- Closure: валидный переход -> валидный focus
- Reversibility drillDown/drillUp
- History integrity

## Knowledge / workflow

- Log as source of truth
- Event sourcing: `State = Evaluate(Log)`
- Verified/proposed не входят в граф до canonical
- Cross-boundary запреты (например approve(rejected)) -> error

## Примечание (repo-ingest)

В репо есть расширенная группировка «System Invariants» (19) по слоям A–F и предупреждение про Phase 5. См. SYSTEM_INVARIANTS_V2 (vNext).

См. также: AXIOMS (короткая версия ядра).