# PitchBoulder HERO treatment — rendered comparison

**Status:** COMPLETE
**Date:** 2026-08-01
**Input:** `_WF-HERO-SCOUT.md` shortlist — top pick #91 `20260617_090837.jpg`, runner-up #49 `DSC08301.jpg`

Constraints honoured: no dev server, no browser MCP, no commits, nothing written to
`C:\builds\asm\src`. Temp scripts were prefixed `_wf-` and deleted; only the renders and this
file remain.

---

## The three findings that decided this

### 1. The hero has no fixed aspect ratio — it is a viewport-shaped box

`.hero-video { min-height: 90svh }` (global.css:853) with `object-fit: cover` on the poster
(global.css:866). The hero box is therefore **viewport width × 90 % of viewport height**:

| viewport | hero box | ratio |
|---|---|---|
| 1600×900 desktop | 1600×810 | **1.98 : 1** |
| 1440×800 laptop | 1440×720 | 2.00 : 1 |
| 768×1024 tablet | 768×922 | 0.83 : 1 (portrait) |
| 390×844 phone | 390×760 | **0.51 : 1 (portrait)** |

So the scout's "16:9 vs 21:9" question is the wrong question. A 21:9 bake is actively harmful —
in a 1.98:1 box `cover` scales to height and **crops the sides**, which on #91 is exactly where
the applauding crowd lives. And on a phone the box is *portrait*: a single landscape poster is
centre-cropped to **~29 % of its width**.

Evidence: `_wf-hero-out/_COVERSIM.jpg` (3 poster bakes × 3 real device boxes).

### 2. On #91, the branding that actually reads is a third party's

Measured on the shipping 1600 px framing (`_wf-hero-out/_ZOOM-pb-precise.png`, 8× zoom):

| mark on the slide | rendered width @1600 px hero |
|---|---|
| **PITCH BOULDER** (bottom band of the left screen) | **~46 px**, and "BOULDER" is physically clipped by the screen bezel |
| **NOBILITY SPACE** (the presenter's company) | **~110 px** |

PitchBoulder's own mark renders at 38 % of the 120 px legibility floor; the third party's
wordmark is **2.4× larger**. Plus "Bo Stump / Co-Founder @ Nobility Space" and his headshot are
legible at hero scale on both screens. This kills the no-logo control on #91 — not because the
frame lacks branding, but because the branding it carries belongs to someone else.

### 3. The house default logo slot is the measured-worst position on this photo

`.case-hook-logo` (global.css:1424) centres the partner lockup **above the h1** at 120 px.
On #91 that lands on the second projector screen:

| placement on #91 | backdrop | white-outline contrast (mean / worst-pixel) |
|---|---|---|
| centred above h1 *(current house CSS)* | rgb(113,173,181) | **1.90 : 1 / 1.06 : 1** ❌ |
| bottom hairline band | rgb(52,50,53) | 11.45 : 1 / 6.25 : 1 |
| **bottom-left corner** | rgb(24,26,32) | **16.70 : 1 / 9.23 : 1** ✅ |

---

## Rendered comparison

| sheet | what it shows |
|---|---|
| `_wf-hero-out/_SHEET.jpg` | round 1 — 6 treatments (T1–T6), 2 frames × 2 ratios × 3 logo files × 4 placements + a no-logo control |
| `_wf-hero-out/_LADDER-A.jpg` | crop ladder for #91 at the real 1600×810 hero box (yFrac 0.50 / 0.56 / 0.62 / 0.68) |
| `_wf-hero-out/_COVERSIM.jpg` | `object-fit: cover` simulation, 3 bakes × desktop / laptop / phone |
| `_wf-hero-out/_SHEET2.jpg` | **round 2** — 6 refined treatments (R1–R6) at the true hero box, corrected measurement |
| `_wf-hero-out/_SHEET3-phone.jpg` | 6 portrait windows on a real 390×760 phone hero box |
| `_wf-hero-out/_SHEET4-recommendation.jpg` | **the recommendation panel** — winner at desktop + both phone variants + the alternate |

Individual options: `_wf-hero-out/T1…T6-*.jpg`, `R1…R6-*.jpg`, `FINAL-desktop-A.jpg`,
`FINAL-desktop-B.jpg`. Raw numbers: `_measures2.json`, `_measures4.json`.

### The iteration (required by the brief)

Round 1 produced two failures, both fixed in round 2:

1. **T5** (teal-alpha lockup, top-left of #49) measured **1.42 : 1** — invisible against the lit
   ceiling. Re-run as **R4**: white-outline file, moved to the dark bottom-left corner →
   **16.70 : 1**.
2. **T2** (centred lockup, 16 px above the h1) read as a cramped lump competing with the
   headline. Re-run as **R2** with 34 px leading — and the corrected measurement then showed the
   position itself is unusable (1.90 : 1), so it was demoted rather than tuned.

**A measurement bug was found and fixed mid-run.** sharp's `.stats()` is computed on the *input*
image and silently ignores a preceding `.extract()`, so every round-1 "region" contrast was
really the whole-frame mean — which is why T2/T3/T6 all reported an identical 8.55 : 1. Round 2
reads the extracted region's raw pixels instead and reports both the mean and the
**worst-pixel** contrast (the brightest pixel under a light lockup). Round-1 contrast figures
printed on `_SHEET.jpg` are therefore wrong; `_SHEET2.jpg` onward are correct.

---

## Ranked recommendation

### 1 · R4 — #91, white-outline lockup bottom-left + hairline rule ← **TOP PICK**
`_wf-hero-out/R4-A-corner.jpg` · `_wf-hero-out/FINAL-desktop-A.jpg`

The only treatment that satisfies the brief and the measurements at once. The frame is the one
the operator asked for — whole room, ~25 people on both sides, mid-applause, an eligible venue,
and not already used anywhere on the page. The crop at `yFrac 0.52` keeps both screens whole and
drops most of the ceiling. The empty carpet through the middle of the room is not a defect here:
it is the cleanest headline bed in the whole pool, which is why the h1 holds without extra
scrim. The lockup sits in the darkest region of the frame at **16.66 : 1 mean / 9.48 : 1
worst-pixel**, restrained and out of the headline's way, with the hairline rule quoting the
`steel-and-dust` partner-band grammar. **Gate:** the Bo Stump / Nobility Space slide needs the
operator's nod, and the mobile art-direction below is not optional.

### 2 · R4 grammar on #49 — same treatment, runner-up frame
`_wf-hero-out/FINAL-desktop-B.jpg` (14.52 : 1 / 9.42 : 1)

Take this if the operator won't clear the third-party slide, or if phone traffic dominates. It
is the better *photograph* (~30 people, faces not backs, pro-graded 3:2) and decisively the
better phone crop — its crowd is centre-weighted, so the portrait window lands on people at any
offset, where #91's crowd is edge-weighted and the centre is empty floor. Costs: it carries no
PitchBoulder branding at all (pure logo-overlay route), and it duplicates the existing
`wednesday-room/room-wide-*.avif` band, which would have to be re-baked from `DSC08304.jpg`.

### 3 · R1 — #91, bottom hairline band
`_wf-hero-out/R1-A-band.jpg` (11.45 : 1 / 6.25 : 1)

The closest literal quote of the `steel-and-dust` band. Reads well, but the 100 px plate covers
the applauding hands at bottom-left, and a band is chrome — if baked it gets rescaled and
cropped unpredictably by `cover` at every viewport. Only viable as DOM.

### 4 · R6 — #91, white-**backed** lockup, same corner
`_wf-hero-out/R6-A-plate.jpg` (16.36 : 1 / 9.04 : 1)

A statistical tie with R4 (the two files differ by 0.34 contrast points). Pick it only if the
operator prefers the heavier plate; `-white-outline` is marginally better and has more native
pixels (392 px vs 382 px).

### 5 · R3 — no logo (control) — **rejected**
`_wf-hero-out/R3-A-nologo.jpg`

The restrained answer, and the one worth wanting. Rejected on the measurement in finding 2: the
in-frame PitchBoulder mark is ~46 px and half-clipped while NOBILITY SPACE is ~110 px. The
control only becomes viable on frame #70 (`20260520_090658.jpg`, "Welcome to PitchBoulder!"
full-screen), which the scout correctly notes has a much thinner crowd.

### 6 · R2 — lockup centred above the h1 — **rejected**
`_wf-hero-out/R2-A-above.jpg`

The site's current `.case-hook-logo` position. **1.90 : 1 mean / 1.06 : 1 worst-pixel** — the
lockup is swallowed by the projector screen behind it. It is also redundant: the word
"PitchBoulder" already sits in the h1 20 px below. If the logo ships, this CSS must change.

---

## The recipe for the top choice

Reproducible in a bake script. `sharp().rotate()` **first** on every source — #91 carries
`orientation=6`.

### Source
```
E:\Pitch Boulder\Top photos for web build\_TIER 3 - MAYBE\20260617_090837.jpg
sharp(src).rotate()  ->  6112 x 6112
```

### Crop — landscape poster (the ≥ tablet-landscape source)
```
extract { left: 0, top: 1631, width: 6112, height: 3094 }   // ratio 1.9753 : 1, yFrac 0.52
resize  1600 x 810      -> hook-room-1600.avif / .webp
resize   900 x 456      -> hook-room-900.avif  / .webp
```
1.9753 : 1 is the 90svh desktop box, so `cover` is a near-exact fit from 1440 px up. Do **not**
bake 21:9 — a 1.98:1 box crops 12 % off each side of a 21:9 poster.

### Crop — portrait poster (mandatory; the phone box is 0.51 : 1)
```
extract { left: 335, top: 1222, width: 2509, height: 4890 } // ratio 0.5131 : 1
resize   900 x 1754     -> hook-room-portrait-900.avif / .webp
```
Ceiling-trimmed window (`hFrac 0.80`, `xFrac 0.26`, `yFrac 0.60`) sitting on the left crowd and
the near screen. Without it a phone visitor sees empty carpet and a mic stand — see the
`A · x .50 CENTRE` tile in `_SHEET3-phone.jpg`.

**Delivery:** `<picture>` with
`<source media="(max-aspect-ratio: 5/4)" srcset="…portrait…">` before the landscape source.
`5/4` is the point below which a 1.9753 poster starts losing more than ~30 % of its width
(hero-box ratio = viewportRatio ÷ 0.9). This needs one small change: `HeroVideo.astro` currently
emits a bare `<img class="hero-video__poster">` (HeroVideo.astro:41) — add an optional
`posterPortrait` prop and wrap it in `<picture>`.

### Scrim — unchanged, do NOT bake it
Keep `.hero-video__scrim` exactly as it is (global.css:897). For reference, what the renders
simulate, with `--color-base #141922`:
```
radial-gradient(120% 78% at 50% 50%, transparent 32%, #141922@50% 100%)
linear-gradient(to bottom, #141922@45%, transparent 24%, transparent 68%, #141922@72%)
```
Plus this page's existing h1/credit text-shadow override (pitchboulder.astro:322-329) — it is
doing real work on this frame and must stay.

### Logo — DOM, never baked
```
src : E:\Pitch Boulder\2026 Recordings\00 Assets\PB-logo-horizontal-lockup-teal-white-outline.png
      392 x 195 px, 2.010 : 1, alpha
dest: public/media/work/pitchboulder/pb-logo.png
```
`pitchboulder.astro:19` already existence-gates on exactly this path, so dropping the file in
lights up the `hookLogo` prop with no page change.

| property | value | why |
|---|---|---|
| width | `clamp(150px, 13vw, 200px)` | 200 px @1600 vp = 12.5 % of width, well over the 120 px floor; 150 px @390 vp = 38 % of the phone, verified legible in `_SHEET3-phone.jpg` |
| position | bottom-left of `.hero-video` | measured 16.66 : 1 vs 1.90 : 1 for the current centred slot |
| left | `clamp(1.25rem, 3.75vw, 3.75rem)` | 60 px @1600 |
| bottom | `clamp(1.25rem, 4vw, 4rem)` | 64 px @1600; clears the centred `.hero-video__cue` |
| rule above | 1 px `rgba(255,255,255,0.20)`, `max(logoWidth, 260px)` wide, 18 px above | the `steel-and-dust` hairline device |
| file | `-white-outline`, **not** `-RGB-alpha` | the teal-only file never clears 3.5 : 1 anywhere on either frame (matrix below) |

**Markup change:** `.case-hook-logo` currently renders inside `.hero-video__content`, which is
`position: relative` — so it cannot be corner-anchored from there. Add a named slot to
`HeroVideo.astro` as a sibling of `.hero-video__content` (z-index 2) and move the `hookLogo`
`<img>` into it.

**Asset caveat:** the lockup is a 392 px raster with no vector original. At 200 px CSS that is
0.98× density on a 2× display — right at the edge. Ask PitchBoulder for an SVG or a ≥ 800 px PNG.

### Credit line
```
hookCredit="The Wednesday room mid-applause — June 17, 2026"
```
Replaces the current Boulder-Chamber/PEMPal credit (pitchboulder.astro:170), which describes the
retired frame.

---

## Contrast matrix — 3 logo files × 3 placements × 2 frames

200 px lockup on the scrimmed backdrop; "edge" = the colour that defines the mark's silhouette
(white for the outline/backed files, teal for the alpha file). Worst-pixel is the brightest
pixel under a light mark / darkest under the teal mark.

| frame | placement | logo file | backdrop | mean | worst-pixel |
|---|---|---|---|---|---|
| #91 | above h1 | alpha | rgb(116,178,186) | 3.06 | 3.61 |
| #91 | above h1 | outline | rgb(113,173,181) | **1.90** | **1.06** |
| #91 | above h1 | backed | rgb(114,175,183) | 1.83 | 1.04 |
| #91 | bottom band | alpha | rgb(53,50,54) | 2.05 | 3.39 |
| #91 | bottom band | outline | rgb(52,50,53) | 11.45 | 6.25 |
| #91 | bottom band | backed | rgb(52,50,54) | 11.22 | 6.13 |
| #91 | **bottom-left** | alpha | rgb(24,27,32) | 2.99 | 3.45 |
| #91 | **bottom-left** | **outline** | rgb(24,26,32) | **16.70** | **9.23** |
| #91 | bottom-left | backed | rgb(24,26,32) | 16.36 | 9.04 |
| #49 | above h1 | alpha | rgb(112,100,88) | 1.04 | 3.51 |
| #49 | above h1 | outline | rgb(113,101,88) | 5.30 | 2.51 |
| #49 | above h1 | backed | rgb(112,101,88) | 5.21 | 2.46 |
| #49 | bottom band | outline | rgb(29,33,38) | 15.27 | 8.78 |
| #49 | bottom-left | outline | rgb(40,37,35) | 14.56 | 9.52 |
| #49 | bottom-left | alpha | rgb(40,37,35) | 2.63 | 3.48 |

**The teal-alpha file is unusable.** It never clears 3.61 : 1 at any placement on either frame —
its ink (rgb 4,114,117) is too close in luminance to both the lit and the shadowed parts of these
rooms. Use `-white-outline` (or `-white-backed`, a 0.34-point tie).

Phone tiles measured separately: #91 portrait 17.83 : 1 / 13.09 : 1, #49 portrait 14.18 : 1 /
7.01 : 1, both at a 150 px CSS lockup.

---

## Open items for the operator

1. **Third-party consent (blocking for #91).** Bo Stump's headshot, name and company are legible
   at hero scale on both screens. Needs a nod before publishing, or switch to option 2.
2. **If #49 is chosen**, `wednesday-room/room-wide-*.avif` must be re-baked from `DSC08304.jpg`
   so one photograph doesn't run twice on the page.
3. **The mobile art-direction fix is a real code change** (a `posterPortrait` prop on
   `HeroVideo.astro`). Without it every hero on this site — not just PitchBoulder — is showing
   phone visitors the middle 29 % of its poster.
4. **`.case-hook-logo` must move** from centred-above-h1 to the bottom-left corner, or the logo
   ships at 1.90 : 1.

## Notes
- Headline in the renders is Georgia standing in for Fraunces Variable (not installed
  system-wide, so librsvg can't reach the woff2); credit line is Courier New standing in for
  Space Mono. Type is indicative, not final — the *positions*, crops, scrim and contrast numbers
  are real.
- Nothing was baked into `public/`, moved, or committed.
