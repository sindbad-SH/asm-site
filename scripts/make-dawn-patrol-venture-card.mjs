#!/usr/bin/env node
/**
 * make-dawn-patrol-venture-card.mjs — 2026-08-03. Bakes the missing
 * venture.astro rail-card thumbnail for the reframed Pebble Beach Concours
 * piece (VENTURE_STANDALONE_STORIES in src/consts.ts, href
 * /venture/dawn-patrol).
 *
 * WHY A NEW BAKE: toRailCard() in src/pages/venture.astro always resolves a
 * card's image at `venture/<slug>/hero-900` — for this card slug derives to
 * "dawn-patrol" (the href already starts with /venture/, so no mediaSlug
 * override is needed), but no `hero-900`/`hero-1600` pair exists yet in
 * public/media/venture/dawn-patrol/ (only the page's own named exports —
 * transporter-row-predawn, judging-the-cobra, etc.).
 *
 * SOURCE: reuses `full-field-midday` — one of the 14 frames already baked
 * for /venture/dawn-patrol itself (make-dawn-patrol.mjs), already
 * operator-approved material, no new photography or selection decision.
 * Chosen over the page's own cover image (transporter-row-predawn, a
 * pre-dawn shot) specifically BECAUSE this restructure reframes the page
 * around the OVERALL Concours d'Elegance story with Dawn Patrol as one
 * movement inside it — a packed midday show field (crowd, multiple cars, the
 * "L-3 Postwar Preservation Late" judging sign, the coastline) reads as "the
 * whole Concours," not just the dawn segment, matching that reframe. This
 * mirrors the precedent already set by make-pitchboulder-venture-card.mjs
 * (reusing an already-approved frame from the destination page itself for
 * its rail-card thumbnail).
 *
 * NO RE-CROP NEEDED: the rail card box is 16:10 (.im-rail-media, CSS
 * object-fit:cover); full-field-midday is already exported at exactly the
 * two widths this card needs (900/1600) at native 16:9 (1600x900). 16:9 is
 * only marginally wider than 16:10, so object-fit:cover's default center
 * crop trims ~5% off each side (80px of 1600) — the crowd/cars/sign that
 * matter are all comfortably inside that margin. A byte-for-byte copy (not a
 * re-encode) keeps the exact quality already shipped on /venture/dawn-patrol
 * itself — no generation loss, no new crop decision to make.
 */
import { copyFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "public", "media", "venture", "dawn-patrol");
const SOURCE_SLUG = "full-field-midday";
const WIDTHS = [900, 1600];
const EXTS = ["avif", "webp"];

console.log(`\n▸ dawn-patrol venture-card hero → public/media/venture/dawn-patrol/ (from ${SOURCE_SLUG})`);
let bytes = 0;
for (const w of WIDTHS) {
  for (const ext of EXTS) {
    const src = join(DIR, `${SOURCE_SLUG}-${w}.${ext}`);
    const dest = join(DIR, `hero-${w}.${ext}`);
    if (!existsSync(src)) {
      console.error(`  ✖ missing source: ${src}`);
      process.exitCode = 1;
      continue;
    }
    await copyFile(src, dest);
    bytes += statSync(dest).size;
    console.log(`  ✓ hero-${w}.${ext} (copied from ${SOURCE_SLUG}-${w}.${ext})`);
  }
}
console.log(`  ── total: ${(bytes / 1024).toFixed(0)}KB\n`);
