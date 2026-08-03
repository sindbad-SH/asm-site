#!/usr/bin/env node
/**
 * fix-nordic-daughter-parasols-exposure-2026-08-02.mjs — audit-fixes-2026-08-02
 *
 * Operator (2026-08-02): "A few photos are too dark, unedited — needs to be
 * fixed" on the /postcards/nordic-daughter gallery.
 *
 * Measured mean luminance across all 8 shipped photos in this postcard
 * (sharp .stats(), mean of R/G/B channel means on the 1200w webp):
 *   closeup 112.1 · festival-set 135.9 · festival-strings 108.3 ·
 *   formation 153.7 · motion 137.6 · overview 197.5 · stalls 106.5 ·
 *   parasols 31.0   <- the only outlier, well under a third of the next
 *                      darkest photo. Confirmed by eye too: the vendor-tent
 *                      interior source frame (market-parasols.jpg, from the
 *                      "Chef Eric Mcbride" .wfp vendor-market walkthrough,
 *                      see make-postcards.mjs) was shot in deep tent shade
 *                      with no grade ever applied — genuinely underexposed,
 *                      not a stylistic choice.
 *
 * Fix: a single gentle sharp .linear(a, b) contrast+brightness lift on the
 * ORIGINAL untouched source frame (not a re-grade of the already-exported
 * webp/avif, to avoid compounding compression artifacts). Four options were
 * tried and visually compared before picking:
 *   - gamma(1.8) alone: negligible effect without an accompanying resize
 *     (sharp's gamma pre/post-resize darken-then-brighten pair needs the
 *     resize step to do anything) — meanLuma barely moved, 31.0 -> 33.5.
 *   - modulate({brightness:1.55}).linear(1.08,-8): meanLuma 31.0 -> 50.3,
 *     still visibly muddy/low-contrast on review.
 *   - linear(1.4, 35): meanLuma 31.0 -> 85.3 — CHOSEN. Visibly readable
 *     (dragons/goblets/skulls on the vendor tables become legible, the
 *     "CREATE THE FUTURE" banner text readable), no highlight clipping on
 *     the cardboard boxes at the top of frame, still reads as a shaded tent
 *     interior rather than an artificially "day-lit" fake — a lift, not a
 *     statistical match to the other 7 (much brighter, direct-sun) photos
 *     in this set, per the no-statistical-transfer rule.
 *   - gamma(1.6).modulate(...): similarly negligible (36.2), same
 *     resize-dependency issue as gamma(1.8) alone.
 *
 * Only `parasols` needed this — the other 7 photos in the postcard measured
 * within normal range and are untouched by this script.
 *
 * Source (read-only): market-parasols.jpg, same original frame make-postcards.mjs
 * used — no new extraction, just a corrected re-encode.
 */
import sharp from "sharp";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "postcards", "nordic-daughter");
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };

const SRC =
  "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/41a1cf87-9fbd-4211-b6e3-402504cae585/scratchpad/postcard_hires/market-parasols.jpg";

for (const width of [1200, 700]) {
  const height = Math.round((width * 5) / 4);
  const base = sharp(SRC)
    .linear(1.4, 35) // the gentle exposure/contrast lift — see header note
    .resize({ width, height, fit: "cover", position: sharp.gravity.center });
  await base.clone().avif(AVIF).toFile(join(OUT, `parasols-${width}.avif`));
  await base.clone().webp(WEBP).toFile(join(OUT, `parasols-${width}.webp`));
  console.log(`nordic-daughter/parasols-${width} ok (exposure-lifted)`);
}
