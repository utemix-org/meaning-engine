# OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE

---

title: OPUS_TASK__ME_READINESS__B3__PROJECTION_METADATA_AND_GRAPHSNAPSHOT_EVIDENCE

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

B1 created the evidence framing.

B2 closed the two largest direct-evidence gaps:

- `StructuralInvariants.js` now has dedicated tests
- `ChangeProtocol` / `ProposalValidator` now has dedicated tests

The most important remaining Block B evidence gaps are now concentrated in:

1) projection metadata invariants (`INV-1`, `INV-2`, `INV-4`)

2) GraphSnapshot immutability

3) KE5 edge-case boundary (empty graph + projection behavior)

This task should reduce those remaining gaps with direct tests and minimal evidence-doc updates.

References:

- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAF%205a71404eb00941458c78832a43fc5446.md)
- Accepted tasks: [OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA](OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_%20528a1e43590546dabaf0dcef6c1ed9b9.md), [COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP](COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTI%20633bcba49a7642b9802c990cdf66c689.md), [COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP](COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AU%20d478a89ce4fc43178b42f0c14bc7983d.md), [OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_PROOF_OBLIGATIONS](OPUS_TASK__ME_READINESS__B1__INVARIANT_MATRIX_AND_%20b7cff57410cf48ce85d82efd4483be70.md), [OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS_AND_CHANGE_PROTOCOL_TESTS](OPUS_TASK__ME_READINESS__B2__STRUCTURAL_INVARIANTS%20980826696a86409f9cd00e6af074c2f6.md)
- Evidence docs: `docs/INVARIANT_MATRIX.md`, `docs/PROOF_OBLIGATIONS.md`

## Goal

Add direct evidence for the remaining projection / snapshot / KE5 edge-case claims, without changing runtime behavior unless a discovered bug makes a minimal fix necessary.

## Opus — operating mode

You are Opus. This is a proof-artifact task.

Your job is to:

- close the next most important evidence gaps after B2
- keep claims narrow and grounded
- distinguish between:
    - proving current intended behavior,
    - documenting a boundary condition,
    - discovering a real bug that needs a minimal fix
- avoid broad refactors or speculative contract expansion

## Scope

### Must do

1) Add direct tests for projection metadata invariants where honestly testable

Target invariants:

- `INV-1` — schema conformance
- `INV-2` — identity stability
- `INV-4` — graph immutability through projection

Approach:

- add focused tests around `projectGraph` / `buildViewModel` behavior
- prefer explicit fixtures and direct assertions
- if one of these invariants turns out not to be crisply testable under current implementation, record that explicitly rather than forcing artificial coverage
- it is acceptable for one or more target invariants to remain partially evidenced if the current implementation does not expose a crisp testable contract

2) Add direct tests for `GraphSnapshot`

Minimum expected coverage:

- snapshot creation
- immutability / freeze behavior
- behavior on mutation attempts (if meaningful in current runtime/test environment)
- any clearly documented guarantees already present in code/comments

Note on immutability claims:

- if immutability behavior depends on runtime semantics of `Object.freeze`, document the tested runtime behavior explicitly rather than overstating guarantees

3) Close or clarify the KE5 edge-case gap

Add a test that explicitly exercises the empty-graph boundary discussed in B1:

- what happens when canonical set is empty
- what `buildGraphFromStatements([])` returns
- what `projectGraph` does on that graph
- ensure the documented behavior matches actual behavior

Goal here is not to “make empty graph work” unless that is already intended and a minimal bug fix is required.

The goal is to turn the edge case into direct evidence and correct framing.

4) Minimal bug fixes if needed

If the new tests reveal a real defect:

- fix only the minimal implementation necessary
- describe the defect clearly in the report
- do not refactor adjacent code opportunistically

5) Update evidence docs only if warranted

If and only if new tests materially change evidence status:

- update relevant rows in `docs/INVARIANT_MATRIX.md`
- update relevant sections/gaps in `docs/PROOF_OBLIGATIONS.md`
- only change statuses directly supported by the new tests in this PR

### Should do (only if small and clearly in-scope)

- Add one tiny shared fixture helper if it reduces duplication.
- Add one narrow regression test for a discovered projection edge-case if naturally adjacent.

### Must NOT do

- Do not broaden this into a general projection rewrite.
- Do not redesign ViewModel schema in this task.
- Do not expand public promise.
- Do not upgrade statuses without actual passing tests.
- Do not turn this into a “fix all projection issues” task.

## Acceptance criteria

- Direct tests exist for the targeted projection metadata invariants where honestly testable.
- Direct tests exist for `GraphSnapshot` guarantees.
- KE5 empty-graph edge case is explicitly tested and documented.
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
    - Which remaining B1/B2 evidence gaps were addressed
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
- Summarize new projection metadata tests
- Summarize new GraphSnapshot tests
- Summarize KE5 edge-case test
- Note whether any implementation bugs were found and fixed

### Evidence impact (RU)

- Which remaining B1/B2 evidence gaps are now closed or reduced
- Exact invariant IDs whose status changed (if any)
- Which gaps still remain after B3

### Open questions / risks

- Which projection-related claims are still not crisply testable and why
- Any boundary condition that now looks riskier than expected

## Notes

- This task is about direct evidence, not contract redesign.
- If a property is better treated as a documented boundary than as a fully proven invariant, say so explicitly.
- Honest narrowing is better than artificial completeness.

---

## Closeout (Notion)

Status: **accepted**

### Summary

B3 closed the next Block B evidence cluster:

- projection metadata invariants now have direct test evidence
- GraphSnapshot guarantees now have dedicated tests
- KE5 empty-graph boundary is explicitly tested and correctly framed
- evidence docs updated accordingly

### Completed

- `INV-1`, `INV-2`, `INV-4` moved to direct evidence
- GraphSnapshot immutability/behavior now has dedicated coverage
- KE5 edge-case gap closed (documented boundary condition)

### Important claim-discipline note

B3 strengthens evidence **within the current implementation semantics**.

This does not imply infinitely strong universal guarantees; it means the current named invariants/properties have direct evidence in repo tests.

### Management note

Block B stable core is nearly closed. Remaining stable-surface gap: `highlightModel` tests.

---

**Status: ✅ Done**

## Отчёт о реализации

### GitHub

- Issue: [https://github.com/utemix-org/meaning-engine/issues/11](https://github.com/utemix-org/meaning-engine/issues/11)
- PR: [https://github.com/utemix-org/meaning-engine/pull/12](https://github.com/utemix-org/meaning-engine/pull/12)
- Branch: `readiness/b3-projection-snapshot-ke5-evidence`
- Commit: `fc94bc9`
- Тесты: 849 passed, 0 failed

### Что изменилось

**Новые файлы:**

- `src/core/projection/__tests__/projectionMetadata.test.js` — 32 теста
    - INV-1 (схемное соответствие): 15 тестов — структура ViewModel, VisualNode/VisualEdge поля и типы, panels/navigation/meta/system, satisfiedInvariants, transitions
    - INV-2 (стабильность идентификаторов): 9 тестов — все ID узлов сохраняются, edge source/target ссылаются на валидные ID, breadcrumbs/path совпадают
    - INV-4 (иммутабельность графа): 7 тестов — кол-во/свойства узлов/рёбер не меняются, в т.ч. после множественных проекций и на пути ошибки
- `src/core/__tests__/GraphSnapshot.test.js` — 62 теста
    - Создание: 12 тестов (nodes/edges, id, timestamp, metadata, пустой граф)
    - Иммутабельность: 13 тестов (Object.freeze на snapshot/nodes/edges/metadata, попытки мутации бросают исключения)
    - Аксессоры: 8 тестов (getNodeById, getEdgeById, getNodeIds, getEdgeIds, hasNode, hasEdge)
    - Статистика: 4 теста
    - Сериализация: 4 теста (toJSON/fromJSON round-trip)
    - diffSnapshots: 6 тестов (added/removed/modified nodes/edges)
    - SnapshotHistory: 15 тестов (add, getById, duplicate rejection, diff, diffRange, evolution, stats, clear, serialization)

**Изменённые файлы:**

- `knowledgeInvariants.test.js` — KE5 edge case теперь вызывает `projectGraph` на пустом графе и проверяет `ok: false` + `errors: ['graph has no nodes']`
- `INVARIANT_MATRIX.md` — обновлено: INV-1, INV-2, INV-4 → evidenced; KE5 → evidenced; итого 44/44
- `PROOF_OBLIGATIONS.md` — все Important gaps закрыты; проекция = strong evidence

### Баги

Не обнаружены. Проекционный пайплайн и GraphSnapshot работают корректно.

### Влияние на evidence

| Инвариант | Было | Стало |
| --- | --- | --- |
| KE5 | partially evidenced | **evidenced** |
| INV-1 | intended | **evidenced** |
| INV-2 | intended | **evidenced** |
| INV-4 | intended | **evidenced** |

Итоговая таблица: **44/44 evidenced**, 0 partially evidenced, 0 intended.

### Остающиеся gaps после B3

Все 44 инварианта теперь evidenced. Остаются только документационные gaps:

1. Highlight model — нет тестов (публичный API)
2. Cabin diagnostic pipeline — трекается отдельно

### Открытые вопросы

- `getEdges()` в GraphModel возвращает внутренний массив напрямую (не копию), в отличие от `getNodes()` который делает `[...this.nodesById.values()]`. Это не баг (pipeline не мутирует), но асимметрия заслуживает внимания.
- INV-1 тестирует структуру ViewModel на основе текущего поведения buildViewModel. Формальной JSON Schema нет — тест является de facto схемой.