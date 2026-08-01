#!/usr/bin/env node
/**
 * make-vybe-section.mjs — bake the photo grid for the new /adventure VYBE
 * section (2026-07-31 operator directive: the duplicating "From the Archive"
 * band is retired; Vybe — previously a single quiet archive tile — gets a
 * full section on its own).
 *
 * Sources are the already-culled, already-graded selects at
 * C:/builds/asm/SAMPLES/photos/vybe/ (his own drone stills + event photos —
 * NOT raw footage, per the standing "raw video never cut directly, mined
 * segments only" rule; these are finished frames, not source video). Four
 * from the 2023 VYBE Festival (a Boulder-area outdoor festival by a lake),
 * two from the 2024 Boogie Lights show (Boogie Lights hosted; Vybe attended
 * as a guest — see BRAND-SHEET.md §5 "host vs guest"). No Vybe brand/logo
 * assets are used anywhere here — camera coverage only.
 *
 * Output: public/media/adventure/vybe/<slug>-{700,1200}.{avif,webp}, same
 * 4:5 crop + quality settings as scripts/make-postcards.mjs (sharp
 * "attention" strategy so the subject isn't guaranteed to be chopped out of
 * a portrait crop).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "vybe");
const SRC = "C:/builds/asm/SAMPLES/photos/vybe";
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };
const ATTENTION = sharp.strategy.attention;

const PHOTOS = [
  // ── 2023 VYBE Festival (Boulder-area, beside a lake — Fri golden-hour/night, Sun bright-day/golden-hour) ──
  { slug: "festival-reveal", src: join(SRC, "vybe-01_blue-hour-reveal.jpg") },
  { slug: "festival-grounds", src: join(SRC, "vybe-02_fall-lake-mountains.jpg") },
  { slug: "flow-arts", src: join(SRC, "vybe-05_led-fan-trails.jpg") },
  { slug: "dusk-circle", src: join(SRC, "vybe-06_flowarts-circle-dusk.jpg") },
  // ── 2024 Boogie Lights show, Denver (Boogie Lights hosted; Vybe attended as a guest) ──
  { slug: "boogie-room", src: join(SRC, "vybe-10_boogie-spotlight-crowd.jpg") },
  { slug: "boogie-stage", src: join(SRC, "vybe-12_boogie-stage-glow.jpg") },
];

await mkdir(OUT, { recursive: true });
for (const { slug, src } of PHOTOS) {
  for (const width of [1200, 700]) {
    const height = Math.round((width * 5) / 4);
    const base = sharp(src).rotate().resize({ width, height, fit: "cover", position: ATTENTION });
    await base.clone().avif(AVIF).toFile(join(OUT, `${slug}-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(OUT, `${slug}-${width}.webp`));
    console.log(`vybe/${slug}-${width} ok`);
  }
}
