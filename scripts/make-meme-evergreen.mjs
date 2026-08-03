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
 * instructor name (small). No body paragraph, no org footer line on the
 * image. The description moved OFF the image entirely — it's real HTML
 * text under each card in meme.astro now (PROGRAMS[].desc).
 *
 * Poster aspect (1080x1350, 4:5) replaces the old 1440x900 flyer-shaped
 * canvas — the operator's ask was "film-festival section cards, not flyers."
 *
 * PORT — 2026-08-03 (branch meme-cards-kit-2026-08-03): card generation
 * rebuilt again to implement the "MEME Program Card Kit" commissioned in
 * Claude Design (project 513a4587-7791-40c6-8125-b73dfce117bb, harvested to
 * E:\Makeshift\MEME\_DESIGN-KIT-HARVEST\) per the design-once-render-forever
 * doctrine. What changed from the prior bake, and why:
 *   - Flat brand navy #011D4C background (was a two-stop #0a1636→#111f42
 *     gradient). The kit's own WCAG-AA contrast strategy (white titles
 *     16.4:1, gold labels 11.3:1, cyan labels 8.3:1 — all AAA) is measured
 *     against the FLAT navy; a gradient would make some of those numbers a
 *     lie in the darker corner.
 *   - The old flat ghost-"M" watermark is GONE — replaced by the kit's real
 *     per-program geometric motifs below. That watermark was this site's own
 *     placeholder; the kit's whole point is a bespoke abstract composition
 *     per program, never literal, never a photo, never data.
 *   - On-Set Craft (crimson track) now uses the kit's two-tone rule: label
 *     + accent bar render in brightened signal-red #FF6B84 (6.0:1 AA on
 *     navy); the deeper brand crimson #BE0A31 (only 2.6:1, fails AA) is
 *     reserved for decorative motif FILLS only, never text — exactly the
 *     kit's rules-card language.
 *   - Instructor name is no longer track-colored italic Fraunces — the kit
 *     specifies plain Montserrat at 78% white opacity (10.3:1 on navy),
 *     which is what's below now. Track color is reserved for the kicker
 *     label, the accent bar, and the motif — never the instructor line.
 *   - Kicker label font is Montserrat Bold (was DM Sans) per the kit's
 *     typography tokens (role-label-family: Montserrat, role-label-weight:
 *     700).
 *   - Title floor: per the kit's rules card, a program title never renders
 *     below 72px true size on the 1080-wide canvas; titles that don't fit
 *     one line at a tasteful size wrap to exactly two lines instead of
 *     shrinking further (the kit names "Script Supervisor Workshop" and
 *     "The Business of Show Business" as its own worked examples).
 *   - Sound Workshop's on-card title now reads "Sound Workshop" / "Pt. 1 & 2"
 *     (two lines) — the kit's own card carries the full program name
 *     including "Pt. 1 & 2"; the prior bake had shortened it to "Sound
 *     Workshop" only.
 *   - The seven per-track motifs are redrawn as clean SVG reproducing the
 *     kit's documented "Motif logic per track" (spotlight-into-ledger /
 *     pulse rings / ascending bars for Pitch & Market; chevrons /
 *     marked-up page / abstracted tool silhouette for On-Set Craft;
 *     waveform bars for Sound) from the harvested rules-card text and the
 *     kit's own rendered card gallery (viewed via Claude Design's Present
 *     mode — the DesignSync MCP that has harvested prior kits' raw
 *     .dc.html source in past sessions was unavailable this session, so
 *     the exact original SVG path data could not be pulled byte-for-byte;
 *     these paths are redrawn to match the documented geometry and the
 *     rendered reference, not copied from source markup). See the harvest
 *     folder's contents for the exact tokens (colors/typography/fonts) that
 *     WERE pulled verbatim.
 *   - Card corner radius (12px) and the 64x6px/3px-radius accent bar are
 *     now drawn per the kit's spacing & radius rules (previously there was
 *     no rounded corner or accent bar at all).
 *
 * Two kinds of output, both into public/media/venture/meme/:
 *
 * 1. PROGRAM CARDS (program-<slug>-<w>.{avif,webp}) — rendered via
 *    @resvg/resvg-js (sharp/librsvg does not honor embedded @font-face —
 *    verified empirically before writing this) at 2x for crisp type, then
 *    downsampled through sharp like every other bake.
 *
 * 2. ROSTER HEADSHOTS — eric-abramson-portrait-700 (cropped from the only
 *    Eric Abramson photo on file, a work selfie that has a second, unrelated
 *    person — an interview subject — visible in the background; cropped
 *    tight to Eric's face/head so that person never appears), PLUS
 *    amber-macpherson-portrait-700, cropped from her color headshot. That
 *    source carries an "April O'Hare Photography" watermark confined to the
 *    top-left corner; the crop starts below/right of it (face centered,
 *    plenty of headroom, watermark fully excluded) and the page prints a
 *    visible "Photo: April O'Hare Photography" credit line. Shaun Michael
 *    Ellis and Sindbad are not on this roster at all (see the scope-rule
 *    comment on ROSTER_LEADS in meme.astro).
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
// Anton (titles) + Montserrat Bold/Medium (kicker labels / instructor name) —
// per the harvested kit's typography tokens (tokens/typography.css:
// --font-display: Anton; role-label-family/weight: Montserrat/700). Fraunces
// and DM Sans are no longer used by these cards (see port notes above).
const FONT_SRC = {
  anton: join(ROOT, "node_modules", "@fontsource", "anton", "files", "anton-latin-400-normal.woff2"),
  montserratBold: join(ROOT, "node_modules", "@fontsource", "montserrat", "files", "montserrat-latin-700-normal.woff2"),
  montserratMedium: join(ROOT, "node_modules", "@fontsource", "montserrat", "files", "montserrat-latin-500-normal.woff2"),
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
function tspans(lines, x, startY, dy) {
  return lines.map((l, i) => `<tspan x="${x}" y="${startY + i * dy}">${esc(l)}</tspan>`).join("");
}

// ── 3. MEME Program Card Kit tokens (harvested from Claude Design project
//    513a4587-7791-40c6-8125-b73dfce117bb, "MEME Program Card Kit" —
//    E:\Makeshift\MEME\_DESIGN-KIT-HARVEST\_ds\...\tokens\colors.css) ──
const NAVY = "#011D4C";
const WHITE = "#FFFFFF";
const GOLD = "#FED302"; // Pitch & Market — label, accent bar, motif (11.3:1 AA on navy)
const SIGNAL_RED = "#FF6B84"; // On-Set Craft — label + accent bar ONLY (6.0:1 AA on navy)
const DEEP_CRIMSON = "#BE0A31"; // On-Set Craft — decorative motif FILLS only, never text (2.6:1, fails AA)
const CYAN = "#38F8EC"; // Sound — label, accent bar, motif (8.3:1 AA on navy; this site's existing sound-track brand cyan)

const TRACKS = {
  "pitch-market": { label: "PITCH & MARKET", text: GOLD, motif: GOLD },
  "on-set": { label: "ON-SET CRAFT", text: SIGNAL_RED, motif: DEEP_CRIMSON },
  sound: { label: "SOUND", text: CYAN, motif: CYAN },
};

// ── 4. per-track motif builders — geometric abstractions per the kit's
//    "Motif logic per track" rule: never literal, never a photo, never data.
//    Coordinates are hand-placed to sit in the card's middle band (clear of
//    the kicker/accent-bar zone at top and the title/instructor zone at
//    bottom), matching the kit's own 1080x1350 layout rule. ──
function motifSpotlightLedger(color) {
  // Pitch Quorum — "forward motion... a spotlight-into-ledger band"
  return `
    <defs>
      <radialGradient id="glow" cx="50%" cy="38%" r="55%">
        <stop offset="0" stop-color="${color}" stop-opacity="0.5"/>
        <stop offset="1" stop-color="${color}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${color}" stop-opacity="0.85"/>
        <stop offset="1" stop-color="${color}" stop-opacity="0.18"/>
      </linearGradient>
    </defs>
    <ellipse cx="540" cy="470" rx="330" ry="250" fill="url(#glow)"/>
    <path d="M 500 520 L 580 520 L 630 920 L 450 920 Z" fill="url(#beam)"/>
    <rect x="430" y="920" width="220" height="18" rx="4" fill="${color}"/>
  `;
}
function motifPulseRings(color) {
  // Market Fresh — "pulse rings"
  return `
    <circle cx="760" cy="460" r="24" fill="${color}"/>
    <circle cx="760" cy="460" r="84" fill="none" stroke="${color}" stroke-opacity="0.55" stroke-width="5"/>
    <circle cx="760" cy="460" r="150" fill="none" stroke="${color}" stroke-opacity="0.34" stroke-width="5"/>
    <circle cx="760" cy="460" r="216" fill="none" stroke="${color}" stroke-opacity="0.18" stroke-width="5"/>
  `;
}
function motifLedgerArc(lineColor, fillColor) {
  // The Business of Show Business — "marquee-bulb arc resolving into
  // ascending ledger columns over a balance line"
  const n = 9,
    bulbs = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = 150 + t * 780;
    const y = 380 - Math.sin(t * Math.PI) * 80;
    bulbs.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="${lineColor}"/>`);
  }
  const baseY = 900,
    barCount = 7,
    bars = [];
  for (let i = 0; i < barCount; i++) {
    const h = 46 + i * 46;
    const x = 190 + i * 100;
    bars.push(
      `<rect x="${x}" y="${baseY - h}" width="56" height="${h}" rx="5" fill="${fillColor}" fill-opacity="${(0.32 + i * 0.08).toFixed(2)}"/>`
    );
  }
  return `${bulbs.join("")}<line x1="150" y1="${baseY}" x2="930" y2="${baseY}" stroke="${lineColor}" stroke-width="3" stroke-opacity="0.7"/>${bars.join("")}`;
}
function motifChevrons(fillColor) {
  // PA Workshop — "chevrons"
  const chevs = [];
  for (let i = 0; i < 3; i++) {
    const scale = 1 - i * 0.22;
    const cx = 660 + i * 30,
      cy = 420 + i * 150,
      w = 240 * scale,
      h = 100 * scale;
    chevs.push(
      `<path d="M ${(cx - w / 2).toFixed(1)} ${(cy - h / 2).toFixed(1)} L ${(cx + w / 2).toFixed(1)} ${cy.toFixed(1)} L ${(cx - w / 2).toFixed(1)} ${(cy + h / 2).toFixed(1)} L ${(cx - w / 2 + 44 * scale).toFixed(1)} ${cy.toFixed(1)} Z" fill="${fillColor}" fill-opacity="${(0.92 - i * 0.22).toFixed(2)}"/>`
    );
  }
  return chevs.join("");
}
function motifMarkedPage(color) {
  // Script Supervisor Workshop — "marked-up page lines"
  return `
    <rect x="370" y="380" width="330" height="440" fill="none" stroke="${color}" stroke-opacity="0.55" stroke-width="3" rx="6"/>
    <line x1="420" y1="470" x2="650" y2="470" stroke="${color}" stroke-opacity="0.55" stroke-width="5"/>
    <line x1="420" y1="516" x2="610" y2="516" stroke="${color}" stroke-opacity="0.55" stroke-width="5"/>
    <line x1="420" y1="562" x2="650" y2="562" stroke="${color}" stroke-opacity="0.55" stroke-width="5"/>
    <line x1="420" y1="608" x2="590" y2="608" stroke="${color}" stroke-opacity="0.55" stroke-width="5"/>
    <line x1="372" y1="392" x2="696" y2="672" stroke="${color}" stroke-width="6"/>
  `;
}
function motifToolCross(fillA, fillB) {
  // The Carpenter Not the Tools — "an abstracted tool silhouette"
  return `
    <g transform="rotate(35 540 600)">
      <rect x="380" y="560" width="360" height="82" rx="18" fill="${fillA}"/>
    </g>
    <g transform="rotate(-22 540 600)">
      <rect x="410" y="590" width="290" height="46" rx="12" fill="${fillB}" fill-opacity="0.75"/>
    </g>
  `;
}
function motifWaveform(color) {
  // Sound Workshop — "waveform bars reading like a live level meter"
  const heights = [36, 64, 100, 140, 176, 212, 240, 212, 176, 140, 176, 212, 240, 212, 176, 140, 100, 64, 36];
  const barW = 26,
    gap = 14,
    total = heights.length * barW + (heights.length - 1) * gap;
  let x = 540 - total / 2;
  const centerY = 600;
  const bars = heights.map((h) => {
    const rect = `<rect x="${x.toFixed(1)}" y="${(centerY - h / 2).toFixed(1)}" width="${barW}" height="${h}" rx="10" fill="${color}"/>`;
    x += barW + gap;
    return rect;
  });
  return bars.join("");
}

// ── 5. the seven evergreen program cards ──
// Title + instructor only — every fact traces to the same source as before
// (E:\Makeshift\MEME\05 - Source Docs from MEME\MEME Marketing.xlsx, never
// the dated Zeffy/flyer copy, never "Makeshift Film Group" — forbidden term,
// see audit-lib.mjs). The one-sentence descriptions live as real HTML text
// in meme.astro's PROGRAMS array (below the card, not on it).
const CARDS = [
  { slug: "pitch-quorum", track: "pitch-market", title: ["Pitch Quorum"], titleSize: 122, instructor: "Nick C. Goins Jr.", motif: (t) => motifSpotlightLedger(t.motif) },
  { slug: "market-fresh", track: "pitch-market", title: ["Market Fresh"], titleSize: 122, instructor: "Nick C. Goins Jr.", motif: (t) => motifPulseRings(t.motif) },
  {
    slug: "business-of-show-business",
    track: "pitch-market",
    title: ["The Business Of", "Show Business"],
    titleSize: 76,
    instructor: "Nick C. Goins Jr.",
    motif: (t) => motifLedgerArc(t.text, t.motif),
  },
  { slug: "pa-workshop", track: "on-set", title: ["PA Workshop"], titleSize: 126, instructor: "Adam Smestad", motif: (t) => motifChevrons(t.motif) },
  {
    slug: "script-supervisor",
    track: "on-set",
    title: ["Script Supervisor", "Workshop"],
    titleSize: 72,
    instructor: "Adam Smestad",
    motif: (t) => motifMarkedPage(t.text),
  },
  {
    slug: "carpenter",
    track: "on-set",
    title: ["The Carpenter", "Not the Tools"],
    titleSize: 80,
    instructor: "Eric Abramson",
    motif: (t) => motifToolCross(t.motif, t.text),
  },
  {
    slug: "sound-workshop",
    track: "sound",
    title: ["Sound Workshop", "Pt. 1 & 2"],
    titleSize: 90,
    instructor: "Steve Borne",
    motif: (t) => motifWaveform(t.motif),
  },
];

// Poster aspect (4:5) — "film-festival section cards, not flyers" (operator);
// 1080x1350 / 72px padding is also the kit's own documented canvas + margin.
const W = 1080,
  H = 1350,
  SCALE = 2;
const MARGIN = 72;
const TITLE_FLOOR = 72; // kit rule: program title never renders below this

function buildCardSvg(card) {
  const track = TRACKS[card.track];
  const titleSize = Math.max(card.titleSize, TITLE_FLOOR);
  const nLines = card.title.length;
  const titleDy = Math.round(titleSize * 1.06);
  const instructorY = H - MARGIN - 14;
  const titleLastY = instructorY - 78;
  const titleStartY = titleLastY - (nLines - 1) * titleDy;
  const ruleY = titleStartY - titleSize * 0.8 - 22; // clears Anton's cap-height with margin
  const kickerY = MARGIN + 6 + 34;

  return `<svg width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" rx="12" fill="${NAVY}"/>
  <g clip-path="url(#cardClip)">
    <defs><clipPath id="cardClip"><rect width="${W}" height="${H}" rx="12"/></clipPath></defs>
    <g opacity="0.92">${card.motif(track)}</g>
    <rect x="${MARGIN}" y="${MARGIN}" width="64" height="6" rx="3" fill="${track.text}"/>
    <text x="${MARGIN}" y="${kickerY}" font-family="Montserrat" font-weight="700" font-size="26" letter-spacing="2.5" fill="${track.text}">${esc(track.label)}</text>
    <rect x="${MARGIN}" y="${ruleY}" width="56" height="4" rx="2" fill="${track.text}"/>
    <text x="${MARGIN}" y="${titleStartY}" font-family="Anton" font-size="${titleSize}" fill="${WHITE}">${tspans(card.title, MARGIN, titleStartY, titleDy)}</text>
    <text x="${MARGIN}" y="${instructorY}" font-family="Montserrat" font-weight="500" font-size="30" fill="${WHITE}" fill-opacity="0.78">${esc(card.instructor)}</text>
  </g>
</svg>`;
}

await mkdir(OUT_DIR, { recursive: true });

const CARD_AVIF = { quality: 58, effort: 5 };
const CARD_WEBP = { quality: 80, effort: 5 };
const WIDTHS = [900, 1600];

console.log(`\n▸ meme evergreen program cards → public/media/venture/meme/`);
for (const card of CARDS) {
  const svg = buildCardSvg(card);
  const resvg = new Resvg(svg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: "Montserrat" } });
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
