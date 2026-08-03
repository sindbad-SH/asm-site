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
// ROUND 3 (2026-08-03, meme-polish-2026-08-03) — operator: "stick the MEME
// logo in the top-left corner — there's still a little dead space and it's a
// good spot for branding." The top-left corner (above where the quote text
// starts at y=520) sits on a plain beige acoustic-panel wall — genuinely
// empty. Source: E:\Makeshift\MEME\05 - Source Docs from MEME\Logos\, picked
// "MEME - Cropped.jpg" over the square "MEME.jpg" — same M-glyph-plus-
// wordmark lockup, but without the "A NOT-FOR-PROFIT COMPANY" tagline baked
// into the square version, so it's the cleaner mark to crop from. Only the
// M glyph itself is used (the filmstrip M, not the spelled-out wordmark
// underneath it) — at corner-badge scale a full wordmark just turns to text
// mush, and the M alone is already the site's own shorthand for MEME (same
// glyph as the page's ghost "M E M E" backdrop motif).
//
// The glyph's source art is a busy multicolor filmstrip (little orange/blue
// clip thumbnails) — composited at full color it would fight the room's own
// mixed warm/cool lighting, the same "muddy photo texture" problem the
// evergreen program cards already hit and fixed by going flat/mono (see
// make-meme-evergreen.mjs's card watermark). Same fix here: grayscale +
// contrast-normalize the crop into a luminance mask, then paint that mask as
// a plain WHITE shape at low opacity — a quiet flat mark, not a photo.
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

// ── PORT 2026-08-03 (branch meme-cards-kit-2026-08-03): corner ticks + gold
//    tag, ported from the "MEME Program Card Kit" exploration board's
//    Treatment B ("Corner ticks + gold tag") — harvested from Claude Design
//    project 513a4587-7791-40c6-8125-b73dfce117bb, viewed via Present mode
//    (the DesignSync MCP used for prior kit harvests was unavailable this
//    session, so this is redrawn from the rendered reference + the kit's own
//    measured numbers, not copied from source markup). Four quiet gate-mark
//    corner ticks (55% white, decorative — an L-bracket in each corner of the
//    frame) plus a small navy-on-gold tag reading "IN THE ROOM" (kit-measured
//    11.3:1 contrast — the same navy/gold pair the kit uses for its gold
//    on-navy labels, reversed). The tag sits top-right, clear of the quote
//    column (which occupies the left 660px) and clear of every face — this
//    frame's people are lower/center-right, well below the tag's y-range.
//    The kit's own exploration board used a placeholder demo quote marked
//    PLACEHOLDER COPY — NEVER PUBLISH; that quote is never used here — the
//    existing verbatim Eric quote, credit, logo mark, and scrim above are
//    left exactly as they were.
const TICK_LEN = 34,
  TICK_INSET = 22,
  TICK_STROKE = 3,
  TICK_COLOR = "#FFFFFF",
  TICK_OPACITY = 0.55;
function cornerTick(x, y, dx, dy) {
  // dx/dy = +1/-1 direction the two arms extend from the corner point (x,y)
  return `<path d="M ${x} ${y + dy * TICK_LEN} L ${x} ${y} L ${x + dx * TICK_LEN} ${y}" fill="none" stroke="${TICK_COLOR}" stroke-opacity="${TICK_OPACITY}" stroke-width="${TICK_STROKE}" stroke-linecap="round"/>`;
}
const cornerTicksSvg = [
  cornerTick(TICK_INSET, TICK_INSET, 1, 1), // top-left
  cornerTick(W - TICK_INSET, TICK_INSET, -1, 1), // top-right
  cornerTick(TICK_INSET, H - TICK_INSET, 1, -1), // bottom-left
  cornerTick(W - TICK_INSET, H - TICK_INSET, -1, -1), // bottom-right
].join("");

// Navy-on-gold tag — MEME kit tokens (colors.css): --navy:#011D4C, --gold:#FED302.
const TAG_NAVY = "#011D4C";
const TAG_GOLD = "#FED302";
const TAG_LABEL = "IN THE ROOM";
const TAG_W = 214,
  TAG_H = 46,
  TAG_X = W - 70 - TAG_W, // top-right, clear of the quote column and every face
  TAG_Y = 34,
  TAG_R = 6;
const tagSvg = `<rect x="${TAG_X}" y="${TAG_Y}" width="${TAG_W}" height="${TAG_H}" rx="${TAG_R}" fill="${TAG_GOLD}"/>
  <text x="${TAG_X + TAG_W / 2}" y="${TAG_Y + TAG_H / 2 + 6}" font-family="Space Mono" font-size="17" letter-spacing="2.4" fill="${TAG_NAVY}" text-anchor="middle">${esc(TAG_LABEL)}</text>`;

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
  ${cornerTicksSvg}
  ${tagSvg}
</svg>`;

const resvg = new Resvg(overlaySvg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: "Space Mono" } });
const overlayPng = resvg.render().asPng();
const overlayNative = await sharp(overlayPng).resize({ width: W, height: H }).png().toBuffer();

// ── ROUND 3 corner mark: crop the M glyph out of MEME's own cleanest lockup,
//    reduce it to a low-opacity white silhouette, place it in the empty
//    top-left wall area. ──
const LOGO_SRC = join("E:", "Makeshift", "MEME", "05 - Source Docs from MEME", "Logos", "MEME - Cropped.jpg");
const LOGO_GLYPH_CROP = { left: 20, top: 0, width: 320, height: 462 }; // just the M, not the wordmark below it
// MEME-STICKLER-2026-08-03 (operator: "the MEME logo in the top-left is too
// transparent, everything is kind of small") — scaled up from 150px to 240px
// (in the 1440-wide frame; still clears the quote block, whose first line
// starts at y≈484, and the corner tick inset at x=22/y=22) and opacity raised
// from 0.5 to 0.88 so it reads as deliberate branding at a glance rather than
// a barely-there watermark, at the ~700px display size the card actually
// renders at on the page.
//
// MASKING METHOD CHANGED at the same time: the old greyscale+normalise
// luminance mask made the M read as patchy/broken once it was this much
// bigger and more opaque — the source art is a PHOTO-TEXTURED filmstrip (see
// the file itself: little colour thumbnail frames and black sprocket bars
// inside the M's strokes), so plenty of pixels *inside* the M are just as
// dark as the navy background around it, and a pure-luminance mask makes
// those pixels transparent too, leaving holes in the letterform. Fixed with
// a chroma-distance mask instead: sample the flat navy background color from
// the crop's corners, then key on each pixel's COLOR DISTANCE from that
// background (thresholded 55→95, picked by histogram — background pixels
// including the faint diamond quilting pattern all fall under ~60, the M's
// own content starts above that) rather than raw brightness. That reads the
// M as one solid shape regardless of what's bright or dark inside its
// strokes — verified by compositing the resulting mask over a plain dark
// swatch before using it here.
const LOGO_W = 240; // rendered width against the native 1440x1080 frame
const LOGO_X = 54,
  LOGO_Y = 42; // clears the quote block (first line lands at y≈484)
const LOGO_OPACITY = 0.88; // deliberate branding mark, not a faint watermark
const CHROMA_LO = 55,
  CHROMA_HI = 95;

async function buildLogoOverlay() {
  const { data: rgb, info } = await sharp(LOGO_SRC)
    .extract(LOGO_GLYPH_CROP)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  // background sample: average of the four corners (all confirmed flat navy)
  const corners = [0, info.width - 1, (info.height - 1) * info.width, n - 1];
  let br = 0,
    bg = 0,
    bb = 0;
  for (const c of corners) {
    br += rgb[c * 3];
    bg += rgb[c * 3 + 1];
    bb += rgb[c * 3 + 2];
  }
  br /= corners.length;
  bg /= corners.length;
  bb /= corners.length;

  const rgba = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const dr = rgb[i * 3] - br,
      dg = rgb[i * 3 + 1] - bg,
      db = rgb[i * 3 + 2] - bb;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    const t = Math.min(1, Math.max(0, (dist - CHROMA_LO) / (CHROMA_HI - CHROMA_LO)));
    rgba[i * 4] = 255;
    rgba[i * 4 + 1] = 255;
    rgba[i * 4 + 2] = 255;
    rgba[i * 4 + 3] = Math.round(t * 255 * LOGO_OPACITY);
  }
  const resized = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize({ width: LOGO_W })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { buffer: resized.data, width: resized.info.width, height: resized.info.height };
}
const logo = await buildLogoOverlay();

// sharp applies resize() BEFORE composite() regardless of call order in the
// chain, so compositing at native size and only THEN resizing needs two
// separate pipelines: bake the full-res composite once, resize from there.
const composited = await sharp(SRC)
  .rotate()
  .composite([
    { input: logo.buffer, raw: { width: logo.width, height: logo.height, channels: 4 }, left: LOGO_X, top: LOGO_Y },
    { input: overlayNative, left: 0, top: 0 },
  ])
  .toBuffer();

for (const width of [900, 1440]) {
  const base = sharp(composited).resize({ width, withoutEnlargement: true });
  await base.clone().avif({ quality: 52 }).toFile(join(OUT, `carpenter-room-${width}.avif`));
  await base.clone().webp({ quality: 74 }).toFile(join(OUT, `carpenter-room-${width}.webp`));
  console.log(`baked carpenter-room-${width}.{avif,webp} (quote composited in)`);
}

rmSync(fontDir, { recursive: true, force: true });
