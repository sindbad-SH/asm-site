#!/usr/bin/env node
/**
 * make-clean-covers-2026-08-13.mjs — unmarked LEAD photos for the field-note heroes.
 *
 * OPERATOR REPORT (2026-08-12), on /field-notes/bellagio:
 *   "the hero photo — the first photo you see whenever you click on any of the
 *    relevant sections — saying amazing aerial in the center is irrelevant... I
 *    like the overall layout with field notes in the top left corner and amazing
 *    aerial in the top right and the descriptions in the bottom left, but the
 *    dead center amazing aerial logo for that specific image I'm not a fan of."
 *
 * SCOPE — the HERO only. Both marks are BURNED INTO the gallery exports by
 * make-adventure-frame.mjs (AA wordmark centred at 0.47*W, ASM monogram
 * bottom-right at 0.073*W). The cover and the small thumbnails currently read
 * the SAME files, so the mark cannot be removed from one without the other.
 * This script therefore writes a SECOND, UNMARKED ladder to a new directory;
 * [slug].astro points only the cover at it. Every thumbnail, the dispatch
 * squares on /adventure, and all supporting photos keep the marked gallery
 * files untouched. The clickable AA credit chip stays on the cover.
 *
 * TWO RECOVERY MODES, both lossless-or-better than what ships today:
 *
 *   git   — madonna-di-campiglio-01, matterhorn-zermatt-01. These shipped
 *           UNMARKED until 8c0d373 composited marks on (2026-08-08), so the
 *           parent commit holds the exact frame, exact grade, exact dimensions,
 *           full ladder, avif+webp. Copied out as BYTES: zero re-encode, one
 *           FEWER lossy generation than the marked files now on disk.
 *
 *   bake  — bellagio-01, crans-montana-01, lac-de-tseuzier-02, lugano-01,
 *           varenna-lake-como-01. Re-run make-adventure-frame.mjs's exact
 *           pipeline (rotate -> optional extract -> cover-resize at the same
 *           position -> same AVIF/WEBP encoders) from the full-resolution
 *           archive originals, MINUS the watermark() step. Same crop, same
 *           grade, higher-fidelity start (3000-5333px sources).
 *
 * NOT HANDLED HERE — four leads with no clean same-pixel master; they keep the
 * marked file until their recovery is decided (the site falls back per-slug):
 *   · eldorado-springs-01, flatirons-chautauqua-03 — unmarked masters exist at
 *     858d10e but at 4:3, and the shipped 3:2 is a centre-crop landing on a
 *     HALF-pixel boundary (true centre 91.5px), so a re-crop cannot be exact.
 *   · gornergrat-glacier-01 — unmarked at 04de1a3 at the exact crop and dims,
 *     but carrying the older, flatter, cooler pre-02f1784 grade.
 *   · castel-toblino-01 — no unmarked still anywhere; recoverable only by
 *     re-extracting from _Drone video/...Madruzzo/Videos/DJI_0187.MP4 (~16s).
 *
 * SOURCE PATH FIX: lac-de-tseuzier-02's archive path gained a `_Drone photos/`
 * level when the AA archive was reorganised. PICKS still holds the old path;
 * the corrected one is used below. (4 non-lead picks have the same breakage.)
 *
 * Reads the archive read-only. Writes ONLY to public/media/adventure/covers/.
 *
 * RUN: node scripts/make-clean-covers-2026-08-13.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const SRC_ROOT = "E:/Amazing Ariel/Old adventure photos and footage from 2022 to 2023";
const REPO = process.cwd();
const OUT_DIR = join(REPO, "public", "media", "adventure", "covers");

// Identical to make-adventure-frame.mjs — the cover must encode like the gallery.
const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };
const ORIENT = {
  landscape: { aspect: 3 / 2, widths: [800, 1400, 2200] },
  vertical: { aspect: 4 / 5, widths: [800, 1120, 1600] },
  reel: { aspect: 9 / 16, widths: [800, 1120, 1600] },
};

/** git mode — the pre-watermark blob IS the master. Copied byte-for-byte. */
const FROM_GIT = {
  "madonna-di-campiglio-01": { commit: "8c0d373^", widths: [800, 1120, 1600] },
  "matterhorn-zermatt-01": { commit: "8c0d373^", widths: [800, 1120, 1600] },
};

/** bake mode — PICKS entries verbatim, except the noted path repair. */
const FROM_SOURCE = {
  "bellagio-01": {
    src: "2023-08-20 - Italy - Bellagio/Photos/AA_Tier2_Alternates/20230820_131518.jpg",
    orientation: "landscape",
    extract: { left: 0, top: 780, width: 3000, height: 2000 },
  },
  "crans-montana-01": {
    src: "2023-08-11 - Switzerland - Lens/Photos/AA_Tier2_Alternates/20230811_103337.jpg",
    orientation: "landscape",
    extract: { left: 1150, top: 150, width: 2850, height: 2700 },
    position: "centre",
  },
  "lac-de-tseuzier-02": {
    // PATH REPAIRED: archive gained a `_Drone photos/` level after PICKS was written.
    src: "_Drone photos/2023-08-11 - Switzerland - Ayent/Photos/Drone/DJI_0038.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "lugano-01": {
    src: "2023-08-16 - Switzerland - Lugano/Photos/AA_Tier2_Alternates/20230816_203147.jpg",
    orientation: "landscape",
    position: "centre",
  },
  "varenna-lake-como-01": {
    src: "2023-08-20 - Italy - Varenna/Photos/AA_Tier2_Alternates/20230820_103127.jpg",
    orientation: "landscape",
    extract: { left: 0, top: 500, width: 2750, height: 1833 },
    position: "centre",
  },
};

await mkdir(OUT_DIR, { recursive: true });
const manifest = [];

for (const [slug, { commit, widths }] of Object.entries(FROM_GIT)) {
  let bytes = 0;
  for (const w of widths) {
    for (const ext of ["avif", "webp"]) {
      const rel = `public/media/adventure/gallery/${slug}-${w}.${ext}`;
      const out = join(OUT_DIR, `${slug}-${w}.${ext}`);
      // -- binary-safe: buffer, never a string round-trip.
      const buf = execFileSync("git", ["show", `${commit}:${rel}`], { maxBuffer: 1 << 28 });
      writeFileSync(out, buf);
      bytes += buf.length;
    }
  }
  const m = await sharp(join(OUT_DIR, `${slug}-${widths.at(-1)}.webp`)).metadata();
  console.log(`  git   ${slug.padEnd(26)} ${m.width}x${m.height}  ${(bytes / 1024).toFixed(0)}KB`);
  manifest.push({ slug, mode: "git", dims: `${m.width}x${m.height}`, widths });
}

for (const [slug, pick] of Object.entries(FROM_SOURCE)) {
  const srcPath = join(SRC_ROOT, pick.src);
  if (!existsSync(srcPath)) {
    console.error(`  MISSING SOURCE  ${slug}  ->  ${pick.src}`);
    process.exitCode = 1;
    continue;
  }
  const { aspect, widths } = ORIENT[pick.orientation];
  let img = sharp(srcPath).rotate();
  if (pick.extract) img = img.extract(pick.extract);
  const src = await img.toBuffer();
  const position = pick.position ?? "attention";

  let bytes = 0;
  for (const w of widths) {
    const h = Math.round(w / aspect);
    // NOTE: no watermark() call. That is the entire difference from the baker.
    const base = sharp(await sharp(src).resize({ width: w, height: h, fit: "cover", position }).toBuffer());
    const avifOut = join(OUT_DIR, `${slug}-${w}.avif`);
    const webpOut = join(OUT_DIR, `${slug}-${w}.webp`);
    await base.clone().avif(AVIF).toFile(avifOut);
    await base.clone().webp(WEBP).toFile(webpOut);
    bytes += statSync(avifOut).size + statSync(webpOut).size;
  }
  const h = Math.round(widths.at(-1) / aspect);
  console.log(`  bake  ${slug.padEnd(26)} ${widths.at(-1)}x${h}  ${(bytes / 1024).toFixed(0)}KB`);
  manifest.push({ slug, mode: "bake", dims: `${widths.at(-1)}x${h}`, widths });
}

console.log(`\n${manifest.length} clean covers -> ${OUT_DIR}`);
