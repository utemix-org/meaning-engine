# DOC_SYNC_CHECKLIST__NOTION_VS_UTEMIX_ORG_MEANING_ENGINE

---

title: DOC_SYNC_CHECKLIST__NOTION_VS_UTEMIX_ORG_MEANING_ENGINE

kind: engineering

project: Meaning Engine

status: active

scope: now

maturity: working

---

## Цель

Свести в одно место, что именно должно быть синхронизировано между:

- Notion-каноном (якоря/спеки/гайды)
- репозиторием `utemix-org/meaning-engine` (tree, paths, tooling, demo worlds)

Формат: короткие пункты, пригодные для сверки с Opus (код) и Not (доки).

## P0: устранить расхождения, которые ломают понимание

- Repo map в Notion должен отражать `src/*`, `operators/*`, `worlds/*`.
- Render-спеки (RENDER_SURFACES_SPEC, WorkbenchPolicy) должны быть помечены как contract, а не «implemented в этом repo».
- Любые ссылки вида `packages/engine/*`, `packages/render/*`, `world/*` в Notion должны быть либо исправлены, либо помечены как historical.

## P0: Documentation World — трассируемость spec→code

- Code artifact id policy: если id = `code:file:<path>`, нужна явная политика на переезд путей (alias/redirect/legacy-tag). См. ADR-013-CODE_ARTIFACT_IDENTITY_AND_REDIRECTS.
- Extractor (worlds/documentation-world/tools/*):
    - SCAN_DIRS должны указывать на `src/`, `operators/`, `worlds/`.
    - Классификация тегов engine/render должна быть актуализирована под текущий repo (или render-tag убрать как out-of-scope).
- specToCodeMap.json: обновить под реальные пути.

## P1: code links в Notion

- Убрать «битые» repo-ссылки на `docs/spec/*.md`, `FORMAL_CORE.md` и т. п. там, где эти файлы не являются canonical storage.
- Либо: добавить явный policy: Notion — canonical, repo docs — export pack (read-only mirror).

## Что уже сделано (Not)

- README (Notion) repo map переведён на `src/*`, `operators/*`, `worlds/*` и добавлена явная граница Render.
- SYSTEM_OVERVIEW: исправлен путь к protocol.ts и закреплена граница Render.
- DRIFT_LOG: санитизированы устаревшие `packages/*` ссылки и уточнён scope WorkbenchPolicy.
- RENDER_SURFACES_SPEC: maturity переведён в `contract` + добавлена scope-оговорка.
- ENGINE_DEVELOPER_GUIDE: исправлен путь к protocol.ts.

## Что сделано (Opus — repo)

- ✅ ADR-013 policy реализован в tooling:
    - `worlds/documentation-world/tools/rename-map.json` — маппинг `packages/engine/src/*` → `src/*` (49 записей + render out-of-scope)
    - `extractCodeArtifacts.js` — при отсутствии файла на диске ставит `status: legacy`, `missing: true`
    - `mergeSeed.js` — не удаляет legacy-узлы, читает rename-map, создаёт `redirect_to` + edge `redirects_to`
    - `operators/normalizeGraphByRedirects.js` — pre-pass: схлопывает redirect-цепочки, удаляет legacy-узлы, дедуплицирует рёбра
    - Нормализация подключена в `trace.js` (loadSeed), `runCompare.js`, и все тестовые beforeAll
    - 4 новых теста на normalizer (no-op, collapse, multi-hop chain, dedup)
- ✅ Commit: `feat(adr-013): implement code artifact identity redirects and graph normalization`
- ✅ 559 тестов зелёные

## Следующие действия

- NotionAI: сверить оставшиеся Notion-страницы на `packages/*` и `docs/spec/*` — список + правки.
- При следующем рефакторинге дерева: обновить `rename-map.json` в PR и запустить `node worlds/documentation-world/tools/extractCodeArtifacts.js && node worlds/documentation-world/tools/mergeSeed.js`.