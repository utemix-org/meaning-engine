# OPUS_TASK__ME_READINESS__B4__HIGHLIGHT_MODEL_EVIDENCE_AND_BLOCK_B_CONSOLIDATION

---

title: OPUS_TASK__ME_READINESS__B4__HIGHLIGHT_MODEL_EVIDENCE_AND_BLOCK_B_CONSOLIDATION

kind: engineering-task

project: Meaning Engine

owner: Opus

status: accepted

track: ME_READINESS

block: B (Kernel evidence lock)

languages:

repo: en

notion: ru

---

## Context

B1 created the Block B evidence framing.

B2 closed the StructuralInvariants / ChangeProtocol direct-evidence gaps.

B3 closed the projection metadata / GraphSnapshot / KE5 edge-case gaps.

The most visible remaining stable-surface evidence gap is now:

- `src/highlight/highlightModel.js` (public API surface, no dedicated tests)

This task should:

1) add direct evidence for the highlight model,

2) make a small Block B consolidation pass only where warranted,

without reopening already-closed work.

References:

- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT.md)
- Accepted tasks: [OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA](OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA.md), [COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP](COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP.md), [COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP](COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP.md), [OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS](OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS.md), [OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS](OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS.md), [OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE](OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE.md)
- Evidence docs: `docs/INVARIANT_MATRIX.md`, `docs/PROOF_OBLIGATIONS.md`

## Goal

Add direct test evidence for the highlight model and perform a narrow consolidation pass on Block B evidence docs, without changing runtime behavior unless a discovered bug makes a minimal fix necessary.

## Opus — operating mode

You are Opus. This is a proof-artifact and consolidation task.

Your job is to:

- close the most visible remaining stable-surface evidence gap
- avoid reopening already-settled work
- keep claims narrow and grounded
- distinguish between:
    - proving current behavior,
    - discovering a real bug,
    - making a minimal docs consolidation after recent evidence growth

## Scope

### Must do

0) Verify public-surface intent (record explicitly)

Verify whether `highlightModel` is still intended as part of the stable/public surface under current export/docs policy, and record the result explicitly in the report.

1) Add dedicated tests for `src/highlight/highlightModel.js`

Cover the currently documented and actually implemented behavior of the highlight model.

Minimum expected coverage:

- creation / construction behavior
- pure-function / no-side-effects behavior (if meaningfully testable)
- output shape and field behavior
- edge cases already implied by current implementation/comments
- any public-facing guarantees already exposed through exports/docs

Do not invent stronger guarantees than the current implementation actually supports.

2) Minimal bug fixes if needed

If tests reveal a real defect:

- fix only the minimal implementation necessary
- describe the defect clearly in the report
- do not opportunistically refactor adjacent code

3) Narrow Block B consolidation pass

Only if warranted by the new tests:

- update `docs/INVARIANT_MATRIX.md`
- update `docs/PROOF_OBLIGATIONS.md`
- optionally add one short clarification note if a previously broad statement should now be narrowed or clarified

This is not a broad documentation rewrite.

### Should do (only if small and clearly in-scope)

- Add one tiny fixture helper if it reduces duplication.
- Add one regression test for an edge case discovered during test writing.

### Must NOT do

- Do not broaden this into a general highlight/render subsystem rewrite.
- Do not expand public promise.
- Do not revisit already-closed B2/B3 statuses unless new tests directly contradict them.
- Do not add new invariant families just for completeness.

## Acceptance criteria

- Dedicated tests exist for `highlightModel.js`.
- Any implementation fixes are minimal, justified, and directly tied to failing tests.
- If evidence docs changed, the change is narrow and directly supported by the new tests.
- All tests pass (`npm test`).
- No unrelated runtime/API behavior changes.

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
    - Whether any bugs were found
    - Whether any Block B doc consolidation was needed

## Deliverables (report back here, RU)

### Implementation report

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- Tests run + result

### What changed (RU)

- List files changed
- Summarize new highlight model tests
- Note whether any implementation bugs were found and fixed
- Note whether any evidence-doc consolidation was made (if no consolidation was needed, state that explicitly)

### Evidence impact (RU)

- Which remaining Block B gap is now closed or reduced
- Exact IDs/statuses changed (if any)
- What still remains outside Block B stable core evidence

### Open questions / risks

- Any highlight behavior that remains under-specified
- Any doc statement that still feels broader than the current test evidence

## Notes

- This task is intended as a narrow Block B finisher.
- Honest narrowing is better than artificial completeness.
- If highlightModel turns out to be less stable/public than assumed, record that explicitly rather than overclaiming.

---

## Closeout (Notion)

Status: **accepted**

### Summary

B4 closed the last visible stable-surface evidence gap inside Block B:

- `highlightModel.js` now has dedicated tests
- its public behavior and documented boundary are explicit
- Block B evidence docs are consolidated accordingly

### Completed

- highlight model stable/public surface now has direct evidence
- documented boundary recorded: `computeHighlight` does not validate that context IDs exist in the graph (nonexistent IDs may still appear by design)
- remaining evidence work is now mostly outside stable core or in experimental tracks

### Important claim-discipline note

B4 does not expand public promise beyond current implementation.

It fixes tested current highlight behavior and its boundary.

### Management note

After B4, Block B can be considered closed for stable core evidence.

Next: move to Block D (operational envelope) before Block E.

---

**Status: ✅ Done**

## Отчёт о реализации

### GitHub

- Issue: [https://github.com/utemix-org/meaning-engine/issues/13](https://github.com/utemix-org/meaning-engine/issues/13)
- PR: [https://github.com/utemix-org/meaning-engine/pull/14](https://github.com/utemix-org/meaning-engine/pull/14)
- Branch: `readiness/b4-highlight-model-evidence`
- Commit: `10dfeaa`
- Тесты: 905 passed, 0 failed

### Публичная поверхность

Подтверждено: `highlightModel.js` является частью публичного API:

- `package.json` exports: `"./highlight": "./src/highlight/highlightModel.js"`
- `API_SURFACE_POLICY.md`: `meaning-engine/highlight` — public

### Что изменилось

**Новый файл:**

- `src/highlight/__tests__/highlightModel.test.js` — 56 тестов
    - INTENSITY константы: 1 тест
    - createEmptyContext: 2 теста (структура, изоляция)
    - createContextFromState: 3 теста (маппинг legacy-полей, дефолты, копирование Set)
    - Режим "none": 6 тестов (все DIM, структура выхода)
    - Режим "selected": 6 тестов (FULL/HALF/DIM интенсивности)
    - Режим "hover": 5 тестов (node+widget hover, соседи FULL, selected сохраняется)
    - Режим "scope": 6 тестов (scope-узлы + соседи FULL, несвязанные DIM)
    - Режим "type": 5 тестов (type-узлы FULL, rёбра selected HALF)
    - Приоритет режимов: 5 тестов (scope > hover > type > selected > none)
    - Чистота функции: 5 тестов (нет мутации, детерминизм, 100x)
    - Edge cases: 6 тестов (пустой граф, несуществующие ID, объектные endpoints)
    - Контракт выхода: 3 теста (HighlightState shape, mode enum, intensity values)

**Изменённые файлы:**

- `docs/PROOF_OBLIGATIONS.md` — раздел 3.4 закрыт; gap #1 закрыт; остался только Cabin pipeline

### Баги

Не обнаружены. `computeHighlight` работает корректно.

### Влияние на evidence

| Gap | Было | Стало |
| --- | --- | --- |
| Highlight model | no tests (документационный gap) | **56 тестов, gap закрыт** |

Все 44 инварианта остаются evidenced (44/44). Highlight model не определяет именованных инвариантов — он покрыт как публичный API surface.

### Block B консолидация

После B4 все стабильные поверхности Block B покрыты тестами:

- B1: evidence framing (документация)
- B2: StructuralInvariants + ChangeProtocol (84 теста)
- B3: projection metadata + GraphSnapshot + KE5 (94 теста)
- B4: highlight model (56 тестов)

Остающийся gap: Cabin diagnostic pipeline (экспериментальный модуль, за пределами stable core).

### Открытые вопросы

- `computeHighlight` не валидирует принадлежность ID к графу. Несуществующие ID добавляются в intensity map с декларированной интенсивностью. Это по дизайну (чистая модель без валидации графа), но заслуживает документирования в JSDoc.