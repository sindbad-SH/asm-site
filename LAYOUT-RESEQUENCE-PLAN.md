# LAYOUT-RESEQUENCE-PLAN — Design-System Synthesis (pipeline step 2)

STATUS: COMPLETE (2026-08-01). Inputs: SPEC-EDITORIAL-LAYOUT.md (C:\builds\asm\REFERENCE-RESEARCH)
+ LAYOUT-AUDIT.md (this repo). Successor session to 12ab3daa; see LAYOUT-OVERHAUL-HANDOFF.md.

## BUILD PROGRESS (restart-safe; local commits only, NO push until critic passes)

- [x] P1 afm-2025 — c9b6bc2 (dev-verified: 10 widths, 0 standalone same-scale adjacencies, 12 captions)
- [x] P2 seriesfest hub — 98fd027 (dev-verified: 4 distinct row layouts, ladder 1265/583/480/200/320)
- [x] P4 dawn-patrol — 45822bd (dev-verified: 0 plates, 2 staggers + diptych, plain pull, h=5674)
- [x] P5 meme — 4623591 (dev-verified: paras3/pull/paras3/break/roster@576px)
- [ ] P3 pitchboulder — photo mining (E:\Pitch Boulder 2026+2025) + identify/replace the
      repeated room frame + prop-gated CaseStudy caption/pull-quote slots (Shelby-safe) +
      LinkedIn READ-ONLY caption mining
- [ ] Step 4: rebuild measure.mjs + adversarial critic pass over all 5 built pages
- [ ] Step 5: push to staging ONLY after critic passes

NOTE (all builds): dev-server HMR served stale style modules after full-file rewrites —
always restart the dev server before measuring. Browser-pane-hidden sessions never fire
native lazy-load; 0-height lazy images below the fold are an environment artifact, not a
page bug (confirmed on dawn-patrol's untouched bleed, files healthy on disk).

## Governing idea

The audit's core finding: within-page variance is mostly solved; BETWEEN-page variance is
not. Three pages run the identical newsstand/field-report rhythm, and the two remaining
offenders (afm, seriesfest hub) still have the original boxes disease. So the synthesis
assigns **one documented rhythm per page, no rhythm used twice** (beyond the already-locked
sd/vy pair), and fixes the two offenders by redistribution, not new photography (except the
PitchBoulder rider, which explicitly mines new frames).

| Page | Assigned rhythm | Source pattern |
|---|---|---|
| steel-and-dust | Newsstand/field-report (UNTOUCHED — anchor) | Magnum-derived house grammar |
| vybe | Newsstand (UNTOUCHED — MEETS BAR lock) | ditto |
| dawn-patrol | **Text-led dispatch** (de-formalized) | Atavist "Toxic Lies" |
| seriesfest hub | **Editorial contents page** | magazine TOC + Alpinist orientation alternation |
| afm-2025 | **Repeating unit per movement** | Magnum "Picturing a Place" |
| pitchboulder | CaseStudy kept; imagery replaced + captioned | Atavist numbered chapters (already its shape) |
| meme | Typographic pacing | Atavist "A Hollywood Ending" (divider + quote devices) |

Build order (risk/value-ranked, one page per commit):
**P1 afm-2025 → P2 seriesfest hub → P3 pitchboulder (incl. photo mining + LinkedIn captions) → P4 dawn-patrol → P5 meme.**
Staging push only after the adversarial critic (step 4) passes all five.

---

## P1 — /venture/afm-2025 (worst offender; no new assets needed)

Keep the page head (mono slate → giant AFM headline → LegendMark) and the framed
native-aspect hero — that identity is distinct from the newsstand family and worth keeping.
Everything below it resequences from two gallery dumps into four Magnum-style movements.
All 16 existing images redistribute; near-dupes may be cut (step-and-repeat-2 vs
step-and-repeat — keep one).

New block sequence:
1. Head + framed hero @78rem — **gains a caption** (device 9).
2. **Movement 1 · The Sessions** — heading → paras 1–2 → full-width `panel-stage`
   w/ caption → para (the Waymo/arrival thread) → asymmetric pair: `podium-speaker` (wide)
   + `venue-signage` (narrow, portrait-cropped) — widths 58/34, orientations differ.
3. **Movement 2 · The Pitch Conference** — paras 3–4 → **full-width bold pull quote**
   ("The story tells us why we care. The strategy tells us why it works.") →
   small ~200px-class inline thumbnail (`step-and-repeat`) beside text (device 10).
4. **Movement 3 · The panels** — paras 5–6 → **small triptych** (`panel-mics`,
   `podium-lectern`, `panel-seated`) — the Alpinist small-grid device (3).
5. **Movement 4 · The Floor** — heading → para 1 → full-width `venue-century-plaza`
   (night exterior — the page's biggest scale beat) w/ caption → para 2 → asymmetric
   pair `pavilion-cinecitta` + `pavilion-row-egypt` → para 3 → duo: `floor-wvfilm-booth`
   beside text → para 4 → contained wide closer `reception-evening`.
6. Footer link.
`stage-before-doors` opens Movement 4 or is cut if it double-serves; `podium-address` and
one step-and-repeat are the cut candidates (16 → ~13-14 used; silent caps logged in commit).

Captions: **every image**, mono/hud voice, facts only from in-frame verifiable content
(Cinecittà banner, Egypt Film Commission, WV Film Office table) + his own post copy already
in consts. No invented names.

Acceptance (critic-measurable): 0 gallery-wall modules; ≥5 distinct display widths spread
across the page (not confined to one module); no two adjacent image beats share width AND
orientation; caption coverage = 100% of images; text stretches of 2+ paragraphs between
image beats survive (don't image-stuff).

## P2 — /venture/seriesfest (hub; no new assets)

Keep cover + standfirst + intro para. Replace the uniform 2×2 grid with a **contents-page
column** — four chapter rows, each a DIFFERENT layout, numbered 01–04:
1. **2025 — featured row**: large landscape image (58fr) + body (34fr), date slate, biggest beat.
2. **Soul Power**: mirrored row, image right, **portrait 4:5 crop** (34fr), text left.
3. **Fashion in Focus**: small square thumbnail (~200px-class) beside text — the Magnum
   related-content device; deliberately the smallest beat.
4. **2026 finale**: wide 2:1 crop at reduced width (~46rem) above its text — a banner row.
Close para + footer links unchanged.

No new images required — same 4 chapter images, recropped per row (bake script re-crops like
make-vybe-section-v5.mjs did; original bakes stay untouched under their slugs, new crops get
`-vert`/`-sq`/`-wide` suffixed slugs).

Acceptance: ≥3 distinct card-image widths; ≥2 orientations; no two adjacent rows share a
layout; grid module count = 0; hub still scans as navigation (titles + dates + CTA per row).

## P3 — /work/pitchboulder (rider: photo replacement + LinkedIn captions)

**3a. Mine new frames** (extend scripts/make-pitchboulder-wednesday-room.mjs pattern →
new script `make-pitchboulder-variety.mjs`): source E:\Pitch Boulder\2026 Recordings +
E:\Pitch Boulder\2025 (verify exact dir names at build). Pull 6–10 candidates at VARIED
scales: podium faces, projected slides, room details, one true wide. Face/sharpness scan
(Haar + Laplacian) then eye-review every pick (SPEC-SHOT-SELECTION.md rule). Perceptual-hash
dedupe against ALL existing public/media/** (collision-map discipline).
**3b. Identify the operator's "top-down box-opening photo"** by actually rendering/viewing
hook-poster.avif + context + coworking pair; replace its every use (this page's hook, and
/venture's chapter card via its own bake) with distinct varied frames — hook and /venture
card must no longer share one image.
**3c. Case-body edits** (CaseStudy.astro is SHARED with shelby-pebble-beach — every addition
prop-gated, rendering nothing when absent, Shelby byte-identical): caption slot for the
context figure; optional pull-quote block ("the gap between what a founder says and what
the room actually hears"); optional small inline thumbnail in Ask/Outcome.
**3d. LinkedIn mining — READ-ONLY** (his personal + ASM company channels; no posting/liking/
following/messaging/profile edits): presenter names, dates, companies for captions. Only
facts he himself published; anything unverifiable stays generic.

Acceptance: zero images shared between /work/pitchboulder and /venture; ≥3 distinct image
widths in the case body; caption coverage 100%; Shelby page diff = none; Wednesday Room
chapter untouched.

## P4 — /venture/dawn-patrol (de-formalize; smallest diff that breaks the triplet)

Keep: landscape cover + six ranks, video-first, field log + honesty footnote, one bleed,
duos, all captions. Change:
1. **Drop the two corner plates** from the cover (newsstand furniture gone; cover reads
   Alpinist full-bleed opener).
2. **Pull quote de-overlapped**: plain full-width bold quote on its own line (Atavist
   device 8), not the shadowed overlapping panel.
3. **Ferrari stagger → diptych**: two images set as one equal-height paired unit w/ shared
   caption (Atavist device 4) — distinct from the stagger grammar.
4. Merge afterVideo + beforeLight prose so at least one 3-paragraph unbroken text stretch
   exists (Atavist text-led signature).
Result: block-type overlap with steel-and-dust drops from ~90% to ≈55% while touching ~4
sites in the file.

Acceptance: no corner plates; ≤2 stagger modules; one ≥3-paragraph text stretch; overlap
with sd's block sequence measurably below 60%; zero-repeat + caption rules hold.

## P5 — /venture/meme (typographic pacing only)

1. Full-width pull quote after para 3 — the "Ides of March" founding line (device 8).
2. Asterisk/rule divider (device 6) before the roster.
3. Roster scale-drop: cards to ~12rem (masthead-style contributors block), roles tightened.
No new imagery. Acceptance: the 6-para stretch is broken once by a typographic beat;
roster reads as masthead, not gallery.

---

## Shared engineering rules (all pages)

- Copy additions (captions included) carry `⚠ OPERATOR READ-APPROVAL REQUIRED` comments —
  staging-only until read, logged for the copy deck.
- New crops ship under NEW suffixed slugs; existing bakes never overwritten (vybe v5 precedent).
- Per-page bake scripts for reproducibility (house rule since 2026-08-01).
- One commit per page: `LAYOUT-OVERHAUL: P<n> <page> — <rhythm>`.
- **measure.mjs must be rebuilt before the critic pass** (step 4 prerequisite): puppeteer-core
  against the local build; per page emit settled height, image display widths + orientations
  in DOM order, adjacent same-width+orientation count, content-hash repeated-image detection
  (within page and across pages), caption coverage. The critic re-measures every acceptance
  line above.
- No parallel agents; sequential only; every long step writes its output file early.
