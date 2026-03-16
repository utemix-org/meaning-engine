/**
 * Tests for import parsing regex used by extractCodeArtifacts.js.
 * Validates both single-line and multi-line ESM import detection.
 */

import { describe, test, expect } from 'vitest';

const importRegex = /(?:import|export)\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g;

function parseImportsFromString(content) {
  const imports = [];
  let match;
  const re = new RegExp(importRegex.source, importRegex.flags);
  while ((match = re.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

describe('Import Parsing — extractCodeArtifacts regex', () => {
  test('parses single-line import', () => {
    const code = `import { foo } from './bar.js';`;
    expect(parseImportsFromString(code)).toEqual(['./bar.js']);
  });

  test('parses single-line import with double quotes', () => {
    const code = `import { foo } from "./bar.js";`;
    expect(parseImportsFromString(code)).toEqual(['./bar.js']);
  });

  test('parses multi-line import (curly braces on separate lines)', () => {
    const code = `import {
  WorldInterface,
  SchemaValidator,
  GraphValidator,
} from "../WorldInterface.js";`;
    expect(parseImportsFromString(code)).toEqual(['../WorldInterface.js']);
  });

  test('parses multi-line import with single quotes', () => {
    const code = `import {
  A,
  B,
} from '../module.js';`;
    expect(parseImportsFromString(code)).toEqual(['../module.js']);
  });

  test('parses default import', () => {
    const code = `import MyModule from './myModule.js';`;
    expect(parseImportsFromString(code)).toEqual(['./myModule.js']);
  });

  test('parses named + default import', () => {
    const code = `import Default, { named } from './combo.js';`;
    expect(parseImportsFromString(code)).toEqual(['./combo.js']);
  });

  test('ignores bare module specifiers (node_modules)', () => {
    const code = `import { describe } from 'vitest';
import { readFileSync } from 'fs';
import { foo } from './local.js';`;
    const locals = parseImportsFromString(code).filter(
      (s) => s.startsWith('.') || s.startsWith('/'),
    );
    expect(locals).toEqual(['./local.js']);
  });

  test('handles multiple imports including multi-line', () => {
    const code = `import { describe, it } from "vitest";
import {
  WorldInterface,
  SchemaValidator,
} from "../WorldInterface.js";
import { Schema } from "../Schema.js";`;
    expect(parseImportsFromString(code)).toEqual([
      'vitest',
      '../WorldInterface.js',
      '../Schema.js',
    ]);
  });

  test('parses export ... from (re-export)', () => {
    const code = `export { foo, bar } from './utils.js';`;
    expect(parseImportsFromString(code)).toEqual(['./utils.js']);
  });

  test('does not match require() calls', () => {
    const code = `const x = require('./old.js');`;
    expect(parseImportsFromString(code)).toEqual([]);
  });
});
