# SITE COPY DECK — publication-v1 (merged, for operator read-approval)

Merges COPY-DECK-A.md (PUB-A, structure), COPY-DECK-B.md (PUB-B, the three
narrative pages), COPY-DECK-C.md (PUB-C, monetization weave), and the copy
fixed directly by PUB-D (this final QA pass). Organized **by page**, not by
agent, so this is the one document to read end to end. Source decks stay on
disk unchanged.

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
| /adventure | 2 |
| /venture | 7 |
| /work (archive index) | 10 |
| /work/seriesfest | 1 |
| /forge-the-saga | 17 |
| /contact | 12 |
| /licensing | 7 |
| /world | 3 |
| Footer (site-wide) | 3 |
| Base layout default (site-wide fallback) | 1 |
| **Total** | **79** |

Plus: 1 data-classification flip (Vybe, /adventure ↔ /venture — no copy
string changed) and ~20 structural href-only fixes (redirect-hop removal),
neither counted above per the no-new-sentence convention. Full list under
each page's **Structural notes**.

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
