# PitchBoulder HERO photo scout

**Status:** IN PROGRESS (written incrementally — machine-restart safe)
**Date:** 2026-08-01
**Archive:** `E:\Pitch Boulder\Top photos for web build`

## The brief (operator, verbatim)

> "the hero photo section you're using it's technically one that's done out of ... the one
> time we did it at the Boulder Chamber which you can't clearly see which has too much
> boulder chamber image plus you're choosing a close up shot of a presenter the hero shot
> should be 1 of the shots that's capturing the whole room with a lot of people in it
> ideally with like pitch boulder imagery around or again you can incorporate the logo."

### Decoded requirements
| # | Requirement | Hard/soft |
|---|---|---|
| a | Shows the WHOLE ROOM | hard |
| b | A LOT OF PEOPLE in frame | hard |
| c | NOT the Boulder Chamber venue (`0506_*`) | hard |
| d | PitchBoulder branding visible (slide / banner / signage) | soft (ideal) |
| e | Survives 16:9 AND 21:9 crop without decapitation / crowd loss | hard |

## Venue decoder
- `0429_*` (2026-04-29) — eligible, regular room
- `0506_*` (2026-05-06) — **DISQUALIFIED** — Boulder Chamber, Boulder Startup Week one-off
- `0520_*` (2026-05-20) — eligible, regular room
- `0617_*` (2026-06-17) — eligible, regular room
- `2026-01-28` Galvanize (already baked as `public/media/work/pitchboulder/wednesday-room/room-wide-*.avif`) — eligible, considered not re-baked

## Pool accounting

| Bucket | Frames | Eligible | Excluded (`0506_*`) |
|---|---|---|---|
| Tier 1 | 22 | 14 | 8 |
| Tier 2 | 45 | 33 | 12 |
| Tier 3 | 55 | 43 | 12 |
| Jan-28 Edited (bonus, `DSC*`) | 5 | 5 | 0 |
| **Total reviewed** | | **95** | **32** |

Tier 4 (137) skipped per brief.

## ⚠️ CRITICAL FINDING — the phone archive is SQUARE

Every `2026MMDD_*.jpg` frame in the archive is **1:1 square** (verified two ways: `metadata()`
and a resize round-trip). All carry `orientation=6`, so `.rotate()` is mandatory. Native sizes
range 2992² → 12240².

**Why this matters for a hero:**
- 1:1 → **16:9** keeps 56% of the frame height
- 1:1 → **21:9** keeps only **43%** of the frame height

So on any square source the hero crop is a *letterbox slice through the middle*. Ceiling,
foreground tables, and — critically — the **bottom rows of seated heads** get cut. A square
source can still work if the crowd sits in a horizontal band across the middle, but it is
structurally hostile to the 21:9 requirement.

The only **3:2 (1.505)** frames in the pool are the five professionally edited Jan-28 `DSC*`
stills at `E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\Edited\` — 6272×4168, real camera,
already colour-graded. These are geometrically the natural hero candidates and were folded into
the review pool.

## Contact-sheet pass

Sheets built at
`C:\Users\Vince\AppData\Local\Temp\claude\C--builds-asm\4a0486cc-4b49-4674-bb57-4366ef4122c3\scratchpad\sheet-01..05.jpg`
(5 sheets, 20 tiles each, numbered `#1–#95`, index at `index.json`).

_Visual review notes below._

## Individual review

### The tiering is inverted for this job
Tier 1 is curated for *"presenter + legible slide"* — 13 of its 14 eligible frames are exactly
the close-up-of-a-presenter shot the operator rejected. **The whole-room-with-crowd frames live
almost entirely in Tier 3.** Any hero pick therefore has to come from the "lower" tiers; tier
rank is not a quality signal for this brief.

### Frames rendered at 1150px and inspected individually
`#15 #19 #34 #36 #49 #50 #51 #63 #65 #66 #69 #70 #74 #79 #89 #91`
(in `…/scratchpad/cand/`)

| # | File | Verdict |
|---|---|---|
| 15 | DSC08258 | ❌ Backs-of-heads foreground + two presenters — the same close-up failure mode, just wider |
| 36 | 0520_091105 | ❌ ~20 people but the slide on both screens is a clinical anatomy diagram — wrong for a hero |
| 63 | 0429_091111 | ❌ ~10 people, many empty chairs |
| 65 | 0429_091126 | ⚠️ ~16 people, dual screens, but foreground is dominated by backs of heads |
| 89 | 0617_090737 | ⚠️ PB logo on slide, ~20 people, but low energy (phones out) and lots of empty floor |
| 51 | 0429_090316 | ⚠️ **PB logo visible**, dual screens, but noticeably empty chairs — fails "a lot of people" |
| 66 | 0429_091141 | ✅ ~24 people, nearly all faces visible — but **no screen in frame at all**, zero branding |
| 50 | DSC08304 | ✅ Pro-edited 3:2, ~22 people, generic client slide (no PB brand) |
| 74 | 0520_091035 | ✅ ~22 people, faces engaged, screen clipped at right edge |
| 49 | DSC08301 | ✅✅ Pro-edited 3:2, ~30 people, faces forward and engaged — strongest crowd |
| 70 | 0520_090658 | ✅✅ **"Welcome to PitchBoulder!"** large and legible on both screens + logo — best branding |
| 91 | 0617_090837 | ✅✅ ~25 people on both sides of a U-shape, **mid-applause**, PB logo on screen |

## ⚠️ SECOND CRITICAL FINDING — the baked `room-wide` band IS the Jan-28 crowd shot

I decoded `public/media/work/pitchboulder/wednesday-room/room-wide-1600.avif` and it is the
**same moment as DSC08301 (#49)** — same room, same crowd, same two presenters at the podium,
same burst. So the strongest pure-crowd frame in the whole archive is *already on the page* as
the full-bleed band lower down.

That means #49 cannot simply be promoted to hero: doing so would run the same photograph twice
on one page. If #49 becomes the hero, the `room-wide` band must be re-baked from a different
frame (#50 / DSC08304 is the natural swap).

## Ranked shortlist

### 1. #91 — `20260617_090837.jpg` ← **TOP PICK**
`E:\Pitch Boulder\Top photos for web build\_TIER 3 - MAYBE\20260617_090837.jpg`
- **Native:** 6112×6112 (1:1) · orientation 6 · venue **2026-06-17** (eligible)
- **People:** ~25, seated along a U-shaped table on **both** the left and right of frame
- **Branding:** ✅ Both projector screens show the PitchBoulder "Our Presenter Today" slide;
  the teal **PITCH BOULDER lockup sits in the slide's bottom band**, verified at 1:1 zoom
- **Crops:** best at `yFrac ≈ 0.56`. 16:9 → 6112×3438, 21:9 → 6112×2619. Both keep the full
  slide headline, both screens, host, presenter, and the crowd on both sides. No decapitation.
- **Why it wins:** the audience is **mid-applause** — hands up on both sides of the frame. It is
  the only frame in the pool that satisfies (a), (b), (c), (d) and (e) at once.
- **Defects:** foreground back-of-head (flat cap) is large at bottom-right; table clutter
  (food, sunglasses, sticker-covered box) in the near foreground — the 21:9 crop removes most
  of it. Square source, so 21:9 discards 57% of height. Slide names a third party
  (Bo Stump / Nobility Space) — worth an operator nod before publishing.

### 2. #49 — `DSC08301.jpg` ← **RUNNER-UP**
`E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\Edited\_TIER 2 - GOOD\DSC08301.jpg`
- **Native:** 6272×4168 (**3:2**) · orientation 1 · venue 2026-01-28 Galvanize (eligible)
- **People:** ~30 — the largest crowd in the archive, and nearly all **faces**, engaged, turned
  toward the presenters
- **Branding:** ❌ The screen at right is clipped and blown out; no PitchBoulder mark readable
- **Crops:** the best crop latitude in the pool. As a 3:2 source, 21:9 only trims 36% of height
  (vs 57% on the square phone frames). 16:9 → 6272×3528, 21:9 → 6272×2688 at `yFrac ≈ 0.55`;
  both hold the entire crowd with zero decapitation.
- **Also:** professionally edited/graded, real camera — technically the cleanest file here.
- **Blockers:** (1) no branding, so it needs the **logo-overlay route the operator himself
  offered** ("or again you can incorporate the logo") using
  `E:\Pitch Boulder\2026 Recordings\00 Assets\PB-logo-horizontal-lockup-teal-white-outline.png`;
  (2) it duplicates the existing `room-wide` band — that band must be re-baked from #50.

### 3. #70 — `20260520_090658.jpg` — *best branding by a mile*
`E:\Pitch Boulder\Top photos for web build\_TIER 3 - MAYBE\20260520_090658.jpg`
- 6112×6112 (1:1) · 2026-05-20 · ~18 people
- Both screens show **"Welcome to PitchBoulder! / Fueling Colorado entrepreneurs every Wednesday
  / 8:30am–10:30am @ Galvanize"** + logo — large, sharp, and fully legible in both crop ratios.
  Verified at 1:1 zoom. No third party on the slide, unlike #91.
- **Defects:** the crowd is the weak point — mostly **backs of heads** with visible empty chairs
  between them, and a concrete **column bisects the left third**. Fails the "a lot of people"
  emphasis even though it nails "PitchBoulder imagery".

### 4. #66 — `20260429_091141.jpg` — *best faces, zero branding*
`E:\Pitch Boulder\Top photos for web build\_TIER 3 - MAYBE\20260429_091141.jpg`
- 6112×6112 · 2026-04-29 · ~24 people, almost every face visible and attentive
- **No screen in frame at all** → requirement (d) completely unmet. Crops cleanly; large empty
  carpet bottom-right.

### 5. #50 — `DSC08304.jpg`
`E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\Edited\_TIER 2 - GOOD\DSC08304.jpg`
- 6272×4168 (3:2) · ~22 people · pro-edited. Screen shows a generic client slide
  ("The Future of Business Operations"), no PB mark. Ceiling-heavy top third crops away well.
- **Best use:** the swap-in for the `room-wide` band if #49 is promoted to hero.

### 6. #74 — `20260520_091035.jpg`
`E:\Pitch Boulder\Top photos for web build\_TIER 3 - MAYBE\20260520_091035.jpg`
- 6112×6112 · ~22 people, faces engaged, presenter right. Screen clipped at the right edge and
  illegible. Large empty carpet mid-right weakens the composition.

### 7. #51 — `20260429_090316.jpg`
`E:\Pitch Boulder\Top photos for web build\_TIER 3 - MAYBE\20260429_090316.jpg`
- 12240×12240 · dual screens, **PB logo visible**, but noticeably **empty chairs** through the
  foreground and middle — fails "a lot of people". Slide text also reads
  "Next Week: Boulder Startup Week / Boulder Chamber of Commerce", which points at the very
  venue the operator rejected.

## Top pick / runner-up

**TOP PICK — #91 `20260617_090837.jpg`, crop at `yFrac ≈ 0.56`.**
It is the only frame that clears every requirement simultaneously: a genuine whole-room view,
~25 people filling both sides of the frame, an eligible venue, the PitchBoulder lockup live on
both screens, and clean 16:9 + 21:9 crops. The applause is the differentiator — it reads as a
room with energy rather than a room with attendees.

**RUNNER-UP — #49 `DSC08301.jpg`, crop at `yFrac ≈ 0.55`.**

**Why #49 would beat #91:** strictly better raw material — ~30 people vs ~25, faces instead of
backs, a professionally graded real-camera file, and a 3:2 source that loses only 36% of height
to a 21:9 crop instead of 57%. Purely as a photograph it is the stronger image.

**Why #91 beats #49 anyway:** #49 carries no PitchBoulder branding, so it only satisfies the
operator's "ideally" clause via an added logo overlay — and it is **already on the page** as the
`room-wide` band, so promoting it forces a second re-bake to avoid running one photo twice.
#91 needs neither compromise.

**If the operator prioritises branding over crowd size,** #70 is the swap — it is the only frame
where "Welcome to PitchBoulder!" is the hero's own headline, at the cost of a thinner,
backs-of-heads audience.

## Notes for whoever bakes this
- Always `sharp().rotate()` first — every phone frame carries `orientation=6`.
- The square sources have plenty of pixels: a 21:9 hero off #91 is still 6112×2619 native.
- Logo lockups confirmed present at `E:\Pitch Boulder\2026 Recordings\00 Assets\`
  (alpha, teal+white-outline, and white-backed variants).
- Nothing was re-baked, moved, or committed by this scout.
