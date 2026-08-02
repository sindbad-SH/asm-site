# _WF-LAYOUT-B — WEDNESDAY ROOM chapter: dead-space + boxiness audit

Status: MEASURED — proposals + mockups below (2026-08-01)
Target: `/work/pitchboulder` → WEDNESDAY ROOM chapter (`.wr`, `wr-*`)
Anchor: `/adventure/steel-and-dust` (`.sd-report`)
Mode: ANALYSIS ONLY — nothing under src/ touched, nothing committed.
Harness: headless Chrome via puppeteer-core, dev server read-only at :4321.

## 0. Verdict up front

The operator is right, and the emptiness is **not** where a reader would guess.
It is not "gaps between blocks" — the vertical rhythm is fine. It is **two
continuous vertical voids, 272px wide, that run the entire 3811px height of the
chapter, interrupted exactly once for 568px.** Together with the two in-column
holes they account for **40.9% of the chapter's total area**.

His hypothesis — "maybe it's optimized for smartphone" — is half right in a
precise way. The chapter is not *leaking* mobile styles onto desktop; it is
**authored as a phone document and then merely widened.** Every one of its 12
blocks shares one left edge and one of two widths. Desktop adds no layout, only
margin.

---

## 1. Structure as built (source)

`.wr` → padding `4rem 1.5rem 3rem` → two `.wr-inner` containers
(`max-width: 46rem`, `display:grid`, `gap: 1.3rem`) with one `.wr-bleed`
between them.

Reading order: kicker → heading → 4:3 hero → para → para → 4:3 photo
(`max-width:26rem`) → para → 1:1 + 1:1 duo → "full-bleed" band → aside
(text `1fr` / portrait `17rem`) → ledger intro para → season ledger panel →
italic closing para.

---

## 2. Measured dead space

### 2.1 Headline numbers @1280 (8px occupancy grid over the whole chapter)

| Metric | WEDNESDAY ROOM | steel-and-dust |
|---|---|---|
| Painted area (images + text lines + filled panels) | **51.0%** | 62.2% |
| Empty area | **49.0%** | 37.8% |
| Mean ink coverage per 4px scanline | **41.2%** | 55.3% |
| Height with < 25% coverage | **37.1%** (1412 of 3811px) | 20.6% |
| Content column width | **736px = 57.5% of viewport** | 960–1024px = 75–80% |
| Side rail, each side | **272px** | 160px |
| Rails as share of viewport width | **42.5%** | 25.0% |
| Top-6 empty rectangles | **40.9% of chapter area** | 23.8% |

### 2.2 Where the emptiness actually is — largest empty rectangles @1280

| # | Size | Position | % of chapter | What it is |
|---|---|---|---|---|
| 1 | 272 × **1992** | x=0, y=0 | 11.1% | left rail, unbroken |
| 2 | 272 × **1992** | x=1008, y=0 | 11.1% | right rail, unbroken |
| 3 | 272 × 1256 | x=0, y=2560 | 7.0% | left rail resumes below the band |
| 4 | 272 × 1256 | x=1008, y=2560 | 7.0% | right rail resumes |
| 5 | **320 × 400** | x=688, y=1040 | 2.6% | void right of the 26rem photo |
| 6 | **464 × 224** | x=272, y=2784 | 2.1% | void under the aside paragraph |

Rectangles 1–4 total **36.2% of the chapter**. They are one void per side,
split only because the band at y=1992–2560 interrupts them — the single
interruption in 3811px, and it lasts 15% of the height.

steel-and-dust's equivalent rails are 160px wide, total 21.0%, and are further
broken by the ghost chapter numerals (`.sd-chapter::before`, ≥1180px) which
render *into* the right rail, and by two genuine 1280px bleeds at x=0.

### 2.3 The two in-column holes (the ones the eye reads as "dead space here")

- **320 × 400 beside the 26rem photo.** The photo is 416px wide, flush left in
  a 736px column; the paragraph that would fill the void sits *below* it
  instead. Nothing is ever placed to the right of an image in this chapter.
- **464 × 224 under the aside paragraph.** `.wr-aside` is `1fr / 17rem`, the
  text runs ~5 lines (≈130px), the portrait runs 340px + caption. The paragraph
  ends and 464 × 224 of nothing sits beside the bottom half of the portrait.

steel-and-dust's biggest in-column holes are 584×136 (1.4%) and 632×96 (1.1%) —
roughly half the area — and both are the deliberate 3rem baseline drop under
the short member of a stagger pair, not orphaned space.

### 2.4 Vertical rhythm is NOT the problem

Measured gaps between the 12 children of `.wr-inner`:
`20.8, 30.4, 25.6, 20.8, 25.6, 25.6, 25.6, 27.2, 30.4, 24.0` px — a 9.6px
total range, all from one `gap: 1.3rem` plus `0.3rem` figure margins.
steel-and-dust: `0, 0, 0, 0, −52, 0, 32, 0, 0, 0, 0` — three distinct values
including a **−52px overlap**.

So: the chapter is not loosely spaced. It is tightly spaced and narrow. The
felt emptiness is horizontal, not vertical.

---

## 3. Why it reads formulaic — measured against the anchor

### 3.1 The single decisive number

| | WEDNESDAY ROOM | steel-and-dust |
|---|---|---|
| Distinct block **left edges** | **1** (x=272) | 3 (x=0, 128, 256) |
| Distinct block **widths** | **2** (736, 416) | 3 (768, 1024, 1280) |
| Distinct **media** left edges | 4 | 5 |
| Distinct **media** widths | 5 | 6 |
| Beat **overlaps** (negative gap) | **0** | 1 (−52px, pull quote onto media) |
| **True 100vw bleeds** | **0** | 2 |
| Rotated / tilted frames | 0 | 0 (intended −1.6°, see §3.4) |
| Pull quotes | **0** | 1 |
| Ghost chapter numerals | **0** | 3 |

**Every block in the chapter begins at exactly x=272.** That is the formula.
Twelve elements, one left edge. The reader's eye tracks a single vertical line
down 3811px and nothing ever crosses it.

### 3.2 steel-and-dust runs two measures at once; this runs one

- `.sd-col` → 48rem, `padding-inline: 2rem` → **text at 704px, x=288**
- media sections → `max-w-5xl px-8` → **media at 960px, x=160**

Media overhangs text by **128px on each side**. Widening happens *inside* the
page, so the rails never read as the dominant shape.

`.wr-inner` uses **one 46rem measure for text and images alike**. Result:
"the text uniformly fits to the photo and goes there" — literally true, they
are the same box.

### 3.3 Column ratios inside a beat

- `.sd-stagger`: `58fr 34fr` → 593 / 347 = **1.71:1**, with `.sd-stagger-b`
  dropped `margin-top: 3rem` so baselines do not align. Then `--flip` mirrors
  it to `34fr 58fr` — the heavy side changes sides across the page.
- `.wr-duo`: `1fr 1fr` → 359 / 359 = **1.00:1**, baselines aligned, both images
  1:1, both 8px-rounded, identical treatment. This is the "two squares" the
  operator named.
- `.wr-aside`: `1fr 17rem` → 464 / 272 = 1.71:1 — the correct ratio already
  exists in the chapter, used once, unmirrored, and it is the beat that leaks
  the 464×224 hole.

### 3.4 The one de-boxing device present is broken

`.wr-bleed` is documented in-file as *"the one edge-to-edge band — breaks the
46rem column entirely… 100vw"*. Measured: **1232px wide at x=24** — it sits
inside `.wr`'s `1.5rem` padding and never touches the viewport. At 390 it is
342px at x=24, i.e. exactly as wide as every other image on the page.

It is not a bleed. It is a wider box. That is why the rails survive it as a
24px seam and immediately resume at full width.

(Side finding on the anchor, not in scope but worth logging: `.sd-tilt`'s
`transform: rotate(-1.6deg)` is overridden by `html.js [data-reveal].is-revealed
{ transform: none }` in global.css — higher specificity. **The house "tilted
evidence frame" does not currently tilt on any page.** Measured 0 rotated
elements on steel-and-dust.)

### 3.5 Aspect-ratio sequence — a spec violation the static audit missed

Rendered orientation sequence, @1280:
`4:3 → 4:3 → 1:1 → 1:1 → 2.21 → 4:5`

Two same-aspect pairs back to back. The 1:1 duo shares **width AND orientation
AND treatment** — the spec's stated hard rule ("no two consecutive images share
the same width and orientation"; "grid-of-uniform-tiles is a closing module
only").

**At 390 it is worse.** `.wr-mid`'s `max-width: 26rem` (416px) never binds
because the column is only 342px — so the chapter's only scale-drop device
disappears on the phone:

| @390 | WEDNESDAY ROOM | steel-and-dust |
|---|---|---|
| Distinct media widths | **2** (342, 272) | 4 (150, 265, 325, 390) |
| Distinct media left edges | **1** (x=24) | 4 (x=0, 30, 60, 90) |
| Same-width+orientation adjacencies | **3** | 0 |
| True bleeds | 0 | 1 (390 @ x=0) |

Five of six images are 342px wide at x=24. steel-and-dust keeps its asymmetry
on mobile (`.sd-stagger-b` → `width: 82%; justify-self: end`).

**This corrects LAYOUT-AUDIT.md §6**, which scored pitchboulder "0 same-scale
violations… the best in-house example of smallness as a rhythm tool." That
holds at ≥760px only. The audit was static-source; rendered, the mobile view is
the operator's complaint in its purest form.

### 3.6 What the phone actually shows

Painted area @390: **WR 73.8% vs SD 70.2%.** The phone view is *denser* than
the anchor. So the dead space is genuinely a desktop condition — but its
*cause* is the mobile authoring, carried up unchanged. He diagnosed the
mechanism correctly even though the symptom does not appear on the phone.

---

## 4. Restructure proposals

Constraint honoured in all three: **every current image is kept**, no new
photography required, copy unchanged except one sentence promoted to a pull
quote (already-approved copy, not new writing).

### Rank 1 — "TWO MEASURES + LEDGER SPINE" (mockup A)

The one change that fixes the measured problem at its root: stop using one
width for everything, and convert the biggest empty rectangle into content.

1. **Split the measure.** Text at 40rem (640px); media at 64rem (1024px).
   Media overhangs text by 192px per side. (Anchor does 128px.)
2. **Ledger becomes the left spine.** At ≥1100px the season list moves out of
   the flow into a sticky 15rem rail on the left, running alongside the
   narrative. This directly consumes rectangle #1 (272 × 1992, 11.1% of the
   chapter) and is a device steel-and-dust does **not** use — so it satisfies
   LAYOUT-AUDIT F1 (each page must draw a *different* rhythm) instead of
   porting the newsstand grammar a fourth time.
3. **Hero to the wide measure**, cropped 16:9 — first beat is wider than the
   text, establishing the two-measure logic immediately.
4. **26rem photo + para 3 become a 34fr/58fr duo**, photo left, text right.
   Kills the 320×400 hole by putting the paragraph *in* it.
5. **The 1:1 duo becomes a stagger**: origami 58fr at 4:3, perlion 34fr at 1:1,
   dropped 3rem. No two adjacent images share width + orientation again.
6. **Pull quote overlapping the stagger by −3.25rem** — "Two years of the same
   room, recorded practically every time it met." (existing copy, para 2).
7. **Fix the band to a true bleed**: `margin-inline: calc(50% - 50vw); width:
   100vw`. Severs both rails for real.
8. **Aside portrait hangs into the right rail** at the wide measure while its
   text stays at 40rem — the 464×224 hole closes because the text column is
   narrower and therefore taller.
9. **Ghost "05" numeral** in the right rail, matching house grammar.
10. Mobile: spine returns to flow after the closing paragraph; the stagger keeps
    its asymmetry via `width: 82%; justify-self: end` (anchor's own mobile rule);
    `.wr-mid` gets `max-width: min(26rem, 76%)` so the scale drop survives at
    342px.

Risk: contained entirely in `pitchboulder.astro`'s scoped `<style>` +
markup. `CaseStudy.astro` (shared with Shelby) is not touched.

### Rank 2 — "CONTACT SHEET / DATE-STAMPED" (mockup B)

Atavist's date-cue rhythm rather than the anchor's newsstand rhythm. Keeps the
single measure but makes the column *wide* (58rem) and hangs a mono date/label
gutter in the left rail beside every beat, so the rail becomes an index rather
than a void.

1. 58rem column at 1280 (928px) — rails drop from 272px to 176px per side.
2. A **12rem mono gutter** ("JAN 14 · SESSION 01", "MAY 06", "APR 29") sits in
   the left rail beside each media beat. Rail becomes structure.
3. Images alternate flush-left / flush-right against the column, never both.
4. The 1:1 pair becomes a **3-up contact strip** at 1:1 with the wide band's
   crop reused as the third frame — the twins stop being twins by becoming a
   deliberate small triptych (spec block type 3).
5. True 100vw band, caption in the rail rather than overlaid.
6. Ledger stays inline but goes 3-column at the wide measure and loses its box
   border — rules only, so it stops reading as a panel.

Cheaper to build, less structurally distinct, but it directly attacks the
"boxes" read: nothing has a border, everything is hung off a rail.

### Rank 3 — "SESSION STACK" (not prototyped)

Reframe the chapter as N dated session cards, each a horizontal band of
`date | photo | note` at alternating heights, with the ledger as the final
band. Highest visual novelty, highest risk: it turns a narrative into a
catalogue and would need copy work to survive. Logged, not recommended now.

---

## 5. Mockups

Rendered, self-contained, real images, real tokens. Open in a browser:

- `<scratchpad>/wr-mock/mock-A.html` — Two measures + ledger spine
- `<scratchpad>/wr-mock/mock-B.html` — Contact sheet / date-stamped

Measured results after restructure are in §6.

## 6. Mockup measurements — same harness, same thresholds

### @1280

| Metric | WR now | steel-and-dust | **Mock A** | **Mock B** |
|---|---|---|---|---|
| Painted area | 51.0% | 62.2% | **70.4%** | **74.5%** |
| Empty area | 49.0% | 37.8% | **29.6%** | **25.5%** |
| Top-6 empty rectangles | 40.9% | 23.8% | **13.4%** | **13.4%** |
| Largest single void | 272×1992 (11.1%) | 160×1984 (5.5%) | **200×568 (2.8%)** | **472×472 (3.8%)** |
| Distinct media widths | 5 | 6 | 5 | **6** |
| Distinct media left edges | 4 | 5 | 4 | **6** |
| Distinct block left edges | **1** | 3 | 3 | 4 |
| True 100vw bleeds | 0 | 2 | **1** | **1** |
| Beat overlaps | 0 | 1 | **1** | **1** |
| Chapter height | 3811px | 4495px | **3145px (−17%)** | 4545px (+19%) |

### @390

| Metric | WR now | steel-and-dust | **Mock A** | **Mock B** |
|---|---|---|---|---|
| Painted area | 73.8% | 70.2% | 71.2% | 71.9% |
| Top-6 empty | 17.2% | 17.5% | **14.6%** | 15.4% |
| Distinct media widths | **2** | 4 | **5** | **6** |
| Distinct media left edges | **1** | 4 | **4** | **5** |
| Same width+orientation adjacencies | **3** | 0 | **0** | **0** |
| True bleeds | 0 | 1 | **1** | **1** |

Aspect sequences (both mocks): `16:9 → 4:3 → 4:3 → 1:1 → pano → 4:5`. The two 4:3
neighbours differ in width by 240px (A) / 375px (B), so the spec's "differ on at
least one axis" rule holds at every adjacency, at both breakpoints.

### Measurement notes / honesty

- Mock A's ledger spine is `position: sticky`. The occupancy grid counts a sticky
  element across its full containing-block extent, because that is what the reader
  experiences. Measured **statically** (spine counted only where it happens to sit
  at scroll 0), Mock A scores 58.7% painted / 24.8% top-6 empty — still far better
  than the 51.0% / 40.9% baseline, so the conclusion does not depend on the sticky
  accounting.
- Neither baseline page has any sticky element inside the measured scope, so their
  numbers are unaffected by that rule.
- The near-invisible ghost numerals (`rgba(255,255,255,.028)`) count as empty in
  every measurement, on both the anchor and the mocks. That is deliberate — they
  are atmosphere, not content.

### Open refinements before either is built

- Mock B @390: the overlapping perlion frame clips the origami caption. Needs the
  caption moved above the image or the offset reduced at ≤560px.
- Mock B is 19% taller than the current chapter; Mock A is 17% shorter. If scroll
  length matters, that is a point for A.
- Mock A's ghost numeral is "05" as a placeholder — the chapter's real position in
  the case-study rail should decide the digit.
- Both mocks reuse the existing approved copy verbatim, except Mock A's second
  aside sentence and Mock B's masthead stat block, which are **new phrasings of
  already-verified facts** and would need the operator's read-approval like the
  rest of the v2 copy.

## 7. What was NOT changed

Nothing under `src/`. No files baked into `public/`. No commits. The mockups and
all screenshots live in the scratchpad; the temp harness scripts (`_wf-*.mjs`)
were deleted after the run.
