# Traceability Case — Authentication Module

This document explains the traceability reference world and its scenarios. It is the first external proof case for Meaning Engine, demonstrating that the engine can operate on an engineering-recognizable problem: tracing requirements through implementation to test evidence.

## What the world models

The world represents an authentication module with 21 nodes and 22 edges across 5 entity types:

| Type | Count | Examples |
|------|-------|---------|
| **spec** | 4 | User authentication, session expiry, account lockout, password reset |
| **concept** | 6 | Credential validation, session lifecycle, security boundary, test coverage |
| **invariant** | 2 | No plaintext password storage, audit trail for auth events |
| **code_artifact** | 5 | authService.js, sessionManager.js, passwordHash.js, lockoutHandler.js, resetHandler.js |
| **evidence** | 4 | login.test.js, session.test.js, hash.test.js, lockout.test.js |

The graph uses 5 edge types following existing Meaning Engine conventions:

| Edge type | Direction | Meaning |
|-----------|-----------|---------|
| `defines` | spec → concept | Spec introduces a concept |
| `constrains` | concept → invariant | Concept imposes a constraint |
| `proved_by` | invariant/code/concept → evidence | Entity is proved by evidence |
| `implements` | code_artifact → spec | Code implements a spec |
| `depends_on` | code → code, concept → concept | Dependency relation |

### Deliberate design choices

- **One deliberate gap**: `spec:password-reset` has a concept and code implementation but **no test evidence**. The `resetHandler.js` is isolated from the evidence layer — there are no `proved_by` edges from it.
- **Two rival paths**: `spec:auth-login` reaches `evidence:login-tests` through two equally short 2-hop paths: one via `concept:credential-validation` (abstraction layer) and one via `code_artifact:authService` (implementation layer).
- **Bridge concepts**: `concept:test-coverage` and `concept:code-spec-alignment` exist in the graph to enable Meaning Engine's bridge candidate detection when gaps are found.

## Scenarios

### S1: Spec → Evidence traceability

**Question**: Can we trace from a requirement to its test evidence?

```
trace(spec:auth-login → evidence:login-tests)
→ PATH FOUND (2 hops)
→ spec:auth-login → concept:credential-validation → evidence:login-tests
```

**What this shows**: The engine finds a directed path from requirement to test evidence, traversing the concept layer. This is the basic traceability operation.

### S2: Rival implementation paths

**Question**: Are there multiple routes from a spec to its evidence?

```
compare(spec:auth-login, evidence:login-tests)
→ 2 RIVAL PATHS
  Path 1: spec → concept:credential-validation → evidence  (concept-heavy)
  Path 2: spec → code:authService → evidence               (code-heavy)
```

**What this shows**: The compare operator detects that the same spec-to-evidence connection exists via two structurally different paths. The clustering engine labels them by structural signature (concept-heavy vs code-heavy). This helps an engineer see that the requirement is covered from both an abstract and an implementation perspective.

### S3: Gap detection

**Question**: Does the password-reset spec have test evidence?

```
trace(spec:password-reset → any evidence)
→ NO PATH

Bridge candidates suggested:
  - concept:test-coverage
  - concept:acceptance-criteria
  - concept:verification-method
```

**What this shows**: The engine identifies that `spec:password-reset` has no traceable path to any evidence node. It suggests bridge concepts that could close the gap. In a real project, this signals a missing test or an unverified requirement.

### S4: Invariant enforcement trace

**Question**: Can we trace constraints to their evidence?

```
trace(invariant:no-plaintext → evidence:hash-tests) → PATH FOUND (1 hop)
trace(invariant:audit-trail → evidence:login-tests) → PATH FOUND (1 hop)
trace(code:authService → spec:auth-login) → PATH FOUND (1 hop)
```

**What this shows**: Invariants (constraints) are directly linked to evidence. Code artifacts trace back to their specs via `implements` edges. This confirms that the constraint enforcement chain is intact.

### S5: Focused projection

**Question**: What does the local structure around a requirement look like?

```
projectGraph(focus: spec:auth-login)
→ 4 visible nodes, 4 visible edges
→ Neighbors: credential-validation, security-boundary, authService
→ canDrillDown: true
```

**What this shows**: The projection engine correctly builds a focused view of the graph around a single node, showing its immediate neighborhood. This is the basic exploration operation for understanding local structure.

## Why this is an engineering-relevant proof case

1. **Recognizable problem**: Every engineering team deals with spec-to-test traceability. The problem domain requires no explanation.

2. **Current engine strengths**: The scenarios use only existing stable-core capabilities: `trace`, `compare`, `projectGraph`, and `supports*` operators. No new capabilities were added.

3. **Honest gap**: The deliberate gap (password-reset without tests) demonstrates that the engine can identify missing coverage, not just confirm existing links.

4. **Structural insight**: The rival path detection shows that the engine provides structural analysis beyond simple yes/no connectivity.

## What this does NOT demonstrate

- **Large-scale traceability**: This is a 21-node world. Real codebases have thousands of files and specs. The engine has been benchmarked up to 2,500 nodes (see `docs/OPERATIONAL_LIMITS.md`), but the traceability world does not prove large-scale readiness.

- **Real-time updates**: The world is static. There is no demonstration of live graph mutation as code or tests change.

- **External tool integration**: The world is self-contained. There is no import from Jira, GitHub Issues, or a test runner.

- **Automated remediation**: The engine detects gaps but does not suggest fixes beyond bridge concepts. It does not generate tests or link missing specs.

- **Industrial compliance**: This is a proof-of-utility case, not a compliance solution. It demonstrates the mechanism, not regulatory conformance.

## How to run

```bash
# Run the demo script
node --experimental-vm-modules worlds/traceability-world/demo.js

# Run the automated tests
npm test -- worlds/traceability-world/__tests__/traceabilityWorld.test.js
```

## Graph topology

```
spec:auth-login ──defines──→ concept:credential-validation ──proved_by──→ evidence:login-tests
       │                              │                                         ▲
       │ ──defines──→ concept:security-boundary ──constrains──→ invariant:no-plaintext ──proved_by──→ evidence:hash-tests
       │                    │                                                    ▲
       ▲                    └──depends_on──→ concept:credential-validation       │
code:authService ──implements──┘                    │                            │
       │                                   constrains ──→ invariant:audit-trail ──proved_by──→ evidence:login-tests
       ├──depends_on──→ code:passwordHash ──proved_by──→ evidence:hash-tests
       ├──depends_on──→ code:sessionManager ──proved_by──→ evidence:session-tests
       └──proved_by──→ evidence:login-tests

spec:password-reset ──defines──→ concept:password-recovery  (dead end — no evidence)
       ▲
code:resetHandler ──implements──┘                           (no proved_by — GAP)

spec:session-expiry ──defines──→ concept:session-lifecycle ──proved_by──→ evidence:session-tests
       ▲
code:sessionManager ──implements──┘

spec:account-lockout
       ▲
code:lockoutHandler ──implements──┘ ──proved_by──→ evidence:lockout-tests
       └──depends_on──→ code:authService
```
