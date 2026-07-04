#!/usr/bin/env node
/**
 * CLI wrapper: fails (every build, any target) if a Honesty Ledger hard
 * exclusion appears in the built output. See scripts/audit-lib.mjs.
 */
import { statSync } from "node:fs";
import { findExclusionViolations, walkTextFiles } from "./audit-lib.mjs";

const DIST_DIR = "dist";

try {
  if (!statSync(DIST_DIR).isDirectory()) throw new Error("not a directory");
} catch {
  console.error(`✖ audit-exclusions: "${DIST_DIR}" not found — run "npm run build" first.`);
  process.exit(1);
}

const violations = findExclusionViolations(DIST_DIR);

if (violations.length > 0) {
  console.error(`✖ audit-exclusions: ${violations.length} Honesty Ledger violation(s):\n`);
  for (const { file, term } of violations) console.error(`  - "${term}" found in ${file}`);
  process.exit(1);
}

console.log(
  `✓ audit-exclusions: no forbidden terms across ${walkTextFiles(DIST_DIR).length} file(s).`,
);
