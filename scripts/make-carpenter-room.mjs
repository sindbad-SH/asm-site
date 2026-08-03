// make-carpenter-room.mjs — bake the "from the room" still for /venture/meme's
// Carpenter Not the Tools segment. Source: a frame mined from the operator's own
// recording of the 2025-12-03 session (E:\Makeshift\MEME\The Carpenter Not The
// Tools 12-3-2025\DJI_20251203170854_0006_D.MP4 @ 00:37:30, extracted + screened
// in E:\Makeshift\MEME\_CARPENTER-MINED — see its CONTENT-BRIEF.md). The crop
// already excludes the operator (he attended; standing rule). Native 1440x1080,
// so the "1600" tier emits at 1440 (withoutEnlargement — never upscale).
//
// MEME-POLISH-2026-08-03 (operator review): the frame's left ~35% is blank
// beige wall/floor — dead space. Rather than leave it empty under a separate
// blockquote, the verbatim quote + credit are now COMPOSITED directly into
// that space (site fonts via @resvg/resvg-js, same pipeline as
// make-meme-evergreen.mjs), with a dark scrim behind the text so it reads
// against the mixed-brightness wall/floor beneath it. The blockquote below the
// image is retired in meme.astro; the image alt text now says the quote is
// carried on the photo.
//
// INK DIRECTION TESTED (both, per operator instruction) — measured against the
// actual pixels of the text region (x:0-620, y:0-1080 of the 1440x1080 source),
// WCAG relative-luminance contrast ratio:
//   - white ink, NO scrim: 6.13:1 against the region's mean tone, but only
//     2.72:1 against its brightest sub-patch (the lit wall near the pods) —
//     fails AA (4.5:1) there.
//   - dark ink, NO scrim: 3.02:1 mean / 6.81:1 vs the brightest patch, but the
//     same region's darkest patch (the floor) is near-black, so dark ink on
//     dark floor is illegible — fails just as badly, the opposite direction.
//   - white ink WITH a scrim (see SCRIM below) at alpha 0.6 fading out by
//     x=660: worst case (brightest patch) contrast = 8.26:1, mean-tone case
//     12–14:1. WHITE WON — a scrim tames the bright end enough for white ink
//     to clear AA everywhere the dark end already does on its own (near-black
//     floor + near-black text is not the failure mode; near-white wall + white
//     text was, and the scrim fixes exactly that).
import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = "E:/Makeshift/MEME/_CARPENTER-MINED/stills/part1_00-37-30_eric-teaching-gesture.jpg";
const OUT = join(process.cwd(), "public", "media", "venture", "meme");
mkdirSync(OUT, { recursive: true });

// ── fonts (same conversion trick as make-meme-evergreen.mjs: resvg-js wants
//    real .ttf/.otf on disk, and reliably reads the family name only out of a
//    fonttools-resaved copy of the fontsource woff2) ──
const FONT_SRC = {
  frauncesItalic: join(ROOT, "node_modules", "@fontsource-variable", "fraunces", "files", "fraunces-latin-wght-italic.woff2"),
  spaceMono: join(ROOT, "node_modules", "@fontsource", "space-mono", "files", "space-mono-latin-400-normal.woff2"),
};
const fontDir = mkdtempSync(join(tmpdir(), "carpenter-room-fonts-"));
const fontOut = {};
for (const [key, src] of Object.entries(FONT_SRC)) {
  if (!existsSync(src)) throw new Error(`missing font source: ${src}`);
  const out = join(fontDir, `${key}.ttf`);
  execFileSync("python", [
    "-c",
    "import sys\nfrom fontTools.ttLib import TTFont\nf = TTFont(sys.argv[1])\nf.flavor = None\nf.save(sys.argv[2])\n",
    src,
    out,
  ]);
  fontOut[key] = out;
}
const FONT_FILES = Object.values(fontOut);

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function wrap(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}
function tspans(lines, x, startY, dy) {
  return lines.map((l, i) => `<tspan x="${x}" y="${startY + i * dy}">${esc(l)}</tspan>`).join("");
}

// ── the quote overlay, sized to the source's native 1440x1080, rendered at 2x
//    for crisp type then downsampled 1:1 onto the base photo ──
const W = 1440,
  H = 1080,
  SCALE = 2;
const MARGIN = 70;
const SCRIM_W = 660; // dead-space column being filled; fades out before the table/people

const quoteLines = wrap("People get hung up \u2014 should I buy this expensive camera? No. Use the cheaper camera, but get a good mic.", 24);
quoteLines[0] = `\u201C${quoteLines[0]}`;
quoteLines[quoteLines.length - 1] = `${quoteLines[quoteLines.length - 1]}\u201D`;

const QUOTE_SIZE = 40;
const QUOTE_DY = 54;
const QUOTE_Y = 520;
const CREDIT_LINES = ["ERIC ABRAMSON \u00B7 THE CARPENTER", "NOT THE TOOLS \u00B7 DECEMBER 2025"];
const CREDIT_Y = 838;
const CREDIT_DY = 30;

const overlaySvg = `<svg width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
      <stop offset="0" stop-color="#060a12" stop-opacity="0.62"/>
      <stop offset="0.62" stop-color="#060a12" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#060a12" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${SCRIM_W}" height="${H}" fill="url(#scrim)"/>
  <text x="${MARGIN}" y="${QUOTE_Y}" font-family="Fraunces" font-style="italic" font-size="${QUOTE_SIZE}" fill="#f7f9fb">${tspans(quoteLines, MARGIN, QUOTE_Y, QUOTE_DY)}</text>
  <text x="${MARGIN}" y="${CREDIT_Y}" font-family="Space Mono" font-size="16" letter-spacing="3.2" fill="#f7f9fb" fill-opacity="0.78">${tspans(CREDIT_LINES, MARGIN, CREDIT_Y, CREDIT_DY)}</text>
</svg>`;

const resvg = new Resvg(overlaySvg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: "Space Mono" } });
const overlayPng = resvg.render().asPng();
const overlayNative = await sharp(overlayPng).resize({ width: W, height: H }).png().toBuffer();

// sharp applies resize() BEFORE composite() regardless of call order in the
// chain, so compositing at native size and only THEN resizing needs two
// separate pipelines: bake the full-res composite once, resize from there.
const composited = await sharp(SRC).rotate().composite([{ input: overlayNative, left: 0, top: 0 }]).toBuffer();

for (const width of [900, 1440]) {
  const base = sharp(composited).resize({ width, withoutEnlargement: true });
  await base.clone().avif({ quality: 52 }).toFile(join(OUT, `carpenter-room-${width}.avif`));
  await base.clone().webp({ quality: 74 }).toFile(join(OUT, `carpenter-room-${width}.webp`));
  console.log(`baked carpenter-room-${width}.{avif,webp} (quote composited in)`);
}

rmSync(fontDir, { recursive: true, force: true });
