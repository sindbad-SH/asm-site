#!/usr/bin/env node
/**
 * Fails the build if any Honesty Ledger hard exclusion appears in the built
 * output. Per BUILD-PLAN.md §8 / research-brief.md §4: Largo AI never appears
 * anywhere; Next Door Photo / real-estate work is a HARD EXCLUSION in any
 * form; KO Law and Makeshift Film Group must not appear unless explicitly
 * re-verified and this script updated accordingly.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const DIST_DIR = "dist";
const TEXT_EXTENSIONS = new Set([".html", ".htm", ".txt", ".xml", ".json", ".js", ".css"]);

const FORBIDDEN_TERMS = [
  "largo",
  "next door photo",
  "nextdoorphoto",
  "ko law",
  "makeshift film group",
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath, files);
    } else if (TEXT_EXTENSIONS.has(extname(entry))) {
      files.push(fullPath);
    }
  }
  return files;
}

function main() {
  let distStats;
  try {
    distStats = statSync(DIST_DIR);
  } catch {
    console.error(`✖ audit-exclusions: "${DIST_DIR}" not found — run "npm run build" first.`);
    process.exit(1);
  }
  if (!distStats.isDirectory()) {
    console.error(`✖ audit-exclusions: "${DIST_DIR}" is not a directory.`);
    process.exit(1);
  }

  const files = walk(DIST_DIR);
  const violations = [];

  for (const file of files) {
    const content = readFileSync(file, "utf8").toLowerCase();
    for (const term of FORBIDDEN_TERMS) {
      if (content.includes(term)) {
        violations.push({ file, term });
      }
    }
  }

  if (violations.length > 0) {
    console.error(`✖ audit-exclusions: found ${violations.length} Honesty Ledger violation(s):\n`);
    for (const { file, term } of violations) {
      console.error(`  - "${term}" found in ${file}`);
    }
    process.exit(1);
  }

  console.log(`✓ audit-exclusions: no forbidden terms found across ${files.length} file(s).`);
}

main();
