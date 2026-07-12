#!/usr/bin/env node
/**
 * make-pitchboulder-collage.mjs — export the chapter-01 (PitchBoulder) photo
 * collage for the Venture page, following make-venture-story.mjs conventions:
 * two widths (900w + 1600w) as avif + webp, EXIF auto-oriented (.rotate() is
 * CRITICAL — these are phone photos carrying an orientation flag), written into
 * public/media/work/pitchboulder/.
 *
 * PICKS come from the operator's hand-curated Tier-1 set
 * (E:\Pitch Boulder\Top photos for web build — see _ABOUT.md + _photo-tiers.csv).
 * Chosen for variety + PitchBoulder brand visibility (the operator "loves the
 * logo being visible"):
 *   - presenter-logo: a presenter mid-gesture at the "Follow Us!" slide, the
 *     PITCH BOULDER logo prominent + a lit snowy-window backdrop (the big card).
 *   - room-wide: a wide venue/room-energy frame — flags, tall windows, the
 *     screening in progress (the establishing "energy in the room" shot).
 *   - podium: a clean single-presenter moment at the Boulder Chamber lectern.
 *
 * To re-export: `node scripts/make-pitchboulder-collage.mjs` from the repo root.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const SOURCE_DIR = "E:/Pitch Boulder/Top photos for web build/_TIER 1 - TOP (make stories)";
const OUT_REL = ["public", "media", "work", "pitchboulder"];

// slug → source filename (all Tier 1).
const PICKS = {
  "presenter-logo": "20260506_091404.jpg", // presenter gesturing at the "Follow Us!" PITCH BOULDER slide
  "room-wide": "20260506_091805.jpg", // wide venue: flags, tall windows, screening in progress
  podium: "20260506_091738.jpg", // single presenter at the Boulder Chamber lectern
};

const repoRoot = process.cwd();
const outDir = join(repoRoot, ...OUT_REL);
await mkdir(outDir, { recursive: true });

console.log(`\n▸ pitchboulder collage → ${OUT_REL.join("/")}/`);
let total = 0;
for (const [slug, file] of Object.entries(PICKS)) {
  const srcPath = join(SOURCE_DIR, file);
  if (!existsSync(srcPath)) {
    console.error(`  ✖ missing source: ${file}`);
    process.exitCode = 1;
    continue;
  }
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
  total += bytes;
  console.log(`  ✓ ${slug.padEnd(16)} ${meta.width}×${meta.height}  ${(bytes / 1024).toFixed(0)}KB`);
}
console.log(`  ── total: ${(total / 1024 / 1024).toFixed(2)}MB added\n`);
