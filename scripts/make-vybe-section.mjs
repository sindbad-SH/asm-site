#!/usr/bin/env node
/**
 * make-vybe-section.mjs — bake the photo grid for the /adventure VYBE
 * section AND the /adventure/vybe rich story page (2026-07-31 operator
 * directive: the duplicating "From the Archive" band is retired; Vybe —
 * previously a single quiet archive tile — gets a full section + its own
 * click-through page, "magazine-cover treatment... a lot more layout").
 *
 * Sources are the already-culled, already-graded selects at
 * C:/builds/asm/SAMPLES/photos/vybe/ (his own drone stills + event photos —
 * NOT raw footage, per the standing "raw video never cut directly, mined
 * segments only" rule; these are finished frames, not source video). No
 * Vybe brand/logo assets are used anywhere here — camera coverage only.
 *
 * ⚠ 2026-07-31 EXPANSION (operator direct review — the section "was bland,
 * too plain, photos laid out in a couple"): three more frames from the same
 * already-graded contact sheet join the set, all performers-while-performing
 * (same releases-restraint precedent as the site's other event coverage —
 * SfT/Nordic Daughter postcards feature performer faces; backstage/candid
 * guest portraits in the source set, e.g. vybe-13/14, were deliberately left
 * OUT for the same reason). `_CONTACT-SHEET.md` in the source folder has the
 * full per-frame sourcing/timestamp note for every slug below.
 *   - band-golden-flare (vybe-08): "the best 'peak moment' band shot in the
 *     2-day set" per the contact sheet — a live band at golden hour, no
 *     band name known/verified, so the caption stays generic ("a band"; no
 *     invented name).
 *   - fire-staff-spin (vybe-09): a flow-arts performer working fire staff in
 *     daylight, sharp action.
 *   - boogie-chillsbury-doughboys (vybe-11): a wide venue shot at the 2024
 *     Boogie Lights show — the performing act's name is real, read directly
 *     off the venue's own stage signage in frame.
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
  { slug: "band-golden-flare", src: join(SRC, "vybe-08_band-golden-flare.jpg") },
  { slug: "fire-staff-spin", src: join(SRC, "vybe-09_fire-staff-spin.jpg") },
  // ── 2024 Boogie Lights show, Denver (Boogie Lights hosted; Vybe attended as a guest) ──
  { slug: "boogie-room", src: join(SRC, "vybe-10_boogie-spotlight-crowd.jpg") },
  { slug: "boogie-chillsbury-doughboys", src: join(SRC, "vybe-11_boogie-chillsbury-doughboys.jpg") },
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
