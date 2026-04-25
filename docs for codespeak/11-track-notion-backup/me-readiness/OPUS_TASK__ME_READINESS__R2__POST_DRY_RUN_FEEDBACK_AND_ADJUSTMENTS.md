# OPUS_TASK__ME_READINESS__R2__POST_DRY_RUN_FEEDBACK_AND_ADJUSTMENTS

---

title: OPUS_TASK__ME_READINESS__R2__POST_DRY_RUN_FEEDBACK_AND_ADJUSTMENTS

kind: engineering-task

project: Meaning Engine

owner: Opus

status: draft (blocked until dry run)

track: ME_READINESS

block: Delivery iteration

languages:

repo: en

notion: ru

---

## Context

R1 created a rehearsal-ready delivery pack.

C3 hardened CI visibility and merge-gate credibility.

This task must start only after at least one real dry run has been performed and concrete observations exist.

## Goal

Turn real dry-run observations into a narrow improvement pass:

1) capture actual feedback,

2) classify friction points,

3) recommend only grounded adjustments,

4) decide whether the project is ready for broader external delivery.

## Opus — operating mode

You are Opus. This is a post-dry-run iteration task.

Your job is to:

- work from actual observations, not speculation
- evidence hierarchy rule: actual audience reactions outweigh prior internal assumptions
- separate delivery issues from artifact issues
- preserve truthful-claim discipline
- prefer narrow changes over broad repackaging

## Scope

### Must do

1) Capture actual dry-run observations

- who was the audience (role/level), where, format, duration
- which version was used (5-min or 15-min)
- what demo path was used and which fallbacks were invoked
- list the top questions asked (verbatim if possible)

2) Classify problems

Separate into:

- content problems
- delivery problems
- demo problems
- audience objection problems

3) Recommend only narrow changes supported by observations

- wording tweaks
- demo flow tweaks
- timing plan tweaks
- checklist updates

4) Produce a go / not-yet-go recommendation

- are we ready for broader external delivery?
- if not, what is the minimum next artifact (not a long backlog)
- if recommendation is not-yet-go, name only the smallest next blocking artifact or correction

### Must NOT do

- Do not invent feedback that did not occur.
- Do not add a new use-case unless observations truly justify it.
- Do not broaden scope without evidence from the dry run.

## Acceptance criteria

- Observations are documented explicitly.
- Problems are categorized clearly.
- Suggested changes are narrow and evidence-based.
- A next-step recommendation exists.
- No runtime/API behavior changes.

## Observability / process

- Issue-first: create GitHub issue + PR only if changes are needed.
- If no repo changes are needed, record as observation-only with no PR.

## Deliverables (report back here, RU)

- Dry-run notes (structured)
- Proposed adjustments (if any)
- Go / not-yet-go recommendation

## Notes

This task is intentionally blocked until a real dry run happens.