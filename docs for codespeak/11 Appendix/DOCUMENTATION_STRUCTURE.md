# DOCUMENTATION_STRUCTURE

Этот документ определяет **каноническую структуру документации** проекта.

Он разделяет архитектуру, спецификации, объясняющие материалы и историю разработки.

Цель — сделать систему понятной, устойчивой и масштабируемой по мере развития.

---

# 1. Слои документации

Документация разделена на четыре уровня.

1. Обзор системы
2. Архитектура
3. Спецификации
4. История разработки

Каждый уровень отвечает на свой вопрос.

| Уровень | Вопрос |
| --- | --- |
| Overview | Что это за система |
| Architecture | Почему система работает |
| Specs | Как работают компоненты |
| Development | Как система развивалась |

---

# 2. Итоговая структура документации

```
docs/
│
├─ overview/
│   └─ SYSTEM_OVERVIEW.md
│
├─ architecture/
│   ├─ ARCHITECTURE.md
│   ├─ FORMAL_CORE.md
│   └─ INVARIANTS.md
│
├─ specs/
│   ├─ PROJECTION_SPEC.md
│   ├─ NAVIGATION_SPEC.md
│   ├─ KNOWLEDGE_LOG_SPEC.md
│   └─ REVIEW_WORKFLOW_SPEC.md
│
├─ guides/
│   ├─ CONCEPTS.md
│   ├─ HOW_IT_WORKS.md
│   └─ ENGINE_DEVELOPER_GUIDE.md
│
├─ theory/
│   ├─ FOUNDATIONS_OF_THE_SYSTEM.md
│   ├─ HISTORY_OF_IDEAS.md
│   ├─ KNOWLEDGE_IDE.md
│   ├─ ONTOLOGICAL_COMPILER.md
│   ├─ KNOWLEDGE_SPACE.md
│   └─ COMPARISON_WITH_OTHER_SYSTEMS.md
│
├─ reference/
│   ├─ REFERENCE_WORLD.md
│   └─ TEST_WORLD.md
│
└─ development/
    ├─ HISTORY.md
    ├─ PHASES.md
    └─ DECISIONS.md
```

---

# 3. SYSTEM_OVERVIEW.md

Этот документ является **главной точкой входа в систему**.

Он должен объяснять систему целиком за несколько минут.

## Что это за система

Meaning Engine — это система работы со знаниями, в которой знания представлены в виде утверждений, хранятся в эпистемическом журнале событий, преобразуются в граф и исследуются через детерминированную проекцию.

Система объединяет:

- граф знаний
- эпистемическую модель эволюции знаний
- движок проекции
- навигационную модель
- визуальный интерфейс

Система работает по принципу **Knowledge OS** — операционной системы знаний.

---

## Основная формула системы

```
UI = R( P( BuildGraph( Evaluate(Log) ), F, C, S, Pr ) )
```

Где:

- **Log** — журнал эпистемических событий
- **Evaluate(Log)** — вычисление текущего состояния утверждений
- **BuildGraph** — построение графа из канонических утверждений
- **F** — фокус навигации
- **C** — контекст (domain / workbench / character)

[https://www.notion.so](https://www.notion.so)

[https://www.notion.so](https://www.notion.so)

[https://www.notion.so](https://www.notion.so)

- **P** — проекция
- **R** — рендеринг

---

## Основные концепции

### Утверждения (Statements)

Минимальная единица знания:

```
(S, P, O)
```

Например:

```
Serum — type — Synthesizer
Serum — made_by — Xfer Records
```

---

### Эпистемический журнал

Знание развивается через события.

```
propose → pending → inspect → approve / reject
```

Только канонизированные утверждения попадают в граф.

---

### Граф знаний

Граф является **производной структурой**, вычисляемой из канонических утверждений.

```
CanonicalStatements → GraphModel
```

Граф не является источником истины.

Источником истины является **Knowledge Log**.

---

### Движок проекции

Проекция вычисляет визуальное представление графа.

```
Graph + Focus + Context → ViewModel
```

Проекция:

- детерминированна
- не изменяет граф
- всегда возвращает корректный результат

---

### Навигационная модель

Навигация реализована как алгебра переходов:

```
F' = T(F, a, G)
```

Типы переходов:

- select
- drillDown
- drillUp
- reset

---

### Контекст

Контекст определяет семантическую линзу наблюдения:

```
Domain → Workbench → Character
```

Контекст влияет на проекцию, но не изменяет граф.

---

## Жизненный цикл знания

```
propose
→ pending
→ inspect
→ approve / reject
→ canonical
→ graph rebuild
```

Только каноническое знание влияет на структуру графа.

---

## Слои системы

1. **Knowledge Layer**
    
    Утверждения и эпистемический журнал
    
2. **Graph Layer**
    
    GraphModel, построенный из канонических утверждений
    
3. **Engine Layer**
    
    Проекция и навигация
    
4. **World Layer**
    
    Домены, рабочие пространства и персонажи
    
5. **Renderer Layer**
    
    Интерфейс пользователя
    

---

## Ключевые свойства системы

- детерминированная проекция
- событийная модель знания (event sourced)
- неизменяемая структура графа
- контекстная навигация
- эпистемические workflow

---

# 4. Архитектурные документы

Архитектурные документы описывают формальную модель системы.

## ARCHITECTURE.md

Содержит:

- основную формулу системы
- архитектурные законы
- слои системы

---

## FORMAL_CORE.md

Формальные определения:

- Node
- Edge
- Graph
- Focus
- Projection
- Navigation

---

## INVARIANTS.md

Все инварианты системы.

Примеры:

- Schema Conformance
- Identity Stability
- Projection Determinism
- Graph Immutability
- Canonical-only graph build

---

# 5. Спецификации

Спецификации описывают поведение движка.

## PROJECTION_SPEC.md

Pipeline проекции и контракт ViewModel.

---

## NAVIGATION_SPEC.md

Навигационные переходы и их инварианты.

---

## KNOWLEDGE_LOG_SPEC.md

Модель утверждений.

Содержит:

- Statement
- EpistemicEvent
- Evaluate(Log)
- Построение графа

---

## REVIEW_WORKFLOW_SPEC.md

Эпистемический workflow:

```
propose → pending → inspect → approve / reject
```

---

# 6. Руководства

Руководства объясняют систему разработчикам.

## CONCEPTS.md

Описание ключевых концепций:

- домены
- workbench
- персонажи
- проекция

---

## HOW_IT_WORKS.md

Пошаговое объяснение работы системы:

```
Log → Evaluate → Graph → Projection → UI
```

---

## ENGINE_DEVELOPER_GUIDE.md

Как расширять движок:

- добавление новых операторов
- соблюдение инвариантов
- написание тестов

---

# 7. История разработки

Эти документы описывают эволюцию проекта.

## HISTORY.md

Хронологический список изменений.

---

## PHASES.md

Описание этапов:

- Phase 1 — Graph validity
- Phase 2 — Projection
- Phase 3 — Navigation
- Phase 4 — Contextual projection
- Phase 4.5 — Knowledge substrate
- Phase 5a — Minimal editing
- Phase 5b — Proposal review

---

## DECISIONS.md

Архитектурные решения и их обоснование.

---

# 8. Теоретический слой

Теоретический слой нужен для трёх задач:

1. объяснять систему через аналогии и сравнения
2. показывать её место в истории идей и среди существующих систем
3. служить основой для грантов, white paper и research positioning

Этот слой **не заменяет** архитектуру и спецификации.

Он дополняет их.

Главное правило:

- **architecture/specs** отвечают на вопрос: *как система устроена*
- **theory** отвечает на вопрос: *что это за класс системы и почему он важен*