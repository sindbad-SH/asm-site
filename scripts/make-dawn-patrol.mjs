#!/usr/bin/env node
/**
 * make-dawn-patrol.mjs — bake the /venture/dawn-patrol full story page assets
 * (Build #1, archive-mining integration, 2026-08-01).
 *
 * Sources are the operator's own graded masters from the Pebble Beach 2025
 * shoot (read-only): E:/Old Projects/Pebble Beach 2025/_PEBBLE-CONTENT/
 * 02-GRADED/ — already carrying the pack's own asm-golden-soft (dawn) /
 * asm-midday-bright (day) grade. This script does NOT re-grade; it only
 * resizes (two widths, avif+webp) into public/media/venture/dawn-patrol/,
 * the same simple resize-only convention as make-venture-story.mjs and
 * make-shelby-photos.mjs — CSS aspect-ratio + object-fit does the per-role
 * framing on the page, not a baked crop.
 *
 * COLLISION-MAP SWAP (2026-08-01): the staging pack's pick #7,
 * `cobra-alone-on-the-lawn` (source 05), near-crops the live
 * work/shelby-pebble-beach/photos/on-set-1600 image (same tripod position,
 * same backdrop, same Cobra hood-up moment — different exact instant).
 * _COLLISION-MAP.md flags this as the one soft finding for this archive and
 * recommends a swap. Replaced with `judges-and-owner` (source 18) — a
 * genuinely different capture (higher/wider vantage, a different knot of
 * people around the car, same "before the ribbon" beat) that the miner's own
 * manifest already vetted as a strong frame it seriously considered. Zero
 * repeated/near-repeated images against public/media/** after this swap.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const SOURCE_ROOT = "E:/Old Projects/Pebble Beach 2025/_PEBBLE-CONTENT/02-GRADED";
// The hero video (STORY.md's "video is the first visual after the opening
// text" rule) — 63s, 1920×1080, music-only cleared track. Copied verbatim
// (no re-encode) into the page's media dir; displayed at <=1:1 native per the
// exemplar-bar video checklist (never upscaled past 1920×1080).
const VIDEO_SRC = "E:/Old Projects/Pebble Beach 2025/_PEBBLE-CONTENT/05-VIDEO/03_dawn-patrol_16x9.mp4";
const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

// slug → source file. Order = manifest/layout-sketch order.
const PICKS = {
  "transporter-row-predawn": "01_dawn_transporter-row-predawn_lf.jpg", // cover
  "csx3042-head-on-hood-up": "14_dawn_csx3042-head-on-hood-up_lf.jpg", // plate
  "ferrari-250-lm-no8-head-on": "26_day_ferrari-250-lm-no8-head-on_lf.jpg", // plate
  "paddock-tent-first-light": "04_dawn_paddock-tent-first-light_lf.jpg",
  "cobra-in-the-staging-line": "03_dawn_cobra-in-the-staging-line_lf.jpg",
  "eighteenth-green-sunrise": "07_dawn_eighteenth-green-sunrise_lf.jpg", // full-bleed
  "judges-and-owner": "18_dawn_judges-and-owner_lf.jpg", // SWAP — see header note
  "judging-the-cobra": "17_dawn_judging-the-cobra_lf.jpg", // hero, tilted
  "csx3042-engine-bay": "15_dawn_csx3042-engine-bay_lf.jpg", // detail
  "cobra-three-quarter": "20_dawn_cobra-three-quarter_lf.jpg",
  "full-field-midday": "21_day_full-field-midday_lf.jpg", // wide
  "ferrari-250-lm-no8-three-quarter": "25_day_ferrari-250-lm-no8-three-quarter_lf.jpg",
  "ferrari-250-lm-no7-499fx": "27_day_ferrari-250-lm-no7-499fx_lf.jpg",
  "prewar-line-along-the-coast": "34_day_prewar-line-along-the-coast_lf.jpg", // closing hero
};

const repoRoot = process.cwd();
const outDir = join(repoRoot, "public", "media", "venture", "dawn-patrol");

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
console.log(`\n▸ dawn-patrol → public/media/venture/dawn-patrol/`);
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
  console.log(`  ✓ ${slug.padEnd(32)} ${String(width)}×${height}  ${(bytes / 1024).toFixed(0)}KB`);
}
console.log(`  ── total: ${(total / 1024 / 1024).toFixed(2)}MB\n`);

// hero video — transcoded to a web-reasonable bitrate (source master is
// 70MB, wildly out of line with every other video already in public/media/**
// [1-26MB range]). Resolution stays exactly 1920x1080 (native, never
// upscaled — the exemplar-bar video rule); only bitrate drops, via CRF.
// Audio kept (this is a music-scored cut, not a silent ambient loop) at a
// modest AAC bitrate.
if (existsSync(VIDEO_SRC)) {
  const dest = join(outDir, "dawn-patrol.mp4");
  execFileSync("ffmpeg", [
    "-y", "-i", VIDEO_SRC,
    "-c:v", "libx264", "-preset", "slow", "-crf", "26",
    "-vf", "scale=1920:1080",
    "-c:a", "aac", "-b:a", "128k",
    "-movflags", "+faststart",
    dest,
  ], { stdio: "inherit" });
  console.log(`  ✓ dawn-patrol.mp4 transcoded (${(statSync(dest).size / 1024 / 1024).toFixed(2)}MB, was ${(statSync(VIDEO_SRC).size / 1024 / 1024).toFixed(2)}MB)`);

  // Dedicated poster frame — pulled FROM THE VIDEO itself (not a re-used
  // still), so the page never repeats an image across two roles (exemplar-bar
  // "zero repeated images per page" rule). Frame at t=2s (the transporter-row
  // opening beat, before any text overlay).
  const posterJpg = join(outDir, "_poster-raw.jpg");
  execFileSync("ffmpeg", ["-y", "-ss", "2", "-i", dest, "-frames:v", "1", posterJpg], { stdio: "inherit" });
  const posterPipeline = sharp(posterJpg).resize({ width: 1600 });
  await posterPipeline.clone().avif(AVIF).toFile(join(outDir, "video-poster-1600.avif"));
  await posterPipeline.clone().webp(WEBP).toFile(join(outDir, "video-poster-1600.webp"));
  const { unlink } = await import("node:fs/promises");
  await unlink(posterJpg);
  console.log(`  ✓ video-poster-1600 (extracted from dawn-patrol.mp4 @ t=2s)`);
} else {
  console.error(`  ✖ missing video source: ${VIDEO_SRC}`);
  process.exitCode = 1;
}

