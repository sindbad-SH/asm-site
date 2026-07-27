# COPY-DECK-B — Directive PUB-B (the three narrative pages)

**2026-07-27.** Every new or changed sentence on `/about`, `/forge-the-saga`, and `/contact`,
for operator read-approval. The dev branch (`publication-v1`) already shows this copy — this
deck is what he approves before anything goes to production. Nothing here ships without him.

All new lines are marked ⚠ **OPERATOR READ-APPROVAL REQUIRED**. Source: `src/consts.ts`
(`PAGES.about`, `PAGES.forge`, `PAGES.contact`) unless noted.

---

## /about — THE FOUNDER / MASTHEAD PAGE

Full reframe: was the single-arc "StorySmith" narrative; is now the founder/masthead page —
the one place services exist on the site, as a quiet line.

| Field | Old line | New line |
|---|---|---|
| meta.title | `About — Sindbad Horizon, the StorySmith` | `About — Sindbad Horizon, Founder` ⚠ |
| meta.description | "One craft — storytelling — told across the wild, the market, and the industry. Boulder is home base; the world is the territory." | "Sindbad Horizon, founder of Adventure Storytelling Media, on why the publication covers two kinds of hard-won stories — the summit and the startup — from Boulder, Colorado." ⚠ |
| bio credential line (h1 sub) | `The StorySmith` (SITE.persona) | `Founder, Adventure Storytelling Media` ⚠ |
| portrait alt text | "Sindbad Horizon, The StorySmith" | "Sindbad Horizon, founder of Adventure Storytelling Media" ⚠ |
| opener | "I'm Sindbad Horizon. People call me the StorySmith. I find the truest version of a story and forge it into something people feel." | "I'm Sindbad Horizon. I started Adventure Storytelling Media to tell two kinds of stories I've come to think are actually the same story." ⚠ |
| narrative[0] (why ASM exists, part 1) | "I've learned to do that in three kinds of terrain. In the wild, the story is a place most cameras never reach. In the market, it's a founder's real advantage, buried under the wrong words. In the industry, it's a set of relationships — and the honesty to name each one for what it is." | "I've always loved the classic kind of adventure story — the mountain, the expedition, the wild place most people never reach. But somewhere along the way I noticed that a lot of the best adventure stories happening right now aren't on a summit. They're someone starting something. Building something. Taking the risk without knowing yet if it pays off." ⚠ |
| narrative[1] (why ASM exists, part 2 — the wordplay) | "They look like three different jobs. They're one craft. The same instinct that reads the line of a ridge reads the line of an argument." | "The word gives it away before I do: the venture is right there inside adventure. So this publication tells both kinds of hard-won stories — the summit and the startup — because I think they deserve the same kind of attention. Sometimes they're the same story. That's usually when it gets interesting." ⚠ |
| (dropped) | "Boulder is home base. The world is the territory." (COPY.anchors.homeBase, was narrative[3]) | *removed from this page — COPY.anchors.homeBase remains live on the home page teaser, untouched.* |
| columns[0].heading/body | — (new section) | **Adventure Stories** — "I go to the place and tell the story of arriving — the discoverer's vantage. Expeditions, wild places, the shot that only exists because someone got there first." ⚠ |
| columns[1].heading/body | — (new section) | **Venture Stories** — "I go behind the scenes with the people building the thing — founders, teams, the unglamorous middle of starting something. Not arrival. The work of getting there." ⚠ |
| legendLine | "And because trust is the whole point, I mark every relationship on this site at exactly what it is — official, delivered, informal, or simply a room I was in." | "None of it is borrowed. Every relationship below is real, stated at exactly what it is:" ⚠ |
| proof list | — (new section; ledger used to stand alone with no examples) | Six relationships now render inline via `<LegendMark>` — **verbatim, unchanged** `permittedPhrasing` already in `RELATIONSHIPS`, just newly surfaced here: Amazing Aerial Agency, PitchBoulder, SeriesFest, American Film Market, Pebble Beach Concours d'Elegance, MEME. No new relationship facts. ⚠ *(placement is new; the phrasing itself is pre-approved and unchanged)* |
| services.heading | — (new section) | "Working together" ⚠ |
| services.body + link | — (new section) | "I also work directly with founders and organizations on positioning and brand films. If that's you, enquiries go through the contact page." + "Get in touch" (links to /contact) ⚠ |

**Note on MEME:** the task brief referred to this as "MEME board chair." The site's Honesty
Ledger (`RELATIONSHIPS` in consts.ts, corrected 2026-07-08 per meme.ngo/meet-the-team) states
his actual title as **Member At-Large** (Board Chair is Amber MacPherson) — that verbatim
phrasing is what renders. Flagging the discrepancy rather than silently overriding the ledger.

---

## /forge-the-saga — THE METHOD PAGE

Full reframe: was the P29 consulting-sales page (starting rate + 3 priced packages + 2 ongoing
services + booking CTA); is now the editorial-method page — the five stages, no prices, no
booking CTA anywhere.

| Field | Old line | New line |
|---|---|---|
| meta.title | "Forge the Saga — Story Consulting: Market Research + Production, One Operator" | "The Method — How Stories Get Made \| Adventure Storytelling Media" ⚠ |
| meta.description | "Hire the consultant who does both halves…" | "Five stages, research first: how every Adventure Storytelling Media story gets scouted, mapped, forged, tested, and assessed — the same method available to clients through the founder." ⚠ |
| hero.kicker | "The StorySmith · Story Consulting" | "The method" ⚠ |
| hero.headline | "A smith forges steel. A StorySmith forges the saga." | "How the stories get made." ⚠ |
| hero.subline | "Most shops sell you production or market research…Forge the Saga is for buyers who want everything: one consultant, research to final cut." | "Every story published here — adventure or venture — moves through the same five stages before we call it finished. Research comes first, every time." ⚠ |
| hero rate line + CTA | `Consulting — $250/hr, scoped per project` + "Book a call" button | **removed entirely** — no rate, no hero CTA |
| "Who it's for" section | Heading "Who it's for" + buyer-qualification bullets ("You're about to launch…", "You're raising…", "You're about to spend on ads…") | Replaced by **"Research comes first"**: "It's tempting to skip straight to shooting — the camera is the fun part. But a story only works if it reaches the people it's for, and that means finding out who they are and what they already believe before a single frame is cut. The stages below are how we hold ourselves to that, on every story we publish." + three editorial-principle chips: "Who the story is actually for — not just who we hope is watching." / "What's already been said, so we're not repeating it." / "Where the real stakes are, before a camera comes out." ⚠ |
| "Both halves of the job" section (lane routing to /adventure /entertainment) | Full section, sales-routing copy | **removed entirely** |
| "The packages" section (3 priced packages + 2 ongoing services, all with "from $X" / "Starts at $X") | Full pricing grid | Replaced by **"The five stages"**: the five `SAGA_STAGES` (Story Scouting, Story Mapping, Story Forging, Story Testing, Story Assessing) rendered as method cards — name + sub (from SAGA_STAGES, unchanged) + new editorial body text per stage (below) + "Produces: {deliverable}" (from SAGA_STAGES, unchanged). **No price field rendered anywhere.** |
| method.stages[0].body (Story Scouting) | — | "Before anything else, we find out who a story is actually for — the language they use, what they already believe, what's missing from what's already been published. It becomes a Field Notes brief: the ground truth the rest of the work stands on." ⚠ |
| method.stages[1].body (Story Mapping) | — | "Raw research becomes a shape — who the story is for, what arc actually moves them, and what that looks like once it's built. This is where a pile of notes turns into a plan." ⚠ |
| method.stages[2].body (Story Forging) | — | "The plan becomes real: the shoot, the edit, the actual film or photographs. Everything is built to be tested, not just published — a first draft with the discipline of a final cut." ⚠ |
| method.stages[3].body (Story Testing) | — | "The story meets a real audience before it meets everyone — a small one first, honestly, so we find out what's landing and what isn't while there's still time to fix it." ⚠ |
| method.stages[4].body (Story Assessing) | — | "We read what actually happened — what held attention, where people dropped off — and decide what changes before the story goes out wide, or what the next one should do differently." ⚠ |
| "Just need production?" lane-exit note | Full section | **removed entirely** |
| "On pricing" section | Full section ("Every number here is a floor, not a quote…") | **removed entirely** |
| Proof section note | "No second consulting testimonial at launch. Everything shown is work actually delivered, labeled paid or unpaid as it truly was." | "No second testimonial at launch. Everything shown is work actually delivered, labeled paid or unpaid as it truly was." ⚠ *(dropped "consulting")* |
| Closing headline | `No pitch, no pressure.` (COPY.anchors.noPressure) | "The same method, off the page." ⚠ |
| Closing body | "Tell us where the story isn't landing. If Forge the Saga is a fit, we'll map it. If it isn't, we'll say so." | "This same method is available to clients — the research, the production, the testing — through the founder, Sindbad Horizon." ⚠ |
| Closing CTA + trustline | "Book a call" button (→ Calendly) + response/base/travel trust list | "About the founder" (→ /about) + "Get in touch" (→ /contact), quiet links, no button, no trustline ⚠ |

`SAGA_STAGES`, `FORGE_SERVICES`, `FORGE_PACKAGES`, `FORGE_CONSULT_RATE` are untouched in
consts.ts — `adventure.astro` and `entertainment.astro` (outside PUB-B ownership) still price
off `FORGE_SERVICES`/`SAGA_STAGES`. This page simply stopped importing/rendering them.

---

## /contact — PUBLICATION CONTACT

Reframe: was the P29 lead-gen page (inert form + "Book a call" as primary CTA); is now a
publication contact point — one email, three reasons to write in, booking demoted.

| Field | Old line | New line |
|---|---|---|
| meta.title | "Contact — Book a Call" | "Contact — Adventure Storytelling Media" ⚠ |
| meta.description | "Tell us what you're building. No pitch, no pressure — book a call or send a note." | "Story tips, licensing enquiries, or work with the founder directly — one email, one line to book a call." ⚠ |
| headline | `No pitch, no pressure.` (COPY.anchors.noPressure) | "Have an adventure or venture worth telling?" ⚠ |
| body | "Tell us what you're building. If Forge the Saga is a fit, we'll talk. If it isn't, we'll point you somewhere better." | "Reach out for story tips, licensing enquiries, or to talk with the founder about brand and positioning work. One inbox, real replies." ⚠ |
| categories[0] | — (new) | **Story tips** — "Know an adventure or a venture we should be covering? Tell us about it." ⚠ |
| categories[1] | — (new) | **Licensing** — "Interested in licensing footage or photography from the archive? Say what you need." ⚠ |
| categories[2] | — (new) | **Work with the founder** — "Sindbad also works directly with founders and organizations on positioning and brand films." ⚠ |
| lead form (name/email/message, inert since SITE.formEndpoint never resolved) + "The form isn't taking messages yet…" inert notice | Full form UI | **removed entirely** — replaced by the single mailto action + categories above |
| primary action | "Book a call" pill (→ Calendly) as the headline CTA | Email (`sindbad@adventurestorytellingmedia.com`) is now the primary action |
| bookNote | — | "Prefer to talk it through first?" + "Book a call" (small, demoted line beside the email; still → Calendly) ⚠ |
| followHeading | — (new section, id="follow") | "Follow the stories" ⚠ — stub only; markup includes `<!-- PUB-C mounts newsletter capture here -->` for PUB-C to wire the capture UI |

---

## Summary

- **New/changed sentence count:** 27 in `/about` (incl. 6 pre-approved relationship phrasings
  newly surfaced, not newly worded), 24 in `/forge-the-saga`, 13 in `/contact` — **64 total**,
  every one flagged ⚠ above.
- **Removed:** all prices, all "from $X"/"Starts at $X" strings, all booking CTAs from
  `/forge-the-saga`; the inert lead form and "Book a call" as primary action from `/contact`;
  "The StorySmith" as byline/title from `/about`.
- **Unchanged/reused verbatim:** `SAGA_STAGES[].name/.sub/.deliverable`, all six
  `RELATIONSHIPS[].permittedPhrasing` strings, `SITE.trust.*`, `SITE.email`, `SITE.bookACall`.
