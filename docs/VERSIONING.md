# Versioning Policy

## Single-version model (Variant A)

`package.json` is the **single source of truth** for the project version.

All other version references must match it:

| Source | Location | Sync mechanism |
|--------|----------|----------------|
| `package.json` version | root | authoritative |
| `ENGINE_VERSION` | `src/engine/index.js` | reads `package.json` at runtime |
| `specification.json` version | `specification/specification.json` | manual, checked by `npm run check:versions` |
| CHANGELOG | `CHANGELOG.md` | manual, entry required for each release |

## Bumping

1. Change version in `package.json`
2. Update `specification/specification.json` version to match
3. Add CHANGELOG entry
4. Run `npm run check:versions` to verify consistency
5. Commit, tag, push

## SemVer rules during 0.y.z

- Minor bumps (`0.y.0`) may contain breaking changes to the public API surface
- Patch bumps (`0.x.z`) contain fixes, docs, and non-breaking additions only
- See [API_SURFACE_POLICY.md](./API_SURFACE_POLICY.md) for what is covered by SemVer
