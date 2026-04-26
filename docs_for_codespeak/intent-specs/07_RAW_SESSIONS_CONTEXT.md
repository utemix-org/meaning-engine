# Raw Sessions Context

## Purpose

Explain how to interpret the shared raw agent sessions.

## Accepts

- Session logs from Claude / Codex / Cursor / other agents

## Observations

- Sessions are fragmented and non-linear
- Sessions may correspond to different phases of the project
- Sessions may include meta-work (documentation packaging)

## Constraints

- Do not assume chronological completeness
- Do not assume strict mapping to repository structure
- Do not treat each session as a finalized design

## Interpretation

Sessions represent:

- evolving intent
- decision trajectories
- exploration paths

They are best interpreted together with:

- Notion documentation
- intent-specs package

## Expected Signal

The useful signal is not individual prompts.

The useful signal is:

- repeated patterns
- convergence of ideas
- emergence of stable abstractions

## Role in CodeSpeak Pipeline

Sessions provide the "vibe" layer.

This package provides a reconstructed "spec" layer.

Together they form:

```text
vibe -> spec
```
