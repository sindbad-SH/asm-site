#!/usr/bin/env node
/**
 * fix-crans-montana-frames-2026-08-13.mjs — give the Crans-Montana note range.
 *
 * Operator, 2026-08-12: "the photo selection for this page is not great, I
 * almost want like completely different photos, they're pretty much all samey
 * and nothing's really distinct."
 *
 * HE IS RIGHT, AND RE-SELECTING WITHIN THE OUTING CANNOT FIX IT. The Lens
 * folder (the note's own source) holds 13 phone frames, and once the road sign,
 * the bus interior, the hotel plaque, the sponsor board and the circus tent are
 * dropped, the usable pool is about eight frames of ONE view: conifer tops in
 * the near ground, hazy Rhone valley behind. crans-montana-02 and -03 are two
 * of those eight. There is no drone material for the outing at all — no MP4, no
 * DNG, no DJI file anywhere under it.
 *
 * SO THE RANGE COMES FROM ICOGNE, one valley step away. Icogne merged INTO the
 * commune of Crans-Montana in 2017, so this is the same municipality, the same
 * shelf and the same day (2023-08-11) — not a borrowed location. It is the same
 * move already used on this site for Varenna, whose supporting frames come from
 * the adjacent Perledo outing with a note in the frontmatter.
 *
 *   02  20230811_110318 — the suspension footbridge over the Liene gorge,
 *       running out of frame toward the valley. A hard leading line, real
 *       depth, and the only built structure in the set.
 *   03  20230811_195936 — evening over the Rhone valley, cloud banks lit along
 *       the Valais Alps. The note's headline is "The shelf that holds the
 *       light"; this is the only frame in either outing that shows that.
 *
 * Both replace conifer-tops-over-haze frames, so the page goes from three
 * versions of one picture to three different ones.
 *
 * 01 IS DELIBERATELY UNTOUCHED — it is the hero, its clean cover export is
 * already baked and verified, and re-picking it would mean re-baking both
 * ladders for no complaint the operator actually made.
 *
 * Marked ladder only: 02 and 03 are supporting frames, and covers/ holds heroes.
 *
 * NOTE: stop the Astro dev server first — it holds handles on files under
 * public/, and overwriting a served export fails on Windows with
 * "Invalid argument".
 *
 * RUN: node scripts/fix-crans-montana-frames-2026-08-13.mjs
 */
import sharp from "sharp";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const ICOGNE = "E:/Amazing Ariel/Old adventure photos and footage from 2022 to 2023/2023-08-11 - Switzerland - Icogne/Photos/AA_Tier2_Alternates";
const PICKS = {
  "crans-montana-02": join(ICOGNE, "20230811_110318.jpg"),
  "crans-montana-03": join(ICOGNE, "20230811_195936.jpg"),
};

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

for (const [slug, src] of Object.entries(PICKS)) {
  if (!existsSync(src)) {
    console.error(`  MISSING  ${slug} -> ${src}`);
    process.exitCode = 1;
    continue;
  }
  const buf = await sharp(src).rotate().toBuffer();
  let bytes = 0;
  for (const w of WIDTHS) {
    const h = Math.round(w / ASPECT);
    const base = await sharp(buf).resize({ width: w, height: h, fit: "cover", position: "centre" }).toBuffer();
    const aa = await buildMark(AA_LOGO, w * WM.aaWidthFrac, WM.aaOpacity);
    const asm = await buildMark(ASM_LOGO, w * WM.asmWidthFrac, WM.asmOpacity);
    const ix = Math.round(w * WM.asmInsetFrac), iy = Math.round(h * WM.asmInsetFrac);
    const marked = await sharp(base).composite([
      { input: aa.buffer, left: Math.round(w / 2 - aa.width / 2), top: Math.round(h / 2 - aa.height / 2) },
      { input: asm.buffer, left: w - asm.width - ix, top: h - asm.height - iy },
    ]).png().toBuffer();
    await sharp(marked).avif(AVIF).toFile(join(GALLERY, `${slug}-${w}.avif`));
    await sharp(marked).webp(WEBP).toFile(join(GALLERY, `${slug}-${w}.webp`));
    bytes += statSync(join(GALLERY, `${slug}-${w}.webp`)).size;
  }
  console.log(`  ${slug} <- ${src.split("/").pop()}  ${(bytes / 1024).toFixed(0)}KB webp`);
}
