# Contributing to Meaning Engine

Thank you for your interest in contributing. This document explains how to engage with the project effectively.

---

## How to open an issue

1. Check [existing issues](https://github.com/utemix-org/meaning-engine/issues) to avoid duplicates.
2. Use the appropriate issue template:
   - **Bug report** — for reproducible problems
   - **Feature proposal** — for new capabilities (read the scope note below first)
   - **Presentation feedback** — for structured feedback after reading/watching presentation materials
3. Provide concrete, specific information. Observations are more useful than opinions.

## How to open a pull request

1. **Open an issue first** describing what you want to change and why.
2. Fork the repo and create a branch from `main`.
3. Make your changes. Keep PRs small and focused — one goal per PR.
4. Run the test suite locally:
   ```bash
   npm ci
   npm test        # all 930+ tests must pass
   ```
5. Open a PR using the pull request template. Fill in all sections.

### Required checks before merge

All PRs must pass 4 CI checks before merging into `main`:

| Check | What it does |
|-------|-------------|
| `test (18.x)` | Tests on Node.js 18 |
| `test (20.x)` | Tests on Node.js 20 + coverage |
| `test (22.x)` | Tests on Node.js 22 |
| `package-check` | Version consistency, types, npm pack, demo verification |

See [docs/PROCESS_CI_AND_MERGE_GATES.md](./docs/PROCESS_CI_AND_MERGE_GATES.md) for full merge gate policy.

## Repo conventions

- **Language**: all code, comments, commit messages, and documentation in English
- **Tests**: every behavioral change must include or update tests
- **Commit messages**: concise, in English, focused on "why" not "what"
- **PRs**: must state goal, non-goals, and whether the change affects the public promise
- **No scope creep**: each PR should do one thing well

## What we welcome

- Bug fixes with reproducible test cases
- Test coverage improvements
- Documentation clarifications
- New reference worlds (see [MAKE_YOUR_FIRST_WORLD.md](./docs/MAKE_YOUR_FIRST_WORLD.md))
- Structured feedback on presentation materials (see [docs/FEEDBACK.md](./docs/FEEDBACK.md))

## What to avoid

- Large, multi-goal PRs
- Changes to the public API surface without prior discussion
- New runtime dependencies without strong justification
- Claims or documentation that overstates what the engine does (see [CLAIMS_AND_NONCLAIMS.md](./docs/presentation/CLAIMS_AND_NONCLAIMS.md))
- Adding experimental features to the stable surface

## Public promise discipline

Meaning Engine maintains strict truthful-claim discipline. If your contribution changes what the engine promises publicly, state this explicitly in the PR description. See [API_SURFACE_POLICY.md](./docs/API_SURFACE_POLICY.md) for the public/experimental boundary.
