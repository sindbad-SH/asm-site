/**
 * Shared Honesty Ledger audit logic (BUILD-PLAN.md §8, research-brief.md §4/§0).
 * Used by both the CLI wrappers (scripts/audit-*.mjs) and the Astro
 * integration (integrations/honesty-audit.mjs) so `astro build` itself
 * enforces the rules — no build can ship a violation.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const TEXT_EXTENSIONS = new Set([".html", ".htm", ".txt", ".xml", ".json", ".js", ".css"]);

/**
 * Hard-excluded terms, lowercase substring match against built output.
 * Sources: research-brief §0 (the AI-ambassador relationship is off the site),
 * §4 HARD EXCLUSION (the real-estate business), §4 UNVERIFIED (the law firm),
 * §4 POSSIBLE FUTURE (the film group). "makeshift film group" is the full
 * phrase deliberately — MEME's legal name legitimately contains "Makeshift".
 */
export const FORBIDDEN_TERMS = [
  "largo",
  "next door photo",
  "nextdoorphoto",
  "real estate",
  "real-estate",
  "ko law",
  "makeshift film group",
];

export const CONFIRM_PATTERN = /\[confirm\]/i;

// Match each forbidden term on word boundaries, case-insensitively. Bare
// substring matching (the previous approach) could false-fail a build on a
// minified vendor bundle that merely *contains* "largo" etc. inside a longer
// identifier or hash — a misleading Ledger error on code we didn't author.
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TERM_PATTERNS = FORBIDDEN_TERMS.map((term) => ({
  term,
  re: new RegExp(`\\b${escapeRegex(term)}\\b`, "i"),
}));

export function walkTextFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walkTextFiles(fullPath, files);
    } else if (TEXT_EXTENSIONS.has(extname(entry))) {
      files.push(fullPath);
    }
  }
  return files;
}

/** @returns {{file: string, term: string}[]} violations */
export function findExclusionViolations(distDir) {
  const violations = [];
  for (const file of walkTextFiles(distDir)) {
    const content = readFileSync(file, "utf8");
    for (const { term, re } of TERM_PATTERNS) {
      if (re.test(content)) violations.push({ file, term });
    }
  }
  return violations;
}

/** @returns {string[]} files containing an unresolved [confirm] placeholder */
export function findConfirmPlaceholders(distDir) {
  return walkTextFiles(distDir).filter((file) =>
    CONFIRM_PATTERN.test(readFileSync(file, "utf8")),
  );
}

export function isProductionTarget() {
  return process.env.DEPLOY_TARGET === "production";
}
