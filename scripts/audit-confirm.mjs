#!/usr/bin/env node
/**
 * Fails a production build if any `[confirm]` placeholder survives to the
 * built output. Per BUILD-PLAN.md §3.5: the `[confirm]` placeholder
 * discipline from consts.ts must never ship — every claim must be resolved
 * to a real, Ledger-checked value before launch.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const DIST_DIR = "dist";
const TEXT_EXTENSIONS = new Set([".html", ".htm", ".txt", ".xml", ".json", ".js", ".css"]);
const CONFIRM_PATTERN = /\[confirm\]/i;

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
    console.error(`✖ audit-confirm: "${DIST_DIR}" not found — run "npm run build" first.`);
    process.exit(1);
  }
  if (!distStats.isDirectory()) {
    console.error(`✖ audit-confirm: "${DIST_DIR}" is not a directory.`);
    process.exit(1);
  }

  const files = walk(DIST_DIR);
  const hits = files.filter((file) => CONFIRM_PATTERN.test(readFileSync(file, "utf8")));

  if (hits.length > 0) {
    console.error(`✖ audit-confirm: unresolved [confirm] placeholder(s) in:\n`);
    for (const file of hits) console.error(`  - ${file}`);
    process.exit(1);
  }

  console.log(`✓ audit-confirm: no [confirm] placeholders found across ${files.length} file(s).`);
}

main();
