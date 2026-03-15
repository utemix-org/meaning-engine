/**
 * Trace Operator — CLI Runner
 *
 * Runs the three required trace scenarios and writes trace.examples.json.
 *
 * Usage:
 *   node operators/runTrace.js
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { traceFromSeed } from './trace.js';

const __dir = dirname(fileURLToPath(import.meta.url));

const SCENARIOS = [
  {
    name: 'spec → evidence',
    fromId: 'https://www.notion.so/435b2b96d0ec40b2a7262b1151a23380',
    toId: 'evidence:grounding-phase-3a-tests',
  },
  {
    name: 'evidence → code_artifact',
    fromId: 'evidence:grounding-phase-3a-tests',
    toId: 'code_artifact:protocol-ts',
  },
  {
    name: 'concept:context → SYSTEM_OVERVIEW',
    fromId: 'concept:context',
    toId: 'https://www.notion.so/e688cc28b25c40fabf27b2ab2577ab82',
  },
];

const examples = [];

for (const sc of SCENARIOS) {
  const result = traceFromSeed(sc.fromId, sc.toId);
  const example = { scenario: sc.name, from: sc.fromId, to: sc.toId, result };
  examples.push(example);

  console.log(`\n[${sc.name}]`);
  if (result.ok) {
    const pathStr = result.path.map((p) => `${p.nodeTitle}(${p.nodeType})`).join(' → ');
    console.log(`  ✓ PATH found (${result.hops} hops): ${pathStr}`);
  } else if (result.reason === 'no_path') {
    console.log(`  ✗ NO PATH (gap)`);
    console.log(`    from reachable: ${result.gap.boundary.fromReachableCount}`);
    console.log(`    to reachable: ${result.gap.boundary.toReachableCount}`);
    console.log(`    overlap: ${result.gap.boundary.overlap}`);
    for (const c of result.candidates) {
      console.log(`    candidate: ${c.candidateConceptId} — ${c.note}`);
    }
  }
}

const outPath = resolve(__dir, 'trace.examples.json');
writeFileSync(outPath, JSON.stringify(examples, null, 2), 'utf-8');
console.log(`\n✓ trace.examples.json written (${examples.length} scenarios)`);
