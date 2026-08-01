# HANDOFF: Editorial Layout Overhaul (from session 12ab3daa, 2026-08-01)

Start here. This file is the complete state transfer — the prior chat thread was
retired because activating it crash-looped the Claude app (huge transcript + a
4,400-untracked-file gitDiff in C:\builds\asm). Work from THIS repo folder.

## The task (operator's words)

> "A lot of the layouts I'm not a fan of… I'll open the page and it's sort of one
> big photo and then a chunk of text and then all the photos are just sort of
> formulaically stacked next to each other like boxes… maybe you can look at some
> competitor websites and formulate what can be improved and then implement that
> on the various pages."

Plus two riders:
1. **PitchBoulder**: replace the top-down box-opening photo (used repeatedly) with
   better frames at varied scales.
2. **LinkedIn context mining** — READ-ONLY (no posting/liking/commenting/following/
   messaging/profile edits): his personal channel + the ASM company channel posts
   give presenter names, dates, companies, and which photos belong to which event.

## Hard constraints

- **Max effort, sequential single agents. NO ultracode / parallel fan-out** — the
  machine (GTX 1650 4GB, 6-core) is running other work and parallel load kills it.
- Agents must **write output files EARLY and update incrementally** — the machine
  has restarted mid-run three times already.
- Prefer WebFetch text over heavy browser rendering.
- This repo = the LIVE site. C:\builds\asm\src is a STALE copy — never edit it.

## State

- Repo clean at `0c54e07` (surgical honesty fixes), pushed, live on staging:
  https://sindbad-sh.github.io/asm-site/ (base path /asm-site).
- **Research is DONE**: `C:\builds\asm\REFERENCE-RESEARCH\SPEC-EDITORIAL-LAYOUT.md`
  (189 lines) — 15 named block types with cited examples (Atavist, Alpinist,
  Magnum, Roads & Kingdoms), 3 documented rhythm sequences, measurable rules,
  anti-patterns. Optional top-up: Sidetracked + a scrollytelling example were
  bot-blocked to WebFetch (needs browser) — nice-to-have, not blocking.
- Key research findings to build against:
  - No two consecutive images share width AND orientation — alternate at least
    one axis (width, orientation, or grouping) every beat.
  - Uniform tile grids are a CLOSING "more to read" module only — never the
    story body. (His complaint = that module promoted to the whole page.)
  - Long text stretches (500-1500 words) between image beats are normal; image
    density on real editorial sites is LOWER than our pages run.
  - Smallness is a rhythm tool (200px related thumbnails, small triptychs).
  - Captions: italic, small, directly under image, credit in brackets —
    identical across sites; adopt verbatim.
  - The documented "rhythm module" (Magnum): hero w/ caption → section heading →
    2-3 paragraphs → pull quote → small thumbnail → whitespace break, repeat.

## Remaining pipeline (one agent at a time, in order)

1. **Sameness audit** — measure the 7 story pages against the spec: block
   sequence per page, consecutive same-size images, image density,
   scale variance. Output: `LAYOUT-AUDIT.md` in this repo.
2. **Design-system synthesis** — one max-effort pass turning spec + audit into
   per-page block resequencing plans (each page gets a DIFFERENT rhythm, drawn
   from the documented sequences — seven pages must not feel identical).
3. **Build** — per-page commits. Include the PitchBoulder photo replacement
   (mine E:\Pitch Boulder\2026 Recordings + 2025 for varied-scale frames) and
   LinkedIn-sourced captions/credits where they add named context.
4. **Adversarial critic** — independent agent re-measures every claim on the
   built pages (screenshot + DOM) before anything is called done.
5. Push to staging only after the critic passes it.

## The 7 pages

- /adventure/steel-and-dust — the operator's design EXEMPLAR (his taste anchor)
- /adventure/vybe — passed MEETS BAR on 4th attempt; don't regress it
- /venture/dawn-patrol (Pebble Beach)
- /venture/seriesfest
- /venture/afm-2025
- /work/pitchboulder — needs the photo replacement
- /venture/meme

## Known tooling in this repo

- `scripts/measure.mjs` — puppeteer-core harness: settled page height, stagger
  differentials, repeated-image detection, distinct display widths.
- `scripts/make-vybe-section-v5.mjs` — reference for the image bake pattern
  (avif+webp, sharp attention-crop, slug-width naming under public/media/).

## Operator gates still open (do NOT resolve these yourself)

- He hasn't read the ~250-row copy deck.
- Contact form endpoint (Formspree or similar) not chosen.
- Shelby / Pebble Beach paid-vs-unpaid answer pending.
- Ian courtesy heads-up before flipping PUBLISH_KO_IAN.
- Hero loop A/B/C, masthead A/B/C, B&W Teardown Study v2, urban grade bake-off
  winner, world "archive" copy framing — all awaiting his picks.
