#!/usr/bin/env node
/**
 * make-shelby-photos.mjs — bake the REAL Shelby / Pebble Beach stills for the
 * case page (P13f). Same pipeline shape as make-venture-story.mjs: EXIF
 * auto-orient, two widths (900w + 1600w) as avif + webp, into
 * public/media/work/shelby-pebble-beach/photos/.
 *
 * WHY: the case page's original stills were frame-grabs cut from the 4K video
 * master (poster.avif / context.avif / the bts/ scrub). The operator's REAL
 * photographs of the restored 1967 Shelby Cobra 427 at the 2025 Pebble Beach
 * Concours live in E:/Old Projects/Pebble Beach 2025 (read-only source). These
 * picks are the strongest of that shoot — the car beauty shots, the crew at
 * work, engine detail, and event context — chosen by visual review.
 *
 * The lead beauty frame (Main Photo CSX 3042.jpg — a clean 16:9 sunrise 3/4 of
 * the blue Cobra, no overlay) ALSO re-bakes poster.avif + poster.webp: it beats
 * the old video-frame poster as the /entertainment wall-tile face.
 *
 * Auto-orient (.rotate()) is kept for the handheld-gimbal frames that carry an
 * EXIF rotation flag; the DJI stills are already upright.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SOURCE_ROOT = "E:/Old Projects/Pebble Beach 2025";
const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

// slug → source file (relative to SOURCE_ROOT). Order = gallery order.
// Every pick is a real photograph of the restored blue Cobra CSX 3042 (or the
// shoot around it); no baked-in logo bars, so the gallery reads as one set.
const PICKS = {
  "beauty-front": "Edited/Photo/Main Photo CSX 3042.jpg", // hero 3/4 front, hood up, sunrise + coastline (also → poster tile)
  "dawn-flare": "osmo/DJI_20250817070251_0137_D.JPG", // low front 3/4, sunrise flare, spectators
  "on-set": "osmo/DJI_20250817065350_0107_D.JPG", // the crew filming the Cobra at dawn
  paddock: "osmo/DJI_20250817055615_0039_D.JPG", // pre-dawn staging paddock among the classics
  crew: "Phone/dji_mimo_20250817_075458_0_1755442537618_photo.jpg", // the three-person crew beside the blue + a silver Cobra
  engine: "Phone/dji_mimo_20250817_084438_0_1755448138674_photo.jpg", // engine bay open, hands at work, spectators watching
  lawn: "osmo/DJI_20250817081827_0239_D.JPG", // elevated wide — Cobra + period-dressed crowd + coastline
  "morning-crowd": "osmo/DJI_20250817075139_0170_D.JPG", // Cobra on the lawn, crowd, dramatic morning sky
  heritage: "osmo/DJI_20250817132904_0453_D.JPG", // the blue Cobra beside the white racing Cobras (#17 / #01)
  signage: "Phone/dji_mimo_20250817_075802_0_1755447908191_photo.jpg", // Pebble Beach Concours d'Elegance letters + clock
};

// The lead frame also becomes the /entertainment wall tile (16:9). Source is
// 3840×2160 (exact 16:9) → a clean down-resize to the tile's 1600×900, no crop.
const POSTER_SRC = "Edited/Photo/Main Photo CSX 3042.jpg";
const POSTER_W = 1600;
const POSTER_H = 900;

const repoRoot = process.cwd();
const outDir = join(repoRoot, "public", "media", "work", "shelby-pebble-beach", "photos");
const tileDir = join(repoRoot, "public", "media", "work", "shelby-pebble-beach");

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
console.log(`\n▸ shelby-pebble-beach → public/media/work/shelby-pebble-beach/photos/`);
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
  console.log(`  ✓ ${slug.padEnd(16)} ${String(width)}×${height}  ${(bytes / 1024).toFixed(0)}KB`);
}

// Re-bake the wall-tile poster from the lead beauty frame (avif + webp so the
// /entertainment pair() helper gets a proper pair, not an avif-only fallback).
const posterSrc = join(SOURCE_ROOT, POSTER_SRC);
if (existsSync(posterSrc)) {
  const tile = sharp(posterSrc)
    .rotate()
    .resize({ width: POSTER_W, height: POSTER_H, fit: "cover", position: "attention" });
  const posterAvif = join(tileDir, "poster.avif");
  const posterWebp = join(tileDir, "poster.webp");
  await tile.clone().avif(AVIF).toFile(posterAvif);
  await tile.clone().webp(WEBP).toFile(posterWebp);
  const tileBytes = statSync(posterAvif).size + statSync(posterWebp).size;
  total += tileBytes;
  console.log(`  ✓ poster (tile)   ${POSTER_W}×${POSTER_H}  ${(tileBytes / 1024).toFixed(0)}KB`);
}

console.log(`  ── total: ${(total / 1024 / 1024).toFixed(2)}MB\n`);
