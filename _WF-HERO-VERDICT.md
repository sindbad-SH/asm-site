# PitchBoulder hero — ADVERSARIAL VERDICT

**Status:** COMPLETE
**Date:** 2026-08-01
**Judge posture:** skeptical by default. The previous hero was rejected; a second miss is expensive.
**Inputs:** `_WF-HERO-SCOUT.md`, `_WF-HERO-TREATMENT.md`, and an independent re-render of the whole eligible pool.

---

# VERDICT: **DO NOT SHIP the treatment's pick (#91).** Ship **#49 / DSC08301** instead.

| | frame | why |
|---|---|---|
| **WINNER** | `E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\Edited\_TIER 2 - GOOD\DSC08301.jpg` | ~30 people, all faces, room reads full · **one brand in the frame and it is PitchBoulder's** · survives the site's existing broken mobile crop · best on both hard requirements |
| **RUNNER-UP** | `E:\Pitch Boulder\Top photos for web build\_TIER 3 - MAYBE\20260429_091141.jpg` | ~22 faces, eligible 04-29, zero third-party brand, **zero duplication cost** — take this if the operator won't run the Jan-28 room again |
| **DEMOTED** | `…\_TIER 3 - MAYBE\20260617_090837.jpg` (#91) | NOBILITY SPACE reads 2.4× larger than PITCH BOULDER, **twice** · 7 empty chairs directly under the h1 · 2 people sliced at the right edge, unfixable · catastrophic default phone crop |

Evidence panel: `_wf-judge-out\VERDICT-PANEL.jpg` (all three at the true hero box with the real 44 %-width headline column and the real lockup).

---

## The operator's bar, scored literally

His words: *"the hero shot **should be** 1 of the shots that's capturing the whole room with a lot of people in it **ideally** with like pitch boulder imagery around **or again you can incorporate the logo**."*

Read the grammar: **(a) whole room and (b) a lot of people are mandatory.** **(d) PitchBoulder imagery is a preference with an explicit fallback he himself offered.**

| | #49 (winner) | #66 (runner-up) | #91 (treatment's pick) |
|---|---|---|---|
| (a) whole room | ✅ full depth, back wall to front | ✅ | ✅ |
| **(b) a lot of people** | ✅✅ **~30, all faces.** One 700×240 slice of the shipping frame alone holds 26 countable people | ✅ ~22 faces | ⚠️ **~18, roughly half backs of heads** — the scout's "~25" is inflated ~30 % |
| (c) not Boulder Chamber | ✅ Jan-28 Galvanize (brief lists it eligible) | ✅ 04-29 | ✅ 06-17 |
| (d) PB imagery **or** logo | ✅ logo route — the fallback he offered — and **nothing competes with it** | ✅ logo route, nothing competes | ❌ in-frame PB mark exists but is **subordinate to a competitor's** |
| (e) reads as a hero | ✅ h1 sd 48.0, 7.62:1; line 1 on clean wall | ⚠️ sd 52.9 | ✅ sd 44.4, 11.33:1 — **#91's only win** |

**#91 trades the mandatory requirement for a weak version of the optional one.** That is the wrong trade, and it is the trade that got the last hero rejected.

---

## The three findings that decided it against #91

### 1. #91 repeats the exact failure that got the current hero rejected

I decoded the live hero (`hook-podium-1600.avif`): Boulder Chamber podium logo, PEMPal slide, one presenter. The operator's complaint — *"too much boulder chamber image"* — is **a third party's branding owning his client's hero.**

At 8× zoom on #91's shipping framing I measured, in shipping pixels:

| mark | width @1600 hero |
|---|---|
| **NOBILITY SPACE** | **109 px** (and it appears on **both** screens) |
| **PITCH BOULDER** | **45 px**, with "BOULDER" physically clipped by the screen's bottom edge |

The treatment's numbers (110 / 46) are **honest — I reproduce them within 3 %.** But the treatment filed this as a *consent* gate. It is not primarily a consent problem. It is a **repeat of the rejection reason.** The two bright teal slides are the highest-contrast objects in the frame; the eye lands on them before it finds the DOM lockup in the dark bottom-left corner. Shipping #91 means the PitchBoulder case-study hero advertises Nobility Space.

### 2. The visual centre of #91 — where the headline sits — is a row of empty chairs

The treatment calls the mid-room emptiness *"the cleanest headline bed in the whole pool."* Measured, that is true (h1 backdrop sd 44.4, the calmest of six candidates). Looked at, it is **7 clearly empty orange-seat chairs, two more pushed under the table, bare carpet, floor cables and a mic stand** (`_wf-judge-out\Z-middle-empty.jpg`).

Under an h1 reading *"The work we do for PitchBoulder, start to finish"* on a brief that says *"a lot of people in it,"* the calmest thing in the frame is the room not filling. The metric and the message point in opposite directions, and the treatment optimised the metric.

My own sweep of the whole 06-17 session (frames `0617_090737 → 090946`) shows the same thin U-shaped turnout in every frame. **That session simply wasn't full.** No crop fixes it.

### 3. #91 breaks on phones *today*, and #49 does not

`_wf-judge-out\PHONE-naive-91.jpg` — what a 390 px visitor sees if #91 ships as a landscape poster through the site's current bare `<img>`:

> a NOBILITY SPACE slide, one man walking, **four empty chairs**, and empty carpet. **Zero audience.**

`_wf-judge-out\PHONE-naive-49.jpg` — the same naive crop on #49:

> **~14 faces, a packed room, the PitchBoulder lockup, no third-party brand.** No art direction required.

#91's crowd is edge-weighted, and `object-fit: cover` throws the edges away. #49's crowd is centre-weighted. So **#91 is only shippable after a component change that touches every hero on the site; #49 ships correctly with the code as it stands** and is merely *improved* by the portrait poster.

---

## Claims I re-verified rather than trusted

| # | Treatment claim | My check | Result |
|---|---|---|---|
| A1 | Pool accounting (T1 22/T2 45/T3 55; 0506 = 8/12/12) | listed the archive, grouped by date prefix | **CONFIRMED exactly** |
| A2 | #91 is `20260617_090837.jpg`, 6112², orientation 6 | `sharp().metadata()` | **CONFIRMED — 0617, not 0506** |
| A3 | `.hero-video{min-height:90svh}` + poster `object-fit:cover` | global.css:853–872 | **CONFIRMED** |
| A4 | Scrim gradients as quoted | global.css:897–915 | **CONFIRMED verbatim** |
| A5 | `.case-hook-logo` 120 px centred inside a `position:relative` box | global.css:1424 + CaseStudy.astro:116 | **CONFIRMED** — corner-anchoring needs a markup change |
| A6 | `HeroVideo.astro:41` emits a bare `<img>` | read the file | **CONFIRMED** — site-wide, every hero |
| A7 | Baked `room-wide` band == the #49 moment | decoded the avif | **CONFIRMED** — same burst |
| A8 | NOBILITY 110 px vs PITCH BOULDER 46 px | my own 4× rebuild + measurement | **CONFIRMED within 3 %** |
| A9 | Current hero is a rejected Boulder-Chamber frame | decoded `hook-podium-1600.avif` | **CONFIRMED** (and it is a 1600×1600 **square** poster) |
| A10 | Hero is poster-only, no video competing | `hookSources` never passed | **CONFIRMED** |
| A11 | Did the scout miss a better frame? | **I contact-sheeted all 95 eligible frames myself** (`JSHEET-1..5.jpg`) and pulled 9 alternates at full size | **No frame beats the top two.** Best new find, `20260429_091545.jpg`, is roughly equal to the runner-up, not better. The shortlist was sound. |

**The treatment is an honest document.** Its measurements reproduce. Its `sharp .stats()/.extract()` bug disclosure is real and correctly handled. It is the *judgement* on top of the numbers that fails, not the numbers.

---

## Errors and omissions found in the treatment

- **E1 · The runner-up's remedy is broken.** The treatment says: if #49 is chosen, re-bake `room-wide` from `DSC08304.jpg`. **`context-room-1600.avif` — already live on this page as the Context still — IS the DSC08304 moment** (same "The Future of Business Operations" slide, same two presenters, same crowd). The proposed fix swaps one duplicate for another. See "Blocking items" below for the correct remedy.
- **E2 · "Bottom-left = 16.70:1" does not discriminate between frames.** I measured the same bottom-left lockup position on six candidates: **16.3–17.6:1 on every one of them.** It is a property of the scrim's bottom darkening and the fact that floors are dark — not a reason to pick #91.
- **E3 · The rendered headline is ~23 % too wide.** `.hero-video__content` is `max-width:48rem` with `2rem` padding → a **704 px** column at any viewport ≥768. The treatment's renders show ~870 px at 1600. Every "does the headline fit / crowd the frame" judgement was made against the wrong box. (My renders use 704 px.)
- **E4 · The recipe's label contradicts its own numbers.** `top: 1631` on a 6112→3094 crop is yFrac **0.540**, not the stated 0.52 (standard formula → 1569). Cosmetic, but use the pixel values.
- **E5 · "worst-pixel contrast" is not a usable gate for the h1.** I measured it on all six candidates: **~1.0:1 for every one.** Every frame has a near-white pixel (table, ceiling, screen) somewhere under the headline. That is exactly why `pitchboulder.astro:322-329` adds a text-shadow. Mean + standard deviation are the meaningful numbers.
- **E6 · `.case-hook-credit` is `font-size: 0.6rem` (~9.6 px).** Decorative at hero scale. Arguments resting on credit legibility are close to moot.
- **E7 · "The logo slot must move" is presented as unconditional. It isn't.** On #49 the *current* centred slot lands on the grey acoustic wall — I measure **6.2:1** (the treatment's own matrix says 5.30:1 mean). **#49 can ship with zero CSS and zero markup changes.**

## Hypotheses I tested and disproved (in #91's favour, and against it)

- *Can #49's crop be tuned so the h1 clears the faces?* **No.** yFrac 0.90 and 1.00 push the headline onto the table/laptop clutter: h1 sd rises 48.0 → 64.9 → 70.8. yFrac 0.55 is #49's best. #91 genuinely does have the calmer headline bed — that finding survives.
- *Is there a denser 0617 frame?* **No.** All ten 0617 room frames show the same thin turnout.
- *Is there a frame with both a full room and legible PB branding?* **No.** `0520_090713` has the biggest in-frame PB mark in the pool ("Follow Us!" + lockup on both screens) but the crowd is entirely backs of heads with visible empty chairs — same failure as `#70`. The archive does not contain the frame that satisfies everything.

---

## Remaining concerns on the WINNER, and whether they resolve

| concern | status |
|---|---|
| Duplicates the live `wednesday-room/room-wide` band | **REAL — blocking.** Remedy below. |
| Near-duplicate of the live `context-room` Context still (both Jan-28, same session) | **REAL — blocking, and missed by the treatment.** Remedy below. |
| h1 line 2 lands on the back row's heads | **Accepted.** 7.62:1 mean plus the existing text-shadow override. Line 1 sits on clean wall. |
| Bottom-left corner is a cropped pair of legs/boots (`K-bottom-left.jpg`) | **Mitigated.** The scrim's bottom gradient plus the lockup sit exactly there; in the finished render it reads as a dark mass. |
| Right-hand screens are blown to white — does any third-party brand read? | **RESOLVED — no.** At 4× the only fragment is a ~5 px caption bar. Nothing legible ships. |
| ~30 identifiable faces on a public marketing page | **Operator nod advised** — but a lower exposure class than #91's named individual + headshot + company, and this exact crowd is already published twice on this page. |
| Portrait poster still puts the h1 over faces on a phone | **Accepted.** Unavoidable on a full room; the scrim + text-shadow carry it. |

---

## SHIP RECIPE — winner

```
src  E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\Edited\_TIER 2 - GOOD\DSC08301.jpg
     6272 x 4168 · 3:2 · orientation absent (keep .rotate() as a harmless no-op)

LANDSCAPE poster  (the ≥ tablet-landscape source)
     extract { left: 0, top: 546, width: 6272, height: 3175 }      // 1.9754:1, yFrac 0.55
     resize 1600x810 -> hook-room-1600.avif / .webp
     resize  900x456 -> hook-room-900.avif  / .webp

PORTRAIT poster  (recommended, not blocking — the phone box is 0.51:1)
     extract { left: 1750, top: 1417, width: 1412, height: 2751 }  // 0.5133:1
     resize  900x1754 -> hook-room-portrait-900.avif / .webp
     (chosen from 4 tested variants — sheet at _wf-judge-out\PSHEET-49.jpg)

LOGO  — DOM, never baked
     E:\Pitch Boulder\2026 Recordings\00 Assets\PB-logo-horizontal-lockup-teal-white-outline.png
     -> public/media/work/pitchboulder/pb-logo.png     (pitchboulder.astro:19 already gates on this path)
     Ship-today  : leave .case-hook-logo where it is — measured 6.2:1 on this frame. ZERO code change.
     Better      : bottom-left of .hero-video, clamp(150px,13vw,200px) — measured 16.54:1 / worst-pixel 11.71.
                   Needs a named slot in HeroVideo.astro as a sibling of .hero-video__content.

SCRIM — unchanged. Keep .hero-video__scrim (global.css:897) and the page's
        h1/credit text-shadow override (pitchboulder.astro:322-329). Do NOT bake it.

CREDIT — pitchboulder.astro:170 currently describes the retired Boulder-Chamber frame
         and must change. Suggest: "The Wednesday room at Galvanize — January 28, 2026"
         (⚠ new visible copy → operator read-approval, per this page's own convention).
```

Do **not** bake 21:9. The desktop hero box is 1.98:1; a 21:9 poster loses 12 % off each side.

## Blocking items before this ships

1. **`wednesday-room/room-wide-*` must go.** It is the hero. Either retire the band (the chapter still has 6 other images) or re-bake it from a Jan-28 RAW that is visually distinct — **not** `DSC08304`.
2. **`context-room-*` must be re-baked from a different session.** It is the `DSC08304` moment and would read as a near-twin of the new hero. Recommend `20260429_091141.jpg` (the runner-up frame) or `20260429_091545.jpg`; both add session variety the page currently lacks. `contextCaption` at pitchboulder.astro:61 ("January 28, 2026 session") must change with it.
3. **`hookCredit` (pitchboulder.astro:170)** — rewrite; the current line names the retired frame.
4. **`HeroVideo.astro` `posterPortrait` prop** — not blocking for this frame, but it is a real site-wide defect: every hero currently shows phone visitors the middle ~29 % of its poster. Worth doing on its own merits.
5. **Logo provenance** — the PARTNER-LOGO RULE (consts.ts:462-469) permits PitchBoulder's logo on this case study *"IF a real logo asset is supplied… until the operator obtains one from Peter."* The three lockups sit in the client's own `2026 Recordings\00 Assets` folder, which reads as client-supplied — but the rule names Peter, so confirm that before the file lands in `public/`.
6. **Asset density** — the lockup is a 392×195 raster with no vector. 0.98× on a 2× display at 200 px CSS. Ask for an SVG or ≥800 px PNG. (At the 120 px centred slot this is a non-issue.)

## If the operator rejects a third Jan-28 frame

Take the **runner-up, `20260429_091141.jpg`**, `extract { left: 0, top: 1660, width: 6112, height: 3094 }` → 1600×810. Same logo treatment. ~22 faces, no duplication anywhere on the page, no third-party brand, and it needs no re-bakes at all. It is a weaker photograph than #49 (busier headline bed, large empty carpet bottom-right) but it clears both hard requirements and carries zero collateral work.

---

## Method / housekeeping

- Every judgement above was made on renders I produced myself at the **true** hero box (1600×810), with the **true** scrim reproduced from `global.css:897`, the **true** 704 px text column, and the **real** logo file — not on the treatment's renders.
- Contact sheets of all 95 eligible frames: `_wf-judge-out\JSHEET-1..5.jpg` (+ `_jsheet-index.json`).
- Measurements: `_wf-judge-out\_judge-bake.json`, `_judge-final.json`.
- Renders: `VERDICT-PANEL.jpg`, `FIN-*.jpg`, `BAKE-*.jpg`, `CLEAN-*.jpg`, `PHONE-*.jpg`, `PSHEET-49.jpg`, `Z-*.jpg`, `K-*.jpg`, `SITE-*.jpg`, `RAW-*.jpg`, `A-*.jpg`.
- Constraints honoured: sequential only, no sub-agents, no dev server, no browser MCP, nothing written to `C:\builds\asm\src`, nothing baked into `public/`, no commits. All `_wf-judge-*.mjs` scripts deleted after the run.
