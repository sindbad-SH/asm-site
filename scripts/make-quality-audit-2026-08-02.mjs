#!/usr/bin/env node
/**
 * make-quality-audit-2026-08-02.mjs — VENTURE/WORK photo-quality audit swaps.
 * Same convention as make-venture-story.mjs: EXIF auto-orient, 900w+1600w,
 * AVIF q50 + WebP q72, downscale-only. In-place replacement of an existing
 * baked slug (same filename, same directory) — no page-code change needed
 * beyond what's already wired to that slug.
 *
 * Two genuine-failure swaps found while validating the VENTURE/WORK side
 * against the operator's photo-quality standard:
 *
 * 1. venture/seriesfest-2026 "step-and-repeat" — the live pick
 *    (20260508_220034.jpg) is the operator himself posed solo at the
 *    SeriesFest step-and-repeat wall (confirmed against the reference photo:
 *    long dark hair, dark bandana, sunglasses on head, short beard). Site
 *    rule: the operator must not appear. Swapped for 20260506_181412.jpg —
 *    tier 1, sharper (919 vs the flagged frame's own burst), three
 *    attendees at the "Thank You To Our Sponsors" wall, no operator.
 *
 * 2. venture/afm-2025 "step-and-repeat" — the live pick
 *    (20251112_213413.jpg) is dominated by a third-party film's one-sheet
 *    ("Storm Rider: Legend of Hammerhead", full title/tagline/URL legible,
 *    ~1/3 of the frame) propped in an AFM lounge. Site rule: no frames
 *    dominated by a third-party movie poster. Swapped for 20251112_213308.jpg
 *    — tier 1, the actual AFM/Marché du Film branded step-and-repeat wall
 *    ("Hollywood Film & TV Mixer" sponsor-logo wall, press + step-and-repeat
 *    in frame), no competing poster.
 *
 * Plus one RE-GRADE-class fix (still a frame-pick problem, not exposure):
 *
 * 3. work/gigs-go-green "still-graphic" — make-archive-media.mjs's own header
 *    documents this slot as "the isometric solar co-op graphic," but the
 *    baked frame (@10s) actually landed mid-caption-transition on the
 *    interviewee: a close-up talking-head with a garbled, cut-off lower-third
 *    ("Jaso… nksl"). The real isometric graphic the comment describes runs
 *    ~12–14s later in the same source; re-grabbed at 13.0s (full parking-lot
 *    graphic — panels, EVs, wind turbines, the co-op's people icons — clean,
 *    no mid-transition artifact).
 */
import sharp from "sharp";
import { existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

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

const SWAPS = [
  {
    label: "seriesfest-2026 / step-and-repeat (operator appears — hard rule)",
    src: "E:/Old Projects/Series Fest/2026 Photos-20260222T213731Z-1-001/2026 Photos/Series Fest 2026 - Festival/_TIER 1 - TOP (make stories)/20260506_181412.jpg",
    outDir: join(repoRoot, "public", "media", "venture", "seriesfest-2026"),
    slug: "step-and-repeat",
  },
  {
    label: "afm-2025 / step-and-repeat (third-party movie poster dominates frame)",
    src: "E:/Old Projects/American Film Market/Photos/American Film Market 2025/_TIER 1 - TOP (make stories)/20251112_213308.jpg",
    outDir: join(repoRoot, "public", "media", "venture", "afm-2025"),
    slug: "step-and-repeat",
  },
];

console.log("\n▸ quality-audit-2026-08-02 swaps");
for (const { label, src, outDir, slug } of SWAPS) {
  if (!existsSync(src)) {
    console.error(`  ✖ missing source for ${label}: ${src}`);
    process.exitCode = 1;
    continue;
  }
  const { width, height, bytes } = await exportOne(src, outDir, slug);
  console.log(`  ✓ ${label}\n      ${slug} ← ${src.split("/").pop()}  ${width}×${height}  ${(bytes / 1024).toFixed(0)}KB`);
}

// ── gigs-go-green still-graphic re-grab (single-size, matches make-archive-
// media.mjs's own stillFromVideo convention: width 1600, no 900w pair) ──
const HEROX = "E:/Old Projects/Gigs go green/Hero X Solar/Compotition video/Onchain Energy Network Solar Prize Round 8 video 1.mp4";
const gggOut = join(repoRoot, "public", "media", "work", "gigs-go-green", "still-graphic");
if (existsSync(HEROX)) {
  const framePng = join(repoRoot, ".tmp-ggg-still-graphic.png");
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-ss", "13.0", "-i", HEROX, "-frames:v", "1", framePng], { stdio: "inherit" });
  const img = sharp(framePng).rotate().resize({ width: 1600, withoutEnlargement: true });
  await img.clone().avif(AVIF).toFile(`${gggOut}.avif`);
  await img.clone().webp(WEBP).toFile(`${gggOut}.webp`);
  const kb = (statSync(`${gggOut}.avif`).size + statSync(`${gggOut}.webp`).size) / 1024;
  const { unlinkSync } = await import("node:fs");
  unlinkSync(framePng);
  console.log(`  ✓ gigs-go-green / still-graphic (isometric graphic, was a garbled-caption talking-head frame)\n      still-graphic ← @13.0s  ${kb.toFixed(0)}KB`);
} else {
  console.error(`  ✖ missing source for gigs-go-green still-graphic: ${HEROX}`);
  process.exitCode = 1;
}

console.log("");
