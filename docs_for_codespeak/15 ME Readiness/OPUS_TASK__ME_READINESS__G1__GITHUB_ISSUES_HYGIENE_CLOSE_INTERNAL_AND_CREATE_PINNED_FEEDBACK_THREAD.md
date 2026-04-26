# OPUS_TASK__ME_READINESS__G1__GITHUB_ISSUES_HYGIENE_CLOSE_INTERNAL_AND_CREATE_PINNED_FEEDBACK_THREAD

---

title: OPUS_TASK__ME_READINESS__G1__GITHUB_ISSUES_HYGIENE_CLOSE_INTERNAL_AND_CREATE_PINNED_FEEDBACK_THREAD

kind: engineering-task

project: Meaning Engine

owner: Opus

status: draft

track: ME_READINESS

block: Governance / outreach prep

languages:

repo: en

notion: ru

---

## Context

Dmitry cannot do talks/forums/live discussions. External feedback must be GitHub-only and asynchronous.

Currently, `utemix-org/meaning-engine` has an open issue #21 that is an internal completed task (P2-like pressure-test) and should not remain open as it looks like unresolved work.

We need one explicit, pinned GitHub issue that serves as the public entrypoint for technical feedback, pointing to `docs/FEEDBACK.md` and the `presentation_feedback` issue template.

## Goal

1) Close the internal/completed GitHub issue #21 with a short completion note.

2) Create a new GitHub issue: “Request for technical feedback …” with clear links and instructions.

3) Pin the new feedback issue.

## Scope

### Must do

1) Close issue #21

- Comment before closing:
 - confirm it is completed
 - point to the key artifact(s): `docs/presentation/DELIVERY_RISK_NOTE.md` and the presentation pack docs
 - mention “no runtime/API changes”
- Close as completed.

2) Create a new feedback entrypoint issue

- Title:
 
 `Request for technical feedback: Meaning Engine (deterministic computation over typed engineering knowledge graphs)`
 
- Body must include:
 - a 3–5 line definition of ME (deterministic compute layer; not GraphRAG/agent/UI)
 - what feedback is wanted (clarity, claims vs non-claims, limits, demo usefulness)
 - links to:
 - README
 - `docs/FEEDBACK.md`
 - `docs/presentation/CLAIMS_AND_NONCLAIMS.md`
 - `docs/presentation/PRESENTATION_NARRATIVE.md`
 - `docs/OPERATIONAL_LIMITS.md`
 - `docs/PROOF_OBLIGATIONS.md`
 - `docs/demo/REASONING_REPORT_BASELINE.md`
 - explicit instruction: open a new issue using the template:
 
 `https://github.com/utemix-org/meaning-engine/issues/new?template=presentation_feedback.md`
 
 - explicit note: no SLAs; concrete observations preferred.

3) Pin the new issue

- Make the new issue pinned in GitHub UI.

### Must NOT do

- Do not change code.
- Do not change docs in this task.
- Do not promise response SLAs.

## Acceptance criteria

- Issue #21 is closed with a clear completion comment.
- A new “Request for technical feedback” issue exists.
- The new issue is pinned.

## Deliverables (report back here, RU)

- Link to closed issue #21 + final comment text
- Link to new pinned feedback issue
- Copy of the new issue body text
- Note confirming it is pinned

---

## Deliverables Report (RU)

**Status: ✅ Done**

### 1. Закрытие issue #21

- **Issue**: [https://github.com/utemix-org/meaning-engine/issues/21](https://github.com/utemix-org/meaning-engine/issues/21)
- **Статус**: Closed (completed)
- **Комментарий**: [https://github.com/utemix-org/meaning-engine/issues/21#issuecomment-4106646753](https://github.com/utemix-org/meaning-engine/issues/21#issuecomment-4106646753)
- **Текст комментария**:
 
 > Completed. All acceptance criteria met:
 > 
 
 > - Objections inventory: 10 objections across 3 priority tiers (`docs/presentation/DELIVERY_RISK_NOTE.md`)
 > 
 
 > - Weak-point analysis: 7 items identified with targeted fixes
 > 
 
 > - P1 refinements: narrow wording improvements
 > 
 
 > - Delivery-risk note: `docs/presentation/DELIVERY_RISK_NOTE.md`
 > 
 
 > No runtime/API changes. All 930 tests pass.
 > 

### 2. Новый pinned feedback issue

- **Issue**: [https://github.com/utemix-org/meaning-engine/issues/32](https://github.com/utemix-org/meaning-engine/issues/32)
- **Заголовок**: «Request for technical feedback: Meaning Engine (deterministic computation over typed engineering knowledge graphs)»
- **Закреплён (pinned)**: ✅ Да, подтверждено через GraphQL API
- **Содержание**: определение ME (3 строки), что за фидбек нужен (5 вопросов), таблица материалов (7/20/60 мин), прямая ссылка на feedback template, дисклеймер (no SLA, no community claim)

### Что не сделано (осознанно)

- Никаких изменений в коде или документах
- Никаких SLA на ответы