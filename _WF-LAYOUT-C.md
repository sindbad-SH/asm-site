# _WF-LAYOUT-C — Desktop vs Mobile art-direction audit

STATUS: COMPLETE (2026-08-01). Analysis only — nothing under `src/` or `public/` was
touched, nothing committed. Dev server used read-only at http://localhost:4321/asm-site.

Pages: `/work/pitchboulder` · `/adventure/steel-and-dust` · `/venture/meme` ·
`/venture/afm-2025` (+ `/work/shelby-pebble-beach` pulled in for the hero defect, because
it shares `CaseStudy.astro`).

Widths: **1280×900** and **390×844**. Real-iPhone `svh` (390×745) measured separately for
the hero, because `svh` in headless Chrome equals the full viewport and understates the box.

Artifacts (scratchpad, not in the repo):
`C:\Users\Vince\AppData\Local\Temp\claude\C--builds-asm\4a0486cc-4b49-4674-bb57-4366ef4122c3\scratchpad\layout-c\`
- `HERO-CROP-PROOF.png` — the hero defect, with crop simulations
- `SCALE-LADDER.png` — every image beat as a share of viewport, desktop vs mobile
- `strip-<page>-D.png` / `-M.png` — full-page filmstrips at both widths
- `pb-desktop-y2600.png` — the dead-space screenshot
- `measure.json`, `space.json`, `hero/hero.json`, `scrim/scrim.json` — raw numbers

---

## 0. The verdict in one paragraph

The operator is right, and both halves of his sentence are true — but they are true at
*different sizes*, and they are the same defect seen from two ends. **Desktop's disease is
emptiness**: on the weak pages the median horizontal band of the page uses 54–58% of the
screen, and there are whole 1280×900 viewports carrying three lines of text. **Mobile's
disease is sameness**: the image-scale ladder collapses from 7–8 distinct widths to 2–5, 38–64%
of images end up exactly as wide as the paragraph column (his "the text uniformly fits to
the photo"), and the number of editorial images smaller than a quarter of the screen drops
to **zero on every page**. Neither is caused by "one build serving both". Both are caused
by a layout system that has exactly one composition and only ever *reflows* it.

---

## 1. Measured — desktop vs mobile

### 1.1 Page height and the ratio

| page | H @1280 | H @390 | ratio | screens @desktop | screens @mobile |
|---|---|---|---|---|---|
| /work/pitchboulder | 8471 | 9751 | **1.15** | 9.4 | 11.6 |
| /adventure/steel-and-dust | 6181 | 6798 | **1.10** | 6.9 | 8.1 |
| /venture/meme | 4426 | 6900 | **1.56** | 4.9 | 8.2 |
| /venture/afm-2025 | 8220 | 7913 | **0.96** | 9.1 | 9.4 |

The healthy signature for a photo-led page reflowing 1280 → 390 is a ratio around **1.8–2.5**
(the reading column narrows ~2×, images that were side-by-side stack). These pages sit at
1.10–1.15, and **afm-2025 is actually shorter on a phone than on a desktop**. That is the
tell: the mobile layout is not "the desktop layout, stacked" — it is the desktop layout with
the imagery shrunk hard enough to cancel out the stacking. The pictures lose their physical
presence rather than gaining it.

meme's 1.56 is the outlier in the good direction, and only because its desktop page is 54%
empty to begin with.

### 1.2 Horizontal ink coverage — the "dead space" claim, quantified

Method: every rendered leaf that carries text, an image, a border or a background is bucketed
into 20px horizontal bands down the whole page; per band I take the union left→right extent
as a share of the viewport. Page-wide ground planes excluded so a background colour doesn't
score 100%.

| page | desktop mean | desktop median | % of page under 60% wide | mobile mean | mobile median |
|---|---|---|---|---|---|
| steel-and-dust (**the bar**) | 71% | **75%** | **29.8%** | 82% | 84% |
| shelby-pebble-beach | 76% | 80% | 44.3% | 87% | 84% |
| afm-2025 | 69% | 75% | 38.4% | 85% | 90% |
| pitchboulder | 67% | **57.5%** | **64.2%** | 85% | 88% |
| meme | 54% | **52.5%** | **87.6%** | 79% | 84% |

Read that column: on `/venture/meme`, **87.6% of the page's vertical extent uses less than
60% of the screen width**. On `/work/pitchboulder` it is 64.2%. The exemplar is at 29.8%.
The pages the operator called "a lot of dead space" are precisely the pages with the most
horizontal emptiness, and the page he set as the bar is the one that fills its margins.

The mechanism, from the DOM: pitchboulder's case chapters render at x=304…976 (a 672px
column on a 1280px screen, 52.5%), and the Wednesday Room chapter at x=272…1008 (736px,
57.5%). Only the hero and one bleed image ever reach the edges. **672px at 18px type is 78
characters per line — that measure is editorially correct and should not change.** The
problem is not that the column is narrow. The problem is that nothing else is doing anything
with the other 600px, whereas the exemplar fills that space with rotated plates, ghost chapter
numerals, staggered second columns and a full-bleed band.

`pb-desktop-y2600.png` is the whole complaint in one frame: a 1280×900 screen containing a
five-dot chapter rail, an empty video facade, and three lines of body copy.

### 1.3 Image-scale variance — the "squares and boxes" claim, quantified

See `SCALE-LADDER.png`. Bars are each image's rendered width as a share of the viewport.

| page | distinct widths @1280 | distinct widths @390 | modal width @390 | share of images at that width | editorial images < 25% of viewport (D → M) |
|---|---|---|---|---|---|
| steel-and-dust | 7 | 5 | 85% | 36% | 3 → **0** |
| pitchboulder | 8 | 6 | 90% | 42% | 3 → **0** |
| afm-2025 | 8 | 4 | 90% | 60% | 1 → **0** |
| meme | 4 | **2** | 85% | 50% | 6 → **0** |

The desktop ladders have rungs — steel-and-dust runs 17/22/22/27/27/29/46/46/47/75/75/100.
The mobile ladders are walls — afm-2025 runs 43/43/51/86/90/90/90/90/90/90/90/90/90, nine
consecutive bars at exactly 90%.

**The zero column is the important one.** On all four pages, at 390px, the only image
narrower than a quarter of the screen is `veil-mark`, a decorative page-veil graphic. Not one
editorial image survives below 25%. The SPEC's rule —

> "Small images exist and are used on purpose … specifically to read as 'smaller than the
> hero'… smallness is a rhythm tool."

— is satisfied on desktop (3–6 real small beats per page: the rotated plates, the ask thumb,
the roster portraits, the AA lockup) and **does not exist at all on a phone.**

### 1.4 "The text uniformly fits to the photo" — quantified

Images whose rendered width matches the body paragraph column to within ±10px:

| page | desktop | mobile |
|---|---|---|
| pitchboulder | 9% | **45%** |
| steel-and-dust | 0% | **38%** |
| meme | 11% | **56%** |
| afm-2025 | 14% | **64%** |

On desktop, images almost never share the text measure — they break out or inset. On mobile
they are the same object as the paragraph, because both are "the padded column". That is
literally what he described, and it is why the phone reads as a stack of identical cards.

### 1.5 object-fit cropping

| page | view | cover images | losing >15% of the source |
|---|---|---|---|
| pitchboulder | D / M | 9 / 9 | 3 / 3 |
| steel-and-dust | D / M | 11 / 11 | 2 / 2 |
| meme | D / M | 4 / 4 | 2 / 2 |
| **afm-2025** | D / M | 13 / 13 | **11 / 11** |

**afm-2025 is a separate, source-level defect.** Every one of its 16 media files is
`1600×1600` — square. The page then imposes 2:1, 16:9, 3:2 and 4:3 boxes on them:

- `venue-century-plaza` — square source in a 2:1 box → **50% of the frame discarded**
- `hero` — square source in a 16:9 box → 44% discarded
- `panel-stage`, `panel-seated`, `panel-mics`, `podium-lectern` — square in 3:2 → 33% discarded

…with hand-tuned `object-position: 50% 55% / 58% / 60% / 68%` values, which is someone
nudging heads back into frame one image at a time. The aspect-ratio "variety" on that page is
not art direction; it is 11 different crops of the same square, and the **identical** crop is
applied on the phone. This page has the most to gain from art direction and currently has the
least (one width media query in a ~700-line file).

Two frames on steel-and-dust (`joust-riders`, `melee-arena`) are 16:9 sources in 4:3 boxes at
both sizes — 25% discarded, same crop both ways.

### 1.6 Type

Smallest rendered text (excluding sr-only):

| page | desktop | mobile |
|---|---|---|
| steel-and-dust | 8.8px (`.sd-plate figcaption`) | **8.32px** |
| pitchboulder | 9.6px (`.case-hook-credit`) | 9.6px |
| meme / afm-2025 | 9.92px (`.footer-buyer`) | 9.92px |

`src/pages/adventure/steel-and-dust.astro:475` sits inside `@media (max-width: 1023px)` and
sets `.sd-plate figcaption { font-size: 0.52rem }` — down from `0.55rem`. **The one piece of
mobile-specific art direction in the exemplar's caption system makes captions *smaller* on
the phone.** Captions are the house's signature editorial device on every page; at 8.32px
uppercase with 0.22em tracking they are decoration, not text.

Line length is fine where it matters (78ch on the desktop body), with one exception:
`.sd-attrib` runs 122ch at 11.52px on desktop.

Body copy shrinks going to mobile (17.92→16.32px on pitchboulder, 19.2→16.8px on afm) — a
clamp() consequence, defensible, but worth knowing it's a downward move.

### 1.7 Tap targets (390px)

| page | links/buttons under 44px tall | total |
|---|---|---|
| pitchboulder | **32** | 36 |
| steel-and-dust | 18 | 21 |
| meme | 19 | 21 |
| afm-2025 | 17 | 19 |

Height distribution is 17px / 18px / 20px / 24px. Concretely: the sixteen `wr-ledger-co`
company rows on pitchboulder are 216×**23.8px**; every footer link is 17–18px; the inline
"Watch the full film on YouTube ↗" on steel-and-dust is 239×**14.9px**. Only the nav (36–38px)
approaches the target. Nothing on the site meets 44px.

### 1.8 Structure and overflow

No horizontal scroll and no overflowing element on any page at either width — the fluid
system is technically clean. What it does instead is *stack*: 20–40 grid/flex containers per
page collapse to a single column at 390px, versus 6–9 that are genuinely multi-column at 1280.

One genuine collapse defect found: `/venture/meme`'s 3-up roster becomes 2 + 1 orphan at
390px (Nick Goins / Steve Borne, then Adam Smestad alone at half width). Visible in
`strip-meme-M.png`, column 4.

---

## 2. The HeroVideo crop defect — CONFIRMED

Evidence sheet: **`HERO-CROP-PROOF.png`** (crop simulations for two heroes + the actual renders).

**Cause.** `src/components/HeroVideo.astro:41` emits a bare `<img class="hero-video__poster">`
— no `<picture>`, no `<source>`, so there is no mechanism to serve a different crop.
`src/styles/global.css:853` sets `.hero-video { min-height: 90svh }` and `:866` sets the poster
to `object-fit: cover` with default `object-position: 50% 50%`. On a phone the hero box is
therefore taller than it is wide while every poster in `public/media` is landscape.

**Measured.**

| page | viewport | hero box | box AR | poster | poster AR | source px shown | **visible** | discarded |
|---|---|---|---|---|---|---|---|---|
| pitchboulder | 1280×900 | 1280×810 | 1.580 | 1600×810 | 1.975 | 1280×810 | 80.0% | 20.0% (sides) |
| pitchboulder | 390×844 | 390×760 | **0.513** | 1600×810 | 1.975 | 416×810 | **26.0%** | **74.0%** |
| pitchboulder | 390×745 (real iPhone svh) | 390×671 | 0.582 | 1600×810 | 1.975 | 471×810 | **29.5%** | 70.5% |
| shelby | 1280×900 | 1280×810 | 1.580 | 1600×900 | 1.778 | 1422×900 | 88.9% | 11.1% |
| shelby | 390×844 | 390×760 | 0.513 | 1600×900 | 1.778 | 462×900 | **28.9%** | **71.1%** |
| shelby | 390×745 (real iPhone svh) | 390×671 | 0.582 | 1600×900 | 1.778 | 523×900 | **32.7%** | 67.3% |

The brief's prediction (0.51:1 box, ~1.98:1 poster, ~29% visible) is **exactly right**. Headless
Chrome measures 26.0% because with no browser chrome `svh == lvh`; on a real iPhone with the
address bar showing it is 29.5%. Either way: **a phone visitor is shown a vertical strip through
the middle quarter of the frame, and 70–74% of every hero image is thrown away.**

Because `cover` on a portrait box crops a *landscape* source at the **sides**, the loss is
compositional, not just quantitative. On `/work/pitchboulder` the source frame is a presenter
standing at the right of a full room; the phone keeps source px x=592…1008, which is the back
wall, some seated heads and a table. **The presenter — the subject of the photograph — is cropped
out entirely.** The frame stops being a picture of anything.

**Blast radius today.** `HeroVideo` is consumed by `CaseStudy.astro` (so `/work/pitchboulder`
and `/work/shelby-pebble-beach`, i.e. the whole /work lane and every future case page) and by
`/adventure/field.astro`, where it is currently gated off behind
`existsSync(public/media/adventure/reel-loop.mp4)` — it will inherit the defect the moment a
reel ships. Not literally every page today, but every page built on the case template.

**Related: the scrim degrades with the crop.** Luminance sampled behind the hero headline with
the type hidden, contrast computed against white:

| page | view | mean contrast | % of area below 4.5:1 | % below 3:1 |
|---|---|---|---|---|
| pitchboulder | desktop | 5.04 | 35.7% | 8.3% |
| pitchboulder | mobile | 5.46 | 31.8% | 6.0% |
| shelby | desktop | 4.07 | 44.2% | 21.3% |
| **shelby** | **mobile** | **3.55** | **51.4%** | **29.3%** |

On `/work/shelby-pebble-beach` at 390px, over half the area behind the headline gives white
text less than 4.5:1 and nearly a third falls below **3:1** — failing even the large-text
threshold. It gets worse from desktop to mobile because `.hero-video__scrim` is a radial
gradient (`120% 78% at 50% 50%`) tuned for a wide box; squeeze the box to 0.51:1 and the
transparent centre of that radial now sits exactly where the bright hood of the car ends up.
Visible in the proof sheet: the headline sits on sky and blue paint.

---

## 3. The strategy question

> "is it better to have a one size fits all like we build the website once and it's optimized
> for both website and phone even if it's not great for either, or is it better to have
> essentially two versions of the website that can adjust depending on what form it's for."

### 3.1 First: is the premise true? Yes — but not for the reason implied

The site *is* compromised at both sizes. Sections 1.2 and 1.3 prove it with numbers. But
the two compromises point in **opposite** directions:

- **Desktop is under-composed.** Median band 52–58% of the screen on the weak pages. Whole
  viewports carrying three lines of text.
- **Mobile is over-flattened.** 2–5 distinct image widths, 38–64% of images identical to the
  text column, zero small images, page height that barely grows (and on afm actually shrinks).

A single build did not cause either. What caused both is that there is **one composition**,
and the responsive layer's entire vocabulary is *narrow the column* and *stack the grid*.
That is a design decision, not a delivery-architecture decision. Splitting the build in two
does not add a second composition — it just gives you two places to keep failing to write one.

Supporting evidence that this is a composition problem and not a "not enough breakpoints"
problem: the src tree already has **89 width media queries across 29 different breakpoint
values** (640, 760, 860, 1024, 780, 480, 880, 768, 761, 1180, 560, 960, 1280, 720, 700, 1023,
900, 620, 600, 879, 719, 520, 430 …). There is plenty of breakpoint machinery. It is nearly all
spent on shrinking and stacking. Meanwhile the page with the worst mobile result, afm-2025,
has exactly **one** width media query in a ~700-line file.

### 3.2 The three real options

**(a) Fluid responsive — what the site does now.**
One markup tree, one composition, breakpoints reflow it.
*Cost:* lowest. One page to write, one to QA, one to update.
*What it fixes here:* nothing that is broken. Everything in §1 is a measurement of this
approach's ceiling.
*Where it is genuinely correct:* nav, footer, forms, prose, link lists, the ~70% of any page
where the composition carries no meaning.

**(b) Art-directed responsive — same codebase, layouts that genuinely restructure.**
One URL, one content source, one deployment. Per-width *composition*: `<picture>` with portrait
`<source>`s for heroes; different aspect-ratio boxes per width; beats that are an asymmetric
2-up on desktop and an inset-alternating rhythm on the phone; devices that exist at only one
size (the −1.6° tilted plate is a desktop device; edge-to-edge full-bleed runs are a phone
device that desktop barely needs).
*Cost:* roughly 1.3–1.8× the CSS on the beats you art-direct, plus a media pipeline that emits
**2 crops per hero instead of 1**. On this codebase the fixes in §4 total an estimated **120–180
lines of CSS**, one component signature change, and a handful of re-crops.
*What it fixes:* every finding in §1 and §2.
*What it does not fix:* the desktop dead space is *also* an art-direction problem, but a
composition one — it needs new devices in `CaseStudy.astro`, not a breakpoint.

**(c) Two builds — separate mobile and desktop templates, or an m-dot site.**
*Cost:* 2× the templates, 2× the QA, and a per-request device-detection layer this project
does not have (static Astro → GitHub Pages, no server, no `Vary: User-Agent`; a client-side
switch would ship both payloads and wreck LCP).
*Maintenance / drift:* this is the decisive argument on **this** codebase specifically. Content
and layout are fused in the `.astro` pages — copy decks, captions and media maps are inline
consts (`sd.captions.*`, `pbMedia()`, the `COPY-DECK-*` values compiled into the page). A second
build forks the *copy*, not just the layout. The realistic failure is the one already visible in
the repo's own history: the PitchBoulder photo-replacement rider lands on one build and not the
other, and six months later the two versions disagree about which photographs the case study uses.
*SEO:* Google indexes mobile-first. With two builds the **mobile** build becomes the canonical
document — so a leaner mobile version silently determines your rankings and any desktop-only
content stops counting. Making that safe requires content parity plus `rel=alternate`/`canonical`
pairing plus correct `Vary` headers. You would be doing all that work to end up with content
parity — i.e. to end up back at (b), with extra steps.
*Where it is legitimately right:* when the two audiences want genuinely *different content* —
a field-use mobile app vs a desktop research tool. That is not this site. A phone visitor to
`/work/pitchboulder` wants the same case study.

### 3.3 Verdict

**(b). Art-directed responsive, applied selectively.** Not because "one build is best
practice" — because the specific defects measured here are asset-and-composition defects, and
a second build fixes none of them by existing.

The clinching evidence: **the single largest defect found — 74% of every hero frame discarded
on a phone — would survive a rebuild into two separate sites unchanged.** It is caused by a
missing `<picture>` element and a missing portrait crop. A second build would simply be a
second codebase with the same bare `<img>` in it. The right unit of "two versions" here is
**the asset and the beat**, not the site.

Decision rule to work by:

> Art-direct where the **composition carries meaning** — heroes, image-scale rhythm,
> multi-image beats, anything where the crop or the size *is* the editorial statement.
> Let the fluid system handle everything else — nav, footer, forms, prose, link lists.

Concretely, that is maybe 6 devices and ~15% of the page area. The other 85% should stay
exactly as fluid as it is now.

### 3.4 The thing he is actually sensing

Worth saying plainly: "it's optimized for smartphone as well" is the right instinct pointed at
the wrong target. The phone is not stealing quality from the desktop. **Nothing is optimised
for the phone** — the phone is getting the desktop's leftovers (its aspect ratios, its crops,
its caption sizes, its 24px tap targets), and the desktop is separately under-built in its own
margins. Fixing the phone will not cost the desktop anything. They are two different jobs that
happen to share a stylesheet.

---

## 4. Ranked fix list — impact per unit of work

Ranked by (measured defect size) ÷ (work). Nothing here has been implemented.

### R1 — Portrait `<source>` on HeroVideo + an aspect-aware hero box
**Fixes:** 70–74% of every hero frame discarded on phones; the subject cropped out of the
PitchBoulder hero; shelby's headline failing 3:1 contrast over half its area.
**Work:** add `posterPortrait?: string` to `HeroVideo.astro`, wrap the poster in `<picture>`
with `<source media="(max-aspect-ratio: 4/5)" srcset={posterPortrait}>`; add a matching
`min-height` clamp so a narrow hero is ~62–70svh rather than 90svh (that alone lifts visible
frame from 26% → ~38% for free); crop 2 portrait posters (4:5 or 3:4) from the existing
1600px masters. One component, two call sites, two new files.
**Blast radius:** every current and future `/work` case, plus `/adventure/field` the moment its
reel ships. Highest-value single change on the site.
*Also do:* make the scrim aspect-aware — a bottom-anchored linear gradient on portrait boxes
instead of the `120% 78% at 50% 50%` radial, which is what lets the shelby headline sit on sky.

### R2 — A mobile legibility floor (captions + tap targets)
**Fixes:** 8.32px captions on the exemplar; 32-of-36 links under 44px; 23.8px ledger rows;
14.9px inline links.
**Work:** delete the `.sd-plate figcaption { font-size: 0.52rem }` override at
`steel-and-dust.astro:475` and set a global caption floor of ~0.72rem (11.5px) at ≤640px —
captions should get **bigger** on a phone, not smaller; add a global rule giving standalone
links and list rows `min-height: 44px` via padding at ≤640px.
**Why this high:** it is ~20 lines, it is the difference between "editorial" and "cheap" in the
hand, and captions are the one device the SPEC calls the strongest cross-site convention. Not
art direction, but it is what makes the art direction readable.

### R3 — Restore the small-image rung on mobile (the "inset beat")
**Fixes:** the headline finding — zero editorial images under 25% of the viewport on any page;
modal image width 85–90% holding 36–60% of all beats.
**Work:** one CSS device, applied to existing markup. At ≤640px, tag ~2 beats per page as
`.beat--inset`: 58–64% width, alternating flush-left / flush-right, caption set in the counter-
gutter. Purely a class + ~25 lines; no new images, no markup restructure.
**Impact:** this is the single biggest cure for "just a bunch of squares and boxes", because it
reintroduces the one thing the phone lost completely — a second scale.

### R4 — Break the image-width ≡ text-column identity on mobile
**Fixes:** 38–64% of images rendering at exactly the paragraph measure — his "the text
uniformly fits to the photo", verbatim.
**Work:** one rule at ≤640px: an editorial `<figure>` is either **full-bleed** (100vw, breaking
out of the page padding) or **inset** (≤64%). Never exactly the text measure. ~15 lines. Pairs
with R3 — R3 supplies the small rung, R4 supplies the wide one, and together the mobile ladder
goes from 2–5 rungs to 4–7.

### R5 — Fix afm-2025's square sources
**Fixes:** 11 of 13 images losing 33–50% of the frame at *both* sizes; the worst mobile result
measured (13 beats, 4 distinct widths, nine consecutive bars at 90%).
**Work:** the sources are all 1600×1600 and the page crops them 11 different ways with
hand-nudged `object-position`. Either (a) emit per-beat crops from the media pipeline so the
aspect boxes are real, or (b) let the square be the mobile crop and ship a wide crop only for
desktop. Then give the page more than its single `max-width: 760px` media query.
**Why below R3/R4:** it is one page, and the work is in the media pipeline rather than CSS. But
per-page it is the largest gain available.

### R6 — Desktop margin devices in `CaseStudy.astro`
**Fixes:** the dead-space half of the complaint — 64.2% of pitchboulder's page under 60% width,
median 57.5% vs the exemplar's 75%; `pb-desktop-y2600.png`.
**Work:** port the exemplar's margin grammar into the case template — ghost chapter numerals
bleeding into the left gutter, one asymmetric stagger per case, one full-bleed band, side-set
captions instead of centred ones. **Do not widen the 672px reading column** (78ch is correct).
Note `CaseStudy.astro` is shared with `/work/shelby-pebble-beach`, so this ripples — that is a
feature here, both pages need it.
**Also:** the YouTube facade currently occupies a screen containing three lines of text. Pair
it with the caption/credit block or the pull quote.

### R7 — meme's desktop emptiness
**Fixes:** 87.6% of the page under 60% width, mean 54% — the emptiest page measured.
**Work:** the ghost "M E M E" letterforms already live in the margins and currently do nothing
at any size. Give them real scale and let one or two beats break the column. Lowest priority
(the audit correctly calls this a bones page), but it is the clearest single demonstration of
the desktop failure mode.

### R8 — Small correctness items
- `/venture/meme` roster: 3-up → 2 + 1 orphan at 390px. Force 1-up or 3-up, never 2+1.
- `.sd-attrib` runs 122ch at 11.52px on desktop — cap the measure.
- `joust-riders` / `melee-arena`: 16:9 sources in 4:3 boxes, 25% discarded at both sizes.

---

## 5. What I did NOT change

No edits under `src/` or `public/`. No bakes, no commits. The dev server was used read-only.
Temp harness scripts written to the repo root during the run (`_wf-measure-c.mjs`,
`_wf-shots-c.mjs`, `_wf-hero-c.mjs`, `_wf-space-c.mjs`, `_wf-scrim-c.mjs`, `_wf-ladder-c.mjs`,
`_wf-verify-c.mjs`, `_wf-proof-c.mjs`) were deleted on completion. All prototypes, screenshots
and JSON live in the scratchpad path at the top of this file.
