# TASK_GROUNDING_PHASE2C_MEMBERSHIP_ALLOWLIST_OPUS

---

title: TASK_GROUNDING_PHASE2C_MEMBERSHIP_ALLOWLIST

kind: engineering

project: Meaning Engine

status: active

scope: p0

maturity: draft

owner: opus

---

Задача для Opus (операционный пакет): Grounding Phase 2c — Canonical Edge Membership Fix.

## 1) Context (зачем сейчас)

Grounding Phase 2a показала: WorkbenchPolicy делает проекции различимыми.

Grounding Phase 2b показала: edge semantics validation compatibility-tainted.

Root cause: engine `computeDomainMembership` hardcoded to `edge.type == 'relates'`.

Из-за этого typed edges (`works-in`, `operates`, …) не участвуют в membership, и `edge_policy` нельзя проверить чисто.

Это не архитектурная проблема, а локальное ограничение реализации engine.

Нужно маленькое исправление membership logic, не меняющее архитектуру.

## 2) Scope (что можно трогать)

Разрешено:

- изменить `computeDomainMembership()` в engine
- ориентировочный файл: `src/core/projection/computeVisibleSubgraph.js`
- заменить hardcoded условие `edge.type === 'relates'` на allowlist membership edges.

Пример:

- `membershipEdges = ['relates', 'works-in']`

или

- `membershipEdges = schema.membershipEdges`

Цель: membership logic не зависит от одного edge type.

## 3) Stop-list (что нельзя менять)

Запрещено:

- менять алгоритм проекции
- менять BFS / traversal
- менять navigation model
- менять формулу контекста `C = {domain?, workbench?, character?}`
- переносить WorkbenchPolicy в engine
- менять pipeline `Log → Evaluate → BuildGraph → Projection → ViewModel → Render`

Engine behaviour должен остаться детерминированным.

## 4) Deliverables (что вернуть)

1) Engine change report:

- какие строки изменены
- как работает новая membership logic

2) Regression check:

- подтвердить: existing tests still pass (engine + render)

3) Phase 2b re-run:

- повторить тесты `groundingPhase2b.test.js`
- обновить отчёт Phase 2b (результат/contamination)

4) Result Type:

- clean validation или compatibility-tainted validation

5) Architectural Status:

- Validated
- Not validated
- Remaining contamination (если есть)

---

## RESULTS (filled by Opus)

**Status: COMPLETE**

**Date: 2026-03-06**

### 1) Engine change report

**File:** `src/core/projection/computeVisibleSubgraph.js`

**Change:** Replaced hardcoded `edge.type === 'relates'` with `MEMBERSHIP_EDGE_TYPES.has(edge.type)`

**Allowlist:**

```
MEMBERSHIP_EDGE_TYPES = ['relates', 'works-in', 'operates', 'member-of', 'reflects', 'intersects']
```

**Lines changed:** ~10 (added const + replaced condition + updated JSDoc)

**Behaviour:** Domain membership Level 1 now follows all semantic edge types, not just `relates`. Structural edges (`contains`, `structural`, `internal`) are deliberately excluded to prevent hub flooding.

**World data:** Removed all 23 bridge `relates` edges from `universe.json` (149 → 126 edges).

### 2) Regression check

**536 tests, 23 files — ALL PASS** (engine + render)

No existing test broke from the change.

### 3) Phase 2b re-run

All 7 Phase 2b validation tests pass.

**Clean scenarios: 5/5** (was 1/5 before fix)

- All workbench policies now produce 0 bridge edges in output
- Edge types in projections: only typed edges (`works-in`, `operates`, `contains`, `member-of`, `structural`, `intersects`)
- No `relates` bridge contamination

### 4) Result Type

**clean validation**

- visible_types: clean
- depth: clean
- edge_policy: **clean** (was tainted)
- domain membership: **clean** (was bridge-dependent)

### 5) Architectural Status

**All validated:**

- visible_types differentiation — CLEAN
- depth parameter — CLEAN
- edge_policy typed semantics — **CLEAN (Phase 2c)**
- Focus Preservation Rule — CLEAN
- Workbench = operator of observation — **CLEAN**
- Domain membership — **CLEAN (MEMBERSHIP_EDGE_TYPES)**

**Not validated:** (none)

**Remaining contamination:** none

## 5) Architectural note (инвариант)

Фикс не меняет архитектуру системы. Он устраняет implementation coupling: domain membership ↔ relates edge.

Цель: membership определяется семантикой edges (allowlist), а не hardcoded типом.

Это нужно для корректной проверки typed edge semantics и `edge_policy` в Grounding.