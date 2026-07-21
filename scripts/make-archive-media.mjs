#!/usr/bin/env node
/**
 * make-archive-media.mjs — bake the media for the work-wall's archive layer
 * (P-work-2, 2026-07-12). Repeatable: re-run any time to refresh.
 *
 * Produces:
 *   public/media/work/gigs-go-green/   — the Gigs Go Green case page
 *     hero.{avif,webp}                 (aerial solar farm, from the OEN film)
 *     still-graphic.{avif,webp}        (the isometric solar co-op graphic)
 *     still-endcard.{avif,webp}        (the OEN "Powering Communities" end card)
 *     clips/hero-x-solar.mp4 (+ -poster.avif/webp)  — solar carport → panels
 *     clips/we-own-cash.mp4  (+ -poster.avif/webp)  — vault/gears → logo/skyline
 *
 *   public/media/work/vybe/            — the Vybe case page
 *     hero.{avif,webp}                 (2023 golden-hour festival aerial)
 *     still-stage.{avif,webp}          (2024 Boogie Lights, stage lights)
 *     still-art.{avif,webp}            (2024 Boogie Lights, live painting)
 *     clips/vybe-fest.mp4 (+ -poster.avif/webp)     — 2023 aerial, arch approach
 *
 *   public/media/work/archive/         — three new archive-band stills (16:9)
 *     nordic-daughter.{avif,webp}      (diptych: Nordic Daughter | Something for Tomorrow)
 *     brazilian-living.{avif,webp}     (samba performance, ASM-watermarked)
 *     pnumix.{avif,webp}               (Paranormal Palace, PNUMIX-branded)
 *
 * The existing gigs-go-green.{avif,webp} + vybe.{avif,webp} archive-tile stills
 * are baked by scripts/make-work-media.mjs — not touched here.
 *
 * All sources are READ-ONLY (E:/Old Projects/...). Clip in/out points and still
 * timestamps were chosen by frame review (contact sheets) so every frame is a
 * clean, representative, brand/stage-forward moment — and, for We Own Cash,
 * deliberately steers to the brand/fintech beats (never the stock B-roll).
 */
import sharp from "sharp";
import { mkdir, rm } from "node:fs/promises";
import { existsSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = process.cwd();
const AVIF = { quality: 52, effort: 5 };
const WEBP = { quality: 74, effort: 5 };
const OLD = "E:/Old Projects";

const tmp = (name) => join(repoRoot, `.tmp-archive-${name}.png`);

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "inherit" });
}

function grabFrame(src, seconds, outPng, extraVf) {
  const vf = extraVf ? ["-vf", extraVf] : [];
  ffmpeg(["-ss", String(seconds), "-i", src, "-frames:v", "1", ...vf, outPng]);
}

async function encodeStill(inputPng, outBase, width) {
  const img = sharp(inputPng).rotate().resize({ width, withoutEnlargement: true });
  await img.clone().avif(AVIF).toFile(`${outBase}.avif`);
  await img.clone().webp(WEBP).toFile(`${outBase}.webp`);
  const kb = (statSync(`${outBase}.avif`).size + statSync(`${outBase}.webp`).size) / 1024;
  return kb;
}

// A still baked straight from a video frame at `seconds`.
async function stillFromVideo({ src, seconds, outBase, width }) {
  if (!existsSync(src)) {
    console.error(`  x missing: ${src}`);
    process.exitCode = 1;
    return;
  }
  const t = tmp("still");
  grabFrame(src, seconds, t);
  const kb = await encodeStill(t, outBase, width);
  await rm(t, { force: true });
  console.log(`  ${outBase.split(/[\\/]/).slice(-2).join("/").padEnd(34)} ${kb.toFixed(0)} KB  (@${seconds}s)`);
}

// A muted web-loop clip + frame-0 poster (gating pattern shared with the
// Amazing Aerial reel): 720p, no audio, yuv420p, faststart, crf 26 → well under
// the 3 MB budget for a 5–8 s cut.
async function clip({ src, start, dur, outMp4, posterBase }) {
  if (!existsSync(src)) {
    console.error(`  x missing: ${src}`);
    process.exitCode = 1;
    return;
  }
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
    outMp4,
  ]);
  const t = tmp("poster");
  grabFrame(src, start, t, "scale=-2:720");
  await encodeStill(t, posterBase, 1280);
  await rm(t, { force: true });
  const mb = statSync(outMp4).size / (1024 * 1024);
  const label = outMp4.split(/[\\/]/).slice(-2).join("/");
  console.log(`  ${label.padEnd(34)} ${mb.toFixed(2)} MB  (${dur}s @720p)${mb > 3 ? "  !! over 3MB" : ""}`);
}

// The Nordic Daughter | Something for Tomorrow diptych — one 16:9 tile that
// shows both bands (they share a member). Left: the folk set (daytime); right:
// the rock set (night). Each source frame scaled to h1080, cropped to a 960-wide
// column, hstacked to 1920×1080.
async function diptych({ leftSrc, leftAt, leftCropX, rightSrc, rightAt, outBase }) {
  if (!existsSync(leftSrc) || !existsSync(rightSrc)) {
    console.error(`  x missing diptych source(s)`);
    process.exitCode = 1;
    return;
  }
  const out = tmp("diptych");
  ffmpeg([
    "-ss", String(leftAt), "-i", leftSrc,
    "-ss", String(rightAt), "-i", rightSrc,
    "-filter_complex",
    `[0:v]scale=-2:1080,crop=960:1080:${leftCropX}:0[l];` +
      `[1:v]scale=-2:1080,crop=960:1080:(iw-960)/2:0[r];[l][r]hstack=inputs=2`,
    "-frames:v", "1",
    out,
  ]);
  const kb = await encodeStill(out, outBase, 1600);
  await rm(out, { force: true });
  console.log(`  ${outBase.split(/[\\/]/).slice(-2).join("/").padEnd(34)} ${kb.toFixed(0)} KB  (diptych)`);
}

// ── source paths ──
const HEROX = `${OLD}/Gigs go green/Hero X Solar/Compotition video/Onchain Energy Network Solar Prize Round 8 video 1.mp4`;
const WOC = `${OLD}/Gigs go green/We own cash/We Own Cash coindesk pitchfest 2025-04-19  Updated.mp4`;
const V62 = `${OLD}/Vybe/Vybe Fest/Vybe event 2023/Drone B Sun/DCIM/100MEDIA/DJI_0062.MP4`;
const V67 = `${OLD}/Vybe/Vybe Fest/Vybe event 2023/Drone B Sun/DCIM/100MEDIA/DJI_0067.MP4`;
const BOOG = `${OLD}/Vybe/Boogie Lights/Vybe Boogielights AVST Media.mp4`;
const NORD = `${OLD}/Nordic Daughter/Scandinavian Festivle/Nordic Daughter Scandi Fest Part 1.mp4`;
const SFT = `${OLD}/Nordic Daughter/Something for tomorrow/Rickhouse 7-7-2024 Ver 2 with logo.mp4`;
const BRAZ = `${OLD}/The Art of Brazilian Living/Final Watermarked/Final Version/Aline Performance 3.mp4`;
const PNUMIX = `${OLD}/PNUMIX/PNUMIX Paranomal Palace (ASMedia) video.mp4`;

// ── output dirs ──
const gggDir = join(repoRoot, "public", "media", "work", "gigs-go-green");
const gggClips = join(gggDir, "clips");
const vybeDir = join(repoRoot, "public", "media", "work", "vybe");
const vybeClips = join(vybeDir, "clips");
const archiveDir = join(repoRoot, "public", "media", "work", "archive");

console.log("\n> archive media");
await mkdir(gggClips, { recursive: true });
await mkdir(vybeClips, { recursive: true });
await mkdir(archiveDir, { recursive: true });

// ── Gigs Go Green case ──
await stillFromVideo({ src: HEROX, seconds: 53, outBase: join(gggDir, "hero"), width: 1600 });
await stillFromVideo({ src: HEROX, seconds: 10, outBase: join(gggDir, "still-graphic"), width: 1600 });
await stillFromVideo({ src: HEROX, seconds: 85, outBase: join(gggDir, "still-endcard"), width: 1600 });
await clip({ src: HEROX, start: 20, dur: 7, outMp4: join(gggClips, "hero-x-solar.mp4"), posterBase: join(gggClips, "hero-x-solar-poster") });
await clip({ src: WOC, start: 51, dur: 5, outMp4: join(gggClips, "we-own-cash.mp4"), posterBase: join(gggClips, "we-own-cash-poster") });

// ── Vybe case ──
await stillFromVideo({ src: V62, seconds: 4, outBase: join(vybeDir, "hero"), width: 1600 });
await stillFromVideo({ src: BOOG, seconds: 16, outBase: join(vybeDir, "still-stage"), width: 1000 });
await stillFromVideo({ src: BOOG, seconds: 33, outBase: join(vybeDir, "still-art"), width: 1000 });
await clip({ src: V67, start: 42, dur: 7, outMp4: join(vybeClips, "vybe-fest.mp4"), posterBase: join(vybeClips, "vybe-fest-poster") });

// ── new archive-band stills ──
await diptych({ leftSrc: NORD, leftAt: 300, leftCropX: 280, rightSrc: SFT, rightAt: 12, outBase: join(archiveDir, "nordic-daughter") });
await stillFromVideo({ src: BRAZ, seconds: 15, outBase: join(archiveDir, "brazilian-living"), width: 1600 });
// PNUMIX still — RE-FRAMED (Round 4, 2026-07-21, operator-directed). The old
// @20s frame centered a costumed performer in revealing attire — too risqué for
// a business site. Re-timed to @32s: the PNUMIX brand-activation table (product
// display, lighting truss, floral backdrop) with only fully-costumed guests in
// frame. Same source video, same tile slot — a timestamp change, not a new
// asset, so nothing else in the archive band churns. Candidate frames at
// 24/28/30/32/36/60/66/90s were reviewed on a contact sheet; 32s was the one
// that is both on-brand (the pnumix product wall reads instantly) and clean.
// If an even more conservative frame is ever wanted, @28s is a pure product-
// display shot with no faces at all — swap the number and re-run this script.
await stillFromVideo({ src: PNUMIX, seconds: 32, outBase: join(archiveDir, "pnumix"), width: 1600 });

console.log("done.\n");
