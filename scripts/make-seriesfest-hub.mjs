#!/usr/bin/env node
/**
 * make-seriesfest-hub.mjs — bake the /venture/seriesfest hub page assets
 * (Build #2, archive-mining integration, 2026-08-01).
 *
 * COLLISION-MAP GATE: the miner's staged 10-image set for this archive had
 * 4 confirmed pixel-identical collisions with images already live elsewhere
 * on the site, and 1 near-crop of two more — see
 * _STORY-STAGING/_COLLISION-MAP.md §2. Only 5 of the 10 staged picks are
 * perceptually clear:
 *   2025-podium-notecard, fashion-runway-crowd, fashion-runway-floral,
 *   s12-red-carpet-panel, soulpower-red-carpet-press
 * This script bakes ONLY those 5, sourced fresh from the operator's tiered
 * archive (same convention as scripts/make-venture-story.mjs: EXIF
 * auto-orient, 900w+1600w, avif+webp). The dropped picks
 * (fashion-garment-detail, s12-soiree-stage, s12-red-carpet-duo,
 * soulpower-red-carpet-cast, 2025-soiree-podium) are never baked here.
 *
 * Cover swap: the miner's proposed cover (s12-soiree-stage) is pixel-
 * identical to the live venture/seriesfest-2026/hero-1600 — cut. This build
 * uses fashion-runway-crowd instead (also carries a clear "SeriesFest"
 * wordmark, per the plan's own cover-swap note in the CUT list).
 *
 * SURGICAL HONESTY FIX (2026-08-01): the originally baked `soulpower-lobby-
 * mingle` pick had unconfirmed provenance — a UUID filename, zero EXIF, and
 * a non-native square crop, unlike every other file in this archive (see
 * _STORY-STAGING/_INTEGRATION-PLAN.md §1.2 blocking issue (a) and CUT #5).
 * Operator confirmation of that frame was never obtained. Per the plan's
 * own identified fallback, this script now bakes `20260218_174536.jpg` — a
 * real-EXIF, camera-native capture from the same premiere, same archive
 * tier — under the slug `soulpower-red-carpet-press` instead. The old
 * `soulpower-lobby-mingle-*` files were deleted from
 * public/media/venture/seriesfest/ and consts.ts's chapter card 02 now
 * points at the new slug.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const PICKS = {
  "fashion-runway-crowd": "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Fashion in Focus/_TIER 2 - GOOD/20260307_185251.jpg",
  "fashion-runway-floral": "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Fashion in Focus/_TIER 2 - GOOD/20260307_185619.jpg",
  "2025-podium-notecard": "E:/Old Projects/Series Fest/2025 Photos/Series Fest 2025 - Festival/_TIER 1 - TOP (make stories)/20250502_130558.jpg",
  "soulpower-red-carpet-press": "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Soul Power ABA Premiere/_TIER 1 - TOP (make stories)/20260218_174536.jpg",
  "s12-red-carpet-panel": "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Festival/_TIER 1 - TOP (make stories)/20260509_113749.jpg",
};

const repoRoot = process.cwd();
const outDir = join(repoRoot, "public", "media", "venture", "seriesfest");

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
console.log(`\n▸ seriesfest (hub) → public/media/venture/seriesfest/`);
let total = 0;
for (const [slug, file] of Object.entries(PICKS)) {
  if (!existsSync(file)) {
    console.error(`  ✖ missing source: ${file}`);
    process.exitCode = 1;
    continue;
  }
  const { width, height, bytes } = await exportOne(file, slug);
  total += bytes;
  console.log(`  ✓ ${slug.padEnd(24)} ${String(width)}×${height}  ${(bytes / 1024).toFixed(0)}KB`);
}
console.log(`  ── total: ${(total / 1024 / 1024).toFixed(2)}MB\n`);
