# OPUS_TASK__AM__ENGINE_CANON_SEPARATION__VOVAIPETROVA_DEPENDS_ON_MEANING_ENGINE

---

title: OPUS_TASK__AM__ENGINE_CANON_SEPARATION__VOVAIPETROVA_DEPENDS_ON_MEANING_ENGINE

kind: opus-task

project: Author World (vovaipetrova)

status: done

priority: high

---

## 1) Контекст

По результатам baseline sync + validation выяснилось: в репозитории `utemix-org/vovaipetrova` лежит устаревшая копия движка (engine). Целевая архитектура:

- `utemix-org/meaning-engine` — канонический движок (пакет)
- `utemix-org/vovaipetrova` — авторский мир + render/UI, который **зависит** от `meaning-engine` (npm/git dependency)

Это архитектурное решение и потенциально рискованная миграция, поэтому его нужно упаковать как отдельную задачу с жёсткими границами и проверками.

## 2) Цель

Перевести `vovaipetrova` на зависимость от канонического `meaning-engine`, устранив локальную копию движка, при этом:

- сохранить работоспособность render/dev server
- сохранить текущие тесты или корректно перераспределить их по репозиториям
- зафиксировать воспроизводимую точку (validated SHA) до и после

## 3) Scope (что можно трогать)

Разрешено:

- структура `packages/engine/` в `vovaipetrova` (удаление/вынос)
- зависимости (`package.json`, workspaces)
- импорты в `packages/render/`
- тесты: перенос/переклассификация (что относится к render/AW vs что относится к движку)
- docs (коротко): фиксация решения и новых точек входа

## 4) Stop-list (что нельзя)

- Не менять публичные обещания `meaning-engine`.
- Не добавлять новые runtime-зависимости без необходимости.
- Не переписывать архитектуру render/UI.
- Не «улучшать» движок внутри этой задачи (движок — отдельный репо).

## 5) Deliverables

A) Repo-level изменения (в `vovaipetrova`):

1. `packages/engine/` удалён (или заменён на thin-adapter, если без него невозможно — указать почему).
2. Workspace-зависимость вида `"@vip/engine": "*"` заменена на зависимость от `meaning-engine` (npm/git).
3. `packages/render/` успешно собирается и запускается (dev server).
4. Тесты:
    - AW/render-специфичные тесты остаются в `vovaipetrova`
    - engine-специфичные тесты не дублируются в `vovaipetrova` (либо перенесены/заменены ссылкой на upstream)

B) Валидация (обязательно):

- До: зафиксировать baseline validated SHA (уже есть) как «точку до миграции».
- После: один validated SHA после миграции, с прогоном команд.

C) Документация (RU):

- Короткий документ решения в `vovaipetrova/docs/decisions/` (или ближайшее соответствующее место), почему так и что теперь является каноном.
- Обновление track doc AM, что эта миграция — блокер/пререквизит.

## 6) Acceptance criteria (Definition of Done)

- `npm ci` проходит на чистом checkout.
- `npm run test` (или эквивалент) проходит.
- `npm run build` проходит.
- `npm run dev` поднимает render на [localhost](http://localhost), базовый рендер/сцена работает.
- В Notion sync card обновлены: ветка/PR, validated SHA (после), блокеры сняты.

## 7) Архитектурная заметка (граница)

Это задача про **границу репозиториев** и источник истины движка. Мы не «собираем мегарепо» и не допускаем двух канонов движка.

## Opus report (2026-03-23)

### Changes

- Удалён `packages/engine/` полностью (65+ файлов, ~17 800 строк, @vip/engine v0.6.0)
- Установлена зависимость `meaning-engine@^0.1.2` из npm registry
- Обновлены 8 точек импорта в 3 stores + 5 тестовых файлах: `'@vip/engine'` → `'meaning-engine/core'`
- Используется subpath `/core` — обходит баг npm-пакета (отсутствует `specification.json` в tarball)
- Удалены 5 дублированных тестов `documentationWorld*.test.js` (каноны живут в `meaning-engine/operators/__tests__/`)
- Обновлены конфиги: workspaces, tsconfig references, test scripts
- Создан `docs/decisions/ADR-001-engine-canon-separation.md`

### Non-changes

- Render UI, компоненты, stores (кроме импортов) — не тронуты
- `world/` данные — не тронуты
- `meaning-engine` — не тронут

### Observations

- npm-пакет `meaning-engine@0.1.2` не включает `specification/specification.json` в `files` — баррел-импорт ломается. Workaround: импорт из `meaning-engine/core` subpath.
- 42 grounding-теста проходят на каноническом движке — API полностью совместимо.
- `world/documentation-world/` остаётся в репо, но больше не используется тестами (можно удалить позже).

### Result Type

implementation done

### Architectural Status

- validated: c9defd6 (branch `engine-canon-separation`) — npm install, 42 tests pass, vite build OK, dev server OK
- unvalidated: нет
- contamination / notes: нет контаминации. В рабочем дереве остаются pre-existing uncommitted changes (docs, universe.json, App.tsx), которые не относятся к этой задаче.
- recommended next step: merge `engine-canon-separation` → `main`, после чего можно переходить к задачам Author World MVP. Также: в `meaning-engine` добавить `specification/` в `files` и опубликовать patch.