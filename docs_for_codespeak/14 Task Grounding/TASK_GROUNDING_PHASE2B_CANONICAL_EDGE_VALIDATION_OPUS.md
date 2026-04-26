# TASK_GROUNDING_PHASE2B_CANONICAL_EDGE_VALIDATION_OPUS

---

title: TASK_GROUNDING_PHASE2B_CANONICAL_EDGE_VALIDATION

kind: engineering

project: Meaning Engine

status: active

scope: p0

maturity: draft

owner: opus

---

Задача для Opus (операционный пакет): Grounding Phase 2b — Canonical Edge Validation.

## 1) Контекст (зачем сейчас)

Grounding Phase 2a успешно показала, что WorkbenchPolicy делает проекции различимыми и сохраняет Focus без изменения engine/контекстной формулы.

Но выводы про edge semantics и `edge_policy` остаются частично загрязнёнными из-за compatibility layer через bridge `relates`.

Нужно очистить эксперимент и отделить typed expansion от bridge expansion, не откатывая Phase 2a.

## 2) Scope (что можно трогать)

Разрешено:

- добавить явную маркировку режима расширения в snapshot/debug output
- различать в логах/отчётах/тестах:
 - typed edges
 - bridge `relates` edges
- локально проверить, какие рёбра фактически участвуют в раскрытии графа при WorkbenchPolicy

Примечание: допускаются изменения в render/world/test/docs слоях, если это нужно для маркировки и измерения (но не для переписывания алгоритмов).

## 3) Stop-list (что нельзя менять)

Запрещено:

- рефакторить engine
- менять алгоритм проекции
- менять навигационную модель
- менять формулу контекста `C = {domain?, workbench?, character?}`
- переносить WorkbenchPolicy в engine
- удалять bridge `relates` «вслепую»

## 4) Deliverables (что вернуть)

1) Отчёт о каноничности расширения:

- где используется typed expansion
- где используется bridge expansion
- какие сценарии чистые, а какие загрязнённые

2) Result Type (одно значение):

- clean validation или
- compatibility-tainted validation

3) Architectural Status:

- что валидировано
- что не валидировано
- можно ли делать сильные выводы про `edge_policy` и typed edge semantics

---

## RESULTS (filled by Opus)

**Status: COMPLETE**

**Date: 2026-03-06**

**Tests:** `packages/render/src/__tests__/groundingPhase2b.test.js` — 7 tests, all pass

**Report:** `docs/GROUNDING_EXPERIMENTS_PHASE2B.md`

### 1) Отчёт о каноничности расширения

- **Total edges:** 149 (126 typed + 23 bridge `relates`)
- **Bridge edges:** all 23 duplicate `works-in` character→domain connections
- **Clean scenarios:** 1/5 (zucken-drukcken — no `relates` in edge_policy)
- **Tainted scenarios:** 4/5 (music-general, vstablishment, animation-plus, brand-direction — all include `relates` in edge_policy)
- **Secondary taint channel:** Focus Preservation Rule preserves bridge edges touching focus even when `relates` is NOT in edge_policy

### 2) Result Type

**compatibility-tainted validation**

- `visible_types`: CLEAN
- `depth`: CLEAN
- `edge_policy`: TAINTED (4/5 policies)
- Domain membership: BRIDGE-DEPENDENT (engine hardcoded)

### 3) Architectural Status

**Validated (strong conclusions):**

- `visible_types` differentiation — CLEAN (node.type-based, edge-independent)
- `depth` parameter — CLEAN (passed to BFS, edge-independent)
- Focus Preservation Rule (node level) — CLEAN
- Workbench = operator of observation — YES (via `visible_types`)

**NOT validated:**

- `edge_policy` typed semantics (bridge leakage, requires engine fix)
- Edge-based graph expansion control (post-filter only, doesn't affect BFS)
- Engine domain membership (100% bridge-dependent)

**Root cause:** `computeDomainMembership` hardcoded to `edge.type === 'relates'`. Fix: ~5 lines in `computeVisibleSubgraph.js`, non-breaking.

## 5) Architectural note (инвариант/граница)

Не ломать канон pipeline: Log → Evaluate → BuildGraph → Projection → ViewModel → Render.

Никаких engine-изменений: только измерение/маркировка, чтобы сделать выводы Grounding корректными.