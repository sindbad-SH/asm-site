# CRITIC REPORT — LAYOUT-OVERHAUL P1-P5 Adversarial Verification

Run date: 2026-08-01. Independent adversarial pass; builder claims re-measured, not trusted.
Baseline for diffs: 0c54e07. Dev server: http://localhost:4321/asm-site (running, untouched).
Method: git diffs vs baseline; rendered-DOM measurement + computed styles + element
screenshots via a temporary headless-Chrome variant of scripts/measure.mjs (1280x900 desktop
pass over 9 pages incl. /venture and /work/shelby-pebble-beach, then 390x844 mobile pass over
the 5 rebuilt pages); byte-level sha1 sweep of public/media/**; visual crop review of 20
screenshots. All sequential, one page at a time. Temp script + shots deleted after the run.

Builder's own numbers (_measure-results.json) REPLICATED EXACTLY on the desktop pass
(heights, media counts, width ladders, violation counts, caption counts) — the harness is
honest; its one blind spot is documented under P3 below.

---

## A. P1 — /venture/afm-2025 (c9b6bc2)

| # | Check | Result | Evidence |
|---|---|---|---|
| A1 | No gallery-wall modules | **PASS** | `.vs-gallery`/`.vs-card` count in rendered DOM = 0; old 6-col span grid gone from source |
| A2 | >=5 distinct display widths, distributed | **PASS** | 10 widths (200/416/426/480/544/640/710/960/1137/1152), spread across all four movements, not confined to one module |
| A3 | No adjacent standalone beats share width AND orientation | **PASS** | 0 standalone violations at 1280x900 (re-measured) |
| A4 | 100% caption coverage | **PASS** | 13/13 media have real figcaptions |
| A5 | Prose P1-P6 + 4 FLOOR paragraphs verbatim vs 0c54e07 | **PASS** | programmatic whitespace-normalized string compare: 6/6 inline paragraphs verbatim-present, 4/4 FLOOR paragraphs identical |
| A6 | Movement structure in DOM order | **PASS** | measured order: hero(capt) → M1 kicker → fullbeat → asym pair → M2 kicker → thumbrow(200px) → pull quote → M3 kicker → small diptych → M4 kicker → floor heading → widest(2:1) → duo → pair-flip → duo-flip → closer → italic close |
| A7 | Crops don't behead subjects | **PASS** | screenshots: 16:9 hero @50%60% — all six panelists intact, AFM wordmark legible; 2:1 Century Plaza @50%68% — sculpture fully in frame, "CENTURY PLAZA" sign fully legible; 4:5 podium-speaker @60%50% — standing speaker intact head-to-feet |

Documented deviation (accepted): plan's M3 "small triptych" shipped as a 2-image diptych;
panel-seated moved to M1's pair; header documents why. A6's "small grouped beat" is satisfied.

Notes (non-blocking):
- `podium-speaker` (M1 pair) and `podium-lectern` (M3 diptych right) are the SAME speaker,
  stage and session from near-identical angles — a visual near-dupe across movements. The cut
  list caught podium-address but not this pair. Cosmetic; flag for the operator's read/look pass.
- `step-and-repeat`'s alt ("blue AFM-branded step-and-repeat backdrop") reads oddly against
  the frame (evening lounge with an AFM25 poster standee); the rendered caption ("Between
  sessions, off the stage.") is fine. Alt is carried verbatim from the prior build.

**Verdict: PASS**

## B. P2 — /venture/seriesfest (98fd027)

| # | Check | Result | Evidence |
|---|---|---|---|
| B1 | Body no longer a uniform grid | **PASS** | four `.sf-row` rows, each a different computed layout; no grid module in DOM; full-page screenshot scans as a contents page |
| B2 | Four different row layouts | **PASS** | computed grid-template-columns: featured `583px/342px` (58fr/34fr, 16:9 img 583x328); banner single-col (2:1 img 480x240 contained at 30rem); thumb `725px/200px` (200x200 square); portrait `320px/605px` (4:5 img 320x400) |
| B3 | >=3 distinct card-image widths, >=2 orientations | **PASS** | widths 583/480/320/200 (4); orientations L/SQ/P (3) |
| B4 | Hairline-separated, not boxed | **PASS** | computed styles: rows 2-4 border-top 1px solid only; row 1 none; all rows transparent background, no side/bottom borders, no box-shadow |
| B5 | All 4 chapter links navigate | **PASS** | HTTP 200 for /venture/seriesfest-2025, -2026-soul-power, -2026-fashion-in-focus, -2026 |
| B6 | Crops keep subjects | **PASS** | screenshots: featured — moderator intact, SeriesFest/Season wordmark partially legible (numeral cropped, subject unharmed); banner — press wall + camera crews intact; thumb — runway model intact at 200px; portrait — six-person lineup, all heads intact |

Notes: banner row shipped at 30rem, not the plan's ~46rem (acceptance doesn't name a width —
fine). Chapter-to-layout mapping differs from the plan sketch (banner=Soul Power,
portrait=Season 12, swapped) — acceptance requires four distinct layouts, which holds.

**Verdict: PASS**

## C. P3 — /work/pitchboulder (58bcbfd)

| # | Check | Result | Evidence |
|---|---|---|---|
| C1 | Old top-down frame retired; hook-poster.avif changed | **PASS** | hook-poster.avif 58661→43713 bytes in 58bcbfd; visual compare confirms OLD = elevated top-down box-opening frame, NEW = branded eye-level frame of loop.mp4 (PitchBoulder lockup, presenter at screen). Byte-sweep of public/media/**: the old frame's content exists under no filename |
| C2 | Zero shared image content between /work/pitchboulder and /venture | **FAIL — BLOCKING** | see below |
| C3 | Hook is hook-podium-1600.avif | **PASS** | rendered currentSrc = .../media/work/pitchboulder/hook-podium-1600.avif |
| C4 | Context still = context-room-1600.webp + caption | **PASS** | rendered src confirmed; figcaption "The room at work — January 28, 2026 session." |
| C5 | Ask-thumb ~240px, date-only caption | **PASS** | rendered width 240px; caption "A founder takes the floor — April 29, 2026." — no name invented |
| C6 | Pull quote renders once | **PASS** | `.case-pull` count = 1; not repeated in Wednesday Room |
| C7 | Hook credit internally consistent | **PASS** | credit text: "On the wall: Alana Arnold, MD, MBA pitching PEMPal — Boulder Startup Week session, May 6, 2026"; screenshot shows slide titled "Every Parent's Worst Fear" with PEMPal logo — consistent |
| C8 | Shelby renders zero new beats | **PASS** | rendered /work/shelby-pebble-beach: .case-cap=0, .case-pull=0, .case-askrow=0, .case-hook-credit=0; context img alt="" (empty string); page source diff vs 0c54e07 = none |

### C2 — the blocking finding

`context-room-*` is **byte-identical** to `coworking-presenter-*` in every variant:

```
sha1 b2c7f1281612...  context-room-1600.avif == coworking-presenter-1600.avif
sha1 9b88e22218c4...  context-room-1600.webp == coworking-presenter-1600.webp
sha1 f9b721f22cfa...  context-room-900.avif  == coworking-presenter-900.avif
sha1 7da64f4ec432...  context-room-900.webp  == coworking-presenter-900.webp
```

- /venture RENDERS coworking-presenter-1600 (venture.astro line 125 `pbTalk`, the `im-pb-talk`
  collage card; confirmed in rendered DOM, sha b2c7f1281612).
- /work/pitchboulder renders context-room-1600.webp as chapter 01's context still (sha
  9b88e22218c4).
- Same photograph, both pages. The P3 acceptance line — "zero images shared between
  /work/pitchboulder and /venture" — is violated.
- Root cause: make-pitchboulder-variety.mjs baked `context-room` from
  `E:/Pitch Boulder/2026 Recordings/1-28-2026/Photos/Edited/_TIER 1 - TOP/DSC08258.jpg`,
  the same source frame already baked on 2026-07-12 as `coworking-presenter` with identical
  sharp settings → identical output bytes. The plan's own P3a dedupe rule ("perceptual-hash
  dedupe against ALL existing public/media/**") did not catch it.
- Why the builder's harness shows zero cross-page repeats: /venture's `<picture>` serves the
  AVIF encoding while the case page's bare `<img>` fetches the WEBP — different bytes per
  format, same image. Fetched-bytes hashing cannot see across encodings. (Also, /venture was
  not in the harness's default page list.)
- Fix options (builder's choice): re-pick the context still from a different Jan-28 edited
  frame, or retire/replace /venture's pbTalk collage card. Either satisfies the criterion.

Notable (non-blocking): the new hook h1 ("The work we do for PitchBoulder...") and the credit
line render in low contrast directly over the slide's bright white area — legibility is
noticeably worse than over the old dark frame. Recommend a stronger scrim or text
repositioning when the C2 fix is made. Also "A founder takes the floor" beside a "Reminders"
slide is an in-frame-unverifiable characterization — already inside the operator read-approval
gate, so noted for that read.

**Verdict: FAIL (C2 blocking; everything else passes)**

## D. P4 — /venture/dawn-patrol (45822bd)

| # | Check | Result | Evidence |
|---|---|---|---|
| D1 | Zero cover plates | **PASS** | `.dp-plate` count = 0 (baseline had 2); cover reads as clean full-bleed opener in screenshot |
| D2 | Exactly 2 staggers + 1 equal diptych | **PASS** | `.dp-stagger` = 2 (one `--flip`), `.dp-diptych` = 1 (baseline: 3 staggers, 0 diptychs) |
| D3 | Pull quote plain | **PASS** | computed: box-shadow none, border 0/0/0/0, background transparent, margin-top 0; wrapper margin-top +24px (baseline: -3.25rem overlap at >=1024px). Screenshot: bare italic line |
| D4 | >=2-para unbroken stretch after video | **PASS** | afterVideo + beforeLight render as 2 adjacent `<p>` in one block between video and first stagger |
| D5 | Page height <= ~6300px | **PASS** | settled height 6255px (matches builder's measured 6255; the plan note's "h=5674" is stale) |
| D6 | Captions intact | **PASS** | 13/14 captioned; the uncaptioned one is the cover, same convention as steel-and-dust/vybe covers (title-block composition) |
| D7 | Untouched bleed renders | **PASS** | eighteenth-green-sunrise-1600.avif lazy-loads in headless; rendered 1280x432, real content visible in full-page screenshot |
| D8 | Block-sequence overlap vs steel-and-dust < 60% | **PASS (with caveat)** | side-by-side below |

D8 side-by-side (module sequences, rendered DOM order):

```
steel-and-dust:  cover+2plates | video | stagger | pull(OVERLAP panel) | bleed | stagger-flip | tilt+log duo | closing-wide
dawn-patrol:     cover(plain)  | video | stagger | pull(PLAIN)         | bleed | duo-gap | tilt+log duo | stagger-flip | duo-wide | diptych | duo-flip
```

- Treatment-aware ordered overlap (the audit's original metric — same beat, same treatment,
  same order): 4 of sd's 8 beats survive in order (video, stagger, bleed, tilt+log-duo;
  stagger-flip now arrives AFTER the tilt+log duo, breaking the shared order) ≈ **50%** — under
  the 60% target. Down from the audit's ~90%: plates gone, pull de-formalized, third stagger →
  diptych, closing solo → duo, two new duo variants + diptych dilute the back half.
- Caveat, honestly stated: type-vocabulary overlap (ignoring order and treatment) is still
  ~70% because video-first, staggers, one bleed, tilt + field-log were KEPT by explicit plan
  decision (operator's video-first rule etc.). The de-formalization is real but the two pages
  are still recognizably cousins. Within the plan's own definition: target met.

**Verdict: PASS**

## E. P5 — /venture/meme (4623591)

| # | Check | Result | Evidence |
|---|---|---|---|
| E1 | DOM order paras(3) → pull → paras(3) → break → roster | **PASS** | measured .meme-inner child order: back, slate, title, proof, loop, para x3, PULL, para x3, BREAK(✳), ROSTER, ctas, back |
| E2 | Roster ~36rem centered | **PASS** | rendered 576px (=36rem) wide, left/right margins 352px/352px (perfectly centered); reads as masthead credits in screenshot |
| E3 | No imagery added | **PASS** | commit touches only meme.astro (+41/-3), no media files; rendered img count 4 (loop poster + 3 pre-existing headshots) |
| E4 | Pull facts match paragraph above | **PASS** | pull: "Founded on the Ides of March, 2020 — built so Colorado's filmmaking talent doesn't have to leave the state." Para 3 above: "founded on March 15, 2020 — the Ides of March ... keep Colorado's filmmaking talent ... from having to leave the state". Facts identical |

Notes (non-blocking, pre-existing): the loop figcaption ("MEME's own animated mark, in
motion") overlaps the poster's own baked-in "A NOT-FOR-PROFIT COMPANY" text — white-on-white
mush at the bottom of the loop frame. Predates P5 (P14b-era); cosmetic. The harness's 1
"standalone violation" on this page is a false positive: it is the loop's poster `<img>` and
its own `<video>` layer in one figure (same box), counted as adjacent media — present
identically in the builder's run.

**Verdict: PASS**

## F. Non-regression — /adventure/*

- **F1 PASS**: `git diff 0c54e07..HEAD -- src/pages/adventure/` is empty. Nothing changed.
- **F2 PASS**: re-measured — steel-and-dust: h=6181, 13 media, 0 standalone violations,
  0 within-page repeats, 11/13 captioned (cover + aa-logo uncaptioned, unchanged baseline
  behavior). vybe: h=6746, 15 media, 0 violations, 0 repeats, 14/15 (cover uncaptioned,
  baseline behavior). Identical to the builder's numbers.

## G. Global

- **G1 cross-page content-hash sweep (9 pages incl. /venture)**: at the fetched-bytes level,
  zero repeats between /work/pitchboulder and /venture — but the BYTE-LEVEL FILE SWEEP proves
  the C2 encoding-blind-spot duplicate (see C2, blocking). Other hash repeats found, all
  pre-existing by design, none introduced by P1-P5:
  - meme-poster.avif on /venture + /venture/meme (the same loop's poster in both places);
  - dawn-flare/heritage/engine-900.avif on /venture + /work/shelby-pebble-beach (P21b's
    deliberate "reused, not re-cut" collage set);
  - shelby beauty-front == shelby poster (same page, its own video poster).
- **G2 mobile 390x844, all 5 rebuilt pages: PASS** — scrollWidth = 390 everywhere (<=395, no
  horizontal scroll). Grids collapse per CSS intent: vs-pair/vs-duo/vs-thumbrow → single
  column; all four sf-rows → single column; case-askrow → single column; dp-stagger/dp-duo →
  single column; deliberate exceptions behave as coded (vs-diptych-row stays 2-up 169px+169px;
  meme roster 2-col 155px+155px at <=640px; dp-diptych collapses to 1-col at <=640px).
  Mobile same-width adjacencies exist (3/1/0/4/1) — inherent to single-column stacking, the
  spec's adjacency rule is a desktop-layout rule; the untouched exemplar pages stack the same
  way. Not failed.
- **G3 adversarial extras**: across all 14 measured page loads: **zero console errors, zero
  page errors, zero failed/4xx/5xx requests** (lazy-load fully exercised by scroll pass).
  No layout voids, no overlapping beats, no broken images in any full-page screenshot.
  Findings not named by any criterion, all recorded above: AFM podium near-dupe pair (A
  notes), hook h1/credit contrast over the bright slide (C notes), meme caption/baked-text
  collision (E notes), stale "overlaps the stagger above" comment in dawn-patrol.astro
  (comment only), plan checklist not updated for P3, plan's stale "h=5674" note for P4.
  Environment artifact: the Astro dev toolbar pill appears mid-page in two full-page
  screenshots — dev-server UI, not page content.

---

## Verdict table

| Page | Verdict | Blocking issues |
|---|---|---|
| P1 /venture/afm-2025 | **PASS** (notes: podium near-dupe pair, step-and-repeat alt) | none |
| P2 /venture/seriesfest | **PASS** | none |
| P3 /work/pitchboulder | **FAIL** | context-room-* byte-identical to coworking-presenter-* which /venture renders (pbTalk collage card) — violates "zero images shared between /work/pitchboulder and /venture". Fix: re-pick the context frame or replace /venture's pbTalk card, then re-verify |
| P4 /venture/dawn-patrol | **PASS** (caveat: type-vocabulary overlap with sd still ~70%; treatment-aware ~50%, under target) | none |
| P5 /venture/meme | **PASS** (pre-existing caption/baked-text collision noted) | none |
| Non-regression sd/vybe/shelby | **PASS** | none |
| Global (mobile, errors, repeats) | **PASS** (C2 exception recorded under P3) | — |

## GATE: **STAGING PUSH BLOCKED** — P3 is FAIL until the context-still duplication with /venture is resolved and re-verified.

The fix is small (one re-bake with a different Jan-28 frame, or one /venture collage-card
swap). Everything else across all five pages held up under re-measurement, computed-style
inspection, git verification, byte-level hashing, and visual crop review.
