#!/usr/bin/env node
/**
 * make-home-refresh-2026-08-04.mjs — homepage tableaux photo refresh.
 *
 * Three swaps, chosen against the FULL tiered pools (contact-sheet review of
 * PitchBoulder Top-Picks T1 [22], the 1-28-2026 Sony edited set, and the
 * SeriesFest 2026 Festival T1 [72] — a pool the home page had never drawn from):
 *
 * 1. market/peak — was a single presenter mid-gesture under exposed ceiling
 *    ducts (phone frame, awkward top crop). Now the Sony DSC08301 wide: the
 *    PitchBoulder room PACKED (~40 attendees, presenters on screen right) —
 *    the one frame in the archive that actually shows "the market" as a room
 *    full of founders. Also used in the /venture collage; accepted — home is
 *    the funnel and this is the archive's strongest room shot.
 *
 * 2. industry/lake — was a posed sponsor-wall step-and-repeat three-shot
 *    (photo-op, not coverage). Now SF 2026 Soirée: performer + pianist under
 *    the colorful SOIRÉE screen — atmosphere, not a pose. Unused elsewhere.
 *
 * 3. industry/ridge — was a SECOND AFM blue-backdrop panel, near-identical to
 *    `peak` beside it (flagged when valley was fixed on 2026-08-03). Now the
 *    SF 2026 Pitch-A-Thon Roadshow panel inside a BOOKSTORE — a completely
 *    different venue texture (shelves, rug, warm light). Unused elsewhere.
 *
 * Encoding matches make-industry-valley-fix.mjs (avif q50 / webp q72, effort
 * 5); width 1050, native aspect preserved — TableauCluster reads each shot's
 * true ratio at build time (P12.6), so no forced box.
 */
import sharp from "sharp";
import { statSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const JOBS = [
  {
    src: "E:/Pitch Boulder/2026 Recordings/1-28-2026/Photos/Edited/_TIER 2 - GOOD/DSC08301.jpg",
    out: ["market", "peak"],
  },
  {
    src: "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Festival/_TIER 1 - TOP (make stories)/20260508_200611.jpg",
    out: ["industry", "lake"],
  },
  {
    src: "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Festival/_TIER 1 - TOP (make stories)/20260510_140652(1)(1).jpg",
    out: ["industry", "ridge"],
  },
];

for (const { src, out: [slug, id] } of JOBS) {
  const dir = join(repoRoot, "public", "media", "home", slug, "cluster");
  const base = sharp(src).rotate().resize({ width: 1050, withoutEnlargement: true });
  const avifOut = join(dir, `${id}.avif`);
  const webpOut = join(dir, `${id}.webp`);
  await base.clone().avif({ quality: 50, effort: 5 }).toFile(avifOut);
  await base.clone().webp({ quality: 72, effort: 5 }).toFile(webpOut);
  const kb = ((statSync(avifOut).size + statSync(webpOut).size) / 1024).toFixed(0);
  console.log(`✓ ${slug}/cluster/${id}  ${kb}KB`);
}
