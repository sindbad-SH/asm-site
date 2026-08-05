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
 *
 * MEME-STICKLER-2026-08-03 — PHOTO-BACKED DUOTONE REBUILD (operator: "I was
 * expecting overlay images over photos — those Facebook photos utilized in
 * some way. I don't see any used at all"). The flat-navy-plus-geometric-motif
 * design above is REPLACED for 5 of the 7 cards with a real photograph →
 * heavy navy duotone → kit motif at low opacity as a texture accent → the
 * same kicker/title/instructor type.
 *
 * MEME-ARCHIVE-2026-08-03 (branch meme-archive-2026-08-03) — REAL MEME
 * ARCHIVE REPLACES BORROWED PHOTOS. The sourcing this section used to
 * describe (PitchBoulder photography standing in for Pitch & Market;
 * Carpenter-workshop stills reused as generic On-Set-Craft texture for
 * pa-workshop/script-supervisor) put OTHER programs' photography — one of
 * them a different program entirely — on cards that name MEME's own
 * programs. The operator was explicit that PitchBoulder photos must not
 * appear on a MEME page. Every photo-backed card now uses MEME's own event
 * archive (E:\Makeshift\MEME\05 - Source Docs from MEME\Photos\Archive
 * moments\, MEME_ARCHIVE_ROOT below):
 *   - market-fresh: "American Film Market photo.jfif", cropped to keep the
 *     pink AFM event-signage banner legible (the honesty gate's own signage
 *     exemption covers it, same as a SeriesFest backdrop would).
 *   - business-of-show-business: "Catalina Film Festival.jfif" — a 3-panel
 *     collage — LEFT PANEL ONLY (the suited attendee under the "Via Casino"
 *     arch), cropped wholly inside that single panel; no seam or
 *     neighbouring-panel sliver anywhere in the shipped crop.
 *   - pa-workshop: "PA Workshop 2.jpg", a genuine PA Workshop session in
 *     progress; cropped to exclude a laptop screen visible elsewhere in the
 *     frame (its on-screen content is a blurred, illegible thumbnail, but
 *     the crop sidesteps the question entirely).
 *   - script-supervisor: "Script Supervisor Workshop.jfif" — Adam Smestad
 *     pointing at a monitor titled "Continuity Overview – 180 Degree Rule"
 *     (the honesty gate's own teaching-slide exemption: generic film-craft
 *     curriculum, no private party named). Both Adam and the slide are kept
 *     in frame; a portrait 0.8-aspect crop out of this landscape source
 *     can't also fit the trailing "180 Degree Rule" half of the title
 *     without losing Adam, so that tail is cropped off — "Continuity
 *     Overview" plus the on-screen diagram remain, still generic curriculum,
 *     not a truncation that changes what the exemption covers.
 *   - carpenter: UNCHANGED — still the operator's own Carpenter-workshop
 *     stills (E:\Makeshift\MEME\_CARPENTER-MINED\stills\), genuinely from
 *     that workshop, per the standing scope rule already on this card.
 *   - pitch-quorum, sound-workshop: UNCHANGED, still `photo: null`. No
 *     genuine Pitch Quorum or Sound Workshop photography exists in the
 *     archive — an honest miss beats a fake fit, the same rule already
 *     applied to Sound Workshop before this pass.
 * Every chosen frame was screened against the operator's own description
 * (long dark hair, dark bandana/headscarf, goatee, waistcoat) — he does not
 * appear in any of the eight archive photos, and none of the 4 newly chosen
 * crops show him. No face is sliced by any crop — verified by direct crop
 * preview before baking, same as the roster fixes in
 * scripts/fix-meme-roster-crops-2026-08-03.mjs.
 *
 * Three new plain-photo "MEME in the world" strip images (world-afm,
 * world-catalina, world-retreat — see the STRIP_SHOTS section near the
 * bottom of this file) were added the same pass: no duotone, no scrim, no
 * motif, no on-image type — just a lightly graded, face-safe crop at
 * 900/1600w, same AVIF+WebP pipeline as the cards. world-afm and
 * world-catalina reuse two of the four archive sources above with
 * DIFFERENT, wider/landscape crops than their cards (never the same crop
 * twice); world-retreat uses a new source ("Writer's Retreat.jfif") no card
 * touches — its crop was pulled in from a wider frame that included a
 * bystander's legible "Carhartt" vest-patch logo, tightened until the patch
 * falls outside the frame entirely while still keeping all three attendees'
 * heads fully in shot.
 *
 * SUPERSEDED SOURCING NOTES (2026-08-03, photo-backed duotone rebuild) —
 * kept for history only, no longer reflects the CARDS array below:
 *   - On-Set Craft (pa-workshop, script-supervisor, carpenter) originally
 *     all reused 3 different frames from the operator's own
 *     Carpenter-workshop recording as a stylized texture; only `carpenter`
 *     actually depicted its own program.
 *   - Pitch & Market (pitch-quorum, market-fresh, business-of-show-business)
 *     originally reused 3 different frames from the operator's own
 *     PitchBoulder photography — a different program he films — for generic
 *     "pitch-room energy" texture, later found to have consent problems
 *     (legible third-party slide/deck/browser-tab content across most of
 *     that pool) and replaced above.
 *   - Sound: no genuine mic/recorder/mixing frame was ever found in the
 *     operator's archives; unchanged then and now.
 *
 * DUOTONE MECHANICS: each source photo is cropped (face-safe, picked by eye)
 * to the card's 4:5 canvas, converted to greyscale, then every pixel is
 * lerped from the kit navy (#011D4C, shadows) to a desaturated light slate
 * (#B9C4D6, highlights) by its own luminance — a real duotone gradient map,
 * not a flat tint. That alone doesn't guarantee AA contrast for the white
 * kicker/title/instructor type sitting on top of it (a duotone photo's
 * highlight zones can land anywhere), so the type sits inside the same kind
 * of dark gradient SCRIM already used for the Carpenter room photo elsewhere
 * on this page (see make-carpenter-room.mjs) — measured below, at the exact
 * pixels the text renders over, after the scrim: every card clears WCAG AA
 * (4.5:1) for its white text. The kit's per-track motif is kept as a subtle
 * accent (opacity dropped from the old flat-navy cards' 0.92 to 0.15 so it
 * reads as texture, not competing with the photo).
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
const CARPENTER_STILLS = String.raw`E:\Makeshift\MEME\_CARPENTER-MINED\stills`;
// MEME-ARCHIVE-2026-08-03: MEME's own event archive — replaces
// PITCHBOULDER_ROOT (removed; see the header note above for why). Every
// photo-backed card except `carpenter` now sources from here.
const MEME_ARCHIVE_ROOT = String.raw`E:\Makeshift\MEME\05 - Source Docs from MEME\Photos\Archive moments`;

const CARDS = [
  {
    slug: "pitch-quorum",
    track: "pitch-market",
    title: ["Pitch Quorum"],
    titleSize: 122,
    instructor: "Nick C. Goins Jr.",
    motif: (t) => motifSpotlightLedger(t.motif),
    // NO photo — see the MEME-ARCHIVE-2026-08-03 header note: no genuine
    // Pitch Quorum photography exists in the archive. Honest miss, same
    // treatment as Sound Workshop below.
    photo: null,
  },
  {
    slug: "market-fresh",
    track: "pitch-market",
    title: ["Market Fresh"],
    titleSize: 122,
    instructor: "Nick C. Goins Jr.",
    motif: (t) => motifPulseRings(t.motif),
    // "American Film Market photo.jfif" (1080x1440 portrait, close to the
    // card's own 4:5). Center-crop (45px off top and bottom) — keeps the
    // pink "AFM / American Film Market" event-signage banner and the curved
    // hotel/tower street scene fully in frame; the one person in the shot is
    // walking away from camera, no face visible.
    photo: { file: join(MEME_ARCHIVE_ROOT, "American Film Market photo.jfif"), box: [0, 45, 1080, 1350] },
  },
  {
    slug: "business-of-show-business",
    track: "pitch-market",
    title: ["The Business Of", "Show Business"],
    titleSize: 76,
    instructor: "Nick C. Goins Jr.",
    motif: (t) => motifLedgerArc(t.text, t.motif),
    // "Catalina Film Festival.jfif" is a 3-panel collage (measured white
    // gutters: panel border 0-20px, vertical gutter 710-729px, right column
    // split 710-731px — verified by column/row brightness scan, not eyeballed).
    // LEFT PANEL ONLY (x 21-709, y 21-1418): the suited attendee under the
    // "Via Casino" arch. box stays fully inside that single panel — no
    // gutter or right-column sliver anywhere near the crop edges (checked
    // at full resolution). Face fully in frame, not sliced.
    photo: { file: join(MEME_ARCHIVE_ROOT, "Catalina Film Festival.jfif"), box: [21, 121, 688, 860] },
  },
  {
    slug: "pa-workshop",
    track: "on-set",
    title: ["PA Workshop"],
    titleSize: 126,
    instructor: "Adam Smestad",
    // OPERATOR FIX 2026-08-05 — was motifChevrons(t.motif). On every other
    // photo-backed card the deep-crimson motif disappears into a dark region
    // of the duotone; on this one it lands squarely on the bright window wall
    // in the middle of the frame and reads as a red scrawl over the room —
    // operator: "get rid of the red X that's in the center of this image."
    // Dropped rather than repositioned: the motif is a texture accent, and
    // this photograph has no dark quarter to hide it in. The kicker, accent
    // bar and title still carry the On-Set Craft signal-red, so the card
    // keeps its track identity.
    motif: null,
    // "PA Workshop 2.jpg" — a genuine PA Workshop session in progress.
    // Face-safe manual crop centered on the instructor mid-explanation
    // (coral shirt) with an engaged attendee alongside; deliberately stops
    // short of a laptop visible further right in the source frame (its
    // on-screen content isn't legible, but the crop avoids the question).
    photo: { file: join(MEME_ARCHIVE_ROOT, "PA Workshop 2.jpg"), box: [620, 0, 496, 620] },
  },
  {
    slug: "script-supervisor",
    track: "on-set",
    title: ["Script Supervisor", "Workshop"],
    titleSize: 72,
    instructor: "Adam Smestad",
    motif: (t) => motifMarkedPage(t.text),
    // "Script Supervisor Workshop.jfif" — Adam Smestad pointing at the
    // "Continuity Overview – 180 Degree Rule" monitor (the honesty gate's
    // teaching-slide exemption: generic film-craft curriculum, no private
    // party named). Crop keeps Adam's full body + face and the slide's
    // title/diagram in frame; the portrait 0.8-aspect width budget can't
    // also reach the trailing "180 Degree Rule" half of the title without
    // losing Adam, so that tail is cropped off (see header note).
    photo: { file: join(MEME_ARCHIVE_ROOT, "Script Supervisor Workshop.jfif"), box: [30, 0, 805, 1006] },
  },
  {
    slug: "carpenter",
    track: "on-set",
    title: ["The Carpenter", "Not the Tools"],
    titleSize: 80,
    instructor: "Eric Abramson",
    motif: (t) => motifToolCross(t.motif, t.text),
    // the ONE card whose background is honestly captioned as actually from
    // the workshop (meme.astro's alt text) — a different still than the big
    // feature photo elsewhere on the page (make-carpenter-room.mjs), so nothing
    // repeats. Left portion of the room: two attendees, faces fully in frame.
    photo: { file: join(CARPENTER_STILLS, "part1_00-01-15_opening-group.jpg"), box: [0, 0, 864, 1080] },
  },
  {
    slug: "sound-workshop",
    track: "sound",
    title: ["Sound Workshop", "Pt. 1 & 2"],
    titleSize: 90,
    instructor: "Steve Borne",
    motif: (t) => motifWaveform(t.motif),
    // NO photo — see the header note: no genuine sound/gear/set frame exists
    // in the operator's archives. Stays flat-navy + waveform motif, unchanged.
    photo: null,
  },
];

// Poster aspect (4:5) — "film-festival section cards, not flyers" (operator);
// 1080x1350 / 72px padding is also the kit's own documented canvas + margin.
const W = 1080,
  H = 1350,
  SCALE = 2;

// ── photo-backed duotone (MEME-STICKLER-2026-08-03) ──
const DUOTONE_SHADOW = { r: 1, g: 29, b: 76 }; // #011D4C — the kit navy
const DUOTONE_HIGHLIGHT = { r: 185, g: 196, b: 214 }; // #B9C4D6 — desaturated light slate

async function buildDuotonePhoto(photo) {
  let pipeline = sharp(photo.file).rotate();
  if (photo.box) {
    const [left, top, width, height] = photo.box;
    pipeline = pipeline.extract({ left, top, width, height });
  }
  const { data, info } = await pipeline
    .resize({ width: W * SCALE, height: H * SCALE, fit: "cover" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const rgb = Buffer.alloc(n * 3);
  for (let i = 0; i < n; i++) {
    const l = data[i] / 255;
    rgb[i * 3] = Math.round(DUOTONE_SHADOW.r + (DUOTONE_HIGHLIGHT.r - DUOTONE_SHADOW.r) * l);
    rgb[i * 3 + 1] = Math.round(DUOTONE_SHADOW.g + (DUOTONE_HIGHLIGHT.g - DUOTONE_SHADOW.g) * l);
    rgb[i * 3 + 2] = Math.round(DUOTONE_SHADOW.b + (DUOTONE_HIGHLIGHT.b - DUOTONE_SHADOW.b) * l);
  }
  return sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } }).png().toBuffer();
}
const MARGIN = 72;
const TITLE_FLOOR = 72; // kit rule: program title never renders below this

// MEME-STICKLER-2026-08-03: for a photo card, the SVG no longer paints the
// navy background itself (the duotone photo IS the background, composited
// underneath this layer by sharp) — it only paints the scrims, the low-
// opacity motif accent, and the type. The scrims are the same device as the
// Carpenter room photo's quote overlay elsewhere on this page (see
// make-carpenter-room.mjs): a dark gradient wherever text sits, so contrast
// is guaranteed no matter how bright that patch of the duotone happens to be
// — measured after the fact against the actual rendered pixels (see below).
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
  const hasPhoto = Boolean(card.photo);

  const background = hasPhoto ? "" : `<rect width="${W}" height="${H}" rx="12" fill="${NAVY}"/>`;
  const motifOpacity = hasPhoto ? 0.15 : 0.92;
  // top scrim clears the kicker/rule (y≈72-140); bottom scrim clears the
  // title-through-instructor block (title blocks measured up to ~250px tall
  // at most across all 7 cards, so starting the fade at H-500 leaves margin
  // on every one, 1- or 2-line title alike, without hand-tuning per card).
  // Contrast-MEASURED (see the header note): the first pass at these scrims
  // (linear, top 0.68→0, bottom 0→0.86) left 2 of the 6 photo cards under
  // AA at a bright patch of their own source photo (market-fresh's kicker
  // sat over a snowy window; business-of-show-business's title sat over a
  // lit whiteboard). Fixed by going darker overall AND non-linear — an early
  // step up (steep near the text zone's own edge) rather than a slow fade —
  // so the darkest values arrive before the text does instead of after it.
  //
  // MEME-ARCHIVE-2026-08-03: that earlier pass only checked the WHITE
  // title/instructor text. Re-measuring every row per-pixel (rendering the
  // duotone+scrim background with the text stripped out, then testing each
  // track's actual kicker fill color against the brightest pixel in its
  // row) turned up a real gap: the on-set track's SIGNAL_RED kicker label
  // sits in the TOP scrim, and red text has much less luminance headroom
  // than white — pa-workshop/script-supervisor/carpenter's kicker rows
  // measured 2.51:1 / 3.38:1 / 3.38:1, all under the 4.5:1 floor, at the old
  // top-scrim curve (0→0.86, 0.55→0.5, 1→0). Fixed by pushing the top
  // scrim's high-opacity plateau further down and slightly darker (0→0.94,
  // 0.45→0.9, 0.7→0.42, 1→0) so it still covers the kicker row for every
  // track. Re-measured after the change (see the branch's PR/commit
  // message for the full per-row numbers): every row on every photo-backed
  // card — kicker, title, instructor — clears 4.5:1, on-set kickers now by
  // 6.1-6.4:1.
  const scrims = hasPhoto
    ? `<defs>
        <linearGradient id="scrimTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#040912" stop-opacity="0.94"/>
          <stop offset="0.45" stop-color="#040912" stop-opacity="0.9"/>
          <stop offset="0.7" stop-color="#040912" stop-opacity="0.42"/>
          <stop offset="1" stop-color="#040912" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="scrimBottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#040912" stop-opacity="0"/>
          <stop offset="0.35" stop-color="#040912" stop-opacity="0.6"/>
          <stop offset="0.7" stop-color="#040912" stop-opacity="0.82"/>
          <stop offset="1" stop-color="#040912" stop-opacity="0.94"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${W}" height="260" fill="url(#scrimTop)"/>
      <rect x="0" y="${H - 560}" width="${W}" height="560" fill="url(#scrimBottom)"/>`
    : "";

  return `<svg width="${W * SCALE}" height="${H * SCALE}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  ${background}
  <g clip-path="url(#cardClip)">
    <defs><clipPath id="cardClip"><rect width="${W}" height="${H}" rx="12"/></clipPath></defs>
    ${card.motif ? `<g opacity="${motifOpacity}">${card.motif(track)}</g>` : ""}
    ${scrims}
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
  const overlayPng = resvg.render().asPng();
  // photo cards: composite the (background-transparent) text/scrim overlay
  // over the duotone photo. Non-photo cards (sound-workshop): the overlay
  // already IS the finished flat-navy card, same as before this rebuild.
  const png = card.photo
    ? await sharp(await buildDuotonePhoto(card.photo)).composite([{ input: overlayPng, left: 0, top: 0 }]).png().toBuffer()
    : overlayPng;
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

// Eric Abramson / Amber MacPherson roster headshots used to be baked here
// (sections 6-7). MEME-STICKLER-2026-08-03: both re-cropped (Amber's clipped
// her hair's crown; Eric's cut off his chin) and moved to
// scripts/fix-meme-roster-crops-2026-08-03.mjs, which is now the source of
// truth for both files — re-running this script no longer touches them.

// ── 8. STRIP_SHOTS — MEME-ARCHIVE-2026-08-03: three new "MEME in the world"
//    plain-photo strips (meme.astro's WORLD section, world-<slug>-<w>.{avif,
//    webp}). Unlike the cards above, these carry NO duotone, NO scrim, NO
//    motif, NO on-image type — just a face-safe crop with a gentle contrast/
//    saturation lift (never posterized) at roughly 3:2, same width tiers and
//    AVIF+WebP pipeline as the cards. Two reuse a card's source photo but
//    with a different, wider/landscape crop (never the same crop shipped
//    twice); world-retreat uses a source no card touches.
const STRIP_SHOTS = [
  {
    slug: "world-afm",
    // REVIEW FIX 2026-08-03 — was [0,60,1080,720], the TOP of the frame: a
    // clean architectural crop of the hotel curve and glass towers, chosen to
    // avoid repeating the market-fresh card's banner. Right instinct, wrong
    // trade — it cropped out the only thing identifying the location, so the
    // strip showed anonymous LA towers under a caption reading "The American
    // Film Market." Not dishonest (it IS the AFM venue) but visually inert,
    // and it duplicated the card's location while discarding its signage.
    //
    // Now the LOWER frame: the AFM stanchion at the hotel entrance, the AFM
    // street banners beyond it, the arrival lane, and one attendee walking in
    // — from behind, no face, unidentifiable, same as the card's figure.
    // Overlapping the card's subject is deliberate; the two treatments read as
    // separate moments rather than one repeat (the card is a tight portrait
    // duotone carrying type, this is a plain full-colour landscape).
    file: join(MEME_ARCHIVE_ROOT, "American Film Market photo.jfif"),
    box: [0, 620, 1080, 720],
  },
  {
    slug: "world-catalina",
    // "Catalina Film Festival 2.jfif" — a DIFFERENT 3-panel collage than the
    // business-of-show-business card's source. Same gutter geometry (panel
    // border 0-20/40px, vertical gutter 710-729px — verified by scan).
    // LEFT PANEL ONLY (x 21-709, y 21-1418): the mermaid "Catalina Film
    // Festival" banner. No people in this crop.
    file: join(MEME_ARCHIVE_ROOT, "Catalina Film Festival 2.jfif"),
    box: [21, 121, 688, 459],
  },
  {
    slug: "world-retreat",
    // "Writer's Retreat.jfif" — all three attendees, canopy, and pines.
    // Tightened up from an initial wider crop that pulled in a bystander's
    // legible "Carhartt" vest-patch logo (measured at full res: patch
    // bbox ≈ x964-1021, y836-876); this box's bottom edge (817) sits above
    // that, so the patch falls outside the frame while every head stays
    // fully in shot.
    file: join(MEME_ARCHIVE_ROOT, "Writer's Retreat.jfif"),
    box: [172, 87, 1096, 731],
  },
];
// Grade at the LARGEST output width (1600) so every WIDTHS tier is a
// downscale, never an upscale — same reasoning as the cards' 2x SCALE render.
const STRIP_W = 1600,
  STRIP_H = 1067; // ~3:2, matches meme.astro's world-strip layout
const STRIP_AVIF = { quality: 62, effort: 5 };
const STRIP_WEBP = { quality: 82, effort: 5 };

console.log(`▸ meme "in the world" strip photos → public/media/venture/meme/`);
for (const shot of STRIP_SHOTS) {
  let pipeline = sharp(shot.file).rotate();
  if (shot.box) {
    const [left, top, width, height] = shot.box;
    pipeline = pipeline.extract({ left, top, width, height });
  }
  // gentle contrast/saturation lift only — plain photography, not a graded
  // card background. linear() nudges contrast (a=1.06, b slightly negative
  // to hold black point), modulate() lifts saturation a touch; nowhere near
  // the posterize threshold the operator has flagged before at higher values.
  const graded = await pipeline
    .resize({ width: STRIP_W, height: STRIP_H, fit: "cover" })
    .linear(1.06, -8)
    .modulate({ saturation: 1.12 })
    .toBuffer();
  let bytes = 0;
  for (const w of WIDTHS) {
    const base = sharp(graded).resize({ width: w });
    for (const [ext, opts] of [["avif", STRIP_AVIF], ["webp", STRIP_WEBP]]) {
      const buf = await base.clone()[ext](opts).toBuffer();
      const { writeFileSync } = await import("node:fs");
      writeFileSync(join(OUT_DIR, `${shot.slug}-${w}.${ext}`), buf);
      bytes += buf.length;
    }
  }
  console.log(`  ✓ ${shot.slug.padEnd(30)} → ${(bytes / 1024).toFixed(0)}KB`);
}

rmSync(fontDir, { recursive: true, force: true });
console.log("");
