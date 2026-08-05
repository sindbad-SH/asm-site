# Overnight polish — 2026-08-05

Branch `overnight-polish-2026-08-04`. **`main` untouched, nothing pushed, nothing deployed.**
Restore point: tag `pre-overnight-polish-2026-08-04`.
Build green: 48 pages, exclusion audit + confirm sweep both passed.

---

## The headline: I found the mechanical cause of the photo problem

You said photos "felt off… too zoomed in and cropped somebody's face or just the top
of their heads." That is not a taste problem, it is arithmetic, and it has two separate
causes:

**Cause 1 — the whole SeriesFest / AFM / KO Law photo set was shot SQUARE.**
The source files are 2992×2992 (1:1). The pages then display them in wide letterbox
bands via CSS `aspect-ratio` + `object-fit: cover`. A square photograph in a 2:1 band
shows **50%** of the frame. In a 2.4:1 band, 42%. In the 2.58:1 band I found on
`/venture/ko-law-workshops`, **39%**.

That is where the cut-off heads come from. It also explains all those
`object-position: 50% 84%` / `50% 78%` values scattered through the venture pages —
that is someone dragging the crop window around trying to catch subjects in a window
that was always too short for the picture.

**Cause 2 — on `/venture/meme`, the layout was dictating the crop at BAKE time.**
Every extract box in `make-meme-evergreen.mjs` section 8 had been reverse-engineered
to land on exactly 3:2, because the strip CSS demanded 3:2. The AFM photograph is
natively **portrait** (1080×1440) and was reduced to its bottom half. The Catalina
banner is a tall roll-up and was reduced to a horizontal slice through its middle.

I measured every page with a script that compares each image's natural aspect ratio
against its rendered box, so the numbers below are measured, not impressions.

---

## What I changed

### 1. `/venture/meme` — "The work doesn't stop at the workshop door."

This is the section you were working on in Claude Design tonight. Your instruction
there was *"they kind of cut off a lot of stuff and I'd rather they be optimized where
pretty much the full photos are shown in relativity to the copy… come up with a more
amazing high end layout, reorganize resize everything."*

| Photo | Was shown | Now shown |
|---|---|---|
| American Film Market | 50% of frame (bottom half, 3:2) | **94%** — full 4:5 portrait |
| Catalina Film Festival | a 3:2 slice of the banner | **the whole banner** (1:2) |
| Writer's Retreat | 49% of frame (3:2) | **100%** — full frame (5:4) |

- Re-baked all three at their **native shapes** (`scripts/make-meme-evergreen.mjs`
  section 8 — `STRIP_W`/`STRIP_H` is now a width cap only, not a forced 3:2).
- Rebuilt `.meme-world-strip`: was `repeat(3, 1fr)` with every image locked to
  `aspect-ratio: 3/2`. Now unequal columns (34/24/30), staggered baselines, a degree
  of tilt each — prints laid on a desk rather than three identical rectangles.
- The row now **breaks out of the reading column** into the navy band the section
  already owns. The prints went from 167–236px wide to **309–437px**.
- Measured: distinct display widths 9 → **12**, same-width adjacencies 4 → **2**,
  heavy crops → **0**.

⚠ **Copy changed here — needs your read.** The AFM and Catalina alt texts were
rewritten (they described the old crops). The Writer's Retreat alt said "three people
working on laptops" — there is one laptop and nobody is working, so I corrected it.
Its sub-caption "Quieter rooms, same purpose" was describing a room, but the photo is
outdoors under a canopy; now "No room at all, and the same purpose."

### 2. `/adventure/field` — the stiffest layout on the site

Measured before: **11 photographs, ONE distinct display width, 10 same-width
adjacencies.** The "painting wall" was `column-count: 3`, which by definition makes
every painting exactly one column wide. The vertical nudges were doing all the work of
pretending it wasn't a grid. This was your "a lot of rectangle photos" complaint in its
purest form, and it was the worst instance on the site.

Rebuilt as a real salon hang: a 6-column grid where width varies by both the
photograph's orientation (verticals run narrow) and its position in the run, with
`dense` packing so it stays tight as you add field notes.

Measured after: distinct widths 1 → **3** (318 / 494 / 671px), same-width adjacencies
10 → **2**.

### 3. Two indefensible crops on square sources

| Page | Image | Was | Now |
|---|---|---|---|
| `/venture/ko-law-workshops` | `ian-audience-classification` | 2.58:1 band, **39%** — a strip of ceiling rig, the screen, and the tops of the audience's heads with their bodies cut away | explicit 2:1 anchored low, **49%** — screen, both presenters, the seated room; dead ceiling dropped |
| `/venture/seriesfest-2026` | `awards-ceremony-group` | 12:5, **42%** — honorees cut off at the shins, laurel clipped | 16:9 anchored low, **56%** — full Season 12 title card *and* the complete line of people |

The KO Law one also had no explicit aspect-ratio at all — its shape floated with
viewport height (`max-height: 62svh` on a 100vw image), so the crop changed depending
on the visitor's window. It is now pinned.

---

## What I did NOT change, and why — your call

### The remaining square-source crops (~13 instances)
Same root cause, less severe. Fixing each one properly means looking at the photograph
and deciding what the band should protect, which is a taste call I did not want to make
blind at this scale:

- `/venture/afm-2025` — 4 images at 50–56% (`venue-century-plaza` 2:1, three at 16:9)
- `/venture/seriesfest-2025` — 4 at 50–56%
- `/venture/seriesfest-2026` — `soiree-room` 50%, `opening-night-red-carpet` 56%
- `/venture/seriesfest` (hub) — `fashion-runway-crowd` 44%, `soulpower-red-carpet-aba` 50%
- `/venture` (index) — `dawn-flare` at **36%**, the single worst number on the site: a
  16:9 landscape squeezed into a 0.64 portrait card
- `/venture/dawn-patrol` — `judging-the-cobra` 45% (16:9 into a portrait card),
  `eighteenth-green-sunrise` 54% (16:9 into a 3.3:1 strip)

**The strategic question underneath this:** the venture pages use wide cinematic bands
as their rhythm device, but the photography for them is square. Those two facts fight
each other on every page. Either the bands get shorter, or those beats get filled with
natively-wide photographs. Worth deciding once rather than tuning `object-position`
values forever.

### `/venture/meme` — the Writer's Retreat photo itself
It is a **close-up selfie with three clearly identifiable faces**, one very large. It
sits oddly next to two composed editorial photographs, and it brushes your standing
people rules. Showing *more* of it (which is what you asked for) makes it read as a
retreat rather than a face close-up — so the fuller crop helps — but you may simply not
want it on the site. Flagging rather than deciding.

Also: the previous crop existed partly to keep a bystander's legible "Carhartt" vest
patch out of frame. The full frame includes it again. Incidental brand marks in
documentary photography are normal editorial use, but it reverses a deliberate earlier
decision, so you should know.

### Your Claude Design session
I read the thread rather than porting bytes out of it. The design project holds the
**built** HTML, not the Astro source, so edits there do not deploy — and your session
was mid-flight (its own todo list still had "update the alt text… run
ready_for_verification"). What I did instead was take your stated intent and execute it
in the repo, which is the deploy path.

Two things in that project exist **only** there and would be lost if you abandon it:
- a red-X watermark removal from a card (both sizes)
- an upper-left watermark removal from another image
- `thumbnail.html` (brand mark on `#141922`, 4-swatch strip)

Also worth knowing: the design project's **Makeshift Film Group** card renders
`file not found`.

### Copy
I only touched copy where the photo changes made the existing words wrong (above).
A full copy rewrite would have produced a large queue of new sentences all needing your
read-approval, which is the opposite of useful while you are asleep. The measurable
copy gap I did find: caption coverage is still split — `/adventure/field`,
`/venture` and `/venture/seriesfest` carry no figure captions, where
`steel-and-dust`, `vybe`, `meme` and the SeriesFest chapter pages caption everything.
On the card/nav grids that is arguably correct; on `/adventure/field` it is not,
because those are photographs, not nav tiles.

---

## To see it

```bash
npm run dev
```

Then `/asm-site/venture/meme` (scroll to "Beyond the classroom"),
`/asm-site/adventure/field`, `/asm-site/venture/ko-law-workshops`.
Hard-refresh — the MEME strip filenames did not change, so your browser will serve the
old crops from cache.

To undo everything: `git checkout main` (the branch is separate), or
`git reset --hard pre-overnight-polish-2026-08-04`.
