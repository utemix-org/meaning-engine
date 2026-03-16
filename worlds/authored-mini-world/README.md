# Authored Mini-World: Type Theory

A small, intentionally constructed knowledge domain (25 nodes, 27 edges) designed
to stress-test the Meaning Engine operator stack on a graph that was **authored**,
not extracted from code.

The domain models core concepts from type theory: lambda calculus, Hindley-Milner
inference, dependent types, and linear types.

## 4 Built-in Control Situations

### S1. Path exists
- `spec:type-theory-overview` → `evidence:coq-proof` (3 hops)
- Route: TTO → concept:soundness → invariant:progress-preservation → coq-proof

### S2. Directed boundary
- `code_artifact:type-checker` **implements** `spec:type-theory-overview`
- Trace(TTO → typeChecker) = **no_path** (no directed outgoing path from spec to code)
- Trace(typeChecker → TTO) = **path** (1 hop via `implements`)

### S3. Rival explanations
- `spec:type-theory-overview` → `code_artifact:inference-engine`: **2 rival paths**
  - Concept-mediated: TTO → polymorphism → HM → inferenceEngine.js
  - Code-dependency: TTO → typeChecker.js → typeChecker.test.js → inferenceEngine.js

### S4. True GAP + bridge candidates
- `spec:type-theory-overview` → `evidence:rust-borrow-checker-test`
- The linear-types cluster (spec:linear-types, concept:affine-types,
  evidence:rust-borrow-checker-test) is intentionally disconnected from the main
  component.
- `supportsBridgeCandidates` returns `ok: true` with 3 candidates.

## Node types used
`spec`, `concept`, `invariant`, `evidence`, `code_artifact`

## Edge types used
`defines`, `refines`, `constrains`, `proved_by`, `implements`, `depends_on`
