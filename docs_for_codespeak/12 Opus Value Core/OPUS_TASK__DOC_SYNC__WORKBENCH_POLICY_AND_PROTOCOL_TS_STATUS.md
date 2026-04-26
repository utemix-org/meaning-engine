# OPUS_TASK__DOC_SYNC__WORKBENCH_POLICY_AND_PROTOCOL_TS_STATUS

---

title: OPUS_TASK__DOC_SYNC__WORKBENCH_POLICY_AND_PROTOCOL_TS_STATUS

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

source: chatgpt-architect-package

---

<aside>
🎯

**Goal:** синхронизировать каноническую документацию с текущей реальностью кода **без runtime изменений**.

Фиксируем два факта:

1) `protocol.ts` = **defined**, но **not runtime enforced** (type-level vocabulary).

2) `WorkbenchPolicy` = **world-defined policy, applied at render layer** (важна причинность: world → policy → render application).

</aside>

### Inputs (обязательно прочитать)

- Отчёт Opus: [OPUS_TASK__VSTABLISHMENT_GROUNDING_AND_PROTOCOL_AUDIT](OPUS_TASK__VSTABLISHMENT_GROUNDING_AND_PROTOCOL_AUDIT.md)
- Канон: [SYSTEM_OVERVIEW](../02%20Overview/SYSTEM_OVERVIEW.md), [RENDER_SURFACES_SPEC](../../docs/specs/RENDER_SURFACES_SPEC.md)
- Engineering: *DRIFT_LOG* (Notion), [ENGINE_DEVELOPER_GUIDE](../05%20Guides/ENGINE_DEVELOPER_GUIDE.md)

---

## A) Constraints

- **Do:** documentation synchronization.
- **Do not:** менять engine/runtime поведение, добавлять runtime enforcement для protocol.ts, вводить новые surfaces/графы.

---

## B) Tasks (Opus)

1) **Update: RENDER_SURFACES_SPEC**

- Добавить секцию `WorkbenchPolicy`.
- Формулировка (обязательная):
 - `WorkbenchPolicy is defined by world configuration and applied in render layer (post-ViewModel).`
- Описать жизненный цикл на 3–5 строк:
 - `Projection → ViewModel → applyWorkbenchPolicy(viewModel, worldPolicy) → Render`
- Явно указать, что применение policy:
 - не мутирует граф
 - не меняет engine projection
 - является experience-layer ограничением/адаптацией.

2) **Update: SYSTEM_OVERVIEW**

- Добавить короткую секцию `Protocol types (defined-not-enforced)`:
 - `packages/engine/src/core/types/protocol.ts` — vocabulary, runtime не валидирует.
 - Атрибуты протокола могут присутствовать в world data и игнорироваться runtime.
- Добавить 1 строку в описание pipeline/границ слоёв:
 - Render может применять world-defined policies, не влияя на вычисление графа.

3) **Update: DRIFT_LOG**

- Добавить новые записи (date = 2026-03-13):
 - `protocol.ts defined but not runtime-consumed`
 - `FocusTarget unused`
 - `AttachmentDescriptor/Mode/SourceType without instances`
 - `WorkbenchPolicy exists in render, missing in Notion canon`

4) **Update: ENGINE_DEVELOPER_GUIDE**

- Добавить краткую секцию (5–10 строк):
 - “Protocol types status: defined-not-enforced”
 - “Do not assume runtime enforcement.”
 - Ссылка на DRIFT_LOG запись.

---

## C) Output (результат)

### Изменённые страницы

**1. RENDER_SURFACES_SPEC**

Добавлена секция `WorkbenchPolicy (experience-layer adaptation)` перед "Критерии стабильности":

- Жизненный цикл: `Projection → ViewModel → applyWorkbenchPolicy → Render`
- Свойства (visible_types, edge_policy, depth)
- Принципы (не мутирует граф, experience-layer, Focus Preservation)
- Причинность: world → policy → render application

**2. SYSTEM_OVERVIEW**

Добавлены 2 секции перед "Ближайший фокус":

- `Protocol types (defined-not-enforced)` — статус protocol.ts, ссылка на DRIFT_LOG
- `Границы слоёв (примечание)` — Render может применять world-defined policies без влияния на граф

**3. DRIFT_LOG**

Добавлены 4 записи (#6–9) от 2026-03-13:

- #6: `protocol.ts` defined-not-enforced (→ closed)
- #7: `FocusTarget` unused (→ open)
- #8: `AttachmentDescriptor/Mode/SourceType` without instances (→ open)
- #9: `WorkbenchPolicy` в render, отсутствовал в Notion (→ closed)

**4. ENGINE_DEVELOPER_GUIDE**

Добавлена секция `Protocol types: defined-not-enforced` после "Требование":

- Явное указание: "Do not assume runtime enforcement"
- Ссылка на DRIFT_LOG

### Подтверждение

**Ни один файл репозитория не менялся.** Все изменения — только в Notion.

---

## D) Verification checklist

- [x] Во всех местах используется причинность: **world-defined → applied in render** (не наоборот).
- [x] В SYSTEM_OVERVIEW явно указан статус `protocol.ts = defined-not-enforced`.
- [x] В DRIFT_LOG добавлены 4 записи от 2026-03-13 (#6, #7, #8, #9).
- [x] Изменения не вводят новых обязательств для engine/INVARIANTS.