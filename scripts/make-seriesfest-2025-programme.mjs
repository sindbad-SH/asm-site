#!/usr/bin/env node
/**
 * make-seriesfest-2025-programme.mjs — 2026-08-03.
 *
 * The /venture/seriesfest-2025 page was built from ten Tier-1 frames that all
 * came from three moments (the Soirée, the Awards Ceremony, opening night), so
 * three of the ten were near-duplicates of each other and the page could only
 * say generic things about "screenings and panels". The full pool is 369 photos
 * and Tier 2 turned out to hold the actual PROGRAMME: session after session with
 * its own title card projected behind the panel, legible in frame.
 *
 * The operator never wrote a 2025 dispatch (his only published 2025-festival
 * line is "I had a blast at the full festival last year"), so the page carries
 * its story in CAPTIONS instead — and every caption fact below is read off the
 * screen in his own photograph, never inferred. That is what these bakes are
 * for. Same convention as every other make-*.mjs here: EXIF auto-orient
 * (.rotate()), 900w+1600w, AVIF q50 + WebP q72, downscale-only, appended into
 * the SAME public/media/venture/seriesfest-2025/ directory with new
 * content-named slugs so nothing collides with the existing ten exports.
 *
 * SCREENING: every pick is a stage-facing frame shot from the audience — no
 * posed step-and-repeat portraits, no close-up bystanders, and the site owner
 * does not appear in any of them (he is behind the camera in all thirteen).
 * The two red-carpet portrait frames in this pool (20250502_192705 / _192708)
 * were considered and excluded under the posed-portrait rule.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "E:/Old Projects/Series Fest/2025 Photos/Series Fest 2025 - Festival";
const T2 = `${ROOT}/_TIER 2 - GOOD`;
const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

// slug → source. The comment on each is the ON-SCREEN text that makes its
// caption verifiable; nothing is claimed that isn't legible in the frame.
const PICKS = {
  "panel-at-liberty": `${T2}/20250430_174119.jpg`, // "AT LIBERTY — hosted by W. Kamau Bell · ACLU"
  "panel-sunny-nights": `${T2}/20250430_211617.jpg`, // "SUNNY NIGHTS"
  "pitch-a-thon": `${T2}/20250501_094250.jpg`, // "PITCH-A-THON!" + Canva / Working Artist Group / RBC
  "screening-gimme-shelter": `${T2}/20250501_101502.jpg`, // "GIMME SHELTER (The Series) · Chantal Woodyard · Peter Trinh"
  "screening-zhizha": `${T2}/20250501_104553.jpg`, // "ZHIZHA (紙鳶) — created by Desdemona Chiang"
  "award-marco-calvani": `${T2}/20250501_143808.jpg`, // "MARCO CALVANI — Breakthrough Actor Award"
  "panel-four-seasons": `${T2}/20250501_144155.jpg`, // "The FOUR SEASONS" · Netflix · Universal Studio Group
  "panel-coopers-bar": `${T2}/20250501_185419.jpg`, // "COOPER'S BAR" · AMC+
  "panel-carnival-films": `${T2}/20250502_131117.jpg`, // "IMPACT IN TELEVISION WITH CARNIVAL FILMS" · Deadline · Universal
  "soiree-quartet": `${T2}/20250502_180351.jpg`, // string quartet performing at the Soirée, sponsor wall behind
  "award-rhea-seehorn": `${T2}/20250502_195732.jpg`, // "HONORING RHEA SEEHORN — Excellence in Acting Award"
  "panel-showrunners": `${T2}/20250503_123936.jpg`, // "LEADING THE NARRATIVE: INSIDE THE WORLD OF SHOWRUNNERS"
  "panel-st-denis": `${T2}/20250504_121247.jpg`, // "CLIPS AND CONVERSATION WITH ST. DENIS MEDICAL" · Universal
};

const repoRoot = process.cwd();
const outDir = join(repoRoot, "public", "media", "venture", "seriesfest-2025");

async function exportOne(srcPath, slug) {
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
  return { width: meta.width, height: meta.height, bytes };
}

await mkdir(outDir, { recursive: true });
console.log(`\n▸ seriesfest-2025 programme → public/media/venture/seriesfest-2025/`);
let total = 0;
for (const [slug, src] of Object.entries(PICKS)) {
  if (!existsSync(src)) {
    console.error(`  ✖ missing source: ${src}`);
    process.exitCode = 1;
    continue;
  }
  const { width, height, bytes } = await exportOne(src, slug);
  total += bytes;
  console.log(`  ✓ ${slug.padEnd(26)} ${width}×${height}  ${(bytes / 1024).toFixed(0)}KB`);
}
console.log(`  ── total: ${(total / 1024 / 1024).toFixed(2)}MB\n`);
