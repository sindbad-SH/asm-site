#!/usr/bin/env node
/**
 * make-home-diversity-2026-08-13.mjs — homepage tableaux: one region per shot.
 *
 * OPERATOR (2026-08-13): "some of the photos are basic — like the American Film
 * Market photo at the bottom left, it's pretty boring, use the better one,
 * better centered. There's also now too many photos of Boulder — at least
 * three — and two of the Matterhorn. I almost at this point want one photo from
 * each region or space... make sure the photos are centered well, optimized to
 * the proportions."
 *
 * MEASURED STATE BEFORE (contact-sheet review of all 12 cluster shots):
 *   wild     — Zermatt town (peak), Gorner glacier (valley), Lac de Tseuzier
 *              dam (lake), Gornergrat (ridge) + the Matterhorn video loop:
 *              FOUR Zermatt-area visuals counting the loop.
 *   market   — PitchBoulder room (peak) + THREE Boulder aerials, two of them
 *              near-identical downtown frames (valley, lake, ridge).
 *   industry — a wide flat AFM audience shot (peak) + three distinct SF venues.
 *
 * AFTER — every slot a different region/space:
 *   wild     — Matterhorn loop (Zermatt, kept) · Brenta Dolomites 9:16 (peak)
 *              · Twin Lakes, CO high country (valley) · Lac de Tseuzier,
 *              Valais (lake, UNTOUCHED — only Valais shot) · Castel Toblino,
 *              Valle dei Laghi 4:5 (ridge). The three Zermatt stills retire.
 *   market   — PitchBoulder room (kept) · Boulder canyon mouth (kept — THE one
 *              Boulder aerial) · Longmont Main Street running at the Front
 *              Range (lake) · Pelican Lakes, Windsor (ridge). Boulder aerials
 *              3 → 1.
 *   industry — AFM 20251112_111104 (peak): the close four-person panel with
 *              the AFM mark dead-centre above them, replacing the distant
 *              audience-view frame. Other three slots untouched (rebuilt
 *              2026-08-04, three distinct venues).
 *
 * The wild stills come from public/media/adventure/covers/ — the UNMARKED
 * field-note heroes the operator has already approved, so the grade is a
 * settled question and home stays consistent with the notes it links to.
 * TableauCluster reads each file's true ratio at build (P12.6), so mixed
 * aspects are by design: no forced box, no crop beyond the source's own.
 *
 * Encoding matches make-home-refresh-2026-08-04.mjs: width 1050 (no enlarge),
 * native aspect, avif q50 / webp q72, effort 5.
 *
 * NOTE: stop the dev server first (Windows file locks on served media).
 *
 * RUN: node scripts/make-home-diversity-2026-08-13.mjs
 */
import sharp from "sharp";
import { statSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const COVERS = join(repoRoot, "public", "media", "adventure", "covers");

const JOBS = [
  // wild — regions instead of four Zermatts
  { src: join(COVERS, "madonna-di-campiglio-01-1600.webp"), out: ["wild", "peak"] },
  { src: join(COVERS, "twin-lakes-01-2200.webp"), out: ["wild", "valley"] },
  { src: join(COVERS, "castel-toblino-01-1600.webp"), out: ["wild", "ridge"] },
  // market — Boulder aerials 3 → 1
  { src: "E:/Amazing Ariel/_Upload/2026-07-31 - Longmont/01 AA-STOCK (JPEG)/Downtown/Longmont Downtown 09.jpg", out: ["market", "lake"] },
  { src: "E:/Amazing Ariel/_Upload/2026-07-31 - Pelican Lakes Point Windsor/01 AA-STOCK (JPEG)/Lakes and Golf/Pelican Lakes Point Windsor Lakes and Golf 01.jpg", out: ["market", "ridge"] },
  // industry — the better AFM frame
  { src: "E:/Old Projects/American Film Market/Photos/American Film Market 2025/_TIER 1 - TOP (make stories)/20251112_111104.jpg", out: ["industry", "peak"] },
];

for (const { src, out: [slug, id] } of JOBS) {
  const dir = join(repoRoot, "public", "media", "home", slug, "cluster");
  const base = sharp(src).rotate().resize({ width: 1050, withoutEnlargement: true });
  const avifOut = join(dir, `${id}.avif`);
  const webpOut = join(dir, `${id}.webp`);
  await base.clone().avif({ quality: 50, effort: 5 }).toFile(avifOut);
  await base.clone().webp({ quality: 72, effort: 5 }).toFile(webpOut);
  const m = await sharp(webpOut).metadata();
  const kb = ((statSync(avifOut).size + statSync(webpOut).size) / 1024).toFixed(0);
  console.log(`  ${slug}/cluster/${id}  ${m.width}x${m.height}  ${kb}KB`);
}
console.log(`${JOBS.length} slots rewritten; wild/lake (Tseuzier) and the SF trio untouched.`);
