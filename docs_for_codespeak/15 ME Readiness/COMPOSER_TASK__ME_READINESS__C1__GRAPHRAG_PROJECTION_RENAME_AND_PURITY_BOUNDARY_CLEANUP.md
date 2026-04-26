# COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP

---

title: COMPOSER_TASK__ME_READINESS__C1__GRAPHRAG_PROJECTION_RENAME_AND_PURITY_BOUNDARY_CLEANUP

kind: engineering-task

project: Meaning Engine

owner: Composer 2

status: accepted with follow-up

track: ME_READINESS

block: C (Trust surface cleanup)

languages:

repo: en

notion: ru

---

## Context

Block A (identity lock) is accepted. The remaining highest-risk trust surface issue is the misleading naming trap around `GraphRAGProjection`, plus adjacent public-boundary/purity hygiene.

This task is the follow-up that turns ADR-014 from “recorded decision” into an implemented, repo-consistent cleanup.

References:

- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT.md)
- Previous task (accepted): [OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA](OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA.md)

## Goal

Implement the **naming + boundary cleanup** so that external readers/users are not misled by `GraphRAGProjection`, while keeping the library surface disciplined and reproducible.

## Composer 2 — operating mode (read carefully)

You are Composer 2 (implementation agent). Your job is to:

- execute the task in the repository with minimal scope creep
- preserve truthful-claim discipline: do not upgrade claims; do not add “smart” behaviors
- prefer mechanical, verifiable changes (rename + alias + imports + docs + tests)
- keep changes reviewable: small commits, no unrelated refactors
- if something is ambiguous, record an explicit open question in the report; do not invent new policy

## Scope

### Must do

1) Rename the experimental class and file:

- `GraphRAGProjection` → `GraphIndexProjection`
- `src/core/GraphRAGProjection.js` → `src/core/GraphIndexProjection.js`

2) Update all imports/exports accordingly:

- barrel exports in `src/core/index.js`
- package-level public exports in `src/index.js`
- any internal import sites (e.g. `LLMReflectionEngine`, `ReflectiveProjection`, etc.)
- verify both entrypoints if both are public (core-level + package-level)

3) Add a compatibility layer (1 release-cycle courtesy)

- Keep a deprecated alias export: `GraphRAGProjection` should still resolve.
- Deprecation marking must exist in:
 - code (comment/JSDoc on the alias export, where practical), and
 - docs/ADR (ADR-014 must mention the deprecation + timeline).
- The alias must be implemented as a re-export of `GraphIndexProjection` (not duplicated code).

4) Update documentation to remove the trap:

- README: replace the “GraphRAGProjection is not GraphRAG” disclaimer with a short note about the rename + alias + meaning.
- `docs/POSITIONING_MEMO.md`: same update.
- `docs/API_SURFACE_POLICY.md`: update the experimental list name.
- `docs/DECISIONS.md` (ADR-014): update implementation status from “proposed” to “implemented”, and document the alias/deprecation policy.

5) Add/adjust tests (minimum)

- Add tests that ensure:
 - `GraphIndexProjection` is exported from the intended entrypoints
 - `GraphRAGProjection` alias still exists (for now) and points to the same class/function identity
 - no behavior change is introduced (basic sanity: existing tests remain green)

### Should do (only if small and clearly in-scope)

- Update any documentation-world artifacts that mention the old name (only if they are part of repo docs and easy to update mechanically).
- No semantic remodeling of documentation-world content; only mechanical rename where safe.

### Must NOT do (guardrails)

- Do not change runtime behavior of projections.
- Do not add embeddings, LLM calls, entity extraction, or anything that would make the name “GraphRAG” more true.
- Do not expand public promise.
- Do not refactor unrelated modules.

## Acceptance criteria

- `GraphIndexProjection` is the canonical name in code and docs.
- `GraphRAGProjection` remains only as a deprecated alias (experimental surface) and is clearly described as such.
- No functional changes outside rename/alias/docs/tests.
- All tests pass (`npm test`).
- Docs are consistent: no remaining phrasing that suggests ME includes GraphRAG capabilities.

## Observability / process

- Issue-first:
 - Create a GitHub issue for this task (Block C / naming cleanup), unless one already exists.
 - Open a PR that links the issue and closes it.
- Commit messages: EN.

## Closeout (Notion)

Status: **accepted with follow-up**

### Summary

C1 closed for the rename/docs/tests scope.

### Completed

- canonical rename `GraphRAGProjection` → `GraphIndexProjection`
- deprecated alias for one minor cycle
- docs sync
- export-surface tests
- mechanical documentation-world updates

### Accepted as true

- naming trap on the public surface is substantially reduced
- ADR-014 moved from proposed → implemented
- alias/deprecation policy is fixed in canon
- canonical name is now `GraphIndexProjection`

### Not fully closed inside C1

Purity boundary cleanup is partial / not separated clearly enough.

### Management note

Do not reopen C1. Remaining items must be handled via Block C follow-up.

## Deliverables (report back here, RU)

### Implementation report

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- Tests run + result

### What changed (RU)

- List files changed
- Explain how the alias/deprecation is implemented
- Note any places where the old name was found and updated

### Open questions / risks

- If you found public references that you intentionally did NOT change, list them and why.

## Notes (from ChatGPT review)

- Block A is accepted; follow-up in Block C is now mandatory (rename + boundary hygiene).
- “Computational substrate” wording is acceptable for now; do not change it in this task.
- The “world-agnostic” claim is acceptable for now; strengthening it belongs later (Block E).