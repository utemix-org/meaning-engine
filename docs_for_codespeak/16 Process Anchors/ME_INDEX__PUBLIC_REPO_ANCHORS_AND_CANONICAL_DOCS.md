# ME_INDEX__PUBLIC_REPO_ANCHORS_AND_CANONICAL_DOCS

---

title: ME_INDEX__PUBLIC_REPO_ANCHORS_AND_CANONICAL_DOCS

kind: index

project: Meaning Engine

status: canon

languages:

notion: ru

repo: en

---

## Purpose

A symmetric companion to the AW index.

This page answers:

- what is ME (Meaning Engine) vs AW in our documentation split
- which ME artifacts are public and repo-anchored (source-of-truth)
- which Notion pages are canonical governance/process (but not public specs)

Routing root: [DOCS_SPLIT__ME_VS_AW__INDEX_AND_ROUTING](DOCS_SPLIT__ME_VS_AW__INDEX_AND_ROUTING%20f6255991950e45288e68cf6602790ee6.md).

## ME: public, repo-anchored documentation (source-of-truth)

These are the artifacts we point external engineers to.

### Presentation / outreach

- `docs/presentation/PRESENTATION_NARRATIVE.md`
- `docs/presentation/CLAIMS_AND_NONCLAIMS.md`
- `docs/presentation/TALK_OUTLINE.md`
- `docs/presentation/DEMO_FLOW.md`
- `docs/presentation/DELIVERY_RISK_NOTE.md`
- `docs/presentation/DELIVERY_SCRIPT.md`
- `docs/presentation/TIMING_PLAN.md`
- `docs/presentation/DRY_RUN_CHECKLIST.md`
- `docs/presentation/FAILURE_HANDLING_CHECKLIST.md`

### Submission bundle (CFP/showcase)

- `docs/submission/ABSTRACT_SHORT.md`
- `docs/submission/ABSTRACT_LONG.md`
- `docs/submission/TAKEAWAYS.md`
- `docs/submission/CFP_FIELDS.md`

### No-run demo artifact

- `docs/demo/REASONING_REPORT_BASELINE.md`

### Evidence & operational limits

- `docs/INVARIANT_MATRIX.md`
- `docs/PROOF_OBLIGATIONS.md`
- `docs/OPERATIONAL_LIMITS.md`

### Public promise & API boundary

- `docs/API_SURFACE_POLICY.md`
- README (public entry point)

### Engine specs (repo snapshots)

(Descriptive snapshots for repository-local reference)

- `docs/specs/PROJECTION_SPEC.md`
- `docs/specs/NAVIGATION_SPEC.md`
- `docs/specs/INVARIANTS_SPEC.md`
- `docs/specs/RENDER_SURFACES_SPEC.md` (out-of-scope marker)

### First proof case

- `worlds/traceability-world/*`

### How to make a world

- `docs/MAKE_YOUR_FIRST_WORLD.md`
- `docs/WORLD_INPUT_FORMAT.md`

### OSS feedback & contributing

- `docs/FEEDBACK.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `.github/ISSUE_TEMPLATE/presentation_feedback.md`

## ME: Notion canonical governance (internal)

These pages are canonical for our process, but not meant as public specs.

- [TEAM_CODEX__MEANING_ENGINE__NOTION_CHATGPT_OPUS](TEAM_CODEX__MEANING_ENGINE__NOTION_CHATGPT_OPUS.md)
- *STATE_TRANSFER_PROTOCOL* — в `docs_for_codespeak` нет зеркала этого Notion-файла.
- [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](../15%20ME%20Readiness/ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT.md)

## ME vs AW reminder

- ME = kernel/operators/spec/evidence/limits
- AW = authored world UI + characters + workbenches + scene

If a document mixes ME and AW language, it must be routed explicitly via the split index and (if public-facing) the ME doc must be rewritten to avoid AW framing.

## Note

AW will be designed in Notion (not migrated to `vovaipetrova` repo yet).

This index exists so ME can stay adjacent and the boundary remains explicit.