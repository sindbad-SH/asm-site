#!/usr/bin/env node
/**
 * Stage dist/ under its real base path for Lighthouse CI — and emit the
 * matching effective config.
 *
 * The site's base is parameterized (astro.config.mjs): staging builds ship at
 * /asm-site (GitHub Pages project site), the production cutover ships at "/"
 * on adventurestorytellingmedia.com. LHCI's static server serves
 * `staticDistDir` at the server ROOT, so the staged copy AND the audited URL
 * list must both match whichever base this build used — pointing LHCI at the
 * wrong prefix means every asset 404s and Lighthouse measures a broken page
 * (this actually happened twice: first with staging assets before this script
 * existed, then inverted on the 2026-08-15 production cutover, where the
 * hardcoded /asm-site URL list 404'd against a root-based build and blocked
 * the deploy).
 *
 * So this script now derives the prefix from DEPLOY_TARGET (same switch as
 * astro.config.mjs), stages dist/ at that prefix, rewrites lighthouserc.json's
 * url list to match, and writes .lighthouserc.effective.json for
 * `lhci autorun --config`. lighthouserc.json stays the single authored source
 * (staging-form URLs); the effective file is generated and gitignored.
 */
import { rmSync, mkdirSync, cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const STAGE = ".lighthouseci-site";
const isProduction = process.env.DEPLOY_TARGET === "production";
const prefix = isProduction ? "" : "/asm-site";

if (!existsSync("dist")) {
  console.error("✖ lhci-prep: dist/ not found — run `npm run build` first.");
  process.exit(1);
}

rmSync(STAGE, { recursive: true, force: true });
mkdirSync(`${STAGE}${prefix}`, { recursive: true });
cpSync("dist", `${STAGE}${prefix}`, { recursive: true });

const rc = JSON.parse(readFileSync("lighthouserc.json", "utf8"));
rc.ci.collect.url = rc.ci.collect.url.map((u) => {
  const rest = u.replace(/^\/asm-site/, "");
  return `${prefix}${rest === "" ? "/" : rest}`;
});
writeFileSync(".lighthouserc.effective.json", JSON.stringify(rc, null, 2));

console.log(
  `✓ lhci-prep: dist/ staged at ${STAGE}${prefix || "/"} (${isProduction ? "production" : "staging"} base), ` +
    `effective config written with ${rc.ci.collect.url.length} urls`,
);
