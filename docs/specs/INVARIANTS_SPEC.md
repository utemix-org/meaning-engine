# Invariants Spec (Repo Snapshot)

> **Status**: Descriptive snapshot of the invariants specification. The canonical source is the internal Notion spec; this file captures the invariant families and their enforcement for repository-local reference.
>
> **Notion origin**: `6b545241013f4995a8ce74cdcac93491`

## Purpose

The Invariants Spec defines the formal constraints that the engine enforces and tests. These invariants are the core trust surface — if they hold, the engine behaves as promised.

## Invariant families

| Family | Count | Scope |
|--------|-------|-------|
| PROJ (Projection) | 7 | ViewModel output shape, determinism, immutability, identity stability |
| KE (Knowledge Evolution) | 5 | Canonical-only graph build, reject safety, epistemic traceability, idempotency, ViewModel stability |
| NAV (Navigation) | 4 | Reversibility, type safety, deterministic state |
| Structural | 16 | Node/edge consistency, referential integrity, type constraints |
| CP (Change Protocol) | 6 | Proposal → validate → apply lifecycle, rejection safety |
| OP (Operators) | 3 | Operator input validation, output contract, determinism |
| ENG (Engineering) | 3 | Schema stability, export consistency, version discipline |

**Total: 44 invariants. All evidenced by automated tests. 0 gaps.**

## Evidence artifacts

- Full mapping: `docs/INVARIANT_MATRIX.md`
- Proof audit: `docs/PROOF_OBLIGATIONS.md`
- Benchmark data: `docs/OPERATIONAL_LIMITS.md`

## Enforcement

Invariants are enforced at multiple levels:

1. **Construction-time**: `StructuralInvariants.js` checks 16 structural rules on every graph mutation
2. **Pipeline-time**: the projection pipeline validates inputs and outputs at each step
3. **Protocol-time**: `ChangeProtocol.js` enforces the proposal → validate → apply lifecycle
4. **Test-time**: 930+ automated tests exercise all 44 invariants
