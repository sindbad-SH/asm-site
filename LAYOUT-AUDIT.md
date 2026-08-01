# LAYOUT-AUDIT — Sameness Audit of the 7 Story Pages

STATUS: COMPLETE (2026-08-01) — all 7 pages measured; findings + scorecard at bottom.
Session: 2026-08-01, successor to 12ab3daa (see LAYOUT-OVERHAUL-HANDOFF.md).
Spec measured against: C:\builds\asm\REFERENCE-RESEARCH\SPEC-EDITORIAL-LAYOUT.md

## Method

Static source analysis of each page's .astro markup + scoped CSS (block sequence,
image count, display widths, orientation, grouping, text-stretch lengths between
image beats). NOTE: scripts/measure.mjs from the prior session was lost with its
scratchpad — it is NOT in the repo. Rendered-DOM verification is deferred to the
adversarial-critic step (harness must be rebuilt then).

Metrics per page (from the spec's Measurable Rules):
- **Block sequence** — ordered list of blocks as the reader meets them.
- **Consecutive same-scale violations** — adjacent image beats sharing width AND
  orientation (spec: alternate at least one axis every beat).
- **Image density** — image beats vs words of running text (spec: 500-1500 words
  between beats is normal; editorial density is LOWER than ours).
- **Scale variance** — distinct display widths in the story body (uniform = bad).
- **Grid-as-body** — uniform tile grids inside the story body (spec: closing
  module only).
- **Caption discipline** — italic small caption directly under image, credit in
  brackets (genre convention, adopt verbatim).

## Pages

| # | Page | Status |
|---|------|--------|
| 1 | /adventure/steel-and-dust (EXEMPLAR) | DONE |
| 2 | /adventure/vybe (don't regress) | DONE |
| 3 | /venture/dawn-patrol | DONE |
| 4 | /venture/seriesfest | DONE |
| 5 | /venture/afm-2025 | DONE |
| 6 | /work/pitchboulder (+photo replacement rider) | DONE |
| 7 | /venture/meme | DONE |

---

## 1. /adventure/steel-and-dust — EXEMPLAR

**File:** src/pages/adventure/steel-and-dust.astro (media beats: 10 photos + 1 video loop; body text ≈450 words / 6 paragraphs incl. lede)

**Block sequence (desktop):**
1. Newsstand hero — 4:5 vertical cover `min(92vw,600px)` center + two 4:5 plates (200–300px, ±2.5° rotate) tucked behind — three images at TWO scales in one composition
2. Standfirst: slate + byline + lede w/ drop cap (48rem col)
3. Text stretch — 2 paragraphs
4. Video beat — 16:9 ambient loop, max-w-5xl (~1024px) ("video is the first visual after the opening text" — operator rule)
5. Text — 1 paragraph (afterVideo)
6. Ch.01 ghost numeral + **asymmetric stagger two-up**: 16:9 @58fr + 4:3 @34fr, second dropped 3rem
7. Pull quote — overlaps the stagger above (negative margin, shadowed panel)
8. Ch.02 + 1 paragraph prose
9. **Full-bleed band** — 100vw, max-height 76svh, caption overlaid on image
10. Second stagger two-up, **mirrored** (34fr 4:3 leading, 58fr 16:9 trailing)
11. Ch.03 + **duo**: tilted (−1.6°) 4:5 vertical @2fr beside prose + field-log panel @3fr
12. Closing wide — 16:9 @ ~1100px
13. Footer: attribution line + AA editorial-licensing band; back-links

**Metrics:**
- Consecutive same-scale violations: **0.** Every adjacent image pair differs in width, orientation, or grouping. The two stagger modules repeat but are mirrored and separated by 3 non-image beats.
- Distinct display widths in body: **~7** (300px plates, 600px cover, 34vw, 40vw, 58vw, ~1024–1100px column, 100vw bleed).
- Orientation mix: vertical 4:5 (cover, plates, pageant), landscape 16:9 + 4:3, full-bleed pano crop.
- Grid-as-body: **none.** No uniform tile module anywhere.
- De-box devices: overlap (pull quote onto media), tilt (pageant frame), rotation (plates), full-bleed, ghost chapter numerals, asymmetric/staggered baselines.
- Captions: every image captioned via `hud-label` (small caps/letterspaced house voice — a deliberate house variant of the genre's italic convention). Bleed caption overlays the image on a blurred chip.
- Image density: HIGH vs the Atavist norm (10 photos / ~450 words) — but the page reads as a photo-led "issue," and earns density through scale variance. **Calibration note: the exemplar's quality = variance + de-boxing, not text length.** Density alone is not the sin; uniformity is.

**Verdict: the taste anchor.** This page defines the house grammar the other six must be measured against: multi-scale hero composition, chapter voice, asymmetric pairs, one full-bleed, one overlap, one tilt, captions everywhere.

## 2. /adventure/vybe

**File:** src/pages/adventure/vybe.astro (12 photos + 1 video; body text ≈230 words / 6 short paragraphs incl. lede). v5, passed MEETS BAR after 4 critic rounds — **do not regress.**

**Block sequence (desktop):** Newsstand hero (600px 4:5 cover + 2 rotated 300px plates) → standfirst w/ drop cap → 1 para → 16:9 video @~1024px → ch. label + 1 para + stagger (58fr 4:3 / 34fr 4:5) → pull-quote overlap → **full-bleed 100vw** → mirrored stagger (34fr 4:5 / 58fr 3:2) → tilted 4:3 + field-log duo → ch. label + 1 para + stagger (58fr 4:3 / 34fr 4:5) → contained 2:1 @960px → closing contained 4:5 @26rem centered → LegendMark footer.

**Metrics:**
- Consecutive same-scale violations: **0** (stagger pairs internally alternate both width and orientation; adjacent modules never repeat scale).
- Distinct display widths: **~8** (300, 600, 26rem, 34vw, 40vw, 58vw, 960px, 100vw).
- Grid-as-body: none. Captions: all 12 + video, hud-label voice.
- Module repetition: **3 stagger two-ups on one page** (2 regular + 1 mirrored) vs the exemplar's 2 — highest stagger count of any page; acceptable but at the ceiling.
- Image density: very high (12 photos / ~230 words) — this is a photo-led piece even more than the exemplar; text stretches never exceed 1 paragraph.

**⚠ Cross-page finding (the audit's first big one):** vybe reached the bar by **porting the exemplar's grammar nearly block-for-block** (~85% identical block-type sequence: newsstand → standfirst → video → stagger → pull overlap → bleed → flip stagger → tilt+log → closing). Within-page variance is excellent; BETWEEN-page variance vs steel-and-dust is near zero. Two pages sharing one rhythm is a matched pair; five more ports would recreate the operator's complaint one level up — **the remaining 5 pages must draw DIFFERENT rhythm sequences from the spec (Atavist numbered-text-led, Alpinist orientation-led, Magnum repeating-unit), not the sd/vy newsstand grammar.**

**Verdict: PASS within-page, but locks the newsstand rhythm — no third page may use it.**

## 3. /venture/dawn-patrol

**File:** src/pages/venture/dawn-patrol.astro (14 photos + 1 video; body ≈650 words / ~9 paragraphs). Header comment states it outright: "built to the /adventure/steel-and-dust magazine grammar."

**Block sequence (desktop):** Full-bleed 100vw landscape cover (80svh) w/ masthead/titleblock + two 3:2 plates (120–190px, ±2°) pinned to corners → standfirst + LegendMark + lede → text stretch → 16:9 video @1024px → 1 para → Ch.01 stagger (58fr 16:9 / 34fr 4:3) + inline para → pull-quote overlap → Ch.02 prose → **full-bleed** (48svh) → duo--gap (32fr 2:1 / text) → Ch.03 duo: tilted 4:5 + prose + field log → stagger-flip (34fr **1:1** / 58fr 16:9) → Ch.04 duo--wide (46vw 16:9 / text) → stagger (58fr 16:9 / 34fr 4:3) → closing duo--flip (text / 46vw 16:9) → attrib footer.

**Metrics:**
- Consecutive same-scale violations: **0** strictly (adjacent images always differ in at least width). But **7 of 15 media beats are 16:9 landscape** — orientation variance is carried almost entirely by width changes; the source pack is all-landscape and it shows. The 1:1 engine detail and 4:5 tilt are the only true orientation breaks in the body.
- Distinct display widths: **~9** (plates, 32vw, 34vw, 40vw, 46vw, 58vw, 1024px, 100vw cover, 100vw bleed).
- Grid-as-body: none. Captions: all beats, hud-label voice + honesty footnote under field log.
- Duo modules ×4 (gap, judged, wide, flip) + staggers ×3 — the page paces image+text pairing better than sd/vy (more text interleave, ~650 words), closest of the three to the spec's editorial text-density norm.

**⚠ Cross-page finding (now confirmed as a pattern):** third consecutive page on the **same rhythm**: newsstand cover → standfirst → video-first → stagger → pull overlap → bleed → tilt+field-log → staggers → closing. Same 58/34 stagger geometry, same −1.6° tilt, same ghost numerals, same pull-quote shadow panel, same corner plates. The individual pages are each well-varied internally; the SITE is becoming one template with three skins. A visitor reading two stories back-to-back meets identical beats in identical order.

**Verdict: strong within-page; the sameness now lives at the template level, exactly one level above where the operator first saw it.**

## 4. /venture/seriesfest

**File:** src/pages/venture/seriesfest.astro — a HUB page by design (parent for 4 chapter pages), 5 images total (cover + 1 per chapter card), body ≈120 words.

**Block sequence (desktop):** Full-bleed 100vw cover (70svh, six typographic ranks — the newsstand grammar a 4th time) → standfirst + LegendMark + lede → 1 intro para → **uniform 2×2 card grid** (4 cards, all 4:3 images @22rem, identical treatment) → 1 close para → footer links.

**Metrics:**
- Consecutive same-scale: the four card images share width AND orientation AND treatment — **as a strict count, 3 violations**; as a grid module, it is ONE grouped beat, which the spec permits… for a closing "more to read" module.
- Distinct display widths: **2** (100vw cover, 22rem cards). Lowest scale variance of any page so far.
- Grid-as-body: **YES — the grid IS the body.** This is the exact page shape of the operator's complaint: one big photo, a chunk of text, then boxes stacked next to each other.
- Captions: none (link cards, alt-only). No caption voice at all.

**Assessment:** semantically the grid is legitimate navigation (Magnum confines grids to "next reads" modules, and this page IS a next-reads module with a cover on it). But visually it's indistinguishable from the anti-pattern, and the collision-map note in its header ("only 5 images survive dedup… skips the full-bleed convention") means it starved itself into uniformity. A hub can still vary: a featured/lead card at larger scale, alternating editorial rows, differing crops per chapter — none of that requires more images, only more layout.

**Verdict: FAIL on the operator's complaint despite being a "legal" hub. Needs a hub-appropriate rhythm (varied card scale/orientation), not a story-page port.**

## 5. /venture/afm-2025

**File:** src/pages/venture/afm-2025.astro — the "vs-*" pilot grammar (from seriesfest-2026.astro): mono slate → giant mixed-face headline → framed native-aspect hero → prose column → collage grid. 16 photos, 0 video; body ≈530 words in two prose columns.

**Block sequence (desktop):** head (slate + AFM headline + LegendMark) → framed hero @78rem (native aspect) → prose column, 6 paragraphs @44rem → **gallery dump #1: 9 bordered cards** in a 6-col span grid (spans 3,3,2,2,2,3,3,2,2, native aspects) → "Movement 2 · The Floor" heading + 4 paragraphs → **gallery dump #2: 6 cards** (spans 6,3,3,3,4,2) → footer link.

**Metrics:**
- Consecutive same-scale violations: **multiple.** The span sequence itself runs 3,3 then 2,2,2 then 3,3 then 2,2 — same-width neighbors dominate; native aspect ratios add some height jitter but rows of equal-width bordered tiles still read as boxes. Strict count within galleries: **≥6 same-width adjacencies.**
- Distinct display widths: nominally 5 (78rem hero + spans 2/3/4/6) — but variance is confined INSIDE two wall modules; the page-level rhythm is text-wall → image-wall → text-wall → image-wall.
- Grid-as-body: **YES, twice.** Both galleries are story body, not closing modules. This is the operator's complaint verbatim: "one big photo and then a chunk of text and then all the photos stacked next to each other like boxes."
- Captions: **zero on all 16 images.** Alt-only. Against the spec's strongest cross-site convention. The material has named, captionable content (Cinecittà pavilion, Egypt Film Commission, WV Film Office booth, Pitch Conference) begging for the caption+credit device — and LinkedIn mining (rider #2) can supply names/dates.
- Boxes, literally: every card has a 1px border + elevated background — framed boxes in a wall.
- No pull quote, no scale beat inside either gallery, no small/related-thumbnail device, no full-bleed.

**Verdict: WORST offender so far. The fix is not more images — it's redistribution: break the 15 gallery images into interleaved beats (hero → text → asymmetric pair → text → full-width → pull quote → small triptych → text → closing), Atavist-style, with captions throughout.**

## 6. /work/pitchboulder

**Files:** src/pages/work/pitchboulder.astro + src/components/CaseStudy.astro (shared template — Shelby uses it too; template edits ripple). No photo gallery passed, so the rendered page: full-bleed hook poster + h1 → sticky chapter rail → 01 Context (text + 16:9 context still) → 02 Ask (text) → 03 Work (text + LegendMark + YouTube embed) → 04 Outcome (text) → 05 Words (testimonial panel) → CTA → appended **Wednesday Room** chapter (46rem col: 4:3 hero → 2 paras → 4:3 @26rem → para → 1:1 duo @20rem ea. → italic close) → back-link.

**Metrics:**
- Consecutive same-scale violations: **0** (sparse imagery; WR chapter internally steps 46rem → 26rem → 20rem-pair — a genuine scale-drop rhythm, the best in-house example of "smallness as a rhythm tool").
- The numbered-chapter case body is Atavist-shaped on paper (text-led, numbered sections) but **visually monotone**: every chapter is the same centered column, no pull quote, no scale change, and its only two images are 16:9 at the same column width.
- Captions: WR chapter yes (mono voice, real names — Jantzen/Leyden Space, Chang/Perlion); case-body images **no captions at all** (context still even has empty alt).
- **The rider's target confirmed:** the case's image pool is one fixed-camera session recycled — `hook-poster` appears as this page's hook AND /venture's PitchBoulder chapter card (+ its loop poster); `coworking-crowd`/`coworking-presenter` (same camera position) carry /venture; `context.avif` is the same room again. Two staged Wednesday-Room picks were already cut for colliding with these. **Whole-site PitchBoulder visual identity ≈ 4 near-identical wide room frames.** Fix per handoff: mine E:\Pitch Boulder\2026 Recordings + 2025 for varied-scale frames (faces, slides, details, podium moments — the WR chapter proves the archive has them), replace the repeats, add captions with LinkedIn-verified names/dates.

**Verdict: layout structurally fine but flat; the sin here is image REPETITION + captionless case body, not grid abuse. Needs the photo replacement + 1–2 editorial beats (pull quote, scale variance) inside the case body — mind that CaseStudy.astro is shared with Shelby.**

## 7. /venture/meme

**File:** src/pages/venture/meme.astro — typographic single-column article (46rem), BONES by design (no MEME event photography exists; roster headshots + logo animatic only). ≈330 words / 6 paragraphs.

**Block sequence:** back-link → decode slate → italic title → LegendMark → framed 16:9 logo loop (ambient, captioned) → 6-paragraph text stretch → **uniform 3×1:1 roster grid** (headshots w/ name+role figcaptions) → CTA row → back-link. Ghost "M E M E" letterforms drift behind the column.

**Metrics:**
- Same-scale: the 3 roster cards are identical — but a contributors/roster grid is semantically tabular (magazine masthead convention), not story imagery. Strict count: 2; honest count: 0.
- Distinct display widths: 2 (46rem loop, ~15rem cards). Texture is carried by typography (ghost letters, decode slate, italic display), not images — appropriate to the material.
- Captions: yes on the loop and roster.
- Long unbroken text stretch: 6 paragraphs with no visual beat between loop and roster — the one place the spec's own devices (pull quote from the "Ides of March" founding line, an asterisk break, a scale-dropped roster) could earn variety without inventing imagery.

**Verdict: honest bones page, LOWEST priority. Improve typographic pacing only; no imagery to resequence until real MEME event photos exist (rights gates noted in its header).**

---

## Cross-page sameness findings

**F1 — The sameness has moved up one level.** Every audited page is now internally varied enough to pass the spec's letter (except afm + seriesfest hub), but **three pages run the identical newsstand/field-report rhythm** (steel-and-dust → vybe → dawn-patrol: six-rank cover, standfirst + drop cap, video-first rule, 58/34 staggers, pull-quote overlap, one full-bleed, −1.6° tilted frame + field-log panel, ghost chapter numerals, hud-label captions) — and the seriesfest hub wears the same six-rank cover on top of a card grid. A reader opening any two story pages meets the same beats in the same order. The operator's complaint was formulaic pages; the current trajectory produces formulaic TEMPLATE — same disease, higher altitude.

**F2 — Two pages still have the original disease.** afm-2025 (two prose-wall → gallery-wall dumps, 15 boxed images, zero captions) and the seriesfest hub (body = uniform 2×2 card grid) are the operator's complaint verbatim.

**F3 — Caption discipline is split.** sd/vy/dp: every image captioned. afm: 0 of 16. seriesfest hub: 0 of 4. pitchboulder case body: 0 (Wednesday Room chapter: all captioned, with verified names). The spec calls captions the single most consistent editorial device across every reference site — and LinkedIn mining (rider #2) can supply the names/dates the missing captions need.

**F4 — PitchBoulder's visual identity is 4 near-identical frames** from one fixed-camera session, reused across /work/pitchboulder and /venture (hook-poster appears on both). The rider's replacement mining (E:\Pitch Boulder\2026 Recordings + 2025) is confirmed necessary and the archive demonstrably has better frames (the Wednesday Room picks prove it).

**F5 — Family inventory (for the synthesis step):**
| Family | Pages (in scope) | Rhythm |
|---|---|---|
| Newsstand/field-report | steel-and-dust, vybe, dawn-patrol (+ sf-hub cover) | Magnum-derived, photo-led |
| vs-* headline+collage | afm-2025 | prose wall → gallery wall (broken) |
| CaseStudy template | pitchboulder (shared w/ shelby — edits ripple) | numbered text chapters (Atavist-shaped but visually flat) |
| Typographic bones | meme | single column + ghost letters |

**F6 — Recommended rhythm assignments for synthesis (each page a DIFFERENT documented sequence, per handoff):**
- **steel-and-dust** — untouched. The anchor.
- **vybe** — untouched (MEETS BAR, don't regress). The newsstand pair is now CLOSED.
- **dawn-patrol** — decision for synthesis: either accept as the 3rd newsstand page and cap the family, or (recommended) de-formalize toward the **Atavist text-led rhythm** it already leans to (most text of any page, numbered movements, honesty footnotes): drop the corner plates + one stagger, lengthen text stretches, keep its landscape cover. Smallest diff that breaks the triplet.
- **seriesfest hub** — hub-appropriate variance: featured lead card at hero scale + three subordinate cards at varied crops (Alpinist orientation-alternation applied to cards), no story-page port.
- **afm-2025** — full resequence to the **Magnum repeating-unit rhythm**: [image beat → heading → 2–3 paras → pull quote → small thumbnail → whitespace] per movement (Sessions / Pitch Conference / Panel / The Floor), redistributing the 15 gallery images into interleaved varied-scale beats; captions everywhere (LinkedIn-sourced names/dates).
- **pitchboulder** — keep CaseStudy structure (shared with Shelby); replace the repeated room frames with newly mined varied-scale frames, add captions to case-body images, one pull quote. Wednesday Room chapter already models the target rhythm.
- **meme** — typographic pacing only: pull quote break mid-stretch, scale-dropped roster. No imagery work.

## Scorecard vs spec rules

| Page | Same-scale adjacencies | Distinct widths | Grid-as-body | Captions | Verdict |
|---|---|---|---|---|---|
| steel-and-dust | 0 | ~7 | none | all | EXEMPLAR |
| vybe | 0 | ~8 | none | all | PASS (locked) |
| dawn-patrol | 0 (but 7/15 beats 16:9) | ~9 | none | all | PASS within-page; 3rd identical rhythm |
| seriesfest hub | 3 strict (card grid) | 2 | **YES** | none | FAIL (operator's complaint shape) |
| afm-2025 | ≥6 | 5 nominal / 2 effective | **YES ×2** | **0/16** | FAIL (worst) |
| pitchboulder | 0 | ~4 | none | partial | FLAT + repetition (rider target) |
| meme | 0 (roster exempt) | 2 | roster only | yes | BONES — typographic pacing only |

## Audit limitations

- Static source analysis (markup + scoped CSS). Rendered-DOM measurements (settled heights, actual px widths, stagger differentials) deferred to the adversarial-critic step.
- `scripts/measure.mjs` was lost with the retired session's scratchpad and **must be rebuilt** before the critic pass (spec for it: settled page height, stagger differentials, repeated-image detection via content hash, distinct display widths per page).
- Word counts are estimates from consts/inline copy (±10%).

STATUS: **COMPLETE** — all 7 pages measured, findings + scorecard above. Next pipeline step: design-system synthesis (per-page resequencing plans), then build.

---

## Cross-page sameness findings

(pending — filled after all 7 pages measured)

## Scorecard vs spec rules

(pending)
