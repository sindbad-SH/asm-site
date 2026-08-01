#!/usr/bin/env node
/**
 * make-pitchboulder-wednesday-room.mjs — bake "The Wednesday Room" chapter
 * assets for the /work/pitchboulder upgrade (Build #4, archive-mining
 * integration, 2026-08-01).
 *
 * COLLISION-MAP BLOCK: the plan's original 5-image pick (leyden-space-hero,
 * full-room-bleed, founder-duo-fullroom, followus-handoff, perlion-title)
 * loses TWO images to _COLLISION-MAP.md: `founder-duo-fullroom` is a
 * near/adjacent frame of the live work/pitchboulder/coworking-presenter-1600
 * (same fixed wide room camera, same session) and `full-room-bleed` is a
 * near-crop of the live work/pitchboulder/coworking-crowd-1600 — both from
 * the archive's one DSLR-shot week, which is exactly the material the site
 * already used for its case-study gallery. No fresh bleed-scale or
 * founder-duo-scale candidate exists in the staged 8-image set (the other
 * 3 were cut by the miner for unrelated editorial reasons — near-duplicate
 * slides / a video frame grab that can't hold scale).
 *
 * DECISION (ship with 4 images, per _INTEGRATION-PLAN.md's "else ship with
 * 4 images" fallback): drop the full-bleed device entirely rather than
 * force a weak substitute. `leyden-space-title` — cut by the miner only for
 * being a near-duplicate of `attendance-ritual` (which is NOT used here) —
 * is reinstated as the fourth image, restoring the "Coming back" duo
 * (`leyden-space-title` + `perlion-title`) that STORY.md's own layout
 * sketch called for. `pixelpay-detail` stays cut (video-frame quality +
 * the unconfirmed whiteboard-email honesty flag).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SOURCE_ROOT = "E:/Pitch Boulder/Top photos for web build/_TIER 1 - TOP (make stories)";
const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const PICKS = {
  "leyden-space-hero": "20260506_091738.jpg", // chapter hero — faces at scale
  "leyden-space-title": "20260506_091643.jpg", // duo w/ perlion-title
  "perlion-title": "20260429_091457.jpg",
  "followus-handoff": "20260617_090711.jpg",
};

const repoRoot = process.cwd();
const outDir = join(repoRoot, "public", "media", "work", "pitchboulder", "wednesday-room");

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
console.log(`\n▸ pitchboulder "The Wednesday Room" → public/media/work/pitchboulder/wednesday-room/`);
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
