# OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS

---

title: OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS

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

Block A (identity lock) is accepted.

Block C rename/export follow-up is accepted:

- canonical identity artifacts exist
- GraphIndexProjection rename is implemented
- export/deprecation surface is coherent

The next readiness step is to make the kernel guarantees legible and reviewable as engineering evidence.

This task should produce the first evidence-layer documents for Block B:

- invariant matrix
- proof obligations framing
- pointers to tests / current evidence

References:

- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAF%205a71404eb00941458c78832a43fc5446.md)
- Accepted tasks: [OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA](OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_%20528a1e43590546dabaf0dcef6c1ed9b9.md), [COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP](COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTI%20633bcba49a7642b9802c990cdf66c689.md), [COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP](COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AU%20d478a89ce4fc43178b42f0c14bc7983d.md)
- Existing docs (repo): `README.md`, `docs/ARCHITECTURE.md`, `docs/API_SURFACE_POLICY.md`, `docs/POSITIONING_MEMO.md`

## Goal

Produce the **kernel evidence framing** for Meaning Engine:

1) a clear invariant matrix,

2) a proof-obligations document,

3) explicit mapping from guarantees to existing tests/docs,

without changing runtime behavior.

## Opus — operating mode

You are Opus. This is an analysis + repo-docs task.

Your job is to:

- extract guarantees already supported by the current repository
- make claims only when grounded in code/tests/docs
- distinguish clearly between:
    - proven by tests
    - documented contract
    - intended but not yet fully evidenced
- avoid inflated formalism: this is engineering evidence, not fake theorem proving

## Scope

### Must do

1) Create `docs/INVARIANT_MATRIX.md`

Minimum structure per invariant:

- invariant ID
- short statement
- subsystem / scope
- evidence type
- where evidenced (tests/docs/code pointers)
- status:
    - evidenced
    - partially evidenced
    - intended / not yet evidenced

Minimum coverage expected (only if grounded):

- KE invariants
- NAV invariants
- PROJ invariant(s)
- any other invariant family already explicitly present in repo/docs

2) Create `docs/PROOF_OBLIGATIONS.md`

Explain, in engineering terms:

- what the project claims
- what kinds of evidence currently support those claims
- what is not proven
- where future evidence is still needed

Must include an explicit distinction between:

- deterministic behavior evidenced by tests
- public/documented contract
- assumptions / intended properties not yet fully locked down

3) Link evidence cleanly

Update whichever public-facing doc is most appropriate (README or a nearby docs page) with a short pointer to the new evidence docs, if this can be done without clutter.

4) Verify claim discipline

Any statement in the new docs must be grounded in:

- current repo behavior,
- tests,
- or already accepted docs.

Source-of-truth rule:

- tests and current repo behavior override older explanatory prose if they conflict.

No future-facing claims unless explicitly marked as future work / missing evidence.

### Should do (only if small and clearly in-scope)

- Add a compact summary table if it improves readability.

Evidence gaps (expected output):

- If meaningful evidence gaps are found, list them explicitly (3–7 items) with suggested next proof artifacts.

### Must NOT do

- Do not add new invariants just because they sound nice.
- Do not rewrite architecture docs broadly.
- Do not change runtime behavior.
- Do not add snapshot tests in this task.
- Do not invent formal proof language beyond what is honestly supported.

## Acceptance criteria

- `docs/INVARIANT_MATRIX.md` exists and is grounded in current repo/tests/docs.
- `docs/PROOF_OBLIGATIONS.md` exists and clearly separates evidenced vs intended claims.
- KE / NAV / PROJ families are covered if and only if grounded.
- Any evidence gaps are explicitly stated rather than hidden.
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
    - Evidence basis used

## Deliverables (report back here, RU)

### Implementation report

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- Tests run + result

### What changed (RU)

- List files changed
- Explain structure of invariant matrix
- Explain structure of proof obligations doc
- Note where evidence is strong vs partial

### Open questions / risks

- Which invariant claims remain partially evidenced
- Which next proof artifacts are most needed after B1

## Notes

- This is a docs/evidence task, not a runtime task.
- Honesty is more important than completeness.
- If some previously mentioned invariant family is not actually well grounded, mark it partial or intended — do not overclaim.

---

## Closeout (Notion)

Status: **accepted**

### Summary

B1 successfully opened Block B (Kernel evidence lock) and created the first evidence layer for the project:

- invariant matrix is assembled
- proof obligations document is created
- README has a small pointer to evidence docs
- evidenced / partial / intended distinction is now fixed in canon

### Completed

- `docs/INVARIANT_MATRIX.md` created (44 named invariants/properties with evidence status)
- `docs/PROOF_OBLIGATIONS.md` created (proven vs documented vs intended + explicit evidence gaps)
- `README.md` updated with a minimal pointer

### What is important to fix in canon

B1 does NOT prove the system stronger than before.

It makes the current evidence base and its gaps visible.

### Management note

Next step should be a proof-artifact follow-up (code + tests) closing the top evidence gaps, not another meta-document.

---

**Status: ✅ Done**

## Implementation report

- GitHub issue: [https://github.com/utemix-org/meaning-engine/issues/7](https://github.com/utemix-org/meaning-engine/issues/7)
- PR: [https://github.com/utemix-org/meaning-engine/pull/8](https://github.com/utemix-org/meaning-engine/pull/8)
- Branch: `readiness/b1-invariant-matrix`
- Commit: `6ee2c61`
- Tests: 671/671 pass (35 test files)

## Что изменилось

### Файлы

- `docs/INVARIANT_MATRIX.md` (новый) — матрица 44 инвариантов
- `docs/PROOF_OBLIGATIONS.md` (новый) — proof obligations + evidence gaps
- `README.md` — добавлен указатель на новые документы

### Структура INVARIANT_[MATRIX.md](http://MATRIX.md)

Матрица организована по 7 семействам:

- **KE** (5) — Knowledge Evolution: KE1–KE5
- **NAV** (5) — Navigation: NAV-1–NAV-5
- **PROJ** (5) — Projection: INV-1, INV-2, INV-3, INV-4, INV-7
- **Structural** (16) — Graph/Identity/Edge/Connectivity/Hierarchy
- **OP** (3) — Operator guarantees
- **ENG** (7) — Engine layer
- **CP** (3) — ChangeProtocol

Каждый инвариант: ID, утверждение, тип evidence, конкретные тесты/файлы, статус.

### Структура PROOF_[OBLIGATIONS.md](http://OBLIGATIONS.md)

7 секций: что заявляется, что доказано, что не доказано, что не заявляется, evidence gaps, source-of-truth правило, как обновлять.

### Где evidence сильный vs частичный

- **Сильный:** KE1–KE4, NAV-1–NAV-5, INV-3, INV-7, все операторы, весь engine layer (21 инвариант)
- **Частичный:** KE5, 5 structural через ChangeProtocol (6 инвариантов)
- **Intended (без тестов):** INV-1, INV-2, INV-4, 11 structural, 3 ChangeProtocol (17 инвариантов)

## Открытые вопросы / риски

1. **StructuralInvariants.js — 0 тестов.** 16 чекеров реализованы, ни один не протестирован напрямую.
2. **ChangeProtocol.js — 0 тестов.** Mutation control без покрытия.
3. **PROJ metadata invariants (INV-1, INV-2, INV-4)** заявлены в buildViewModel.js, но не подтверждены.
4. **highlightModel.js** — публичный API без тестов.
5. Следующий proof artifact после B1: тесты для StructuralInvariants + ChangeProtocol.