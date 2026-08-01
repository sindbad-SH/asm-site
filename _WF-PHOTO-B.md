# WF-PHOTO-B — Agent B photo hunt (PitchBoulder case study)

Slot 3 = the human moment (replaces DSC08322) · Slot 4 = title slide, different founder (removes the Ashle Jantzen duplication)

Done 2026-08-01. Nothing baked, nothing committed. All working renders in
`C:\Users\Vince\AppData\Local\Temp\claude\C--builds-asm\4a0486cc-4b49-4674-bb57-4366ef4122c3\scratchpad\wfb\`

---

## 1. Pool (complete — I scanned all of `E:\Pitch Boulder`, there is nothing else)

| Source | Count | Notes |
|---|---|---|
| `Top photos for web build\_TIER 1/2/3` | 22 / 45 / 55 | phone squares, EXIF orient 6, only 4 dates: 0429, 0506, 0520, 0617 |
| Jan-28 ARW embedded previews | 98 | pre-extracted at `<scratchpad>\arw\DSC*.jpg`, 6192×4128, reused (not re-extracted) |
| 2-18-2026 | 12 | 4 square stills + 6 video Snapshots + a logo screengrab |
| 4-15-2026 pitchpics | 3 | 6112² / 3876² / 10040² |
| 5-27-2026 | 9 | logo screengrabs only, no usable people frames |
| Everything else | — | `00 Assets` = logos; `Ian KO law` = different client; `5-6 Drone Talk` = video + AI images; per-session folders = thumbnails only |

### Who is who (read off the sheets)
- **01-28** = Humming Agent AI. Two presenters: **tan/oatmeal sweater, grey beard** and **grey sweater, red beard**. These are the two men in the current close-slide (DSC08291) + after-the-pitch (DSC08322). Both DISQUALIFIED as slot-3 subjects.
- **02-18** = **Origami Motion** (Elizabeth Van, co-founder) + Tully.
- **04-29** = provanity cosmetics (Taylor Anderson) + **Perlion / Logan Chang** (the frame already on the page, duo-right).
- **05-06** = Boulder Chamber one-off. **Leyden Space / Ashle Jantzen** (the duplication being fixed) + REM Pal (Alana Arnold) + afternoon Boulder Startup Week (Serhiy Kharytonov / Jetsoft).
- **05-20** = wavelne + **NoLimit Robotics**.
- **06-17** = **Nobility Space**.

---

## 2. Sheets built and actually read

`wfb\arw-01..07` (all 98 Jan-28) · `wfb\arch-01..07` (all 122 tier 1-3) · `wfb\other-01..03` (36 from the
minor sessions) · 900px 2-ups `wfb\s3arch_a..d`, `wfb\s3arw_a..d` · ~35 crop tests in `wfb\crops\`
(each at 900px **and** at shipping size) · ship-size comparison strips `wfb\slot3-ship.jpg`,
`wfb\slot3-ship2.jpg`, `wfb\slot4-ship.jpg` · face/slide zooms `wfb\crops\z1..z9`.

### The hard finding on slot 3
**The entire post-pitch / networking body of work is the Jan-28 RAW session (DSC08308–08330), and every frame
in it centres one or both of the two disqualified men.** The phone archive was shot from a fixed back-of-room
vantage: wide, ceiling-heavy frames with small figures — nothing in it reads as an intimate exchange at 17rem.

Two escape routes were tested and one failed:
- **Failed:** cropping the *left* of DSC08317–08320 (a second conversation — man in a black flat-brim cap
  talking with a woman in a cream sweater). The focal plane was on the two men behind, so both foreground
  subjects are soft. Verified at `wfb\crops\a1-08318-left-900.jpg`. Fails the sharpness gate.
- **Worked:** the **Q&A exchange at DSC08294–08296** — a bald, bearded man in a black tee, lanyard, hands up
  mid-question, with a row of attentive faces behind him. Neither disqualified man is in the crop.

---

## 3. SLOT 3 — the human moment (portrait 4:5, ships ~272 × 340)

All crop boxes are in **pixels of the image after `sharp().rotate()`**. Fractions given too.

### 1st — `DSC08295` · the question being asked  ✅ fully compliant
- **Path:** `E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\DSC08295.ARW`
  (preview already extracted at `<scratchpad>\arw\DSC08295.jpg`, 6192×4128)
- **Why:** the only frame in the whole archive that is a genuine "the questions that were too specific to ask
  in front of forty people get asked" moment **and** contains neither of the two men. He is caught with both
  hands open mid-sentence (frozen sharp — the neighbouring DSC08294 has the same gesture motion-blurred, which
  is why it loses). Three listening faces behind him carry the "room re-forms" idea. Eyes open, in focus.
- **Crop box:** `left 0, top 1651, width 1486, height 1858` → frac `x .000  y .400  w .240  h .450`
- **Watch:** it is the busiest of the three at 272px — you read "a man speaking up in a room" rather than one
  clean subject. Renders: `wfb\crops\h1-08295-tighter-900.jpg` / `-ship.jpg`.

### 2nd — `DSC08315` · the founder answering one-to-one  ⚠️ CONDITIONAL — read the flag
- **Path:** `E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\DSC08315.ARW`
  (preview at `<scratchpad>\arw\DSC08315.jpg`, 6192×4128)
- **Why:** this is the best photograph in the entire pool for this slot and it is *literally* the sentence beside
  it — the presenter down off the screen, mid-word, answering one person, the listener's hair filling the
  foreground, flat grey wall behind for total separation. Tack sharp, eyes open, mouth open. It is the only
  candidate that survives 272px with a single unmistakable subject (see `wfb\slot3-ship.jpg`, first tile).
- **Crop box:** `left 1486, top 83, width 2848, height 3560` → frac `x .240  y .020  w .460  h .862`
- **🚩 FLAG:** the subject is the **tan-sweater Humming Agent co-founder**. He is *not* the squinting man in
  DSC08322 (that is the red-bearded one) — so it does fix the stated squint complaint — **but he is one of the
  two men in the current closing photo DSC08291**. Only use this if the closing photo is replaced with a frame
  that does not contain him. If DSC08291 stays, this repeats exactly the mistake the operator called out.
- **Alternate beat, same setup:** `DSC08316` (same box) — he is listening, not talking. Calmer, less alive.

### 3rd — `DSC08296` · same exchange, hand raised higher  ✅ fully compliant
- **Path:** `E:\Pitch Boulder\2026 Recordings\1-28-2026\Photos\DSC08296.ARW`
- **Why:** the next frame in the same burst; his hand is up higher and more legible as "asking". Sharper read of
  the gesture than DSC08295, but his head has turned further away so you get more back-of-head and less face
  (verified at 4× — `wfb\crops\z6-08296-face-900.jpg`). Offer it if the operator prefers the gesture to the face.
- **Crop box:** `left 0, top 1486, width 1734, height 2168` → frac `x .000  y .360  w .280  h .525`

**Rejected and why:** all of DSC08308–08316 / 08325–08330 (tan-sweater man) and DSC08317–08324 (red-beard man)
— same men. `20260617_090538` (two men standing mid-room) — the near man is back-to-camera, dies at ship size.
`DSC08305/08306` — sharp and compliant but it is an audience *listening*, not a conversation.
Everything in the 0429/0506/0520/0617 archive — wide room frames, no intimate moment exists in that set.

---

## 4. SLOT 4 — title slide, different founder (square 1:1, ships ~320 × 320)

### 1st — `20260520_091528` · **NoLimit Robotics**, 05-20
- **Path:** `E:\Pitch Boulder\Top photos for web build\_TIER 1 - TOP (make stories)\20260520_091528.jpg`
  (3056×3056 after rotate)
- **Verbatim legible slide text** (confirmed at 4× — `wfb\crops\z1-nolimit-slidetext-900.jpg`):
  - `NoLimitRobotics`  *(set as one word, two-tone: "NoLimit" in dark grey, "Robotics" in light blue)*
  - `Faster, safer aircraft baggage handling`
  - No founder name appears on the slide.
- **Why 1st:** a genuinely different week from both Perlion (04-29) and Leyden Space (05-06), so the pair now
  reads as "a different company each week." Highest-resolution source of the three (3056², plenty of retina
  headroom). The wordmark survives the 320px render intact (`wfb\slot4-ship.jpg`, first tile). Founder is sharp,
  eyes open, mid-gesture (`wfb\crops\z7-nolimit-face-900.jpg`).
- **Crop box:** `left 61, top 183, width 2873, height 2873` → frac `x .020  y .060  w .940  h .940`
- **Near-identical alternate:** `20260520_091531` (`_TIER 2 - GOOD`), same box, slightly flatter gesture.

### 2nd — `589e539e-225c-44c5-864a-7c180cee4b51.jpg` · **Origami Motion**, 02-18
- **Path:** `E:\Pitch Boulder\2026 Recordings\2-18-2026\589e539e-225c-44c5-864a-7c180cee4b51.jpg` (1080×1080)
- **Verbatim legible slide text** (confirmed at 4× — `wfb\crops\z2-origami-slidetext-900.jpg`):
  - `origami`  *(lowercase wordmark with a paper-crane mark to its left)*
  - `The First Smart Cabinet to Autonomously Fold Laundry`
  - There is a small letterspaced word directly under "origami" which is **NOT legible in this frame** — do not
    caption it. (For your own reference only: the clean logo card in the same folder,
    `804e4ef3-f573-4d48-87b0-410a019efa5d.jpg`, shows it reads `m o t i o n`. Sourced from that file, not this one.)
  - No founder name appears on the slide.
- **Why 2nd:** the biggest, most legible wordmark of any candidate at 320px — it is the clearest read in the
  whole slot-4 strip. A different month entirely, and a woman founder in red, which gives the duo real variety
  against Logan Chang instead of two men in near-identical poses. She is mid-word, eyes open behind glasses.
- **Crop:** none needed — the file is already 1:1. Ship the full frame.
- **Watch:** 1080×1080 source. Fine for a 320px slot at 2× DPR (needs 640), but there is no headroom beyond about
  540px display. This is the only reason it is not 1st.

### 3rd — `20260429_091056` · **provanity cosmetics**, 04-29
- **Path:** `E:\Pitch Boulder\Top photos for web build\_TIER 2 - GOOD\20260429_091056.jpg` (3192×3192)
- **Verbatim legible slide text** (confirmed at 4× — `wfb\crops\z3-provanity-slidetext-900.jpg`):
  - `provanity cosmetics`  *(lowercase, hot pink)*
  - `Founder and CEO Taylor Anderson`
  - Below: a four-up strip of model photos. **This is the only candidate whose slide names the founder** — if
    you want a caption with a name on it, this is the one.
- **Why 3rd:** technically the best legibility of the three and the presenter is on the *left*, which mirrors
  rather than repeats the Perlion composition. Held back because it is the **same session (04-29) as the
  existing Logan Chang / Perlion frame** — same morning, so it undercuts the "different company each week"
  point that is the whole reason this pair exists.
- **Crop box (recommended, drops the browser chrome bar above the slide):**
  `left 319, top 639, width 2553, height 2553` → frac `x .100  y .200  w .800  h .800`
  (test render at `wfb\crops\s4d2-0429-091056-nochrome-900.jpg` used top .185, which still leaves a sliver at
  top-right — use .200)
- **Full-frame box if you want the room:** `left 128, top 255, width 2937, height 2937` → frac `.040 / .080 / .920`
  — but this shows a Chrome tab bar reading "Superhuman · 4.29 Perlion.pptx – Goo…" across the top of the slide.
- **Alternate frame:** `20260429_091053` (`_TIER 2`), same boxes — she is squinting mid-word there, 091056 is better.

**Rejected and why:** `20260617_090946` (Nobility Space) — presenter is across the room, wordmark tiny
(`wfb\crops\z4-nobility-slidetext-900.jpg`). `2-18 Snapshot_6.JPG` — 1920×1080 video grab; any 1:1 crop
amputates the "ori" of the logo. `20260415_091723` (Amplified Space) — screen shows "The Solution", not a
title slide. All 05-06 frames — Boulder Chamber venue, and that is Ashle Jantzen's session.

---

## 5. Housekeeping
- Temp scripts `_wf-sheets.mjs`, `_wf-big.mjs`, `_wf-crop.mjs`, `_wf-ship.mjs` were created in the repo root and
  **deleted** after the run. Nothing was written to `public/`. No commits. `C:\builds\asm\src` untouched.
