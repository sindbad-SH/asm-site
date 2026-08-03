#!/usr/bin/env node
/**
 * fix-nordic-daughter-postcard-round2-2026-08-02.mjs — audit-fixes-2026-08-02
 *
 * SECOND operator pass on /postcards/nordic-daughter ("The Scandinavian
 * Midsummer Festival"). Verdict: the hero (`festival-set`, photos[0] in
 * postcards.ts — untouched by this script) is fine. The 7 photos in the
 * gallery below it are the problem: "some of the photos are too gray and
 * too dark, and some don't highlight things — go through and find better
 * photos to use there."
 *
 * Went back to the FULL source pool for this shoot rather than re-grading
 * the existing picks. Sources (all read-only, all shot 2024-06-16, the
 * festival's closing day):
 *  - Dance troupe (formation/motion/closeup): `E:\Old Projects\scandi fest
 *    golden CO 2024\Valkyrie Dance (Scandinavian Fest Golden 2024).mp4` —
 *    3840x2160, 91s. Full clip re-scanned at 1fps.
 *  - Market row (stalls/parasols/overview): the same folder's two raw DJI
 *    masters, DJI_20240616110209_0237_D.MP4 (234s) and
 *    DJI_20240616110607_0238_D.MP4 (334s) — confirmed via the "Chef Eric
 *    Mcbride (Scandinavian Festival Golden 2024).wfp" Filmora project file
 *    (unzipped, medias_info.json lists both DJI files as its only sources —
 *    "Chef Eric Mcbride" is the vendor walkthrough project name, not a
 *    found raw clip). Both 3840x2160, re-scanned at 1 frame/2s.
 *
 * Only the photos that were actually weak were replaced — motion, closeup,
 * overview, and festival-strings (from the separate Nordic Daughter Scandi
 * Fest masters) already measured bright/sharp/on-concept and are UNTOUCHED.
 *
 *  - `formation` REPLACED. Old: 2 dancers (1 kneeling, 1 standing), the
 *    plywood stage floor filling ~70% of the frame, nothing "formation"
 *    about it. New: Valkyrie Dance @ 79.0s — all 5 dancers mid-stride
 *    together, face paint and full costumes clearly lit, Nordic flags +
 *    drummer + crowd behind. Manual top-anchored crop (source is landscape
 *    4K; a face-detection/attention crop on the full 91s clip repeatedly
 *    cropped 1-2 dancers out of frame, so the crop box below was picked by
 *    hand against this specific frame's dancer positions).
 *
 *  - `parasols` REPLACED. Old: a goth vendor stall (dragons, skulls,
 *    goblets) that never actually showed a parasol despite the slug/alt
 *    text — genuinely underexposed tent-shade too (already given one
 *    exposure-lift pass on 2026-08-02 that didn't fix the subject
 *    mismatch). New: DJI_0237 @ 52.0s — decorative black/purple lace
 *    parasols hung as a market-row canopy, bright open-sky daylight,
 *    Danish flag, festivalgoers browsing underneath — this is what the
 *    slug and alt text were always describing.
 *
 *  - `stalls` REPLACED — see STALLS_SRC/STALLS_SECONDS below for the picked
 *    frame and reasoning (every goth-stall interior in the source pool sits
 *    in deep tent shade; picked the brightest well-composed product+shopper
 *    frame available rather than a flat-out sunny one that doesn't exist in
 *    this footage).
 *
 * Crop convention unchanged from make-postcards.mjs: 4:5, avif ~55/effort 5,
 * webp ~82, matching the site's other postcard bakes.
 */
import sharp from "sharp";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "postcards", "nordic-daughter");
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };
const ATTENTION = sharp.strategy.attention;

const SCRATCH =
  "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/d3b8a0a5-b9b2-4cd3-83c4-86a711bb0128/scratchpad/nd2/final_masters";

const JOBS = [
  {
    // Valkyrie Dance @ 79.0s — all 5 dancers mid-stride, full bodies, bright.
    slug: "formation",
    src: `${SCRATCH}/formation-master.jpg`,
    // manual top-anchored crop, hand-picked against this frame's dancer
    // positions (source 3840x2160) — see header note.
    extract: { left: 979, top: 0, width: 1728, height: 2160 },
    strategy: null,
  },
  {
    // DJI_0237 @ 52.0s — parasol canopy over the bright open-air market row.
    slug: "parasols",
    src: `${SCRATCH}/parasols-master.jpg`,
    extract: null,
    strategy: ATTENTION,
  },
  {
    // DJI_0238 @ 298.0s — a genuinely sunlit stretch of the market row: a
    // hat/leather-goods stall (product clearly lit) plus the pewter-goblet
    // stall from the old pick, both browsed by a dense festival crowd. Every
    // goth-stall INTERIOR in both DJI masters sits in deep tent shade (no
    // exception found after reviewing the full ~9.5 minutes of both clips at
    // 2s resolution plus 1s-resolution passes over the brightest stretches)
    // — this frame, shot from just outside the tent line, is the brightest
    // well-composed product+shopper moment the source pool actually has.
    slug: "stalls",
    src: `${SCRATCH}/stalls-master.jpg`,
    extract: null,
    strategy: ATTENTION,
  },
];

for (const { slug, src, extract, strategy } of JOBS) {
  let pipeline = sharp(src);
  if (extract) pipeline = pipeline.extract(extract);
  for (const width of [1200, 700]) {
    const height = Math.round((width * 5) / 4);
    const opts = strategy ? { width, height, fit: "cover", position: strategy } : { width };
    const base = pipeline.clone().resize(opts);
    await base.clone().avif(AVIF).toFile(join(OUT, `${slug}-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `${slug}-${width}.webp`));
    console.log(`nordic-daughter/${slug}-${width} ok`);
  }
}

console.log("nordic-daughter postcard round 2 done ->", OUT);
