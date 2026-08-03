#!/usr/bin/env node
/**
 * make-pitchboulder-venture-card.mjs — 2026-08-03. Fixes the missing photo on
 * the PitchBoulder card in /venture's "Founders & Pitch Rooms" collection rail.
 *
 * ROOT CAUSE (operator-confirmed): toRailCard() in src/pages/venture.astro
 * derives a card's media slug from `c.href.replace(/^\/venture\//, "")`.
 * PitchBoulder's collection entry (src/consts.ts VENTURE_COLLECTIONS) links to
 * `/work/pitchboulder`, which that regex doesn't match, so the slug never
 * resolved to a media folder and the card silently fell back to the "no photo
 * yet" ghost-letter treatment — the same fallback MEME/Amazing Aerial/the
 * film-venture card use, except PitchBoulder DOES have photography, so this
 * was a bug, not the intended state. Fix (this bake + a consts.ts edit) gives
 * the collection entry `mediaSlug: "pitchboulder"`; toRailCard() always
 * resolves a card's image at `venture/<slug>/hero-900`, so this bakes to
 * public/media/venture/pitchboulder/ — a NEW folder distinct from
 * public/media/work/pitchboulder/ (that folder holds the case-study page's
 * own media; nothing there is moved or altered).
 *
 * SOURCE: the same DSC08301 frame already selected (scripts/
 * make-pitchboulder-hero.mjs, 2026-08-01) as PitchBoulder's best "whole room,
 * lots of people" shot — chosen there after a 3-stage scout/treatment/judge
 * review of 95 eligible frames, and already the operator-approved hero on
 * work/pitchboulder.astro (as hook-room-1600). Reused here rather than
 * picking a fresh frame: it is the establish-shot the operator already
 * confirmed represents PitchBoulder well, and no one in frame is the operator
 * (checked against his own reference photo — long dark hair, dark bandana,
 * sunglasses on head, short beard, olive waistcoat; not present here).
 *
 * CROP: this card's box is 16:10 (.im-rail-media), narrower than the 16:9-ish
 * hook-room-1600 export, so re-deriving straight from the RAW MASTER (rather
 * than re-cropping the already-cropped hook-room-1600.webp) avoids upscaling
 * the 1600w output — the fresh master is 6272px wide, comfortably more than
 * either target width. 16:10 (1.6:1) is WIDER than the source's native ratio
 * (6272x4168 = 1.505:1), so object-fit:cover on this box crops HEIGHT only,
 * full width kept — no horizontal decision to make. Only 248px of vertical
 * slack exists between "keep the top" and "keep the bottom" (94% of the
 * source height ships either way); previewed both ends and every point
 * between: pinning to the BOTTOM of that range (top=248, vs. top=0) visibly
 * reduces the exposed ceiling/ductwork band without losing anything at the
 * bottom (chairs/feet already run to the frame edge in the source), so this
 * bakes the bottom-biased crop.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = String.raw`E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\Edited\_TIER 2 - GOOD\DSC08301.jpg`;
const OUT_DIR = join(process.cwd(), "public", "media", "venture", "pitchboulder");
const WIDTHS = [900, 1600];
// same encoder settings as scripts/make-pitchboulder-hero.mjs, for consistency
// with the rest of this relationship's baked media.
const WEBP = { quality: 74, effort: 5 };
const AVIF = { quality: 52, effort: 5 };

if (!existsSync(SRC)) {
  console.error(`✖ missing source: ${SRC}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const rotated = sharp(SRC).rotate(); // EXIF auto-orient, site convention
const meta = await rotated.metadata();
const targetRatio = 16 / 10;
const cropW = meta.width; // source is relatively taller than 16:10 -> full width, crop height
const cropH = Math.round(meta.width / targetRatio);
const top = meta.height - cropH; // bottom-biased: minimizes the ceiling/ductwork band (see header)
const extract = { left: 0, top, width: cropW, height: cropH };

console.log(`\n▸ pitchboulder venture-card hero → public/media/venture/pitchboulder/`);
console.log(`  source ${meta.width}x${meta.height} (${(meta.width / meta.height).toFixed(3)}:1) -> crop ${cropW}x${cropH} (${(cropW / cropH).toFixed(3)}:1) @ top=${top}`);

let bytes = 0;
for (const w of WIDTHS) {
  const base = sharp(SRC).rotate().extract(extract).resize({ width: w, withoutEnlargement: true });
  for (const [ext, opts] of [["avif", AVIF], ["webp", WEBP]]) {
    const outFile = join(OUT_DIR, `hero-${w}.${ext}`);
    await base.clone()[ext](opts).toFile(outFile);
    bytes += statSync(outFile).size;
  }
  console.log(`  ✓ hero-${w}.avif + hero-${w}.webp`);
}
console.log(`  ── total: ${(bytes / 1024).toFixed(0)}KB\n`);
