#!/usr/bin/env node
/**
 * Stage dist/ under its real base path for Lighthouse CI.
 *
 * The site builds with `base: /asm-site` (GitHub Pages project site), so every
 * asset URL in the HTML starts with /asm-site/. LHCI's static server serves
 * `staticDistDir` at the server ROOT — pointing it at dist/ directly means
 * every stylesheet/script/image 404s and Lighthouse measures a broken page
 * (this actually happened; scores were meaningless). Copying dist/ to
 * .lighthouseci-site/asm-site/ lets LHCI serve the artifact at the same path
 * prefix it will have in production, so the numbers are real.
 */
import { rmSync, mkdirSync, cpSync, existsSync } from "node:fs";

const STAGE = ".lighthouseci-site";

if (!existsSync("dist")) {
  console.error("✖ lhci-prep: dist/ not found — run `npm run build` first.");
  process.exit(1);
}

rmSync(STAGE, { recursive: true, force: true });
mkdirSync(`${STAGE}/asm-site`, { recursive: true });
cpSync("dist", `${STAGE}/asm-site`, { recursive: true });
console.log(`✓ lhci-prep: dist/ staged at ${STAGE}/asm-site/`);
