# _WF-PHOTO-A — Replacement photo hunt (PitchBoulder case study)

Agent A · 2026-08-01 · COMPLETE

Two slots:
- SLOT 1 — room-size shot, materially different vantage (replaces full-bleed band `20260429_091146(0).jpg`)
- SLOT 2 — closing image (replaces `DSC08291.jpg`)

## Disqualified / already used
DSC08301 (hero) · 20260429_091146(0) (band, being replaced) · 20260520_090713 · 20260429_090738 ·
leyden-space-hero / leyden-space-title / perlion-title / followus-handoff ·
DSC08322 (rejected, squinting) · DSC08291 (rejected, blurry/eyes closed) ·
0506_* = Boulder Chamber, avoid unless flagged.

## 1. Pool inventory
- Curated archive `E:\Pitch Boulder\Top photos for web build`: T1 22 / T2 45 / T3 55 (T4 ignored).
  Sessions present: 0429 (fullest room), 0506 (Chamber — avoided), 0520, 0617.
  All phone squares 6112x6112, EXIF orientation=6 — every measurement/crop below is post-`.rotate()`.
- Jan-28 RAW session: 98 embedded previews already extracted at
  `<scratchpad>\arw\DSC*.jpg`, native **6192x4128 (exactly 3:2)**. Reused, no re-extraction.
- Other sessions checked: 2-18 (snapshots/thumbnails only, no usable room stills),
  4-15 pitchpics (3, all presenter close-ups), 5-27 (screenshots/AI images only).

## 2. Contact sheets looked at
`<scratchpad>\pb-arw-sheet-1..4.jpg` (all 98 ARW previews),
`<scratchpad>\wfa\phone-0429.jpg` (38), `phone-0520.jpg` (28), `phone-0617.jpg` (24),
then detail sheets `room-0429-a/b.jpg`, `room-arw-a/b.jpg`, `close-arw-1/2/3.jpg`.

Key negative finding: **DSC08294–08307 are the same back-left burst as the hero DSC08301.**
Near-identical vantage — all excluded from SLOT 1 per the burst rule. DSC08245/08253 are
centre-back over-the-heads frames, same look-direction as the hero, also weak.
0520 and 0617 are visibly emptier rooms; 0429 is the only phone session that reads "packed".

## 3. Finalist renders inspected
`<scratchpad>\wfa\big-*.jpg` (1000–1200px), `band-*.jpg` (true 1.98:1 shipping crop, 1400px),
`zoom-*.jpg` (4x face crops for blink/blur check).

---

## 4. PICKS

### SLOT 1 — room size, different vantage (full-bleed band, 1.98:1, max-height 62svh)

Native for all three: **6112x6112** (post-rotate). Band height at 1.98:1 = **3087**.

**#1 — `E:\Pitch Boulder\Top photos for web build\_TIER 2 - GOOD\20260429_090426.jpg`**
- Session 2026-04-29. Vantage: **back of the room, square-on to the front wall** — not down the
  table axis. The hero's whole geometry (one-point perspective along the long tables) is absent.
- ~18 people in two table blocks flanking a centre aisle; host standing centre; **both projection
  screens legible with "About PitchBoulder"** — the frame captions itself.
- Crop: `extract({ left: 0, top: 2380, width: 6112, height: 3087 })` (usable range top 2250–2500).
- Defect: phone low-light, host is slightly soft at 4x; fine at band downsample. Foreground
  laptop/cup get clipped by the band — intentional.

**#2 — `E:\Pitch Boulder\Top photos for web build\_TIER 3 - MAYBE\20260429_090850.jpg`**
- Session 2026-04-29. Vantage: **left flank, mid-room, looking laterally across the space** —
  tables run left-to-right across frame, presenter at the far right edge.
- ~20 people (highest headcount in the pool); full exposed-concrete ceiling + duct run, and the
  "K∅"/Galvanize glass wall at left gives real depth. **Sharpest of the three at 4x** — foreground
  faces crisp, no blinks, no motion blur.
- Crop: `extract({ left: 0, top: 2445, width: 6112, height: 3087 })` (range 2350–2550).
- Defect: none material. Backpack/red jacket clutter in the low-left corner.

**#3 — `E:\Pitch Boulder\Top photos for web build\_TIER 3 - MAYBE\20260429_090608.jpg`**
- Session 2026-04-29. Vantage: **the literal reverse angle** — camera stands where a presenter
  stands (front-left), looking back at the seated room; host at right against the "Reminders" slide.
- ~12 people, ceiling/duct structure retained, strong diagonal of the long table into frame.
- Crop: `extract({ left: 0, top: 2280, width: 6112, height: 3087 })`. Do **not** go below
  top ≈ 2400 — the host's head clips.
- Defect: fewest people of the three; nearest attendees are in profile.

Alternates (not ranked in, but on file):
- `_TIER 3 - MAYBE\20260520_091549.jpg` — different **session** (0520) if variety matters more than
  headcount; same cross-room geometry as #2 but a sparser room and a hunched foreground figure.
  Crop top ≈ 2445.
- `_TIER 3 - MAYBE\20260429_091554.jpg` — gorgeous wide from the room's right flank, presenter at
  left. **FLAG: it is Logan Chang / Perlion at the Perlion title slide — the same person and same
  slide as the `perlion-title` duo-right image.** That is exactly the duplication being fixed, so
  I did not rank it.

No 0506 (Boulder Chamber) frame was needed for this slot.

### SLOT 2 — closing image (contained, ~46rem, 3:2)

Native for all three: **6192x4128 — already exactly 3:2, so no crop is required.**
Source RAWs in `E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\`; working previews in
`<scratchpad>\arw\`.

**#1 — `DSC08329`** (`...\1-28-2026\Photos\DSC08329.ARW` → `<scratchpad>\arw\DSC08329.jpg`)
- Session 2026-01-28. **The room after.** Front wall, whiteboard wiped completely blank, wall clock,
  laptop bag on the table, projector cart shoved aside. Two separate after-talk conversation pairs
  bookend the frame with the empty board between them. 4 people.
- Verified at 4x: red-beard man sharp, **eyes clearly open**, relaxed; grey-bearded man in profile
  sharp, eyes open. No blink, no motion blur on either.
- Crop: **full frame, `left 0, top 0, 6192x4128`.** The empty whiteboard is the point — don't tighten.
- Note: this is the same red-bearded man who was the blurry/eyes-closed subject in the rejected
  DSC08291. Here he is clean — reads as the same story landing properly.
- Defect: none. (DSC08328 is the same beat 1s earlier but his mouth is wide mid-laugh — skip it.)

**#2 — `DSC08318`** (`...\Photos\DSC08318.ARW` → `<scratchpad>\arw\DSC08318.jpg`)
- Session 2026-01-28. Four-person standing huddle after the pitch — man in the black cap gesturing
  (back to camera, frames the left), woman with a coffee cup and the grey-bearded man soft in the
  mid-ground, red-beard man sharp at right with a slight smile, eyes open. Warm, genuinely candid,
  lovely shallow-DOF fall-off.
- Crop: **full frame, `left 0, top 0, 6192x4128`.**
- **FLAG:** same cluster/scene as the operator-rejected DSC08322 (a tight frame of this man, a few
  seconds later, squinting). This frame does not have that defect, but if he reads it as "that
  scene again", drop to #3.

**#3 — `DSC08341`** (`...\Photos\DSC08341.ARW` → `<scratchpad>\arw\DSC08341.jpg`)
- Session 2026-01-28. Posed three-man group portrait against the plain wall — all three sharp,
  all eyes open, all smiling, cleanest technical frame in the entire set. Reads as an end-card.
- Crop: **full frame, `left 0, top 0, 6192x4128`.**
- Defect: it is posed and the plain wall loses the room. `DSC08338` is a near-equal alternate;
  avoid `DSC08334`/`DSC08336` (left-hand man's eyes half-closed).

Alternate on file: `_TIER 3 - MAYBE\20260617_090538.jpg` — sparse room, two men standing with backs
to camera, others still seated at far tables; "networking after" feel from a different session, but
weaker faces and a much emptier room.

## Housekeeping
Temp script `_wf-sheet.mjs` in the repo root has been deleted. Nothing was baked into `public/`,
nothing was committed, and `C:\builds\asm\src` was not touched.
