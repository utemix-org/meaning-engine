/**
 * Reasoning Report — CLI markdown report tests
 *
 * Validates determinism, completeness, and invariants of the
 * generated markdown report across both worlds.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateReport } from '../runReasoningReport.js';

const __dir = dirname(fileURLToPath(import.meta.url));

let fullReport;
let docReport;
let authoredReport;

beforeAll(() => {
  fullReport = generateReport({ fromBaseline: true });
  docReport = generateReport({ world: 'documentation-world', fromBaseline: true });
  authoredReport = generateReport({ world: 'authored-mini-world', fromBaseline: true });
});

describe('Reasoning Report — Determinism', () => {
  test('report is deterministic (snapshot match)', () => {
    const run2 = generateReport({ fromBaseline: true });
    expect(fullReport).toBe(run2);
  });

  test('filtered report is deterministic', () => {
    const r1 = generateReport({ world: 'documentation-world', scenario: 'path_exists', fromBaseline: true });
    const r2 = generateReport({ world: 'documentation-world', scenario: 'path_exists', fromBaseline: true });
    expect(r1).toBe(r2);
  });
});

describe('Reasoning Report — Both worlds', () => {
  test('full report contains documentation-world section', () => {
    expect(fullReport).toContain('## documentation-world');
    expect(fullReport).toContain('116 nodes');
  });

  test('full report contains authored-mini-world section', () => {
    expect(fullReport).toContain('## authored-mini-world');
    expect(fullReport).toContain('25 nodes');
  });
});

describe('Reasoning Report — All 4 scenarios', () => {
  test('report includes Path Exists scenario', () => {
    expect(fullReport).toContain('### ✓ Path Exists');
    expect(fullReport).toContain('PATH (1 hop)');
    expect(fullReport).toContain('PATH (3 hops)');
  });

  test('report includes Directed Boundary scenario', () => {
    expect(fullReport).toContain('### ✓ Directed Boundary');
    expect(fullReport).toContain('Trace(A→B):');
    expect(fullReport).toContain('no_path');
  });

  test('report includes Rival Explanations scenario', () => {
    expect(fullReport).toContain('### ✓ Rival Explanations');
    expect(fullReport).toContain('Rival count:');
    expect(fullReport).toContain('Strength distribution:');
  });

  test('report includes GAP + Bridge scenario', () => {
    expect(fullReport).toContain('### ✓ GAP + Bridge Candidates');
    expect(fullReport).toContain('Candidate count:');
    expect(fullReport).toContain('Candidates:');
  });
});

describe('Reasoning Report — Exploration ≠ Acceptance', () => {
  test('report includes disclaimer', () => {
    expect(fullReport).toContain('All results remain compute artifacts. No acceptance.');
  });

  test('disclaimer appears at the end of every report variant', () => {
    expect(docReport).toContain('No acceptance.');
    expect(authoredReport).toContain('No acceptance.');

    const filtered = generateReport({
      world: 'authored-mini-world',
      scenario: 'gap_and_bridge',
      fromBaseline: true,
    });
    expect(filtered).toContain('No acceptance.');
  });
});

describe('Reasoning Report — No graph mutation', () => {
  test('generating report does not mutate underlying graphs', () => {
    const nodesBefore = JSON.parse(
      readFileSync(resolve(__dir, '..', '..', 'worlds', 'documentation-world', 'seed.nodes.json'), 'utf-8'),
    ).length;
    const edgesBefore = JSON.parse(
      readFileSync(resolve(__dir, '..', '..', 'worlds', 'documentation-world', 'seed.edges.json'), 'utf-8'),
    ).length;

    generateReport({ fromBaseline: false });

    const nodesAfter = JSON.parse(
      readFileSync(resolve(__dir, '..', '..', 'worlds', 'documentation-world', 'seed.nodes.json'), 'utf-8'),
    ).length;
    const edgesAfter = JSON.parse(
      readFileSync(resolve(__dir, '..', '..', 'worlds', 'documentation-world', 'seed.edges.json'), 'utf-8'),
    ).length;

    expect(nodesAfter).toBe(nodesBefore);
    expect(edgesAfter).toBe(edgesBefore);
  });
});

describe('Reasoning Report — Strength rubric', () => {
  test('report contains strength labels for all scenarios', () => {
    expect(fullReport).toContain('**Strength:** medium');
    expect(fullReport).toContain('**Strength:** strong');
    expect(fullReport).toContain('**Strength:** mixed');
    expect(fullReport).toContain('**Strength:** weakest');
  });
});
