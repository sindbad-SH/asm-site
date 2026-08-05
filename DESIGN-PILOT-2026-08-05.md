# Claude Design pilot — 2026-08-05

Six pages improved **inside the Claude Design project** ("ASM Website — Live Site
Handoff 2026-08-04", id 8d6ebe45-b3bb-4db8-9838-c8ae8937d392), one per nav section,
per the operator's taste-proof approach: review these, then decide about the rest.

**These changes live ONLY in the design project.** Nothing here touches the repo or
deploys. Each edit has an Undo link in the project's chat thread. If approved, the
port back into the Astro components is a separate, later step (Eight-Hands-style,
never a repo overwrite).

Model note: Opus was repeatedly overloaded (status banner up), so the pilot ran on
the design chat's "Try again with Sonnet" fallback — consistent with the standing
model-routing policy (Sonnet executes; the prompts were prescriptive).

## What changed, per page

| # | Page | Design chat's applied change |
|---|------|------------------------------|
| 1 | adventure/field | Gallery wall: uniform 3-col masonry → 4 grid rows with per-row column ratios (1fr–1.6fr); verticals narrowest, dense fill, inline margin-top stagger. Mats/shadows/hovers/plates/links/aspect-ratios untouched; mobile still a single-column stack. |
| 2 | about | Asymmetric two-up columns (wide/narrow, second offset down) instead of even halves; recognitions ledger now a wider left-aligned band between hairlines. Copy tightened (filler cut, sentences shortened); all facts preserved verbatim; portrait untouched. |
| 3 | field-notes/varenna-lake-como | Inline floats 02/03 now differ in width (~19.5rem vs ~12rem); standalone image 04 runs wide (to 46rem) past the ~42rem text column. Prose shifted lightly to first person; all figures (1169, 425m, 198m, Fiumelatte 250m) kept exact. Cover + reel loop untouched. |
| 4 | postcards/brazilian-living | Gallery → 5 hand-placed rows: lead wide beside narrower solo, six-dancer lineup full-width, two staggered 2-ups swapping wide side, full-width chorus finale. Native ratios, no new cropping; prose trimmed, no facts/names changed. |
| 5 | venture/afm-2025 | The four measured worst crops (hero panel-finance-packaging, venue-century-plaza, pavilion-row-egypt, stage-before-doors) switched from 16:9/2:1 letterboxes to 4:3 with recentered windows — heads/facade/banner/screen text whole. Hero + widest containers narrowed (78→64rem, 86→52rem) for width variety. Captions + movement structure untouched. |
| 6 | work/pitchboulder | Two editorial beats: Context room photo breaks out to 64rem (same photo, no new crop); Outcome chapter gets a designed pull-quote from Peter Rothschild's existing testimonial line. Captions already present; rail/structure/Wednesday Room/facts untouched. |

## How to review

Open the design project → click each page in the left nav. Every edit also has
**Undo** next to "Edited index.html" in the chat thread if any of it misses.

## Pre-existing gaps noticed in the design project (NOT from this pilot)

- "Makeshift Film Group" and work-archive "Seriesfest" cards render `file not found`
  (the repo retired /work/seriesfest to a redirect; the bundle never carried these).
- "Entertainment" card renders `file not found`.
- Missing media refs flagged by the design chat while editing (all pre-existing):
  field-notes ambient-loop `poster.avif`; pitchboulder `hook-room-1600.avif`,
  `film-poster-1600.avif` — the bundle stripped/omitted some AVIF variants.

## Relationship to the repo work (branch overnight-polish-2026-08-04)

The repo branch already fixed, in code: the MEME strip (native-ratio rebakes), the
/adventure/field wall, ko-law 39%→49% crop, seriesfest-2026 awards 42%→56% crop.
The design project's own session had separately fixed its MEME strip. Field's fix
now exists in BOTH (different implementations, same intent) — at port time, take the
approved design-project look as the spec and implement it once in the component.
