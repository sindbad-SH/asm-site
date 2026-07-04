# MEDIA-GUIDE.md — filling in the real photos and video

> **Who this is for:** anyone dropping real media into this site — Sindbad by hand, a
> different AI, or a cheap/fast model. You don't need the build history or BUILD-PLAN.md to
> use this file. Every slot below tells you exactly what to make, where to put it, and which
> line of code to touch. Nothing here requires Fable-tier reasoning — it's mechanical.
>
> **The pattern, once, so the rest of this file makes sense:** every media slot on this site
> is a **placeholder component that also IS the shot list** — if you load any page right now,
> you'll see dashed boxes with text like "ABOUT PORTRAIT — environmental portrait, ≥1600px."
> That text is quoted verbatim in this guide next to its fix. Once you add the real file and
> pass it as a prop, the placeholder disappears and the real media shows — **no other code
> changes, no rebuilding the component.**

## Priority order (do these in this order)

**Stills → stories → video, last.** This site is photo-and-writing first; video is
selective, used only where a specific piece of footage earns the spot (see `/adventure`'s
ambient-reel slot, explicitly marked optional). Concretely:

1. **Adventure gallery stills** (S2) — the single highest-impact thing you can add. See
   Worked Example 2.
2. **Real copy** for the `[confirm]` case-study text (who PitchBoulder is, the ask, the
   outcome) — these are text edits in `src/consts.ts`, not media, but they unblock the case
   study page more than any image will.
3. **PitchBoulder package stills + testimonial** (S3/S4).
4. **About portrait** (S12) — one photo, quick win.
5. **Video, last** — the Cobra/Pebble Beach derivations (Worked Example 1), the Adventure
   ambient reel (optional), the PitchBoulder hook/BTS/commercial.

## How to verify anything you change

After editing, always run from the repo root:

```
npm run build
```

This must print `0 errors` and the honesty-audit lines must say `exclusion audit passed`. A
`[confirm] placeholder` warning is expected and fine on a normal build — it only **fails**
a build run with `DEPLOY_TARGET=production` set, which is the pre-launch check, not your
day-to-day one. If you see a real error, stop and fix it before moving to the next slot.

## The four media components (what each one is for)

| Component | Use for | Key props |
|---|---|---|
| `Placeholder.astro` | A single still image in a fixed aspect ratio | `ratio`, `label` |
| `HeroVideo.astro` | A full-bleed poster-first ambient video loop | `poster`, `sources` |
| `ScrubSequence.astro` | A scroll-scrubbed frame sequence (Apple product-page effect) | `poster`, `framesBase`, `count` |
| `YouTubeEmbed.astro` | A click-to-load embed for a **full** video (never self-hosted) | `videoId`, `poster` |

You never edit these component files. You only change the props passed to them in the page
files listed below.

---

## Every media slot on the site, in order

### 1. `/about` — the portrait

- **What belongs there** (quoted from the placeholder): *"ABOUT PORTRAIT — environmental
  portrait, ≥1600px (S12)"*
- **Spec:** one still, ≥1600px on the long edge, exported to AVIF (with a WebP fallback if
  you want maximum compatibility). Environmental portrait = Sindbad in a real setting, not a
  studio headshot.
- **File to change:** `src/pages/about.astro`, the `<Placeholder>` call (search for
  `ABOUT PORTRAIT`).
- **Folder:** `public/media/about/portrait.avif`
- **Recipe:**
  ```bash
  ffmpeg -y -i portrait-source.jpg -vf "scale=1600:-1" -c:v libaom-av1 -crf 28 -b:v 0 \
    public/media/about/portrait.avif
  ```
- **Code change** — replace the `<Placeholder>` call with a real `<img>` (or keep
  `Placeholder`'s framing by wrapping your own `<img>` in `.map-inset`, matching what
  `Placeholder.astro` does):
  ```astro
  <img
    src={`${base}/media/about/portrait.avif`}
    alt="Sindbad Horizon, The StorySmith"
    class="mx-auto max-w-sm map-inset"
    width="1600" height="2000" loading="eager" decoding="async"
  />
  ```

### 2. `/adventure` — the gallery (the most important slot on the site)

See **Worked Example 2** below — this is the photo-first priority's #1 target.

### 3. `/adventure` — the ambient reel (optional, below the gallery)

- **What belongs there:** *"AMBIENT REEL — OPTIONAL / SELECTIVE (§9.5) — only if a specific
  piece of footage earns the spot; the gallery above is the primary surface. If used: muted
  ambient loop, ≤8s · 720p · ≤1.5MB AV1/H.264, poster ships first."*
- **This slot is optional by design.** Skip it entirely unless you have one specific clip
  that deserves a full-bleed moment. If you never fill it, the page still works — it just
  shows the annotated placeholder, which is harmless (not a broken state).
- **File to change:** `src/pages/adventure.astro`, the `<HeroVideo>` call below the gallery
  section (search for `AMBIENT REEL`).
- **Folder:** `public/media/adventure/reel-loop.mp4` + `public/media/adventure/reel-poster.avif`
- **Recipe:** see the "Ambient loop recipe" template below.
- **Code change:**
  ```astro
  <HeroVideo
    poster={`${base}/media/adventure/reel-poster.avif`}
    sources={[{ src: `${base}/media/adventure/reel-loop.mp4`, type: "video/mp4" }]}
    placeholderLabel="…"
    class="mx-auto max-w-5xl"
  />
  ```

### 4. `/work/pitchboulder` — the hook (full-bleed opener)

- **What belongs there:** *"HOOK MEDIA (§2c) — PitchBoulder commercial still or a short
  ambient loop (S3). Poster ships first."*
- **File to change:** `src/components/CaseStudy.astro`, the `<HeroVideo>` call at the top
  (search for `HOOK MEDIA`). This component is shared by every future case study, so a real
  `poster`/`sources` value here needs to come from `CaseStudy`'s props, not be hardcoded —
  simplest approach: add `hookPoster?: string` and `hookSources?: VideoSource[]` to
  `CaseStudy.astro`'s `Props` interface, pass them into the `<HeroVideo>` call, then supply
  them from `src/pages/work/pitchboulder.astro` where `<CaseStudy study={study} base={base} />`
  is called.
- **Folder:** `public/media/work/pitchboulder/hook-poster.avif` (+ `hook-loop.mp4` if using video)
- **Recipe:** a still is simplest — just an AVIF export of the strongest commercial frame (see
  Worked Example 1's poster recipe). If you want the loop instead, use the "Ambient loop
  recipe" template.

### 5. `/work/pitchboulder` — the context still

- **What belongs there:** *"CONTEXT STILL — a PitchBoulder event frame (S3)"*
- **File to change:** `src/components/CaseStudy.astro`, the `<Placeholder ratio="16/9" ...>`
  call in the "01 · Context" section (search for `CONTEXT STILL`). Same pattern as the About
  portrait above: add an optional `contextImage?: string` prop to `CaseStudy`, thread it in
  from `pitchboulder.astro`, and swap `<Placeholder>` for a real `<img>` when it's present
  (conditionally, so other future case studies without a supplied image still get the
  placeholder).
- **Folder:** `public/media/work/pitchboulder/context.avif`
- **Recipe:**
  ```bash
  ffmpeg -y -i event-still-source.jpg -vf "scale=1600:-1" -c:v libaom-av1 -crf 28 -b:v 0 \
    public/media/work/pitchboulder/context.avif
  ```

### 6. `/work/pitchboulder` — the BTS scroll-scrub sequence

- **What belongs there:** *"BTS SCRUB (§2c/§4) — behind-the-scenes of the commercial as a
  scroll-scrubbed sequence. WebP · ≤96 frames · ≤2.5MB. Supply framesBase+count to activate."*
- **This is genuinely optional** — a nice-to-have motion moment, not required for the page to
  work. Skip it unless you have real BTS footage worth turning into a scrub sequence.
- **File to change:** `src/components/CaseStudy.astro`, the `<ScrubSequence>` call (search for
  `BTS SCRUB`). Currently `count={0}` (no frames). To activate, add `framesBase` and a real
  `count`:
  ```astro
  <ScrubSequence
    framesBase={`${base}/media/work/pitchboulder/bts/f-`}
    frameExt="webp"
    count={72}
    poster={`${base}/media/work/pitchboulder/bts/poster.webp`}
    placeholderLabel="…"
  />
  ```
- **Folder:** `public/media/work/pitchboulder/bts/f-001.webp` … `f-072.webp` (3-digit,
  zero-padded — this is `ScrubSequence`'s default `framePad={3}`)
- **Recipe:** see the "WebP scrub-sequence recipe" template below, using your BTS clip as the
  source instead of the Cobra master.

### 7. `/work/pitchboulder` — the commercial (full video, YouTube only)

- **What belongs there:** *"COMMERCIAL — YouTube embed, click-to-load facade (S3). Supply the
  video id; full video is never self-hosted (§4)."*
- **Rule (binding, §4):** full videos are **never** self-hosted on this site — only YouTube
  embeds, and only as a click-to-load facade (zero contact with YouTube until the visitor
  clicks). This isn't a preference, it's a hard constraint: GitHub Pages hard-caps files at
  100MB, and a real commercial-length export will exceed that.
- **File to change:** `src/pages/work/pitchboulder.astro` — currently:
  ```astro
  // commercialVideoId stays undefined until Sindbad supplies the YouTube id (S3).
  ```
  Change to:
  ```astro
  const commercialVideoId = "YOUR_YOUTUBE_VIDEO_ID"; // the 11-char id from the video URL
  ```
  and pass it: `<CaseStudy study={study} base={base} commercialVideoId={commercialVideoId} />`
- **Where to get the id:** from a YouTube URL like `https://www.youtube.com/watch?v=XXXXXXXXXXX`,
  the id is the `v=` value (11 characters).
- **No ffmpeg needed for this one** — it's just a string.

### 8. Any Work-grid card or Adventure-gallery tile (attribution cards)

- **What belongs there:** each card's placeholder label reads `"<item title> — grid
  thumbnail"` — this is generic, reused across `/work` and `/adventure`'s galleries.
- **These are DATA-driven, not per-page code changes.** Every card on both pages comes from
  the `WORK` array in `src/consts.ts`. See Worked Example 2 — you don't touch page files at
  all for these; you add/edit `WORK` entries.

---

## Reusable ffmpeg recipes

Requires ffmpeg on your machine (`ffmpeg -version` to check; if missing, install via
`winget install Gyan.FFmpeg` on Windows or `brew install ffmpeg` on Mac).

### A. Poster / still recipe (any single frame → AVIF, §4 budget: hero ≤160KB, gallery thumb
≤60KB, full view ≤350KB)

From a video, grab one frame at time `T` seconds in:
```bash
ffmpeg -y -ss <T> -i "source-video.mp4" -frames:v 1 frame.png
```
From a still image (or the frame you just grabbed), encode to AVIF at a target size — start
at `crf 28` and raise the number (worse quality, smaller file) if you're over budget, lower it
if you have headroom:
```bash
ffmpeg -y -i frame.png -vf "scale=1600:-1" -c:v libaom-av1 -crf 28 -b:v 0 output.avif
```
Also export a WebP fallback (older-browser safety net; same source, no scale needed if already
sized right):
```bash
ffmpeg -y -i frame.png -c:v libwebp -q:v 74 output.webp
```
Check the size: `ls -la output.avif` — if it's over budget, increase `crf` (try 32, 36…) and
re-run.

### B. Ambient loop recipe (video → muted, looping AV1 clip, §4 budget: ≤8s, 720p, ≤1.5MB)

```bash
ffmpeg -y -ss <START> -t 8 -i "source-video.mp4" \
  -vf "scale=1280:720" -an -c:v libaom-av1 -crf 40 -b:v 0 -cpu-used 6 \
  output-loop.mp4
```
- `-ss <START>` = where in the source to start (seconds)
- `-t 8` = clip length in seconds (stay at or under 8)
- `-an` = strip audio (ambient loops are always muted)
- `-crf 40` is a **tested starting point** (verified against real 4K footage: `crf 34` produced
  1.77MB — over budget; `crf 40` produced 1.23MB — comfortably under). Footage with more motion/
  detail may still come in high; if so raise further (try 44, 48…) or shorten `-t`. Footage that's
  simpler can afford a lower crf (try 36) for better quality at the same budget.
- Check the size after: `ls -la output-loop.mp4` — must be ≤ 1.5MB (1,572,864 bytes).

Always also make a poster (recipe A above, grabbing a frame from partway through this same
clip) — `HeroVideo` needs a `poster` prop or it shows the annotated placeholder as its base
layer even once you add `sources`.

### C. WebP scroll-scrub sequence recipe (video → numbered WebP frames, §4 budget: ≤96 frames,
1280×720, avg ≤26KB/frame, ≤2.5MB total)

**Do this as two steps, not one.** A single ffmpeg command piping video straight to a `.webp`
sequence pattern (`f-%03d.webp`) does NOT reliably produce numbered stills — depending on your
ffmpeg build, the libwebp muxer can instead collapse every frame into ONE animated `.webp` file
(this was confirmed while writing this guide: a one-step attempt produced a single 6MB
`f-001.webp` containing all the frames, not 96 separate files). Extracting PNGs first and
converting each individually is the reliable path:

```bash
mkdir -p public/media/<page>/<sequence-name>

# Step 1 — extract a real numbered PNG sequence (the image2/png path is reliable
# for multi-frame output, unlike the webp muxer). fps × duration should land at
# or under 96 total frames (12fps × 8s = 96; a shorter clip can use a higher fps).
ffmpeg -y -ss <START> -t <DURATION> -i "source-video.mp4" \
  -vf "fps=12,scale=1280:720" \
  "public/media/<page>/<sequence-name>/f-%03d.png"

# Step 2 — convert each PNG to WebP individually (loop; this is the part that
# must run per-file, not as one multi-output command)
for f in public/media/<page>/<sequence-name>/*.png; do
  bn=$(basename "$f" .png)
  ffmpeg -y -loglevel error -i "$f" -c:v libwebp -q:v 20 \
    "public/media/<page>/<sequence-name>/${bn}.webp"
  rm "$f"   # remove the intermediate PNG once its WebP exists
done
```
- `-q:v 20` is a **tested starting point** (verified against real 4K footage: `q:v 70` averaged
  ~62KB/frame — 6MB total, over budget; `q:v 20` averaged ~29KB/frame — 2.8MB total, close to
  budget). Detailed/busy footage may still run slightly over; if so drop further (try `q:v 15`)
  or reduce the frame count (lower `fps` in step 1, or shorten `-t`).
- This produces `f-001.webp`, `f-002.webp`, … matching `ScrubSequence`'s default `framePad={3}`
  and `frameExt="webp"`.
- Check the **frame count** and **total size** before moving on:
```bash
ls public/media/<page>/<sequence-name>/*.webp | wc -l          # must be ≤ 96
du -ch public/media/<page>/<sequence-name>/*.webp | tail -1    # must be ≤ 2.5M
```
Then grab a poster frame from the same range (recipe A) — `ScrubSequence` also wants a
`poster` prop for its no-JS/reduced-motion fallback.

---

## Worked Example 1 — the Cobra / Pebble Beach film (full walkthrough)

**Context:** Sindbad covered a restored Shelby Cobra at the Pebble Beach Concours d'Elegance
(attended with the car's owner — see the Honesty Ledger in `src/consts.ts`'s `RELATIONSHIPS`
array for the exact permitted phrasing; never describe this as an official Pebble Beach
engagement). The finished film lives at:
```
E:\Old Projects\Pebble Beach 2025\Edited\Video\Main vid\Main project for Jack Bell 24 fps.mp4
```
This file is **4K (3840×2160), ~98 seconds, ~474MB.** It cannot be self-hosted — GitHub Pages
hard-caps files at 100MB, so this master is nearly 5× over the limit even before counting the
site's other assets. This isn't a style choice, it's physically required: **the full film goes
to YouTube; only short derivations (loop/poster/frames) are cut from the local master and
self-hosted.**

### Step 1 — upload the full film to YouTube (outside this repo)

Upload `Main project for Jack Bell 24 fps.mp4` to YouTube (unlisted is fine if you don't want
it publicly searchable — it still works as an embed). Copy the video id from the URL.

### Step 2 — wire the YouTube id into the site

This film is referenced from **two places**:

**(a) The Work grid card** (`src/consts.ts`, the `WORK` array, `slug: "shelby-pebble-beach"`)
— currently:
```ts
{
  slug: "shelby-pebble-beach",
  title: "A restored Shelby at Pebble Beach",
  pillar: "entertainment",
  forOrg: "[confirm]", // the car owner's name, with permission
  what: "attended with a car owner to cover a restored Shelby",
  engagement: "[confirm]",
  relationshipId: "pebble-beach",
},
```
This entry doesn't currently have an `href` (no case-study page exists for it — it's a card
only, on `/work` and matched by `LegendMark` on `/entertainment`). If you want it to link out
to the YouTube video directly, you could add a plain external link in whatever page renders
this card, but the simplest correct move per the Ledger is to leave the card as attribution-only
(the coverage endorsement, not a portfolio piece with a "watch" CTA) unless Sindbad wants that
changed — **don't invent new UI for this without asking**; the ledger fields (`forOrg`,
`engagement`) are still `[confirm]` and need his real answers regardless of the video.

**(b) Entertainment page (E4 "the rooms")** — this room already shows the Ledger-correct
phrasing via `LegendMark`; it does not currently embed video. If Sindbad wants the actual
clip embedded there, that's a new `<YouTubeEmbed>` call in `src/pages/entertainment.astro` —
follow the same pattern as Section 7 above (`videoId` + `title` + `placeholderLabel`).

### Step 3 — derive the native assets (loop, poster, optional scrub frames) from the local master

```bash
cd "E:/Adventure Storytelling Media Original/06 - Website/asm-site"
mkdir -p public/media/work/shelby-pebble-beach

SRC="E:/Old Projects/Pebble Beach 2025/Edited/Video/Main vid/Main project for Jack Bell 24 fps.mp4"

# Poster — grab a strong frame (pick your own timestamp after watching the source;
# 15s is just a placeholder starting point)
ffmpeg -y -ss 15 -i "$SRC" -frames:v 1 public/media/work/shelby-pebble-beach/poster-source.png
ffmpeg -y -i public/media/work/shelby-pebble-beach/poster-source.png -vf "scale=1600:-1" \
  -c:v libaom-av1 -crf 28 -b:v 0 public/media/work/shelby-pebble-beach/poster.avif

# Ambient loop — 8s starting at 20s, downscaled from 4K to 720p, muted, AV1.
# crf 40 is the tested value for THIS file (see recipe B above) — it produced
# 1.23MB from this exact 20s/8s range; verified while writing this guide.
ffmpeg -y -ss 20 -t 8 -i "$SRC" -vf "scale=1280:720" -an -c:v libaom-av1 -crf 40 -b:v 0 \
  -cpu-used 6 public/media/work/shelby-pebble-beach/loop.mp4

# Check the loop is under the 1.5MB budget
ls -la public/media/work/shelby-pebble-beach/loop.mp4
```

If you also want a scroll-scrub BTS moment from this footage, use recipe C with a different
segment of the same `$SRC` file.

### Step 4 — use the derived files

If this becomes a full case study (like PitchBoulder), follow the `CaseStudy.astro` pattern
above. If it stays a Work-grid card only, the `loop.mp4`/`poster.avif` aren't wired into any
component yet — that's a real design decision for Sindbad (does this card get a hover-preview
loop, a full case study, or stay a static thumbnail?), not something to guess at. Flag it back
to him rather than inventing the presentation.

---

## Worked Example 2 — Adventure gallery stills (the #1 priority slot)

**Context:** `/adventure`'s gallery is the page's main surface (photo-first, §9.5). It's
driven entirely by the `WORK` array in `src/consts.ts` filtered to `pillar: "adventure"` —
currently just 2 placeholder entries. The brief calls for 20–40 real selects. **You add real
photos by adding/editing entries in this array — the page code needs zero changes.**

### Step 1 — pick and export your stills

Source: RAW/JPEG, ≥2200px on the long edge (per the original asset spec). For each selected
photo, export **three widths** for responsive `srcset` (§4: `800/1400/2200w`), each as AVIF
with a WebP fallback:

```bash
mkdir -p public/media/adventure/gallery
SRC="my-photo-source.jpg"
SLUG="italian-alps-01"   # pick a short, unique, url-safe name per photo

for W in 800 1400 2200; do
  ffmpeg -y -i "$SRC" -vf "scale=${W}:-1" -c:v libaom-av1 -crf 30 -b:v 0 \
    "public/media/adventure/gallery/${SLUG}-${W}.avif"
  ffmpeg -y -i "$SRC" -vf "scale=${W}:-1" -c:v libwebp -q:v 74 \
    "public/media/adventure/gallery/${SLUG}-${W}.webp"
done
```

Check sizes against budget (gallery thumb ≤60KB — that's the 800w version, since it's what
renders in the grid; the 1400/2200w versions are for users on high-DPI/large screens and can
run larger, but keep the full view ≤350KB):
```bash
ls -la public/media/adventure/gallery/${SLUG}-*.avif
```
If a size is over budget, raise `-crf` (try 34, 38…) and re-run.

### Step 2 — add the WORK entry (this is the whole code change)

Open `src/consts.ts`, find the `WORK` array (search for `export const WORK`). The two existing
adventure placeholders look like this:

```ts
{
  slug: "alps-expedition",
  title: "[confirm] — Italian Alps expedition selects",
  pillar: "adventure",
  forOrg: "Personal / Editorial",
  what: "expedition photo & film, Italy",
  engagement: "personal / editorial",
},
```

To add a **new** real still, add a new entry to the array (don't just edit the placeholder
title — add alongside it, or replace it if this new photo IS that expedition):

```ts
{
  slug: "italian-alps-01",
  title: "Above the treeline, the Dolomites",   // a real, evocative title — your call
  pillar: "adventure",
  forOrg: "Personal / Editorial",
  what: "expedition photo, Italy",
  engagement: "personal / editorial",
},
```

**Notes on the fields:**
- `slug` — must be unique across the whole `WORK` array; keep it matching your file naming
  for your own sanity (not required by the code, just good practice).
- `engagement` — leave as `"personal / editorial"` for self-driven expedition work. Only use
  `"paid engagement"` or `"unpaid coverage"` if this is licensed/commissioned work — check
  with Sindbad before changing this field, since it's an honesty-ledger-adjacent label.
- **Do not add a `relationshipId` field** unless this specific photo is genuinely licensed
  through Amazing Aerial Agency (see the comment already in that file, right above these two
  entries, explaining why personal/editorial photos must NOT carry that relationship — it
  would overstate a licensing claim that isn't true for self-driven work).
- `title` starting with `[confirm]` is intentional for the two existing placeholders — it
  means "Sindbad hasn't named/located this shot yet." Once you have a real title, remove the
  `[confirm] — ` prefix. Leaving it in blocks a production build on purpose (the honesty-audit
  script fails the build if any `[confirm]` string survives to the output) — so this is your
  signal that the field still needs a real human answer, not a placeholder gap.

### Step 3 — wire the actual image file

Right now, every `WORK` item's grid tile is generated by `Card.astro` using its
`mediaLabel` prop (an annotated placeholder), passed from `src/pages/adventure.astro`:

```astro
<Card
  mediaRatio="4/5"
  mediaLabel={`${item.title} — grid thumbnail (§2b/§2e)`}
  eyebrow={item.engagement}
  title={item.title}
  meta={item.what}
/>
```

To show a real photo instead of the placeholder box, `Card.astro` needs a small, additive
change: an optional `mediaSrc` prop that renders a real `<picture>`/`<img>` (with the
800/1400/2200w `srcset`) instead of `<Placeholder>` when present, falling back to
`Placeholder` when it's not (so unphotographed `WORK` items keep working). This is the one
piece of actual component work in this guide — a low/medium-effort task, not something to
attempt via a raw prop hack. If you're following this guide with an AI, ask it explicitly to:

> "Add an optional `mediaSrc` / `mediaSrcset` prop to `Card.astro` that renders a responsive
> `<picture>` (AVIF + WebP sources, `srcset` at the three widths) instead of `<Placeholder>`
> when supplied; keep the existing `mediaLabel`-only path working for cards without real media
> yet. Then pass `mediaSrc`/`mediaSrcset` from `WORK` items in `adventure.astro` and
> `work/index.astro` once a corresponding public/media/ file exists for that slug."

That single component change unlocks every future still across both `/adventure` and `/work`
— you won't need to repeat it per photo.

### Step 4 — repeat Steps 1–2 for every selected photo (20–40 of them)

Same three-file export, same `WORK` entry pattern, one per photo. This is the bulk of Phase 6
and the single highest-value thing to spend time on, per the photo-first priority above.

---

## Quick checklist for any new media drop

- [ ] File encoded to the right format (AVIF/WebP for stills, AV1/H.264 mp4 for loops, WebP
      for scrub frames) and under its §4 size budget
- [ ] Saved under `public/media/<page>/...`
- [ ] Prop passed in the matching `.astro` file (see the slot list above for the exact file)
- [ ] `npm run build` → 0 errors, exclusion audit passed
- [ ] Placeholder for that slot no longer appears when you view the page
- [ ] No `[confirm]` was silently resolved with a guess — only real, confirmed facts replace
      a `[confirm]` string
