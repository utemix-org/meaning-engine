# Cabin Claim Policy (v2)

What can and cannot be claimed about the cabin, based on measured calibration results.

## Measurement basis

All claims below are grounded in calibration v2 over:
- **Case set:** `eval/cabin_cases/golden_v1.json` (8 cases)
- **Proof world:** `worlds/tension-test-world/` (14 nodes, 14 edges)
- **Adapters tested:** deterministic, stub
- **OpenAI adapter:** not yet calibrated (requires API key)

## Allowed claims

| Claim | Evidence |
|-------|----------|
| Cabin has a stable, tested interface (`CabinInput → CabinDiagnosis[]`) | Same contract for deterministic and model-backed modes |
| Deterministic mode correctly identifies all 5 tension classes in the proof world | 8/8 match pass, all dimensions pass |
| The eval harness can distinguish adapter quality | deterministic 8/8 vs stub 4/8 — clear separation |
| Model-backed path does not affect deterministic baseline | Deterministic path unchanged, no shared state |
| Structural pass and diagnostic pass are independent checks | Separate runners, orthogonal criteria |
| Stub adapter correctly echoes question metadata in QD mode | 4/4 QD match pass (by construction) |
| Stub adapter cannot diagnose graph-relief tensions | 0/4 GR match — expected and documented |

## Prohibited claims

| Claim | Why prohibited |
|-------|---------------|
| "Cabin understands knowledge systems" | No evidence of understanding — deterministic mode is rule-based lookup |
| "Cabin can diagnose arbitrary tensions" | Only tested on 5 predefined tension classes in one proof world |
| "Model-backed cabin is production-ready" | OpenAI adapter not yet calibrated; stub is echo-only |
| "Cabin quality is X%" | No real model calibration yet — stub results are not model performance |
| "Cabin generalizes to other worlds" | Only tested on tension-test-world with intentionally embedded patterns |
| "Cabin replaces human review" | No evidence of autonomous discovery or judgment quality |

## Conditional claims (pending OpenAI calibration)

These claims become allowed **only after** OpenAI (or equivalent) adapter calibration:

| Claim | Condition |
|-------|-----------|
| "Model-backed cabin can identify tension X" | OpenAI pass on corresponding case |
| "Model-backed cabin adds value over deterministic" | OpenAI GR pass > 0 (deterministic already 8/8) |
| "Model generates grounded evidence refs" | D4 (grounding) = pass on OpenAI grades |
| "Model avoids hallucination" | D5 (boundedness) = pass on OpenAI grades |

## How to update this policy

1. Run calibration with new adapter: `CABIN_OPENAI_API_KEY=sk-... node eval/runCabinCalibrationReport.js --save`
2. Grade results in `eval/cabin_grades/<adapter>.json`
3. Update this document based on measured outcomes
4. Never upgrade a prohibited claim to allowed without measurement evidence
