#!/usr/bin/env node
/**
 * fix-nordic-daughter-parasols-round3-2026-08-03.mjs — audit-fixes-2026-08-02
 *
 * THIRD pass on /postcards/nordic-daughter's `parasols` gallery photo. Round 1
 * (fix-nordic-daughter-postcard-round2-2026-08-02.mjs) swapped a goth-stall
 * frame that never showed a parasol for DJI_0237 @ 52.0s (attention-cropped) —
 * decorative black-lace parasols, but shot from INSIDE the tent looking at its
 * dim interior. Operator's own review of that result: "the market beyond is
 * bright but the two foreground figures sit in tent shade and read
 * murky/gray." Confirmed on measurement: parasols was the sole brightness
 * outlier of the 8 postcard photos (mean luminance ~106 vs 114-198 for the
 * rest).
 *
 * Went back to the full source pool (see this session's search — 15 source
 * files total for this postcard now confirmed, vs the 3 previously known;
 * full list in the commit message). The parasol STALL itself sits under a
 * closed tent (confirmed genuinely dim on every interior frame across both
 * DJI_0237 and DJI_0238, re-scanned at 3s resolution end to end) — no amount
 * of re-cropping fixes that, the light simply isn't there. But the SAME
 * stall's OUTSIDE face — where the parasols hang off the tent's front edge,
 * in full open sun — is fully lit. DJI_0238 @ 270.0s: 5-6 parasols (green,
 * pink/black, gold/black, purple lace patterns) catching direct sun against
 * the white tent canvas, blue sky and North Table Mountain visible top-left,
 * a shopper at a normally-lit pewter-goblet table behind (not foreground, not
 * murky) — this is the frame the slug and alt text were always describing.
 * Crop: left-weighted 1730x2160 (already 4:5 at full source height, no
 * vertical crop needed) to keep the parasol cluster as the dominant subject
 * without cropping in so tight the "WOW! Please do not remove parasols" sign
 * (a nice authenticity detail) falls out of frame.
 *
 * The other 6 gallery photos were re-verified against the full pool (all 15
 * files, not just the 3 originally reviewed) and left untouched — each
 * already measures bright/sharp/on-concept (formation, motion, closeup,
 * overview, stalls all >=114 mean luminance; festival-strings ~109, not
 * flagged, no clearly-better violinist+keyboardist frame found in the
 * broader pool). `stalls` in particular sits in the SAME bright drone pass
 * as this parasols pick (DJI_0238 @ 298s, ~30s later) and already shows real
 * product (the hat table, pewter goblets) matching its own alt text — not
 * replaced.
 *
 * Crop convention unchanged: 4:5, avif ~55/effort 5, webp ~82, matching
 * make-postcards.mjs / round 2's own bake.
 *
 * Source: E:\Old Projects\scandi fest golden CO 2024\DJI_20240616110607_0238_D.MP4 @ 270.0s
 * Output: public/media/adventure/postcards/nordic-daughter/parasols-<width>.{avif,webp}
 */
import sharp from "sharp";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "postcards", "nordic-daughter");
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };
const SRC =
  "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/d3b8a0a5-b9b2-4cd3-83c4-86a711bb0128/scratchpad/nordic_masters/parasols-master.jpg";

// left-weighted crop of the 3840x2160 source — already 4:5 at full source
// height (1730x2160), keeps the parasol cluster + sign, drops most of the
// crowd/goblet table on the right.
const EXTRACT = { left: 0, top: 0, width: 1730, height: 2160 };

for (const width of [1200, 700]) {
  const height = Math.round((width * 5) / 4);
  const base = sharp(SRC).extract(EXTRACT).resize({ width, height });
  await base.clone().avif(AVIF).toFile(join(OUT, `parasols-${width}.avif`));
  await base.clone().webp(WEBP).toFile(join(OUT, `parasols-${width}.webp`));
  console.log(`nordic-daughter/parasols-${width} ok`);
}

console.log("nordic-daughter parasols round 3 done ->", OUT);
