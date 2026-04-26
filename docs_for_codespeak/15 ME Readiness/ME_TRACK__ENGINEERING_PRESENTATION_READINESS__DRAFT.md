# ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT

---

title: ME_TRACK__ENGINEERING_PRESENTATION_READINESS__DRAFT

kind: track-draft

scope: ME-only

status: draft

languages:

repo: en

notion: ru

---

## Goal

Подготовить Meaning Engine к инженерной презентации как **deterministic reasoning kernel for typed semantic graphs** с:

- воспроизводимыми reasoning artifacts,
- чётко ограниченной public promise,
- явной границей public vs experimental.

## Input (source text)

Текст Дмитрия: «Как представить Meaning Engine инженерному сообществу» (2026-03-21) + замечания ChatGPT (readiness pipeline).

## Readiness pipeline (v1.1)

Ниже — readiness track, доведённый до execution-grade: exit criteria, статус, разделение artifacts vs code changes.

Ниже — маршрут, который превращает «набор улучшений» в **управляемый процесс readiness**.

### Block A — Identity lock

Цель: зафиксировать, что такое ME и чем он не является (устранить неверные прочтения).

Status: not started

Artifacts (docs)

- `docs/POSITIONING_MEMO.md`
- README delta (core one-line formula + “what it is / what it is not”)
- decisions log: naming/terminology (Notion or `docs/DECISIONS.md`)

Code / repo changes

- (optional) rename/alias decisions for confusing modules (see Block C)

Exit criteria checklist

- [ ] Positioning memo exists.
- [ ] README contains canonical one-line description.
- [ ] README contains “what it is / what it is not” list (explicitly: not GraphRAG, not ontology DB, not UI framework, not world engine).
- [ ] README states public vs experimental boundary.
- [ ] GraphRAGProjection naming decision is recorded (rename vs disclaimer).

### Block B — Kernel evidence lock

Цель: зафиксировать, что ядро реально гарантирует (доверие через доказательства).

Status: not started

Artifacts (docs)

- `docs/INVARIANT_MATRIX.md` (KE/NAV/PROJ + pointers to tests)
- `docs/PROOF_OBLIGATIONS.md`
- `docs/NEGATIVE_BEHAVIOR_EXAMPLES.md` (formal errors, invalid transitions, gaps/unsupported behavior)

Code / repo changes

- temporary exploratory snapshots (local, non-blocking) to design the snapshot surface

Note

- Final protected snapshot baselines (CI-enforced) are only introduced **after Block C** (post-cleanup), to avoid locking in undesired boundary behavior.

Exit criteria checklist

- [ ] Invariant matrix exists and points to concrete tests.
- [ ] Proof obligations doc exists (what is proven / not proven).
- [ ] Exploratory snapshots exist (documented locally; define what will be snapshot-tested).
- [ ] Negative behavior examples exist (invalid transitions + formal errors + gap/unsupported examples).

### Block C — Trust surface cleanup (public boundary + purity)

Цель: убрать то, что подрывает доверие (purity, скрытое состояние, semantic traps в публичной поверхности).

Status: not started

Artifacts (docs)

- `docs/NAMING_AND_BOUNDARIES.md`
- CHANGELOG entry for boundary cleanup
- (if needed) ADRs for rename/boundary decisions

Code / repo changes

- move file-level caches / default seed loading into CLI wrappers
- keep library API pure (`trace(graph,...)` etc.)
- neutralize AW-colored public vocabulary in presentation-facing surfaces (rename or map to neutral terms)
- GraphRAGProjection rename OR explicit disclaimer

Exit criteria checklist

- [ ] Library APIs are pure (no hidden file-based defaults in library entry points).
- [ ] CLI wrappers own file IO / caching.
- [ ] Public boundary is documented (what’s stable vs experimental).
- [ ] AW-colored public terms are neutralized or clearly positioned as optional UI lensing.
- [ ] GraphRAGProjection semantic trap resolved (rename or hard disclaimer).
- [ ] Final protected snapshot baselines are added and enforced in CI (ViewModel and/or report artifacts).

### Block D — Operational envelope

Цель: честно очертить ограничения (сложность/лимиты/benchmark), уже после фиксации контрактов и границ.

Status: not started

Artifacts (docs)

- `docs/OPERATIONAL_LIMITS.md`
- explicit note on `compare` path explosion + recommended caps

Code / repo changes

- `benchmarks/` harness

Exit criteria checklist

- [ ] Target demo graph scale stated (nodes/edges order of magnitude).
- [ ] Laptop-grade benchmark results documented.
- [ ] Recommended caps documented (`maxHops`, path caps / sampling strategy).
- [ ] `compare` explosion risk documented with mitigation knobs.

### Block E — External proof via use-case

Цель: внешний proof, что ME полезен вне self-referential world.

Status: not started

Why this case (fixed)

- recognizable to engineers
- naturally maps to existing ME types/edges (spec/code/test/evidence/invariant)
- demonstrates trace/gap/rivals/evidence
- avoids domain-specific regulatory overhead

Artifacts (docs)

- short case memo: `docs/INDUSTRIAL_CASE_TRACEABILITY.md`

Code / repo changes

- `worlds/industrial-traceability-world/` (name tbd)
- 3–5 reproducible scenarios + baseline report artifacts

Exit criteria checklist

- [ ] Industrial world exists in repo.
- [ ] 3–5 scenarios exist and are runnable.
- [ ] Report pack is reproducible (documented commands + artifacts).
- [ ] Case memo explains “why this case” and maps it to operators/invariants.

## Issue families (for issue-first execution)

Family 1 — Positioning / public surface

- core formula
- what it is / what it is not
- public vs experimental
- GraphRAGProjection naming (rename or explicit disclaimer)

Family 2 — Kernel guarantees

- invariant matrix
- projection/viewmodel snapshots
- report snapshots
- navigation error behavior examples

Family 3 — Boundary hygiene

- trace pure API
- CLI/library separation
- neutralize public context naming (avoid AW-colored public terms)

Family 4 — Operational note

- benchmark harness
- complexity note
- operator envelope

Family 5 — Industrial proof pack

- pick scope of traceability world
- build world
- define scenarios
- generate report pack

## Non-goals (reinforced)

- No AW narrative.
- No UI work.
- No expansion of public promise beyond measured artifacts.
- Do not expand world typology just to make a nicer demo.
- Do not add LLM features for presentation theatrics (LLM stays clearly experimental).
- Do not introduce new conceptual layers unless required to support the fixed presentation claim.

## Notes

- Порядок важен: Identity → Evidence → Cleanup → Envelope → External proof.
- Snapshot’ы фиксируем после boundary cleanup, чтобы не закрепить нежелательное поведение как baseline.

## Soft link (style reference, not a dependency)

Мы не зависим от Cabin/AW задач, но можем **заимствовать дисциплину артефактов** (predeclared threshold, reproducibility metadata, report pack) как стиль для ME readiness.

Reference: *OPUS_TASK__GENERALIZATION_ROBUSTNESS_CHECK_V1__GR_BEYOND_CURRENT_CASES* — в `docs_for_codespeak` не зеркалируется; исходная страница остаётся в Notion.