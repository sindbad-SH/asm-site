#!/usr/bin/env node
/**
 * fix-castel-toblino-lead-2026-08-13.mjs — re-pick the Castel Toblino lead.
 *
 * WHY THIS EXISTS. Operator, 2026-08-12: "you missed one of the pages, the one
 * for Castel Toblino still has the amazing [aerial] logo in the center."
 *
 * Every other field-note hero was fixed by writing an UNMARKED copy of the same
 * photograph to covers/. That was impossible here. castel-toblino-01 enters git
 * ALREADY watermarked (02f1784, 2026-07-06) and exists in no earlier commit,
 * and the archive holds no aerial Castel Toblino still — only two ground phone
 * photos. So the shipped frame has no clean original anywhere.
 *
 * It is also not recoverable from the footage. A 1-second sweep across the full
 * 41.8s of DJI_0187 — and across all 12 clips of the 2023-08-26 Madruzzo outing
 * — solves, at every scale, to a crop whose left origin is -110..-400 SOURCE
 * pixels. The leftmost ~26% of the shipped hero (the wooded shore with the
 * crenellated wall) is terrain no frame of that outing contains. Wherever that
 * still came from, it was not this footage.
 *
 * THE FIX IS THEREFORE A RE-PICK, NOT A RESCUE. The alignment profile is clean
 * and unimodal at t=21.75s — the same shot, a little later in the flight, with
 * the castle more centred. This script bakes that frame into BOTH ladders:
 *
 *   gallery/castel-toblino-01-*  WITH the marks — so the thumbnail, the
 *                                filmstrip and the /adventure square all show
 *                                the SAME photograph as the hero. Re-baking the
 *                                thumbnail is the whole point: shipping only a
 *                                clean hero would leave the page disagreeing
 *                                with itself.
 *   covers/castel-toblino-01-*   WITHOUT them — the hero.
 *
 * HONEST LIMITS, recorded so they are not rediscovered as bugs:
 *   · The source is 1080x1920 HD video. A 1600-wide 4:5 export is a ~1.48x
 *     upscale. The file it replaces was ALSO an upscale of the same order, so
 *     this is not a new softness, but it is not a sharp file either.
 *   · Colour comes from the clip as graded in-camera; the shipped still had
 *     been graded further by hand with a recipe that was never committed, so an
 *     exact match is not reproducible.
 *   · castel-toblino-03's PICKS entry in make-adventure-frame.mjs still points
 *     at the pre-reorg path (root-level `2023-08-26 .../Videos/`), which is now
 *     empty — it would fail to re-bake today. The corrected `_Drone video/`
 *     prefix is used below. Not fixed in PICKS here; out of scope.
 *
 * RUN: node scripts/fix-castel-toblino-lead-2026-08-13.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const SRC_ROOT = "E:/Amazing Ariel/Old adventure photos and footage from 2022 to 2023";
const CLIP = join(SRC_ROOT, "_Drone video/2023-08-26 - Italy - Madruzzo/Videos/DJI_0187.MP4");
const TIME = 21.75; // seconds — best alignment to the shipped framing
const EXTRACT = { left: 0, top: 231, width: 1080, height: 1350 }; // 4:5 from 1080x1920

const REPO = process.cwd();
const GALLERY = join(REPO, "public", "media", "adventure", "gallery");
const COVERS = join(REPO, "public", "media", "adventure", "covers");
const AA_LOGO = join(REPO, "src", "assets", "aa-logo-white.png");
const ASM_LOGO = join(REPO, "public", "logo-mark.png");

const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };
const WIDTHS = [800, 1120, 1600];
const ASPECT = 4 / 5;
const WM = { aaWidthFrac: 0.47, aaOpacity: 0.82, asmWidthFrac: 0.073, asmOpacity: 0.9, asmInsetFrac: 0.03 };

async function buildMark(logoPath, targetW, opacity) {
  const { data, info } = await sharp(logoPath)
    .resize({ width: Math.round(targetW) }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
    data[i + 3] = Math.round(data[i + 3] * opacity);
  }
  return {
    buffer: await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer(),
    width: info.width, height: info.height,
  };
}

async function watermark(base, W, H) {
  const aa = await buildMark(AA_LOGO, W * WM.aaWidthFrac, WM.aaOpacity);
  const asm = await buildMark(ASM_LOGO, W * WM.asmWidthFrac, WM.asmOpacity);
  const ix = Math.round(W * WM.asmInsetFrac), iy = Math.round(H * WM.asmInsetFrac);
  return sharp(base).composite([
    { input: aa.buffer, left: Math.round(W / 2 - aa.width / 2), top: Math.round(H / 2 - aa.height / 2) },
    { input: asm.buffer, left: W - asm.width - ix, top: H - asm.height - iy },
  ]);
}

if (!existsSync(CLIP)) {
  console.error(`missing clip: ${CLIP}`);
  process.exit(1);
}
await mkdir(GALLERY, { recursive: true });
await mkdir(COVERS, { recursive: true });

const frame = join(tmpdir(), `castel-toblino-${TIME}.png`);
execFileSync("ffmpeg", ["-y", "-ss", String(TIME), "-i", CLIP, "-frames:v", "1", frame], { stdio: "ignore" });
const src = await sharp(frame).rotate().extract(EXTRACT).toBuffer();

let bytes = 0;
for (const w of WIDTHS) {
  const h = Math.round(w / ASPECT);
  const base = await sharp(src).resize({ width: w, height: h, fit: "cover", position: "centre" }).toBuffer();
  // Flatten the composite to a LOSSLESS PNG buffer before encoding. Calling
  // .clone() twice on a composite pipeline throws "Invalid argument" here, and
  // re-encoding from the flattened buffer costs nothing in quality.
  const markedPng = await (await watermark(base, w, h)).png().toBuffer();
  await sharp(markedPng).avif(AVIF).toFile(join(GALLERY, `castel-toblino-01-${w}.avif`));
  await sharp(markedPng).webp(WEBP).toFile(join(GALLERY, `castel-toblino-01-${w}.webp`));
  await sharp(base).avif(AVIF).toFile(join(COVERS, `castel-toblino-01-${w}.avif`));
  await sharp(base).webp(WEBP).toFile(join(COVERS, `castel-toblino-01-${w}.webp`));
  bytes += statSync(join(GALLERY, `castel-toblino-01-${w}.webp`)).size;
}
console.log(`castel-toblino-01 re-picked @ t=${TIME}s -> gallery (marked) + covers (clean), ${(bytes / 1024).toFixed(0)}KB webp`);
