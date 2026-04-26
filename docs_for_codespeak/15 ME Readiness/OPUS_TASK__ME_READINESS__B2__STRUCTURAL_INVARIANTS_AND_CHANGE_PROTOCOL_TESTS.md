# OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS

---

title: OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS

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

B1 is accepted:

- `docs/INVARIANT_MATRIX.md` exists
- `docs/PROOF_OBLIGATIONS.md` exists
- major evidence gaps are now explicitly recorded

The highest-priority evidence gaps identified in B1 are:

1) `src/core/StructuralInvariants.js` — 16 implemented checkers, 0 dedicated tests

2) `src/core/ChangeProtocol.js` / `ProposalValidator` — mutation safety path, 0 dedicated tests

This task should turn those two gaps into direct evidence.

References:

- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT.md)
- Accepted tasks: [OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA](OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA.md), [COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP](COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP.md), [COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP](COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP.md), [OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS](OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS.md)
- Evidence docs: `docs/INVARIANT_MATRIX.md`, `docs/PROOF_OBLIGATIONS.md`

## Goal

Add direct test evidence for:

1) Structural invariants checker functions

2) ChangeProtocol / ProposalValidator mutation-control flow

…without changing runtime behavior unless a discovered bug makes a minimal fix necessary.

## Opus — operating mode

You are Opus. This is a proof-artifact task.

Your job is to:

- close the most critical evidence gaps identified in B1
- prefer narrow, reviewable tests over broad refactors
- distinguish clearly between:
    - adding tests for intended behavior
    - discovering a real bug
    - changing implementation only if necessary and minimal
- keep claim discipline: do not over-upgrade statuses beyond what tests actually prove

## Scope

### Must do

1) Add dedicated tests for `StructuralInvariants.js`

Create a focused test file covering the checker families implemented there.

Minimum expected coverage:

- Graph invariants
- Identity invariants
- Edge invariants
- Connectivity invariants
- Hierarchy invariants

Approach:

- for each checker, include at least one passing case and one violating case where reasonable
- if a checker cannot be tested with a simple violating case due to shared validation path or current implementation shape, record that explicitly (do not force artificial coverage)
- keep fixtures small and explicit
- do not rewrite the invariant implementation unless necessary to fix a demonstrated bug

2) Add dedicated tests for `ChangeProtocol.js` / `ProposalValidator`

Minimum expected coverage:

- proposal → validate → apply happy path
- rejection on structural invariant violation
- simulate / dry-run path if supported
- history recording
- interaction with strictness level actually used in current code

3) If tests reveal real bugs

- fix only the minimal implementation necessary
- describe the bug clearly in the report
- do not opportunistically refactor adjacent code

4) Update evidence docs only if warranted

If and only if new tests materially change evidence status:

- update relevant rows in `docs/INVARIANT_MATRIX.md`
- update relevant gaps in `docs/PROOF_OBLIGATIONS.md`
- when updating evidence docs, only change statuses that are directly supported by the new tests added in this PR

### Should do (only if small and clearly in-scope)

- Add one tiny shared fixture helper for graph test setup if it reduces duplication.
- Add one regression test for GraphSnapshot immutability only if naturally adjacent and small.

### Must NOT do

- Do not broaden this into a general core test overhaul.
- Do not add unrelated tests outside StructuralInvariants / ChangeProtocol / directly adjacent support.
- Do not rewrite architecture docs broadly.
- Do not change public promise.
- Do not “upgrade” evidence statuses without actual passing tests.

## Acceptance criteria

- Dedicated tests exist for `StructuralInvariants.js`.
- Dedicated tests exist for `ChangeProtocol.js` / `ProposalValidator`.
- Any implementation fixes are minimal, justified, and directly tied to failing tests.
- If evidence status changed, evidence docs are updated accordingly.
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
    - Which evidence gaps from B1 were addressed
    - Whether any bugs were found

## Deliverables (report back here, RU)

### Implementation report

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- Tests run + result

### What changed (RU)

- List files changed
- Summarize new StructuralInvariants tests
- Summarize new ChangeProtocol tests
- Note whether any implementation bugs were found and fixed

### Evidence impact (RU)

- Which B1 evidence gaps are now closed or reduced
- Exact invariant IDs whose status changed (if any)
- Which gaps still remain after B2

### Open questions / risks

- Any checker or mutation path still not covered and why
- Any implementation area that now looks riskier than expected

## Notes

- This task is about direct evidence, not about making the code "look cleaner".
- Small, explicit tests are better than broad test abstractions.
- If a gap turns out larger than expected, record it honestly rather than over-expanding scope.

---

## Closeout (Notion)

Status: **accepted**

### Summary

B2 delivered the first major increase in direct kernel evidence after B1:

- dedicated tests added for `StructuralInvariants.js` and `ChangeProtocol.js`
- 4 real defects found and fixed in `ProposalValidator`
- evidence docs updated based on new passing tests
- evidenced invariants count increased materially

### Completed

- Gap #1 from B1 (StructuralInvariants direct tests) — closed
- Gap #2 from B1 (ChangeProtocol direct tests) — closed
- direct evidence added for 19 invariant/property statuses

### Important claim-discipline note

B2 does NOT mean “all invariants are fully proven for all world schemas/conditions”.

Some schema-dependent structural checks are now evidenced in the current default empty-type regime and explicitly documented as such.

### Management note

Next step: close the next remaining Block B evidence cluster (GraphSnapshot immutability, KE5 empty-graph edge case, projection metadata invariants) with a proof-artifact task.

---

**Status: ✅ Done**

## Implementation report

- GitHub issue: [https://github.com/utemix-org/meaning-engine/issues/9](https://github.com/utemix-org/meaning-engine/issues/9)
- PR: [https://github.com/utemix-org/meaning-engine/pull/10](https://github.com/utemix-org/meaning-engine/pull/10)
- Branch: `readiness/b2-structural-changeprotocol-tests`
- Commit: `4542a43`
- Tests: 755/755 pass (37 test files, +84 новых тестов)

## Что изменилось

### Файлы

- `src/core/__tests__/StructuralInvariants.test.js` (новый) — 48 тестов
- `src/core/__tests__/ChangeProtocol.test.js` (новый) — 36 тестов
- `src/core/ChangeProtocol.js` — 4 багфикса
- `docs/INVARIANT_MATRIX.md` — обновлены статусы
- `docs/PROOF_OBLIGATIONS.md` — 2 гэпа закрыты

### Тесты StructuralInvariants (48)

Покрыты все 16 чекеров по 5 категориям:

- **Graph** (G1–G4): unique IDs, no dangling edges, no self-loops
- **Identity** (I1–I4): id, type, known types, label
- **Edge** (E1–E3): typed edges, known types, no duplicates
- **Connectivity** (C1–C3): connected, no isolated, root node
- **Hierarchy** (H1–H2): no contains cycles, single parent
- **InvariantChecker**: MINIMAL/STANDARD/STRICT strictness, checkOne, listInvariants, reset

Особенности: INV-I3, INV-E2, INV-C3 зависят от NODE_TYPES/EDGE_TYPES, которые пустые по дизайну. Тесты документируют это поведение явно.

### Тесты ChangeProtocol (36)

- **createProposal**: валидация, ошибки
- **ProposalValidator — structure**: отклонения по структуре (missing type/id/changes/endpoints)
- **ProposalValidator — simulation**: duplicate node, nonexistent node, bad edge
- **ProposalValidator — invariant checks**: schema validation (static call fix), rejection on missing type
- **Happy path**: add/remove/update node, add/remove edge, batch
- **Rejection**: duplicate node, nonexistent node, статусы VALIDATED/REJECTED
- **Simulate**: dry-run с diff без мутации графа
- **History**: запись, snapshots, diff, exportHistory
- **Strictness**: MINIMAL (5 checks)
- **Isolation**: getGraph возвращает копию

### Найденные баги (4)

1. **Static method on instance**: `this.schemaValidator.validateNode()` — TypeError. Исправлено: `SchemaValidator.validateNode()`
2. **Count vs boolean**: `!invariantResult.passed` проверял число, не boolean. Исправлено: `!invariantResult.valid`
3. **Number iterated as array**: `for (of invariantResult.failed)` — failed это число. Исправлено: `.violations`
4. **Wrong property**: `failure.error` → `failure.message`

## Evidence impact

### Закрытые гэпы из B1

- **Gap #1 (StructuralInvariants)**: CLOSED — 16 инвариантов подняты до evidenced
- **Gap #2 (ChangeProtocol)**: CLOSED — 3 инварианта подняты до evidenced

### ID с изменённым статусом

- intended → evidenced: INV-G4, INV-I3, INV-I4, INV-E1, INV-E2, INV-E3, INV-C1, INV-C2, INV-C3, INV-H1, INV-H2, CP-1, CP-2, CP-3
- partially evidenced → evidenced: INV-G1, INV-G2, INV-G3, INV-I1, INV-I2

### Итоговый счёт: 40/44 evidenced (было 21/44)

### Остающиеся гэпы после B2

1. KE5 edge case (пустой граф + projection) — partially evidenced
2. PROJ metadata (INV-1, INV-2, INV-4) — intended
3. GraphSnapshot immutability — нет тестов
4. Highlight model — нет тестов

## Открытые вопросы / риски

- Schema-зависимые чекеры (INV-I3, INV-E2, INV-C3) ведут себя вакуумно с пустыми NODE_TYPES/EDGE_TYPES. Это by design, но может удивить при интеграции.
- ProposalValidator работает корректно после багфиксов, но баги были нетривиальными — это подтверждает, что код без тестов = непроверенный код.