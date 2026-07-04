/**
 * Astro integration: runs the Honesty Ledger audits inside `astro build`
 * (astro:build:done), so a violating build FAILS at the source — it cannot
 * produce a shippable dist/ regardless of how it's deployed. The npm scripts
 * remain as standalone re-checks for CI logs.
 *
 *  - Hard exclusions: fail EVERY build (staging and production).
 *  - [confirm] placeholders: warn on staging, fail DEPLOY_TARGET=production.
 */
import { fileURLToPath } from "node:url";
import {
  findExclusionViolations,
  findConfirmPlaceholders,
  isProductionTarget,
} from "../scripts/audit-lib.mjs";

export default function honestyAudit() {
  return {
    name: "honesty-audit",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const distDir = fileURLToPath(dir);

        const violations = findExclusionViolations(distDir);
        if (violations.length > 0) {
          for (const { file, term } of violations) {
            logger.error(`Honesty Ledger exclusion "${term}" found in ${file}`);
          }
          throw new Error(
            `honesty-audit: ${violations.length} hard-exclusion violation(s) in built output. ` +
              `See research-brief.md §4/§0 — this content must never ship.`,
          );
        }
        logger.info("exclusion audit passed");

        const confirms = findConfirmPlaceholders(distDir);
        if (confirms.length > 0) {
          if (isProductionTarget()) {
            for (const file of confirms) logger.error(`[confirm] placeholder in ${file}`);
            throw new Error(
              `honesty-audit: ${confirms.length} unresolved [confirm] placeholder(s) — ` +
                `production builds must not ship placeholders (BUILD-PLAN.md §3.5).`,
            );
          }
          for (const file of confirms) logger.warn(`[confirm] placeholder in ${file}`);
          logger.warn("(allowed on staging; blocks DEPLOY_TARGET=production)");
        } else {
          logger.info("[confirm] sweep passed");
        }
      },
    },
  };
}
