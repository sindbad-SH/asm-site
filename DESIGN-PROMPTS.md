# Prompts for Claude Design — ASM site

Paste-ready prompts for experimenting in the design project
("ASM Website — Live Site Handoff 2026-08-04"). Treat every result as a
**reference**, not a deliverable — the repo is what deploys, and I port the
approved idea into the Astro component once, where it applies everywhere.

---

## The four rules that make these work

Learned the hard way over two sessions:

1. **Name the file, and forbid the others.** Always end with
   *"Do not touch any other file."* Without it, it wanders into shared markup
   and you get changes you didn't ask for on pages you weren't looking at.
2. **State the measured problem, not a vibe.** "Eleven photos at one identical
   width" gets a fix. "Make it look better" gets a reshuffle.
3. **Ask for ONE structural change per prompt.** Two changes in one prompt and
   it half-does both.
4. **Repeat the guardrails every time.** It doesn't carry them between turns:
   native aspect ratios, never crop into a face, keep facts verbatim, keep nav
   / footer / links / dark palette.

Boilerplate to paste at the end of any prompt:

> Keep every photo at its native aspect ratio and never crop into a face or
> head. Keep every factual claim, name, date and figure exactly as written —
> invent nothing. Keep the nav, footer, links and dark palette unchanged.
> Do not touch any other file.

---

## 1 · Uniform grid → editorial rhythm
*For any page where photos sit in equal-width rows or a tiled grid.*

> In `<path>/index.html` only: the photos run at one repeated display width, so
> the block reads as a grid of rectangles. Re-lay it out with real scale
> variety — at least three distinct widths, a lead photo allowed to run wider
> than the text column, verticals narrower than landscapes, and staggered tops
> so rows read hand-placed. No two adjacent photos may share a width.

## 2 · Wide letterbox crops on square photos
*The SeriesFest / AFM / KO Law sets are square at source (2992×2992), so a 2:1
band throws away half the picture. This is the biggest single problem on the
venture pages.*

> In `<path>/index.html` only: this photo set was shot square, but several
> beats letterbox the square frames into wide bands that discard 40–60% of the
> picture. Find every image with an aspect-ratio wider than 16:9 and judge each
> by what it shows: where the band crops away heads, signage or the room, use a
> taller ratio (4:3 or 3:2) or reposition the crop window so subjects stay
> whole. Tell me which ones you changed and what each was losing.

## 3 · Monotone text page → editorial beats
*For case studies and long single-column pages.*

> In `<path>/index.html` only: every section sits in the same centered column
> at the same width with no visual beat between them. Add one or two beats: set
> one strong existing line as a designed pull-quote, and let one image or panel
> run wider than the text column — a scale change, not a new photo. Use only
> lines already on the page.

## 4 · Copy tightening (safe mode)
*Won't invent facts. Use this rather than "rewrite the copy."*

> In `<path>/index.html` only: tighten the prose toward a confident, plain
> editorial voice — cut filler, cut hype adjectives, shorten long sentences,
> break up any paragraph over four lines. Do not add new claims, names,
> credentials, numbers or dates, and do not change the meaning of any sentence.
> Show me a before/after list of every line you changed.

## 5 · Hero / opening
> In `<path>/index.html` only: rework the opening so the page announces itself.
> Consider a wider or full-bleed lead image, a stronger type hierarchy between
> kicker / headline / standfirst, and more breathing room before the first body
> paragraph. The headline text itself must not change.

## 6 · Card / navigation grid → contents page
*For hubs and index pages.*

> In `<path>/index.html` only: the link cards are a uniform grid, which reads
> as boxes. Rebuild as an editorial contents column: one featured row at larger
> scale, the rest at varied sizes and crops, hairline separators instead of
> bordered boxes. Every link, label and destination stays exactly as-is.

## 7 · Ask it to critique first (no edits)
*Often the most useful one. Run it before deciding what to change.*

> READ-ONLY — do not edit anything. Review `<path>/index.html` as an art
> director. List the five weakest things about the layout, most serious first,
> each with the specific element and why it fails. Then, for each, say what you
> would change. No edits, just the list.

## 8 · Ask it what changed (for handing back to me)
*Run this after a session so I can port precisely.*

> READ-ONLY — do not edit. List every change you made to `<path>/index.html`
> this session: the element, the old value, the new value. Include exact CSS
> properties and image src paths. Short list, no prose.

---

## Good pages to experiment on

| Page | Why it's a useful test |
|---|---|
| `venture/afm-2025` | Worst square-crop offender; prompt 2 |
| `venture/seriesfest` | Hub grid; prompt 6 |
| `field-notes/<any>` | 11 near-identical pages — fix the template once, I port to all |
| `postcards/<any>` | 3 sibling pages, same deal |
| `about` | Single column, thin; prompts 3 + 4 |
| `work/pitchboulder` | Monotone case study; prompt 3 |

**Don't bother experimenting on:** `world` (locked — copy only), `privacy`,
`terms`, `404`.

---

## When to skip Claude Design entirely

For pure crop and layout work I can measure and screenshot the dev server
directly, which is faster than the round-trip. Claude Design earns its place
when **you** want to sit and look at something and poke at it yourself — that's
a real thing, just a different thing.
