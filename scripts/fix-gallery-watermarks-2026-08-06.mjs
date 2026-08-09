#!/usr/bin/env node
/**
 * fix-gallery-watermarks-2026-08-06.mjs — adventure-rework-2026-08-06, ask A.
 *
 * OPERATOR REPORT (2026-08-05): "not all the little square images have the
 * Amazing Aerial watermark overlay — like the Matterhorn from Zermatt, Madonna
 * di Campiglio don't have it like the other ones do."
 *
 * ROOT CAUSE — NOT a portrait bug. There are FOUR vertical leads in the
 * gallery, and the two 4:5 ones (castel-toblino-01, gornergrat-glacier-01) are
 * correctly marked, as are the 4:5 eldorado-springs-02/03 baked 2026-08-03 —
 * all confirmed by eye on a contact strip. The compositor is also
 * orientation-agnostic: make-adventure-frame.mjs:301-314 centres the AA mark at
 * W/2, H/2 for any W and H, so nothing can push it off a tall canvas.
 *
 * The real discriminator is 9:16. An aspect sweep of all 40 gallery leads gives
 * exactly four files at 0.5626 (800x1422) — madonna-di-campiglio-01/02/03 and
 * matterhorn-zermatt-01 — and those four are precisely the unmarked set. The
 * baker's ORIENT table has only `landscape` (3:2) and `vertical` (4:5) buckets,
 * so the pipeline CANNOT emit 9:16; these were baked off-pipeline on
 * 2026-07-22 (the only two mtimes in the folder from that day) by scripts that
 * were never committed. See A.5 in ADVENTURE-REWORK-SPEC.md for the `reel`
 * bucket added so this cannot recur.
 *
 * matterhorn-zermatt-01 is a REGRESSION, not an omission. git log on its
 * -1120.avif: created marked at 4:5 in 04de1a3, re-marked in 02f1784
 * ("watermark-everything"), then silently overwritten by ee980b3's grade bake,
 * which also changed it to native 9:16 and had no watermark step.
 *
 * WHY COMPOSITE INSTEAD OF RE-BAKE: re-running these through the baker's
 * `vertical` bucket cover-crops 9:16 to 4:5 and discards 29.7% of the frame —
 * against the operator's no-crop rule, and the exact defect the cover rework is
 * removing. The madonna stills were also pulled from drone clips and graded at
 * bake time with a recipe that was never committed, so the frames on disk are
 * the only copy of what he approved. The baker is currently broken anyway: five
 * of its source paths no longer resolve after the AA archive was reorganised
 * under a new _Drone photos/ level. Cost: one lossy generation, taken from the
 * q72 .webp rather than the q50 .avif so it starts from the better file.
 *
 * NOT TOUCHED: shelby-pebble-beach-* is correctly unmarked (a Pebble Beach
 * concours car photo, not AA content, in no field note) — the only other
 * unmarked file in the folder. eldorado-springs-01 and flatirons-chautauqua-03
 * ARE marked; they only read faint to an automated stroke-contrast probe
 * because the mark sits over light rock rather than sky.
 *
 * RUN: node scripts/fix-gallery-watermarks-2026-08-06.mjs
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { join } from "node:path";

const REPO = process.cwd();
const DIR = join(REPO, "public", "media", "adventure", "gallery");
const AA_LOGO = join(REPO, "src", "assets", "aa-logo-white.png");
const ASM_LOGO = join(REPO, "public", "logo-mark.png");

// Same encoders and same watermark geometry as make-adventure-frame.mjs.
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };
const WM = {
  aaWidthFrac: 0.47,
  aaOpacity: 0.82,
  asmWidthFrac: 0.073,
  asmOpacity: 0.9,
  asmInsetFrac: 0.03,
};

// The four 9:16 slugs. Widths are the export ladder these files already ship
// at; heights are derived from each file's NATIVE ratio, never from
// ORIENT.vertical's 4:5 — that would re-introduce the 29.7% crop.
const SLUGS = [
  "madonna-di-campiglio-01",
  "madonna-di-campiglio-02",
  "madonna-di-campiglio-03",
  "matterhorn-zermatt-01",
];
const WIDTHS = [800, 1120, 1600];

/** Build a faded, recoloured-white mark PNG at a target pixel width.
 *  Verbatim from scripts/make-adventure-frame.mjs:277-298. */
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

/** Composite both marks onto a canvas of the given size.
 *  Verbatim from scripts/make-adventure-frame.mjs:300-314. */
async function watermark(baseBuffer, W, H) {
  const aa = await buildMark(AA_LOGO, W * WM.aaWidthFrac, WM.aaOpacity, true);
  const asm = await buildMark(ASM_LOGO, W * WM.asmWidthFrac, WM.asmOpacity, true);
  const insetX = Math.round(W * WM.asmInsetFrac);
  const insetY = Math.round(H * WM.asmInsetFrac);
  return sharp(baseBuffer).composite([
    {
      input: aa.buffer,
      left: Math.round(W / 2 - aa.width / 2),
      top: Math.round(H / 2 - aa.height / 2),
    },
    { input: asm.buffer, left: W - asm.width - insetX, top: H - asm.height - insetY },
  ]);
}

let written = 0;
for (const slug of SLUGS) {
  const source = join(DIR, `${slug}-1600.webp`);
  if (!existsSync(source)) {
    console.error(`MISSING SOURCE: ${source}`);
    process.exitCode = 1;
    continue;
  }
  const meta = await sharp(source).metadata();
  if (!meta.width || !meta.height) {
    console.error(`UNREADABLE: ${source}`);
    process.exitCode = 1;
    continue;
  }
  const ratio = meta.height / meta.width; // native, no crop
  for (const w of WIDTHS) {
    const h = Math.round(w * ratio);
    const base = await sharp(source).resize({ width: w, height: h, fit: "fill" }).toBuffer();
    const marked = await watermark(base, w, h);
    await marked.clone().avif(AVIF).toFile(join(DIR, `${slug}-${w}.avif`));
    await marked.clone().webp(WEBP).toFile(join(DIR, `${slug}-${w}.webp`));
    written += 2;
    console.log(`  ${slug}-${w}  ${w}x${h}  avif+webp`);
  }
}
console.log(`\n${written} files rewritten.`);
