#!/usr/bin/env node
/**
 * CLI wrapper: [confirm] placeholder sweep against built output.
 * Per BUILD-PLAN.md §3.5 the gate is a PRODUCTION gate: staging/greybox may
 * carry [confirm] values (they're the honest alternative to invented facts);
 * a production build (DEPLOY_TARGET=production) fails while any survive.
 * On non-production targets this reports them as warnings and exits 0.
 */
import { statSync } from "node:fs";
import {
  findConfirmPlaceholders,
  isProductionTarget,
  walkTextFiles,
} from "./audit-lib.mjs";

const DIST_DIR = "dist";

try {
  if (!statSync(DIST_DIR).isDirectory()) throw new Error("not a directory");
} catch {
  console.error(`✖ audit-confirm: "${DIST_DIR}" not found — run "npm run build" first.`);
  process.exit(1);
}

const hits = findConfirmPlaceholders(DIST_DIR);

if (hits.length > 0) {
  const strict = isProductionTarget();
  const mark = strict ? "✖" : "⚠";
  console[strict ? "error" : "warn"](
    `${mark} audit-confirm: unresolved [confirm] placeholder(s) in:`,
  );
  for (const file of hits) console[strict ? "error" : "warn"](`  - ${file}`);
  if (strict) {
    console.error("\nProduction builds must not ship [confirm] placeholders.");
    process.exit(1);
  }
  console.warn("\n(Allowed on staging; blocks DEPLOY_TARGET=production builds.)");
  process.exit(0);
}

console.log(
  `✓ audit-confirm: no [confirm] placeholders across ${walkTextFiles(DIST_DIR).length} file(s).`,
);
