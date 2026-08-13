#!/usr/bin/env node
/**
 * fix-varenna-02-2026-08-13.mjs — replace the second Varenna frame.
 *
 * Operator, 2026-08-12: "on this page I would replace the photo right above the
 * 'Across the lake the far shore climbs into the horizon' section, 'cause it's
 * pretty close to the photo just below it to the left, only it also has like
 * some street stuff and it's just kinda not great."
 *
 * That is varenna-lake-como-02 (source 20230820_103732). Two faults, both real:
 *   · a road, a streetlight and a guardrail run across its lower right;
 *   · it is the same picture as varenna-lake-como-03 (20230820_104419) — both
 *     look west across the lake through foreground cypresses, from the same
 *     shore within seven minutes of each other.
 *
 * REPLACEMENT: 20230820_120443, shot from the ferry. It is the only frame in
 * the outing that looks BACK at Varenna from the water — the village stacked
 * along the shore under the wooded face, ferry at the left edge, campanile
 * showing. So it fixes the duplication by changing the vantage rather than
 * swapping one shore view for another, and it is the frame that actually shows
 * what the note's headline ("A village stacked on the deep") and its opening
 * paragraph describe.
 *
 * Ground-level, like every supporting frame on this note; the aerial-first rule
 * puts ground photos in the filler slot, which is what 02-04 already are.
 *
 * Marked ladder only — 02 is a supporting frame, and covers/ holds heroes.
 *
 * NOTE: stop the Astro dev server before running. It holds open handles on
 * files under public/, and overwriting a served export fails on Windows with
 * "Invalid argument".
 *
 * RUN: node scripts/fix-varenna-02-2026-08-13.mjs
 */
import sharp from "sharp";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = "E:/Amazing Ariel/Old adventure photos and footage from 2022 to 2023/2023-08-20 - Italy - Perledo/Photos/AA_Tier2_Alternates/20230820_120443.jpg";
const REPO = process.cwd();
const GALLERY = join(REPO, "public", "media", "adventure", "gallery");
const AA_LOGO = join(REPO, "src", "assets", "aa-logo-white.png");
const ASM_LOGO = join(REPO, "public", "logo-mark.png");

const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };
const WIDTHS = [800, 1400, 2200];
const ASPECT = 3 / 2;
const WM = { aaWidthFrac: 0.47, aaOpacity: 0.82, asmWidthFrac: 0.073, asmOpacity: 0.9, asmInsetFrac: 0.03 };

async function buildMark(logoPath, targetW, opacity) {
  const { data, info } = await sharp(logoPath)
    .resize({ width: Math.round(targetW) }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
    data[i + 3] = Math.round(data[i + 3] * opacity);
  }
  return {
    buffer: await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer(),
    width: info.width, height: info.height,
  };
}

if (!existsSync(SRC)) {
  console.error(`missing source: ${SRC}`);
  process.exit(1);
}

const src = await sharp(SRC).rotate().toBuffer();
let bytes = 0;
for (const w of WIDTHS) {
  const h = Math.round(w / ASPECT);
  const base = await sharp(src).resize({ width: w, height: h, fit: "cover", position: "centre" }).toBuffer();
  const aa = await buildMark(AA_LOGO, w * WM.aaWidthFrac, WM.aaOpacity);
  const asm = await buildMark(ASM_LOGO, w * WM.asmWidthFrac, WM.asmOpacity);
  const ix = Math.round(w * WM.asmInsetFrac), iy = Math.round(h * WM.asmInsetFrac);
  // Flatten the composite before encoding — .clone() twice on a composite
  // pipeline throws "Invalid argument".
  const marked = await sharp(base).composite([
    { input: aa.buffer, left: Math.round(w / 2 - aa.width / 2), top: Math.round(h / 2 - aa.height / 2) },
    { input: asm.buffer, left: w - asm.width - ix, top: h - asm.height - iy },
  ]).png().toBuffer();
  await sharp(marked).avif(AVIF).toFile(join(GALLERY, `varenna-lake-como-02-${w}.avif`));
  await sharp(marked).webp(WEBP).toFile(join(GALLERY, `varenna-lake-como-02-${w}.webp`));
  bytes += statSync(join(GALLERY, `varenna-lake-como-02-${w}.webp`)).size;
}
console.log(`varenna-lake-como-02 replaced from 20230820_120443 — ${(bytes / 1024).toFixed(0)}KB webp`);
