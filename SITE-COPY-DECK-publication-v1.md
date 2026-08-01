# SITE COPY DECK — publication-v1 (merged, for operator read-approval)

Merges COPY-DECK-A.md (PUB-A, structure), COPY-DECK-B.md (PUB-B, the three
narrative pages), COPY-DECK-C.md (PUB-C, monetization weave), the copy fixed
directly by PUB-D (final QA pass), and the collections-architecture copy
added by PUB-E (2026-07-27, this pass). Organized **by page**, not by agent,
so this is the one document to read end to end. Source decks stay on disk
unchanged.

Every row is one new or changed visible sentence, flagged ⚠ **OPERATOR
READ-APPROVAL REQUIRED** — nothing here has shipped to production
(`DEPLOY_TARGET` stays staging). A short **structural notes** block closes
out each page for href-only / classification-only changes that introduce no
new sentence (per COPY-DECK-A's own convention) — these are not flagged
individually.

## Summary

| Page | ⚠ flagged copy rows |
|---|---|
| Navigation (site-wide) | 1 |
| Home (`/`) | 3 |
| /about | 12 |
| /adventure | 2 + 3 (PUB-E) + 8 (POSTCARD) + 16 (POSTCARD2) + 6 (2026-07-31 visual upgrade) |
| /adventure/vybe (new page) | 14 (2026-07-31 visual upgrade) |
| /venture | 7 + 5 (PUB-E) |
| /work (archive index) | 10 + 1 (PUB-E) |
| /work/seriesfest | 1 |
| /forge-the-saga | 17 + 6 (PUB-E) |
| /contact | 12 |
| /licensing | 7 |
| /world | 3 |
| Footer (site-wide) | 3 |
| Base layout default (site-wide fallback) | 1 |
| **Total** | **79 + 15 (PUB-E) + 8 (POSTCARD) + 16 (POSTCARD2) + 20 (2026-07-31 visual upgrade) = 138** |

Plus: 1 data-classification flip (Vybe, /adventure ↔ /venture — no copy
string changed) and ~20 structural href-only fixes (redirect-hop removal),
neither counted above per the no-new-sentence convention. Full list under
each page's **Structural notes**. PUB-E adds one more: a `hideFromLaneIndex`
data flip on Gigs Go Green + PNUMIX (see /venture's PUB-E structural notes).

**Awaiting operator confirm (not a PUB-D change — flagging only):**
`src/content/field-notes/flatirons-chautauqua.md` still carries date
2023-04-24. Per the eldorado-springs precedent (corrected to 2026-07-03 and
committed), the operator is expected to confirm the same 2026-07-03 date for
this entry, but PUB-D did **not** change it — no confirmation is on record
yet.

---

## Navigation (site-wide — `src/consts.ts` `NAV` / `PRIMARY_CTA`, `Nav.astro`)

| Old line | New line | Flag |
|---|---|---|
| Header/hero CTA "Forge your saga" (→ `/forge-the-saga`) | **"Follow the Stories"** (→ `/contact#follow`) | ⚠ |

**Structural notes:** nav collapses 6 items → 4 (Adventure Stories / Venture
Stories / About / Contact); "Industry Stories" and "Forge the Saga" removed
from the primary nav (Forge the Saga survives as a footer-linked page); the
buyer-language sub-labels on Adventure/Venture nav entries are removed
(service-flavored, dropped with the retired services framing). No new label
text — subtraction only, not flagged.

---

## Home (`/` — `src/pages/index.astro`, `src/consts.ts` `PAGES.home`, `COPY.hero`)

| Old line | New line | Flag |
|---|---|---|
| `<title>`: "Adventure Storytelling Media — Drone & Aerial Production, Corporate Storytelling & Market Research \| Boulder, CO" | **"Adventure Storytelling Media — Adventure & Venture Stories from the Field"** | ⚠ |
| `meta.description`: "Sindbad Horizon, the StorySmith — drone & aerial production, corporate storytelling, and market research from Boulder, Colorado. One operator, research to final cut, working worldwide." | **"Adventure Storytelling Media publishes two kinds of hard-won stories from Boulder, Colorado — Adventure Stories from the field, Venture Stories from the market. One storyteller, research to final cut, working worldwide."** (PUB-D — closes the flag PUB-A left open; removes "the StorySmith" byline and the retired "corporate storytelling…market research" services framing, matches the new `<title>`) | ⚠ |
| About-teaser portrait `alt`: "Sindbad Horizon, The StorySmith" | **"Sindbad Horizon, founder of Adventure Storytelling Media"** (PUB-D — this is Home's own portrait image, separate from `/about`'s; PUB-B fixed `/about`'s copy but Home's had the same stale alt text left over) | ⚠ |

**Structural notes:** H3 tableaux "industry" panel link href moves `/work` →
`/venture` (label "The network" unchanged); H2 signpost band's Venture path
href moves `/entertainment` → `/venture` (label unchanged); `PILLARS[2].href`
(internal, unused for direct rendering) updated `/entertainment` → `/venture`
for data hygiene. None flagged — hrefs only, no label change.

---

## /about (`src/pages/about.astro`, `PAGES.about`) — PUB-B

Full reframe: was the single-arc "StorySmith" narrative; is now the
founder/masthead page — the one place services exist on the site, as a quiet
line.

| Old line | New line | Flag |
|---|---|---|
| `meta.title`: "About — Sindbad Horizon, the StorySmith" | **"About — Sindbad Horizon, Founder"** | ⚠ |
| `meta.description`: "One craft — storytelling — told across the wild, the market, and the industry. Boulder is home base; the world is the territory." | **"Sindbad Horizon, founder of Adventure Storytelling Media, on why the publication covers two kinds of hard-won stories — the summit and the startup — from Boulder, Colorado."** | ⚠ |
| Bio credential line: "The StorySmith" | **"Founder, Adventure Storytelling Media"** | ⚠ |
| Portrait `alt`: "Sindbad Horizon, The StorySmith" | **"Sindbad Horizon, founder of Adventure Storytelling Media"** | ⚠ |
| Opener: "I'm Sindbad Horizon. People call me the StorySmith. I find the truest version of a story and forge it into something people feel." | **"I'm Sindbad Horizon. I started Adventure Storytelling Media to tell two kinds of stories I've come to think are actually the same story."** | ⚠ |
| Narrative (why ASM exists, pt. 1): "I've learned to do that in three kinds of terrain. In the wild… In the market… In the industry…" | **"I've always loved the classic kind of adventure story… somewhere along the way I noticed that a lot of the best adventure stories happening right now aren't on a summit. They're someone starting something…"** | ⚠ |
| Narrative (pt. 2 — the wordplay): "They look like three different jobs. They're one craft…" | **"The word gives it away before I do: the venture is right there inside adventure. So this publication tells both kinds of hard-won stories — the summit and the startup…"** | ⚠ |
| — (new section) | **Adventure Stories column** — "I go to the place and tell the story of arriving — the discoverer's vantage…" | ⚠ |
| — (new section) | **Venture Stories column** — "I go behind the scenes with the people building the thing — founders, teams…" | ⚠ |
| legendLine: "And because trust is the whole point, I mark every relationship on this site at exactly what it is…" | **"None of it is borrowed. Every relationship below is real, stated at exactly what it is:"** | ⚠ |
| — (new section) | **Six relationships now surfaced inline via `<LegendMark>`** — verbatim, pre-approved `permittedPhrasing`; placement is new, wording is not | ⚠ |
| — (new section) | **"Working together"** heading + "I also work directly with founders and organizations on positioning and brand films. If that's you, enquiries go through the contact page." + "Get in touch" | ⚠ |

**Note on MEME (from PUB-B):** the original task brief called this "MEME
board chair." The Honesty Ledger (`RELATIONSHIPS` in consts.ts, corrected
2026-07-08 per meme.ngo/meet-the-team) states the real title as **Member
At-Large** (Board Chair is Amber MacPherson) — that verbatim phrasing is what
renders everywhere. PUB-D re-verified: "Board Chair" does not appear
anywhere user-visible on staging; only in explanatory code comments.

**Structural notes:** "Boulder is home base. The world is the territory."
dropped from this page (stays live on the Home teaser, untouched).

---

## /adventure (`src/pages/adventure.astro`) — PUB-A

| Old line | New line | Flag |
|---|---|---|
| — (removed) | "A1b · Hire the operator" section (kicker "Production services", heading "Hire the operator", day-rate note, "Book a call" CTA) removed entirely — story-index framing, not services | ⚠ |
| — (new section) | **"Field Notes · dispatch stream"** kicker + **"Every dispatch from the field."** heading — a plain numbered list of all 11 published Field Notes entries (title + month/year, newest first), pulled from the content collection | ⚠ |

**Structural / data notes (PUB-D):**
- **Vybe reclassified `venture` → `adventure`** in `WORK_ARCHIVE` (`src/consts.ts`). Binding operator ruling this session: the Vybe story belongs under Adventure Stories. This supersedes PUB-A's placement (which had cited a stale brief). No copy string changed — title "Vybe", date "2023–2024", and the phrasing "event coverage for Vybe" are identical; only which page's "From the archive" band renders it changes. Verified live: Vybe now appears on `/adventure`, not `/venture`.
- `world.astro` NAV comment corrected `/entertainment` → `/venture` (comment only, not rendered).

### PUB-E additions (2026-07-27, Directive PUB-E — collections architecture)

Two additions this pass — a code-level data shape only, plus its section
label copy (the section itself does not render yet):

| Old line | New line | Flag |
|---|---|---|
| — (new, code-level only) | **"Postcards"** kicker | ⚠ |
| — (new, code-level only) | **"Postcards from the road"** heading | ⚠ |
| — (new, code-level only) | **"The smallest stories — one place, one paragraph, a few frames. Filed as they happen."** body | ⚠ |

**Structural / data notes (PUB-E):** a new `POSTCARDS` data array
(`src/data/postcards.ts`) defines the shape for adventure MICRO stories
(title, one paragraph, 2–3 photos, a date) — smaller than a Field Notes
dispatch. It ships **empty**, per the directive ("do NOT render invented
entries"); the section on `/adventure` renders only when it's non-empty, so
nothing above is currently visible on the live page. Expected future filers
(named in that file's header, not invented here): VYBE/Boogie Lights, Nordic
Daughter, Something Tomorrow, others TBD from archive mining.

### POSTCARD additions (2026-07-27, publication-v1 branch — first two entries filed)

Both from the verified **Scandinavian Midsummer Festival, Parfet Park,
Golden, Colorado — June 14-16, 2024, the festival's first year in Golden**
(per `ADVENTURE-ARCHIVE-MINE.md`). `POSTCARDS` is no longer empty; the
Postcards section now renders live on `/adventure`. Every sentence below is
new, first-person copy — flagged per binding voice rules (no invented facts
beyond the verified festival name/venue/dates + what is visibly on screen).

| Field | New text | Flag |
|---|---|---|
| Postcard 1 — title | **"Valkyrie Dance"** | ⚠ |
| Postcard 1 — date | "2024-06-16" | ⚠ |
| Postcard 1 — location | "Parfet Park, Golden, Colorado" | ⚠ |
| Postcard 1 — paragraph | "I caught this one on the closing day of the Scandinavian Midsummer Festival's first year in Golden. A dance troupe in flowing black dresses, trailing teal fabric off their arms, worked through a slow, deliberate routine on a plywood stage in Parfet Park. A few of the dancers wore pale, ghost-white face paint. The crowd sat in folding chairs and on blankets right up to the stage edge, tents and Nordic flags at their backs." | ⚠ |
| Postcard 2 — title | **"Market Row"** | ⚠ |
| Postcard 2 — date | "2024-06-16" | ⚠ |
| Postcard 2 — location | "Parfet Park, Golden, Colorado" | ⚠ |
| Postcard 2 — paragraph | "I ducked through the vendor tents at the Scandinavian Midsummer Festival's first year in Golden. Tables were loaded with dragon figurines, engraved goblets, and jewelry trays, parasols hanging from the tent poles, a Danish flag catching the breeze overhead. Shoppers moved slow through the shade while the foothills rose right behind the last row of tents." | ⚠ |

**Sourcing / honesty note (Postcard 2, "Market Row"):** the source clip on
disk is titled `Chef Eric Mcbride (Scandinavian Festival Golden 2024).wfp`
(a Filmora project — no rendered mp4 exists). The .wfp is a zip archive; it
was unzipped and its `timeline.wesproj` parsed to recover the full edit's
clip list (26 clips, ~9.5 minutes, all cut from two raw DJI source masters:
`DJI_20240616110209_0237_D.MP4` and `DJI_20240616110607_0238_D.MP4`, both
timestamped June 16, 2024). Every clip's midpoint was frame-grabbed and
visually reviewed — the entire timeline is a walkthrough of the festival's
vendor market (dragon figurines, engraved goblets, jewelry, parasol stalls,
tents, the Golden foothills). **No chef, no cooking, and no one
identifiable as "Eric Mcbride" appears in any sampled frame.** Per the
task's binding instruction ("if a clip shows something different from its
filename's implication, write what you SEE"), this postcard is titled and
captioned for what is actually on screen — the project file's working title
is not used or implied anywhere in the visible copy. ⚠ Flagging for the
operator: confirm whether a genuine "Chef Eric Mcbride" segment exists
elsewhere in the raw archive (out of scope for this pass) or whether the
project title was simply a misnomer/placeholder.

**Data / media notes:** `src/data/postcards.ts` gained a `location: string`
field (not in PUB-E's original type) to carry the venue string the task
required; `adventure.astro`'s postcard tile template gained a
`.postcard-loc` line to render it. Stills baked by
`scripts/make-postcards.mjs` from frame-grabs of the two source clips (3
photos per postcard, 700/1200w AVIF+WEBP, 4:5 crop) into
`public/media/adventure/postcards/{valkyrie-dance,market-row}/`.

### POSTCARD2 additions (2026-07-27, publication-v1 branch — "Postcards from
the Road" v2 restructure + the Nordic Daughter / Something for Tomorrow
band-coverage split)

Every postcard is now a **clickable piece** — a small `/adventure` tile that
links to its own detail page (`src/pages/postcards/[slug].astro`: title,
date, location, the paragraph(s), a small gallery, a back-link). The
`Postcard` type's `paragraph: string` field became `paragraphs: readonly
string[]`; the first paragraph is the tile's teaser text.

**Operator correction (overturns `ADVENTURE-ARCHIVE-MINE.md` §4):**
"Something for Tomorrow" is a REAL band, not a mis-hearing of the disk
folder name as the mining report concluded — it's Nordic Daughter guitarist
Jason Lycan's hard-rock side project. Web-verified: nordicdaughter.com/bio
("…including his Hard Rock band Something For Tomorrow") and a
jamsphere.com interview ("Jason is practicing with his other band Something
for Tomorrow, two nights a week"). The mining report's §4 now carries an
⚠ OPERATOR CORRECTION block with this note.

**The Nordic Daughter / Something for Tomorrow split:** every frame in
`Nordic Daughter\Something for tomorrow\` (Rickhouse, Denver, 2024-07-07 —
6 raw DJI drone masters, 3 edited cuts, 1 phone photo) was reviewed. The
venue's own screen displays "Something For Tomorrow" throughout every stage
shot — confirming that ALL performance footage in this folder is Something
for Tomorrow, not Nordic Daughter. Per the operator's framing ("Nordic
Daughter shots are from the AUDIENCE vantage"), the two postcards split
along that line: Something for Tomorrow's postcard uses the confirmed stage
frames; Nordic Daughter's postcard uses genuine crowd/audience frames from
the same night, captioned as the room and crowd — never claiming any
specific person in frame is a Nordic Daughter member (no face in the footage
is identifiable as such). **UNSORTED: none** — no frame reviewed was
ambiguous about which band's stage it showed.

| Postcard | Field | New text | Flag |
|---|---|---|---|
| Scandinavian Midsummer Festival (merged Valkyrie Dance + Market Row) | title | **"Scandinavian Midsummer Festival"** | ⚠ |
| | intro paragraph (new) | "I spent the closing day of the Scandinavian Midsummer Festival's first year in Golden wandering Parfet Park with a camera — a dance stage on one side of the grounds, a row of vendor tents on the other." | ⚠ |
| | Valkyrie Dance paragraph | carried verbatim from the original postcard | ⚠ (reuse) |
| | Market Row paragraph | carried verbatim from the original postcard | ⚠ (reuse) |
| | closing line (new; paraphrases the operator-sanctioned line "Nordic Daughter was there — that's how I met them") | "Nordic Daughter played a set under one of the festival tents that same weekend — that's how I first met them." | ⚠ |
| | added photo | "nd-set" — a Nordic-Daughter-at-the-festival frame (source: `Nordic Daughter\Scandinavian Festivle\Nordic Daughter Scandi Fest Par 1-Thumbnail.jpg`, an already-rendered export thumbnail; Nordic flags + festival tent + crowd visible confirm the setting) | ⚠ |
| Nordic Daughter (new postcard) | title/date/location | "Nordic Daughter" · "2024-07-07" · "The Rickhouse, Denver, Colorado" | ⚠ |
| | paragraphs | "Nordic Daughter's guitarist, Jason Lycan, also plays in the hard-rock band Something for Tomorrow — and on this July night at The Rickhouse in Denver, it was Something for Tomorrow's turn on stage. I shot the room from the crowd's side instead: people packed in close under green and red stage light, drinks in hand, watching from just past the monitors." / "From the side of the room the floor was full — tables in the back, a warehouse-sized crowd on a warehouse floor." | ⚠ |
| | photos (2) | crowd/audience frames from the two raw DJI masters, described only as the room/crowd — no identity claims | ⚠ |
| Something for Tomorrow (new postcard) | title/date/location | "Something for Tomorrow" · "2024-07-07" · "The Rickhouse, Denver, Colorado" | ⚠ |
| | paragraphs | "Something for Tomorrow played The Rickhouse in Denver this July night — hard rock, full band, the venue's own screen running the band's name behind the drum riser. Jason Lycan, who also plays guitar in Nordic Daughter, led out front, long hair catching the stage light." / "Behind him: a bassist with a grey beard, a second guitarist, a drummer, and a keyboardist working a rig stacked with amps and monitors. The room ran blue, then red, then green as the set went on." | ⚠ |
| | photos (3) | confirmed on-stage frames from the edited highlight cut ("Rickhouse 7-7-2024.mp4") | ⚠ |
| The Art of Brazilian Living (new postcard) | title/date/location | "The Art of Brazilian Living" · "2025-06-22" · "Levitt Pavilion, Ruby Hill Park, Denver, Colorado" | ⚠ |
| | venue ID (web-verified) | Levitt Pavilion's free concert series is "presented by Kaiser Permanente" — matches the Kaiser Permanente signage visible behind the stage in the source footage, plus the bowl-shaped lawn topology and skyline view on screen | ⚠ |
| | paragraphs (4) | "This is Boulder Samba School's outdoor showcase from June 22, 2025, at Levitt Pavilion in Denver's Ruby Hill Park — a bowl-shaped lawn amphitheater with the city skyline behind the stage. I got there early enough to walk the grounds: a food truck, a jewelry tent, the hillside filling in with picnic blankets under a clear sky." / "On stage, a singer in a sequined green dress worked the mic in front of a full percussion line — congas, surdos, a drum kit — a Brazilian flag hanging off the scaffolding beside her." / "Three dancers came out in full feathered headdresses — gold, orange, and red — working the front of the stage together. Another dancer, in a shorter blue-feathered piece, had the space to herself, mid-stride, all motion." / "Later, a big circle formed on the pavement in front of a smaller stage — kids and adults both, working through steps together while a Brazilian flag flew from the barrier." | ⚠ |
| | photos (5) | Aline on stage with the percussion line; three costumed dancers; a solo dancer mid-stride; the venue's bowl-shaped lawn; the community dance circle | ⚠ |

**Honesty note — venue name, not festival name:** per the task's binding
instruction, this postcard names the **venue** (Levitt Pavilion, web-verified
above) but does NOT claim the event was "Colorado Brazil Fest" — Boulder
Samba School's flagship Colorado Brazil Fest ran August 7–10, 2025
(confirmed in `ADVENTURE-ARCHIVE-MINE.md` §2), which doesn't match this
June 22, 2025 footage.

**Structural / archive-index notes:** `WORK_ARCHIVE`'s three existing
"From the archive" tiles (`nordic-daughter`, `something-for-tomorrow`,
`brazilian-living`) each gained an `href` pointing at their new
`/postcards/[slug]` page — they now render as links ("Read the story →")
instead of plain unlinked tiles, reusing the same permitted phrasing
already shipped (no new tile copy). A code comment there also corrected
"punk rock" → "hard rock" for Something for Tomorrow's genre (see the
web-verification above).

**Build / verification:** `npm run build` passes (45 pages, honesty audit
clean); all four `/postcards/[slug]` pages verified live on the dev server
— text content, all photo counts (7/2/3/5), and back-links confirmed via
`read_page`; zero broken image requests (all `200 OK`) and zero console
errors.

---

### Nordic Daughter postcard — image re-sourcing correction (2026-07-31,
operator direct review)

**The error.** The POSTCARD2 pass above shipped Nordic Daughter's postcard
with two Rickhouse audience/crowd frames (`crowd-floor`, `crowd-side`) —
captioned honestly at the time ("genuine crowd/audience frames... never
claiming any specific person in frame is a Nordic Daughter member"), but
wrong at a level honesty of caption couldn't fix. Operator: *"For Nordic
Daughter you used shots from their Something for Tomorrow set. I filmed
Nordic Daughter at the Scandinavian Midsummer Festival — any shots will be
from that."* Nordic Daughter was never on the Rickhouse stage — that night
was Something for Tomorrow's own show (a different band that shares a
guitarist, Jason Lycan). The operator's actual Nordic Daughter footage is at
the Scandinavian Midsummer Festival, Parfet Park, Golden, CO, June 2024
(`Nordic Daughter\Scandinavian Festivle\Nordic Daughter Scandi Fest Part
1/2/3.mp4` — 4K/60fps edited masters, titled after the band; this is the
same source that already supplied the scandinavian-midsummer-festival
postcard's "nd-set" frame).

**What changed** (`scripts/fix-nordic-daughter-postcard.mjs`, new script;
`src/data/postcards.ts`):

| Field | Old | New | Flag |
|---|---|---|---|
| date | "2024-07-07" | **"2024-06"** (coarser — the edited masters' own export timestamps span 06-16/06-17, one step removed from true capture date, so a month-level date is the honest claim) | ⚠ |
| location | "The Rickhouse, Denver, Colorado" | **"Parfet Park, Golden, Colorado"** | ⚠ |
| paragraph 1 | "Nordic Daughter's guitarist, Jason Lycan, also plays in the hard-rock band Something for Tomorrow — and on this July night at The Rickhouse in Denver, it was Something for Tomorrow's turn on stage. I shot the room from the crowd's side instead: people packed in close under green and red stage light, drinks in hand, watching from just past the monitors." | **"Nordic Daughter played a set under one of the festival tents at the Scandinavian Midsummer Festival in Golden — the full band on the plywood stage, Nordic flags hung behind them, tent canvas overhead and the crowd seated right up to the edge. Guitarist Jason Lycan led out front; I'd shoot him again a few weeks later fronting his other band, Something for Tomorrow, at a show across town."** | ⚠ |
| paragraph 2 | "From the side of the room the floor was full — tables in the back, a warehouse-sized crowd on a warehouse floor." | **"From the crowd it read as one continuous set — violin and vocals trading the melody, the drummer and keyboardist filling in behind, the whole tent full for it."** | ⚠ |
| photo 1 | `crowd-floor` — Rickhouse audience, deleted | **`festival-set`** — the band performing under the festival tent, singer's arms raised, drummer + guitarist beside her, Nordic flags overhead | ⚠ |
| photo 2 | `crowd-side` — Rickhouse audience, deleted | **`festival-strings`** — violinist and keyboardist performing on the festival stage, festival grounds + Nordic flags visible behind them | ⚠ |

**Frame confidence.** Reviewed via a 42-frame contact sheet sampled across
all three "Scandi Fest" parts (session scratchpad) — continuous, clear
footage of the full band performing under the festival tent throughout; no
ambiguity about which act's stage this is (the source files are literally
titled after the band, and match the setting of the already-shipped "nd-set"
frame). Two frames chosen for maximum distinctness from that existing frame:
Part 3 @ 1270s (wide band shot) and Part 1 @ 100s (violinist + keyboardist
two-shot, "KEEP IT COLD" grounds signage visible). Something for Tomorrow's
own postcard is untouched — its stage footage was already correctly sourced
from its own Rickhouse show.

**Verification:** old `crowd-floor`/`crowd-side` files deleted from disk
(not just replaced); new files baked at the standard 700/1200 avif+webp
convention; `npx astro check` 0 errors, `npx astro build` green (46 pages,
honesty-audit passed); confirmed live on the dev server on both `/adventure`
and `/postcards/nordic-daughter` — correct text, both new images `200 OK`,
zero console errors, zero remaining references to the old Rickhouse frames
anywhere in the built output.

---

## VYBE section (2026-07-31) — replaces "From the Archive" on `/adventure`

**The problem.** `/adventure`'s "From the Archive" band (Round 4/5) rendered
all four `WORK_ARCHIVE` items tagged `lane: "adventure"` — Vybe, Nordic
Daughter, Something for Tomorrow, The Art of Brazilian Living. Three of
those four (everything except Vybe) also render in the Postcards section
immediately below on the same page — a straight content duplication.
Operator: Postcards is the home for those short stories, so the whole band
is retired, not trimmed to just Vybe. Vybe — the one item that wasn't a
postcard duplicate — gets a full section in that slot instead of the old
quiet display-only tile.

**Constraint (per `vybe-community-partner` memo):** editorial coverage only
— NO Vybe brand or logo assets anywhere on this page. Their official asset
pack hasn't been provided yet; this is his own footage/photos of their
events, credited via the site's one honesty channel (LegendMark's verbatim
`permittedPhrasing`, unchanged: "event coverage for Vybe").

**Structure.** Same section grammar as the rest of `/adventure` (hairline
rule + flight-line divider + `hud-label` kicker + `h2`), three body
paragraphs, a 6-photo grid reusing the site's existing 4:5 tile convention
(`scripts/make-vybe-section.mjs`, new — sources the already-culled selects
at `C:/builds/asm/SAMPLES/photos/vybe/`, not raw footage), and a footer row
pairing the LegendMark line with a "Read the full story" link out to the
existing `/work/vybe` case page (content NOT duplicated here — the fuller
account stays on that page, one source of truth).

| Field | New text | Flag |
|---|---|---|
| kicker | "Vybe · Denver · 2023–2024" | ⚠ |
| heading | "In the room with Vybe." | ⚠ |
| paragraph 1 (who) | "Vybe — short for Vibrate Your Best Energy — is a Denver arts, music, and dance collective built around community: Park & Play gatherings, an annual outdoor festival, and whatever room they show up in. I've known the founders since 2023 and have covered two of their nights since — camera coverage only, nothing official." | ⚠ |
| paragraph 2 (2023 festival) | "The first was their outdoor festival in the fall of 2023 — two days beside a lake in the Boulder area, cottonwoods just turning. Friday ran into night: fire and LED flow artists working under string lights strung through the trees. Sunday was the same ground in daylight — a dance circle, a band, a rainbow balloon arch over the gate." | ⚠ |
| paragraph 3 (2024 Boogie Lights — host/guest framing) | "The second was a Boogie Lights show in Denver the following May — Boogie Lights' night, not Vybe's. The collective had a corner of the room, their own chalkboard propped against the wall, and a few of their own performers sat in with the acts on stage. I shot it from the crowd and the balcony both." | ⚠ |
| photo captions (6) | "The 2023 festival · blue hour" / "· from above" / "· after dark" / "· dusk" · "Boogie Lights, 2024" ×2 | ⚠ |
| footer CTA | "Read the full story →" → `/work/vybe` | reuse |

**Assets used** (all camera coverage, zero brand/logo files):

| Slug | Source | What |
|---|---|---|
| `festival-reveal` | `SAMPLES/photos/vybe/vybe-01_blue-hour-reveal.jpg` | Aerial blue-hour reveal, 2023 festival grounds beside the lake |
| `festival-grounds` | `vybe-02_fall-lake-mountains.jpg` | Aerial daylight establishing shot, lake + fall cottonwoods + foothills |
| `flow-arts` | `vybe-05_led-fan-trails.jpg` | LED fan flow artist at night (silhouette, not identifiable) |
| `dusk-circle` | `vybe-06_flowarts-circle-dusk.jpg` | Group flow-arts circle at dusk, balloon arch, wide/no close faces |
| `boogie-room` | `vybe-10_boogie-spotlight-crowd.jpg` | Boogie Lights show, full room + stage, wide |
| `boogie-stage` | `vybe-12_boogie-stage-glow.jpg` | Boogie Lights show, stage glow from the back of the room |

Deliberately excluded from the grid: the two close-up "portrait"/"candid"
Boogie Lights frames (`vybe-13`, `vybe-14`) — this shoot was filmed "on a
handshake, mostly without releases" (per the existing `/work/vybe` case
page), so the grid stays to wide/atmospheric/performance frames, matching
that page's own restraint (`still-stage`, `still-art` — no tight portraits).

**Host vs. guest.** Paragraph 3 states plainly that the May 2024 show was
"Boogie Lights' night, not Vybe's" and that Vybe "had a corner of the room"
— matches the operator's own ruling in `BRAND-SHEET.md` §5 ("Boogie Lights
hosted it; VYBE attended, had a corner, and some VYBE-affiliated acts
performed... may credit VYBE's presence only as a guest"). No venue name is
stated (unconfirmed from footage, per the same memo).

**Structural notes.** `adventure.astro`'s `archive`/`archiveMediaRoot`/
`archivePair` computation and its `WORK_ARCHIVE`/`RELATIONSHIP_BY_ID`
imports are removed (both still used/exported for `/venture` and
`/work/index.astro`, untouched). The unused `.arch-*` CSS block is replaced
with new `.vybe-*` rules in the same file location. `WORK_ARCHIVE`'s data
entries themselves (`consts.ts`) are untouched — Vybe's entry there still
backs its own `/work/vybe` case-page routing; this page just no longer
renders a tile from it.

**Verification:** `npx astro check` 0 errors; `npx astro build` green (46
pages, honesty-audit passed); confirmed live on the dev server — section
renders between the Steel & Dust festival spread and Postcards, all 6 photos
`200 OK`, zero console errors, and the old "From the Archive" content (plus
the now-orphaned Nordic-Daughter/Something-for-Tomorrow/Brazilian-Living
duplicate tiles) confirmed absent from the built HTML.

---

## 2026-07-31 — adventure-page visual upgrade (operator direct review)

Operator set the medieval-festival spread as the quality bar for the whole
page: "everything else must rise toward it at its appropriate scale." Four
changes this pass, each detailed below — (1) the placeholder festival name
fixed to the real, web-verified event name; (2) the VYBE section rebuilt a
second time into an actual magazine-cover teaser + a new rich click-through
page (the section shipped 2026-07-31 above was itself the *first* pass,
flagged by the operator as still "bland — photos laid out in a couple");
(3) two postcards merged per operator instruction, with a new structured
cross-link; (4) a framing swap on the Something for Tomorrow postcard, plus
a magazine-cover redesign of every postcard tile/detail page. Screenshots
taken confirming all four render correctly (adventure.astro, the new
/adventure/vybe page, and both affected /postcards/[slug] pages).

### 1. The Colorado Medieval Festival — placeholder name fixed

**The problem.** The festival teaser block on `/adventure` used a generic
placeholder description instead of the event's real name — everywhere else
on the site (the full `steel-and-dust` story page, its `consts.ts` `steelDust`
copy block, `territory.ts`'s comment) already correctly said "Colorado
Medieval Festival"; only this one teaser hadn't been updated to match.

**Verification.** Already confirmed once in `ADVENTURE-ARCHIVE-MINE.md`
(coloradocastle.com, colorado.com/loveland/events/history-heritage/
colorado-medieval-festival, tickettailor.com/events/thesavagewoodsllc). Per
this task's instruction, re-verified via a fresh web search 2026-07-31:
event runs annually in June at The Savage Woods, 1750 Savage Road, Loveland,
CO; Knights of Mayhem full-contact jousting, Colorado Wardens armored
combat, live music, artisan vendors — matches the site's existing sourced
copy exactly. Sources: coloradocastle.com, colorado.com, tickettailor.com,
festivalnet.com, denver.kidsoutandabout.com.

| Field (`consts.ts`, `PAGES.adventure.festival`) | Old line | New line | Flag |
|---|---|---|---|
| heading | "A medieval festival in Loveland" | **"The Colorado Medieval Festival"** | ⚠ |

**Structural notes:** kicker ("Adventure story · Loveland, Colorado") and
body paragraph were already generic/factual with no misnaming, so left
unchanged. `territory.ts`'s Loveland location dot already correct (a place
name, not the event name — no change needed).

### 2. VYBE section v2 — magazine-cover teaser + new `/adventure/vybe` page

**The problem.** The 2026-07-31 VYBE section documented just above this one
(the section titled "VYBE section (2026-07-31)") was itself flagged by the
operator on a second read as still falling short of the medieval-festival
bar: "too bland — photos laid out in a couple." Explicit ask: a
magazine-cover treatment in the `/adventure` section (matching the
festival's cover-teaser grammar) AND a genuinely richer click-through page —
not the plain `/work/vybe` case page.

**What changed.** The six-photo uniform grid + 3-paragraph block on
`/adventure` is replaced by a compact teaser matching A4b's `fest-teaser`
pattern exactly: a mini cover (bespoke — no "Field Notes" masthead, since
Vybe isn't a numbered Field Notes issue) + two supporting stills + one
condensed paragraph + CTA. The CTA and footer link now point at a new page,
`/adventure/vybe.astro` (not `/work/vybe`), built in the Steel & Dust
editorial grammar (asymmetric photo staggers, a pull quote, a contained
"bleed" band) at a lighter scale — two chapters (2023 festival / 2024 Boogie
Lights), the existing `/work/vybe` golden-hour aerial clip reused as the
first visual after the open, and nine photos total (up from six — three new
frames from the same already-graded contact sheet).

| Field | New text | Flag |
|---|---|---|
| `/adventure` teaser — cover title | **"Vybe"** | ⚠ |
| `/adventure` teaser — cover deck | "Two nights with a Denver arts, music, and dance collective." | ⚠ |
| `/adventure` teaser — condensed intro paragraph | "Vybe — short for Vibrate Your Best Energy — is a Denver arts, music, and dance collective I've known since 2023. I've covered two of their nights since — the 2023 outdoor festival beside a lake, and the 2024 Boogie Lights show — camera coverage only, nothing official." | ⚠ |
| `/adventure/vybe` — cover kicker/title/deck | "Adventure story · coverage" / "In the room with Vybe." (reused) / "Two nights with a Denver arts, music, and dance collective — an outdoor festival by a lake, and a room full of Boogie Lights the following spring." | ⚠ |
| `/adventure/vybe` — chapter labels + captions | "2023 — The festival" / "2024 — Boogie Lights" + ~10 photo/video captions (e.g. "The grounds, Sunday morning.", "Fire staff, Sunday afternoon.", "The Chillsbury Doughboys, from the balcony.") | ⚠ |
| `/adventure/vybe` — sign-off | "The short version, on /work →" (→ `/work/vybe`) | ⚠ |

**New assets** (three frames added to `scripts/make-vybe-section.mjs`, same
already-culled/graded source set, `C:/builds/asm/SAMPLES/photos/vybe/`):

| Slug | Source | What |
|---|---|---|
| `band-golden-flare` | `vybe-08_band-golden-flare.jpg` | Live band at golden hour, 2023 festival — "the best 'peak moment' band shot in the 2-day set" per the source contact sheet. No band name is verified anywhere in the source material, so the caption stays generic ("a band") — nothing invented. |
| `fire-staff-spin` | `vybe-09_fire-staff-spin.jpg` | Fire-staff flow performer, daylight, 2023 festival. |
| `boogie-chillsbury-doughboys` | `vybe-11_boogie-chillsbury-doughboys.jpg` | Wide balcony shot at the 2024 Boogie Lights show — the performing act's name is real, read directly off the venue's own stage signage in frame. |

All three are performers-while-performing (same releases-restraint
precedent as the site's Nordic Daughter / Something for Tomorrow postcards).
Two other candidates from the same contact sheet (`vybe-13`,
`vybe-14` — backstage/candid guest portraits, not performers) were reviewed
and deliberately left out, continuing the original section's restraint
rule.

**Structural notes:** new component `src/components/PostcardCover.astro`
is NOT used here (Vybe's cover is bespoke, matching `.fest-cover`'s
pattern directly in `adventure.astro`, since PostcardCover's grammar is
reserved for the lighter Postcards tier). `/work/vybe.astro` (the shorter
case-page version) is untouched and still reachable — from the new page's
sign-off, and still listed on the flat `/work` archive index.

**Verification:** `npx astro check` 0 errors; `npx astro build` green (46
pages, honesty-audit passed); confirmed live on the dev server — teaser
renders correctly on `/adventure`, `/adventure/vybe` renders all 9 photos +
the video clip at `200 OK`, zero console errors on either page. Screenshots
taken of both.

### 3. Postcards — Scandinavian Midsummer Festival merged into Nordic Daughter

**Operator instruction:** "MERGE the scandinavian-midsummer-festival
postcard (currently only Valkyrie dancers) INTO the nordic-daughter one —
same festival, one postcard telling both (dancers + band). Add a cross-link:
Nordic Daughter's frontman also fronts Something for Tomorrow → 'see that
story' linking to the SfT postcard."

**What changed** (`src/data/postcards.ts`): the standalone
`scandinavian-midsummer-festival` postcard (dance troupe + vendor row, 7
photos) is retired; its dance-troupe and market paragraphs/photos fold into
the surviving `nordic-daughter` postcard (slug and title kept, per the
operator's own naming of the merge target), reordered so the piece opens on
"that's how I first met them" instead of stating it twice. Nothing was
reworded beyond that reordering — every sentence already existed in one of
the two pre-merge entries. The `location` field now leads with the festival
name ("Scandinavian Midsummer Festival · Parfet Park, Golden, Colorado") so
the merged scope reads clearly on the tile, since the postcard is no longer
just about the band.

| Field | Old | New | Flag |
|---|---|---|---|
| location | "Parfet Park, Golden, Colorado" | **"Scandinavian Midsummer Festival · Parfet Park, Golden, Colorado"** | ⚠ |
| date | "2024-06" (coarse) | **"2024-06-16"** (the closing day — matches the merged-in scene-setting paragraph, which specifically describes that day) | ⚠ |
| paragraphs | 2 (band only) | **5** — opens with arrival/scene-setting (dance stage + market + "that's how I first met them"), the dance-troupe paragraph, the market paragraph, the band paragraph, the closing "one continuous set" paragraph | ⚠ |
| photos | 2 (`festival-set`, `festival-strings`) | **8** — adds the six dance/market frames (`formation`, `motion`, `closeup`, `overview`, `stalls`, `parasols`), copied from the retired postcard's media directory | reuse |
| new field | — | **`related: { slug: "something-for-tomorrow", label: "Jason Lycan's other band, Something for Tomorrow — see that story" }`** — a real clickable CTA on the detail page, not just the existing prose mention | ⚠ |
| new field | — | **`pullQuote`** (verbatim, lifted from paragraph 5): "From the crowd it read as one continuous set — violin and vocals trading the melody, the drummer and keyboardist filling in behind, the whole tent full for it." | reuse (extracted, not new) |

**Reciprocal cross-link (not explicitly instructed, added for symmetry —
low-risk, reuses the same mechanism):** Something for Tomorrow's postcard
gains `related: { slug: "nordic-daughter", label: "Jason Lycan's other
band, Nordic Daughter — see that story" }` and a `pullQuote` ("The room ran
blue, then red, then green as the set went on.") — its own paragraphs
already mentioned Nordic Daughter, so this just makes the connection
clickable both ways.

**Media:** the six migrated photo files were copied (not re-baked) from
`public/media/adventure/postcards/scandinavian-midsummer-festival/` to
`.../nordic-daughter/`, then the old directory was deleted.
`scripts/make-postcards.mjs`'s header documents the supersession for anyone
re-running it from scratch.

### 4. Something for Tomorrow postcard — framing swap + Postcards redesign

**The problem (operator, photo pick, not a fact correction):** "SfT
postcard — KEEP the middle photo and the right green-lit photo showing the
main vocalist; REPLACE the left one (badly framed) with a better-framed
frame from the same SfT set." The `stage-wide` (left) frame had the
guitarist pushed to the extreme right edge, partially cropped, with an
otherwise-empty frame dominated by the drum kit.

**What changed:** re-grabbed from the same source (`Rickhouse
7-7-2024.mp4`, t=38s — the same edited cut the kept middle/right frames
came from) and manually cropped — NOT the usual sharp "attention" auto-crop,
which was tried first and reproduced the identical edge-crop failure.
Jason Lycan is now centered, the venue screen with the band's name is still
fully readable above him, and the drummer is visible in context.

| Field | Old | New | Flag |
|---|---|---|---|
| `stage-wide` alt text | "Something for Tomorrow performing at The Rickhouse, the venue's screen displaying the band's name behind the drum riser." | **"Something for Tomorrow's Jason Lycan singing and playing guitar at The Rickhouse, the venue's screen displaying the band's name above the stage, the drummer visible behind him."** | ⚠ |

The middle (`stage-bassist`) and right (`stage-hero`, green-lit) frames are
byte-for-byte unchanged, per the operator's explicit instruction to keep
them.

**Postcards — tile + detail-page magazine-cover redesign (all three
postcards, structural + typography, not new prose).** New shared component
`src/components/PostcardCover.astro` — a smaller, non-"Field Notes"-branded
FieldCover-derived cover treatment (lead photo + scrim + corner survey
marks + mono kicker/title/location baked into the image), used in two
sizes: `compact` for the `/adventure` tile (replacing the old bordered card
with a 3-photo strip + separate text block) and full-size as each
`/postcards/[slug]` detail page's new hero (replacing the old plain text
header). Each detail page also gained: the optional `pullQuote` rendered as
a large-type callout partway through the prose ("a pull-line... not a full
spread"); a gallery where the first supporting photo runs wider than the
rest ("more photos, well laid out" instead of a perfectly uniform grid);
and the `related` cross-link CTA where present. No visible prose changed on
Brazilian Living (no merge, no framing issue, no cross-link target) beyond
gaining a pull-quote (extracted verbatim from its own existing paragraph
3: "Another dancer, in a shorter blue-feathered piece, had the space to
herself, mid-stride, all motion.") and the new cover/gallery layout.

**Verification:** `npx astro check` 0 errors; `npx astro build` green (46
pages — 3 postcard pages, confirming the merge left exactly three, down
from four; honesty-audit passed); confirmed live on the dev server for
`/adventure` (postcard tiles), `/postcards/nordic-daughter`, and
`/postcards/something-for-tomorrow` — covers, pull-quotes, wide gallery
photo, and related-postcard CTAs all render correctly with the re-framed
image in place, `200 OK` on every asset, zero console errors. Screenshots
taken of both postcard detail pages.

---

## /venture (`src/pages/venture.astro`, renamed from `entertainment.astro`) — PUB-A

The retired `/entertainment` page's content (Pebble Beach + PitchBoulder
chapters, story rail, "from the archive") carries over unchanged except:

| Old line | New line | Flag |
|---|---|---|
| `<title>`: "Venture Stories — Corporate Storytelling & Market Research" | **"Venture Stories — Adventure Storytelling Media"** | ⚠ |
| Hero eyebrow: "Venture Stories — Corporate Storytelling & Market Research" | **"Venture Stories"** | ⚠ |
| — (removed) | "E1b · Hire this lane" section (kicker "Corporate storytelling — services & floors", heading "Hire this lane", 3 priced service cards, "Book a call" CTA) removed entirely | ⚠ |
| Closing CTA: "Book a call" (→ Calendly) | **"Follow the Stories"** (→ `/contact#follow`) | ⚠ |
| — (new tile, reused verbatim from retired `/work` page) | **MEME** — "MEME is where this lane starts." | ⚠ |
| — (new tile) | **SeriesFest** — "SeriesFest, in depth." (period added for tile-grammar consistency) | ⚠ |
| — (new tile) | **American Film Market** — slate/title copied verbatim from its own article page | ⚠ |

**Structural / data notes (PUB-D):**
- **Vybe no longer renders here** — see the /adventure section above; the reclassification removes Vybe from `/venture`'s "From the archive" band. Verified live.
- 9 article back-links (`ko-law-workshops`, `afm-2025`, `amazing-aerial`, `seriesfest-2025`, `seriesfest-2026`, `seriesfest-2026-fashion-in-focus`, `seriesfest-2026-soul-power`, `meme`, `makeshift-film-group` — 18 links total, 2 per page) repointed from `${base}/entertainment` to `${base}/venture` — kills the extra redirect hop, no label text changed ("← Venture" unchanged).

### PUB-E additions (2026-07-27, Directive PUB-E — collections architecture)

**Structure now:** three features (Pebble Beach — chapter 01, PitchBoulder —
chapter 02, MEME — chapter 03, new this pass), then two named collections,
then the ungrouped partner rail, then the (now-empty) "from the archive"
band, then the closing handoff.

| Old line | New line | Flag |
|---|---|---|
| — (new feature chapter) | **MEME**, chapter 03 — heading "MEME" + body "The role I hold most formally in this world." + CTA "Read the full story", all reused **verbatim** from `PAGES.entertainment.meme` (no new MEME copy authored, per the directive) | not flagged (reuse only) |
| — (new collection name, PLACEHOLDER) | **"Founders & Pitch Rooms"** — Collection A's name; operator to confirm or rename | ⚠ |
| — (new sentence) | Collection A intro: **"Where founders take the stage — the pitch nights we cover, and the workshop series that gets them ready for one."** | ⚠ |
| — (new collection name, PLACEHOLDER) | **"The Film Industry"** — Collection B's name; alternate suggestion to weigh: **"The Screen Trade"** | ⚠ |
| — (new sentence) | Collection B intro: **"The industry side of the venture lane — the organization, the festival, and the market we keep a pulse on."** | ⚠ |
| — (new label) | **"Collection ·"** kicker prefix (renders as "Collection · Founders & Pitch Rooms" / "Collection · The Film Industry") | ⚠ |

**Structural / data notes (PUB-E):**
- **Collection A** ("Founders & Pitch Rooms"): PitchBoulder + KO Law workshop series. PitchBoulder is also a feature (chapter 02) — the directive is explicit a collection may carry a story that's also featured.
- **Collection B** ("The Film Industry"): MEME + the SeriesFest hub (`/work/seriesfest`, which itself indexes every SeriesFest edition — main program, Fashion in Focus, the Soul Power premiere) + American Film Market.
- **Pebble Beach stays FEATURE-ONLY** — no collection. Per the operator's own rule (a named collection needs ≥2 stories) and Pebble Beach being the only story in that space today, it does not get one. Code comment in `venture.astro` (above the `shelby` lookup) notes a "High Craft / Luxury Events" collection is planned once a second story joins it.
- **Amazing Aerial stays on the ungrouped partner rail** ("More venture stories," unchanged kicker/intro), per the directive ("partner story upgrade planned later") — not folded into either named collection. The held-from-publish film-venture card rides alongside it, unchanged from its prior placement (the directive doesn't name it into A or B).
- **Gigs Go Green + PNUMIX removed from `/venture`'s "from the archive" band entirely** (operator ruling: "commercials are not stories"). Implemented as a new `hideFromLaneIndex: true` flag on both `WORK_ARCHIVE` entries (`src/consts.ts`) — their `lane` classification is untouched, only the lane-index render is suppressed. Both case pages stay live; both stay listed on `/work` (Gigs Go Green as a link, PNUMIX as plain text — it never had a case page, see `/work`'s PUB-E note below). Verified live: the "from the archive" section no longer renders on `/venture` at all (it was the only two items in it).
- `VENTURE_COLLECTIONS` (new export, `src/consts.ts`) is the single source for both collections' story lists; `slate`/`title` strings inside them are copied verbatim from each story's own destination page (already flagged there) — only the collection names + intros above are new sentences.

---

## /work — archive index (`src/pages/work/index.astro`) — PUB-A

Entire page is new copy (was "Industry Stories": MEME anchor + SeriesFest/AFM
shelf; retired/refiled to `/venture`).

| Old line | New line | Flag |
|---|---|---|
| — | `<title>`: **"Archive — All Stories \| Adventure Storytelling Media"** | ⚠ |
| — | `meta.description`: **"Every story published by Adventure Storytelling Media, indexed in one place — Adventure Stories and Venture Stories, together."** | ⚠ |
| — | Eyebrow: **"Archive"** | ⚠ |
| — | H1: **"All stories."** | ⚠ |
| — | Intro: **"Every story on the site, in one place — sorted into the two columns it's told across."** | ⚠ |
| — | Column headings: **"Adventure Stories"**, **"Venture Stories"** | ⚠ |
| — | Link label: **"Adventure Stories — the index"** / **"Venture Stories — the index"** | ⚠ |
| — | Link label: **"The Field — every location, Field Notes dispatch stream"** | ⚠ |
| — | Link label: **"Top shots with Amazing Aerial — the highlights reel"** | ⚠ |
| — | Link label: **"A startup workshop series, on camera — KO Law"** / **"The agency that takes our aerials to market — Amazing Aerial"** | ⚠ |

**Structural notes:** most other link labels are copied verbatim from each
destination page's own title (no new claim, reuse only) — not flagged.
`PAGES.work`'s retired meta/eyebrow/intro/meme/coverage/close fields were
removed from `consts.ts` (not reused, not left orphaned); `caseStudies`
(read by `work/pitchboulder.astro`, `work/shelby-pebble-beach.astro`) is
untouched.

### PUB-E additions (2026-07-27, Directive PUB-E — collections architecture)

| Old line | New line | Flag |
|---|---|---|
| — (new list entry) | **"PNUMIX — Paranormal Palace (2024)"** — plain text, not a link (no case page exists for PNUMIX; title/date read from `WORK_ARCHIVE`, not invented) | ⚠ |

**Structural notes (PUB-E):** Gigs Go Green + PNUMIX were removed from
`/venture`'s index this pass (see that page's PUB-E notes) — per the
directive, "their pages stay live and listed in /work archive only." Gigs Go
Green already had a link here (unchanged). PNUMIX did not — it's now added
as a `VENTURE_ARCHIVE_LINKS` entry, rendered as plain text since it has no
`href` (no case page ever existed for it).

---

## /work/seriesfest (`src/pages/work/seriesfest.astro`) — PUB-D

Pre-existing subpage (Round 5, before this restructure) that wasn't updated
when `/work` was rebranded from "Industry Stories" to "Archive — All
Stories."

| Old line | New line | Flag |
|---|---|---|
| Back-link: "← Back to Industry Stories" (→ `/work`) | **"← Back to the Archive"** (→ `/work`, unchanged) | ⚠ |

---

## /forge-the-saga (`src/pages/forge-the-saga.astro`, `PAGES.forge`) — PUB-B

Full reframe: was the P29 consulting-sales page (rate + 3 priced packages +
2 ongoing services + booking CTA); is now the editorial-method page — five
stages, **no prices, no booking CTA anywhere**.

| Old line | New line | Flag |
|---|---|---|
| `meta.title`: "Forge the Saga — Story Consulting: Market Research + Production, One Operator" | **"The Method — How Stories Get Made \| Adventure Storytelling Media"** | ⚠ |
| `meta.description`: "Hire the consultant who does both halves…" | **"Five stages, research first: how every Adventure Storytelling Media story gets scouted, mapped, forged, tested, and assessed — the same method available to clients through the founder."** | ⚠ |
| hero.kicker: "The StorySmith · Story Consulting" | **"The method"** | ⚠ |
| hero.headline: "A smith forges steel. A StorySmith forges the saga." | **"How the stories get made."** | ⚠ |
| hero.subline: "Most shops sell you production or market research…" | **"Every story published here — adventure or venture — moves through the same five stages before we call it finished. Research comes first, every time."** | ⚠ |
| Hero rate line "$250/hr, scoped per project" + "Book a call" button | **removed entirely** — no rate, no hero CTA | ⚠ |
| "Who it's for" heading + buyer-qualification bullets | Replaced by **"Research comes first"** + explainer + 3 editorial-principle chips | ⚠ |
| "Both halves of the job" lane-routing section | **removed entirely** | ⚠ |
| "The packages" pricing grid (3 packages + 2 ongoing services, "from $X"/"Starts at $X") | Replaced by **"The five stages"** — `SAGA_STAGES` as method cards, no price field rendered | ⚠ |
| Stage 1 body (Story Scouting) | **"Before anything else, we find out who a story is actually for…"** | ⚠ |
| Stage 2 body (Story Mapping) | **"Raw research becomes a shape — who the story is for, what arc actually moves them…"** | ⚠ |
| Stage 3 body (Story Forging) | **"The plan becomes real: the shoot, the edit, the actual film or photographs…"** | ⚠ |
| Stage 4 body (Story Testing) | **"The story meets a real audience before it meets everyone…"** | ⚠ |
| Stage 5 body (Story Assessing) | **"We read what actually happened…"** | ⚠ |
| "Just need production?" lane-exit note + "On pricing" section | **removed entirely (both sections)** | ⚠ |
| Closing headline "No pitch, no pressure." | **"The same method, off the page."** | ⚠ |
| Closing CTA "Book a call" (→ Calendly) + trustline | **"About the founder"** (→ /about) + "Get in touch" (→ /contact), quiet links, no button, no trustline | ⚠ |

**Structural notes:** `SAGA_STAGES`, `FORGE_SERVICES`, `FORGE_PACKAGES`,
`FORGE_CONSULT_RATE` stay untouched in `consts.ts` — PUB-D verified neither
`adventure.astro` nor `venture.astro` import or render `.price` fields from
them; the stale in-code comment claiming otherwise (referencing the retired
`entertainment.astro`) is cosmetic only, no live "from $" string renders
anywhere (confirmed against the built `dist/` output — zero matches).

### PUB-E additions (2026-07-27, Directive PUB-E — collections architecture)

A new "Where the stories go" directory section, added at the bottom of the
page (below the existing close section) — the site's channels, kept
restrained (a plain list, no icons/cards).

| Old line | New line | Flag |
|---|---|---|
| — (new section) | Heading: **"Where the stories go"** | ⚠ |
| — (new sentence) | Body: **"The publication lives in a few places besides this page — new dispatches, the licensed aerial archive, and a quieter sense of how the whole operation runs."** | ⚠ |
| — (new label) | Channel: **"Newsletter"** → `/contact#follow` | ⚠ |
| — (new label) | Channel: **"YouTube"** → the confirmed channel URL already in `SITE.socials` | ⚠ |
| — (new label) | Channel: **"Instagram"** → the confirmed handle already in `SITE.socials` | ⚠ |
| — (new label) | Channel: **"The licensed aerial archive"** → `/licensing` | ⚠ |

**Structural notes (PUB-E):** every href resolves from a value already live
in `consts.ts` or a real shipped route — nothing invented. The directive
asked for YouTube/Instagram/TikTok/LinkedIn "using the SOCIALS/consts URLs
already in the repo — verify they exist in consts; do not invent handles."
Verified: `SITE.socials` only carries `youtube` + `instagram` — TikTok and
LinkedIn are both explicitly commented out in `consts.ts` (TikTok: "name may
change," unconfirmed; LinkedIn: "no ASM company page could be verified").
Per that verification instruction, this directory lists only the two
confirmed channels — TikTok and LinkedIn are deliberately omitted rather
than invented. Flagging for the operator: if either channel is now
confirmed, add it to `SITE.socials` and it will appear here automatically
(`PAGES.forge.directory.channels` reads straight from that object).

---

## /contact (`src/pages/contact.astro`, `PAGES.contact`) — PUB-B

Reframe: was the P29 lead-gen page (inert form + "Book a call" primary CTA);
is now a publication contact point.

| Old line | New line | Flag |
|---|---|---|
| `meta.title`: "Contact — Book a Call" | **"Contact — Adventure Storytelling Media"** | ⚠ |
| `meta.description`: "Tell us what you're building. No pitch, no pressure — book a call or send a note." | **"Story tips, licensing enquiries, or work with the founder directly — one email, one line to book a call."** | ⚠ |
| Headline "No pitch, no pressure." | **"Have an adventure or venture worth telling?"** | ⚠ |
| Body: "Tell us what you're building. If Forge the Saga is a fit…" | **"Reach out for story tips, licensing enquiries, or to talk with the founder about brand and positioning work. One inbox, real replies."** | ⚠ |
| — (new) | **Story tips** — "Know an adventure or a venture we should be covering? Tell us about it." | ⚠ |
| — (new) | **Licensing** — "Interested in licensing footage or photography from the archive? Say what you need." | ⚠ |
| — (new) | **Work with the founder** — "Sindbad also works directly with founders and organizations on positioning and brand films." | ⚠ |
| Inert lead form + "The form isn't taking messages yet…" | **removed entirely** — replaced by mailto action + categories | ⚠ |
| "Book a call" pill as headline CTA | **Email is now the primary action** | ⚠ |
| — (new) | bookNote: "Prefer to talk it through first?" + demoted "Book a call" line | ⚠ |
| — (new section, `id="follow"`) | **"Follow the stories"** heading — stub, PUB-C mounts newsletter capture here | ⚠ |
| — | `id="follow"` anchor confirmed present and reachable (PUB-D link-sweep verified `/contact#follow` resolves) | ⚠ |

---

## /licensing (`src/pages/licensing.astro`, new page) — PUB-C

| Old line | New line | Flag |
|---|---|---|
| — (new page) | H1: **"License the work."** | ⚠ |
| — | Lead: **"Adventure Storytelling Media's aerial photography and footage is represented and licensed worldwide through Amazing Aerial Agency."** | ⚠ |
| — | **"For commercial & editorial licensing of the aerial work, visit the collection on Amazing Aerial — never a single photo, the whole represented body of work."** (directive-locked phrase "commercial & editorial licensing" verbatim) | ⚠ |
| — | CTA: **"Visit the collection at Amazing Aerial"** → external portfolio URL (directive-locked, never a per-photo deep link) | ⚠ |
| — | **"For direct or custom enquiries, contact us directly."** + "Contact →" (→ `/contact`) | ⚠ |
| — | **"More licensing routes — prints, the wider archive — are coming."** (honest forward note, no date promised, no invented count) | ⚠ |
| — | `meta.description`: **"How to license Adventure Storytelling Media's aerial photography and footage, and who to contact for direct or custom enquiries."** | ⚠ |

**Structural notes:** no prices anywhere, no invented stats, no per-photo
links — verified. `work/amazing-aerial.astro`'s "Licensing" CTA now routes
internally to `/licensing` instead of linking straight to the external
search URL, so the licensing framing lives in exactly one place; no other
visible copy on that page changed.

---

## /world (`src/pages/world.astro`) — PUB-D

Scroll-flight landing, not in nav, not the home page. **Not redesigned** —
the five locked multiverse anchors (Gateway / Adventure / Venture / Industry
/ Forge, per `WORLD-LEGS/V2-PRODUCTION.md`) are unchanged; only copy and one
broken href were fixed.

| Old line | New line | Flag |
|---|---|---|
| "Venture" scene CTA: "Read the Venture Stories" → `href: base + "/entertainment"` (broken — extra redirect hop, retired route) | Same label, **href fixed to `base + "/venture"`** | ⚠ |
| "Industry" scene label/eyebrow: **"Industry Stories"** / **"INDUSTRY STORIES"** (stale — this concept was retired site-wide into `/venture`; this scene's own CTA has always pointed at `/work`, never at the retired page) | **"The Archive"** / **"THE ARCHIVE"** — matches what its live CTA target (`/work`) actually is now | ⚠ |
| CTA label: "See the Industry Stories" (→ `/work`, href unchanged) | **"See the Archive"** | ⚠ |

**Structural notes:** internal scene `id: "industry"` left unchanged (an
internal key, same rationale as `WORK_ARCHIVE`'s stable internal ids
elsewhere) — media, clip, accent, scroll timing, and the section's position
in the flight are all untouched. Pre-existing `impeccable` design-hook
findings on this page (a broken-image placeholder at L225, a colored glow
shadow at L131) predate this session (unrelated to any PUB-A/B/C/D commit)
and were left as-is per "do not redesign the world page" — flagging for a
separate pass if the operator wants them addressed.

---

## Footer (site-wide — `src/components/Footer.astro`) — PUB-C

| Old line | New line | Flag |
|---|---|---|
| "{SITE.person} — {SITE.persona}" → "Sindbad Horizon — The StorySmith" | **"Founded by {SITE.person}"** → "Founded by Sindbad Horizon" | ⚠ |
| Footer nav order/labels: included "Industry Stories" | Reordered: Adventure Stories / Venture Stories / About / Contact / **Licensing** (new) / Forge the Saga — "Industry Stories" removed | ⚠ |
| — (new) | "Licensing" nav entry, buyer-pairing "Commercial & editorial licensing" → `/licensing` | ⚠ |

**Structural notes (PUB-D):** verified the footer's `/venture` hrefs were
already correct (PUB-C built them against the live route from the start,
independent of when `consts.ts` NAV caught up) — no further fix needed.
Trust row and "Fly the world" link carried verbatim, unchanged.

---

## Base layout default description (site-wide fallback — `src/layouts/Base.astro`) — PUB-D

Used only as a fallback for pages that don't pass their own `description`
prop — currently just `404.astro`.

| Old line | New line | Flag |
|---|---|---|
| Default `description`: "Adventure Storytelling Media — Sindbad Horizon, The StorySmith." | **"Adventure Storytelling Media — Adventure & Venture Stories from Boulder, Colorado."** | ⚠ |

**Structural notes:** the JSON-LD `Person.alternateName` field (also in
`Base.astro`, sourced from `SITE.persona = "The StorySmith"`) was left as-is
— it's structured data for search engines, not a visible byline/title, and
`/about`'s own PUB-B rationale explicitly keeps `SITE.persona` live in
`consts.ts` "for other pages' use." Not flagged as a violation.

---

## /entertainment (retired → redirect) — PUB-A

No authored user-facing prose — permanent redirect to `/venture`
(base-path-aware). Original content preserved in git history under
`src/pages/venture.astro` (git-renamed). **File unchanged by PUB-D** per
the directive.

---

## Consistency sweep results (PUB-D)

Checked against the built `dist/` output (post-build, most reliable signal
of what actually renders):

- **"The StorySmith" as byline/title:** found and fixed on Home (meta
  description + portrait alt) and the Base layout default description — see
  above. `/about` was already clean (PUB-B). `SITE.persona`'s JSON-LD
  `alternateName` usage is intentional, not a visible byline — left as-is.
- **"Board Chair" (MEME):** zero matches anywhere user-visible. Only
  "Member At-Large" renders. Confirmed clean.
- **"from $" price strings:** zero matches in the built site.
  `FORGE_CONSULT_RATE = "from $250 / hr"` exists in `consts.ts` but is
  imported/rendered nowhere.
- **Self-description as "journalist":** zero matches anywhere in `src/`.
- **"Corporate Storytelling & Market Research" services framing in
  `<title>`/description tags:** found and fixed on Home's `meta.description`
  (the one instance PUB-A explicitly flagged and deferred). No other page's
  title/description tag carries the old services phrasing.
