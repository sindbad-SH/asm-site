# Art-director critique — 2026-08-05

Read-only pass run in the Claude Design project (the experimental copy) on four
pages the pilot had NOT edited, so every observation matches what `main` ships.
**No files were changed in either place by this pass.**

Pick what you want and I'll implement it here in the repo — the final version.

---

## The theme running through all four

**Small photos that never become a hero.** Its phrase for the home page was
*"it's confetti, not composition"* — lots of micro-shots scattered as texture,
nothing given the scale to anchor a section. It said a version of this
independently on three of the four pages. If you only take one idea from this
document, take that one.

Second theme: **one width repeated down the page.** `max-w-3xl` on the home
page, identical rail cards on /venture, identical stagger geometry on
dawn-patrol.

It also independently re-found the **square-source crop problem** on the
SeriesFest cover — which is the same thing I measured last night across the
venture lane. Two different methods, same conclusion.

---

## Home (`index.html`)

| # | Problem | Its fix |
|---|---|---|
| 1 | **"Paid, delivered, ongoing" proof list** — seven client rows, all identical text-only `.legend-mark` lines in one narrow `max-w-3xl` column. No photo, no weight difference between a paid client and a "relationship-building attendance". Reads as a wall of fine print with no hierarchy. | Promote 2–3 real deliverables (PitchBoulder at minimum) with a thumbnail or scale change, so paid work visually outranks attendance-only entries. |
| 2 | **About-teaser portrait** — a 200×250 crop sitting at the same column width as every text block around it. It's the only photo of a person on the page and it's the smallest, least-earned image on it — "a footnote-sized thumbnail for the founder." | Let it run larger or bleed past the text column — or drop it if it can't earn real size. |
| 3 | **The three cluster tableaux** (wild / market / industry) — each built from 4–5 floating micro-shots drifting around a centered copy block. No single photo in any of the three sections gets to be a real hero image. | At least one full-bleed or dominant shot per chapter, so each terrain has a visual anchor instead of scattered thumbnails. |
| 4 | **Four sections in a row at one width** — "Paid, delivered", Forge the Saga teaser, about-teaser and closing CTA all at identical `max-w-3xl`, separated only by hairlines. | Let one (the about-teaser, most naturally) break the width rhythm. |
| 5 | **Signpost nav is also `max-w-3xl`** — the page's first real content after the hero, but visually identical in weight to the utility footer nav. Nothing signals "these are the four ways in." | Give it scale or treatment that earns its position. |

## Venture index (`venture/index.html`)

| # | Problem | Its fix |
|---|---|---|
| 1 | **Chapter 03's MEME mosaic + program strip** is the tallest, densest block on the page (four collage cards, a meta plate, a nested three-item program row) sitting right after two lean two-line chapters — so it visually outweighs the actual paid client work it's meant to be a lighter aside to. | Cut the program-catalog row from this page (it duplicates `/venture/meme`) or shrink the mosaic to chapters 01/02's scale. |
| 2 | **The story rail's four thumbnails** are locked to identical fixed-width cards in a horizontal scroller, so a red-carpet wide shot, a stage panel and a car three-quarter all get squeezed into one repeated box regardless of subject. | Vary the lead rail card's width, or let it run one size larger. |
| 3 | **Chapter photos have no visible sizing logic** — several are small enough to read as decorative confetti around the video-led anchor card rather than photos that earn attention. | Give at least one supporting photo per chapter real size instead of pure background texture. |
| 4 | **The hero has no photography near it** — S1 is pure type (ghost letters, headline, subhead) with zero imagery, then S2 lurches straight into dense photo collages. | Bring one strong still into the hero so the page doesn't open on typography alone and then hit maximum density. |

## SeriesFest hub (`venture/seriesfest/index.html`)

| # | Problem | Its fix |
|---|---|---|
| 1 | **The contents column shrinks into its finale** — the fixed `featured / textonly / banner / thumb / portrait` sequence puts row 05's 4:5 portrait directly under row 04's 200px square thumb: the two smallest treatments back to back at the bottom. | Swap rows 04 and 05's treatments so the sequence builds toward the close instead of shrinking. |
| 2 | **The cover photo** (`fashion-runway-crowd`) is a **square source stretched to a full-bleed wide banner** via CSS aspect-ratio — the file's own comment already flags this as a crop compromise. | Pick a naturally wide frame for the cover, or reposition the crop window so the runway and audience aren't centre-cropped filler. |
| 3 | **Row 02 (Devil in Disguise)** is pure text with zero image — one plain gap in an otherwise photo-driven index. | Give it at least a small thumb treatment so it doesn't read as a dead entry beside four photographed rows. |

*(Note: row 02 is deliberately imageless — no photo pool exists for that visit,
and the page documents that as honesty. Worth deciding whether "honest gap" or
"visual consistency" wins; I'd keep the gap and make it look intentional rather
than invent a stand-in.)*

## Dawn Patrol (`venture/dawn-patrol/index.html`)

| # | Problem | Its fix |
|---|---|---|
| 1 | **One stagger geometry, reused** — movement one sets 16:9-wide + 4:3-narrow at 58vw/34vw, and every later stagger/duo in the piece repeats that same pattern. | Vary the pairing geometry between movements instead of re-establishing the same ratio each time. |
| 2 | **Only one dominant frame in the whole piece** — nothing besides the single full-bleed 18th-green shot ever gets to be the biggest thing on screen. | Let one more image (the judging shot, or the Ferrari pair) break out to full-bleed so there's a second visual peak. |
| 3 | **The field-log panel** (chassis / model / entrant / judged time) is wedged into the judged-movement duo as a text block competing with the photo beside it, rather than reading as its own beat. | Pull the field log out as its own full-width strip between movements. |

---

## My read on what's worth doing

**Do these — cheap, and they fix the theme:**
- Home #2 (founder portrait at real size) — one-line change, biggest single win
- Home #4 (break the four-in-a-row width) — small, high payoff
- SeriesFest #1 (swap rows 04/05) — trivial, fixes a limp ending
- Dawn Patrol #3 (field log as its own strip) — self-contained

**Do these — bigger, but they're the actual complaint:**
- Home #3 / Venture #3 (give each chapter one dominant photo instead of confetti)
- Home #1 (proof list needs hierarchy)

**Think before doing:**
- Venture #1 — cutting the MEME program row is an information-architecture call, not a layout one
- SeriesFest #2 — same square-source problem as the rest of the venture lane; worth fixing as a lane-wide decision rather than one cover
- SeriesFest #3 — I'd leave the honest gap and style it, not fill it

**Not yet critiqued:** Adventure index, Shelby Pebble Beach, the field-note and
postcard templates, About, Contact, Licensing, work/*. Say the word and I'll
run the same pass on the next batch.
