#!/usr/bin/env node
/**
 * make-meme-evergreen.mjs — 2026-08-03, REBUILT the same day per operator
 * polish-round review (branch meme-polish-2026-08-03): the first cut of these
 * cards was "pretty basic and hard to read" — designed like full-size posters
 * (kicker + title + a 4-line body paragraph + instructor + org footer) that
 * render at ~300px wide in the page's card grid, where the paragraph turns to
 * mush and the old photo-textured ghost-M watermark reads as murky noise.
 *
 * Card-scale redesign: ON the image now is ONLY kicker (small, track color),
 * the program TITLE (big, Anton, dominant — the card IS the title), and the
 * instructor name (small, italic). No body paragraph, no org footer line on
 * the image. The description moved OFF the image entirely — it's real HTML
 * text under each card in meme.astro now (PROGRAMS[].desc), selectable and
 * readable at any size. The watermark is no longer a photo crop of MEME's
 * logo mark (that was the "muddy photo texture") — it's now a single flat
 * Anton "M" glyph in the track's own color at very low opacity: a solid
 * geometric shape, not a photo.
 *
 * Poster aspect (1080x1350, 4:5) replaces the old 1440x900 flyer-shaped
 * canvas — the operator's ask was "film-festival section cards, not flyers."
 *
 * Two kinds of output, both into public/media/venture/meme/:
 *
 * 1. PROGRAM CARDS (program-<slug>-<w>.{avif,webp}) — built from the site's
 *    OWN fonts (Anton/Fraunces/DM Sans, the same three the page already
 *    uses). NOT the dated flyers — no dates, times, venues, or prices
 *    anywhere on these; that's the whole point of the rebuild. Rendered via
 *    @resvg/resvg-js (sharp/librsvg does not honor embedded @font-face —
 *    verified empirically before writing this) at 2x for crisp type, then
 *    downsampled through sharp like every other bake.
 *
 * 2. ROSTER HEADSHOTS — eric-abramson-portrait-700 (cropped from the only
 *    Eric Abramson photo on file, a work selfie that has a second, unrelated
 *    person — an interview subject — visible in the background; cropped
 *    tight to Eric's face/head so that person never appears), PLUS (new in
 *    the 2026-08-03 polish round, operator's explicit ask — "Amber's photo
 *    goes IN") amber-macpherson-portrait-700, cropped from her color
 *    headshot. That source carries an "April O'Hare Photography" watermark
 *    confined to the top-left corner; the crop starts below/right of it
 *    (face centered, plenty of headroom, watermark fully excluded) and the
 *    page prints a visible "Photo: April O'Hare Photography" credit line —
 *    cropping the mark + printing the credit is the honest way to use it.
 *    Shaun Michael Ellis and Sindbad are no longer on this roster at all (see
 *    the scope-rule comment on ROSTER_LEADS in meme.astro) — not a photo
 *    question, they've been removed from the list entirely.
 *
 * Font conversion: resvg-js's font loader wants real .ttf/.otf on disk and
 * (verified empirically) does NOT reliably read the family name out of the
 * fontsource-published .woff/.woff2 files — but DOES read a copy re-saved by
 * fonttools. So this script shells out to `python -c "...fontTools..."` the
 * same way make-icons.mjs already shells out to ffmpeg. Converted files land
 * in the OS temp dir and are deleted when the run ends.
 */
import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = path_resolve();
function path_resolve() {
  return dirname(dirname(fileURLToPath(import.meta.url))); // repo root
}
const OUT_DIR = join(ROOT, "public", "media", "venture", "meme");
const MEME_ROOT = String.raw`E:\Makeshift\MEME\05 - Source Docs from MEME`;

// ── 1. font conversion (woff2 → ttf via fonttools; resvg-js needs real files) ──
const FONT_SRC = {
  anton: join(ROOT, "node_modules", "@fontsource", "anton", "files", "anton-latin-400-normal.woff2"),
  frauncesItalic: join(ROOT, "node_modules", "@fontsource-variable", "fraunces", "files", "fraunces-latin-wght-italic.woff2"),
  dmSans: join(ROOT, "node_modules", "@fontsource-variable", "dm-sans", "files", "dm-sans-latin-wght-normal.woff2"),
  spaceMonoBold: join(ROOT, "node_modules", "@fontsource", "space-mono", "files", "space-mono-latin-700-normal.woff2"),
};
const fontDir = mkdtempSync(join(tmpdir(), "meme-evergreen-fonts-"));
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
console.log(`▸ fonts converted → ${fontDir}`);

// ── 2. text layout helpers ──
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

// ── 4. track palette (echoes MEME's own red/yellow banner pairing, plus the
//    site's own signature cyan for the sound track) ──
const TRACKS = {
  "pitch-market": { label: "PITCH & MARKET", color: "#e0a52c" },
  "on-set": { label: "ON-SET CRAFT", color: "#c9503f" },
  sound: { label: "SOUND", color: "#38f8ec" },
};

// ── 5. the seven evergreen program cards ──
// Title + instructor only — every fact traces to the same source as before
// (E:\Makeshift\MEME\05 - Source Docs from MEME\MEME Marketing.xlsx, never
// the dated Zeffy/flyer copy, never "Makeshift Film Group" — forbidden term,
// see audit-lib.mjs). The one-sentence descriptions now live as real HTML
// text in meme.astro's PROGRAMS array (below the card, not on it).
const CARDS = [
  { slug: "pitch-quorum", track: "pitch-market", title: ["Pitch Quorum"], titleSize: 168, instructor: "Nick C. Goins Jr." },
  { slug: "market-fresh", track: "pitch-market", title: ["Market Fresh"], titleSize: 160, instructor: "Nick C. Goins Jr." },
  { slug: "business-of-show-business", track: "pitch-market", title: ["The Business", "of Show", "Business"], titleSize: 108, instructor: "Nick C. Goins Jr." },
  { slug: "pa-workshop", track: "on-set", title: ["PA Workshop"], titleSize: 150, instructor: "Adam Smestad" },
  { slug: "script-supervisor", track: "on-set", title: ["Script", "Supervisor"], titleSize: 130, instructor: "Adam Smestad" },
  { slug: "carpenter", track: "on-set", title: ["The Carpenter", "Not the Tools"], titleSize: 110, instructor: "Eric Abramson" },
  { slug: "sound-workshop", track: "sound", title: ["Sound", "Workshop"], titleSize: 155, instructor: "Steve Borne" },
];

// Poster aspect (4:5) — "film-festival section cards, not flyers" (operator).
const W = 1080,
  H = 1350,
  SCALE = 2;
const MARGIN = 82;

function buildCardSvg(card) {
  const track = TRACKS[card.track];
  const nLines = card.title.length;
  const titleDy = Math.round(card.titleSize * 1.08);
  // vertically balance the title block regardless of line count so the card
  // reads the same "weight" whether it's 1 line or 3
  const titleStartY = Math.round(H / 2 - ((nLines - 1) * titleDy) / 2 + card.titleSize * 0.34);
  const instructorY = H - 132;

  return `<svg width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a1636"/>
      <stop offset="1" stop-color="#111f42"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="12" fill="${track.color}"/>
  <!-- flat geometric M — a solid glyph shape, not a photo crop, kept very faint -->
  <text x="${W + 40}" y="${H + 40}" font-family="Anton" font-size="900" fill="${track.color}" fill-opacity="0.07" text-anchor="end">M</text>
  <text x="${MARGIN}" y="150" font-family="DM Sans" font-size="26" letter-spacing="5" fill="${track.color}">${esc(track.label)}</text>
  <text x="${MARGIN}" y="${titleStartY}" font-family="Anton" font-size="${card.titleSize}" fill="#f6f8fb">${tspans(card.title, MARGIN, titleStartY, titleDy)}</text>
  <text x="${MARGIN}" y="${instructorY}" font-family="Fraunces" font-style="italic" font-size="38" fill="${track.color}">${esc("— " + card.instructor)}</text>
</svg>`;
}

await mkdir(OUT_DIR, { recursive: true });

const CARD_AVIF = { quality: 58, effort: 5 };
const CARD_WEBP = { quality: 80, effort: 5 };
const WIDTHS = [900, 1600];

console.log(`\n▸ meme evergreen program cards → public/media/venture/meme/`);
for (const card of CARDS) {
  const svg = buildCardSvg(card);
  const resvg = new Resvg(svg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: "DM Sans" } });
  const png = resvg.render().asPng();
  let bytes = 0;
  for (const w of WIDTHS) {
    const base = sharp(png).resize({ width: w });
    for (const [ext, opts] of [["avif", CARD_AVIF], ["webp", CARD_WEBP]]) {
      const buf = await base.clone()[ext](opts).toBuffer();
      const { writeFileSync } = await import("node:fs");
      writeFileSync(join(OUT_DIR, `program-${card.slug}-${w}.${ext}`), buf);
      bytes += buf.length;
    }
  }
  console.log(`  ✓ program-${card.slug.padEnd(28)} → ${(bytes / 1024).toFixed(0)}KB`);
}

// ── 6. Eric Abramson roster headshot — cropped tight to exclude the
//    unrelated interview subject visible in the background of his only photo ──
const ericSrc = join(MEME_ROOT, "Photos", "Eric Abramson.jpg");
if (existsSync(ericSrc)) {
  const PHOTO_AVIF = { quality: 55, effort: 5 };
  const PHOTO_WEBP = { quality: 82 };
  const base = sharp(ericSrc)
    .rotate()
    .extract({ left: 10, top: 560, width: 780, height: 780 })
    .resize({ width: 700 });
  await base.clone().avif(PHOTO_AVIF).toFile(join(OUT_DIR, "eric-abramson-portrait-700.avif"));
  await base.clone().webp(PHOTO_WEBP).toFile(join(OUT_DIR, "eric-abramson-portrait-700.webp"));
  console.log(`  ✓ eric-abramson-portrait-700  (cropped from the on-set selfie, background subject excluded)`);
} else {
  console.error(`  ✖ missing source: ${ericSrc}`);
  process.exitCode = 1;
}

// ── 7. Amber MacPherson roster headshot — crop starts below/right of the
//    "April O'Hare Photography" watermark (confined to the top-left corner
//    of the 500x500 source), face-centered, plenty of headroom. Credit line
//    prints visibly on the page (meme.astro) rather than being silently cropped
//    away without attribution.
const amberSrc = join(MEME_ROOT, "Photos", "Amber MacPherson Color Headshot.jpg");
if (existsSync(amberSrc)) {
  const PHOTO_AVIF = { quality: 55, effort: 5 };
  const PHOTO_WEBP = { quality: 82 };
  const base = sharp(amberSrc)
    .rotate()
    .extract({ left: 30, top: 78, width: 422, height: 422 })
    .resize({ width: 700 });
  await base.clone().avif(PHOTO_AVIF).toFile(join(OUT_DIR, "amber-macpherson-portrait-700.avif"));
  await base.clone().webp(PHOTO_WEBP).toFile(join(OUT_DIR, "amber-macpherson-portrait-700.webp"));
  console.log(`  ✓ amber-macpherson-portrait-700  (cropped below the April O'Hare Photography watermark, face centered)`);
} else {
  console.error(`  ✖ missing source: ${amberSrc}`);
  process.exitCode = 1;
}

rmSync(fontDir, { recursive: true, force: true });
console.log("");
