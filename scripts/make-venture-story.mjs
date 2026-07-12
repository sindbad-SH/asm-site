#!/usr/bin/env node
/**
 * make-venture-story.mjs — the REPEATABLE export pipeline for a "venture story"
 * page (P12.8 pilot: SeriesFest 2026). Point it at an operator tiered photo
 * library, list the picks, and it bakes the web exports every venture-story
 * page expects: two widths (900w + 1600w) as avif + webp, EXIF auto-oriented,
 * into public/media/venture/<story-slug>/.
 *
 * WHY A SCRIPT (not a one-off): future venture stories reuse this exact
 * pipeline. To add the next story, copy a STORY block, point SOURCE_DIR at that
 * event's tier folder, list the picks, and run `node scripts/make-venture-story.mjs`.
 * Nothing about the page template changes — dropping the exports in is the whole
 * action (same self-service contract as MEDIA-GUIDE.md's other slots).
 *
 * PICKS come from the operator's tiered library: filenames + the per-event
 * _photo-tiers.csv label/reason column drive the selection; each pick gets a
 * semantic slug the page references. Auto-orient (.rotate()) is CRITICAL — these
 * are phone photos that carry an EXIF rotation flag; without it they bake sideways.
 *
 * Honesty/privacy: picks favor stage / screen / venue / crowd frames; no
 * close-up identifiable faces of private individuals are chosen as the HERO
 * (stage & public-moment shots are fine — it is a public festival).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const WIDTHS = [900, 1600];
// dark event photography compresses well; tuned to hold detail while keeping
// the whole story's added weight modest (<8MB target, per the pilot brief).
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

/**
 * A venture story = one source folder + an ordered list of picks. To add the
 * NEXT story, append a block here (its own SOURCE_DIR + picks) and re-run.
 */
const STORIES = [
  {
    slug: "seriesfest-2026",
    sourceDir:
      "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Festival/_TIER 1 - TOP (make stories)",
    // slug → source filename. Order = gallery order. `hero` is the lead frame:
    // a wide, clean SOIRÉE stage shot — SeriesFest branding + lit screens
    // visible, faces distant (an ideal, non-identifying hero per _ABOUT.md's
    // own "lead with wide, clean stage shots" guidance).
    picks: {
      hero: "20260508_200358.jpg", // SOIRÉE — wide dual-screen main stage, speakers distant
      "soiree-room": "20260508_200628.jpg", // SOIRÉE stage + seated audience (room energy)
      "panel-bookstore": "20260507_173516.jpg", // 5-person panel, bookstore venue, crowd
      "screening-golden-groves": "20260507_102558.jpg", // big-screen film title, Q&A silhouettes
      "screening-raul-seixas": "20260508_105305.jpg", // cinema screening + hosts (venue variety)
      "stage-stats": "20260507_140514.jpg", // presentation slide on the big screen (scale)
      "press-scrum": "20260506_191518.jpg", // press/photographers at the step-and-repeat wall
      "podium-duo": "20260506_200612.jpg", // two speakers at the SeriesFest podium (stage moment)
      "step-and-repeat": "20260508_220034.jpg", // attendee at the branded wall (attendance detail)
      "soiree-mic": "20260508_200630.jpg", // SOIRÉE speaker w/ mic over the crowd
    },
  },
];

const repoRoot = process.cwd();

async function exportOne(srcPath, outDir, slug) {
  const pipeline = sharp(srcPath).rotate(); // .rotate() bakes EXIF orientation
  const meta = await pipeline.metadata();
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

let grandTotal = 0;
for (const story of STORIES) {
  const outDir = join(repoRoot, "public", "media", "venture", story.slug);
  await mkdir(outDir, { recursive: true });
  console.log(`\n▸ ${story.slug} → public/media/venture/${story.slug}/`);
  let storyBytes = 0;
  for (const [slug, file] of Object.entries(story.picks)) {
    const srcPath = join(story.sourceDir, file);
    if (!existsSync(srcPath)) {
      console.error(`  ✖ missing source: ${file}`);
      process.exitCode = 1;
      continue;
    }
    const { width, height, bytes } = await exportOne(srcPath, outDir, slug);
    storyBytes += bytes;
    console.log(
      `  ✓ ${slug.padEnd(24)} ${String(width)}×${height}  ${(bytes / 1024).toFixed(0)}KB`,
    );
  }
  grandTotal += storyBytes;
  console.log(`  ── ${story.slug} total: ${(storyBytes / 1024 / 1024).toFixed(2)}MB`);
}
console.log(`\n✓ all stories: ${(grandTotal / 1024 / 1024).toFixed(2)}MB added\n`);
