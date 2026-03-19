# Model Adapter Boundary

This document describes the cabin's 3-phase pipeline for model-backed diagnostic passes.

## Pipeline

```
CabinInput + World + Questions
        │
        ▼
┌───────────────────┐
│ buildCabinContext  │  Phase 1: Context Assembly
│ (src/cabin/       │  Deterministic, size-limited
│  context.js)      │  No file system reads
└───────┬───────────┘
        │ CabinContext
        ▼
┌───────────────────┐
│ adapter.invoke()  │  Phase 2: Model Invocation
│ (src/cabin/       │  Provider-agnostic boundary
│  adapters/*.js)   │  Replaceable adapter
└───────┬───────────┘
        │ ModelResponse (raw + parsed)
        ▼
┌───────────────────┐
│ normalizeCabin    │  Phase 3: Output Normalization
│ Output()          │  Strict envelope parsing
│ (src/cabin/       │  Error → explicit failure record
│  normalize.js)    │
└───────┬───────────┘
        │ CabinDiagnosis[]
        ▼
   Same contract as
   deterministic mode
```

## Adapter interface

```typescript
interface ModelAdapter {
  name: string;
  invoke(request: ModelRequest): Promise<ModelResponse>;
}
```

Adapters are provider-agnostic. The adapter receives a `ModelRequest` (containing a `CabinContext` and optional `model_config`) and returns a `ModelResponse`.

### Available adapters

| Adapter | Module | Requires |
|---------|--------|----------|
| `stub` | `src/cabin/adapters/stub.js` | Nothing (returns echo-based envelope) |
| `openai` | `src/cabin/adapters/openai.js` | `CABIN_OPENAI_API_KEY` env var |
| `deepseek` | `src/cabin/adapters/deepseek.js` | `CABIN_DEEPSEEK_API_KEY` env var |
| `openrouter` | `src/cabin/adapters/openrouter.js` | `CABIN_OPENROUTER_API_KEY` env var |

### Adding a new adapter

1. Create `src/cabin/adapters/<name>.js`
2. Export a function or object implementing `ModelAdapter`
3. Register in `src/cabin/adapters/index.js` → `resolveAdapter()`

## Context assembly

`buildCabinContext()` produces a deterministic, size-limited context:

- **World summary**: nodes (id, type, title) and edges (source, target, type, layer), capped by `maxNodes`/`maxEdges`
- **Question context** (question-driven mode): prompt, issue_type, severity, evidence_refs, structural_signal
- **Probe context** (graph-relief-driven mode): signal_type, params
- **System prompt**: fixed instructions for structured JSON output
- **Output schema**: JSON Schema for the expected envelope

No hidden state. No file system reads. All inputs are explicit parameters.

## Output envelope

The model must respond with:

```json
{
  "diagnoses": [
    {
      "issue_type": "doc_runtime_mismatch",
      "severity": "P0",
      "claim": "...",
      "evidence_refs": {
        "doc_refs": [],
        "code_refs": [],
        "graph_refs": ["node:id"]
      },
      "reasoning": "optional"
    }
  ]
}
```

`normalizeCabinOutput()` performs strict validation:
- Missing/invalid `diagnoses` array → `_parse_error` diagnosis
- Missing required fields on individual diagnoses → `_parse_error`
- No silent fallback to deterministic answers

## Secrets / config policy

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CABIN_OPENAI_API_KEY` | For openai adapter | — | OpenAI API key |
| `CABIN_OPENAI_MODEL` | No | `gpt-4o-mini` | Model name |

Keys are **never** stored in the repository. If no key is set:
- `npm test` and CI pass normally (no model dependency)
- `--model openai` flag throws a clear error at startup
- `--model stub` always works without any credentials

## Running

```bash
# Deterministic baseline (always works):
node eval/runCabinEvalDiagnosticPass.js

# Model-backed with stub (no credentials needed):
node eval/runCabinEvalDiagnosticPass.js --model stub

# Model-backed with OpenAI (requires CABIN_OPENAI_API_KEY):
CABIN_OPENAI_API_KEY=sk-... node eval/runCabinEvalDiagnosticPass.js --model openai

# With trace logging:
node eval/runCabinEvalDiagnosticPass.js --model openai --trace
```
