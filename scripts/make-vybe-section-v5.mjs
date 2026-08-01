#!/usr/bin/env node
/**
 * make-vybe-section-v5.mjs — critic-fix round 2 for /adventure/vybe.
 *
 * Mines 3 NEW stills from the raw 2023 festival archive (Cam B Sun ground
 * camera, 1920x1080 native — reported portrait 1080x1920 after ffmpeg
 * honors the clip's rotation tag) per the critic's prescribed fix, and
 * re-crops 2 EXISTING already-graded stills (band-golden-flare,
 * festival-grounds) into new aspect ratios so they can swap slots.
 *
 * Selection method: dense ffmpeg frame extraction around candidate windows
 * (found via a face/sharpness scan across all 78 Cam B Sun clips + the
 * operator's own compose_video edit as a taste reference), scored with
 * OpenCV Laplacian-variance sharpness + Haar face detection, then every
 * top candidate was visually reviewed before picking. Full sourcing notes
 * in the vybe.astro header comment.
 *
 * NEW frames (all Cam B Sun, ground camera, native 1080x1920 portrait):
 *  - festival-crowd-sing  — C0057.MP4 @ 172.5s — the strongest new frame,
 *    takes the full-bleed. Foreground festivalgoer singing into a mic,
 *    mid-dance; THREE more people dancing behind him under gold fall
 *    canopy, rainbow balloon arch at right edge (pays off the page's own
 *    "a rainbow balloon arch over the gate" line). Laplacian sharpness
 *    782 (local peak of the burst, frames scored 168-180s @ 8fps).
 *  - festival-emcee — C0117.MP4 @ 10.4s — sharp, sun-lit, face-forward
 *    single performer (festival host/emcee on the mic, red trailer +
 *    Front Range foothills behind). Backfills the mirrored-stagger's
 *    narrow slot that fireStaffSpin used to double up in.
 *  - festival-arms-up — C0058.MP4 @ 0.6s — three festivalgoers, arms
 *    raised together in front of the (their own, hand-lettered) "Soul
 *    Stage" sign at blue hour. Backfills the closing-beat slot that
 *    flowDuo used to double up in.
 *
 * RE-CROPPED (existing graded SAMPLES stills, new aspect only — no new
 * extraction, no new grade):
 *  - band-golden-flare: was portrait-only (4:5); now ALSO baked landscape
 *    (4:3) so it can take the wide (58fr) column when it swaps with
 *    festival-grounds in the opening stagger. Old vertical bake files
 *    (800/1120) are orphaned by this — the astro page no longer requests
 *    them (band-golden-flare is now landscape-only).
 *  - festival-grounds: was landscape-only (16:9→4:3 display); now ALSO
 *    baked portrait (4:5) for the narrow (34fr) column it swaps into.
 *    Old landscape-only bake (900) is orphaned the same way.
 *
 * Neither re-crop needed a fresh frame grab — both sources are already the
 * upscaled/graded 2531x4500 stills from SAMPLES/photos/vybe, plenty of
 * resolution for a second crop in the other orientation.
 *
 * Grading note (honesty): the 3 new frames get a light sharp()-only pass
 * (mild sharpen + a small saturation/contrast lift) to sit comfortably
 * next to the LightForge-graded originals — NOT a full LightForge regrade
 * (that tool wasn't run this pass). If a future pass wants to match grade
 * more precisely, these 3 are flagged for it.
 *
 * Output: public/media/adventure/vybe/<slug>-<width>.{avif,webp}
 */
import sharp from "sharp";
import { mkdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "vybe");
const EXISTING_SRC = "C:/builds/asm/SAMPLES/photos/vybe";
const SCRATCH =
  "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/12ab3daa-9a3b-4913-9a1f-c893c722eafd/scratchpad/vybe_mine";

const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };
const ATTENTION = sharp.strategy.attention;

// a light, honestly-disclosed finishing pass for the 3 raw new frames —
// NOT a LightForge regrade, just enough to sit next to the graded photos.
function lightTouch(pipeline) {
  return pipeline
    .modulate({ saturation: 1.1, brightness: 1.03 })
    .linear(1.04, -6) // gentle contrast lift
    .sharpen({ sigma: 0.8 });
}

const NEW_PHOTOS = [
  {
    slug: "festival-crowd-sing",
    src: join(SCRATCH, "c0057_hires", "f_037.jpg"),
    ratio: [4, 5],
    widths: [1120, 1600],
    grade: true,
  },
  {
    slug: "festival-emcee",
    src: join(SCRATCH, "c0117_hires2", "f_016.jpg"),
    ratio: [4, 5],
    widths: [800, 1120, 1600],
    grade: true,
  },
  {
    slug: "festival-arms-up",
    src: join(SCRATCH, "c0058_hires", "f_005.jpg"),
    ratio: [4, 5],
    widths: [800, 1120, 1600],
    grade: true,
  },
];

// re-crops of already-graded SAMPLES stills — no lightTouch (already graded).
const RECROPS = [
  {
    slug: "band-golden-flare",
    src: join(EXISTING_SRC, "vybe-08_band-golden-flare.jpg"),
    ratio: [4, 3],
    widths: [900, 1600],
    dropOldWidths: [800, 1120], // old vertical-only bake, now orphaned
  },
  {
    slug: "festival-grounds",
    src: join(EXISTING_SRC, "vybe-02_fall-lake-mountains.jpg"),
    ratio: [4, 5],
    widths: [800, 1120, 1600],
    dropOldWidths: [900], // old landscape-only bake, now orphaned
  },
];

await mkdir(OUT, { recursive: true });

for (const { slug, src, ratio, widths, grade } of NEW_PHOTOS) {
  const [rw, rh] = ratio;
  for (const width of widths) {
    const height = Math.round((width * rh) / rw);
    let base = sharp(src).rotate().resize({ width, height, fit: "cover", position: ATTENTION });
    if (grade) base = lightTouch(base);
    await base.clone().avif(AVIF).toFile(join(OUT, `${slug}-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `${slug}-${width}.webp`));
    console.log(`NEW vybe/${slug}-${width} ok (${rw}:${rh})`);
  }
}

for (const { slug, src, ratio, widths, dropOldWidths } of RECROPS) {
  const [rw, rh] = ratio;
  for (const width of widths) {
    const height = Math.round((width * rh) / rw);
    const base = sharp(src).rotate().resize({ width, height, fit: "cover", position: ATTENTION });
    await base.clone().avif(AVIF).toFile(join(OUT, `${slug}-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `${slug}-${width}.webp`));
    console.log(`RECROP vybe/${slug}-${width} ok (${rw}:${rh})`);
  }
  for (const width of dropOldWidths ?? []) {
    for (const ext of ["avif", "webp"]) {
      const p = join(OUT, `${slug}-${width}.${ext}`);
      if (existsSync(p)) {
        await unlink(p);
        console.log(`removed orphaned vybe/${slug}-${width}.${ext}`);
      }
    }
  }
}

console.log("vybe v5 section assets done ->", OUT);
