#!/usr/bin/env node
/**
 * fix-vybe-audit-2026-08-02.mjs — audit-fixes-2026-08-02
 *
 * Fixes the 3 operator-flagged /adventure/vybe photos (2026-08-02 verdicts):
 *
 *  1. festival-crowd-sing — "super zoomed into some heads." The mined C0057
 *     burst around 172.5s used for the current bake is ENTIRELY tight
 *     face-zoom frames (confirmed via c0057_zoom_contact.jpg — 58 near-
 *     identical zoomed frames, no wide option in that burst). A wide,
 *     unzoomed frame exists a couple seconds later in the same clip at
 *     173.0s: singer + mic centered, two more dancers clearly visible
 *     flanking him (red shirt, maroon hoodie), fall-gold cottonwood canopy,
 *     festival ribbon. Same source clip, same event, same moment window —
 *     just not zoomed. Re-baked with the same light sharp()-only grading
 *     pass v5 used (not a full LightForge regrade).
 *
 *  2. dusk-circle — "too much into the trees." The original already-graded
 *     source (vybe-06_flowarts-circle-dusk.jpg) has the group small and
 *     low in the frame with trees dominating the top 2/3 — confirmed by
 *     test-cropping the existing source directly (any crop tight enough to
 *     fix the "into the trees" problem lands purely on treetop, because the
 *     group sits close to the bottom edge of that specific frame no matter
 *     how it's cropped). Swapped to a wider, closer, better-lit frame from
 *     the SAME raw clip (C0057.MP4, ground cam) at 58.0s: 5-6 festivalgoers
 *     dancing/gathering near the balloon arch, trees present but
 *     proportionate, not overwhelming.
 *
 *  3. boogie-chillsbury-doughboys — "not framed well from the balcony." The
 *     underlying source photo is fine (full band + readable act signage +
 *     crowd, all in frame) — the problem is the 2:1 landscape bake ratio
 *     applied via sharp's blind "attention" auto-crop to a 1728x3072
 *     PORTRAIT source: cover-fit into a 2:1 box from a 0.5625-aspect source
 *     keeps only ~28% of the vertical extent, which is why the band got
 *     reduced to a sliver at the bottom and the crop read as mostly empty
 *     backdrop/lighting. Fixed with a MANUAL extract box (not attention-
 *     crop) on the same source frame, y=560..1424 (full width), which keeps
 *     the full band, the readable "Chillsbury Doughboys / Colorado"
 *     signage, AND the first row of crowd — verified by test-crop before
 *     baking. No new frame needed; same already-graded source.
 *
 * Sources:
 *  - festival-crowd-sing: E:\Old Projects\Vybe\Vybe Fest\Vybe event 2023\Cam B Sun\CLIP\C0057.MP4 @ 173.0s
 *  - dusk-circle: same clip, C0057.MP4 @ 58.0s
 *  - boogie-chillsbury-doughboys: C:\builds\asm\SAMPLES\photos\vybe\vybe-11_boogie-chillsbury-doughboys.jpg (manual recrop, no new extraction)
 *
 * Output: public/media/adventure/vybe/<slug>-<width>.{avif,webp}
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "vybe");
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };
const ATTENTION = sharp.strategy.attention;

function lightTouch(pipeline) {
  return pipeline
    .modulate({ saturation: 1.1, brightness: 1.03 })
    .linear(1.04, -6)
    .sharpen({ sigma: 0.8 });
}

await mkdir(OUT, { recursive: true });

// ── 1. festival-crowd-sing — wide replacement frame, attention-crop (raw, needs grading) ──
{
  const src = "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/d3b8a0a5-b9b2-4cd3-83c4-86a711bb0128/scratchpad/crowdsing/hi_173.jpg";
  const [rw, rh] = [4, 5];
  for (const width of [1120, 1600]) {
    const height = Math.round((width * rh) / rw);
    const base = lightTouch(
      sharp(src).rotate().resize({ width, height, fit: "cover", position: ATTENTION }),
    );
    await base.clone().avif(AVIF).toFile(join(OUT, `festival-crowd-sing-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `festival-crowd-sing-${width}.webp`));
    console.log(`festival-crowd-sing-${width} ok`);
  }
}

// ── 2. dusk-circle — wide replacement frame, attention-crop (raw, needs grading) ──
{
  const src = "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/d3b8a0a5-b9b2-4cd3-83c4-86a711bb0128/scratchpad/duskcircle/f_58.jpg";
  const [rw, rh] = [3, 2];
  for (const width of [900, 1600]) {
    const height = Math.round((width * rh) / rw);
    const base = lightTouch(
      sharp(src).rotate().resize({ width, height, fit: "cover", position: ATTENTION }),
    );
    await base.clone().avif(AVIF).toFile(join(OUT, `dusk-circle-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `dusk-circle-${width}.webp`));
    console.log(`dusk-circle-${width} ok`);
  }
}

// ── 3. boogie-chillsbury-doughboys — manual recrop of the existing graded source ──
{
  const src = "C:/builds/asm/SAMPLES/photos/vybe/vybe-11_boogie-chillsbury-doughboys.jpg";
  // full width (1728), height 864 (exact 2:1), y-offset 560 — keeps band +
  // signage + first crowd row (verified via ffmpeg test-crop before baking).
  const EXTRACT = { left: 0, top: 560, width: 1728, height: 864 };
  for (const width of [1200, 1600]) {
    const height = Math.round(width / 2);
    const base = sharp(src).rotate().extract(EXTRACT).resize({ width, height, fit: "cover" });
    await base.clone().avif(AVIF).toFile(join(OUT, `boogie-chillsbury-doughboys-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `boogie-chillsbury-doughboys-${width}.webp`));
    console.log(`boogie-chillsbury-doughboys-${width} ok`);
  }
}

console.log("vybe audit fixes done ->", OUT);
