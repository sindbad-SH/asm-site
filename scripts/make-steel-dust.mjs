#!/usr/bin/env node
/**
 * make-steel-dust.mjs — bake the /adventure/steel-and-dust magazine-story
 * assets (M1, 2026-07-22, operator-directed "magazine light" direction).
 *
 * Sources are the operator's own drone frame-grabs (READ-ONLY, the enhanced
 * _AA exports under E:/Old Projects/Colorado Medieval Festival/2024/). Three
 * new exports join the four festival stills that make-festival-photos.mjs
 * already bakes:
 *
 *  - cover-charge  — the story's COVER: the two-knight charge (vertical
 *    Snapshot_...130718), cropped 4:5 with the tilt lane centered and the
 *    foothills kept at top for the masthead to sit in.
 *  - lane-pageant  — vertical 4:5 inset: the procession walking the lists
 *    between passes (Snapshot_...125137).
 *  - field-wide    — 16:9 establishing frame of the whole tournament ground
 *    (Snapshot_...142916) for the story's closing beat.
 *
 * Produces public/media/adventure/festival/<slug>-<w>.{avif,webp} at the
 * site's orientation-aware widths (vertical 800/1120/1600 · wide 900/1600),
 * quality-matched to the other baked sets.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const SRC = "E:/Old Projects/Colorado Medieval Festival/2024/Drone screenshots_AA";
const OUT = join(process.cwd(), "public", "media", "adventure", "festival");
const AVIF = { quality: 52, effort: 5 };
const WEBP = { quality: 78 };

// Source frames are 3200x5689 (vertical) / 5689x3200 (wide).
const JOBS = [
  {
    slug: "cover-charge",
    src: join(SRC, "Jousting Vertical", "Snapshot_20260713130718.jpg"),
    // 4:5 from 3200w → 4000h. Top offset keeps the foothill line + sky band
    // for the masthead while holding both riders in the upper-middle third.
    extract: { left: 0, top: 260, width: 3200, height: 4000 },
    widths: [800, 1120, 1600],
  },
  {
    slug: "lane-pageant",
    src: join(SRC, "Jousting Vertical", "Snapshot_20260713125137.jpg"),
    extract: { left: 0, top: 900, width: 3200, height: 4000 },
    widths: [800, 1120, 1600],
  },
  {
    slug: "field-wide",
    src: join(SRC, "Jousting horizontal", "Snapshot_20260713142916.jpg"),
    // Full-frame 16:9 (source already 16:9) — no crop.
    extract: null,
    widths: [900, 1600],
  },
];

await mkdir(OUT, { recursive: true });
for (const job of JOBS) {
  for (const w of job.widths) {
    let img = sharp(job.src);
    if (job.extract) img = img.extract(job.extract);
    img = img.resize({ width: w });
    await img.clone().avif(AVIF).toFile(join(OUT, `${job.slug}-${w}.avif`));
    await img.clone().webp(WEBP).toFile(join(OUT, `${job.slug}-${w}.webp`));
    console.log(`baked ${job.slug}-${w}`);
  }
}
console.log("steel-dust assets done →", OUT);
