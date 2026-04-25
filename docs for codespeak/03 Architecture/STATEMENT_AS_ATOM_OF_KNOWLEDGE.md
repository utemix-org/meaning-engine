# STATEMENT_AS_ATOM_OF_KNOWLEDGE

---

title: STATEMENT_AS_ATOM_OF_KNOWLEDGE

kind: architecture

project: Meaning Engine

status: active

scope: v1

maturity: canon

---

Канонический принцип: атом знания в системе — Statement (утверждение), а граф — производная проекция.

## Почему не Node/Edge

- Node — сущность, но сам по себе ничего не утверждает.
- Edge выглядит как факт, но без автора/основания/статуса.

## Statement (атом)

Statement содержит:

- subject/predicate/object
- author/proposed_by
- evidence (horizon)
- status (proposed/verified/canonical/rejected)
- history

## Следствия для pipeline

- `Log` = поток событий над statements
- `Evaluate(Log)` вычисляет состояние statements
- `BuildGraph(Canonical Statements)` строит граф как проекцию canonical statements

## Связь с трёхграфной моделью (horizon)

Один и тот же statement участвует в разных проекциях:

- Epistemic Graph: transitions/state machine statements
- Knowledge Graph: фильтр canonical → edges
- Exploration Graph: группировки/сравнения/пути понимания над statements

## Статус

Это согласуется с текущим каноном log-first и canonical-only.