# COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP

---

title: COMPOSER_TASK__ME_READINESS__C2__EXPORT_SURFACE_AUDIT_AND_PURITY_BOUNDARY_FOLLOWUP

kind: engineering-task

project: Meaning Engine

owner: Composer 2

status: accepted

track: ME_READINESS

block: C (Trust surface cleanup)

languages:

repo: en

notion: ru

---

## Context

C1 is accepted and merged as a successful rename/docs/tests cleanup:

- `GraphRAGProjection` → `GraphIndexProjection`
- deprecated alias retained for one minor cycle
- docs updated
- ADR-014 implemented

However, review after merge concluded that **rename cleanup is complete, while purity/boundary cleanup is only partially closed**.

This follow-up task exists to:

1) verify that the export surface is fully coherent after the rename,

2) remove/record remaining legacy references,

3) explicitly close the remaining purity-boundary items that were not actually resolved in C1.

References:

- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAF%205a71404eb00941458c78832a43fc5446.md)
- Previous accepted task: [COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP](COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTI%20633bcba49a7642b9802c990cdf66c689.md)
- ADR-014 in `docs/DECISIONS.md`

## Goal

Produce a **clean, audited, repo-consistent export/boundary follow-up** after the GraphIndexProjection rename, without changing engine behavior.

Definition note (to avoid scope creep):

In this task, “purity/boundary” means only **public/package/export-facing boundary hygiene** related to the completed rename and its residual trust-surface effects.

## Composer 2 — operating mode

You are Composer 2 (implementation agent). Your job is to:

- execute a narrow cleanup/audit task with minimal scope creep
- prefer explicit findings + small mechanical fixes over broad refactors
- preserve truthful-claim discipline
- record unresolved items rather than silently ignoring them
- do not invent new policy; record open questions if needed

## Scope

### Must do

1) Audit package-level and core-level export surfaces

Verify that:

- `GraphIndexProjection` is the canonical export at all intended entrypoints
- `GraphRAGProjection` exists only as a deprecated alias
- no remaining direct export path silently preserves the old name outside the intended alias mechanism

Targets to inspect include at minimum:

- `src/core/index.js`
- `src/index.js`
- any other re-export/barrel files if present

2) Normalize export/deprecation framing if needed

If any package-level export still exposes the old name in a way that is not clearly alias-based or not clearly deprecated:

- fix it mechanically
- keep backward compatibility
- do not change runtime behavior

3) Run repo-wide audit for remaining `GraphRAGProjection` references

Classify every remaining reference into one of:

- intentional deprecated alias
- historical/ADR reference
- documentation explanation
- stale legacy reference that should be changed now
- intentionally deferred reference (must be recorded)

4) Close the purity-boundary follow-up explicitly

Audit whether any of the originally intended Block C “purity/boundary” items remain unresolved in the current public/library surface.

Minimum focus:

- whether package/library entrypoints remain clean and unsurprising
- whether any hidden legacy naming leaks remain in public-facing API/docs
- whether any file-level defaults / public-boundary confusion related to this rename remain visible

If additional purity issues are found but are larger than this task:

- do not fix them opportunistically
- record them explicitly as follow-up candidates

5) Add/adjust tests if needed

Minimum:

- ensure package-level export surface is covered, not only core-level
- ensure deprecated alias path is still identity-equal to canonical export
- ensure no behavior changes are introduced

### Should do (only if small and clearly in-scope)

- Add a short audit note in docs if that helps make the public boundary clearer.
- Add one small regression test for a discovered export-surface edge case.

### Must NOT do

- Do not rename additional concepts.
- Do not refactor unrelated modules.
- Do not change projection behavior.
- Do not expand public promise.
- Do not use this task to “improve architecture” beyond the narrow audit/cleanup scope.

## Acceptance criteria

- Canonical export surface is coherent across intended entrypoints.
- `GraphRAGProjection` remains only as an explicitly deprecated alias.
- Produce a short classification table of all remaining `GraphRAGProjection` references (location → classification → action: fixed/deferred).
- Any stale legacy references that are clearly in-scope are fixed.
- Any unresolved larger purity/boundary issues are explicitly recorded for later tasks.
- All tests pass (`npm test`).
- No runtime/API behavior changes beyond export/deprecation/boundary cleanup.

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
    - Audit findings

## Closeout (Notion)

Status: **accepted**

### Summary

C2 successfully closed the narrow follow-up after C1:

- export surface checked at package-root and core-level entrypoints
- `GraphIndexProjection` confirmed as canonical export
- `GraphRAGProjection` preserved only as explicitly deprecated alias
- residual package-root trust-surface nuance fixed (`src/index.js`)
- audit findings recorded in policy docs

### Scope note (important)

C2 was NOT a general project purity audit.

It covered only:

- export-surface follow-up
- residual rename-related public boundary hygiene

### Management note

After C2, the `GraphRAGProjection` naming/export trust-surface issue is closed.

## Deliverables (report back here, RU)

### Implementation report

- **GitHub issue:** [https://github.com/utemix-org/meaning-engine/issues/5](https://github.com/utemix-org/meaning-engine/issues/5)
- **PR:** [https://github.com/utemix-org/meaning-engine/pull/6](https://github.com/utemix-org/meaning-engine/pull/6) (на момент отчёта — открыт; в описании `Closes #5`)
- **Branch:** `chore/c2-export-surface-audit`
- **Commit SHA:** `7dc0133` (`docs(exports): deprecate GraphRAGProjection at package root (C2 follow-up)`)
- **Tests:** `npx vitest run` — 35 файлов, 671 тест, успех

### Audit findings (RU)

- **Проверенные поверхности:** `package.json` → `exports` (`.`, `./core`); `src/index.js` (корень пакета `meaning-engine`); `src/core/index.js` (`meaning-engine/core`). Других barrel-файлов с этим классом нет.
- **«Тихих» legacy-экспортов:** не обнаружено — единственный путь для старого имени: явный alias `GraphRAGProjection` из того же класса, что и `GraphIndexProjection`.
- **Классификация оставшихся вхождений `GraphRAGProjection` в репозитории:**
    
    
    | Место | Классификация | Действие |
    | --- | --- | --- |
    | `src/core/index.js` | Намеренный deprecated alias | без изменений |
    | `src/index.js` | Реэкспорт пакета; раньше без отдельного `@deprecated` на корне | **исправлено:** отдельный экспорт с JSDoc `@deprecated` |
    | `src/core/__tests__/GraphIndexProjection.exports.test.js` | тесты identity | без изменений |
    | `docs/DECISIONS.md` (ADR-014) | нормативная ссылка | без изменений |
    | `README.md`, `POSITIONING_MEMO.md`, `API_SURFACE_POLICY`, `CHANGELOG` | пояснения / политика / changelog | без изменений (в policy добавлена краткая C2-заметка) |
    | `worlds/.../rename-map.json` | исторический mapping путей миграции | **отложено** (намеренно не переписывать историю) |
- **Сделано сейчас vs отложено:** исправлена только рамка deprecation на корневом entrypoint и задокументирован аудит; поведение рантайма не менялось.

### What changed (RU)

- **Файлы:** `src/index.js`, `docs/API_SURFACE_POLICY.md`, `CHANGELOG.md`.
- **Нормализация экспорта:** `GraphRAGProjection` убран из общего блока реэкспортов и вынесен в отдельную строку `export { GraphRAGProjection } from "./core/index.js"` с `@deprecated` и отсылкой к ADR-014 — чтобы при импорте из `meaning-engine` предупреждение было явным так же, как при `meaning-engine/core`.
- **Тесты:** новых сценариев не требовалось — существующий `GraphIndexProjection.exports.test.js` уже сравнивает корень пакета и `core`; полный прогон зелёный.

### Open questions / risks

- Крупных отложенных задач по purity/boundary **вне** этого узкого аудита не выявлено.
- **Риск процесса:** пока не смержен [PR #6](https://github.com/utemix-org/meaning-engine/pull/6), [issue #5](https://github.com/utemix-org/meaning-engine/issues/5) остаётся открытым (после merge PR issue закроется по `Closes #5`).

## Notes

- C1 is already merged. Do not reopen or re-litigate it.
- This task is a narrow follow-up: export surface + residual purity/boundary audit.
- If the audit shows that purity cleanup is actually a larger separate topic, say so explicitly and stop at recording it.