#!/usr/bin/env node
/**
 * make-linkedin-archive-additions.mjs — 2026-08-02.
 *
 * A LinkedIn-archive mining batch (E:\Amazing Ariel\_CONTENT_FACTORY\
 * batch-2026-08-02-linkedin-archive\{afm-2025,seriesfest,pitchboulder}\
 * web-assets\) produced 57 flat 1920px JPG+WebP photos. Cross-referencing
 * each photo's ORIGINAL full-res source path (from that batch's own
 * MANIFEST.md files, plus dHash identification for the seriesfest lane
 * where the manifest didn't restate sources for an "unchanged this pass"
 * section) against every existing scripts/make-*.mjs in this repo found
 * 19 of the 57 are byte-for-byte re-imports of frames already live on the
 * site (confirmed both by source-path match AND dHash against the live
 * public/media files). Those 19 are skipped entirely — never baked here.
 *
 * Of the remaining 38, a from-scratch visual re-screen against the
 * site-owner reference photo and the posed-portrait/step-repeat rule
 * (per this task's own instructions, independent of the batch's own
 * screening) found 5 more that don't clear the bar and are also skipped:
 *   - seriesfest 2026-05-07 162827.jpg / 162822.jpg: the site owner
 *     appears (confirmed both visually and against the seriesfest
 *     MANIFEST's own "EXCLUDED as HIM" list for this exact burst — those
 *     two frames were apparently left in web-assets/ by mistake when the
 *     carousel was fixed).
 *   - seriesfest 2026-02-18 175028.jpg / 2026-05-06 191551.jpg: posed
 *     group photos stopped at a step-and-repeat wall (basketball trophy
 *     photo-op; 6-person arms-around-shoulders lineup).
 *   - seriesfest 2026-05-09 113753.jpg: posed step-and-repeat group AND
 *     a third-party series poster ("Devil in Disguise") visible in frame.
 *
 * That leaves 33 genuinely new photos, regenerated here from the ORIGINAL
 * full-res masters (never from the batch's 1920px derivatives), following
 * the exact convention every other make-*.mjs in this repo uses: EXIF
 * auto-orient (.rotate()), 900w+1600w, AVIF q50 + WebP q72, downscale-only
 * (withoutEnlargement). Content-named slugs, not the batch's dated/
 * numbered filenames.
 *
 * Two editorial cautions carried forward (NOT excluded — they clear the
 * explicit hard rules, no owner, not posed, no third-party art dominating
 * — but flagged for the human curation pass that wires these into pages):
 *   - afm-2025 evening-reception-disco: an unbranded nightclub/party frame,
 *     the same general class of shot the operator has twice rejected for
 *     AFM social content ("just a random party... not the best one").
 *   - afm-2025 western-alliance-lineup / western-alliance-podium: the
 *     Western Alliance Bank sponsor reception, which the operator
 *     explicitly called "adjacent to American Film Market but not the
 *     best" when reviewing this same source material for social.
 *
 * Also bakes the two missing home-page cluster "peak" thumbnails
 * (market + industry each had lake/ridge/valley but no peak) at the exact
 * dimensions of their existing ridge sibling (880x1100), per §3 of the task.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

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

async function runLane(label, outDirParts, picks) {
  const outDir = join(repoRoot, ...outDirParts);
  await mkdir(outDir, { recursive: true });
  console.log(`\n▸ ${label} → ${outDirParts.join("/")}/`);
  let total = 0;
  for (const [slug, srcPath] of Object.entries(picks)) {
    if (!existsSync(srcPath)) {
      console.error(`  ✖ missing source: ${srcPath}`);
      process.exitCode = 1;
      continue;
    }
    const { width, height, bytes } = await exportOne(srcPath, outDir, slug);
    total += bytes;
    console.log(`  ✓ ${slug.padEnd(26)} ${String(width)}×${height}  ${(bytes / 1024).toFixed(0)}KB`);
  }
  console.log(`  ── ${label} total: ${(total / 1024 / 1024).toFixed(2)}MB`);
  return total;
}

// ── AFM 2025 — 12 new photos → public/media/venture/afm-2025/ ─────────────
const AFM_ROOT = "E:/Old Projects/American Film Market/Photos/American Film Market 2025";
const AFM_PICKS = {
  "wrapbook-pillar": `${AFM_ROOT}/_TIER 2 - GOOD/20251111_075853.jpg`,
  "market-floor-lounge": `${AFM_ROOT}/_TIER 2 - GOOD/20251111_080300.jpg`,
  "lounge-reception-globe": `${AFM_ROOT}/_TIER 2 - GOOD/20251111_185555.jpg`,
  "evening-reception-disco": `${AFM_ROOT}/_TIER 2 - GOOD/20251112_214636.jpg`, // caution: unbranded party shot, see header note
  "panel-levelup-gaming": `${AFM_ROOT}/_TIER 2 - GOOD/20251113_130808.jpg`,
  "reception-tent-toast": `${AFM_ROOT}/_TIER 2 - GOOD/20251113_203424.jpg`,
  "veritone-booth": `${AFM_ROOT}/_TIER 2 - GOOD/20251114_095543.jpg`,
  "western-alliance-lineup": `${AFM_ROOT}/_TIER 2 - GOOD/20251114_183009.jpg`, // caution: sponsor-party venue, see header note
  "western-alliance-podium": `${AFM_ROOT}/_TIER 2 - GOOD/20251114_183400.jpg`, // caution: sponsor-party venue, see header note
  "panel-address-stage": `${AFM_ROOT}/_TIER 1 - TOP (make stories)/20251115_101910.jpg`,
  "panel-independent-action": `${AFM_ROOT}/_TIER 1 - TOP (make stories)/20251115_160450.jpg`,
  "panel-finance-packaging": `${AFM_ROOT}/_TIER 1 - TOP (make stories)/20251112_093846.jpg`,
};

// ── PitchBoulder — 13 new photos → public/media/work/pitchboulder/ ────────
const PB_ROOT = "E:/Pitch Boulder/Top photos for web build";
const PB_TIER1 = `${PB_ROOT}/_TIER 1 - TOP (make stories)`;
const PB_TIER2 = `${PB_ROOT}/_TIER 2 - GOOD`;
const PITCHBOULDER_PICKS = {
  "library-room-wide": `${PB_TIER2}/20260506_091817.jpg`,
  "presenter-mines": `${PB_TIER1}/20260506_091805.jpg`,
  "library-room-closeup": `${PB_TIER2}/20260506_092216.jpg`,
  "presenter-podium-flags": `${PB_TIER1}/20260506_091352.jpg`,
  "presenter-leyden-space": `${PB_TIER1}/20260506_091643.jpg`,
  "presenter-pempal": `${PB_TIER1}/20260506_092416.jpg`,
  "crowd-sponsors-wrap": `${PB_TIER2}/20260520_090828.jpg`,
  "presenter-checkered-shirt": `${PB_TIER1}/20260520_090800.jpg`,
  "duo-candid": `${PB_TIER1}/20260520_090951.jpg`,
  "presenter-nolimitrobotics": `${PB_TIER1}/20260520_091528.jpg`,
  "audience-room-wide": `${PB_TIER2}/20260617_090734.jpg`,
  "presenter-agenda": `${PB_TIER2}/20260617_090804.jpg`,
  "presenter-wavebye": `${PB_TIER2}/20260617_090853.jpg`,
};

// ── SeriesFest — 8 new photos → public/media/venture/seriesfest-2026/ ─────
// (all part of the Season 12 Festival — Littleton Road, Awards, and Brunch
// are sessions/moments WITHIN the Festival, same as the site's existing
// picks for this page, not a separate sub-event page.)
const SF_ROOT = "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Festival";
const SERIESFEST_PICKS = {
  "opening-night-mingle": `${SF_ROOT}/_TIER 2 - GOOD/20260506_181938.jpg`,
  "panel-behind-the-deals": `${SF_ROOT}/_TIER 3 - MAYBE/20260507_173334.jpg`,
  "soiree-piano-hosts": `${SF_ROOT}/_TIER 2 - GOOD/20260508_201801.jpg`,
  "panel-littleton-road": `${SF_ROOT}/_TIER 1 - TOP (make stories)/20260509_102533.jpg`,
  "panel-indie-tv-risk": `${SF_ROOT}/_TIER 1 - TOP (make stories)/20260509_175535.jpg`,
  "awards-ceremony-group": `${SF_ROOT}/_TIER 3 - MAYBE/20260510_193552.jpg`,
  "awards-podium-embrace": `${SF_ROOT}/_TIER 1 - TOP (make stories)/20260510_192222.jpg`,
  "brunch-patio-crowd": `${SF_ROOT}/_TIER 3 - MAYBE/20260510_102357.jpg`,
};

let grand = 0;
grand += await runLane("afm-2025", ["public", "media", "venture", "afm-2025"], AFM_PICKS);
grand += await runLane("pitchboulder", ["public", "media", "work", "pitchboulder"], PITCHBOULDER_PICKS);
grand += await runLane("seriesfest-2026", ["public", "media", "venture", "seriesfest-2026"], SERIESFEST_PICKS);

// ── Home cluster gap-fill: market/peak + industry/peak ─────────────────────
// Both existing "ridge" siblings are 880x1100 (4:5 portrait) — match exactly.
// Small decorative floating thumbnails (rendered 150-300px on screen per
// TableauCluster.astro / global.css .float--peak), so bold/simple beats
// detailed. market = PitchBoulder founder-pitch energy; industry = AFM
// film-market energy (the literal "AMERICAN FILM MARKET" wordmark + AFM
// Sessions red-circle mark reads clearly even shrunk).
const CLUSTER_W = 880;
const CLUSTER_H = 1100;
const CLUSTER_PEAKS = [
  {
    family: "market",
    src: `${PB_TIER1}/20260520_091528.jpg`,
    // native 3056x3056 square; crop right-biased band onto the presenter
    // (mid-gesture, NoLimitRobotics pitch slide, wall clock accent).
    extract: { left: 612, top: 0, width: 2444, height: 3056 },
  },
  {
    family: "industry",
    src: `${AFM_ROOT}/_TIER 2 - GOOD/20251113_130808.jpg`,
    // native 5544x5544 square; crop hard right onto the red "THE AFM
    // SESSIONS" circle mark + AMERICAN FILM MARKET wordmark + chandelier.
    extract: { left: 1109, top: 0, width: 4435, height: 5544 },
  },
];

console.log(`\n▸ home cluster peak gap-fill → public/media/home/{market,industry}/cluster/`);
let clusterBytes = 0;
for (const { family, src, extract } of CLUSTER_PEAKS) {
  if (!existsSync(src)) {
    console.error(`  ✖ missing source: ${src}`);
    process.exitCode = 1;
    continue;
  }
  const outDir = join(repoRoot, "public", "media", "home", family, "cluster");
  await mkdir(outDir, { recursive: true });
  const base = sharp(src).rotate().extract(extract).resize({ width: CLUSTER_W, height: CLUSTER_H, withoutEnlargement: true });
  const avifOut = join(outDir, "peak.avif");
  const webpOut = join(outDir, "peak.webp");
  await base.clone().avif(AVIF).toFile(avifOut);
  await base.clone().webp(WEBP).toFile(webpOut);
  const bytes = statSync(avifOut).size + statSync(webpOut).size;
  clusterBytes += bytes;
  console.log(`  ✓ ${family}/cluster/peak  ${CLUSTER_W}×${CLUSTER_H}  ${(bytes / 1024).toFixed(0)}KB`);
}
console.log(`  ── cluster total: ${(clusterBytes / 1024 / 1024).toFixed(2)}MB`);
grand += clusterBytes;

console.log(`\n✓ all lanes: ${(grand / 1024 / 1024).toFixed(2)}MB added\n`);
