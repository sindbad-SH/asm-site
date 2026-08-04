#!/usr/bin/env node
/**
 * make-seriesfest-operator-picks-2026-08-04.mjs
 *
 * The operator named two photos he wants leading the SeriesFest material —
 * "personally I think this is a better photo for both the button and any other
 * hero moments" — by pointing at the LinkedIn-archive copies:
 *   E:\_LINKEDIN-ARCHIVE\seriesfest\2026-05-07-s12-opening-night\img-01.jpg
 *   E:\_LINKEDIN-ARCHIVE\seriesfest\2026-02-24-soul-power-aba\img-01.jpg
 *
 * Both of those are 800x800 LinkedIn DISPLAY images. Per the standing rule
 * (LinkedIn archive = selection source, never pixels) each was matched back to
 * its full-res original by capture-date + visual comparison against a contact
 * sheet of every candidate in that day's burst:
 *
 *   opening night  post 2026-05-07 -> capture 2026-05-06, Festival pool.
 *     Candidates 20260506_191513..191556 rendered and compared; the operator's
 *     frame is 191551 (six-person lineup, full bodies, camera in the lower-left
 *     corner). 10032x10032 native — a 12.5x uplift on the 800px copy.
 *
 *   soul power     post 2026-02-24 -> capture 2026-02-18, Soul Power pool.
 *     Candidates 181655 / 181657 / 181702 compared; the operator's frame is
 *     181657 (the ABA lineup with two basketballs, the right-hand figure turned
 *     in). 12240x12240 native — a 15x uplift.
 *
 * SCREENING NOTE: both are posed step-and-repeat group photos, which the
 * 2026-08-02 automated pass excluded by rule. That exclusion was overridden by
 * the operator on 2026-08-03 ("posed red-carpet = fine as editorial coverage",
 * see the auto-content-people-and-source-rules scoping) and these two are now
 * additionally chosen BY NAME. Nothing here is auto-selected.
 *
 * Same convention as every other make-*.mjs: EXIF auto-orient, 900w + 1600w,
 * AVIF q50 + WebP q72, downscale-only.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SF = "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos";
const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

const JOBS = [
  {
    src: `${SF}/Series Fest 2026 - Festival/_TIER 3 - MAYBE/20260506_191551.jpg`,
    outDir: ["public", "media", "venture", "seriesfest-2026"],
    slug: "opening-night-red-carpet",
  },
  {
    src: `${SF}/Series Fest 2026 - Soul Power ABA Premiere/_TIER 2 - GOOD/20260218_181657.jpg`,
    outDir: ["public", "media", "venture", "seriesfest-2026-soul-power"],
    slug: "red-carpet-aba-lineup",
  },
  // The same two faces also drive cards on /venture and the SeriesFest hub,
  // which read from public/media/venture/seriesfest/.
  {
    src: `${SF}/Series Fest 2026 - Festival/_TIER 3 - MAYBE/20260506_191551.jpg`,
    outDir: ["public", "media", "venture", "seriesfest"],
    slug: "opening-night-red-carpet",
  },
  {
    src: `${SF}/Series Fest 2026 - Soul Power ABA Premiere/_TIER 2 - GOOD/20260218_181657.jpg`,
    outDir: ["public", "media", "venture", "seriesfest"],
    slug: "soulpower-red-carpet-aba",
  },
];

const repoRoot = process.cwd();
let total = 0;
for (const { src, outDir, slug } of JOBS) {
  if (!existsSync(src)) {
    console.error(`  ✖ missing source: ${src}`);
    process.exitCode = 1;
    continue;
  }
  const dir = join(repoRoot, ...outDir);
  await mkdir(dir, { recursive: true });
  const meta = await sharp(src).rotate().metadata();
  let bytes = 0;
  for (const w of WIDTHS) {
    const base = sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
    const a = join(dir, `${slug}-${w}.avif`);
    const b = join(dir, `${slug}-${w}.webp`);
    await base.clone().avif(AVIF).toFile(a);
    await base.clone().webp(WEBP).toFile(b);
    bytes += statSync(a).size + statSync(b).size;
  }
  total += bytes;
  console.log(`  ✓ ${outDir.slice(3).join("/")}/${slug.padEnd(26)} ${meta.width}×${meta.height}  ${(bytes / 1024).toFixed(0)}KB`);
}
console.log(`\n  ── total: ${(total / 1024 / 1024).toFixed(2)}MB\n`);
