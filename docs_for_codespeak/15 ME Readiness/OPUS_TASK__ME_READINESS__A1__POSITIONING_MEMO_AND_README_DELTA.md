# OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA

---

title: OPUS_TASK__ME_READINESS__A1__POSITIONING_MEMO_AND_README_DELTA

kind: engineering-task

project: Meaning Engine

owner: Opus

status: draft

track: ME_READINESS

block: A (Identity lock)

languages:

repo: en

notion: ru

---

## Context

We start ME-only readiness for an engineering presentation. First step is to lock project identity to avoid wrong readings (GraphRAG / ontology DB / UI framework / world engine).

## Goal

Produce the **canonical identity artifacts** for Block A (docs-driven identity lock, no behavior changes):

1) `docs/POSITIONING_MEMO.md`

2) README delta: **one canonical one-line formula** + “what it is / what it is not” + explicit public vs experimental boundary.

3) Explicit recorded decision on `GraphRAGProjection` naming: keep+disclaimer vs propose rename (implementation not required here).

4) Decisions log entry: where the naming/terminology decision is recorded (`docs/DECISIONS.md` or other agreed log).

## Truthfulness rule

All positioning language must be **truthful and grounded** in current repository behavior, tests, and existing docs.

- No future-facing claims in canonical identity text unless explicitly marked as roadmap/future work.

## Guardrails

(see also Out of scope)

- ME-only. Do not mention AW.
- Do not add new engine features.
- Do not change engine behavior.
- Prefer documentation & naming/wording changes.
- If a rename is proposed, it must include a compatibility note (if applicable) and be explicitly marked as optional until approved.

## Out of scope

- No refactor of docs structure beyond the files required for this task.
- No API changes.
- No rename implementation in code unless separately approved.
- No edits to demo workflows except wording around identity/boundaries.

## Observability (public)

This task should be executed **issue-first** and produce a PR with reproducible references.

- GitHub: create 1 issue for this task; PR must link the issue and close it.
- PR description must include: Goal / Non-goals / Acceptance checklist / Files changed.
- Add a short `CHANGELOG.md` entry under `Unreleased`: "Readiness: Block A (Identity lock) — positioning memo + README identity".
 - If repo policy discourages doc-only entries in CHANGELOG, record the same note in PR summary instead (explicitly).

## Deliverables (Repo, EN)

1) `docs/POSITIONING_MEMO.md` (max ~1 page)

Must include:

- exactly one canonical one-line definition (for reuse)
- public promise (what is guaranteed)
- non-promise list (what it is not)
- public vs experimental boundary (explicit)
- short “not GraphRAG” explanation in 3–5 lines (why)
- minimum “what it is not” set must include:
 - not GraphRAG
 - not ontology database / RDF store
 - not UI framework
 - not world engine
 - not autonomous reasoning agent

2) README update

Add/adjust sections:

- One-line formula (canonical)
- What it is / What it is not
- Public vs experimental boundary (link to API_SURFACE_POLICY / docs)
- How to run canonical demo (existing) should stay unchanged

3) GraphRAGProjection decision (acceptable output in this task)

Minimum acceptable output: recorded decision + README/memo wording.

- Option A: keep `GraphRAGProjection` + hard disclaimer (not Microsoft GraphRAG; deterministic indexing/search; no LLM inside)
- Option B: propose rename + rationale + compatibility note (implementation belongs to later cleanup unless doc-only and backward-safe)

4) Decisions log entry

- Record the naming/terminology decision in `docs/DECISIONS.md` or another agreed decision log (explicit location required).

## Acceptance criteria

(plus observability requirements above)

- `docs/POSITIONING_MEMO.md` exists and contains:
 - one canonical one-line definition
 - public promise
 - non-promise list
 - explicit public vs experimental boundary
 - short “not GraphRAG” explanation
- README contains:
 - canonical one-line formula
 - “what it is / what it is not” section
 - explicit boundary statement with link to policy doc
- `GraphRAGProjection` decision is recorded explicitly:
 - keep + disclaimer, or
 - propose rename + rationale + compatibility note
- Wording is grounded in current repository behavior/docs/tests (no unmarked roadmap claims).
- No runtime/API behavior changes are introduced.
- Decisions log entry exists (explicit location).

## References

- Track: [ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT](ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT.md)
- Public surface policy: `docs/API_SURFACE_POLICY.md`
- System overview: `SYSTEM_OVERVIEW`

## Opus Report

### 1) GitHub traceability

- **GitHub issue:** [https://github.com/utemix-org/meaning-engine/issues/1](https://github.com/utemix-org/meaning-engine/issues/1)
- **PR:** [https://github.com/utemix-org/meaning-engine/pull/2](https://github.com/utemix-org/meaning-engine/pull/2)
- **Branch:** `readiness/a1-identity-lock`
- **Commit:** `12e7286`
- **Commit message (EN):** `docs: Block A identity lock — positioning memo + README identity`
- **Tests:** `npm test` → green, 669 tests (34 suites)

### 2) Changes (RU)

- `docs/POSITIONING_MEMO.md` — каноническое определение (one-liner), public promise, non-promise list (5 пунктов), public/experimental boundary, объяснение «Not GraphRAG» с таблицей сравнения
- `docs/DECISIONS.md` — ADR-014: GraphRAGProjection → GraphIndexProjection (rename proposed, реализация отложена); ADR-015: каноническая идентичность проекта
- `README.md` — добавлены секции «What It Is / What It Is Not», «Public vs Experimental Boundary», сноска-дисклеймер по GraphRAGProjection
- `CHANGELOG.md` — Readiness: Block A entry

### 3) Non-changes

- Engine core: unchanged
- GraphModel: unchanged
- API surface: unchanged
- Tests: unchanged
- UI: none

### 4) Решение по GraphRAGProjection

**Option B: propose rename** → `GraphIndexProjection`

Обоснование: класс не имеет ничего общего с Microsoft GraphRAG — это детерминированный текстовый индексатор + BFS контекстное расширение (нет LLM, нет эмбеддингов, нет entity extraction). Реализация отложена; записано в ADR-014.

### 5) Summary (RU)

Выполнен полный объём Block A (Identity lock). Все документы созданы, README обновлён, решение по неймингу записано. Issue-first + PR workflow соблюдён.

### 6) Notes / open questions

- Ренейм `GraphRAGProjection` → `GraphIndexProjection` требует отдельной задачи (затрагивает импорты, documentation-world, LLMReflectionEngine)
- PR готов к merge