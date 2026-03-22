# CI Checks and Merge Gate Policy

How CI works in this repo, what checks are required, and what "green" means.

---

## CI workflow

**File**: `.github/workflows/ci.yml`

**Triggers**: runs on every push to `main` and every pull request targeting `main`.

### Checks that run on every PR

| Check | What it does | Required for merge |
|-------|-------------|-------------------|
| `test (18.x)` | `npm ci` + `npm test` on Node.js 18.x | Yes |
| `test (20.x)` | `npm ci` + `npm test` on Node.js 20.x + coverage report | Yes |
| `test (22.x)` | `npm ci` + `npm test` on Node.js 22.x | Yes |
| `package-check` | Version consistency, TypeScript types, `npm pack`, demo command verification | Yes |

All 4 checks must pass before a PR can be merged into `main`.

### What is NOT checked in CI

| Not checked | Reason |
|-------------|--------|
| Linting (ESLint/Prettier) | No linter is currently configured in the project |
| Performance benchmarks | Benchmarks are environment-sensitive; run locally via `node benchmarks/bench.js` |
| Memory profiling | Not yet implemented |
| Demo scripts (traceability world) | Requires `--experimental-vm-modules`; covered by local preflight |

---

## Branch protection on `main`

The `main` branch is protected with the following rules:

| Rule | Setting |
|------|---------|
| Required status checks | All 4 CI checks must pass |
| Strict status checks | Yes — branch must be up-to-date with `main` before merging |
| Require pull request reviews | Not required (single-contributor project) |
| Enforce for admins | No (allows admin override if CI is temporarily broken) |
| Allow force pushes | No |
| Allow deletions | No |

### What "green" means

A PR is green when:
1. All 4 CI checks show ✅ (pass)
2. The branch is up-to-date with `main`

A PR is NOT green when:
- Any check shows ❌ (failure) or 🟡 (pending/running)
- The branch is behind `main` (requires rebase or merge from main)

### Merging with no checks

If GitHub Actions are unavailable (outage, quota exhaustion):
1. Verify locally: `npm ci && npm test` must pass
2. Verify `npm run check:versions` and `npm run check:types` pass
3. An admin may override the merge gate
4. Document the override reason in the PR description

---

## How to add a new required check

1. Add the check step to `.github/workflows/ci.yml`
2. Push a PR and verify the check runs
3. Update branch protection via:
   ```bash
   gh api repos/utemix-org/meaning-engine/branches/main/protection/required_status_checks \
     -X PATCH --input <json-with-new-contexts>
   ```
   Or via GitHub UI: Settings → Branches → Branch protection rules → Edit
4. Update this document

---

## Current status

- **CI**: active, all checks passing
- **Branch protection**: active on `main`
- **Linter**: not configured (future task)
- **Last verified**: 2026-03-22
