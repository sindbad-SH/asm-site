#!/usr/bin/env node
/**
 * make-afm-floor.mjs — bake "Movement 2 · The Floor" assets for the
 * /venture/afm-2025 upgrade (Build #3, archive-mining integration,
 * 2026-08-01). Same convention as make-venture-story.mjs (EXIF auto-orient,
 * 900w+1600w, avif+webp) — appends into the SAME public/media/venture/
 * afm-2025/ directory the page already reads from, with new slugs so
 * nothing collides with the existing 10 exports.
 *
 * Only the 6 collision-clear, editorially-kept picks from
 * _STORY-STAGING/afm-2025-market-floor/ ship (_COLLISION-MAP.md + the
 * plan's own CUT list #11 already excluded hero-panel-close,
 * podium-imdbpro, panel-second-session as redundant with the live page).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SOURCE_ROOT = "E:/Old Projects/American Film Market/Photos/American Film Market 2025/_TIER 2 - GOOD";
const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const PICKS = {
  "venue-century-plaza": "20251110_172550.jpg", // bleed
  "stage-before-doors": "20251112_092603.jpg",
  "pavilion-cinecitta": "20251111_074431.jpg",
  "pavilion-row-egypt": "20251111_080315.jpg",
  "floor-wvfilm-booth": "20251111_133204.jpg", // new hero — faces at scale
  "reception-evening": "20251114_172619.jpg", // closing beat
};

const repoRoot = process.cwd();
const outDir = join(repoRoot, "public", "media", "venture", "afm-2025");

async function exportOne(srcPath, slug) {
  const meta = await sharp(srcPath).rotate().metadata();
  let bytes = 0;
  for (const w of WIDTHS) {
    const base = sharp(srcPath).rotate().resize({ width: w, withoutEnlargement: true });
    const avifOut = join(outDir, `${slug}-${w}.avif`);
    const webpOut = join(outDir, `${slug}-${w}.webp`);
    await base.clone().avif(AVIF).toFile(avifOut);
    await base.clone().webp(WEBP).toFile(webpOut);
    bytes += statSync(avifOut).size + statSync(webpOut).size;
  }
  return { width: meta.width, height: meta.height, bytes };
}

await mkdir(outDir, { recursive: true });
console.log(`\n▸ afm-2025 "Movement 2 · The Floor" → public/media/venture/afm-2025/`);
let total = 0;
for (const [slug, file] of Object.entries(PICKS)) {
  const srcPath = join(SOURCE_ROOT, file);
  if (!existsSync(srcPath)) {
    console.error(`  ✖ missing source: ${file}`);
    process.exitCode = 1;
    continue;
  }
  const { width, height, bytes } = await exportOne(srcPath, slug);
  total += bytes;
  console.log(`  ✓ ${slug.padEnd(24)} ${String(width)}×${height}  ${(bytes / 1024).toFixed(0)}KB`);
}
console.log(`  ── total: ${(total / 1024 / 1024).toFixed(2)}MB\n`);
