# OPUS_TASK__ME_READINESS__F1__OPEN_SOURCE_CONTRIBUTING_GOVERNANCE_AND_FEEDBACK_CHANNEL

---

title: OPUS_TASK__ME_READINESS__F1__OPEN_SOURCE_CONTRIBUTING_GOVERNANCE_AND_FEEDBACK_CHANNEL

kind: engineering-task

project: Meaning Engine

owner: Opus

status: accepted

track: ME_READINESS

block: F (Open source readiness)

languages:

repo: en

notion: ru

---

## Context

We are approaching external engineering visibility (presentation + dry-run).

We also need a minimal open-source governance layer so that:

- external engineers can understand how to engage
- PRs/issues have a clear path
- we can solicit structured feedback (including “dry-run feedback”) without pretending that we already have a community

This task intentionally focuses on minimal, credible OSS hygiene and a structured feedback channel.

It should not change runtime behavior.

References:

- Presentation pack: `docs/presentation/*`
- CI/merge gate policy: `docs/PROCESS_CI_AND_MERGE_GATES.md`
- Track page: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT.md)

## Goal

Create a minimal open-source engagement surface and a structured feedback channel for Meaning Engine, so that external readers can:

1) understand how to ask questions / report issues,

2) submit PRs safely,

3) provide structured feedback after reading/watching the presentation materials.

## Opus — operating mode

You are Opus. This is a governance/docs task.

Your job is to:

- keep scope minimal and credible
- avoid legal overreach (no custom licenses beyond what already exists)
- align with current CI/merge gate reality
- avoid changing runtime/API behavior

## Scope

### Must do

1) Add minimal community / contribution docs

Create or update (prefer standard OSS conventions):

- `CODE_OF_CONDUCT.md` (use a standard template; keep it short)
- `CONTRIBUTING.md` with:
 - how to open an issue
 - how to open a PR
 - required checks before merge (point to `docs/PROCESS_CI_AND_MERGE_GATES.md`)
 - repo conventions (tests, docs language EN)
 - prefer small/narrow PRs with explicit goal/non-goals
 - what not to do (no scope creep)

2) Add issue/PR templates (lightweight)

- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md` (or “proposal”) with strong non-claim wording
- `.github/ISSUE_TEMPLATE/presentation_feedback.md` (or `dry_run_feedback.md`) for structured presentation/dry-run feedback
- `.github/pull_request_template.md` that asks for:
 - goal / non-goals
 - tests run
 - claim impact (does this change public promise?)
 - link to issue

3) Create a structured feedback channel for “external dry run”

Create a single entrypoint that you can share publicly, e.g.:

- `docs/FEEDBACK.md` with:
 - what kind of feedback we want (confusion points, objections, gaps)
 - how to submit it (GitHub issue labels + a template)
 - a short questionnaire (5–10 prompts)
 - explicit note: we prefer concrete observations over opinions

4) Add minimal README pointer

Add a small pointer in `README.md` to:

- contributing
- feedback
- code of conduct

### Must NOT do

- Do not create a large governance bureaucracy.
- Do not add new runtime features.
- Do not promise response SLAs.
- Do not claim an existing community.

## Closeout (Notion)

Status: **accepted**

### Summary

F1 added a minimal open-source engagement surface for Meaning Engine:

- contribution path is explicit
- issue/PR templates exist
- public feedback entrypoint exists
- presentation/dry-run feedback now has a structured channel

### Important note

F1 creates the channel for feedback, but does not itself constitute external feedback.

It enables the next step; it does not replace it.

### Management note

Next step is not more internal packaging.

Use the new feedback channel to collect at least one real external feedback issue (or run one live dry run), then unblock R2.

## Acceptance criteria

- Contribution path is explicit (CONTRIBUTING + templates).
- Feedback channel exists and is structured.
- README has a minimal pointer.
- No runtime/API behavior changes.
- All tests pass (`npm test`).

## Observability / process

- Issue-first: create GitHub issue + PR.
- Commit messages: EN.

## Deliverables (report back here, RU)

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- Tests run + result
- List of docs/templates added
- Linkable "how to give feedback" entrypoint summary

---

## Deliverables Report (RU)

**Status: ✅ Done**

### GitHub

- **Issue**: [https://github.com/utemix-org/meaning-engine/issues/28](https://github.com/utemix-org/meaning-engine/issues/28)
- **PR**: [https://github.com/utemix-org/meaning-engine/pull/29](https://github.com/utemix-org/meaning-engine/pull/29)
- **Branch**: `readiness/f1-oss-governance-feedback`
- **Commit**: `89b3a95` — «Add OSS governance docs, issue/PR templates, and feedback channel (F1)»
- **Tests**: 930/930 pass, 41 файлов, 0 failures

### Созданные документы и шаблоны

| Файл | Назначение |
| --- | --- |
| `CODE_OF_CONDUCT.md` | Кодекс поведения (на основе Contributor Covenant 2.1) |
| `CONTRIBUTING.md` | Как открыть issue/PR, конвенции репо, required CI checks, scope-дисциплина |
| `.github/ISSUE_TEMPLATE/bug_report.md` | Шаблон баг-репорта |
| `.github/ISSUE_TEMPLATE/feature_request.md` | Шаблон предложения фичи (с claim-impact осознанностью) |
| `.github/ISSUE_TEMPLATE/presentation_feedback.md` | Структурированный фидбек на презентацию (9 промптов) |
| `.github/pull_request_template.md` | Шаблон PR (goal/non-goals, tests, claim impact) |
| `docs/FEEDBACK.md` | Публичный entrypoint для обратной связи |
| `README.md` | Добавлены секции Contributing, Feedback, Code of Conduct |

### Entrypoint для фидбека

**Главная страница**: `docs/FEEDBACK.md` — объясняет какой фидбек нужен, как подать (через GitHub issue с шаблоном), что произойдёт с фидбеком, и индекс материалов для ревью.

**Прямая ссылка на создание feedback-issue**: [https://github.com/utemix-org/meaning-engine/issues/new?template=presentation_feedback.md](https://github.com/utemix-org/meaning-engine/issues/new?template=presentation_feedback.md)

### Что не сделано (осознанно)

- Не добавлены SLA на ответы
- Не заявлено о существующем комьюнити
- Не изменено runtime-поведение или API
- Не добавлен линтер (оставлено на будущее)