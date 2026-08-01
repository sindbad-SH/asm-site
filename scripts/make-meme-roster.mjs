#!/usr/bin/env node
/**
 * make-meme-roster.mjs — bake the 3 clean instructor headshots for the
 * /venture/meme copy refresh (Build #6, archive-mining integration,
 * 2026-08-01). Copy-only build per the plan (§1.6) — this is the sole media
 * addition: no new page, no event photography (none exists yet).
 *
 * Only 3 of the miner's 5 staged photos ship. CUT (per the plan's GATED
 * ITEMS / rights flags, not baked here):
 *   - `nick-goins-afm` — AFM 2017 photo, very likely shot by AFM's own
 *     market photographer, not Nick or MEME. Rights unresolved.
 *   - `amber-macpherson-portrait` — visible "April O'Hare Photography"
 *     watermark in the source file, credit unconfirmed.
 * Source photos are small (native 500x500–854x1280) — capped at native
 * resolution rather than upscaled, per the miner's own disclosed deviation
 * from the standard 900/1600 convention.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SOURCE_ROOT = "E:/Makeshift/MEME/05 - Source Docs from MEME/Photos";
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };

// slug -> { file, widths } — widths capped at (or below) native resolution.
const PICKS = {
  "nick-goins-portrait": { file: "Nick Goins Headshot.jpg", widths: [640] },
  "steve-borne-portrait": { file: "Steve Borne Headshot 1.png", widths: [700, 854] },
  "adam-smestad-portrait": { file: "Adam Headshot.png", widths: [620] },
};

const repoRoot = process.cwd();
const outDir = join(repoRoot, "public", "media", "venture", "meme");

await mkdir(outDir, { recursive: true });
console.log(`\n▸ meme roster → public/media/venture/meme/`);
let total = 0;
for (const [slug, { file, widths }] of Object.entries(PICKS)) {
  const srcPath = join(SOURCE_ROOT, file);
  if (!existsSync(srcPath)) {
    console.error(`  ✖ missing source: ${file}`);
    process.exitCode = 1;
    continue;
  }
  const meta = await sharp(srcPath).rotate().metadata();
  for (const w of widths) {
    const base = sharp(srcPath).rotate().resize({ width: w, withoutEnlargement: true });
    const avifOut = join(outDir, `${slug}-${w}.avif`);
    const webpOut = join(outDir, `${slug}-${w}.webp`);
    await base.clone().avif(AVIF).toFile(avifOut);
    await base.clone().webp(WEBP).toFile(webpOut);
    total += statSync(avifOut).size + statSync(webpOut).size;
  }
  console.log(`  ✓ ${slug.padEnd(24)} native ${meta.width}×${meta.height}, baked @ ${widths.join("/")}w`);
}
console.log(`  ── total: ${(total / 1024 / 1024).toFixed(2)}MB\n`);
