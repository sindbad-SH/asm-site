---
target: ASM publication site (photo + element audit)
total_score: 25
max_score: 36
na_heuristics: 9
p0_count: 1
p1_count: 2
timestamp: 2026-08-03T01-24-29Z
slug: src-pages-index-astro
---
# ASM Publication Site — Design Critique (2026-08-02)

Method: dual-agent (A: design review · B: detector/browser evidence) + a third asset-provenance
assessment. ⚠️ Evidence limitation: browser screenshots were unavailable all session ("Browser pane
is not displayed"); both agents substituted DOM/accessibility-tree extraction, live image inventories,
and JS layout measurement. No pixel-level visual judgment (perceived softness, colour harmony) was
possible — those claims are flagged as unverified where they appear.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Existence-gated media never 404s; "NO-COUNT" rework hides archive scale |
| 2 | Match System / Real World | 3 | Plain dated language, but invented jargon ("Forge the Saga", "Story Scouting") runs parallel |
| 3 | User Control and Freedom | 3 | Back-links everywhere; no breadcrumb below one level |
| 4 | Consistency and Standards | 2 | afm-2025 and seriesfest-2026 use two unshared class systems for identical content types |
| 5 | Error Prevention | 4 | Every media ref wrapped in build-time existsSync — zero 404s confirmed across 400+ requests |
| 6 | Recognition Rather Than Recall | 3 | LegendMark honesty tiers recur dozens of times with no key |
| 7 | Flexibility and Efficiency | 2 | No search, no filter; Territory map is the only power-nav and it's small-target |
| 8 | Aesthetic and Minimalist Design | 3 | Disciplined overall; pitchboulder's 28-row ledger is the flattest treatment on the site |
| 9 | Error Recovery | n/a | Read-only editorial surfaces, no forms or user input |
| 10 | Help and Documentation | 2 | The LegendMark taxonomy is the site's best differentiator and is never explained |
| **Total** | | **25/36** | **69% — Acceptable, top of band** |

## Design Specificity Verdict

**Specific execution, split-brained strategy.** The visual system is genuinely authored: Fraunces
italic serif against DM Sans caps and Space Mono HUD labels, a dark ground (#141922) with cyan
(#38f8ec) marked SCARCE in global.css, and hand-built systems (GlobeHero, TrailJourney, Tableaux
with lat/lon-projected constellation maps). No template ships a hand-projected equirectangular
territory map keyed to real shoot coordinates. This could not be dropped into another portfolio.

**Deterministic scan:** 9 CLI findings across 4 files. 3 `broken-image` findings are FALSE POSITIVES
(the literal string `<img>` inside HTML/JSDoc/CSS comments — real tags verified sound). `single-font`
and `flat-type-hierarchy` on world.astro are scope artifacts (the real typography lives in
scroll-world-engine.js, outside the scanned dirs). True positives: `dark-glow` and `side-tab`.

**Live DOM overlay (69 findings, homepage):** dominated by 34 `dark-glow` + 11 `neon-on-dark`. These
are largely a category collision — the detector's anti-AI-slop heuristics firing on a legitimately
committed dark editorial identity. Do NOT "fix" 34 glows. The findings that DO matter, because
Assessment A reached them independently: **10 instances of sub-11px functional text and 9 of all-caps
body text.**

## Overall Impression

The craft is real and the engineering is unusually disciplined. The problem is not supply, quality,
or code — it is that two brands are shipping simultaneously, and the photo layer is unevenly edited
rather than unevenly stocked.

## What's Working (leave alone)

1. **venture/afm-2025's Movement layout** — 16 natively-square source photos solved with real
   editorial craft: object-position tuned per beat against an eye-reviewed contact sheet, a caption
   under every image, a pull-quote at the midpoint, and a documented 3-image cut with reasons. This
   is magazine-grade photo editing executed in CSS and the strongest artifact on the site.
2. **The LegendMark honesty-tier system** — "Official role" / "Delivered work" / "Attended ·
   relationship-building" / "Informal" applied verbatim across every story. Hard to fake, genuinely
   differentiating. Its only flaw is having no visible key.
3. **Engineering hygiene** — zero console errors and zero 404s across 6 routes / 400+ requests, one
   h1 per page with no skipped levels, working 2px cyan :focus-visible rings, Save-Data gating that
   disables autoplay loops, poster-first video with preload="none", no horizontal overflow at 375px.

## Priority Issues

**[P0] A first-time visitor cannot tell what ASM is within the first viewport.**
Two identities ship at once. Header nav is four publication items and the CTA is "Follow the Stories"
(PUB-A, 2026-07-27) — but every page's footer carries a "Forge the Saga — Consulting" nav item, a
"Book a call" button and a trust row, and the home signpost's third item reads "Both, end to end —
Forge the Saga," an internal product name in the first viewport. Meanwhile the one line engineered to
answer "what is this" (COPY.hero.buyerLine) is set in the smallest mono HUD type on the page — which
both assessments reached independently.
*Correction to Assessment A: this is NOT an unfinished migration. Footer.astro's own comment says
"services stay present, quiet" and "Book a call stays, demoted" — it was deliberate.* The real
tension is degree: ACTION-PLAN.md permits "one quiet link," and four surfaces are shipping.
**Fix:** keep exactly one consulting link in the footer; pull "Forge the Saga" out of the home
signpost; promote the buyerLine out of HUD-label type.
Suggested: `/impeccable clarify`, then `/impeccable typeset`.

**[P1] The photo problem is editing, not supply.**
seriesfest-2026 starts from the same natively-square photography as afm-2025 and renders it as a
flat uncaptioned 6-column span-grid with no movement structure. Its 9 subjects are genuinely
non-duplicate — this is a layout gap, not a selection gap. Separately, /adventure's Field Notes
dispatch stream renders 11 real dated located stories as a bare numbered text list with zero
thumbnails, sandwiched between two heavily art-directed spreads, while lead images for several of
those locations already exist and are used elsewhere on the same page.
**Fix:** port the afm-2025 Movement/caption template to seriesfest-2026; add a lead thumbnail per
dispatch row. Suggested: `/impeccable layout`.

**[P1] The home page under-arms the two pillars the business needs most.**
Verified on disk: `home/wild/cluster` holds 4 shots (lake, peak, ridge, valley) plus a video loop;
`market/cluster` and `industry/cluster` hold 3 each (lake, ridge, valley — no peak). The front door
is thinnest exactly where the growth ambition lives.
**Fix:** source a 4th cluster shot for market and industry. The new AFM library covers this directly.

**[P2] /work/* is a parallel information architecture with a live duplicate.**
/work/seriesfest and /venture/seriesfest are two separately-designed hubs for the same four
dispatches. */Correction to Assessment A: it claimed "exactly one inbound link." There are three —
consts.ts:2047 (moreHref), work/index.astro:49, and territory.ts:97, where the Territory map's Denver
node sends visitors there with "See the coverage."* So the weaker duplicate is wired into a prominent
feature, and any redirect must update territory.ts or the map degrades.
Also: /work/pitchboulder and /work/shelby-pebble-beach — the two flagship case studies — are not
reachable from primary nav at all.
**Fix:** decide whether /work survives. If not, 301 into /venture equivalents AND repoint territory.ts.

**[P2] Image delivery hygiene.**
logo-mark.png is 900×905 / 99KB served into a 46×46 header slot — a 19.6× oversize on all 6 routes
(verified on disk). Width/height are missing on 10–17 images per route (layout-shift risk). alt=""
is applied to real scenic photography (73% of imgs on /, 88% on /venture) while afm-2025 and
/adventure carry genuinely good descriptive alt — so alt quality is inconsistent, not absent.
Gallery images ship webp-only while heroes get avif.
**Fix:** resize the logo, add intrinsic dimensions, promote decorative alt to descriptive on content
photography. Suggested: `/impeccable optimize`, then `/impeccable audit`.

**[P3] Hairline contrast failure.** The 01/02/03 hud-label numerals render rgb(30,143,138) on
rgb(20,25,34) = 4.49:1 against a 4.5:1 requirement, on a shared component.

## The Photo Layer — swap / improve / leave alone

| Surface | Verdict | Detail |
|---|---|---|
| /venture/afm-2025 | **LEAVE ALONE** | Best photo editing on the site. Optional: podium-speaker and podium-lectern read interchangeably in thumbnail. |
| /work/pitchboulder | **LEAVE ALONE** | 11 photos, best alt-text discipline on the site, documented collision-checking. Already through three hero rounds. |
| /adventure Field Board + festival + Vybe teasers | **LEAVE ALONE** | Real variety, one live motion cell, proper slates. |
| /venture chapter 01 (Pebble Beach) | **LEAVE ALONE** | 5-photo mix built deliberately against operator feedback. |
| /venture chapter 02 (PitchBoulder) | **SWAP** | `hook-poster.avif` is used TWICE in one chapter — collage video-card poster and YouTube facade poster. Swap the embed poster for `room-about` or `after-the-pitch`. |
| /venture/seriesfest-2026 | **IMPROVE (layout)** | Photos are fine; the grid is the problem. Port the afm-2025 Movement template. |
| /adventure Field Notes stream | **IMPROVE (add photos)** | 11 dispatches, zero thumbnails. Clearest "supply exists, unused" gap on the site. |
| Home market + industry clusters | **IMPROVE (add photos)** | 3 shots each vs the wild's 4 + loop. Verified on disk. |
| /venture chapter 03 (MEME) | **LEAVE ALONE** | Logo loop is correct — no event photography exists yet. Content gap, not design defect. |

## The New Library — measured, not assumed

The site's existing imagery does **not** need rescuing. Its 75 unique event photos are already
downscale-only exports from full-res masters via sharp, at 900w+1600w in dual AVIF+WebP — a more
sophisticated pipeline than the new batch's flat 1920px JPG+WebP. Several were rebuilt 2026-08-01,
the day before the batch. 97% deliver their largest raster at 1600px.

Perceptual-hash comparison of all 57 new photos against the live folders:
- **16 (28%) redundant** — traced to identical source files (e.g. new `04-egypt-film-commission-booth`
  and live `pavilion-row-egypt` both from `20251111_080315.jpg`). Zero quality gain.
- **3 (5%) judgment calls** — same moment, different crop.
- **38 (67%) genuinely new** — concentrated in AFM (sponsor booths, extra panels, Western Alliance
  reception) and PitchBoulder presenters.

⚠️ SeriesFest 2025 has its own live page; the new batch contains **zero** 2025 photos.
⚠️ Real headroom dwarfs both libraries: the tiered index holds ~879 usable photos across these
events; site + batch together have touched roughly 100.
**Process note:** the 38 should be regenerated through the site's own `make-*.mjs` convention
(AVIF+WebP, 900w/1600w, downscale-only) rather than dropped in as a fourth format.

## Persona Red Flags

**First-time visitor (5-second test):** "EVERY STORY, TAKEN AS FAR AS IT GOES." sets a mood, not a
category. The line that would answer "what is this" is the smallest type on the page. The third
signpost they read is an internal product name.

**Hiring producer scanning for proof:** the two flagship case studies aren't in primary nav. /work is
a bare link-list with no images and no visual distinction between a flagship study and a text-only
placeholder. PitchBoulder's 28-row season ledger — the densest receipts on the site — has zero visual
hierarchy at the bottom of a long page.

**Mobile / slow connection:** genuinely well-handled — Save-Data gating, preload="none", poster-first,
responsive srcset, no overflow at 375px. The cost is breadth: /venture lazy-loads 16+ images across
3 chapters, 2 collections and a partner rail on one URL with nothing deferred at section level.

## Minor Observations

- Footer nav (6 items) is deliberately decoupled from the header NAV constant — a documented drift risk.
- The proof band states "No logo wall, no borrowed credit" and the site holds to it everywhere checked.
- Assessment B saw the browser tab self-navigate twice mid-test; source inspection found no redirect —
  likely a harness artifact, but unverified.
- B flagged ~7 possible invisible rail cards on /venture (opacity:0 after scrollIntoView, consistent
  with an unresolved GSAP reveal in a headless session). **Unverified — needs a manual scroll-through.**

## Questions to Consider

- If the job is to prove and publish rather than convert, what does the footer look like when it
  matches the ambition already written into /venture's and /adventure's own source comments?
- Is /work supposed to exist at all? What breaks if every /work/* URL 301s into its /venture or
  /adventure equivalent — and who updates the Territory map when it does?
- The site invented a four-tier honesty taxonomy and never explains it once. What is the one sentence
  that turns it from a private code into a visible promise?
- Given ~879 usable photos exist and these six surfaces draw on well under 150, is the bottleneck more
  photography — or someone running the afm-2025 treatment on every other venture story?
