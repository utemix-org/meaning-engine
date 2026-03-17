#!/usr/bin/env node

/**
 * Verifies that all version sources in the repository are consistent.
 *
 * Single-version policy (Variant A):
 *   package.json is the single source of truth.
 *   ENGINE_VERSION must equal package.json version at runtime.
 *   specification.json version must equal package.json version.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf-8"));
const spec = JSON.parse(readFileSync(resolve(root, "specification/specification.json"), "utf-8"));

const errors = [];

if (spec.engine.version !== pkg.version) {
  errors.push(
    `specification.json version "${spec.engine.version}" != package.json version "${pkg.version}"`
  );
}

const engineUrl = pathToFileURL(resolve(root, "src/engine/index.js")).href;
const { ENGINE_VERSION } = await import(engineUrl);
if (ENGINE_VERSION !== pkg.version) {
  errors.push(
    `ENGINE_VERSION "${ENGINE_VERSION}" != package.json version "${pkg.version}"`
  );
}

if (errors.length > 0) {
  console.error("Version consistency check FAILED:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
} else {
  console.log(`Version check OK: ${pkg.version}`);
}
