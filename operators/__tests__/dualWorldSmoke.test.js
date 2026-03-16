/**
 * Dual-World Smoke Workflow — Calibration tests
 *
 * Validates that the same 4-scenario set produces consistent, comparable
 * results on both documentation-world and authored-mini-world.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { runDualWorldSmoke } from '../runDualWorldSmokeWorkflow.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const baselinePath = resolve(__dir, '..', 'dualWorldSmoke.baseline.json');

let results;
let baseline;

beforeAll(() => {
  results = runDualWorldSmoke();
  baseline = JSON.parse(readFileSync(baselinePath, 'utf-8'));
});

describe('Dual-World Smoke — Determinism', () => {
  test('runner output is deterministic across runs', () => {
    const run2 = runDualWorldSmoke();
    expect(results.length).toBe(run2.length);
    for (let i = 0; i < results.length; i++) {
      expect(results[i].world).toBe(run2[i].world);
      for (const key of Object.keys(results[i].scenarios)) {
        expect(results[i].scenarios[key].ok).toBe(run2[i].scenarios[key].ok);
      }
    }
  });
});

describe('Dual-World Smoke — Baseline matching', () => {
  test('doc-world results match baseline', () => {
    const live = results.find((r) => r.world === 'documentation-world');
    const base = baseline.find((r) => r.world === 'documentation-world');
    expect(live).toBeDefined();
    expect(base).toBeDefined();
    for (const key of Object.keys(live.scenarios)) {
      expect(live.scenarios[key].ok).toBe(base.scenarios[key].ok);
    }
    expect(live.scenarios.rivalExplanations.rivalCount).toBe(
      base.scenarios.rivalExplanations.rivalCount,
    );
    expect(live.scenarios.gapBridge.candidateCount).toBe(
      base.scenarios.gapBridge.candidateCount,
    );
  });

  test('authored-mini-world results match baseline', () => {
    const live = results.find((r) => r.world === 'authored-mini-world');
    const base = baseline.find((r) => r.world === 'authored-mini-world');
    expect(live).toBeDefined();
    expect(base).toBeDefined();
    for (const key of Object.keys(live.scenarios)) {
      expect(live.scenarios[key].ok).toBe(base.scenarios[key].ok);
    }
    expect(live.scenarios.rivalExplanations.rivalCount).toBe(
      base.scenarios.rivalExplanations.rivalCount,
    );
    expect(live.scenarios.gapBridge.candidateCount).toBe(
      base.scenarios.gapBridge.candidateCount,
    );
  });
});

describe('Dual-World Smoke — Acceptance thresholds', () => {
  test('all scenarios satisfy minimum thresholds on both worlds', () => {
    for (const worldResult of results) {
      const s = worldResult.scenarios;

      expect(s.pathExists.ok).toBe(true);
      expect(s.pathExists.hops).toBeGreaterThanOrEqual(1);

      expect(s.directedBoundary.ok).toBe(true);
      expect(s.directedBoundary.traceAB).toBe('no_path');
      expect(s.directedBoundary.traceBA).toBe('path');

      expect(s.rivalExplanations.ok).toBe(true);
      expect(s.rivalExplanations.rivalCount).toBeGreaterThanOrEqual(2);

      expect(s.gapBridge.ok).toBe(true);
      expect(s.gapBridge.traceResult).toBe('no_path');
      expect(s.gapBridge.supportsBridge).toBe(true);
      expect(s.gapBridge.candidateCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('negative guard: if any scenario fails, reason is visible', () => {
    for (const worldResult of results) {
      for (const [name, scenario] of Object.entries(worldResult.scenarios)) {
        if (!scenario.ok) {
          throw new Error(
            `${worldResult.world}/${name} failed: ${JSON.stringify(scenario)}`,
          );
        }
      }
    }
  });
});

describe('Dual-World Smoke — Exploration ≠ Acceptance', () => {
  test('no canonicalization fields in any scenario result', () => {
    for (const worldResult of results) {
      for (const scenario of Object.values(worldResult.scenarios)) {
        expect(scenario).not.toHaveProperty('canonicalized');
        expect(scenario).not.toHaveProperty('approved');
        expect(scenario).not.toHaveProperty('status', 'canonical');
      }
    }
  });
});

describe('Dual-World Smoke — Cross-world comparison', () => {
  test('both worlds produce exactly 4 scenarios each', () => {
    expect(results.length).toBe(2);
    for (const r of results) {
      expect(Object.keys(r.scenarios).length).toBe(4);
    }
  });

  test('scenario keys are identical across worlds', () => {
    const keys0 = Object.keys(results[0].scenarios).sort();
    const keys1 = Object.keys(results[1].scenarios).sort();
    expect(keys0).toEqual(keys1);
  });
});
