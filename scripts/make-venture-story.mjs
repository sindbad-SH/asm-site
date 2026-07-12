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

  // ── P13b venture-coverage set ────────────────────────────────────────────
  // Same pipeline as the pilot. These blocks point sourceDir at the EVENT ROOT
  // (parent of the tier folders) so picks can draw from `_TIER 1` first and
  // widen into `_TIER 2` only where a scene type is genuinely missing from
  // tier 1 (screenings, garments, venue detail) — the pick value carries the
  // tier subfolder. Selection + reasons trace to each event's _photo-tiers.csv;
  // prose on each page is that event's _ABOUT.md in the operator's own words.

  {
    slug: "seriesfest-2025",
    sourceDir: "E:/Old Projects/Series Fest/2025 Photos/Series Fest 2025 - Festival",
    // Panels · podium speakers · the branded step-and-repeat wall — the scenes
    // tier 1 actually holds. Two screening title-card frames widen in from
    // tier 2 (that scene is absent from tier 1) per _ABOUT's lead guidance.
    picks: {
      hero: "_TIER 1 - TOP (make stories)/20250502_194715.jpg", // SeriesFest branded step-and-repeat wall (clean, non-identifying)
      "screening-card": "_TIER 2 - GOOD/20250430_201225.jpg", // official-selection title card on the big screen
      "panel-stage": "_TIER 1 - TOP (make stories)/20250430_201234.jpg", // panel seated on stage w/ mics
      "podium-speaker": "_TIER 1 - TOP (make stories)/20250502_194803.jpg", // speaker at the podium
      "screening-title": "_TIER 2 - GOOD/20250430_172103.jpg", // a film playing on the screening-room screen
      "panel-mics": "_TIER 1 - TOP (make stories)/20250501_151912.jpg", // panel discussion w/ mics
      "podium-lectern": "_TIER 1 - TOP (make stories)/20250504_183715.jpg", // speaker at the lectern (sharp)
      "step-and-repeat": "_TIER 1 - TOP (make stories)/20250502_194707.jpg", // the branded backdrop again, different moment
      "podium-address": "_TIER 1 - TOP (make stories)/20250504_180458.jpg", // speaker addressing the room
      "panel-seated": "_TIER 1 - TOP (make stories)/20250502_130848.jpg", // seated panel on stage
    },
  },

  {
    slug: "seriesfest-2026-fashion-in-focus",
    sourceDir:
      "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Fashion in Focus",
    // A fashion/style panel: the branded stage, podium hosts, and seated panel.
    // Garment-on-display + a venue-detail frame widen in from tier 2 for the
    // editorial variety _ABOUT calls for (those scenes aren't in tier 1).
    picks: {
      hero: "_TIER 1 - TOP (make stories)/20260307_173948.jpg", // SeriesFest-branded step-and-repeat wall
      "panel-stage": "_TIER 1 - TOP (make stories)/20260307_182116.jpg", // panel seated on stage w/ mics
      "podium-host": "_TIER 1 - TOP (make stories)/20260307_181525.jpg", // host at the branded podium
      "garment-display": "_TIER 2 - GOOD/20260307_185400.jpg", // a garment on display (fashion detail)
      "garment-rack": "_TIER 2 - GOOD/20260307_180306.jpg", // a second garment on display
      "step-and-repeat": "_TIER 1 - TOP (make stories)/20260307_182101.jpg", // the branded backdrop
      "podium-speaker": "_TIER 1 - TOP (make stories)/20260307_181618.jpg", // speaker at the podium (sharpest frame)
      "panel-mics": "_TIER 1 - TOP (make stories)/20260307_185718.jpg", // seated panel w/ mics
      "podium-address": "_TIER 1 - TOP (make stories)/20260307_181715.jpg", // host addressing the room
      "venue-detail": "_TIER 2 - GOOD/20260307_184947.jpg", // event venue interior / lit staging
    },
  },

  {
    slug: "seriesfest-2026-soul-power",
    sourceDir:
      "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Soul Power ABA Premiere",
    // A small, candid premiere-night set (per _ABOUT). Its whole tier 1–2 is the
    // premiere step-and-repeat/signage wall plus two screening-room frames — so
    // this is an honestly small recap: arrivals at the premiere wall + the house.
    picks: {
      hero: "_TIER 2 - GOOD/20260218_175218.jpg", // premiere step-and-repeat / signage wall (sharpest, best-lit)
      "backdrop-arrivals": "_TIER 1 - TOP (make stories)/20260218_174608.jpg", // the premiere wall, arrivals
      "backdrop-wall": "_TIER 2 - GOOD/20260218_175207.jpg", // the branded premiere wall
      screening: "_TIER 2 - GOOD/20260218_194924.jpg", // a film on the screening-room screen
      "backdrop-signage": "_TIER 1 - TOP (make stories)/20260218_181647.jpg", // premiere signage wall
      "backdrop-lobby": "_TIER 1 - TOP (make stories)/20260218_174548.jpg", // the wall by the theater lobby
      "screening-house": "_TIER 2 - GOOD/20260218_183237.jpg", // the screening-room house
    },
  },

  {
    slug: "afm-2025",
    sourceDir: "E:/Old Projects/American Film Market/Photos/American Film Market 2025",
    // "The AFM Sessions": the blue AFM-branded stage — panels and podium
    // speakers — plus the market venue signage and the branded step-and-repeat.
    // Rich enough in tier 1 that only the picks below are needed (all tier 1).
    picks: {
      hero: "_TIER 1 - TOP (make stories)/20251115_160916.jpg", // AFM-branded stage panel (clean, well-lit)
      "venue-signage": "_TIER 1 - TOP (make stories)/20251111_080341.jpg", // the market venue interior / lit AFM signage
      "panel-stage": "_TIER 1 - TOP (make stories)/20251112_113729.jpg", // panel on stools w/ mics
      "podium-speaker": "_TIER 1 - TOP (make stories)/20251115_101950.jpg", // speaker at the podium
      "step-and-repeat": "_TIER 1 - TOP (make stories)/20251112_213413.jpg", // the AFM branded step-and-repeat (sharpest)
      "panel-mics": "_TIER 1 - TOP (make stories)/20251112_093746.jpg", // a second session panel
      "podium-lectern": "_TIER 1 - TOP (make stories)/20251115_101957.jpg", // speaker at the lectern
      "step-and-repeat-2": "_TIER 1 - TOP (make stories)/20251112_213406.jpg", // the branded backdrop again
      "panel-seated": "_TIER 1 - TOP (make stories)/20251113_110725.jpg", // seated panel on the AFM stage
      "podium-address": "_TIER 1 - TOP (make stories)/20251115_095745.jpg", // speaker addressing the session
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
