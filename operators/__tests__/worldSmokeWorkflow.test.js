import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { runWorldSmoke } from '../runWorldSmokeWorkflow.js';

const __dir = dirname(fileURLToPath(import.meta.url));
const tinyWorldPath = resolve(__dir, '..', '..', 'worlds', 'tiny-world');
const authoredWorldPath = resolve(__dir, '..', '..', 'worlds', 'authored-mini-world');

describe('Custom World Smoke Workflow', () => {
  // ── Tiny world loads ──────────────────────────────────────────────────
  test('1) tiny-world loads and runner produces report', () => {
    const { report, graph } = runWorldSmoke(tinyWorldPath);
    expect(graph.nodes).toHaveLength(6);
    expect(graph.edges).toHaveLength(5);
    expect(report).toContain('6 nodes');
    expect(report).toContain('5 edges');
  });

  // ── Default pair (first/last node) ────────────────────────────────────
  test('2) default pair picks first and last node', () => {
    const { fromId, toId } = runWorldSmoke(tinyWorldPath);
    expect(fromId).toBe('spec:cooking-basics');
    expect(toId).toBe('concept:seasoning');
  });

  // ── Custom --from/--to ────────────────────────────────────────────────
  test('3) custom from/to pair produces trace path', () => {
    const { report } = runWorldSmoke(tinyWorldPath, {
      from: 'spec:cooking-basics',
      to: 'evidence:sear-test',
    });
    expect(report).toContain('**PATH**');
    expect(report).toContain('3 hops');
  });

  // ── Compare finds rivals when they exist ──────────────────────────────
  test('4) compare detects rival paths on cooking-basics → sear-test', () => {
    const { report } = runWorldSmoke(tinyWorldPath, {
      from: 'spec:cooking-basics',
      to: 'evidence:sear-test',
    });
    expect(report).toContain('supportsCompare: **ok**');
    expect(report).toContain('Rival paths: **2**');
  });

  // ── Honest degradation: supportsTrace ─────────────────────────────────
  test('5) supportsTrace reports "limited" on tiny-world (no code_artifact)', () => {
    const { report } = runWorldSmoke(tinyWorldPath);
    expect(report).toContain('supportsTrace: **limited**');
  });

  // ── Honest degradation: supportsBridgeCandidates ──────────────────────
  test('6) supportsBridgeCandidates reports "not supported" when path exists', () => {
    const { report } = runWorldSmoke(tinyWorldPath, {
      from: 'spec:cooking-basics',
      to: 'evidence:sear-test',
    });
    expect(report).toContain('supportsBridgeCandidates: **not supported**');
    expect(report).toContain('no_gap');
  });

  // ── No graph mutation ─────────────────────────────────────────────────
  test('7) runner does not mutate seed files', () => {
    const nodesBefore = readFileSync(resolve(tinyWorldPath, 'seed.nodes.json'), 'utf-8');
    const edgesBefore = readFileSync(resolve(tinyWorldPath, 'seed.edges.json'), 'utf-8');

    runWorldSmoke(tinyWorldPath);
    runWorldSmoke(tinyWorldPath, { from: 'spec:cooking-basics', to: 'evidence:sear-test' });

    const nodesAfter = readFileSync(resolve(tinyWorldPath, 'seed.nodes.json'), 'utf-8');
    const edgesAfter = readFileSync(resolve(tinyWorldPath, 'seed.edges.json'), 'utf-8');

    expect(nodesAfter).toBe(nodesBefore);
    expect(edgesAfter).toBe(edgesBefore);
  });

  // ── Determinism ───────────────────────────────────────────────────────
  test('8) runner output is deterministic across runs', () => {
    const opts = { from: 'spec:cooking-basics', to: 'evidence:sear-test' };
    const r1 = runWorldSmoke(tinyWorldPath, opts).report;
    const r2 = runWorldSmoke(tinyWorldPath, opts).report;
    expect(r1).toBe(r2);
  });

  // ── Works on another world ────────────────────────────────────────────
  test('9) runner works on authored-mini-world', () => {
    const { report, graph } = runWorldSmoke(authoredWorldPath, {
      from: 'spec:type-theory-overview',
      to: 'evidence:coq-proof',
    });
    expect(graph.nodes).toHaveLength(25);
    expect(report).toContain('**PATH**');
    expect(report).toContain('supportsCompare: **ok**');
  });

  // ── Disclaimer present ────────────────────────────────────────────────
  test('10) report contains exploration disclaimer', () => {
    const { report } = runWorldSmoke(tinyWorldPath);
    expect(report).toContain('*All results remain compute artifacts. No acceptance.*');
  });

  // ── Validation: throws on invalid world ───────────────────────────────
  test('11) throws on non-existent world path', () => {
    expect(() => runWorldSmoke('/nonexistent/path')).toThrow();
  });
});
