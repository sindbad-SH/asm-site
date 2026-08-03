#!/usr/bin/env node
/**
 * make-meme-evergreen.mjs — 2026-08-03. Bakes the media for the /venture/meme
 * EVERGREEN rebuild (operator: stop shipping the dated campaign flyers —
 * "if we do another Business of Show Business it'll work the same way. Same
 * for Pitch Quorum and Market Fresh" — and show the fuller roster, not just
 * Nick's headshot again).
 *
 * Two kinds of output, both into public/media/venture/meme/:
 *
 * 1. PROGRAM CARDS (program-<slug>-<w>.{avif,webp}) — clean typographic/
 *    branded cards, built from the site's OWN fonts (Anton/Fraunces/DM Sans —
 *    the same three the page already uses) plus a crop of MEME's own
 *    filmstrip-M logo mark (E:\Makeshift\MEME\...\Logos\MEME - Cropped.jpg)
 *    as a faint corner watermark. NOT the dated flyers — no dates, times,
 *    venues, or prices anywhere on these; that's the whole point of the
 *    rebuild. Rendered via @resvg/resvg-js (sharp/librsvg does not honor
 *    embedded @font-face — verified empirically before writing this) at 2x
 *    for crisp type, then downsampled through sharp like every other bake.
 *
 * 2. TWO NEW ROSTER HEADSHOTS (eric-abramson-portrait-700, cropped from the
 *    only Eric Abramson photo on file, a work selfie that has a second,
 *    unrelated person — an interview subject — visible in the background;
 *    cropped tight to Eric's face/head so that person never appears).
 *    Amber MacPherson's two headshots (color + B/W) are NOT baked here: both
 *    carry a visible "April O'Hare Photography" watermark with the credit
 *    unconfirmed, same rights flag the previous build already raised. Her
 *    roster entry stays text-only, same as Shaun Michael Ellis (no photo on
 *    file at all) and Sindbad (house rule: never his photo in event/roster
 *    imagery).
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

// ── 2. brand-asset crops (raw MEME materials — logo mark + Eric's only photo) ──
const memeMarkBuf = await sharp(join(MEME_ROOT, "Logos", "MEME - Cropped.jpg"))
  .extract({ left: 15, top: 5, width: 320, height: 465 })
  .png()
  .toBuffer();
const memeMarkDataUri = `data:image/png;base64,${memeMarkBuf.toString("base64")}`;

// ── 3. text layout helpers ──
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
// Every fact below is paraphrased from E:\Makeshift\MEME\05 - Source Docs from
// MEME\MEME Marketing.xlsx ("Instructor & Program Details" + "2026 Programs")
// and MEME Programatic Overview.pdf — never the dated Zeffy/flyer copy, and
// never mentioning "Makeshift Film Group" (forbidden term, see audit-lib.mjs).
const CARDS = [
  {
    slug: "pitch-quorum",
    track: "pitch-market",
    title: ["Pitch Quorum"],
    titleSize: 112,
    body: "A free introduction to pitching a feature film to investors, then Beginner and Advanced sessions that go deeper into querying and the documents behind a pitch. Mostly remote, with an in-person session to practice pitching in front of classmates.",
    instructor: "Nick C. Goins Jr.",
  },
  {
    slug: "market-fresh",
    track: "pitch-market",
    title: ["Market Fresh"],
    titleSize: 112,
    body: "A free introduction, then a multi-session remote program on how to prepare for a film market — what to expect, how to work it once you're there, and the follow-through after.",
    instructor: "Nick C. Goins Jr.",
  },
  {
    slug: "business-of-show-business",
    track: "pitch-market",
    title: ["The Business of", "Show Business"],
    titleSize: 88,
    body: "A workshop on the state of the film industry from a business perspective — the practical side of filmmaking that founders don't usually get taught anywhere.",
    instructor: "Nick C. Goins Jr.",
  },
  {
    slug: "pa-workshop",
    track: "on-set",
    title: ["PA Workshop"],
    titleSize: 112,
    body: "An in-person workshop for new and experienced production assistants alike: the basics of the job, what makes a PA stand out and get rehired, and hard-won tips from time actually spent on set.",
    instructor: "Adam Smestad",
  },
  {
    slug: "script-supervisor",
    track: "on-set",
    title: ["Script Supervisor", "Workshop"],
    titleSize: 88,
    body: "An in-person workshop on the basics of script supervising — continuity, script-supervising notes, the skill set, and how to build a career doing it.",
    instructor: "Adam Smestad",
  },
  {
    slug: "carpenter",
    track: "on-set",
    title: ["The Carpenter Not", "the Tools"],
    titleSize: 88,
    body: "A free in-person workshop on how to get started as a filmmaker with what you already have. Expensive gear is easy to get intimidated by — it shouldn't be what holds you back.",
    instructor: "Eric Abramson",
  },
  {
    slug: "sound-workshop",
    track: "sound",
    title: ["Sound Workshop"],
    titleSize: 112,
    body: "A two-part series on production sound. Part one sets a shoot up for success on location — mic placement, a sound plan, timecode, formats, metadata. Part two covers what happens to that audio in post — scheduling, spotting notes, the mix, delivery.",
    instructor: "Steve Borne",
  },
];

const W = 1440,
  H = 900,
  SCALE = 2;
const MARGIN = 90;

function buildCardSvg(card) {
  const track = TRACKS[card.track];
  const titleY = 260;
  const titleDy = card.titleSize * 1.05;
  const bodyStartY = card.title.length > 1 ? 470 : 420;
  const bodyLines = wrap(card.body, 58);
  const bodyDy = 46;
  const footerY = H - 80;

  return `<svg width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a1636"/>
      <stop offset="1" stop-color="#111f42"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="10" fill="${track.color}"/>
  <image href="${memeMarkDataUri}" x="${W - 300}" y="${H - 430}" width="230" height="335" opacity="0.16"/>
  <text x="${MARGIN}" y="112" font-family="DM Sans" font-size="28" letter-spacing="4" fill="${track.color}">${esc(track.label)}</text>
  <text x="${MARGIN}" y="${titleY}" font-family="Anton" font-size="${card.titleSize}" fill="#f2f4f8">${tspans(card.title, MARGIN, titleY, titleDy)}</text>
  <text x="${MARGIN}" y="${bodyStartY}" font-family="DM Sans" font-size="32" fill="#eef2f5" fill-opacity="0.88">${tspans(bodyLines, MARGIN, bodyStartY, bodyDy)}</text>
  <text x="${MARGIN}" y="${footerY}" font-family="Fraunces" font-style="italic" font-size="32" fill="${track.color}">${esc("— " + card.instructor)}</text>
  <text x="${MARGIN}" y="${H - 34}" font-family="Space Mono" font-size="20" letter-spacing="3" fill="#8a9a96">${esc("MEME · MAKESHIFT ENTERTAINMENT MEDIA EDUCATION")}</text>
</svg>`;
}

await mkdir(OUT_DIR, { recursive: true });

const CARD_AVIF = { quality: 55, effort: 5 }; // flyer-style dense type — matches make-meme-campaign.mjs
const CARD_WEBP = { quality: 78, effort: 5 };
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

rmSync(fontDir, { recursive: true, force: true });
console.log("");
