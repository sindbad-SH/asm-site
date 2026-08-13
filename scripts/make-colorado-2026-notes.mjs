#!/usr/bin/env node
/**
 * make-colorado-2026-notes.mjs — gallery + cover exports for the 2026 Colorado
 * high-country field notes (Twin Lakes / Clear Creek, Clinton Gulch).
 *
 * Operator, 2026-08-12: "since we've got some new photos from my recent stuff
 * I'm thinking to also add a section on the Twin Lakes and Clear Creek
 * Reservoir as well as Mayflower Gulch and Clinton Reservoir."
 *
 * SOURCES ARE THE FINAL CUTS, NOT THE MASTERS. Operator, same message: "make
 * sure you're using the photos in those types of folders... because those are
 * the final cuts don't use the masters because obviously those are the original
 * Raws." So every pick below reads from `photos/best` (or `photos/alts`), never
 * from `_masters/`.
 *
 * WRITES TWO LADDERS PER PICK, which is the contract the site now expects:
 *   gallery/  WITH the burned-in AA wordmark + ASM monogram — every thumbnail,
 *             filmstrip cell and /adventure dispatch square reads these.
 *   covers/   WITHOUT either mark — only the page's hero reads these.
 * See scripts/make-clean-covers-2026-08-13.mjs for why the two exist.
 *
 * Watermark geometry and encoders are copied from make-adventure-frame.mjs so
 * the new frames sit identically to the 2023 archive ones. Copied rather than
 * imported because that script self-executes on import.
 *
 * RUN: node scripts/make-colorado-2026-notes.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const U = "E:/Amazing Ariel/_Upload";
const REPO = process.cwd();
const GALLERY = join(REPO, "public", "media", "adventure", "gallery");
const COVERS = join(REPO, "public", "media", "adventure", "covers");
const AA_LOGO = join(REPO, "src", "assets", "aa-logo-white.png");
const ASM_LOGO = join(REPO, "public", "logo-mark.png");

const AVIF = { quality: 50, effort: 5 };
const WEBP = { quality: 72, effort: 5 };
const ORIENT = {
  landscape: { aspect: 3 / 2, widths: [800, 1400, 2200] },
  vertical: { aspect: 4 / 5, widths: [800, 1120, 1600] },
};
const WM = {
  aaWidthFrac: 0.47,
  aaOpacity: 0.82,
  asmWidthFrac: 0.073,
  asmOpacity: 0.9,
  asmInsetFrac: 0.03,
};

const TWIN = `${U}/2026-08-08/_SHOOT/_Upload/02 - Twin Lakes/photos/best`;
const CLEAR = `${U}/2026-08-08/_SHOOT/_Upload/01 - Clear Creek Reservoir/photos/best`;
const CLINTON = `${U}/2026-08-06/_SHOOT/_Upload/03 - Clinton Gulch and Climax Tailings/photos/best`;

// slug → source. `position` only matters where the source is not already 3:2.
const PICKS = {
  // ── Twin Lakes + Clear Creek Reservoir (Lake / Chaffee County, upper Arkansas)
  "twin-lakes-01": {
    src: `${TWIN}/02_-_Twin_Lakes_23.jpg`, // native 3:2 — the lead
    orientation: "landscape",
  },
  "twin-lakes-02": {
    src: `${TWIN}/02_-_Twin_Lakes_09.jpg`, // native 3:2
    orientation: "landscape",
  },
  "twin-lakes-03": {
    src: `${TWIN}/02_-_Twin_Lakes_15.jpg`, // 16:9 source, centre-crop to 3:2
    orientation: "landscape",
    position: "centre",
  },
  "twin-lakes-04": {
    src: `${CLEAR}/01_-_Clear_Creek_Reservoir_03.jpg`, // native 3:2
    orientation: "landscape",
  },

  // ── Clinton Gulch + the Climax tailings (Fremont Pass, Summit/Lake County)
  // Operator pointed at the turquoise water as the thing he wants shown. It is
  // NOT a natural lake: those are the Climax mine's tailings impoundments, one
  // of which is named Mayflower — almost certainly where "Mayflower Gulch" came
  // from. Mayflower Gulch proper is a separate basin ~6 miles north on CO-91
  // and is not in this shoot. So the colour ships, captioned for what it is.
  // Two alpine frames lead, two colour frames follow.
  "clinton-gulch-01": {
    src: `${CLINTON}/03_-_Clinton_Gulch_and_Climax_Tailings_05.jpg`, // the reservoir — lead
    orientation: "landscape",
  },
  "clinton-gulch-02": {
    // _39 was tried first and rejected: it reads as haul roads and benches, not
    // as the reservoir. _13 is the same water with the Tenmile crest behind it.
    src: `${CLINTON}/03_-_Clinton_Gulch_and_Climax_Tailings_13.jpg`,
    orientation: "landscape",
  },
  "clinton-gulch-03": {
    src: `${CLINTON}/03_-_Clinton_Gulch_and_Climax_Tailings_43.jpg`, // impoundment against the shore
    orientation: "landscape",
  },
  "clinton-gulch-04": {
    src: `${CLINTON}/03_-_Clinton_Gulch_and_Climax_Tailings_27.jpg`, // turquoise/ochre edge
    orientation: "landscape",
  },
};

/** Build a faded, forced-white mark PNG at a target pixel width. */
async function buildMark(logoPath, targetW, opacity) {
  const { data, info } = await sharp(logoPath)
    .resize({ width: Math.round(targetW) })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = Math.round(data[i + 3] * opacity);
  }
  return {
    buffer: await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer(),
    width: info.width,
    height: info.height,
  };
}

async function watermark(baseBuffer, W, H) {
  const aa = await buildMark(AA_LOGO, W * WM.aaWidthFrac, WM.aaOpacity);
  const asm = await buildMark(ASM_LOGO, W * WM.asmWidthFrac, WM.asmOpacity);
  const insetX = Math.round(W * WM.asmInsetFrac);
  const insetY = Math.round(H * WM.asmInsetFrac);
  return sharp(baseBuffer).composite([
    { input: aa.buffer, left: Math.round(W / 2 - aa.width / 2), top: Math.round(H / 2 - aa.height / 2) },
    { input: asm.buffer, left: W - asm.width - insetX, top: H - asm.height - insetY },
  ]);
}

await mkdir(GALLERY, { recursive: true });
await mkdir(COVERS, { recursive: true });

for (const [slug, pick] of Object.entries(PICKS)) {
  if (!existsSync(pick.src)) {
    console.error(`  MISSING  ${slug}  ->  ${pick.src}`);
    process.exitCode = 1;
    continue;
  }
  const { aspect, widths } = ORIENT[pick.orientation];
  const src = await sharp(pick.src).rotate().toBuffer();
  const position = pick.position ?? "attention";
  let bytes = 0;
  for (const w of widths) {
    const h = Math.round(w / aspect);
    const base = await sharp(src).resize({ width: w, height: h, fit: "cover", position }).toBuffer();
    // marked → gallery (thumbnails, filmstrip, /adventure squares)
    const marked = await watermark(base, w, h);
    await marked.clone().avif(AVIF).toFile(join(GALLERY, `${slug}-${w}.avif`));
    await marked.clone().webp(WEBP).toFile(join(GALLERY, `${slug}-${w}.webp`));
    // clean → covers (the hero only)
    await sharp(base).avif(AVIF).toFile(join(COVERS, `${slug}-${w}.avif`));
    await sharp(base).webp(WEBP).toFile(join(COVERS, `${slug}-${w}.webp`));
    bytes += statSync(join(GALLERY, `${slug}-${w}.webp`)).size + statSync(join(COVERS, `${slug}-${w}.webp`)).size;
  }
  console.log(`  ${slug.padEnd(18)} ${widths.at(-1)}x${Math.round(widths.at(-1) / aspect)}  ${(bytes / 1024).toFixed(0)}KB  (gallery+covers)`);
}
console.log(`\n${Object.keys(PICKS).length} picks -> gallery/ (marked) + covers/ (clean)`);
