#!/usr/bin/env node
/**
 * make-eldorado-springs-supporting.mjs — bake 2 supporting stills for the
 * Eldorado Springs field note (audit-fixes-2026-08-02 design pass).
 *
 * WHY: the note shipped with exactly ONE photo (eldorado-springs-01) while
 * every other field note carries 3-4 — the thinnest photo coverage on the
 * page, despite a full 16-still "kept 16" outing sitting unused on disk from
 * the SAME shoot (2026-07-03, operator-confirmed date). This adds two more
 * from that outing, picked to each support a specific paragraph already in
 * the note's own text rather than repeating the lead's canyon-corridor shot:
 *   - eldorado-springs-02 ← _05.jpg: South Boulder Creek on the canyon floor
 *     ("South Boulder Creek runs the floor, cold and fast off the Front Range").
 *   - eldorado-springs-03 ← _03.jpg: the Eldorado Springs resort + pool
 *     ("Its concrete pool ... reopened in 2024 after a long restoration").
 *
 * ORIENTATION: both source frames are true portrait captures (6048x8064).
 * Forcing a portrait source into the LANDSCAPE 3:2 crop (as eldorado-
 * springs-01 already does, deliberately, for a wide corridor shot) would
 * discard roughly half the vertical frame here — the exact "container
 * fights the source" failure this pass is watching for. Both are baked
 * VERTICAL (4:5) instead, a ~6% crop off the true portrait aspect, so the
 * whole framing survives. This is the site's own fix pattern (container,
 * not the photo), applied at bake time rather than left to a CSS crop.
 *
 * SAME PIPELINE + watermark geometry as scripts/make-adventure-frame.mjs
 * (dual Amazing Aerial + ASM mark, same quality/aspect settings) — copied
 * rather than importing so that script's existing SRC_ROOT (the 2022-2023
 * archive) and PICKS table are untouched; this outing lives in a different
 * root (E:/Amazing Ariel/Colorado/2026/...).
 *
 * RUN: node scripts/make-eldorado-springs-supporting.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC_ROOT =
  "E:/Amazing Ariel/Colorado/2026/7-3-2026/Boulder/_Upload/Boulder Eldorado Springs/photos/best";
const REPO = process.cwd();
const OUT_DIR = join(REPO, "public", "media", "adventure", "gallery");

const AA_LOGO = join(REPO, "src", "assets", "aa-logo-white.png");
const ASM_LOGO = join(REPO, "public", "logo-mark.png");

const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const VERTICAL = { aspect: 4 / 5, widths: [800, 1120, 1600] };

const WM = {
  aaWidthFrac: 0.47,
  aaOpacity: 0.82,
  asmWidthFrac: 0.073,
  asmOpacity: 0.9,
  asmInsetFrac: 0.03,
};

const PICKS = {
  "eldorado-springs-02": { src: "Boulder_Eldorado_Springs_05.jpg" },
  "eldorado-springs-03": { src: "Boulder_Eldorado_Springs_03.jpg" },
};

async function buildMark(logoPath, targetW, opacity, forceWhite) {
  const { data, info } = await sharp(logoPath)
    .resize({ width: Math.round(targetW) })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (forceWhite) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
    data[i + 3] = Math.round(data[i + 3] * opacity);
  }
  return {
    buffer: await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toBuffer(),
    width: info.width,
    height: info.height,
  };
}

async function watermark(baseBuffer, W, H) {
  const aa = await buildMark(AA_LOGO, W * WM.aaWidthFrac, WM.aaOpacity, true);
  const asm = await buildMark(ASM_LOGO, W * WM.asmWidthFrac, WM.asmOpacity, true);
  const insetX = Math.round(W * WM.asmInsetFrac);
  const insetY = Math.round(H * WM.asmInsetFrac);
  return sharp(baseBuffer).composite([
    { input: aa.buffer, left: Math.round(W / 2 - aa.width / 2), top: Math.round(H / 2 - aa.height / 2) },
    { input: asm.buffer, left: W - asm.width - insetX, top: H - asm.height - insetY },
  ]);
}

async function bakeOne(slug, pick) {
  const srcPath = join(SRC_ROOT, pick.src);
  if (!existsSync(srcPath)) {
    console.error(`  ✖ missing source: ${srcPath}`);
    process.exitCode = 1;
    return;
  }
  const { aspect, widths } = VERTICAL;
  const src = await sharp(srcPath).rotate().toBuffer(); // EXIF auto-orient, downscale-only per width below
  let bytes = 0;
  for (const w of widths) {
    const h = Math.round(w / aspect);
    const base = await sharp(src)
      .resize({ width: w, height: h, fit: "cover", position: "attention", withoutEnlargement: true })
      .toBuffer();
    const marked = await watermark(base, w, h);
    const avifOut = join(OUT_DIR, `${slug}-${w}.avif`);
    const webpOut = join(OUT_DIR, `${slug}-${w}.webp`);
    await marked.clone().avif(AVIF).toFile(avifOut);
    await marked.clone().webp(WEBP).toFile(webpOut);
    bytes += statSync(avifOut).size + statSync(webpOut).size;
  }
  console.log(`  ✓ ${slug.padEnd(24)} vertical  ${(bytes / 1024).toFixed(0)}KB`);
}

await mkdir(OUT_DIR, { recursive: true });
console.log(`\n▸ eldorado springs supporting frames → public/media/adventure/gallery/`);
for (const [slug, pick] of Object.entries(PICKS)) {
  await bakeOne(slug, pick);
}
