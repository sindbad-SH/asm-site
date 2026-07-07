# HANDOFF — asm-site standing build record

Live repo: `06 - Website/asm-site` (Astro + Tailwind v4 + GSAP 3.15 + Lenis 1.3).
Staging: GitHub Pages project site at base `/asm-site` (noindex on github.io).
Production cutover flips `DEPLOY_TARGET=production` (base `/`, indexable) — never
touch Pages/DNS from here.

---

## ROUND 3 — the elevation pass ("done and MIND-BLOWING")

Thesis: **"the survey comes alive."** The floating imagery now has a PULSE
(continuous ambient drift on top of scroll), every page that read "basic text"
got one signature moment, and the gallery finished its dual-brand advertising job.
Text never drifts; one memorable moment per page.

### Scoreboard (one milestone commit per order)

| Order | Title | Commit |
|---|---|---|
| R3.1 | Favicon rebuilt from the real ASM mark | `a96cb43` |
| R3.2 | Partner-logo rule + real Amazing Aerial logo in the repo | `3d4bf57` |
| R3.3 | Gallery: cuts + Italy picks + watermark-everything | `02f1784` |
| R3.4 | Field notes: his voice on every gallery location | `24ea8d1` |
| R3.5 | Ambient drift engine (signature move #1) | `6ef42d8` |
| R3.6 | Homepage: opener v2 + clusters everywhere + de-basic-ing | `01095f4` |
| R3.7 | Film & TV: the marquee moment | `d614adc` |
| R3.8 | Forge the Saga: heat you can feel (temper line lights) | `e62773b` |
| R3.9 | Work: the cascade + living filters (FLIP) | `677f9f1` |
| R3.10 | About develop + Adventure arrivals | `e8ba648` |
| R3.11 | QA gate + review packet | (this commit) |

Nothing was cut — R3.1–R3.11 all shipped.

### QA gate (R3.11) — all green
- `npm run build && npm run audit`: **green** (exit 0). Exclusion audit clean.
  Only the two standing `[confirm]` warnings survive (allowed on staging).
- Lighthouse (home, the most animation-heavy page): **perf score 1.0**, all
  budgets clear — FCP 728ms / LCP 1145ms / TBT 0 / CLS 0 / TTI 1159ms (budgets
  1200 / 2500 / 300 / 0.1 / 2500). The portal-scene.avif is still LCP — text
  arrival did NOT flip it, so no LCP guard was needed. (Local `lhci` throws the
  known Windows Chrome-temp-dir EPERM at teardown *after* auditing — cosmetic;
  CI runs on Linux.)
- Reduced-motion sweep: drift ✗ · marquee bars ✗ (display:none) · ember ✗ ·
  develop ✗ · FLIP ✗ (instant) · pings ✗ · arrivals ✗ — all content visible.
- No-JS sweep: all content present in the static HTML (field notes open, portal
  endcard, signpost, clusters composed).
- 375px sweep: drift mounts **0** (engine self-gates ≤640px), clusters stack
  (`.cluster-stage` display:block), marquee bars + Film&TV floating still
  display:none. Verified live in-browser.

### Kill switches (QA)
- `?portal=static` — portal endcard, no animation.
- `window.__DRIFT.freeze(0)` / `.thaw()` — deterministic drift field for
  screenshots; `window.__DRIFT.count` / `.running` report engine state.
- `window.__PORTAL.set(p)` — drive the portal opener deterministically.
- reduced-motion emulation covers the rest.

---

## OPERATOR STAGING-REVIEW CHECKLIST (round 3)

Walk the staging site and sign off (or strike) each:

1. **Favicon from the real pack** — check your own browser tab. The 32px icon is
   the untouched pack mark (filled) on a dark tile, not a redraw.
2. **Watermark-everything gallery** — every /adventure card (incl. Matterhorn,
   Gornergrat, Tseuzier) now shows the AA mark obviously center + the ASM corner
   mark. Approve the look; the gallery is dual-brand advertising, not clean files.
3. **Italy cards + DRAFT field notes** — two new cards: **Castel Toblino,
   Trentino** (replaces Crescent Meadows) and **Lake Como, from Varenna**
   (replaces Walker Ranch). Both carry field notes drafted from real, web-verified
   place history (Claudia Particella folk-legend at Toblino; Castello di
   Vezio/Theodelinda tradition + Lake Como's depth at Varenna). **These are
   DRAFT — read and approve/edit/strike before production.**
4. **FIELD NOTES (all locations)** — read every location note on /adventure.
   **They are written AS YOU.** Matterhorn ships open; the rest are collapsible.
   Approve, edit, or strike each — they do NOT ship to production unapproved.
   This is a REVIEW GATE (staging-only until your pass), not a build blocker.
5. **Real AA logo on the funnel card + /work band** — approve the prominence and
   the Ledger phrasing ("Licensed through Amazing Aerial Agency").
6. **Ambient drift feel** — sit on the homepage / Film & TV / About for ~60s of
   idle. The floating shots should feel alive but calm ("engaging, not
   overwhelming"). Flag if any of it reads as too much.
7. **Opener A→B→A** — the mark breathes on the hold, content arrives as the void
   clears, and on scroll-out the world recedes + the mark ghost re-forms.
8. **Each interior page's signature moment** — Film & TV: the letterbox marquee
   opens like a screen. Forge: the temper line lights and the 5 nodes ignite.
   Work: the grid cascades + filters animate (FLIP). About: the portrait
   develops from grayscale.

### Italy/Switzerland gallery slots — FILLED
The parameterized R3.3b order resolved to its "present" branch. Both slots are
filled (Castel Toblino + Varenna/Lake Como). The Swiss Bern/Glarus material was
rejected upstream (flat/foggy) — Valais remains the sole Switzerland set.

---

## PRODUCTION BLOCKERS (unchanged — exactly two)
1. **`SITE.formEndpoint`** (`src/consts.ts`) — the contact form stays inert until
   a free-tier endpoint is created (a ~2-minute operator task, needs email
   verification). Renders `[confirm]` today; blocks `DEPLOY_TARGET=production`.
2. **Shelby `engagement`** (`WORK[shelby-pebble-beach].engagement`) — paid vs
   unpaid is not stated in Jack Bell's published copy; one word from the operator
   at review resolves it. Renders `[confirm]`; blocks production.

## RESERVED / STANDING ASKS (not blockers — activate when supplied)
- **Field-notes read-approval** — the whole R3.4 note set is a production gate
  (staging-only until the operator's pass). The two Italy notes are additionally
  DRAFT (see checklist #3).
- **PitchBoulder logo (one email to Peter)** — R3.2c reserved a build-time slot:
  drop `public/media/work/pitchboulder/pb-logo.png` in and it renders (~120px)
  beside the case hook. Nothing renders today; zero further code change.
- **Jack Bell testimonial** — the Pebble Beach quote is staged (verbatim) in a
  `consts.ts` comment; activate on his one-word approval (see the TESTIMONIALS
  block).
- **Analytics** — `SITE.analytics` empty = nothing loads; set a GoatCounter code
  to enable.

## KEEP LIST (do not regress)
Gallery hover warp (OGL + CSS fallback), Lenis lerp 0.10 / wheelMultiplier 1, the
case studies, the AA funnel, the R4 watermark look (now on more images), the wild
floating-cluster geometry, the mixed-aspect masonry wall, and every round-2 win.
