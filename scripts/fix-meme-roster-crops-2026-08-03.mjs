#!/usr/bin/env node
/**
 * fix-meme-roster-crops-2026-08-03.mjs — meme-stickler-2026-08-03
 *
 * Operator stickler-round verdict #1 on /venture/meme: "Amber and Eric's
 * photos aren't really focused well — they cut off a good chunk of their
 * head." Confirmed by direct viewing of the shipped crops:
 *   - amber-macpherson-portrait-700: the extract box in make-meme-evergreen.mjs
 *     (left:30, top:78, width:422, height:422) clips the crown of her hair —
 *     the top of the crop lands mid-hair, not above it.
 *   - eric-abramson-portrait-700: the extract box (left:10, top:560,
 *     width:780, height:780) is centered on his chin, cutting it off at the
 *     bottom, with the frame wall-to-wall on his face (no headroom at all).
 * Per the operator's instruction, this pass also VIEWED nick/adam/steve and
 * checked all five against one standard: full head + breathing room +
 * consistent eye-line. Findings (measured via the live CSS crop — the roster
 * card is `aspect-ratio:1/1; object-fit:cover`, so what matters is the
 * CENTER-CROPPED SQUARE of whatever ships, not the raw file):
 *   - adam-smestad-portrait-620 and steve-borne-portrait-854 both already
 *     pass — verified by simulating the exact center-crop-to-square the
 *     browser performs. Left untouched (no bake change).
 *   - nick-goins-portrait-640 FAILS, and not from our crop: the source file
 *     "Nick Goins Headshot.jpg" (640x480) has his flat cap touching the very
 *     top row of the native photo (pixel-verified — brightness of the cap
 *     region is already elevated at y=0; there is no headroom above it to
 *     recover by cropping differently, only by fabricating pixels, which
 *     this pipeline doesn't do). A second, unused Nick photo already sits in
 *     the same cleared source folder — "Nick Goins Yelp Headshot.jpg"
 *     (2476x2720, a personal/business headshot, not the AFM market-photo
 *     that's excluded for rights reasons) — with real headroom, a clean
 *     square-croppable composition, and a much higher native resolution.
 *     Swapped to that source rather than shipping a photo that can't meet
 *     the standard. ⚠ OPERATOR READ-APPROVAL REQUIRED — this changes which
 *     photo of Nick ships (different hat color/style, white shirt vs black
 *     t-shirt in the other roster shots); everything else about his bio/role
 *     is unchanged. Revert to nick-goins-portrait-640 (already in git
 *     history) if he'd rather keep the plaid cap photo despite the tight
 *     crop.
 *
 * All three crops below are baked as an exact SQUARE via sharp .extract() —
 * not left to the live CSS object-fit:cover to center-crop from a
 * non-square bake — so what ships is exactly what was viewed and approved
 * here, with no dependency on the browser's auto-crop math.
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = join(process.cwd(), "public", "media", "venture", "meme");
const PHOTOS_ROOT = String.raw`E:\Makeshift\MEME\05 - Source Docs from MEME\Photos`;
const AVIF = { quality: 55, effort: 5 };
const WEBP = { quality: 82 };

async function bake(srcFile, box, outSlug, targetWidth) {
  const srcPath = join(PHOTOS_ROOT, srcFile);
  if (!existsSync(srcPath)) {
    console.error(`  ✖ missing source: ${srcPath}`);
    process.exitCode = 1;
    return;
  }
  const base = sharp(srcPath).rotate().extract(box).resize({ width: targetWidth });
  await base.clone().avif(AVIF).toFile(join(OUT_DIR, `${outSlug}.avif`));
  await base.clone().webp(WEBP).toFile(join(OUT_DIR, `${outSlug}.webp`));
  console.log(`  ✓ ${outSlug} ← ${srcFile} extract(${box.left},${box.top},${box.width}x${box.height}) → ${targetWidth}w`);
}

console.log(`\n▸ meme roster recrops (stickler round, 2026-08-03) → public/media/venture/meme/`);

// Amber MacPherson — recrop starts BELOW the "April O'Hare Photography"
// watermark band (pixel-scanned: watermark brightness drops to baseline by
// y≈44) with the full crown of her hair inside the frame (hair first
// appears ≈y55-60; top=48 clears the watermark and still keeps the crown's
// topmost wisps in-frame — verified by direct crop preview).
await bake("Amber MacPherson Color Headshot.jpg", { left: 40, top: 48, width: 420, height: 420 }, "amber-macpherson-portrait-700", 700);

// Eric Abramson — wider crop: cap top (with headroom) through chin plus a
// little collar/shoulder. Right edge held at x=820 — pixel-checked against
// the source: his own headphone earcup ends ≈x830, and the background
// interview subject / camera monitor start at ≈x830-850, so 820 is the
// widest safe square that still fully excludes the other person and every
// on-screen monitor showing him. (This is why "some chest" reads as modest
// here rather than a full torso: the source's own geometry — his face fills
// most of the frame at close range, with the interview setup crowding the
// right side — caps how wide a person-free square can get. Chin and full
// cap are the confirmed complaint and both are fully in-frame now.)
await bake("Eric Abramson.jpg", { left: 0, top: 640, width: 820, height: 820 }, "eric-abramson-portrait-700", 700);

// Nick C. Goins Jr — SWAPPED source (see header note): the plaid flat-cap
// photo has zero headroom in the native file. This crop uses the Yelp
// headshot instead — hat top at native y≈280, crop top=150 gives ~130px of
// headroom, bottom=2100 carries chin plus a visible white shirt collar.
await bake("Nick Goins Yelp Headshot.jpg", { left: 225, top: 150, width: 1950, height: 1950 }, "nick-goins-portrait-640", 640);

console.log("");
