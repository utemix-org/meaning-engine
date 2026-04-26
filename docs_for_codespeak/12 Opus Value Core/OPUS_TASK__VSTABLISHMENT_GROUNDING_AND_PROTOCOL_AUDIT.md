# OPUS_TASK__VSTABLISHMENT_GROUNDING_AND_PROTOCOL_AUDIT

---

title: OPUS_TASK__VSTABLISHMENT_GROUNDING_AND_PROTOCOL_AUDIT

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: draft

owner: opus

---

<aside>
🎯

**Цель:** приземлить workbench **VSTablishment** на реальность кода и зафиксировать минимальный технический шаг (patch + тест), который делает workbench **операционально отличимым** и совместимым с каноном.

</aside>

### Контекст и источники истины (прочитать перед работой)

- Канон: [SYSTEM_OVERVIEW](../02%20Overview/SYSTEM_OVERVIEW.md), [RENDER_SURFACES_SPEC](../../docs/specs/RENDER_SURFACES_SPEC.md), [WORLD_GROUNDING](../09%20Development/WORLD_GROUNDING.md)
- Engineering: *CODE_VERIFICATION_PLAYBOOK*, *GROUNDING_EXPERIMENTS_PHASE1_REPORT*, *CODEBASE_STATUS_REPORT_2026-03-11* — страницы Notion в этом наборе не зеркалируются; см. `docs/` и историю коммитов.

---

## A) Snapshot

- **Дата:** 2026-03-13
- **Repo:** utemix-org/vovaipetrova
- **Branch:** main
- **Commit SHA:** c5c4261f6247008522ff0286f383abeb56e385f5
- **Тесты:** 536 passed / 0 failed (23 suites)

---

## B) Задача 1 — Audit: protocol.ts как runtime vocabulary

**Цель:** понять, какие протоколы уже формализованы в коде и как они соотносятся с документацией.

### B1. Файл(ы)

- `packages/engine/src/core/types/protocol.ts`

### B2. Извлечённые сущности (список)

| Тип | Назначение | Значения |
| --- | --- | --- |
| `FocusRole` | Как узел открывается системой | `entry`, `hub`, `lens`, `perspective`, `area`, `space`, `none` |
| `FocusTarget` | На что узел нацелен, когда открыт | `subject-area`, `operational-lens`, `perspective`, `relational-space`, `attached-knowledge`, `data` |
| `SceneVisibility` | Где узел появляется в интерфейсе | `scene`, `panel`, `both`, `hidden` |
| `AttachmentPolicy` | Могут ли внешние подграфы подключаться | `open`, `typed`, `none` |
| `SurfacePolicy` | Куда проецируются присоединённые данные | `scene`, `panels`, `mixed`, `hidden` |
| `AttachmentSourceType` | Тип источника attachment | `ontology`, `catalog`, `dataset`, `service` |
| `AttachmentMode` | Способ подключения | `direct`, `typed`, `deferred`, `hidden-by-default` |
| `AttachmentDescriptor` | Интерфейс: полное описание присоединённого подграфа | `source`, `sourceType`, `attachTo`, `edgeType`, `nodeMapping`, `relationMapping`, `surfacePolicy`, `detachable` |
| `ProtocolAttributes` | Интерфейс: атрибуты протокола, назначаемые любому узлу | `focusRole?`, `focusTarget?`, `sceneVisibility?`, `attachmentPolicy?`, `surfacePolicy?` |

### B3. Реальное использование в коде

**Определение:** `packages/engine/src/core/types/protocol.ts`

**Экспорт:** `packages/engine/src/core/types/index.d.ts` (re-export всех типов)

**Runtime-использование в engine:** НЕТ.

Ни один модуль engine (projection, navigation, knowledge) не импортирует из `protocol.ts`. Типы определены, но engine их не потребляет как runtime vocabulary — engine не проверяет `focusRole`, `sceneVisibility` и т.д. при проекции или навигации.

**Runtime-использование в render:** НЕТ.

Ни один render-компонент не импортирует `FocusRole`, `ProtocolAttributes` и т.д.

**Использование в данных мира:** ДА.

`universe.json` содержит 77 вхождений `focusRole` / `sceneVisibility` / `attachmentPolicy` на узлах.

Но эти атрибуты проходят через систему как generic `[key: string]: unknown` — engine и render не типизируют и не валидируют их.

**Вывод: `protocol.ts` является code-ahead.**

Типы формализованы в TypeScript, экспортируются из `@vip/engine`, описаны в `docs/FOCUS_NODE_PROTOCOL.md` и `docs/ATTACHMENT_PROTOCOL.md`, используются в данных мира — но НЕ потребляются ни одним runtime-модулем. Это type-level vocabulary без runtime enforcement.

**Code-ahead relative to Notion canon:**

- `FocusTarget` — определён в коде, но не используется нигде (ни в данных мира, ни в engine). Полностью висящий тип.
- `AttachmentDescriptor`, `AttachmentMode`, `AttachmentSourceType` — определены, но нет ни одного экземпляра в данных мира или engine коде.
- `SurfacePolicy` — определена, но не назначена ни одному узлу в `universe.json` (хотя `attachmentPolicy` назначена).

### B4. Минимальный doc sync (без изменения engine)

1. **SYSTEM_OVERVIEW** — добавить секцию "Protocol Types" с пометкой status=`defined-not-enforced`. Указать, что `protocol.ts` описывает vocabulary, но engine его не валидирует на runtime.
2. **INVARIANTS** — НЕ добавлять инвариант на protocol enforcement (пока нет runtime проверки).
3. **DRIFT_LOG** (Notion) — зафиксировать code-ahead:
 - `FocusTarget` — тип без использования
 - `AttachmentDescriptor/Mode/SourceType` — интерфейсы без экземпляров
 - `protocol.ts` экспортируется из `@vip/engine`, но engine не потребляет
4. **FOCUS_NODE_PROTOCOL** (docs repo) — уже синхронизирован, описывает те же 14 правил и атрибуты.

---

## C) Задача 2 — Reproduce и объяснить Workbench Overlap (VSTablishment)

**Цель:** подтвердить и локализовать причину, почему VSTablishment проекционно неразличим от других workbench персонажа.

### C1. Repro

**Phase 1 (до fix):** VSTablishment был неразличим.

- Character=Vova, Focus=любой, Workbench=vstablishment vs music-general
- Сравнение: `vm.scene.nodes` (список id), `vm.scene.nodes.map(n => n.type)` (типы), `vm.scene.edges` (связи)
- Результат Phase 1: **P(G, F, vstablishment) = P(G, F, music-general)** — идентичные проекции

**Phase 2a (после fix):** VSTablishment различим.

- Те же параметры
- Результат Phase 2a: **P(G, F, vstablishment) ≠ P(G, F, music-general)**
 - music-general: 20 nodes, types=[character, collab, domain, hub, workbench]
 - vstablishment: 15 nodes, types=[character, collab, domain, hub, **vst-layer**, workbench]
 - 7 unique to vstablishment: vst-layer-1 through vst-layer-7

### C2. Причина (Phase 1 overlap)

**Формула:** `Workbench.domains = deriveWorkbenchConfigs → owner character → character.domains`

Все три workbench Вовы наследовали домены от Character Vova: `[domain-ai, domain-music]`. Поскольку engine фильтрует по domain membership, а domain membership одинакова для всех workbench одного персонажа — проекции были идентичны.

**Где задано:**

1. **derive-функции** (`graphStore.ts: deriveWorkbenchConfigs`) — строят `Wb.domains` из character→domain связей
2. **engine semantic filter** (`computeVisibleSubgraph.js: computeWorkbenchMembership`) — фильтрует как ⋃ DomainMembership(D_i)
3. **данные мира** — workbench не имели собственных параметров наблюдения (policy)

**Root cause:** workbench не вносил собственной операционной семантики. `Wb = CharacterDomains` — workbench был прозрачным прокси для доменов персонажа.

### C3. Связь с отчётом Phase 1

Отчёт Phase 1 зафиксировал: "All three Vova workbenches produce identical projections → [Workbench.domains](http://Workbench.domains) = [Character.domains](http://Character.domains)". 8 overlap pairs из 8 возможных.

Это было **исправлено** в Phase 2a через введение `WorkbenchPolicy` (visible_types, edge_policy, depth) как пост-фильтра в render adaptation layer. Phase 2b подтвердила, что fix был tainted bridge-рёбрами. Phase 2c устранила bridge-зависимость через MEMBERSHIP_EDGE_TYPES allowlist в engine.

**Текущее состояние:** VSTablishment проекционно **различим**. Clean validation (Phase 2c). 0 overlap pairs среди Vова's workbenches.

---

## D) Задача 3 — Minimal fix: сделать VSTablishment отличимым

**Ограничение:** это должно быть минимально, проверяемо и не переводить проект в “новую engine-разработку”.

### D1. Применённый вариант

**Комбинация (1) + (2) + (3):**

1. **Данные мира** (Phase 2a): добавлен `policy` к workbench-узлам в `universe.json` — `visible_types`, `edge_policy`, `depth`
2. **Derive-логика** (Phase 2a): `deriveWorkbenchConfigs` в `graphStore.ts` читает `policy` из node data
3. **Engine semantic filter** (Phase 2c): `computeDomainMembership` расширена с hardcoded `'relates'` до `MEMBERSHIP_EDGE_TYPES` allowlist

**Обоснование:** вариант (1) + (2) работает как пост-фильтр в render layer без изменения engine алгоритмов. Вариант (3) — минимальный engine fix (~5 строк), устраняющий root cause bridge-зависимости. Все три изменения уже выполнены и верифицированы.

### D2. Acceptance criteria — ВЫПОЛНЕНЫ

✅ При Character=Vova:

- `vstablishment`: 15 nodes, types=[character, collab, domain, hub, **vst-layer**, workbench]
- `music-general`: 20 nodes, types=[character, collab, domain, hub, workbench]
- `zucken-drukcken`: 10 nodes, types=[character, collab, domain, hub, **root**, workbench]

✅ Различие наблюдаемо в:

- `vm.scene.nodes` (разные id, разное количество)
- `vm.scene.nodes[].type` (vstablishment: vst-layer; zucken: root/system)
- `vm.scene.edges` (разные типы: vstablishment — contains/relates; zucken — contains/structural/internal)
- `vm.meta.visibleNodes` (15 vs 20 vs 10)

✅ Surfaces читают **только ViewModel**. Renderer Hygiene audit пройден (Phase 4b, all SystemPanel/AddNodeForm read from viewModelStore).

### D3. PR/patch summary

| Файл | Изменение | Phase |
| --- | --- | --- |
| `world/graph/universe.json` | Добавлен `policy` к 5 workbench-узлам; удалены 23 bridge `relates` edges (149→126) | 2a + 2c |
| `packages/render/src/stores/viewModelStore.ts` | `WorkbenchPolicy` тип, `applyWorkbenchPolicy` пост-фильтр, policy-aware depth | 2a |
| `packages/render/src/stores/graphStore.ts` | `deriveWorkbenchConfigs` читает `policy` из node data | 2a |
| `packages/engine/src/core/projection/computeVisibleSubgraph.js` | `MEMBERSHIP_EDGE_TYPES` allowlist вместо hardcoded `'relates'` | 2c |
| `packages/render/src/__tests__/groundingPhase2.test.js` | 7 тестов Phase 2a: overlap, differentiation, focus preservation | 2a |
| `packages/render/src/__tests__/groundingPhase2b.test.js` | 7 тестов Phase 2b: edge canonicity, clean validation | 2b + 2c |

---

## E) Задача 4 — Тест (обязателен)

Добавить 1 тест, который фиксирует “workbench non-overlap” хотя бы для VSTablishment.

### E1. Где тест

- **Path:** `packages/render/src/__tests__/groundingPhase2.test.js`
- **Test name:** `'P(G, F, WbA) ≠ P(G, F, WbB)'`
- **Дополнительно:** `groundingPhase2b.test.js` → `'visible_types differentiation is CLEAN'`

### E2. Что именно проверяет

- Сравниваются `snapshot.nodeIds` (sorted) для focus=`character-vova` с разными workbench
- Критерий: `JSON.stringify(sMusicGeneral.nodeIds) !== JSON.stringify(sVstablishment.nodeIds)` → `expect(projectionsDiffer).toBe(true)`
- Дополнительно: vstablishment содержит `vst-layer` в nodeTypes, music-general — нет
- **14 тестов** фиксируют non-overlap, focus preservation, edge canonicity

---

## F) Drift update

Новые drift-пункты:

| Date | Type | Description | Code | Resolution | Status |
| --- | --- | --- | --- | --- | --- |
| 2026-03-13 | code-ahead | `FocusTarget` type defined in `protocol.ts` but used nowhere (no node, no engine, no render) | `packages/engine/src/core/types/protocol.ts` | Remove or add to world data when needed | open |
| 2026-03-13 | code-ahead | `AttachmentDescriptor`, `AttachmentMode`, `AttachmentSourceType` — interfaces without instances | `protocol.ts` | Future: instantiate when attachments are implemented | open |
| 2026-03-13 | code-ahead | `protocol.ts` exported from `@vip/engine` but no engine module consumes it at runtime | `index.d.ts` → `protocol.ts` | Acceptable as type-level vocabulary; add runtime validation when needed | open |
| 2026-03-13 | code-ahead | `WorkbenchPolicy` type defined in render (`viewModelStore.ts`) but not in engine or Notion canon | `viewModelStore.ts` | Sync to Notion (SYSTEM_OVERVIEW or dedicated page) | open |

---

## G) Итог

### G1. Короткий вывод

VSTablishment **операционально отличим** от других workbench Вовы. Проекция различима по:

- составу узлов (vst-layer-1..7 — уникальны для vstablishment)
- типам узлов (vst-layer vs character/collab в music-general)
- типам рёбер (contains — vstablishment-специфичные связи к VST-слоям)

Относительно WORLD_GROUNDING: VSTablishment готов как **"реальный workbench"** на уровне проекционной дифференциации. Однако:

- Protocol attributes (`focusRole`, `sceneVisibility`, `attachmentPolicy`) присвоены в данных мира, но **не валидируются и не используются engine/render на runtime**. Это type-level vocabulary.
- `WorkbenchPolicy` работает как пост-фильтр — это render-layer семантика, не engine-level.
- VSTablishment имеет нарративы ([info.md](http://info.md), [spec.md](http://spec.md)), но они не проецируются в текущий render (нет вкладок I/S/P — это vision-level).

### G2. Следующий технический шаг

Sync `WorkbenchPolicy` type в Notion canon (добавить описание в SYSTEM_OVERVIEW или отдельную страницу). Это закроет основной code-ahead пункт без изменения кода.

<aside>
✅

**Формат сдачи:** заполни все секции A–G. Если секция не применима — напиши "N/A" и почему.

</aside>