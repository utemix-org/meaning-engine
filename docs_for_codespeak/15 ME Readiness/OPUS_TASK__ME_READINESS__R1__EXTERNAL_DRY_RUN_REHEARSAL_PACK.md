# OPUS_TASK__ME_READINESS__R1__EXTERNAL_DRY_RUN_REHEARSAL_PACK

---

title: OPUS_TASK__ME_READINESS__R1__EXTERNAL_DRY_RUN_REHEARSAL_PACK

kind: engineering-task

project: Meaning Engine

owner: Opus

status: accepted

track: ME_READINESS

block: Delivery rehearsal

languages:

repo: en

notion: ru

---

## Context

Meaning Engine now has:

- identity lock
- trust-surface cleanup
- stable-core evidence lock
- first operational envelope
- first external proof case
- presentation package v1.1
- objections / refinement pass

The next useful step is not more packaging, but rehearsal readiness:

turn the presentation package into something that can actually be delivered in a first external dry run.

This task should prepare a practical rehearsal pack, not create new technical evidence.

References:

- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT.md)
- Accepted tasks: [OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA](OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA.md), [COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP](COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP.md), [COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP](COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP.md), [OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS](OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS.md), [OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS](OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS.md), [OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE](OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE.md), [OPUS_TASK__ME_READINESS__B4__HIGHLIGHT_MODEL_EVIDENCE_AND_BLOCK_B_CONSOLIDATION](OPUS_TASK__ME_READINESS__B4__HIGHLIGHT_MODEL_EVIDENCE_AND_BLOCK_B_CONSOLIDATION.md), [OPUS_TASK__ME_READINESS__D1__BENCHMARK_HARNESS_AND_OPERATIONAL_LIMITS_NOTE](OPUS_TASK__ME_READINESS__D1__BENCHMARK_HARNESS_AND_OPERATIONAL_LIMITS_NOTE.md), [OPUS_TASK__ME_READINESS__E1__SPEC_CODE_TEST_TRACEABILITY_WORLD_AND_DEMO_PACK](OPUS_TASK__ME_READINESS__E1__SPEC_CODE_TEST_TRACEABILITY_WORLD_AND_DEMO_PACK.md), [OPUS_TASK__ME_READINESS__P1__ENGINEERING_PRESENTATION_PACK_V1](OPUS_TASK__ME_READINESS__P1__ENGINEERING_PRESENTATION_PACK_V1.md), [OPUS_TASK__ME_READINESS__P2__PRESENTATION_OBJECTIONS_AND_REFINEMENT_PASS](OPUS_TASK__ME_READINESS__P2__PRESENTATION_OBJECTIONS_AND_REFINEMENT_PASS.md)
- Presentation pack (repo):
 - `docs/presentation/PRESENTATION_NARRATIVE.md`
 - `docs/presentation/TALK_OUTLINE.md`
 - `docs/presentation/DEMO_FLOW.md`
 - `docs/presentation/CLAIMS_AND_NONCLAIMS.md`
 - `docs/presentation/DELIVERY_RISK_NOTE.md`

## Goal

Create a first external dry-run rehearsal pack for Meaning Engine:

1) a delivery script / speaker notes,

2) a timing plan,

3) a dry-run checklist,

4) a failure-handling / fallback checklist,

…without adding new technical scope.

## Opus — operating mode

You are Opus. This is a delivery-rehearsal task.

Your job is to:

- turn the current package into something that can be rehearsed and delivered
- reduce delivery ambiguity
- preserve truthful-claim discipline
- prefer practical speaking guidance over rhetorical flourish

## Scope

Rehearsal artifacts output paths (repo)

Create these files under `docs/presentation/`:

- `docs/presentation/DELIVERY_SCRIPT.md`
- `docs/presentation/TIMING_PLAN.md`
- `docs/presentation/DRY_RUN_CHECKLIST.md`
- `docs/presentation/FAILURE_HANDLING_CHECKLIST.md`

### Must do

1) Create a delivery script / speaker notes

A concise speaking guide tied to the existing talk outline:

- what to say in sequence
- where to slow down
- where to emphasize boundaries
- where to proactively disclaim scale/limitations
- what to avoid saying

2) Create a timing plan

A realistic timing breakdown for:

- 5-minute version
- 15-minute version

Include:

- target durations per section
- optional cuts if running long
- points where live demo can be shortened safely

3) Create a dry-run checklist

A practical checklist for rehearsing.

Must include an ordered preflight sequence of commands/results to verify before speaking.

Checklist should cover:

- repo state
- commands to pre-run
- what outputs to verify
- what to memorize vs what to read
- what objections to rehearse explicitly

4) Create a failure-handling / fallback checklist

What to do if:

- the demo output is noisy
- a command fails
- time is cut short
- the audience pushes on scale, novelty, or users
- someone asks about GraphRAG / LLM / production readiness

### Should do (only if small and clearly in-scope)

- Add one “minimum viable talk” version.
- Add one “if interrupted after 3 minutes” salvage plan.

### Must NOT do

- Do not create new technical artifacts.
- Do not add new claims.
- Do not rewrite the presentation package broadly.
- Do not add a second use-case here.
- Do not invent audience feedback that does not exist.

## Acceptance criteria

- A delivery script / speaker notes doc exists.
- A timing plan exists for 5-minute and 15-minute versions.
- A dry-run checklist exists.
- A fallback / failure-handling checklist exists.
- No runtime/API behavior changes.
- All tests pass (`npm test`).

## Observability / process

- Issue-first:
 - Create a GitHub issue for this task unless one already exists.
 - Open a PR that links the issue and closes it.
- Commit messages: EN.
- PR description must include:
 - Goal
 - Non-goals
 - Acceptance checklist
 - Files changed
 - Which parts of delivery were made safer
 - Which risks remain

## Deliverables (report back here, RU)

### Implementation report

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- Tests run + result

### What changed (RU)

- List files changed
- Summarize the delivery script
- Summarize the timing plan
- Summarize the dry-run checklist
- Summarize the fallback/failure-handling checklist

### Delivery value (RU)

- What this now makes easier to rehearse/deliver
- Which presentation risks were reduced
- Which live-delivery risks still remain

### Open questions / risks

- Any part of the talk still too dense
- Any point where demo dependence remains too high
- Whether the next step should be a real external dry run or E2

## Notes

- This is a rehearsal-preparation task, not a new presentation-packaging task.
- Practical clarity beats elegant prose.
- The goal is to make the first delivery safer, not more impressive.

---

## Closeout (Notion)

Status: **accepted**

### Summary

R1 turned the presentation package into a rehearsal-ready delivery set:

- speaker notes created
- timing plan created
- dry-run checklist created
- failure-handling checklist created

### Completed

- first external dry run is now easier to rehearse and deliver safely
- timing ambiguity is reduced
- fallback handling is explicit
- objection handling under live pressure is more structured

### Important note

R1 does NOT add new technical evidence or new public claims.

It makes first delivery materially safer.

### Management note

Next step: do an actual external dry run using this pack.

After real observations exist, open R2 (post-dry-run feedback & adjustments).

---

**Status: ✅ Done**

## Implementation report

**GitHub issue**: [https://github.com/utemix-org/meaning-engine/issues/24](https://github.com/utemix-org/meaning-engine/issues/24)

**PR**: [https://github.com/utemix-org/meaning-engine/pull/25](https://github.com/utemix-org/meaning-engine/pull/25)

**Branch**: `readiness/r1-dry-run-rehearsal-pack`

**Commit**: `983d2c8`

**Tests**: 930 passed (41 files), 0 failed. No runtime/API changes.

## Что изменилось

### Файлы

- `docs/presentation/DELIVERY_SCRIPT.md` (**новый**) — speaker notes для 5-мин и 15-мин версий
- `docs/presentation/TIMING_PLAN.md` (**новый**) — тайминги, опциональные сокращения, minimum viable talk
- `docs/presentation/DRY_RUN_CHECKLIST.md` (**новый**) — preflight, репетиционный фреймворк, чеклист окружения
- `docs/presentation/FAILURE_HANDLING_CHECKLIST.md` (**новый**) — 15 failure scenarios с протоколами реагирования

### Delivery script (speaker notes)

- Beat-by-beat инструкции для 5-минутной (4 beats) и 15-минутной (7 beats) версий
- Маркеры `[SLOW]`, `[PAUSE]`, `[DISCLAIM]`, `[AVOID]` для каждого момента
- Q&A delivery notes: правило повтора вопроса, ссылки на артефакты, emergency answer

### Timing plan

- Таблицы с target/hard limit для каждого beat
- Опциональные сокращения при отставании от графика
- Сокращение демо: 4 варианта по доступному времени
- Minimum viable talk (3 минуты) и salvage plan (если прерваны после 3 минут)

### Dry-run checklist

- 7-шаговый упорядоченный preflight (репо, node, npm install, test, demo, bench, report)
- Разделение: что запомнить (6 пунктов) vs что можно читать vs что никогда не читать дословно
- Репетиционный фреймворк (2 solo прогона) с таблицей замеров
- Репетиция возражений (O1–O5) с ограничением 15–30с на ответ
- Чеклист окружения (перед выходом + на месте) и post-rehearsal review

### Failure handling checklist

- **15 сценариев сбоев** с detection → response → recovery:
 - F1–F3: сбои демо (команда не работает, шумный вывод, неожиданные результаты)
 - F4–F6: давление времени (сокращение, опоздание, прерывание)
 - F7–F12: давление аудитории (новизна, масштаб, GraphRAG, пользователи, применение, неизвестный вопрос)
 - F13–F15: сбои окружения (проектор, ноутбук, Node.js)
- Эскалационные лестницы (уровень 1→2→3) для F7 и F8
- Quick reference таблица: failure → first action → fallback

## Delivery value

### Что стало проще репетировать/деливерить

- Презентация полностью скриптована beat-by-beat — не нужно импровизировать
- Точно известно, где сокращать при нехватке времени
- Каждый возможный сбой имеет протокол реагирования
- Preflight гарантирует работоспособность демо до выступления

### Какие риски снижены

- Риск превышения времени → опциональные сокращения на каждом beat
- Риск паники при сложном вопросе → эскалационные лестницы для 5 самых тяжёлых возражений
- Риск технического сбоя → 5 уровней фолбэка для демо
- Риск неподготовленности → полный preflight + environment checklist

### Какие риски остались

- Demo dependence: толк сильнее всего с живым демо; verbal-only теряет импакт
- «Что бы я построил с этим?» — самый слабый ответ; нет интеграционного демо
- Масштаб: честный ответ есть, но может не удовлетворить аудиторию, ожидающую 10k+ нод

## Open questions / risks

- Самое плотное место в толке: beat 3 (guarantees & evidence) в 15-мин версии — 3 минуты на инварианты может быть много для некоторых аудиторий
- Demo dependence остаётся высокой — вербальное изложение сценариев без терминала заметно слабее
- Следующий шаг: реальный внешний dry-run (если есть аудитория) или E2 (интеграционный пример) для усиления ответа на «Что бы я построил?»