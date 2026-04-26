# HUMAN_LLM_IDE_AGENT_PROTOCOL

---

title: HUMAN_LLM_IDE_AGENT_PROTOCOL

kind: guide

project: Meaning Engine

status: active

scope: now

maturity: canon

---

Этот документ описывает рабочий формат **Человек ↔ LLM ↔ IDE-агент** в проекте Meaning Engine.

Цель — не «какая модель лучше», а **распределение ролей**, единый канон и устойчивый цикл разработки.

## Связи (meaning map)

Черновики ME_MAP (IDE-аналогия, оператор «A», acceptance) в репозитории отдельными страницами не экспортированы; см. конспект в [KNOWLEDGE_IDE](../08%20Theory/KNOWLEDGE_IDE.md) и этот протокол как рабочий канон.

## Роли

### Человек (owner)

- Принимает решения (DECISION/ADR)
- Определяет приоритеты и критерии готовности
- Поставляет сырьё: диалоги, заметки, старые документы, примеры

### LLM (Architect / Explorer)

- Генерирует варианты и объяснения
- Помогает думать, но не владеет каноном
- Выход: *Architect Brief* (строго по шаблону ниже)

### Notion AI (Keeper: Documentation + Process)

- Хранит и обновляет канон в `Docs (скелет)`
- Сливает выжимки без дублей
- Следит за инвариантами и «чистотой процесса»
- Выход:
 - *Canon Update* (что изменилось в документах)
 - *Task Brief* для IDE-агента

### IDE-агент (Opus: Implementer)

- Реализует код, тесты, рефакторинг
- Не переписывает канон самовольно
- Выход: *Implementation Report* (строго по шаблону)

## Артефакты (обязательные)

- Канон в Notion: `Docs (скелет)`
- ADR: `Docs/adr/DECISIONS` (все изменения законов — через ADR)
- Спеки/контракты: `Docs/specs/*` (API движка)

## Шаблон: Architect Brief (LLM → Keeper)

1) New/Changed Laws (≤3)

2) New/Changed Models (≤5)

3) New/Changed APIs (≤5)

4) Decisions (что закрепили/откатили)

5) Open Questions (≤5, приоритет)

6) Implications for code (что надо сделать в коде)

## Шаблон: Task Brief (Keeper → IDE-агент)

- Goal (1–2 предложения)
- Non-goals (что *точно не делаем*)
- Constraints (ссылки на AXIOMS/INVARIANTS/SPECS)
- Artifacts (какие модули/файлы трогаем)
- Acceptance tests (какие тесты/инварианты должны пройти)
- Report format (что вернуть)

## Шаблон: Implementation Report (IDE-агент → Keeper)

- Summary (что сделано)
- Files/Modules touched
- Tests: added/updated + статус
- Canon compliance (что соответствует спекам, что нет)
- Drift (какие новые сущности/поведения появились в коде)
- Open questions / blockers

## Правила процесса (чтобы не ходить кругами)

1) Если меняем закон — создаём/обновляем ADR.

2) Если вводим новый термин — он сначала появляется в каноне как MODEL.

3) Любая реализация должна ссылаться на SPEC/API или признаться, что это эксперимент.

4) Максимум 5 активных открытых вопросов одновременно.

## Размещение в репо

Этот протокол должен быть продублирован в репозитории (например `docs/PROCESS.md`), чтобы IDE-агент работал «внутри рельс».