#!/usr/bin/env node
/**
 * make-pitchboulder-variety.mjs — LAYOUT-OVERHAUL P3 (2026-08-01, see
 * LAYOUT-RESEQUENCE-PLAN.md): retire the repeated "top-down box-opening"
 * fixed-camera frame the operator flagged and give PitchBoulder varied-scale
 * imagery.
 *
 * SOURCES (operator-curated, not raw mining):
 *  - E:\Pitch Boulder\Top photos for web build\_TIER 1 - TOP (make stories)\
 *    — his own hand-picked web set (see its _ABOUT.md: "the primary Pitch
 *    Boulder image source"), May–June 2026 sessions.
 *  - E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\Edited\ — the 5
 *    professionally edited Jan-28 stills (_ABOUT.md points here too).
 *
 * PICKS (eye-reviewed on a 27-frame contact sheet; scenes already featured
 * in the Wednesday Room chapter — Leyden/Jantzen, Perlion/Chang, Follow-Us
 * handoff — were deliberately EXCLUDED to keep the zero-repeated-scenes
 * rule):
 *  - hook-podium  ← 20260506_092416.jpg — presenter at the Boulder Chamber
 *    podium beside the "Every Parent's Worst Fear" slide; the new case hook.
 *  - context-room ← DSC08258.jpg (pro-edited) — eye-level room-wide with
 *    presenters + audience; replaces the elevated fixed-camera context still.
 *  - ask-thumb    ← 20260429_090738.jpg — a founder taking the floor beside
 *    a "Reminders" slide; small thumbnail beside "The Ask".
 *
 * IN-PLACE REPLACEMENT (vybe FIX-1 precedent — same filename, same
 * dependents): hook-poster.avif, the flagged top-down frame, is re-extracted
 * from loop.mp4 itself (frame n=120 — presenter at the screen, audience
 * engaged, brand lockup legible) so /venture's hover-video card fronts an
 * actual frame of the loop it plays. After this script + the page edit, the
 * top-down frame appears NOWHERE on the site.
 */
import sharp from "sharp";
import { execSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const PICKS = {
  "hook-podium": "E:/Pitch Boulder/Top photos for web build/_TIER 1 - TOP (make stories)/20260506_092416.jpg",
  "context-room": "E:/Pitch Boulder/2026 Recordings/1-28-2026/Photos/Edited/_TIER 1 - TOP (make stories)/DSC08258.jpg",
  "ask-thumb": "E:/Pitch Boulder/Top photos for web build/_TIER 1 - TOP (make stories)/20260429_090738.jpg",
};

const repoRoot = process.cwd();
const outDir = join(repoRoot, "public", "media", "work", "pitchboulder");

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
console.log(`\n▸ pitchboulder (variety) → public/media/work/pitchboulder/`);
for (const [slug, file] of Object.entries(PICKS)) {
  if (!existsSync(file)) {
    console.error(`  ✖ missing source: ${file}`);
    process.exitCode = 1;
    continue;
  }
  const { width, height, bytes } = await exportOne(file, slug);
  console.log(`  ✓ ${slug.padEnd(14)} ${String(width)}×${height}  ${(bytes / 1024).toFixed(0)}KB`);
}

// hook-poster.avif in-place replacement from loop.mp4 frame n=120 (native
// 1280×720 — never upscaled).
const loop = join(outDir, "loop.mp4");
if (existsSync(loop)) {
  const tmpPng = join(tmpdir(), "pb-loop-poster-frame.png");
  execSync(`ffmpeg -hide_banner -loglevel error -y -i "${loop}" -vf "select='eq(n\\,120)'" -vsync vfr -frames:v 1 "${tmpPng}"`);
  await sharp(tmpPng).avif(AVIF).toFile(join(outDir, "hook-poster.avif"));
  await rm(tmpPng, { force: true });
  console.log(`  ✓ hook-poster.avif ← loop.mp4 frame n=120 (in-place, 1280×720)`);
} else {
  console.error("  ✖ loop.mp4 missing — hook-poster not replaced");
  process.exitCode = 1;
}
console.log("");
