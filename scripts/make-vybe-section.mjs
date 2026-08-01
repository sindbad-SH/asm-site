#!/usr/bin/env node
/**
 * make-vybe-section.mjs — bake the photo set for /adventure/vybe (rich story
 * page) and the /adventure VYBE teaser.
 *
 * v2 (2026-07-31, layout-scout directed rebuild — see
 * E:\Adventure Storytelling Media Original\06 - Website\_VYBE-LAYOUT-SPEC.md,
 * Part A). v1 (same day, earlier pass) hardcoded every photo to one 4:5 box
 * at max 1200px — that single ratio is why the page read as "a couple of
 * squares" instead of a magazine spread (Steel & Dust's make-steel-dust.mjs
 * varies crop + width per photo; this script now does the same). Sources are
 * still the operator's own already-culled, already-graded selects at
 * C:/builds/asm/SAMPLES/photos/vybe/ (see _CONTACT-SHEET.md there for full
 * per-frame sourcing) — not raw footage.
 *
 * Twelve photos now (was nine): three more join from the same graded contact
 * sheet, all performers-while-performing or unpeopled grounds shots —
 * `flow-dance-duo` and `nadir-grounds` (new), `band-guitarist` (new — a
 * clear performer face, per the operator's own "faces matter" note applied
 * consistently across the site). `vybe-13/14` (candid backstage/guest
 * portraits) stay OUT, same releases-restraint reasoning as v1.
 *
 * Crop/width per photo is assigned DELIBERATELY for scale contrast — the
 * root-cause fix the layout spec calls for — using sharp's "attention"
 * strategy (saliency-aware crop) rather than a blind center-crop, same as
 * v1. No manual extract boxes: these are already-graded stills, not raw
 * frame grabs, so attention-crop has a clean single subject to find in every
 * case reviewed.
 *
 * Output: public/media/adventure/vybe/<slug>-<width>.{avif,webp}
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "vybe");
const SRC = "C:/builds/asm/SAMPLES/photos/vybe";
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };
const ATTENTION = sharp.strategy.attention;

// ratio = [w, h] proportion the photo bakes to. widths = the export sizes.
const PHOTOS = [
  // ── the cover (newsstand hero) ──
  { slug: "festival-reveal", src: "vybe-01_blue-hour-reveal.jpg", ratio: [4, 5], widths: [800, 1120, 1600] },
  // ── the two newsstand plates (small, rotated thumbnails beside the cover) ──
  { slug: "flow-duo", src: "vybe-04_flow-dance-duo.jpg", ratio: [4, 5], widths: [800, 1120, 1600] },
  { slug: "fire-staff-spin", src: "vybe-09_fire-staff-spin.jpg", ratio: [4, 5], widths: [800, 1120, 1600] },
  // ── chapter 01 — the 2023 festival: opening asymmetric stagger (58/34) ──
  { slug: "festival-grounds", src: "vybe-02_fall-lake-mountains.jpg", ratio: [16, 9], widths: [900, 1600] },
  { slug: "band-golden-flare", src: "vybe-08_band-golden-flare.jpg", ratio: [4, 5], widths: [800, 1120, 1600] },
  // ── the full-bleed band — the natural top-down "graphic" shot ──
  { slug: "nadir-grounds", src: "vybe-03_nadir-grounds.jpg", ratio: [2, 1], widths: [1600, 2000] },
  // ── mirrored stagger (34/58) ──
  { slug: "flow-arts", src: "vybe-05_led-fan-trails.jpg", ratio: [4, 5], widths: [800, 1120] },
  { slug: "dusk-circle", src: "vybe-06_flowarts-circle-dusk.jpg", ratio: [3, 2], widths: [900, 1600] },
  // ── the field-log movement — tilted performer-face frame ──
  { slug: "band-guitarist", src: "vybe-07_band-guitarist.jpg", ratio: [4, 3], widths: [900, 1600] },
  // ── chapter 02 — Boogie Lights 2024: stagger + closing bleed ──
  { slug: "boogie-room", src: "vybe-10_boogie-spotlight-crowd.jpg", ratio: [16, 9], widths: [900, 1600] },
  { slug: "boogie-stage", src: "vybe-12_boogie-stage-glow.jpg", ratio: [4, 5], widths: [800, 1120] },
  { slug: "boogie-chillsbury-doughboys", src: "vybe-11_boogie-chillsbury-doughboys.jpg", ratio: [2, 1], widths: [1200, 1600] },
];

await mkdir(OUT, { recursive: true });
for (const { slug, src, ratio, widths } of PHOTOS) {
  const [rw, rh] = ratio;
  for (const width of widths) {
    const height = Math.round((width * rh) / rw);
    const base = sharp(join(SRC, src))
      .rotate()
      .resize({ width, height, fit: "cover", position: ATTENTION });
    await base.clone().avif(AVIF).toFile(join(OUT, `${slug}-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `${slug}-${width}.webp`));
    console.log(`vybe/${slug}-${width} ok (${rw}:${rh})`);
  }
}
console.log("vybe section assets done →", OUT);
