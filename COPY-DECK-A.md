# COPY-DECK-A — Directive PUB-A (structure)

Every new or changed visible sentence introduced by PUB-A (nav restructure,
/entertainment retirement, /venture story index, /work archive reframe,
/adventure dispatch stream, home structural links), flagged ⚠ OPERATOR
READ-APPROVAL REQUIRED per BUILD-PLAN.md §3.5. Nothing below ships to
production until read-approved; staging carries it now. Pure structural
changes (hrefs only, no label change) are listed for completeness but not
flagged — no new sentence is introduced.

---

## 1. Navigation (`src/consts.ts` — `NAV`, `PRIMARY_CTA`)

Structural: nav collapses from 6 items to 4. "Industry Stories" and "Forge
the Saga" REMOVED from primary nav (Forge the Saga survives as a page,
footer-linked — PUB-B's to rework). The buyer-language sub-labels on
Adventure/Venture ("Drone & aerial production", "Corporate storytelling &
market research — Venture Stories") are REMOVED (service-flavored; dropped
with the services framing). No new label text — this is subtraction.

⚠ Header/hero CTA label: "Forge your saga" → **"Follow the Stories"**
(href changes from `/forge-the-saga` to `/contact#follow`). PUB-C is
building the newsletter-capture UI (`FollowTheStories` component) that will
live at that anchor; `/contact#follow` is the safe placeholder target per
the directive.

---

## 2. Home (`src/pages/index.astro` via `src/consts.ts` — `PAGES.home`)

⚠ `<title>`: "Adventure Storytelling Media — Drone & Aerial Production,
Corporate Storytelling & Market Research | Boulder, CO" → **"Adventure
Storytelling Media — Adventure & Venture Stories from the Field"** (exact
wording suggested by the directive). `meta.description` left UNCHANGED —
also services-flavored, but out of this structural pass's scope; flagging
here as a candidate for a future copy pass.

Structural only (no label change): the H3 tableaux "industry" panel's link
href moves from `/work` to `/venture` (label "The network" unchanged); the
H2 signpost band's Venture path href moves from `/entertainment` to
`/venture` (label unchanged). `PILLARS[2].href` (internal, unused for direct
rendering) updated `/entertainment` → `/venture` for data hygiene.

---

## 3. `/venture` (`src/pages/venture.astro`, renamed from `entertainment.astro`)

The retired `/entertainment` page's content (Pebble Beach + PitchBoulder
chapters, story rail, "from the archive") carries over UNCHANGED. Changes:

⚠ `<title>`: "Venture Stories — Corporate Storytelling & Market Research" →
**"Venture Stories — Adventure Storytelling Media"**

⚠ Hero eyebrow: "Venture Stories — Corporate Storytelling & Market Research"
→ **"Venture Stories"** (drops the buyer-service pairing; the page no
longer sells those as services)

REMOVED entirely: the "E1b · Hire this lane" section — kicker "Corporate
storytelling — services & floors", heading "Hire this lane", the three
service cards (Event & Conference Coverage / The Brand-Story Film / Market
Research & Story Testing) with floors, and its "Book a call" CTA. This page
is now a story index per the directive, not a services pillar.

⚠ Closing CTA: "Book a call" (→ Calendly) → **"Follow the Stories"**
(→ `/contact#follow`) — reuses the same header CTA so the site closes on one
consistent action.

⚠ Story-rail addition — three new tiles (content REUSED VERBATIM from the
retired `/work` "Industry Stories" page, not authored fresh):
- MEME: slate "MEME · MAKESHIFT ENTERTAINMENT MEDIA EDUCATION", title "MEME
  is where this lane starts."
- SeriesFest: slate "SeriesFest · Denver, Colorado", title **"SeriesFest, in
  depth."** (period added to the reused heading for tile-grammar consistency
  — the only new punctuation)
- American Film Market: slate/title copied verbatim from its own article page

---

## 4. `/work` (`src/pages/work/index.astro` — fully rewritten)

Entire page is new copy (was "Industry Stories": MEME anchor + SeriesFest/AFM
coverage shelf + a conservative close, now retired/refiled to `/venture`).

⚠ `<title>`: **"Archive — All Stories | Adventure Storytelling Media"**

⚠ `meta.description`: **"Every story published by Adventure Storytelling
Media, indexed in one place — Adventure Stories and Venture Stories,
together."**

⚠ Eyebrow: **"Archive"**

⚠ H1: **"All stories."**

⚠ Intro: **"Every story on the site, in one place — sorted into the two
columns it's told across."**

⚠ Column headings: **"Adventure Stories"**, **"Venture Stories"** (reused
nav labels as section headers — not new claims, but new placement)

Link labels: mostly copied VERBATIM from each destination page's own title
(flagged there already, reuse adds no new claim). A few carry a short
appended qualifier that IS new copy:
⚠ "Adventure Stories — the index" / "Venture Stories — the index"
⚠ "The Field — every location, Field Notes dispatch stream"
⚠ "Top shots with Amazing Aerial — the highlights reel"
⚠ "A startup workshop series, on camera — KO Law"
⚠ "The agency that takes our aerials to market — Amazing Aerial"

---

## 5. `/adventure` (`src/pages/adventure.astro`)

REMOVED entirely: the "A1b · Hire the operator" section — kicker
"Production services", heading "Hire the operator", body ("Aerial and
ground cinematography for productions..."), the day-rate price note, and
its "Book a call" CTA. Story-index framing, not services, per the directive.

⚠ NEW section replacing it — "the dispatch stream": kicker **"Field Notes ·
dispatch stream"**, heading **"Every dispatch from the field."** — a plain
numbered list of all 11 published Field Notes entries (title + month/year),
newest first, each linking to its own `/field-notes/<slug>` page. Titles/
dates are pulled directly from the field-notes content collection — no
invented copy in the list itself.

---

## 6. `src/pages/entertainment.astro` (retired → redirect)

No authored user-facing prose — the file is a permanent redirect to
`/venture` (base-path-aware; Astro's static-redirect meta-refresh page,
same pattern as `venture/makeshift-film-group.astro`'s existing interlock).
The retired page's full original content is preserved in git history under
`src/pages/venture.astro` (git-renamed, not deleted).

---

## Non-copy structural notes (not flagged — data classification, not prose)

- `WORK_ARCHIVE` — Vybe's `lane` flips from `"adventure"` back to
  `"venture"` per this directive's explicit operator ruling (superseding
  the 2026-07-21 Round-5 placement). Same title/date/phrasing strings;
  only WHERE it renders changes (now `/venture`'s "from the archive" band,
  was `/adventure`'s).
- `PAGES.work` in `src/consts.ts` — the retired meta/eyebrow/intro/meme/
  coverage/close fields were REMOVED (not reused, not left orphaned).
  `caseStudies` (read by the unowned `work/pitchboulder.astro` and
  `work/shelby-pebble-beach.astro`) is untouched.
