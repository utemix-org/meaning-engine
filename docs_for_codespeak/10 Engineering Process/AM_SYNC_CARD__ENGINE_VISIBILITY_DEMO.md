# AM_SYNC_CARD__ENGINE_VISIBILITY_DEMO

---

title: AM_SYNC_CARD__ENGINE_VISIBILITY_DEMO

kind: sync-card

project: Author World (vovaipetrova)

status: active

scope: now

---

## Purpose

Single operational panel for AM (Engine Visibility Demo): where canon lives (repo), what is validated (Opus), and what is next.

## Canon / sources of truth

- Repo (canon): [https://github.com/utemix-org/vovaipetrova](https://github.com/utemix-org/vovaipetrova)
- Notion (sync/status + task packaging): this page

## Language policy (private repo)

- Repo docs: RU
- Notion operational sync: RU
- Chat: RU

(Repo is private, so we optimize for author workflow convenience rather than external reviewer readability.)

## Track

- Notion track draft: [AM_TRACK__ENGINE_VISIBILITY__DRAFT](AM_TRACK__ENGINE_VISIBILITY__DRAFT%201122575d19bf44249f3e64ca761dd2da.md)

## Repo canon pointers (confirmed by Opus baseline sync)

- Track doc (repo): **НЕ НАЙДЕН** — `docs/tracks/` не существует
- Process docs (repo): **НЕ НАЙДЕНЫ** — `docs/process/` не существует
    - `docs/process/DEVELOPMENT_CHAIN.md` — отсутствует
    - `docs/process/CODEX_V2.md` — отсутствует
- Handoff note (repo): **НЕ НАЙДЕН** — `docs/handoffs/` не существует

**Фактические канонические доки в репо (main HEAD `c5c4261`):**

- `docs/INDEX.md` — документационный индекс (4 основных + 4 спеки + 2 reference)
- `docs/ARCHITECTURE.md` — 16 законов, 19 инвариантов (untracked/modified)
- `docs/PROVEN.md` — 5 execution contours, 12 assertions (untracked)
- `docs/PLAN.md` — текущее состояние + фазы (untracked)
- `docs/IDENTITY.md` — класс системы (untracked)
- `docs/spec/PROJECTION_SPEC.md`, `NAVIGATION_SPEC.md`, `RENDER_SURFACES_SPEC.md`, `KNOWLEDGE_LOG_SPEC.md`
- `llms.txt` — entry point / master formula
- `HISTORY.md` — хронологический changelog

**Примечание:** Рабочая директория содержит ~100 uncommitted changes (удалённые архивные docs, модифицированные engine/render файлы, новые untracked docs). Эти изменения НЕ закоммичены в main.

## Working branch / PR

- Branch: `engine-canon-separation` (from `main` / c5c4261)
- Commit: `c9defd6` — engine separation complete + `6092215` editor.html cleanup + `239d2d4` D5 computeViewModel + `de08401` D6A AI Atlas world + `479bcc7` D6B world loader + integration tests
- PR: ожидает merge-решение автора
- PR #3 (`feat/engine-visibility-demo-pack`): ChatGPT direction docs — **зелёный** (pr-format pass), ожидает ревью и merge

## Validation state (owned by Opus)

- Last validated commit SHA: `c5c4261f6247008522ff0286f383abeb56e385f5`
- Validated ref: `main` (HEAD)
- Validation date: 2026-03-23
- Validation result type: **clean validation**

### Validation details

| Команда | Результат |
| --- | --- |
| `node -v` | v20.17.0 |
| `npm -v` | 11.6.2 |
| `npm ci` | OK (194 packages, 4 moderate vulnerabilities) |
| `npm run test:engine` | **513 tests pass** (20 test files) |
| `npm run test:render` | **84 tests pass** (10 test files) |
| `npm run build` | OK (486 modules, 6.16s) |
| `npm run dev` (Universe/Render) | OK — [http://localhost:5173/](http://localhost:5173/) — 3D force-graph визуализация работает |
| Блокеры | **Нет** |

## Current status

- Phase: engine canon separation — **DONE**
- Branch: `engine-canon-separation` (SHA `c9defd6`)
- Blockers: **нет**
- D7: [OPUS_TASK__AM__D7__UO_OBSERVATION_CONTRACT_AND_RESOURCE_AUTHORITY](OPUS_TASK__AM__D7__UO_OBSERVATION_CONTRACT_AND_RES%20ba78a01dc41648eca4fffb089556e16b.md) — accepted. Resource authority добавлена как 4-я ось. Follow-up: возможно понадобится трёхчленка local / cheap-server / expensive-server.
- D7B: [OPUS_TASK__AM__D7B__MINIMAL_UI_VIEWER_FOR_DEMO_VIEWMODEL](OPUS_TASK__AM__D7B__MINIMAL_UI_VIEWER_FOR_DEMO_VIE%20d597b32919ee4a129b3e26c483169b40.md) — accepted (with scope note): viewer принят как minimal architectural viewer, не как public UO-ready UI.
- D8: [OPUS_TASK__AM__D8__SEMANTIC_VISIBILITY_REFINEMENT_FOR_VIEWER](OPUS_TASK__AM__D8__SEMANTIC_VISIBILITY_REFINEMENT_%205dee6bf58ab24ad68a69f2007242652d.md) — accepted. Distinctions видимы (worldKind, canonical/possible, epistemic). Но engine-native navigation feeling для UO ещё не доказан.
- D9: [OPUS_TASK__AM__D9__FOCUS_ROUTE_SEMANTICS_FOR_VIEWER](OPUS_TASK__AM__D9__FOCUS_ROUTE_SEMANTICS_FOR_VIEWE%20d97eaa0da374489d942203c8391a8e4c.md) — accepted. Route trail + scope bar сделали наблюдаемым движение фокуса (для author viewer), ограничения признаны truthfully.
- D10: mode toggle (Lua/Dizy) в viewer — [OPUS_TASK__AM__D10__MODE_TOGGLE_LUA_DIZY_IN_VIEWER](OPUS_TASK__AM__D10__MODE_TOGGLE_LUA_DIZY_IN_VIEWER%203b3e76e191f04a6ba7508d571ed5a029.md) — accepted. Proven: same focus → different assembly → different route bias. SHA `94bcd86`.
- Next step (draft): entry points / index layer — как открывать 2–4 релевантных lens по контексту (не 12 всегда).

Дополнительно (в фоне, не блокирует D8): в `meaning-engine` добавить `specification/` в `files` и опубликовать patch (чтобы убрать workaround с `meaning-engine/core`).

### Наблюдения

- Working tree содержит ~100 uncommitted changes (удалённые/модифицированные файлы от предыдущих сессий ChatGPT)
- Process/track/handoff docs ожидавшиеся в sync card — не существуют в репо
- Universe/Render (3D visitor) — помечен автором как **важный набросок** для сохранения
- Universe/Render/public/graph/editor.html — помечен как ненужный (к удалению позже)

## Links

- Repo root: [https://github.com/utemix-org/vovaipetrova](https://github.com/utemix-org/vovaipetrova)
- Docs index (repo): [https://github.com/utemix-org/vovaipetrova/blob/main/docs/INDEX.md](https://github.com/utemix-org/vovaipetrova/blob/main/docs/INDEX.md)