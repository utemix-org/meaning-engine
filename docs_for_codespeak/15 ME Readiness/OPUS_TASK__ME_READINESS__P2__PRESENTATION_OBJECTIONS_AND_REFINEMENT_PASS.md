# OPUS_TASK__ME_READINESS__P2__PRESENTATION_OBJECTIONS_AND_REFINEMENT_PASS

---

title: OPUS_TASK__ME_READINESS__P2__PRESENTATION_OBJECTIONS_AND_REFINEMENT_PASS

kind: engineering-task

project: Meaning Engine

owner: Opus

status: accepted

track: ME_READINESS

block: Presentation refinement

languages:

repo: en

notion: ru

---

## Context

P1 created the first engineering-presentation package for Meaning Engine:

- presentation narrative
- talk/slide outline
- demo flow
- claims / non-claims sheet

Before creating additional use-cases or polishing slides, the next useful step is to pressure-test this package against likely engineering objections and refine the wording where needed.

This task should improve presentation robustness, not create new technical scope.

References:

- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT.md)
- Accepted tasks: [OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA](OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA.md), [COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP](COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP.md), [COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP](COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP.md), [OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS](OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS.md), [OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS](OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS.md), [OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE](OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE.md), [OPUS_TASK__ME_READINESS__B4__HIGHLIGHT_MODEL_EVIDENCE_AND_BLOCK_B_CONSOLIDATION](OPUS_TASK__ME_READINESS__B4__HIGHLIGHT_MODEL_EVIDENCE_AND_BLOCK_B_CONSOLIDATION.md), [OPUS_TASK__ME_READINESS__D1__BENCHMARK_HARNESS_AND_OPERATIONAL_LIMITS_NOTE](OPUS_TASK__ME_READINESS__D1__BENCHMARK_HARNESS_AND_OPERATIONAL_LIMITS_NOTE.md), [OPUS_TASK__ME_READINESS__E1__SPEC_CODE_TEST_TRACEABILITY_WORLD_AND_DEMO_PACK](OPUS_TASK__ME_READINESS__E1__SPEC_CODE_TEST_TRACEABILITY_WORLD_AND_DEMO_PACK.md), [OPUS_TASK__ME_READINESS__P1__ENGINEERING_PRESENTATION_PACK_V1](OPUS_TASK__ME_READINESS__P1__ENGINEERING_PRESENTATION_PACK_V1.md)
- Presentation pack (repo):
    - `docs/presentation/PRESENTATION_NARRATIVE.md`
    - `docs/presentation/TALK_OUTLINE.md`
    - `docs/presentation/DEMO_FLOW.md`
    - `docs/presentation/CLAIMS_AND_NONCLAIMS.md`

## Goal

Pressure-test the presentation package against likely engineering objections and produce a refined presentation package v1.1:

1) likely objections inventory,

2) weak-point analysis,

3) wording refinements where needed,

4) a short delivery-risk note,

…without changing technical scope or inventing new evidence.

## Opus — operating mode

You are Opus. This is a presentation-refinement task.

Your job is to:

- read the package like a skeptical engineering audience would
- identify where phrasing is too strong, too vague, or too abstract
- refine wording without weakening true strengths
- preserve truthful-claim discipline at all times

## Scope

### Must do

1) Create an objections inventory

List the most likely engineering objections/questions.

Prioritization rule: prioritize objections that could most quickly damage trust in an engineering room.

Examples:

- why not just use a graph database?
- how is this different from GraphRAG?
- why does a 21-node case matter?
- what happens on large or adversarial graphs?
- is this a library, a framework, or a product?
- what is actually novel here?

2) Analyze weak points in P1

Identify where the current package may be:

- too abstract
- too strong in wording
- too weakly grounded
- too easy to misunderstand

3) Refine P1 wording where warranted

Make narrow improvements only where the current wording would likely create confusion or overclaim risk.

Possible target docs:

- `docs/presentation/PRESENTATION_NARRATIVE.md`
- `docs/presentation/TALK_OUTLINE.md`
- `docs/presentation/CLAIMS_AND_NONCLAIMS.md`
- `docs/presentation/DEMO_FLOW.md`

4) Create a short delivery-risk note

Output location: either (A) a separate doc under `docs/presentation/DELIVERY_RISK_NOTE.md`, or (B) a clearly labeled section inside `docs/presentation/TALK_OUTLINE.md`.

A compact note for the presenter:

- what to say carefully
- what to proactively disclaim
- which audience questions are most important to prepare for

### Should do (only if small and clearly in-scope)

- Add one “hostile but fair reviewer” section.
- Add one “shortest safe answer” version for the 5 hardest questions.

### Must NOT do

- Do not create new technical artifacts.
- Do not change public promise.
- Do not add a new use-case.
- Do not rewrite the package broadly if only narrow refinements are needed.
- Do not invent evidence that does not already exist.

## Acceptance criteria

- An objections inventory exists.
- Likely weak points in P1 are identified explicitly.
- Any refinements to P1 are narrow and justified.
- A delivery-risk note exists.
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
    - Which objections were treated as highest priority
    - Which refinements were made and why

## Deliverables (report back here, RU)

### Implementation report

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- Tests run + result

### What changed (RU)

- List files changed
- Summarize the objections inventory
- Summarize the weak-point analysis
- Summarize the refinements
- Summarize the delivery-risk note

### Presentation value (RU)

- What this refinement now makes safer/easier
- Which overclaim risks were reduced
- Which objections are still hardest to answer

### Open questions / risks

- Any part of the package that still feels fragile
- Any objection that still points to a real missing artifact
- Whether the next step should be E2 or actual external dry-run preparation

## Notes

- This is a refinement task, not a packaging-from-scratch task.
- Narrow, evidence-preserving edits are preferred.
- The goal is not to sound stronger; the goal is to become harder to misunderstand.

---

## Closeout (Notion)

Status: **accepted**

### Summary

P2 pressure-tested the first presentation package against likely engineering objections and refined the wording where misunderstanding risk was highest:

- objections inventory added
- weak points identified explicitly
- narrow refinements applied
- delivery-risk note created

### Completed

- presentation package v1.1 is more robust against skeptical engineering audiences
- strongest trust-damaging questions now have prepared answers
- key overclaim/misunderstanding risks in P1 were reduced without changing technical scope

### Important note

P2 does NOT create new technical artifacts or evidence.

It makes existing presentation material safer, clearer, and harder to misread.

### Management note

Next recommended step: R1 external dry-run rehearsal pack.

---

**Status: ✅ Done**

## Implementation report

**GitHub issue**: [https://github.com/utemix-org/meaning-engine/issues/22](https://github.com/utemix-org/meaning-engine/issues/22)

**PR**: [https://github.com/utemix-org/meaning-engine/pull/23](https://github.com/utemix-org/meaning-engine/pull/23)

**Branch**: `readiness/p2-presentation-objections-refinement`

**Commit**: `0a76726`

**Tests**: 930 passed (41 files), 0 failed. No runtime/API changes.

## Что изменилось

### Файлы

- `docs/presentation/DELIVERY_RISK_NOTE.md` (**новый**) — inventory возражений, weak-point analysis, shortest safe answers, delivery risk summary
- `docs/presentation/PRESENTATION_NARRATIVE.md` — узкие правки формулировок
- `docs/presentation/TALK_OUTLINE.md` — новые Q&A, примеры инвариантов, сокращение демо
- `docs/presentation/CLAIMS_AND_NONCLAIMS.md` — исправление overclaim, guidance
- `docs/presentation/DEMO_FLOW.md` — новые anti-patterns, кларификация gap detection

### Objections inventory (10 возражений в 3 тиерах)

- **Tier 1 (уничтожают доверие)**: O1 «Что здесь нового?», O2 «21 нода — это же тривиально», O3 «Кто этим пользуется?»
- **Tier 2 (эрозия доверия)**: O4 «Чем отличается от Neo4j?», O5 «Это библиотека, фреймворк или продукт?», O6 «44 инварианта — это padding?», O7 «Bridge candidates — просто lookup table?»
- **Tier 3 (управляемые)**: O8–O10 (масштаб, LLM, адверсарные графы)

### Weak-point analysis (7 слабых мест)

- WP1: «Computational substrate» слишком абстрактно без конкретного примера
- WP2: «Any typed semantic graph» — overclaim (не любой граф, а только соответствующий JSON input contract)
- WP3: Вопрос «Что нового?» отсутствовал в Q&A
- WP4: 5-минутный толк пытался показать 3 результата за 2 минуты
- WP5: Семейства инвариантов названы, но не проиллюстрированы
- WP6: Нет ответа на «Кто этим пользуется?»
- WP7: Bridge candidates описаны как «предложения», хотя это lookup table

### Рефайнменты

- Все правки узкие и обоснованные (см. таблицу в PR)
- Новые evidence не изобретены
- Public promise не изменён

### Delivery risk note

- Таблица «говорить осторожно» (5 тем)
- Список «проактивно дисклеймить» (5 пунктов)
- Наиболее важные вопросы для подготовки (5 вопросов)

## Presentation value

### Что стало безопаснее/проще

- Вопросы «Что нового?» и «Кто пользуется?» теперь имеют подготовленные ответы
- «Substrate» заземлён конкретным примером при первом употреблении
- 5-минутный толк не перегружен (сокращен до 2 демо-результатов)
- Инварианты проиллюстрированы примерами — число 44 не выглядит как padding

### Какие риски overclaim снижены

- «Any typed semantic graph» → «any graph conforming to the JSON input contract»
- Bridge candidates явно описаны как эвристики на основе type-pair lookup table
- «Intelligent» / «novel» добавлены в wording guidance как слова, которых следует избегать

### Какие возражения всё ещё самые сложные

- **O1 «Что нового?»** — ответ подготовлен, но он честно опирается на «композицию + дисциплину evidence», а не на алгоритмическую новизну. Скептик может счесть это недостаточным.
- **O2 «21 нода?»** — фрейминг подготовлен, но реально убедил бы только более крупный пример.
- **O3 «Кто пользуется?»** — честный ответ «nikto eshchyo» правильный, но некоторые аудитории воспримут его как дисквалификацию.

## Open questions / risks

- Самое хрупкое место: аргумент новизны. Ответ «композиция + evidence discipline» честный, но может не убедить аудиторию, ожидающую алгоритмическую новизну.
- Hostile-but-fair reviewer указывает на реальный недостающий артефакт: пример интеграции (движок встроен в реальный workflow, даже toy-scale). Это могло бы быть E2.
- Следующий шаг: вероятно E2 (новый use-case или интеграционный пример) или подготовка к реальному dry-run перед аудиторией.