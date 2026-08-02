# _WF-LAYOUT-D — "Squares and boxes / dead space" sweep of the OTHER story pages

STATUS: COMPLETE (2026-08-01). ANALYSIS ONLY — no src/ edits, no bakes, no commits.
Measured on the running dev server at http://localhost:4321/asm-site, headless Chrome
(puppeteer-core), viewport 1280×900, deviceScaleFactor 1, full-page screenshots + rendered-DOM
geometry. This is the rendered-DOM verification LAYOUT-AUDIT.md deferred ("scripts/measure.mjs
must be rebuilt before the critic pass").

Artifacts (scratchpad, not in repo):
`C:\Users\Vince\AppData\Local\Temp\claude\C--builds-asm\4a0486cc-4b49-4674-bb57-4366ef4122c3\scratchpad\layout-d\`
- `<page>.png` full-page shots · `strip-<page>.png` rhythm contact strips · `crop-*.png` detail crops
- `raw.json` (every media beat + text block rect) · `empty.json` (ink maps) · `analysis.json`

---

## 0. Method (what each number actually is)

- **Media beat** — a rendered `<img>/<video>/<canvas>` inside `<main>` with both dimensions ≥60px
  (icons/logos excluded); a video and its poster occupying the same rect count once.
- **Distinct rendered widths** — widths bucketed to 8px. `repeats = beats − distinct`.
- **Centred box** — a beat whose horizontal centre is within ±10px of the viewport centre AND is
  narrower than 1260px. This is the literal "centred rectangle in a centred column" tell.
- **Longest no-scale-change run** — beats grouped into rows (≥40% vertical overlap); each row gets a
  signature of its sorted bucketed widths; a "scale change" is a row whose signature differs from the
  previous row. The metric is the largest vertical gap in px between consecutive scale changes
  (body start and body end count as bounds), so long text-only stretches are included — which is
  correct, they are exactly where the reader feels nothing change.
- **De-box devices** — full-bleed (w ≥ VW−8), overlap (a text block intersects a media rect by >6px
  vertically and >20px horizontally), tilt (|accumulated rotation| ≥ 0.3°).
- **Asymmetric beat** — a beat sharing a row with another beat where max/min width > 1.15 **or**
  the tops differ by >12px (a stagger). Symmetric-row beats are the twin-box tell.
- **Empty background** — a 16px ink grid built from every text run's client rects, every media rect,
  and every element with a real background or border, clipped to `<main>`'s vertical span. Largest
  all-zero rectangle found with the maximal-rectangle-in-histogram algorithm.

**Formulaic-Boxes Index (FBI, 0–100, higher = worse)** — one composite so the six can be ranked:
`FBI = 40·(plainContained/beats) + 30·(empty% /100) + 20·(longestNoScaleRun/bodyH) + 10·(1 − min(1, devices ÷ (bodyH/1500)))`
i.e. share of beats that are plain contained rectangles, share of the page that is empty background,
share of the scroll with no scale change, and a penalty for running fewer than one strong de-box
device per 1500px of scroll.

---

## 1. Ranked table — most "formulaic boxes" to least

| # | Page | FBI | Beats | Distinct w / repeats | Centred boxes | Longest no-scale run | Bleed / overlap / tilt | Asym / sym-row beats | Plain contained | Empty % of body | Biggest empty rect | Gutters · content width |
|---|------|-----|-------|---------------------|---------------|----------------------|------------------------|----------------------|-----------------|-----------------|--------------------|--------------------------|
| 1 | **/venture/meme** | **60.7** | 8 | 5 / 3 (184px ×3, 192px ×2) | 2 (25%) | **1800px = 48% of body** | **0 / 0 / 0** | 3 / **3** | **5 of 8 (63%)** | **53.9%** | **304×2096 @y797 = 13.2% of body** | **304 / 304 · 53% of VW** |
| 2 | **/venture/afm-2025** | **53.1** | 13 | 10 / 3 (416 ×2, 424 ×2, 712 ×2) | 4 (31%) | 1083px = 14% | **0 / 0 / 0** | 4 / 2 | **9 of 13 (69%)** | **41.7%** | 288×1216 @y6301 = 3.6% | 160 / 160 · 73% |
| 3 | /venture/seriesfest | 47.9 | 5 | 5 / 0 | 1 (20%) | 977px = 35% | 1 / 1 / 0 | **0** / 0 | **4 of 5 (80%)** | 29.6% | 160×2160 @y717 = 9.7% | 160 / 160 · 75% |
| 4 | /venture/dawn-patrol | 35.7 | 13 | 8 / 5 (344 ×2, 464 ×2, 472 ×2, 592 ×2, 1280 ×2) | 1 (8%) | 1184px = 21% | 2 / 2 / **0** | 4 / 2 | 7 of 13 (54%) | 33.0% | 160×2384 @y3309 = 5.3% | 160 / 160 · 75% |
| 5 | /adventure/steel-and-dust *(anchor)* | 29.6 | 12 | 8 / 4 | 3 (25%) | 1420px = 26% | 1 / 3 / **0** | 7 / 0 | 4 of 12 (33%) | 37.0% | 160×2240 @y717 = 5.1% | 160 / 160 · 75% |
| 6 | /adventure/vybe | 26.9 | 14 | 8 / 6 (344 ×3, 592 ×3) | 4 (29%) | 1240px = 20% | 1 / 3 / **0** | 9 / 0 | 4 of 14 (29%) | 37.6% | 160×2816 @y3357 = 5.8% | 160 / 160 · 75% |

Body heights: meme 3773 · afm 7567 · seriesfest 2799 · dawn-patrol 5602 · steel-and-dust 5528 · vybe 6093.

### Evidence per page

**1. /venture/meme — the operator's sentence, verbatim.**
`.meme-inner { max-width: 46rem; margin-inline: auto; padding: 7rem 2rem 6rem }` (meme.astro:347)
puts a 672px content measure dead-centre in a 1280 viewport: **304px of empty background down BOTH
sides for the entire 3773px body**. Content occupies 53% of the viewport width; every other page runs
75%. Total empty background 53.9% — the highest of the six by 12 points. The one thing living in those
gutters is the ghost "M E M E" letterforms at `#ffffff 5%` (meme.astro:643) — below the perception
floor on a `#0e2230` ground; the ink map registers them as empty and the eye agrees.
Then: **1800px — 48% of the body, nearly two full screens — passes with no scale change at all**
(one 670px logo frame at y492, then nothing but 672px-wide body text until y2292, broken only by a
centred `*`). Below that, **two identical-width triplet rows back to back**: the flyer wall
(192, 190, 190px) and the roster (181, 181, 181px) — the only page with symmetric-row beats
outnumbering nothing. Zero full-bleed, zero overlap, zero tilt. Biggest single empty region:
**304×2096px = 637k px², 13.2% of the whole page**, the left gutter running from y797 to y2893.

**2. /venture/afm-2025 — 13 beats, all on the same two rails.**
`.vs { max-width: 90rem; padding-inline: clamp(1.25rem, 5vw, 6rem) }` (afm-2025.astro:433–436) yields
a 1152px band at 1280. Every one of the 13 beats terminates inside it: widths 1136, 1152, 960, 712,
712, 640, 544, 480, 426, 424, 416, 416, 200. Width variety is actually the *best* of the six
(10 distinct) — and it doesn't help, because **the page has none of the three strong de-box devices:
0 full-bleed, 0 overlap, 0 tilt**, over 7567px of scroll (the longest page in the set). 9 of 13 beats
are plain contained rectangles (69%, the second-highest share), every one with a 1px border
(`.vs-hero-frame` afm-2025.astro:491 and siblings) — literal framed boxes. Two same-width adjacencies
sit side by side (`panel-mics` + `podium-lectern`, both 426×284 at y3725). 41.7% empty background.
Devices per 1500px of scroll: **0.00** (anchor: 1.09).

**3. /venture/seriesfest — highest box share, lowest de-box ratio.**
Rebuilt since LAYOUT-AUDIT (it is no longer a 2×2 uniform card grid), but the new shape still
scores worst on the purest box metric: **4 of its 5 beats (80%) are plain contained rectangles** and
its de-box:plain ratio is **0.25** — the lowest of the six (anchor 2.00, vybe 2.50). Zero asymmetric
beats, zero staggers: each chapter row is one image + one text block, tops aligned, separated by a
hairline rule — a table. Chapter 02 (`soulpower-red-carpet-press`, 480×240 at y1447) is centred with
centred text under it: the exact "centred rectangle in a centred column". 977px (35% of a short body)
with no scale change. Biggest empty region 160×2160 = 9.7% of body.

**4. /venture/dawn-patrol — passes, with one twin-box slip.**
De-box ratio 0.86 (2 full-bleed, 2 overlaps), 8 distinct widths, only 1 centred box in 13 beats — the
lowest centred share of the six. Its one regression is the Ferrari pair at y4918: `250-lm-no8` and
`250-lm-no7` render at **473×315 and 473×315** — identical width, identical aspect, aligned tops. That
is the page's only true twin-box row and the only same-scale adjacency in the whole newsstand family.

**5–6. /adventure/steel-and-dust and /adventure/vybe — confirmed at the good end.**
The anchor's grammar holds up under measurement: 7 and 9 asymmetric/staggered beats respectively,
zero symmetric rows, 3 text-over-media overlaps each, one full-bleed each, only ~30% of beats plain
contained. vybe edges the anchor (26.9 vs 29.6) on stagger count. Nothing here needs fixing.

---

## 2. Cross-cutting defect found while measuring: **every authored tilt is dead at runtime**

The `tilt` column is 0 on all six pages — **including the anchor**. This is not an authoring gap, it
is a CSS collision.

`src/styles/global.css:2589–2600`:
```
html.js [data-reveal]             { opacity: 0; transform: translateY(28px); … }
html.js [data-reveal].is-revealed { opacity: 1; transform: none; }
```
Specificity (0,3,1). The seven authored editorial rotations are all Astro-scoped
(`.sd-plate--l:where(.astro-hash)`, specificity (0,1,0)) **and every one of them carries
`data-reveal`**:

| Rotation | File:line | Element markup |
|---|---|---|
| `rotate(-2.5deg)` | steel-and-dust.astro:448 | `<figure class="sd-plate sd-plate--l" data-reveal>` :87 |
| `rotate(2.5deg)` | steel-and-dust.astro:452 | `sd-plate--r`, `data-reveal` |
| `rotate(-1.6deg)` | steel-and-dust.astro:787 | `<figure class="sd-photo sd-tilt" data-reveal>` :291 |
| `rotate(-2.5deg)` | vybe.astro:695 | `<figure class="vy-plate vy-plate--l" data-reveal>` :224 |
| `rotate(2.5deg)` | vybe.astro:699 | `vy-plate--r`, `data-reveal` |
| `rotate(-1.6deg)` | vybe.astro:1084 | `<figure class="vy-photo vy-tilt" data-reveal>` :472 |
| `rotate(-1.6deg)` | dawn-patrol.astro:698 | `<figure class="dp-photo dp-tilt" data-reveal>` :269 |

Verified in the browser: `.sd-plate--l` computes `transform: matrix(1, 0, 0, 1, 0, 0.19)` and
`.sd-tilt` computes `matrix(1, 0, 0, 1, 0, 28)` — pure translateY, no rotation, in both the pre-reveal
and revealed states. The measured AABB of the plates is 282×352 (an unrotated 4:5); a −2.5° rotation
would measure ≈297×364.

**Consequence:** one of the five house de-boxing devices (multi-scale hero, asymmetric stagger,
full-bleed, overlap, **tilt**) has never rendered on any page. The anchor is being judged, and copied,
without it. Fix shape (not applied): move the reveal offset onto the individual `translate` property
(`html.js [data-reveal] { translate: 0 28px } … .is-revealed { translate: none }`) so `transform:
rotate()` and the reveal no longer compete for the same property — or express the page tilts as
`rotate: -1.6deg` (the individual property) instead of `transform: rotate(-1.6deg)`.

**Note on LAYOUT-AUDIT.md being stale:** afm-2025 and seriesfest no longer match their entries there.
afm-2025 now renders 13 beats at 10 distinct widths with a caption on every image (the audit says
"15 boxed images… 0/16 captions… two gallery walls"); seriesfest now renders a 4-entry varied
chapter list, not a "uniform 2×2 card grid". Both have been rebuilt. Their *diagnosis* survives —
they are still the boxiest pages — but the specific counts in the audit should not be quoted forward.

---

## 3. The two highest-leverage fixes

### FIX A — /venture/meme: break the spine. Stop letting one 672px rail define the page.

**The one edit:** turn `.meme-inner` from a centred 46rem column into a **left-anchored text rail
inside a full 1280 editorial band**, and let media break right out of it.

Concretely, in `src/pages/venture/meme.astro`:
- Replace `.meme-inner { max-width: 46rem; margin-inline: auto }` (line 347) with a two-track grid
  on the story shell: `grid-template-columns: 10rem 42rem 1fr;` — body text stays in track 2 (the
  672px measure is correct typography and must not change), text left rail lands at x=160 like every
  other page in the set.
- Give three existing modules a `.meme-break` span into track 3:
  - **the MEME loop** (`meme-loop-frame`, now 670×377 centred at y492) → full-bleed 100vw with its
    caption overlaid on a blurred chip, matching `.sd-bleed`. This is the page's first-ever bleed
    and it lands 13% down, before the long text run.
  - **the flyer wall** (`.meme-wall`, line 507, currently `1.24fr 0.92fr 0.92fr` inside 672px → 192/190/190px
    twins) → spans tracks 2–3 at ~1050px with unequal widths and staggered baselines (the 58/34 +
    3rem drop geometry the anchor uses), which kills the first identical-width triplet.
  - **the roster** (`.meme-roster`, line 582, `repeat(3, 1fr)` → three identical 181px squares) →
    unequal ranks, lead card ~2× the other two, dropped baselines.
- Promote the ghost letterforms from `#ffffff 5%` (line 643) to a visible masthead-scale slab in
  track 3, or delete them — at 5% they are the reason 304px of page reads as nothing.

**Why this one:** meme's three worst numbers are all the same fact. 53% content width, 53.9% empty
background, and a 13.2%-of-page empty rectangle are all the centred 46rem rail; the 1800px
no-scale-change run and the two identical triplets are what that rail forces. Projected after:
content width 53% → 82%, empty 53.9% → ~40%, longest no-scale run 1800px → ~900px, de-box devices
0 → 2, symmetric-row beats 3 → 0. Cheapest fix in the set — it needs no new photography, which is the
constraint that has kept this page a "bones" page.

### FIX B — /venture/afm-2025: give the page its one full-bleed + one overlap, at the Century Plaza.

**The one edit:** promote `venue-century-plaza-1600.avif` to a true full-bleed band and float the
movement's text over it.

Concretely, in `src/pages/venture/afm-2025.astro`:
- `.vs-widest` (the `<figure>` at line 329, currently rendering 1152×576 at y4322, bordered, capped by
  the 1152 band) → `width: 100vw; margin-inline: calc(50% - 50vw); max-height: 68svh;` with
  `object-fit: cover`, border removed, and `.vs-cap` moved onto the image as an overlaid chip. Add
  `overflow-x: clip` to `.vs` (line 433) so the bleed doesn't create a scrollbar.
- The `MOVEMENT 4 · THE FLOOR` block immediately above it (`<section class="vs-movement">`, line 319:
  kicker + `The rest of the building.` + one paragraph) → a shadowed panel with
  `margin-bottom: -3.5rem; position: relative; z-index: 2;` so it sits on the top edge of the band.

**Why this one:** afm-2025 already has the best width variety in the set (10 distinct widths across
13 beats) and it changes nothing, because **all 13 beats end on the same two vertical rails**. Width
variety inside a fixed band is not rhythm; leaving the band is. This is also the exact beat where the
copy invites it — "The rest of the building… a trading floor for film and television, built for a week
inside the Fairmont Century Plaza" over a 2:1 night exterior at 57% page depth. One figure + one
section = the page's first full-bleed and first overlap, taking device density from **0.00 to 0.40 per
1500px** and de-box:plain from 0.44 to 0.86 (dawn-patrol's level). Second choice if only one line can
change: drop the 1px borders (`afm-2025.astro:491` and siblings) — but that softens the boxes rather
than breaking them, so it is worth less.

**Runner-up, worth flagging:** /venture/seriesfest has the worst pure-box numbers (80% plain
contained, de-box ratio 0.25, 0 asymmetric beats). Its fix is one line of the same kind — promote
chapter 01 to a hero-rank row that breaks the 960 rail and stagger the remaining three tops — but it
is a 5-beat hub, so the absolute change to how the site reads is smaller than A or B.

**Cross-cutting, before either:** ship the reveal/transform fix in §2. It is one rule in
`global.css` and it restores an entire de-boxing device on three pages including the taste anchor.
Any tilt authored into meme or afm as part of A or B will be silently discarded until it lands.
