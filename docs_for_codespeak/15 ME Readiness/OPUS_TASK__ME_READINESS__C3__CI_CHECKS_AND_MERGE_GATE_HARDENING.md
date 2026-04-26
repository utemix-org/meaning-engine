# OPUS_TASK__ME_READINESS__C3__CI_CHECKS_AND_MERGE_GATE_HARDENING

---

title: OPUS_TASK__ME_READINESS__C3__CI_CHECKS_AND_MERGE_GATE_HARDENING

kind: engineering-task

project: Meaning Engine

owner: Opus

status: accepted

track: ME_READINESS

block: C (Trust surface cleanup)

languages:

repo: en

notion: ru

---

## Context

We now have presentation readiness artifacts and a rehearsal pack.

For an external engineering audience, it is credibility-relevant that PRs show visible checks (CI) and that the merge gate is explicit.

This task hardens the repo process trust-surface:

- make CI checks visible and reliable on PRs
- ensure a minimal merge gate is documented

## Goal

Make CI/check reporting and merge gating visible and robust, without changing engine behavior.

Important framing:

- Distinguish between repo/workflow-side problems vs GitHub settings-side problems.
- Fix what is fixable from repo/workflow configuration.
- If something is blocked by GitHub/org settings, explicitly identify the blocking condition and record the manual action required.

## Opus — operating mode

You are Opus. This is a repo-process hardening task.

Your job is to:

- audit the current GitHub Actions situation
- make minimal, reviewable changes to ensure checks run on PRs and report status
- document the intended merge gate
- avoid adding heavy tooling or long pipelines

## Scope

### Must do

1) Audit current CI status

Distinguish clearly between:

- repo/workflow misconfiguration
- GitHub Actions disabled/restricted settings
- branch protection / required checks not configured

Then audit:

- Do PR commits show checks? If not, why (disabled Actions, missing workflow triggers, permissions, fork settings)?
- Identify existing workflows (e.g. `ci.yml`) and what events they run on.

2) Ensure a minimal CI gate runs on PRs

At minimum, PR checks should run:

- install
- tests (`npm test`)

3) Optional: add a minimal lint step only if it already exists

- If there is already a linter configured, add a CI step.
- If no linter exists, do NOT introduce one here.

4) Document merge gate expectations

- Add a short doc note (e.g. `docs/PROCESS_CI_AND_MERGE_GATES.md` or a section in an existing process doc) stating:
 - what checks are required
 - what is not required
 - what “green” means

5) Verify checks are visible

- Confirm that PRs show the checks in the GitHub UI.

### Must NOT do

- Do not introduce complex CI matrices.
- Do not add performance benchmarks to CI.
- Do not change runtime behavior.
- Do not add new tooling unless already present.

## Closeout (Notion)

Status: **accepted**

### Summary

C3 closed the process trust-surface gap:

- CI checks on PRs are now explicitly verified
- merge gate policy is documented
- branch protection is active on `main`
- required checks for merge are clear and enforceable

### Important note

C3 did not add new technical evidence or runtime behavior.

It strengthened process credibility: visible checks, branch protection, documented merge gate.

### Management note

Do not open a new large internal task immediately.

Next: run the external (or semi-external) dry run using the R1 pack, then open R2 based on real observations.

## Acceptance criteria

- PRs show visible CI checks if the issue is fixable from repo/workflow configuration.
- If checks still do not appear because of GitHub/org settings, the blocking condition and required manual settings change are documented explicitly.
- `npm test` runs as a PR check and reports status.
- Merge gate policy is documented (including: what must be green, what is informational, whether merge is allowed with no checks, what to do if Actions are unavailable).
- All tests pass.

## Observability / process

- Issue-first: create GitHub issue + PR.
- Commit messages: EN.

## Verification before merge (required)

Do NOT merge PR #27 until this is verified.

Because some tooling/endpoints may show an empty combined status even when GitHub Checks are present, verification must be based on either:

- GitHub UI evidence (Checks section), or
- direct links to workflow runs.

### What to verify

Open PR #27 in GitHub UI and confirm that the head commit shows these 4 checks and that they are completed successfully:

- `test (18.x)`
- `test (20.x)`
- `test (22.x)`
- `package-check`

### What to record in this task

Add one of:

- a short textual excerpt (names + statuses + timestamps) from the PR Checks section, or
- links to the specific workflow runs for each check.

### If checks are NOT visible

Do not claim acceptance.

Instead, classify the blocker explicitly as GitHub settings-side (Actions disabled/restricted, missing workflow triggers, required-check name mismatch, branch protection not actually applied, etc.) and record the exact manual settings action required.

## Deliverables (report back here, RU)

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- What was changed and why
- What the visible PR checks now are
- What was fixable in-repo vs what requires manual GitHub settings change
- Recommended minimal merge gate policy

---

**Status: ✅ Verified and accepted**

## Verification record

**Verified by**: Opus

**Verified at**: 2026-03-22T10:46 UTC

**Method**: GitHub API `check-runs` endpoint on commit `8944689` (PR #27 head commit)

### Check results (all 4 completed successfully)

| Check | Status | Conclusion | Completed at (UTC) | Link |
| --- | --- | --- | --- | --- |
| `test (18.x)` | completed | **success** | 2026-03-22T10:30:15Z | [job/68072515335](https://github.com/utemix-org/meaning-engine/actions/runs/23401130401/job/68072515335) |
| `test (20.x)` | completed | **success** | 2026-03-22T10:30:23Z | [job/68072515331](https://github.com/utemix-org/meaning-engine/actions/runs/23401130401/job/68072515331) |
| `test (22.x)` | completed | **success** | 2026-03-22T10:30:14Z | [job/68072515336](https://github.com/utemix-org/meaning-engine/actions/runs/23401130401/job/68072515336) |
| `package-check` | completed | **success** | 2026-03-22T10:30:35Z | [job/68072540969](https://github.com/utemix-org/meaning-engine/actions/runs/23401130401/job/68072540969) |

**Workflow run**: [https://github.com/utemix-org/meaning-engine/actions/runs/23401130401](https://github.com/utemix-org/meaning-engine/actions/runs/23401130401)

**PR merge status**: `MERGEABLE`, `CLEAN` (confirmed via `gh pr view 27 --json mergeable,mergeStateStatus`)

### Conclusion

All 4 required checks are visible on PR #27 and completed with `success`. Branch protection is active on `main`. No GitHub settings-side blockers found.

**PR #27 is clear to merge.**

## Implementation report

**GitHub issue**: [https://github.com/utemix-org/meaning-engine/issues/26](https://github.com/utemix-org/meaning-engine/issues/26)

**PR**: [https://github.com/utemix-org/meaning-engine/pull/27](https://github.com/utemix-org/meaning-engine/pull/27)

**Branch**: `readiness/c3-ci-checks-merge-gate`

**Commit**: `8944689`

**Tests**: 930 passed (41 files), 0 failed. No runtime/API changes.

## Что изменилось и почему

### Аудит

- CI workflow (`.github/workflows/ci.yml`) уже существовал и работал корректно
- GitHub Actions включены, все runs успешны
- Checks видимы на PR (заявлено в отчёте; требуется независимая верификация)
- Линтер не настроен — не добавляли (будущая задача)
- Branch protection НЕ был настроен — main был незащищён

### Изменения

1. **Branch protection на `main`** (через GitHub API):
 - Required status checks: `test (18.x)`, `test (20.x)`, `test (22.x)`, `package-check`
 - Strict mode: ветка должна быть актуальной относительно main
 - Force pushes: заблокированы
 - Deletions: заблокированы
 - Admin override: разрешён (на случай недоступности Actions)
2. **`docs/PROCESS_CI_AND_MERGE_GATES.md`** (новый файл):
 - Какие checks требуются для merge
 - Что НЕ проверяется в CI
 - Что значит «зелёный»
 - Процедура оверрайда при недоступности Actions
 - Как добавить новый required check

### Видимые checks на PR

- `test (18.x)` — npm test на Node.js 18
- `test (20.x)` — npm test на Node.js 20 + coverage
- `test (22.x)` — npm test на Node.js 22
- `package-check` — консистентность версий, типы, npm pack, демо-команды

Все 4 подтверждены зелёными на PR #27.

### Что фиксилось в репо vs что требовало GitHub settings

| Действие | Где |
| --- | --- |
| CI workflow уже существовал | Репо ✅ |
| Checks видимы на PR | Работало ✅ |
| Branch protection | GitHub API (gh api) |
| Merge gate документация | Новый файл в репо |
| Удаление просроченного GITHUB_TOKEN | Локальное окружение Windows |

### Рекомендованная merge gate политика

- Все 4 checks должны быть зелёными
- Ветка должна быть актуальной относительно main
- PR review не требуется (single-contributor)
- Admin override возможен при недоступности Actions