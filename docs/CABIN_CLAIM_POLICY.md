# Cabin Claim Policy (v5)

What can and cannot be claimed about the cabin, based on measured calibration results.

## Measurement basis

All claims below are grounded in calibration v1.1 + robustness v1 over:
- **Case sets:** `eval/cabin_cases/golden_v1.json` (8 control cases) + `eval/cabin_cases/robustness_v1.json` (5 robustness cases)
- **Proof world:** `worlds/tension-test-world/` (17 nodes, 18 edges — extended for robustness)
- **Adapters tested:** deterministic, stub, openrouter (deepseek-chat via OpenRouter)
- **Context version:** v1.1 — semantic legend + pre-resolved probe matches (for GR mode)
- **DeepSeek direct:** not calibrated (402 Insufficient Balance — adapter works, account has no credits)
- **OpenAI adapter:** not yet calibrated (requires API key)

### Calibration results summary

| Adapter | QD pass | GR pass | Total | Overall |
|---------|---------|---------|-------|---------|
| deterministic | 4/4 | 4/4 | **8/8** | All pass |
| stub | 4/4 | 0/4 | **4/8** | 4 weak_pass, 4 structured_wrong |
| openrouter v1.0 (no legend) | 4/4 | 1/4 | **5/8** | 5 pass, 1 weak_pass, 2 structured_wrong |
| openrouter v1.1 (with legend) | 4/4 | 4/4 | **8/8** | All pass |
| openrouter v1.1 robustness | — | 5/5 | **5/5** | All pass (new GR variations) |
| deepseek (direct) | 0/4 | 0/4 | **0/8** | 8 parse_fail (API error, not model quality) |

### GR before/after delta (v1.0 → v1.1)

| Case | v1.0 | v1.1 | Fixed patterns | Root cause of improvement |
|------|------|------|----------------|--------------------------|
| CE-GR-001 | structured_wrong (spec_path_drift/P1) | **pass** (doc_runtime_mismatch/P0) | wrong_issue_type, wrong_severity, missing_evidence | Semantic legend: `drift_against` → `doc_runtime_mismatch/P0` |
| CE-GR-002 | weak_pass (correct type, P1 instead of P0) | **pass** (type_contract_drift/P0) | wrong_severity | Semantic legend: `contradicts` → `type_contract_drift/P0` |
| CE-GR-003 | pass | **pass** (unchanged) | — | Already correct in v1.0 |
| CE-GR-004 | structured_wrong (type_contract_drift/P1) | **pass** (missing_bridge/P2) | wrong_issue_type, wrong_severity, missing_evidence | Probe resolution pre-computed isolated node; legend: isolation → `missing_bridge/P2` |

### Robustness Check v1 (predeclared threshold)

**Predeclared threshold** (set before seeing results):
- **Robustness holds:** ≥ 4/5 pass
- **Partial robustness:** 2–3/5 pass
- **Overfit suspected:** ≤ 1/5 pass

**Result: 5/5 pass → robustness holds**

| Case | Variation type | Result | Notes |
|------|---------------|--------|-------|
| RB-GR-001 | node type generalization (invariant vs decision) | **pass** | Legend proved_by pattern generalizes to invariant type |
| RB-GR-002 | multi-match (2 isolated nodes) | **pass** | Model found NEW isolated node, not just original |
| RB-GR-003 | multi-match (2 drift_against edges) | **pass** | Model reported NEW drift instance correctly |
| RB-GR-004 | multi-match (2 contradicts edges) | **pass** | Model reported NEW contradiction correctly |
| RB-GR-005 | novel absence (constrains, not in legend) | **pass** | Model generalized beyond explicit legend entries |

**Variation coverage:** 4 of 5 required categories tested (missing_bridge, unsupported_claim, drift/contradiction, severity edge cases via novel pattern).

**Reproducibility metadata:**
- Provider: openrouter (deepseek/deepseek-chat)
- Temperature: 0
- Case set hash: robustness_v1.json
- Context/legend version: v1.1 (commit 222b59c)
- Control grade strategy: rerun at current commit (all 8/8 pass confirmed)
- New failure patterns: **none**
- Classification: **robustness holds**

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
| Model-backed cabin (deepseek-chat) achieves 100% on question-driven cases | 4/4 QD pass — all issue types, severities, evidence refs correct |
| Model-backed cabin achieves 100% on graph-relief cases (with semantic legend) | 4/4 GR pass in v1.1 — all issue types, severities, evidence refs correct |
| Model-backed cabin matches deterministic quality on proof material | 8/8 match pass (v1.1) = deterministic 8/8 |
| Model generates grounded evidence refs in both QD and GR modes | All 8 cases: graph_refs match expected |
| Model avoids hallucination in both modes | D5 (boundedness) = pass on all 8 cases |
| Semantic legend improves GR quality measurably | v1.0: 1/4 GR → v1.1: 4/4 GR (same provider, same cases, same matcher) |
| GR quality transfers to new variations (robustness holds) | 5/5 robustness cases pass: multi-match, node type generalization, novel absence pattern |
| Legend generalizes from decision to invariant for proved_by absence | RB-GR-001: invariant without proved_by correctly classified as unsupported_claim |
| Model handles multi-match probes correctly | RB-GR-002/003/004: 2 isolated nodes, 2 drift_against edges, 2 contradicts edges — correct results |
| Model handles novel absence patterns beyond explicit legend | RB-GR-005: decision without constrains (not in legend) → correctly classified |
| Pipeline correctly converts API errors to structured diagnostics | DeepSeek 402 → `_parse_error` diagnoses, no crashes |

## Prohibited claims

| Claim | Why prohibited |
|-------|---------------|
| "Cabin understands knowledge systems" | No evidence of understanding — model follows structured prompts with semantic legend |
| "Cabin can diagnose arbitrary tensions" | Only tested on 5 predefined tension classes in one proof world |
| "Model-backed cabin is production-ready" | Only 1 provider tested; only 1 proof world |
| "Cabin generalizes to other worlds" | Only tested on tension-test-world with intentionally embedded patterns |
| "Cabin replaces human review" | No evidence of autonomous discovery or judgment quality |
| "GR works without semantic legend" | v1.0 measured at 1/4; improvement depends on legend |

## Conditional claims (pending further calibration)

These claims become allowed **only after** additional evidence:

| Claim | Condition |
|-------|-----------|
| ~~"Semantic legend generalizes to new tension types"~~ | **Promoted to allowed** — RB-GR-005 tests novel absence pattern (constrains, not in legend), model passes |
| "Model-backed cabin works on real-world graphs" | Calibration on a non-proof world (e.g., documentation-world) |
| "Multiple providers produce similar quality" | ≥ 2 real model adapters with ≥ 6/8 pass |
| "Cabin is useful for ongoing development" | At least one tension discovered by model that was not pre-embedded |

## How to update this policy

1. Run calibration with new adapter: `CABIN_<PROVIDER>_API_KEY=... node eval/runCabinCalibrationReport.js --save`
2. Grade results in `eval/cabin_grades/<adapter>.json`
3. Update this document based on measured outcomes
4. Never upgrade a prohibited claim to allowed without measurement evidence
5. Record failure patterns for each new adapter to guide prompt improvement
