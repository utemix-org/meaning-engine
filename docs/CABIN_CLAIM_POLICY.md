# Cabin Claim Policy (v3)

What can and cannot be claimed about the cabin, based on measured calibration results.

## Measurement basis

All claims below are grounded in calibration v3 over:
- **Case set:** `eval/cabin_cases/golden_v1.json` (8 cases: 4 question-driven, 4 graph-relief)
- **Proof world:** `worlds/tension-test-world/` (14 nodes, 14 edges)
- **Adapters tested:** deterministic, stub, openrouter (deepseek-chat via OpenRouter)
- **DeepSeek direct:** not calibrated (402 Insufficient Balance — adapter works, account has no credits)
- **OpenAI adapter:** not yet calibrated (requires API key)

### Calibration results summary

| Adapter | QD pass | GR pass | Total | Overall |
|---------|---------|---------|-------|---------|
| deterministic | 4/4 | 4/4 | **8/8** | All pass |
| stub | 4/4 | 0/4 | **4/8** | 4 weak_pass, 4 structured_wrong |
| openrouter (deepseek-chat) | 4/4 | 1/4 | **5/8** | 5 pass, 1 weak_pass, 2 structured_wrong |
| deepseek (direct) | 0/4 | 0/4 | **0/8** | 8 parse_fail (API error, not model quality) |

## Allowed claims

| Claim | Evidence |
|-------|----------|
| Cabin has a stable, tested interface (`CabinInput → CabinDiagnosis[]`) | Same contract for deterministic and model-backed modes |
| Deterministic mode correctly identifies all 5 tension classes in the proof world | 8/8 match pass, all dimensions pass |
| The eval harness can distinguish adapter quality | deterministic 8/8 vs stub 4/8 vs openrouter 5/8 — clear separation |
| Model-backed path does not affect deterministic baseline | Deterministic path unchanged, no shared state |
| Structural pass and diagnostic pass are independent checks | Separate runners, orthogonal criteria |
| Stub adapter correctly echoes question metadata in QD mode | 4/4 QD match pass (by construction) |
| Stub adapter cannot diagnose graph-relief tensions | 0/4 GR match — expected and documented |
| Model-backed cabin (deepseek-chat) achieves 100% on question-driven cases | 4/4 QD pass — all issue types, severities, evidence refs correct |
| Model-backed cabin adds value over stub for graph-relief | openrouter GR 1/4 pass > stub GR 0/4 pass |
| Model generates grounded evidence refs in QD mode | All 4 QD cases: graph_refs, doc_refs, code_refs match expected |
| Model avoids hallucination in QD mode | D5 (boundedness) = pass on all 4 QD cases |
| Pipeline correctly converts API errors to structured diagnostics | DeepSeek 402 → `_parse_error` diagnoses, no crashes |

## Prohibited claims

| Claim | Why prohibited |
|-------|---------------|
| "Cabin understands knowledge systems" | No evidence of understanding — model follows structured prompts |
| "Cabin can diagnose arbitrary tensions" | Only tested on 5 predefined tension classes in one proof world |
| "Model-backed cabin is production-ready" | Only 1 provider tested; GR mode still has 3/4 failures |
| "Cabin quality is 100%" | Question-driven: 100%; graph-relief: 25% — significant gap |
| "Cabin generalizes to other worlds" | Only tested on tension-test-world with intentionally embedded patterns |
| "Cabin replaces human review" | No evidence of autonomous discovery or judgment quality |
| "Graph-relief mode is reliable" | 1/4 pass — model struggles with structural pattern detection |

## Conditional claims (pending further calibration)

These claims become allowed **only after** additional adapter calibration:

| Claim | Condition |
|-------|-----------|
| "Model-backed cabin reliably diagnoses graph-relief tensions" | GR pass ≥ 3/4 on any adapter |
| "Model correctly assigns severity in GR mode" | GR severity_correctness = pass on ≥ 3/4 cases |
| "Model detects missing_bridge (isolated nodes)" | CE-GR-004 pass on any adapter (currently fails) |
| "Model matches deterministic quality" | Any model adapter achieves 8/8 match pass |
| "Multiple providers are calibrated" | ≥ 2 real model adapters with grade files |

## Observed failure patterns (openrouter/deepseek-chat)

| Case | Failure | Analysis |
|------|---------|----------|
| CE-GR-001 | wrong_issue_type (spec_path_drift instead of doc_runtime_mismatch) | Model confused drift_against edge type with spec path issues |
| CE-GR-002 | wrong_severity only (P1 instead of P0) | Near-miss — model found the right tension but underrated severity |
| CE-GR-004 | wrong_issue_type (type_contract_drift instead of missing_bridge) | Model cannot detect isolated nodes — focused on contradicts edges instead |

## How to update this policy

1. Run calibration with new adapter: `CABIN_<PROVIDER>_API_KEY=... node eval/runCabinCalibrationReport.js --save`
2. Grade results in `eval/cabin_grades/<adapter>.json`
3. Update this document based on measured outcomes
4. Never upgrade a prohibited claim to allowed without measurement evidence
5. Record failure patterns for each new adapter to guide prompt improvement
