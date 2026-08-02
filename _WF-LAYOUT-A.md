# _WF-LAYOUT-A — Season List redesign (/work/pitchboulder)

STATUS: COMPLETE (2026-08-01). Analysis + prototypes only; nothing under `src/` touched.

Operator critique being served:
> "I feel like the orientation the layout could be better ... it just seems very formulaic
> simple like it's just a bunch of squares and boxes, like the text uniformly fits to the
> photo and goes there. It feels like there's a lot of dead space here. I don't know if
> that's intentional so it's optimized for smartphone as well."

Target module: `wr-ledger` in `src/pages/work/pitchboulder.astro` — markup L316-336, CSS L476-541.

---

## 1. Baseline, measured

Headless Chrome, DPR 2, element-scoped screenshots of the live dev server:
- `scratchpad/base-ledger-1280.png` — **736 x 579 CSS px**
- `scratchpad/base-ledger-390.png` — **342 x 1079 CSS px**

Five defects, measured not asserted:

1. **A rectangle full of rectangles.** One bordered/rounded panel containing 13 x 2 rows,
   each with a `border-top` hairline: **27 horizontal rules inside 579px of height.** This
   is the single most literally box-shaped element on the page.
2. **The date gutter is dead space, inside the module.** `grid-template-columns: 4.5rem 1fr`
   + 0.75rem gap. "Jan 14" is ~41px of glyph in a 72px cell — ~35px of nothing per row,
   x26 rows. He is not only describing the page margins; the dead space is in the grid.
3. **Two competing rule systems.** 16 of 26 names are links carrying `border-bottom`, so
   full-width row rules are crossed by part-width link rules in a different colour. The
   module renders as plaid. Emphasis reads as noise.
4. **It refuses the width it has.** Locked in the 46rem `.wr-inner`. At 1280 that leaves
   ~44% of the band empty while the content crams into two narrow columns.
5. **Mobile is a 1079px wall of 26 identical rows** with no landmark — nothing tells the
   reader where they are in a season.

Plus a reading-order wrinkle: the 2-column grid fills row-major, so the eye zigzags
Jan 14 -> Jan 21 -> Jan 28 -> Feb 4 across the gutter rather than reading down a column.

**Structural insight the current design throws away:** the data already has a shape.
Jan 3 / Feb 3 / Mar 4 / Apr 5 / May 4 / Jun 4 / Jul 3 = 26. Seven uneven months is a
ready-made asymmetric composition. The uniform 13x2 grid flattens it into a rectangle.

## 2. Grammar the replacement must speak

From `/adventure/steel-and-dust` + `REFERENCE-RESEARCH/SPEC-EDITORIAL-LAYOUT.md` +
`LAYOUT-AUDIT.md`:
- unequal columns / asymmetric staggers; ragged content-derived edges
- uniform tile grids are a CLOSING module only, never load-bearing structure
- ghost display-condensed numerals at ~5% `--color-peak`, behind the column, >=1180px only
- Space Mono `hud-label` voice on labels and captions
- accent `#38f8ec` is SCARCE — links/hover/active; `--color-accent-deep` at rest
- smallness used deliberately as a rhythm tool

## 3. Six treatments prototyped, judged at 1280 AND 390

All built as standalone HTML with the real tokens and real self-hosted fonts
(Fraunces Variable / DM Sans Variable / Space Mono, base64-inlined into
`scratchpad/_wf-tokens.css`), rendered in headless Chrome.

| Opt | Treatment | h@1280 | h@390 | Verdict |
|---|---|---|---|---|
| **F/F3** | **Margin-note months** — 7 rows, month in the gutter, that month's names as an inline run | **717px** | **1124px** | **WINNER** |
| A/A3 | Month band — 7 unequal month columns, vertical hairline spines | 459px | 980px | strong runner-up, data-fragile |
| B | Credit roll — one continuous display-serif run, dot-separated | 661px | 1081px | handsome desktop, collapses on mobile |
| E | Weighted poster — linked names big, unlinked small, ghost 2026 | 545px | 841px | REJECT |
| C | Horizontal scroll rail of month cards | 446px | 484px | REJECT |
| D | Timeline spine, alternating sides | 1540px | 1380px | REJECT |

Baseline: 579px @1280 / 1079px @390.

Screenshots: `scratchpad/shot-opt-{A,A2,A3,B,C,D,E,F,F2,F3}-{1280,390}.png`
Prototype sources: `scratchpad/opt-*.html`

---

## 4. Ranked proposals

### 1st — **F3 · "The season as a masthead"** (margin-note months)

`scratchpad/shot-opt-F3-1280.png` · `scratchpad/shot-opt-F3-390.png`

Seven rows, one per month. The month sits in a right-aligned 4.5rem gutter in Fraunces;
that month's sessions run as a single flowing line of display-serif names to its right,
each preceded by a small accent-tinted Space Mono day number. **No panel, no border, no
row rules, no radius.** One continuous vertical accent hairline runs the gutter — a spine,
not a table edge. A ghost `2026` in Anton at 5% peak occupies the negative space top-right
(the steel-and-dust device, desktop-only).

Why it wins:
- **It stops being a box.** 27 horizontal rules -> 0. The only line in the module is
  vertical.
- **The ragged right edge is the composition.** Jan ends short, Apr runs long, Jul ends
  short again. The asymmetry is derived from the data, so it cannot drift into a template.
- **The dead space is claimed, not hidden.** The gap the short months leave is where the
  ghost numeral lives — negative space turned into texture, exactly the exemplar's move.
- **It is robust to the data.** Names flow as text, so a long company name wraps
  naturally. Every column-based treatment (A, C) is hostage to the longest name — A2
  literally clipped "Jul" off the viewport at 1280 when I let columns size to content
  (`shot-opt-A2-1280.png`); A3 still clipped `NeuroGeneces` at 390. F3 cannot do this.
- **The 10 unlinked names are not second-class.** Same face, same size, same colour. The
  only difference is a 1px accent underline + a small arrow on the 16 that leave the site.
  Jun 24's "—" becomes `not on file` in muted italic — honest, and it reads as a note
  rather than a broken row.
- **Mobile is a different layout, not a squeeze.** Below 620px the month drops to its own
  line as a heading and the run flows beneath — 7 labelled groups instead of a 26-row
  wall. Still shorter than today's 1079px only marginally (1124px), but the reader now has
  landmarks; measured height is not the point on this one, orientation is.

Honest costs: it is 138px taller than today at 1280 (717 vs 579) because it uses display
type at 1.22rem instead of 0.95rem sans. That is the trade — it reads as editorial matter,
not as a data table. If height matters more than voice, A3 is the pick.

### 2nd — **A3 · "The month band"** (7 columns, vertical spines)

`scratchpad/shot-opt-A3-1280.png` · `scratchpad/shot-opt-A3-390.png`

Seven month columns across 72rem (breaking the 46rem column properly), each with its own
vertical hairline, ragged bottoms because months are uneven. Most compact of everything
tested (459px @1280, 980px @390 — both *shorter* than today) and the fastest to scan.

Why it is 2nd not 1st:
- **Column widths are hostage to the longest company name.** At 1280 with `1fr` columns,
  8 of 26 names wrap to two lines, which drags the link underline under an orphan word
  ("Motion↗", "Solutions↗", "Therapeutics↗"). At 390 in the 2-column fallback,
  `NeuroGeneces↗` still clips the column edge. Both are fixable
  (`overflow-wrap`, a 1-column break under ~430px, a smaller face) but the fragility is
  structural: next season's data can break the layout.
- It is closer to a table than F3 — seven stacked lists still read as a grid, just a
  better-proportioned one.

Worth building if the operator's priority is compactness over voice. It is the better
choice if this module ever grows past ~40 entries.

### 3rd — **B · "Credit roll"**

`scratchpad/shot-opt-B-1280.png` · `scratchpad/shot-opt-B-390.png`

One continuous Fraunces run, all 26 names, dot-separated, month+day as a mono superscript
before each. Genuinely handsome at 1280 — the most "film credits" of the set. Two failures:
the month is repeated 26 times (visual noise the data doesn't need), and at 390 it degrades
to roughly one name per line, i.e. the old list with more decoration and no landmarks.
F3 is this idea with the redundancy pulled into the margin.

### 4th — **E · "Weighted poster"** — REJECTED

`scratchpad/shot-opt-E-1280.png`. Linked names at 1.7rem Fraunces, unlinked at 0.9rem
sans, ghost 2026 behind. Visually the most striking option and the most obviously "not a
list." Rejected because it does exactly what the brief warned against: PickleMatch,
PixelPay, Retrocycle, Amplified Space and Pristino Labs render at *half the size* of the
linked names. The page's own copy frames these as the same room on the same terms; a
typographic caste system contradicts the writing. It also scrambles the season — you
cannot read January-to-July down a wall of mixed-size type.

### 5th — **C · "Horizontal scroll rail"** — REJECTED

`scratchpad/shot-opt-C-1280.png`. Month cards on an x-overflow rail. It answers "make it
shorter" and nothing else: it is **literally a row of bordered, rounded boxes** — the
anti-pattern with wheels on. It also hides 2 of 7 months off-screen at 1280 (Jun and Jul
never render), which turns a "here is the whole season" claim into a partial one. Built it
to be sure; it confirms the diagnosis rather than fixing it.

### 6th — **D · "Timeline spine"** — REJECTED

`scratchpad/shot-opt-D-1280.png`. Central vertical rule, names alternating left/right,
month markers on the spine. **1540px tall at 1280 — 2.6x the current module** — and it
manufactures the largest dead space of anything tested (two permanently half-empty
columns). The alternation is also its own formula: 26 rows of zigzag is as mechanical as
26 rows of grid. It is the option that most looks like a redesign and least is one.

---

## 5. Exact approach for the top pick (F3)

**Screenshots to show the operator:** `scratchpad/shot-opt-F3-1280.png`,
`scratchpad/shot-opt-F3-390.png`. Standalone source: `scratchpad/opt-F3.html`.

### 5.1 Structural prerequisite

The ledger currently sits inside the second `<div class="wr-inner">` (L294-341), which is
`max-width: 46rem`. F3 wants 60rem. The page already has the pattern for escaping the
column — `.wr-bleed` sits *between* two `.wr-inner` blocks (L273-294). Do the same: close
the `.wr-inner` after the `ledgerIntro` paragraph, emit `<section class="wr-season">` as a
sibling, then reopen a `.wr-inner` for the `wr-close` paragraph. No new wrapper depth, no
change to `CaseStudy.astro` (which Shelby shares).

### 5.2 Frontmatter — group the existing LEDGER, don't restructure it

```ts
// THE 2026 SEASON, grouped for the season band. LEDGER itself is unchanged —
// the month is derived from `d` so adding a session needs no second edit.
const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] as const;
const SEASON = MONTH_ORDER.map((m) => ({
  m,
  rows: LEDGER.filter((s) => s.d.startsWith(`${m} `)).map((s) => ({
    ...s,
    day: s.d.slice(m.length + 1),
  })),
})).filter((g) => g.rows.length > 0);
const WRITEUP_COUNT = LEDGER.filter((s) => "href" in s && s.href).length; // = 16
```

`WRITEUP_COUNT` is optional but worth taking: `wr-ledger-note` currently hardcodes
"Sixteen", which silently goes wrong the first time a link is added.

### 5.3 Markup (replaces the whole `.wr-ledger` div)

```astro
<section class="wr-season" aria-label="PitchBoulder 2026 season — who presented">
  <span class="wr-season-ghost" aria-hidden="true">2026</span>
  <p class="hud-label wr-season-head">The 2026 season</p>
  <dl class="wr-season-rows">
    {SEASON.map((g) => (
      <div class="wr-season-row">
        <dt class="wr-season-mo">{g.m}</dt>
        <dd class="wr-season-run">
          {g.rows.map((s) => (
            <span class={s.co === "—" ? "wrs-i wrs-i--none" : "wrs-i"}>
              <i class="wrs-d">{s.day}</i>
              {"href" in s && s.href ? (
                <a class="wrs-co wrs-co--link" href={s.href} target="_blank" rel="noopener">
                  {s.co}<span class="wrs-out" aria-hidden="true">↗</span>
                </a>
              ) : (
                <span class="wrs-co">{s.co === "—" ? "not on file" : s.co}</span>
              )}
            </span>
          ))}
        </dd>
      </div>
    ))}
  </dl>
  <p class="wr-season-note">
    {WRITEUP_COUNT} of these have a write-up. They're on LinkedIn, where the room already
    is — arrows open them there.
  </p>
</section>
```

Two notes on this markup:
- **JSX/Astro whitespace matters here.** Adjacent `<span class="wrs-i">` siblings must be
  separated by a real space or the line will not break — that is the exact bug the first F
  prototype had (`shot-opt-F-390.png`: the Apr and May rows run off the right edge of a
  390 viewport). Astro's `.map()` inserts no whitespace. Either interleave `{" "}` between
  items or set `word-spacing` on the run and `white-space: nowrap` per item *with* a
  literal separator space — F3's CSS below does the latter, but verify the rendered
  `scrollWidth` at 390 after wiring it up.
- `dl/dt/dd` is the honest semantic (month -> its sessions) and keeps the whole thing one
  landmark for a screen reader instead of 26 list items.

### 5.4 Scoped CSS (replaces `.wr-ledger*`, L476-541)

```css
/* the season — a masthead run, one line per month. Replaces the bordered
   ledger panel: no box, no row rules, one vertical spine, ragged right edge. */
.wr-season {
  max-width: 60rem;
  margin: 2.2rem auto 0;
  padding-inline: 1.5rem;
  position: relative;
  overflow: clip; /* keeps the ghost numeral inside */
}
.wr-season-ghost { display: none; }
@media (min-width: 1180px) {
  .wr-season-ghost {
    display: block;
    position: absolute;
    right: 0.5rem;
    top: 0.4rem;
    font-family: var(--font-display-condensed);
    font-size: 11rem;
    line-height: 0.85;
    letter-spacing: -0.04em;
    color: color-mix(in srgb, var(--color-peak) 5%, transparent);
    pointer-events: none;
    z-index: 0;
  }
}
.wr-season-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  letter-spacing: 0.24em;
  color: color-mix(in srgb, var(--color-accent) 82%, transparent);
  margin-bottom: 1.4rem;
  position: relative;
  z-index: 1;
}
.wr-season-head::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent);
}
.wr-season-rows { margin: 0; position: relative; z-index: 1; }
/* the one line in the module, and it is vertical */
.wr-season-rows::before {
  content: "";
  position: absolute;
  left: calc(4.5rem + 0.6rem);
  top: 0.5rem;
  bottom: 0.5rem;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    color-mix(in srgb, var(--color-accent-deep) 42%, transparent) 7%,
    color-mix(in srgb, var(--color-accent-deep) 42%, transparent) 93%,
    transparent
  );
}
.wr-season-row {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 1.2rem;
  padding: 0.8rem 0;
  align-items: baseline;
}
.wr-season-mo {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-peak);
  text-align: right;
  margin: 0;
}
.wr-season-run {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.02rem, 1.6vw, 1.22rem);
  line-height: 1.9;
  color: var(--color-peak);
  word-spacing: 0.35em; /* the gap between sessions — no separator glyph needed */
}
.wrs-i { white-space: nowrap; word-spacing: normal; margin-right: 0.35em; }
/* the day number is the delimiter, and the only scarce-accent tick at rest */
.wrs-d {
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 0.5em;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--color-accent) 55%, transparent);
  vertical-align: 0.62em;
  margin-right: 0.32em;
}
.wrs-co { text-decoration: none; color: inherit; }
.wrs-co--link {
  border-bottom: 1px solid color-mix(in srgb, var(--color-accent) 26%, transparent);
  transition: border-color var(--dur-hover, 160ms) ease, color var(--dur-hover, 160ms) ease;
}
.wrs-co--link:hover,
.wrs-co--link:focus-visible { color: var(--color-accent); border-bottom-color: var(--color-accent); }
.wrs-out { font-size: 0.5em; opacity: 0.5; vertical-align: 0.72em; margin-left: 0.12em; }
.wrs-i--none { color: var(--color-ink-muted); font-style: italic; }
.wr-season-note {
  max-width: 32rem;
  margin: 1.9rem 0 0;
  font-size: 0.72rem;
  line-height: 1.5;
  color: var(--color-ink-muted);
  position: relative;
  z-index: 1;
}
/* mobile: the month becomes a heading, the run flows under it */
@media (max-width: 620px) {
  .wr-season-rows::before { left: 0; }
  .wr-season-row { grid-template-columns: 1fr; gap: 0.15rem; padding: 0.75rem 0 0.75rem 1.1rem; }
  .wr-season-mo { text-align: left; font-size: 1rem; }
  .wr-season-run { line-height: 1.8; }
}
```

### 5.5 Gates and caveats before this ships

1. **NEW VISIBLE COPY — needs operator read-approval.** Jun 24's `—` becomes
   `not on file`. This page's header already carries a read-approval gate for new copy.
   If approval is not wanted, keep `—`; it renders acceptably in the muted-italic slot,
   just less legibly honest. Nothing else in the module changes wording (aside from the
   optional "Sixteen" -> `{WRITEUP_COUNT}` derivation, which is the same word today).
2. **Tap targets.** At 390 the inline links are ~29px tall (1.02rem serif on 1.8
   line-height). That is under the 44px guideline. Fix by adding
   `padding-block: .35rem; margin-block: -.35rem;` to `.wrs-co--link` on the
   `max-width: 620px` branch — expands the hit box without moving the type.
3. **Verify wrapping after wiring.** Assert `document.querySelector(".wr-season").scrollWidth
   <= innerWidth` at 390. The whitespace-between-items issue in 5.3 is the one way this
   layout can break, and it breaks silently in a screenshot-free build.
4. **`overflow: clip` on `.wr-season`** is required for the ghost numeral, and matches
   `.sd-report`'s `overflow-x: clip` in steel-and-dust. Do not switch it to `hidden` —
   that would create a scroll container.
5. **Cross-page check:** `.wr-*` styles are scoped to `pitchboulder.astro`'s `<style>`
   block, so `CaseStudy.astro` and the Shelby page are untouched. The ghost numeral is
   the third use of that device on the site (steel-and-dust, vybe, now here) — acceptable
   as house grammar, but if `LAYOUT-AUDIT.md`'s F1 finding ("sameness moved up one level")
   is being actively fought, the numeral is the one element to drop; F3 still works
   without it, it just leaves the top-right void empty.

## 6. What I tried and rejected, in one line each

- **Horizontal scroll rail (C)** — solved height by building the exact anti-pattern
  (bordered cards) and hid 2 of 7 months off-screen at 1280.
- **Timeline spine (D)** — 2.6x taller than the thing it replaces, two permanently empty
  half-columns, and zigzag is its own formula.
- **Weighted poster (E)** — beautiful, but renders the 10 unlinked companies at half size;
  contradicts the page's own "same room, same terms" framing.
- **Credit roll (B)** — kept it as 3rd; the month repeats 26 times and mobile flattens back
  to one-per-line. F3 is this idea with the repetition moved to the margin.
- **Content-width month columns (A2)** — `repeat(7, max-content)` overflowed the viewport
  at both 1280 and 390 (`shot-opt-A2-1280.png` shows "Jul" clipped). Proof that column
  layouts here are hostage to the longest company name.
- **Dot separators between names (F, F2)** — left a dangling `·` at every wrapped line end
  on mobile. Removed in F3; `word-spacing` plus the accent day-number does the job with
  no glyph.
