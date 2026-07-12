#!/usr/bin/env node
/**
 * make-pitchboulder-collage.mjs — export the chapter-01 (PitchBoulder) photo
 * collage for the Venture page, following make-venture-story.mjs conventions:
 * two widths (900w + 1600w) as avif + webp, EXIF auto-oriented (.rotate() is
 * CRITICAL — these are phone photos carrying an orientation flag), written into
 * public/media/work/pitchboulder/.
 *
 * P21b — REBUILT for a VENUE MIX (operator: "you're using all the photos from
 * the Boulder Chamber [one room] — I wanted a mix"). The original set was three
 * frames from the single May-6 Boulder Chamber session (snowy windows, flags).
 * This set now spans TWO venues + two capture styles, so the collage reads as a
 * body of coverage instead of one room:
 *
 *   Venue A — Boulder Chamber (May 6): the hand-phone session.
 *     - presenter-logo: a presenter mid-gesture at the "Follow Us!" QR slide,
 *       the PITCH BOULDER brand prominent + a lit snowy-window backdrop (the
 *       operator "loves the logo being visible"). Kept from the original set.
 *       [the hover-video card (hook-poster + loop.mp4) is ALSO this room — the
 *        audience-view room energy — so Venue A carries the brand + the motion.]
 *
 *   Venue B — the industrial co-working room (Jan 28): the PROFESSIONALLY
 *     EDITED Sony set (E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\Edited),
 *     a warmer, exposed-ceiling space — a genuinely different room, and the
 *     highest-quality frames in the archive:
 *     - coworking-presenter: a presenter working a "Five Ways We Transform Your
 *       Business" slide with the seated room behind (the presenter moment).
 *     - coworking-crowd: a wide full-room frame — long tables, a full audience,
 *       the speaker entering (the crowd-energy establishing shot).
 *
 * The old room-wide / podium picks (both also Boulder Chamber) are retired — they
 * doubled the single venue the operator asked to move away from. The collage now
 * mixes venue, moment, and capture style. Aspect ratios stay native (the .im-card
 * grid crops each frame), so a square phone frame and a 3:2 Sony frame both fit.
 *
 * To re-export: `node scripts/make-pitchboulder-collage.mjs` from the repo root.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const CHAMBER_DIR = "E:/Pitch Boulder/Top photos for web build/_TIER 1 - TOP (make stories)";
const COWORK_DIR = "E:/Pitch Boulder/2026 Recordings/1-28-2026/Photos/Edited";
const OUT_REL = ["public", "media", "work", "pitchboulder"];

// slug → { dir, file }. Venue A = the May-6 Boulder Chamber phone session;
// Venue B = the Jan-28 professionally-edited Sony set (a different room).
const PICKS = {
  // Venue A — Boulder Chamber: presenter gesturing at the "Follow Us!" PITCH
  // BOULDER slide (square phone frame, 3056². the collage gives it a square card).
  "presenter-logo": { dir: CHAMBER_DIR, file: "20260506_091404.jpg" },
  // Venue B — co-working room: presenter + "Five Ways We Transform Your Business"
  // slide, seated room behind (edited Sony, 6272×4168 3:2).
  "coworking-presenter": { dir: COWORK_DIR, file: "_TIER 1 - TOP (make stories)/DSC08258.jpg" },
  // Venue B — co-working room: wide full-room crowd energy, speaker entering
  // (edited Sony, 6272×4168 3:2).
  "coworking-crowd": { dir: COWORK_DIR, file: "_TIER 2 - GOOD/DSC08301.jpg" },
};

const repoRoot = process.cwd();
const outDir = join(repoRoot, ...OUT_REL);
await mkdir(outDir, { recursive: true });

console.log(`\n▸ pitchboulder collage → ${OUT_REL.join("/")}/`);
let total = 0;
for (const [slug, { dir, file }] of Object.entries(PICKS)) {
  const srcPath = join(dir, file);
  if (!existsSync(srcPath)) {
    console.error(`  ✖ missing source: ${file}`);
    process.exitCode = 1;
    continue;
  }
  const meta = await sharp(srcPath).rotate().metadata();
  let bytes = 0;
  for (const w of WIDTHS) {
    const base = sharp(srcPath).rotate().resize({ width: w, withoutEnlargement: true });
    const avifOut = join(outDir, `${slug}-${w}.avif`);
    const webpOut = join(outDir, `${slug}-${w}.webp`);
    await base.clone().avif(AVIF).toFile(avifOut);
    await base.clone().webp(WEBP).toFile(webpOut);
    bytes += statSync(avifOut).size + statSync(webpOut).size;
  }
  total += bytes;
  console.log(`  ✓ ${slug.padEnd(20)} ${meta.width}×${meta.height}  ${(bytes / 1024).toFixed(0)}KB`);
}
console.log(`  ── total: ${(total / 1024 / 1024).toFixed(2)}MB added\n`);
