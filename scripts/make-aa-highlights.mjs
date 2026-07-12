#!/usr/bin/env node
/**
 * make-aa-highlights.mjs — bake the assets for the Amazing Aerial highlights
 * reel page (/work/amazing-aerial). Repeatable: re-run any time to refresh.
 *
 * Produces, into public/media/work/amazing-aerial/:
 *   • tile.avif / tile.webp        — the flagship work-wall tile face
 *                                     (E:/Amazing Ariel/Snapshot_2.JPG — the AA
 *                                     logo is baked into the frame, top-left).
 *   • clips/<slug>.mp4             — short, muted, web-loop cuts (H.264 yuv420p
 *                                     faststart, 720p, no audio, aim <= 3 MB).
 *   • clips/<slug>-poster.avif/webp — frame-0 poster (reduced-motion / no-JS /
 *                                     autoplay-refused fallback).
 *
 * The still highlights on the page REUSE the already-baked, dual-brand
 * (AA + ASM) watermarked gallery exports in public/media/adventure/gallery/ —
 * nothing new to export there.
 *
 * Source footage is READ-ONLY (E:/Amazing Ariel/...). Clip picks + in/out points
 * were chosen by visual review: iconic peak / turquoise alpine lake / Colorado
 * San Juans — a Switzerland + Switzerland + Colorado spread of "my top shots."
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const AA_ROOT = "E:/Amazing Ariel";
const FOOTAGE = join(AA_ROOT, "Drone Footage", "Sindbad Horizon Drone Footage");
const repoRoot = process.cwd();
const outDir = join(repoRoot, "public", "media", "work", "amazing-aerial");
const clipsDir = join(outDir, "clips");

const AVIF = { quality: 52, effort: 5 };
const WEBP = { quality: 74, effort: 5 };

// ── flagship tile: the AA main shot (logo baked in), 16:9, full res ──
const FLAGSHIP_SRC = join(AA_ROOT, "Snapshot_2.JPG");

// ── 3 loop clips. start/dur in seconds, chosen by frame review. ──
const CLIPS = [
  {
    slug: "matterhorn",
    src: join(FOOTAGE, "Switzerland", "Canton of Valais", "Zermatt Matterhorn 1.mp4"),
    start: 27,
    dur: 7,
    note: "the iconic Matterhorn pyramid, clouds off the summit",
  },
  {
    slug: "lac-de-tseuzier",
    src: join(FOOTAGE, "Switzerland", "Canton of Valais", "Crans-Montana Lac de Tseuzier 10.mp4"),
    start: 176,
    dur: 7,
    note: "turquoise alpine reservoir, dam + cliffs, golden ridge light",
  },
  {
    slug: "ironton",
    src: join(FOOTAGE, "United States", "Colorado", "Ironton Waterfall 1.MP4"),
    start: 56,
    dur: 7,
    note: "snow-capped San Juans over a green pine valley, Colorado",
  },
];

async function exportFlagship() {
  if (!existsSync(FLAGSHIP_SRC)) {
    console.error(`  x missing flagship source: ${FLAGSHIP_SRC}`);
    process.exitCode = 1;
    return;
  }
  const base = sharp(FLAGSHIP_SRC).rotate(); // EXIF auto-orient
  const avifOut = join(outDir, "tile.avif");
  const webpOut = join(outDir, "tile.webp");
  await base.clone().avif(AVIF).toFile(avifOut);
  await base.clone().webp(WEBP).toFile(webpOut);
  const kb = (statSync(avifOut).size + statSync(webpOut).size) / 1024;
  console.log(`  tile  avif+webp  ${kb.toFixed(0)} KB`);
}

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "inherit" });
}

async function exportClip({ slug, src, start, dur }) {
  if (!existsSync(src)) {
    console.error(`  x missing clip source: ${src}`);
    process.exitCode = 1;
    return;
  }
  const mp4 = join(clipsDir, `${slug}.mp4`);
  // -ss before -i = fast seek. 720p, muted, yuv420p, faststart. crf tuned so a
  // 7s drone cut lands well under the 3 MB budget.
  ffmpeg([
    "-ss", String(start),
    "-i", src,
    "-t", String(dur),
    "-an",
    "-vf", "scale=-2:720",
    "-c:v", "libx264",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-crf", "26",
    "-preset", "slow",
    "-movflags", "+faststart",
    mp4,
  ]);
  // poster = frame 0 of the CUT (so poster === first painted frame)
  const posterPng = join(clipsDir, `${slug}-poster.png`);
  ffmpeg(["-ss", String(start), "-i", src, "-frames:v", "1", "-vf", "scale=-2:720", posterPng]);
  const pbase = sharp(posterPng);
  await pbase.clone().avif(AVIF).toFile(join(clipsDir, `${slug}-poster.avif`));
  await pbase.clone().webp(WEBP).toFile(join(clipsDir, `${slug}-poster.webp`));
  const mb = statSync(mp4).size / (1024 * 1024);
  console.log(`  ${slug.padEnd(16)} ${mb.toFixed(2)} MB  (${dur}s @720p)${mb > 3 ? "  !! over 3MB" : ""}`);
}

await mkdir(clipsDir, { recursive: true });
console.log("\n> Amazing Aerial highlights -> public/media/work/amazing-aerial/");
await exportFlagship();
for (const clip of CLIPS) await exportClip(clip);
console.log("done.\n");
