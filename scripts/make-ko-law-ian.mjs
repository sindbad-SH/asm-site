#!/usr/bin/env node
/**
 * make-ko-law-ian.mjs — bake the named-teacher chapter assets for the
 * /venture/ko-law-workshops upgrade (Build #5, archive-mining integration,
 * 2026-08-01).
 *
 * ⚠⚠ DOUBLE-GATED — read before running/shipping ⚠⚠
 * This is the first ASM piece to name Ian Kuliasha by name and firm role.
 * Per _INTEGRATION-PLAN.md §1.5 and §2, this chapter needs BOTH (1) the
 * operator's own read-approval (same as every other row in this round) AND
 * (2) a courtesy heads-up to Ian himself before it goes anywhere public.
 * Neither has happened. This script and the page it feeds are built to
 * STAGING only (matching every other build this round) — the named-teacher
 * copy carries an explicit [pending courtesy heads-up to Ian Kuliasha] flag
 * in consts.ts and the copy deck. Do not treat "it's built" as "it's
 * approved."
 *
 * Source: the operator's own dated session zips at
 * E:/Pitch Boulder/Ian KO law/<date> Ian KO Law/Photos/Photos-2-001*.zip.
 * Extracts only the specific frames needed (via the system `unzip`, no
 * bulk-extract) into a scratch dir, then bakes 900w+1600w avif+webp — same
 * convention as every other archive-mining bake script this round.
 *
 * COLLISION-MAP DROP: `whiteboard-open` is a confirmed collision (same/
 * adjacent frame as the live venture/ko-law-workshops/boardroom-1600) — cut
 * entirely. `boulder-office-wide` is only a near-crop of that same live
 * image (a different exact moment); kept per the map's own permissive
 * guidance ("keeping at most one of the two wide-room picks, or neither").
 */
import sharp from "sharp";
import { mkdir, rm } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const ZIP_ROOT = "E:/Pitch Boulder/Ian KO law";
const WIDTHS = [900, 1600];
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };

// slug -> { zip (relative to ZIP_ROOT), file (name inside the zip) }
const PICKS = {
  "hero-team-launch": { zip: "6-25-2026 Ian KO Law/Photos/Photos-2-001 (1).zip", file: "20260625_121059.jpg" },
  "audience-classification": { zip: "6-25-2026 Ian KO Law/Photos/Photos-2-001 (1).zip", file: "20260625_123153.jpg" },
  "formation-gesture": { zip: "4-30-2026 Ian KO Law/Photos/Photos-2-001.zip", file: "20260430_091423.jpg" },
  "boulder-office-wide": { zip: "4-30-2026 Ian KO Law/Photos/Photos-2-001.zip", file: "20260430_091357.jpg" },
  "lifecycle-screen": { zip: "2-26-2026 Ian KO Law/Photos/Photos-2-001 (1).zip", file: "20260226_100512.jpg" },
  "next-workshop": { zip: "4-30-2026 Ian KO Law/Photos/Photos-2-001.zip", file: "20260430_103643.jpg" },
};

const repoRoot = process.cwd();
const outDir = join(repoRoot, "public", "media", "venture", "ko-law-workshops");
const scratchDir = join(repoRoot, ".ko-law-ian-scratch");

async function exportOne(srcPath, slug) {
  const meta = await sharp(srcPath).rotate().metadata();
  let bytes = 0;
  for (const w of WIDTHS) {
    const base = sharp(srcPath).rotate().resize({ width: w, withoutEnlargement: true });
    const avifOut = join(outDir, `ian-${slug}-${w}.avif`);
    const webpOut = join(outDir, `ian-${slug}-${w}.webp`);
    await base.clone().avif(AVIF).toFile(avifOut);
    await base.clone().webp(WEBP).toFile(webpOut);
    bytes += statSync(avifOut).size + statSync(webpOut).size;
  }
  return { width: meta.width, height: meta.height, bytes };
}

await mkdir(outDir, { recursive: true });
await mkdir(scratchDir, { recursive: true });
console.log(`\n▸ ko-law-workshops "the teacher" chapter → public/media/venture/ko-law-workshops/ (ian-* slugs)`);
let total = 0;
for (const [slug, { zip, file }] of Object.entries(PICKS)) {
  const zipPath = join(ZIP_ROOT, zip);
  if (!existsSync(zipPath)) {
    console.error(`  ✖ missing zip: ${zipPath}`);
    process.exitCode = 1;
    continue;
  }
  execFileSync("unzip", ["-o", "-j", zipPath, file, "-d", scratchDir], { stdio: "pipe" });
  const srcPath = join(scratchDir, file);
  if (!existsSync(srcPath)) {
    console.error(`  ✖ ${file} not found in ${zip}`);
    process.exitCode = 1;
    continue;
  }
  const { width, height, bytes } = await exportOne(srcPath, slug);
  total += bytes;
  console.log(`  ✓ ian-${slug.padEnd(24)} ${String(width)}×${height}  ${(bytes / 1024).toFixed(0)}KB`);
}
await rm(scratchDir, { recursive: true, force: true });
console.log(`  ── total: ${(total / 1024 / 1024).toFixed(2)}MB\n`);
