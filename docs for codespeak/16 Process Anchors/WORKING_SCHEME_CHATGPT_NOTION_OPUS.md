# WORKING_SCHEME_CHATGPT_NOTION_OPUS

---

title: WORKING_SCHEME_CHATGPT_NOTION_OPUS

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: canon

---

Рабочая схема управления проектом и передачи состояния.

## Цепочка ролей

ChatGPT (архитектура/анализ) → Notion (канон/память/упаковка задач) → Opus (код/тесты/реализация)

Принцип: задачи Opus не пишутся «напрямую из обсуждения». Мы формируем архитектурные пакеты, которые проходят через Notion.

## Форматы пакетов

### 1) Architectural Decision

- что утверждаем
- что не меняем
- почему сейчас
- следующий минимальный шаг

### 2) Risk Note

- риск
- почему важен
- где проверяется
- что пока не делать

### 3) Task Spec

- цель
- scope
- stop-list
- критерий завершения

## Операционный пакет Notion → Opus (5 блоков)

1) Контекст (1 абзац)

2) Scope

3) Stop-list

4) Deliverables

5) Architectural note (1 строка: граница/инвариант)

## GitHub traceability (implementation history)

GitHub используется не для архитектуры, а для *трассируемости реализации*.

### Типы задач для Opus (важно для сообщества)

Чтобы не было двусмысленности, каждый Opus‑task должен быть явно одного из типов:

1) **Implementation task (code-only)**

- GitHub: PR или commit+push — обязательно
- Tests: обязательно
- Doc-world graph (seed/analysis): не трогать, если явно не требуется
- Result Type: `implementation done`

2) **Implementation + doc-world sync**

- GitHub: PR или commit+push — обязательно
- Tests: обязательно
- Doc-world graph: обязательно (extract/merge/analysis или ручная правка seed — по задаче)
- Result Type: `implementation done` + отметка, что seed/analysis обновлены

3) **Observation-only / validation-only**

- GitHub: не требуется (если не было изменений)
- Doc-world graph: не менять
- Result Type: `observation only` / `partial validation` / `clean validation` / `compatibility-tainted validation`

4) **Governance-only (Notion changes)**

- GitHub: не требуется
- Изменения: только Notion (канон/ADR/DRIFT_LOG/closeout)
- Result Type: `governance update` (или явно описать, что изменено в каноне)

Правило: тип задачи и требования по GitHub/seed должны быть прописаны в самом task‑пакете (а не подразумеваться).

Минимальный контракт на каждую реализационную задачу:

- Notion task spec (канонический пакет)
- GitHub PR link
- merge commit SHA (или список commit SHA)
- тестовый прогон (например `npm ci && npm test`) + статус

Рабочая цепочка:

`Notion task → GitHub PR → commit history → tests → Notion closeout`

Правило:

- В Notion‑таске всегда фиксируем ссылку на PR и итоговый SHA.
- В PR/описании (или первом комментарии) фиксируем ссылку на Notion‑таск.

## Отчёт Opus → Notion/ChatGPT (строго)

- Changes
- Non-changes
- Observations
- Result Type: implementation done | observation only | partial validation | clean validation | compatibility-tainted validation
- Architectural Status: what validated / what unvalidated / contamination notes / next step

## Правило фиксации статуса

После каждого отчёта:

- Notion фиксирует: task completed? phase advanced? result clean/provisional? next step.

## Сигнализация нарушений протокола

Если в чате появляется:

- «задача Opus» без 5 блоков (Context/Scope/Stop-list/Deliverables/Architectural note)
- отчёт Opus без Result Type/Architectural Status
- предложение менять engine/контекст/формулы внутри задачи renderer/world

…то это считается нарушением протокола, и работа ставится на паузу до перепаковки.

## Похоже ли это на «LangChain на коленке»?

Похоже по сути: это пайплайн из связных шагов, где каждый агент/узел получает структурированный input и отдаёт структурированный output.

Отличие: вместо программного оркестратора — Notion как «операционная система проекта» и человек как диспетчер.

Главная ценность: не автоматизация, а *контроль дрейфа смысла* и воспроизводимость решений.