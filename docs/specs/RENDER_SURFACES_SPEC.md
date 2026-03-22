# Render Surfaces Spec (Repo Snapshot)

> **Status**: Descriptive snapshot. The Render Surfaces Spec is **out of scope** for this repository. Meaning Engine produces data structures (ViewModels); rendering is a separate concern.
>
> **Notion origin**: `1d47fe5f22ef4318b62dd8b129e9f791`

## Purpose

The Render Surfaces Spec defines how ViewModels produced by the projection pipeline could be rendered in different visual contexts (2D graph, 3D scene, text-based report, etc.).

## Relationship to this repository

This spec is **referenced but not implemented** in the Meaning Engine core:

- `buildViewModel.js` mentions `RENDER_SURFACES_SPEC` as out-of-scope context
- The engine produces a ViewModel with `nodes`, `edges`, `focus`, `stats`, and `meta` — but does not render it
- Rendering is explicitly a non-promise of this project (see `docs/presentation/CLAIMS_AND_NONCLAIMS.md`)

## Key principle

The engine is not a UI framework. The ViewModel is the API boundary. How it gets rendered (if at all) is the consumer's responsibility.
