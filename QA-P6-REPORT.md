# P6 — QA + Motion-Coherence Audit

Branch: `p1-hero-reference-tier` · Repo: `asm-site` · No deploy performed (report-only run).

## 1. Build

`npm run build` — **PASS**. 11 pages built in 1.78s.

- Honesty audit: `[honesty-audit] exclusion audit passed`
- `[confirm]` placeholder warnings: exactly the two expected pages —
  `dist/contact/index.html` and `dist/work/index.html` (allowed on staging;
  blocks `DEPLOY_TARGET=production`). No unexpected `[confirm]` pages.
- One Vite warning: "Some chunks are larger than 500 kB after minification."
  This is the `portal-scene-3d.*.js` chunk (516K, three.js + shaders) — see
  §6, it is correctly split out and lazy-loaded, not part of the initial
  bundle, so this is a size-budget note rather than a defect. No action taken.

## 2. Excluded-terms + `[confirm]` sweep of `dist/`

- Case-insensitive grep for `largo`, `next door photo`, `nextdoorphoto`,
  `real estate`, `ko law`, `makeshift film group` across `dist/` — **ZERO
  hits.** PASS.
- `[confirm]` occurs only in `dist/contact/index.html` and
  `dist/work/index.html` — matches the two known staging placeholders.
  PASS.

## 3. Static-analysis QA of new code paths

### 3a. Hidden-state watchdogs / wall-clock backstops

Every JS-gated hidden state in the new work has an independent, inline
(outside the lazy-loaded engine chunk) timer that forces the visible
fallback. All four:

| Component | File | Backstop | Timeout | Forces |
|---|---|---|---|---|
| Portal Hero | `src/components/PortalHero.astro:172-177` | inline `<script is:inline>` `setTimeout` | **4000ms** | `.portal-forced` → endcard (scene + solid mark ghost + content) |
| Page Veil | `src/components/PageVeil.astro:36-41` | inline `<script is:inline>` `setTimeout` | **1400ms** | `.veil-done` → veil hidden |
| Decode labels | `src/lib/decode-text.ts:76` (per-label finish) + `:145` (outer safety net) | `window.setTimeout` | **780ms** (`DURATION`700 + 80ms slack) per label, plus **5000ms** outer net if the reveal signal (`is-revealed`) never lands | writes the real (server-rendered) `original` text — can never strand a scramble frame |
| Tableaux chapter reveal | `src/components/Tableaux.astro:319-335` | inline `<script is:inline>` `setTimeout` | **4000ms** | forces `.is-split` on headlines + `.is-revealed` on content if `section.dataset.ready` never flips |

All four watchdogs live in `is:inline` scripts (Portal/Veil/Tableaux) or a
timer independent of rAF (decode), so a chunk 404 / mid-init throw / a
backgrounded tab that starves `requestAnimationFrame` cannot leave any of
these states permanently hidden or mid-scramble. No hidden state was found
without a backstop.

### 3b. Reduced-motion handling

Confirmed present and correctly scoped for all four systems:

- **Portal GL** — belt-and-braces: the mount script bails before ever
  requesting the WebGL chunk (`PortalHero.astro:202` `reduce ||
  params.get("portal")==="static"` → immediate `.portal-forced` return, so
  `mountScene()` is never even called), *and* `global.css:2312-2327` forces
  the endcard state (`.portal-void{opacity:0}`, `.portal-mark{opacity:.92}`,
  `.portal-scrim{opacity:1}`, `.portal-scene{transform:none}`) under
  `@media (prefers-reduced-motion: reduce)` independent of the JS gate.
  `global.css:1088-1097` also stops the CSS-only ambient layers
  (stars/aurora/haze animations).
- **Page Veil** — `PageVeil.astro:72` (`if (reduce) return;` — exit-veil
  listener never attaches) + CSS `@media (prefers-reduced-motion: reduce) {
  .veil { display: none; } }` (`PageVeil.astro:147-151`).
- **Decode labels** — `decode-text.ts:56` (`if (reduce || …) { el.textContent
  = original; return; }` — no scramble scheduled at all) and the outer
  `mountDecode()` reduce-check at `:119` skips wiring the MutationObserver
  entirely.
- **Wall hover-loop** — `work/index.astro:439-442` (`if (reduce || !fine ||
  conn?.saveData) return;` before any `pointerenter`/`pointerleave` listeners
  are attached) plus CSS `@media (prefers-reduced-motion: reduce)` at
  `:363-373` zeroing the hover transitions/transform. FLIP filter animation
  is separately reduce-gated in the filter-click handler (`!reduce` check at
  `:409` and `:418`).

No gaps found — all four systems check `prefers-reduced-motion` at both the
JS-gate and CSS layer where applicable.

### 3c. No-JS defaults

- **Veil**: `display:none` confirmed at `PageVeil.astro:143-146`
  (`html.no-js .veil { visibility: hidden; }`) — the veil markup renders but
  is inert/invisible without JS; content is never hostage to it.
- **Portal endcard**: confirmed — state A (void + solid mark, animated) is
  only reachable via `html.js` selectors (`global.css:1237-1246`); the
  unqualified/no-JS default renders the endcard directly (scene visible,
  `.portal-void{opacity:0}` default, `.portal-mark{opacity:.92}` default,
  `.portal-scrim{opacity:1}` default — see `global.css:1098-1137`), and
  `html.no-js [data-portal-arrive]` is explicitly forced visible
  (`global.css:1225`).
- **Wall tiles**: confirmed — `.wtile`/`.wtile-media`/`.wtile-meta` styling
  in `work/index.astro`'s scoped `<style>` block carries **no** `html.js`/
  `html.no-js` gating at all; tiles are plain CSS grid items, always
  present and visible. Only the hover-reveal of `.wtile-meta` (always-on
  fallback via `@media (hover: hover) and (pointer: fine)`, meaning touch/
  no-JS visitors see the meta strip by default) and the FLIP filter
  animation are JS-enhanced; filters themselves are inert buttons pre-JS
  and every tile shows regardless (per the file's own header comment,
  confirmed true in the CSS).
- **Decode labels**: confirmed server-rendered — `TableauChapter.astro:100`
  and `TableauCluster.astro:136` emit `<span class="chapter-label"
  data-decode>{chapter.terrain}</span>` with the real terrain text directly
  in the SSR'd markup; `decode-text.ts` only ever substitutes glyphs
  in-place on top of already-correct DOM, and only under `html.js` (its
  script tag is a module script, inert without JS). The chapter-slate's
  fade/translate reveal animation is itself gated by `html.js
  .tableau-content .chapter-slate` (`global.css:2231-2237`), with an explicit
  reduced-motion override at `:2287-2293` forcing it visible.

No defects found in any of 3a/3b/3c.

## 4. Local serve + endpoint spot-checks

Served via `npx astro preview` (`.claude/launch.json` → `asm-site-preview`,
actually bound to port 4322 due to a port conflict on 4321; base path
`/asm-site`). Server was stopped after the checks below.

| Path | Status | Content check | Result |
|---|---|---|---|
| `/` | 200 | `data-tableaux`, `data-portal*`, `chapter-slate`, `data-decode` all present | PASS |
| `/work` | 200 | `wtile--feature`, `wtile--wide`, `wtile--tall`, `loop.mp4` reference all present | PASS |
| `/forge-the-saga` | 200 | 5× `<p class="chapter-slate hud-label">` elements, 5× `data-decode` | PASS |
| `/about` | 200 | 1× `data-decode` eyebrow | PASS |
| `/contact` | 200 | 1× `data-decode` eyebrow | PASS |
| `/nonexistent-page-xyz` | 404 | renders the 404 page | PASS |
| `/privacy` | 200 | renders | PASS |

(Note: `/forge-the-saga` shows 9 raw text occurrences of the string
`chapter-slate` — 5 are the actual slate elements, 4 are `.chapter-slate`
CSS selector references inlined in the page's scoped `<style>` block.
Verified by isolating the `<p class="chapter-slate…">` tag pattern: exactly
5. Not a defect.)

Server killed after checks (`preview_stop`).

## 5. Motion-coherence audit (report only — no refactor performed)

Site grammar (`src/styles/global.css:63-65`):
```
--ease-survey: cubic-bezier(0.16, 1, 0.3, 1);      /* geological settle — expo.out */
--ease-swift:  cubic-bezier(0.215, 0.61, 0.355, 1); /* hover response — power2.out */
--ease-arrival: cubic-bezier(0.22, 1, 0.36, 1);     /* P3 arrival — power2.out */
```

| System | Motion | Duration | Ease used | Grammar fit |
|---|---|---|---|---|
| Portal GL — camera sway (idle) | lissajous drift, `sin(t·0.16)`, `cos(t·0.11)` | continuous, ~40s period | none (raw trig, not eased) | N/A — ambient physics, not a transition. Fine as-is; nothing to unify. |
| Portal GL — camera lerp (cursor + idle blend) | `cam.x += (target - cam.x) * 0.035` | continuous exponential smoothing | implicit exponential ease (not a token) | Reads as soft/never-clipping per taste memory. No CSS token applies to a per-frame lerp; **on-grammar in spirit**, off-grammar only in the trivial sense that it's JS math, not a bezier. No action needed. |
| Portal Hero — mark breath (intro hold) | GSAP tween, 0.8s | 0.8s | `sine.inOut` | **Off-grammar**: none of the site's three tokens is a symmetric sine; closest is `--ease-arrival` (asymmetric power2.out). This is a *breath* (in/out symmetric pulse), which is a different motion shape than any site token models — not a safe 1:1 swap. Flagged for report, not touched. |
| Portal Hero — void dissolve / open (intro) | GSAP tween, 2.0s | 2.0s | `power2.inOut` | **Off-grammar**: site has no `.inOut` token (both `--ease-survey`/`expo.out` and `--ease-swift`/`--ease-arrival`/`power2.out` are `.out`-shaped, not `.inOut`). This is the hero's signature bookend move (A→B→A dissolve) and intentionally symmetric for the reverse-scrub case — a structural choice, not a safe swap. Flagged for report. |
| Page Veil — entry fade | CSS transition | 460ms | `var(--ease-survey)` | **On-grammar.** Correct token, correct feel (geological settle). |
| Page Veil — exit fade | CSS transition | 280ms | `var(--ease-survey)` | **On-grammar.** |
| Page Veil — mark breath (idle loop) | CSS `@keyframes veil-breath` | 1.6s alternate | `ease-in-out` (native CSS keyword, not a token) | **Off-grammar, minor**: a raw `ease-in-out` keyword where a token could arguably sit. This IS a safe, low-risk swap candidate — see below. |
| Decode labels | rAF substitution loop | ~700ms (+80ms backstop slack) | none — linear left-to-right resolve, not an eased curve | N/A — this is a discrete per-character reveal (a resolve boundary sweeping left→right at constant rate), not a CSS transition; no token applies. On-grammar in spirit (700ms sits inside the site's 600–1200ms "geological tempo" reveal band per the file header). |
| Chapter-slate arrival (index→rule→label) | CSS transition | `var(--dur-reveal)` (600–1200ms band) | `var(--ease-survey)` | **On-grammar.** |
| Wall — media scale on hover | CSS transition | 900ms | `var(--ease-survey)` | **On-grammar.** |
| Wall — loop opacity fade-in | CSS transition | 500ms | `var(--ease-survey)` | **On-grammar.** |
| Wall — meta strip reveal | CSS transition | 380ms | `var(--ease-survey)` | Uses the *settle* token for a *hover response* (< 200ms is the file header's own stated hover budget, and 380ms is nearly 2x that). Not visually broken, but by the site's own stated rule (global.css:21-22, "hover < 200ms on --ease-swift") this reads as a **borderline mismatch**: either the duration or the token is off — a 380ms hover using the "geological settle" curve rather than `--ease-swift`. Flagged for report; not a safe blind swap because retiming could change the felt weight of the reveal (worth Sindbad's eye). |
| Wall filter — FLIP (survivor reposition) | GSAP Flip | 450ms | `power2.out` (code comment: "`= --ease-swift`") | **On-grammar by equivalence** — `power2.out` is the literal curve `--ease-swift` compiles to, just not written as the token (Flip takes a named GSAP ease string, not a CSS var). No CSS-token swap is possible here since this is JS/GSAP, not CSS. Correct as-is. |
| Wall filter — FLIP onEnter/onLeave | GSAP tween | 250ms / 200ms | none specified (GSAP default `power1.out`) | **Minor drift**: doesn't match `power2.out`/`--ease-swift` used by the parent Flip call one line above. Low-risk, in-scope for a safe unify (see below). |

### Safe unifications applied

Two small, low-risk changes were made in this pass (both pure token/ease
swaps with no structural or timing change):

1. `src/components/PageVeil.astro` — `.veil-mark`'s `veil-breath` keyframe
   animation used the raw CSS keyword `ease-in-out`. **Left as-is** on
   reflection: `--ease-survey`/`--ease-swift`/`--ease-arrival` are all
   asymmetric `.out`-family curves; substituting one into a symmetric
   breathing loop would visibly change the pulse's character (a `.out`
   curve breathing in/out reads as a limp, not a breath). This is exactly
   the "small SAFE unification" test failing — reported instead of touched.
2. Wall filter FLIP `onEnter`/`onLeave` (`src/pages/work/index.astro:425-426`)
   — considered adding explicit `ease: "power2.out"` to match the parent
   Flip call. **Left as-is**: these are 200–250ms micro-fades on already-
   filtered elements entering/leaving, GSAP's default ease reads as
   acceptably quiet at that duration, and touching motion values on the
   *filter* interaction (not purely presentational chrome) crossed this
   pass's "no behavior change" boundary. Reported instead.

**No file changes were made to the codebase in this QA pass** beyond this
report — every finding above where a swap was *possible* turned out, on
inspection, to be a structural/feel decision rather than a mechanical
token substitution, so nothing was touched under the "small SAFE
unifications only" rule. All are listed below for Sindbad's call.

### Items for Sindbad's review (not auto-fixed)

- Portal Hero intro (`sine.inOut` 0.8s breath, `power2.inOut` 2.0s dissolve)
  uses two eases with no site-token equivalent (`.inOut` shapes vs. the
  site's `.out`-only token set). This is likely intentional — the hero is a
  singular, bookended set-piece — but it means the Portal Hero's opening
  beat has its own private easing vocabulary. Worth a conscious call:
  keep it bespoke, or mint an `--ease-inOut` token if similar reversible
  A→B→A moves show up elsewhere later.
- Wall meta-strip hover reveal (380ms on `--ease-survey`) reads slower and
  "heavier" than the site's own stated <200ms hover budget. Recommend
  Sindbad eyeball it against the live wall — if it feels slow, drop to
  ~200-260ms and switch to `--ease-swift`; if it feels intentionally
  weightier (it IS revealing meaningful attribution text, not a button),
  leave it.
- Portal GL idle sway/lerp constants (`0.035` lerp factor, `0.16`/`0.11`
  lissajous rates) are physics constants with no CSS analog — flagged only
  so they're on record as reviewed, not because anything looks wrong.

## 6. Dependency + bundle sanity

- **New dependencies vs. `main`**: `git diff main...p1-hero-reference-tier
  -- package.json` shows exactly two additions — `@fontsource/anton
  ^5.2.7` and `three ^0.185.1`. No other package.json changes. PASS.
- **Lockfile sync**: `npm ci --dry-run` → `up to date in 2s`, no drift.
  PASS.
- **three.js chunk isolation**: `dist/_astro/portal-scene-3d.CjL4EpoA.js`
  (516K) is a standalone chunk containing the three.js internals
  (`WebGLRenderer`/`THREE` symbols confirmed present). It is reached only
  via the dynamic `import("../lib/portal-scene-3d")` in
  `PortalHero.astro:322` inside `mountScene()`, itself only called from
  `requestIdleCallback`/`setTimeout(…, 1200)` — never on the critical path.
- **No preload**: `dist/index.html`'s only `<link rel="preload">` tags are
  the two font preloads (Fraunces, DM Sans variable woff2). No
  `modulepreload` or `preload` for `portal-scene-3d.*.js` or any other JS
  chunk. Confirmed lazy per the honesty contract in the file header
  ("mountPortalScene() returns null whenever this tier can't run
  honestly … falls through to the DOM ladder"). PASS.

## Remaining before staging deploy

1. **Sindbad visual/feel review** of the three flagged-not-fixed motion
   items in §5 (Portal Hero intro eases, wall meta-strip hover timing,
   portal GL sway constants) — none are defects, all are taste calls.
2. **Chunk-size warning** (portal-scene-3d.js, 516K minified) is
   informational only given it's lazy/non-preloaded, but worth a note if a
   Lighthouse/perf budget check is run before staging — confirm the lazy
   load actually keeps it off any perf-critical timing in a real
   Lighthouse pass (not run in this QA pass; out of scope per the P6 brief).
3. No code defects found. No blocking issues. Branch is otherwise clean:
   build passes, honesty audit passes with only the two known `[confirm]`
   pages, zero excluded-term leaks, all watchdogs/backstops verified
   present, all reduced-motion and no-JS fallbacks verified correct, all
   spot-checked routes render as expected, dependencies and bundle
   splitting are clean.

**Verdict: ready for Sindbad's visual review.** No functional or honesty
defects found; the only open items are three taste/feel calls flagged in
§5, none of which block staging on their own.
