#!/usr/bin/env node
/**
 * make-ko-law-story.mjs — export pipeline for the LIGHT venture story
 * /venture/ko-law-workshops. Same conventions as make-venture-story.mjs
 * (two widths as avif+webp, EXIF auto-orient via .rotate(), into
 * public/media/venture/<slug>/) — kept as its own script because the SOURCE
 * is different: these are real event photos the operator shot at four KO Law
 * startup workshops in 2026, delivered as per-session zips.
 *
 * SOURCE (operator media, 2026): the four dated session folders under
 *   E:\Pitch Boulder\Ian KO law\<date> Ian KO Law\Photos\Photos-2-001*.zip
 * Extract each zip, then point SOURCE_DIR at the folder holding the extracted
 * per-session subfolders (s1..s4 below). To RE-RUN after re-selecting frames:
 * re-extract the zips, set SOURCE_DIR, and `node scripts/make-ko-law-story.mjs`.
 * The committed deliverable is the exports under public/media — the raw photos
 * are never committed.
 *
 * PICKS — 1 hero (wide, ~1600) + 5 collage frames, spanning ALL FOUR sessions.
 * Honesty/privacy: the HERO is an audience-from-behind frame (no identifiable
 * faces) facing the KO-branded screen; the rest favor wide room / stage /
 * branded-slide frames over close-ups of private attendees.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

// Extracted session photos live here (see SOURCE note above). Defaults to the
// working extraction used to build the first release; edit to re-run later.
const SOURCE_DIR =
  process.env.KO_LAW_SOURCE ||
  "C:/Users/Vince/AppData/Local/Temp/claude/C--builds-asm/41a1cf87-9fbd-4211-b6e3-402504cae585/scratchpad/ko-law";

const STORY = {
  slug: "ko-law-workshops",
  sourceDir: SOURCE_DIR,
  // slug → source file (session-subfolder / filename). `hero` = the lead frame.
  picks: {
    hero: "s4/20260625_121201.jpg", // Jun 25 — audience from behind, KO LAW "Startup Workshop · Building Your Team" screen (no faces)
    "stage-team": "s4/20260625_121108.jpg", // Jun 25 — two presenters on the stage, KO LAW screen behind
    "venue-wide": "s4/20260625_121047.jpg", // Jun 25 — wide, stage-lit venue establishing shot
    "workshop-slide": "s3/20260430_091420.jpg", // Apr 30 — presenter beside the KO "Startup Workshop" slide
    boardroom: "s2/20260226_095613.jpg", // Feb 26 — warm boardroom, presenter at screen, seated room
    roundtable: "s1/20260129_090710.jpg", // Jan 29 — boardroom table, presenter at the head of the room
  },
};

const repoRoot = process.cwd();

async function exportOne(srcPath, outDir, slug) {
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

const outDir = join(repoRoot, "public", "media", "venture", STORY.slug);
await mkdir(outDir, { recursive: true });
console.log(`\n▸ ${STORY.slug} → public/media/venture/${STORY.slug}/`);
let total = 0;
for (const [slug, file] of Object.entries(STORY.picks)) {
  const srcPath = join(STORY.sourceDir, file);
  if (!existsSync(srcPath)) {
    console.error(`  ✖ missing source: ${file}`);
    process.exitCode = 1;
    continue;
  }
  const { width, height, bytes } = await exportOne(srcPath, outDir, slug);
  total += bytes;
  console.log(`  ✓ ${slug.padEnd(16)} ${String(width)}×${height}  ${(bytes / 1024).toFixed(0)}KB`);
}
console.log(`  ── ${STORY.slug} total: ${(total / 1024 / 1024).toFixed(2)}MB\n`);
