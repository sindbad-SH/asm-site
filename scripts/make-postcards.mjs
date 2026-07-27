#!/usr/bin/env node
/**
 * make-postcards.mjs — bake the first two Adventure "postcard" micro-story
 * stills (POSTCARD pass, publication-v1 branch, 2026-07-27). Both are from
 * the verified Scandinavian Midsummer Festival, Parfet Park, Golden, CO —
 * June 14-16, 2024, the festival's first year in Golden.
 *
 * Sources (READ-ONLY, E:/Old Projects/scandi fest golden CO 2024/):
 *  - "Valkyrie Dance (Scandinavian Fest Golden 2024).mp4" — an already
 *    rendered export. Frame-grabbed directly.
 *  - "Chef Eric Mcbride (Scandinavian Festival Golden 2024).wfp" — a
 *    Filmora project with NO rendered mp4. Its .wfp (a zip) was inspected to
 *    recover the timeline's clip list (in/out points against the two raw
 *    DJI source masters it references: DJI_20240616110209_0237_D.MP4 and
 *    DJI_20240616110607_0238_D.MP4). All 26 clips (the full ~9.5-minute
 *    reconstructed timeline) were sampled at their midpoints and visually
 *    reviewed — the footage is a vendor-market walkthrough (dragon
 *    figurines, engraved goblets, jewelry, parasol stalls, festival tents,
 *    the foothills behind Golden), not a chef or cooking scene; no one
 *    identifiable as "Eric Mcbride" appears in any sampled frame. Per the
 *    task's explicit instruction ("if a clip shows something different from
 *    its filename's implication, write what you SEE"), this postcard is
 *    captioned "Market Row" and describes the vendor row, not a chef — see
 *    SITE-COPY-DECK-publication-v1.md ("POSTCARD additions") for the full
 *    honesty note.
 *
 * Frame grabs were extracted at native/near-native drone resolution
 * (scale=1920:-1) into the session scratchpad; this script just resizes and
 * re-encodes them into the site's postcard media convention:
 *   public/media/adventure/postcards/<postcard-slug>/<photo-slug>-{700,1200}.{avif,webp}
 * 4:5 crop (matches the .postcard-photo CSS aspect-ratio), quality-matched
 * to the site's other baked photo sets (avif ~55/effort 5, webp ~82, per
 * the operator's "1400px wide, quality ~82" export brief — capped to the
 * page's actual 700/1200 srcset widths so the existence-gate in
 * adventure.astro's postcardPhoto() resolves).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "adventure", "postcards");
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };

const FRAMES_DIR =
  "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/41a1cf87-9fbd-4211-b6e3-402504cae585/scratchpad/postcard_hires";

const PHOTOS = [
  { postcard: "valkyrie-dance", slug: "formation", src: join(FRAMES_DIR, "valkyrie-formation.jpg") },
  { postcard: "valkyrie-dance", slug: "motion", src: join(FRAMES_DIR, "valkyrie-motion.jpg") },
  { postcard: "valkyrie-dance", slug: "closeup", src: join(FRAMES_DIR, "valkyrie-closeup.jpg") },
  { postcard: "market-row", slug: "overview", src: join(FRAMES_DIR, "market-overview.jpg") },
  { postcard: "market-row", slug: "stalls", src: join(FRAMES_DIR, "market-stalls.jpg") },
  { postcard: "market-row", slug: "parasols", src: join(FRAMES_DIR, "market-parasols.jpg") },
];

for (const { postcard, slug, src } of PHOTOS) {
  const dir = join(OUT, postcard);
  await mkdir(dir, { recursive: true });
  for (const width of [1200, 700]) {
    const height = Math.round((width * 5) / 4);
    const base = sharp(src).resize({ width, height, fit: "cover" });
    await base.clone().avif(AVIF).toFile(join(dir, `${slug}-${width}.avif`));
    await base.clone().webp(WEBP).toFile(join(dir, `${slug}-${width}.webp`));
    console.log(`${postcard}/${slug}-${width} ok`);
  }
}
