# OPUS_TASK__ME_READINESS__P3__PRESENTATION_SURFACE_POLISH_AND_REPO_SPEC_SNAPSHOTS

---

title: OPUS_TASK__ME_READINESS__P3__PRESENTATION_SURFACE_POLISH_AND_REPO_SPEC_SNAPSHOTS

kind: engineering-task

project: Meaning Engine

owner: Opus

status: accepted

track: ME_READINESS

block: Presentation packaging

languages:

repo: en

notion: ru

---

## Context

We are preparing for first external expert feedback. The project is already unusually well-packaged (evidence, operational limits, demo pack, feedback channel).

A recent audit identified a small set of *presentation trust-surface* gaps that could reduce credibility during a first scan:

- mismatch between WORLD input contract (`title`) and ViewModel label behavior (`label`)
- English-only policy vs RU comments + dead internal links in public repo files
- Notion-only spec pointers referenced from code/comments without a repo snapshot
- lack of a single “submission bundle” artifact (CFP/showcase-style)
- lack of a “no-run demo artifact” (pre-generated baseline report)
- lack of a “reviewer journey by time” (7/20/60 min) in FEEDBACK

This task is a **narrow polish + packaging** pass.

Default rule: do not change engine behavior.

Runtime fallback (label/title/id) is Phase B: only if, after doc-first fixes, an external first-scan trap still remains.

Stop rule: once Acceptance criteria are met, close P3 without “extra polish” follow-ups.

References:

- Presentation pack: `docs/presentation/*`
- Feedback entrypoint: `docs/FEEDBACK.md`
- Demo/report scripts: `runReasoningReport.js`, baseline mode
- World input docs: `WORLD_INPUT_FORMAT.md` (if present)

## Goal

Make the repository more self-contained and easier to evaluate in 30 seconds / 7 minutes / 60 minutes, by:

1) creating a CFP/showcase submission bundle,

2) adding a no-run demo artifact (committed baseline report),

3) adding minimal repo spec snapshots for any Notion-only specs referenced from repo,

4) removing a few trust-surface paper cuts (title/label doc mismatch, RU comment + dead link).

## Opus — operating mode

You are Opus. This is a packaging + trust-surface polish task.

Your job is to:

- keep changes minimal and reviewable
- preserve truthful claim discipline
- avoid new runtime features
- prefer doc fixes over code fixes when possible

## Scope

### Must do

1) Add a submission bundle

Create `docs/submission/` with:

- `ABSTRACT_SHORT.md` (150–200 words)
- `ABSTRACT_LONG.md` (600–800 words)
- `TAKEAWAYS.md` (3–6 bullets)
- `CFP_FIELDS.md` (target audience, level, learning objectives, outline-by-minute)

2) Add a no-run demo artifact

- Commit a pre-generated baseline report markdown, e.g. `docs/demo/REASONING_REPORT_BASELINE.md`.
- Add a short note on how to regenerate it (command + expected output).
- Keep it stable: if the report format is noisy, adjust wording in the report generator output section rather than adding new features.

3) Add repo spec snapshots for referenced Notion-only specs

- Identify any code/comments that point to Notion specs (e.g. `PROJECTION_SPEC`, `RENDER_SURFACES_SPEC`).
- Create minimal markdown snapshots in `docs/specs/` (descriptive, not normative), only for the subset that is referenced publicly.
- Do NOT attempt to mirror the whole Notion spec corpus.
- Update repo pointers to point to the repo snapshot paths (not to Notion).

4) Fix trust-surface paper cuts

4.1) WORLD input contract vs label behavior

Phase A (must ship):

- Doc-first fix: update the world input format doc / loader examples to make `title → label` mapping explicit.

Phase B (only if zero drag and still a trap):

- Only if needed and clearly safe: add ViewModel label fallback `label || title || id` **if this does not change any existing public promise** and tests remain green.

4.2) English-only consistency

- Remove or translate the RU header comment in `src/core/GraphModel.js`.
- Remove or fix the dead internal link (`repair-shop/ROADMAP.md`) referenced there.

5) Improve FEEDBACK reviewer journey

- Add a short “If you have 7/20/60 minutes” section to `docs/FEEDBACK.md`.

### Must NOT do

- Do not add new operators or engine capabilities.
- Do not add new benchmark suites.
- Do not rewrite architecture docs broadly.
- Do not change public claims beyond narrowing/clarifying wording.

## Acceptance criteria

- `docs/submission/` exists with the listed files.
- `docs/demo/REASONING_REPORT_BASELINE.md` exists and is reproducible.
- Minimal referenced specs are mirrored into `docs/specs/` and repo pointers do not rely on private Notion.
- WORLD input doc no longer sets a first-impression trap around `title`/`label`.
- RU comment + dead internal link are removed from public core file(s).
- `docs/FEEDBACK.md` includes a 7/20/60 min reviewer journey.
- All tests pass (`npm test`).

## Observability / process

- Issue-first: create GitHub issue + PR.
- Commit messages: EN.

## Closeout (Notion)

Status: **accepted**

### Summary

P3 closed the last presentation trust-surface gaps before external outreach:

- submission bundle added (`docs/submission/*`)
- no-run baseline demo artifact added (`docs/demo/REASONING_REPORT_BASELINE.md`)
- minimal repo spec snapshots added for publicly referenced spec pointers (`docs/specs/*`)
- reviewer journey (7/20/60 minutes) added to `docs/FEEDBACK.md`
- trust-surface paper cuts cleaned (doc-first title→label mapping, RU comments + dead links removed)
- Phase B runtime fallback was NOT used

### Stop rule (explicit)

P3 closed. Further presentation improvements are out of scope unless required by a concrete outreach target or by real external feedback.

### Next step

Use the OSS feedback channel to collect at least 1 real external feedback issue (or run 1 live dry run), then unblock R2.

## Deliverables (report back here, RU)

- GitHub issue link
- PR link
- Branch name
- Commit SHA(s)
- Tests run + result
- Files added/changed summary
- Notes on any behavior changes (should be none; if any, justify explicitly)

---

## Deliverables Report (RU)

**Status: ✅ Done**

### GitHub

- **Issue**: [https://github.com/utemix-org/meaning-engine/issues/30](https://github.com/utemix-org/meaning-engine/issues/30)
- **PR**: [https://github.com/utemix-org/meaning-engine/pull/31](https://github.com/utemix-org/meaning-engine/pull/31)
- **Branch**: `readiness/p3-surface-polish-spec-snapshots`
- **Commit**: `e565706` — «Add submission bundle, baseline report, spec snapshots, and trust-surface fixes (P3)»
- **Tests**: 930/930 pass, 41 файлов, 0 failures

### Новые файлы (11)

| Файл | Назначение |
| --- | --- |
| `docs/submission/ABSTRACT_SHORT.md` | Короткий абстракт (~170 слов) |
| `docs/submission/ABSTRACT_LONG.md` | Расширенный абстракт (~700 слов) |
| `docs/submission/TAKEAWAYS.md` | 6 ключевых выводов |
| `docs/submission/CFP_FIELDS.md` | Целевая аудитория, уровень, цели обучения, поминутный план |
| `docs/demo/REASONING_REPORT_BASELINE.md` | Пред-генерированный отчёт (читается без установки) |
| `docs/specs/PROJECTION_SPEC.md` | Снапшот спецификации проекции |
| `docs/specs/NAVIGATION_SPEC.md` | Снапшот спецификации навигации |
| `docs/specs/INVARIANTS_SPEC.md` | Снапшот спецификации инвариантов |
| `docs/specs/RENDER_SURFACES_SPEC.md` | Маркер out-of-scope |

### Изменённые файлы (21)

- **7 файлов projection/navigation**: Notion URL’ы → пути к repo spec snapshots
- **13 core файлов**: удалены мёртвые `repair-shop/` ссылки + переведены RU-комментарии на EN
- `docs/WORLD_INPUT_FORMAT.md`: уточнён маппинг `title` → `label`
- `docs/FEEDBACK.md`: добавлены 7/20/60-минутные пути ревьюера + baseline в таблицу материалов

### Изменения поведения runtime/API

**Нет.** Все изменения — документационные и комментарные. Никакой логики не изменено.