#!/usr/bin/env node
/**
 * make-work-media.mjs — bake the remaining /work index-wall stills. Repeatable.
 *
 * 1) Pebble Beach TILE face (operator direction): the DJI frame that carries the
 *    Concours / Shelby / "Sixty Years" logo bar across the top. Baked to
 *    public/media/work/shelby-pebble-beach/tile.{avif,webp} — a SEPARATE face
 *    from poster.{avif,webp} (the clean beauty shot the CASE PAGE still uses),
 *    so the index tile shows the logo photo AT REST while the case hero is
 *    unchanged. caseMedia() prefers "tile" over "poster".
 *
 * 2) Archive band stills (older projects, quiet bottom-of-wall band):
 *    • gigs-go-green — a frame from the finished OEN solar-prize film (an aerial
 *      of the solar-carport array). Files date the two engagements to 2024-2025.
 *    • vybe          — a frame from the festival coverage (a purple-lit set).
 *      Files date the coverage to 2023-2024.
 *    Baked to public/media/work/archive/<slug>.{avif,webp}.
 *
 * All sources are READ-ONLY (E:/Old Projects/...). Frame in/out points were
 * chosen by visual review (contact sheets).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = process.cwd();
const AVIF = { quality: 52, effort: 5 };
const WEBP = { quality: 74, effort: 5 };

function ffmpegFrame(src, seconds, outPng) {
  execFileSync(
    "ffmpeg",
    ["-y", "-hide_banner", "-loglevel", "error", "-ss", String(seconds), "-i", src, "-frames:v", "1", outPng],
    { stdio: "inherit" },
  );
}

async function encode(inputBuf, outBase, width) {
  await mkdir(dirname(outBase), { recursive: true });
  const base = sharp(inputBuf).rotate().resize({ width, withoutEnlargement: true });
  await base.clone().avif(AVIF).toFile(`${outBase}.avif`);
  await base.clone().webp(WEBP).toFile(`${outBase}.webp`);
  const kb = (statSync(`${outBase}.avif`).size + statSync(`${outBase}.webp`).size) / 1024;
  return kb;
}

// ── 1) Pebble tile (logo photo) ──
const PEBBLE_SRC = "E:/Old Projects/Pebble Beach 2025/Edited/Photo/DJI_20250817065600_0114_D(1).jpg";
const pebbleOut = join(repoRoot, "public", "media", "work", "shelby-pebble-beach", "tile");
console.log("\n> work media");
const { readFileSync, rmSync } = await import("node:fs");
if (existsSync(PEBBLE_SRC)) {
  const kb = await encode(readFileSync(PEBBLE_SRC), pebbleOut, 1920);
  console.log(`  shelby tile (logo photo)   ${kb.toFixed(0)} KB  -> work/shelby-pebble-beach/tile.{avif,webp}`);
} else {
  console.error(`  x missing: ${PEBBLE_SRC}`);
  process.exitCode = 1;
}

// ── 2) Archive stills (frame-grabs from finished/coverage footage) ──
const ARCHIVE = [
  {
    slug: "gigs-go-green",
    src: "E:/Old Projects/Gigs go green/Hero X Solar/Compotition video/Onchain Energy Network Solar Prize Round 8 video 1.mp4",
    at: 28,
    note: "aerial of the solar-carport array (finished OEN film)",
  },
  {
    slug: "vybe",
    src: "E:/Old Projects/Vybe/Boogie Lights/Vybe Bogie/DJI_20240524193042_0014_D.MP4",
    at: 13,
    note: "purple-lit stage set, live festival coverage",
  },
];
const tmp = join(repoRoot, ".tmp-workframe.png");
const archiveDir = join(repoRoot, "public", "media", "work", "archive");
await mkdir(archiveDir, { recursive: true });
for (const a of ARCHIVE) {
  if (!existsSync(a.src)) {
    console.error(`  x missing: ${a.src}`);
    process.exitCode = 1;
    continue;
  }
  ffmpegFrame(a.src, a.at, tmp);
  const kb = await encode(readFileSync(tmp), join(archiveDir, a.slug), 1600);
  console.log(`  archive/${a.slug.padEnd(14)} ${kb.toFixed(0)} KB  (${a.note})`);
}
try { rmSync(tmp); } catch {}
console.log("done.\n");
