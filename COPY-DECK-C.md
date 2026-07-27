# COPY-DECK-C — Directive PUB-C (monetization weave)

Every new visible sentence introduced by PUB-C (LICENSING page + FollowTheStories
newsletter capture + Footer restructure), flagged ⚠ OPERATOR READ-APPROVAL REQUIRED
per BUILD-PLAN.md §3.5. Nothing below ships to production until read-approved;
staging carries it now. Content rules for the licensing page were supplied
pre-approved and binding by the directive — flagged here anyway for the record.

---

## 1. `src/pages/licensing.astro` (new page)

⚠ "License the work." (h1)

⚠ "Adventure Storytelling Media's aerial photography and footage is represented
and licensed worldwide through Amazing Aerial Agency." (lead paragraph)

⚠ "For commercial & editorial licensing of the aerial work, visit the
collection on Amazing Aerial — never a single photo, the whole represented
body of work." — carries the DIRECTIVE-LOCKED exact phrase "commercial &
editorial licensing" verbatim.

⚠ "Visit the collection at Amazing Aerial" (CTA label) → links to
`https://www.amazingaerial.com/controller/portfolio/shorizon` — the GENERAL
collection/portfolio page, never a per-photo deep link (directive-locked URL).

⚠ "For direct or custom enquiries, contact us directly." (body)

⚠ "Contact →" (CTA label) → `/contact`

⚠ "More licensing routes — prints, the wider archive — are coming." (honest
forward note — no date promised, no invented count)

Meta description: "How to license Adventure Storytelling Media's aerial
photography and footage, and who to contact for direct or custom enquiries."

No prices anywhere. No invented stats (no image counts). No per-photo links.

---

## 2. `src/components/FollowTheStories.astro` (new component)

⚠ "Follow the Stories" (heading)

⚠ "One dispatch when there's a real story to tell — no noise, unsubscribe
anytime." (promise copy — one line, as directed)

⚠ "Coming soon" (button label — inert state, PROVIDER IS UNDECIDED)

⚠ "Not live yet — check back soon, or follow along on socials in the
meantime." (disabled-state note — honesty-first, no fake success flow)

PROVIDER TODO — the two lines to change are marked at the top of the
component (`NEWSLETTER_PROVIDER`, `NEWSLETTER_ACTION`); see that file's
frontmatter comment for the Buttondown vs Mailchimp specifics. Until one is
set, the form has no `action`, submit stays `disabled`, and no success state
is ever shown — never fakes "thanks for subscribing."

---

## 3. `src/components/Footer.astro` (restructure)

⚠ "Founded by {SITE.person}" → renders "Founded by Sindbad Horizon" — replaces
the former "{SITE.person} — {SITE.persona}" ("Sindbad Horizon — The
StorySmith") line. Byline convention per directive; "The StorySmith" no
longer appears in the footer.

⚠ Footer-only nav restructure (labels only — every href already lives on a
shipped page; no new routes except Licensing, which is new per task 1):
  - Order: Adventure Stories / Venture Stories / About / Contact / Licensing
    / Forge the Saga
  - "Industry Stories" REMOVED from the footer nav (still live in the header
    nav — PUB-A territory, untouched by this directive)
  - "Licensing" ADDED, buyer-pairing "Commercial & editorial licensing",
    → `/licensing`
  - Buyer-pairing sub-labels reused verbatim from the existing NAV convention
    in consts.ts (Adventure/Venture/Contact/Forge) — not new copy, carried
    over unchanged.

Note: FOOTER_NAV is a footer-local list (see the component's doc comment) —
the shared `NAV` array in consts.ts (header + mobile menu) is untouched.

No new copy in the trust row (SITE.trust.drone/response/base/travel) or the
"Fly the world" link — both carried verbatim, unchanged, per directive.

---

## 4. `src/pages/work/amazing-aerial.astro` (reframed, not rewritten)

⚠ "Licensing" (CTA label, replaces the former "License the collection") →
now routes internally to `/licensing` instead of linking straight to the
external Amazing Aerial search URL, so the licensing framing + link live in
exactly one place (this directive's canonical `/licensing` page). No other
visible copy on this page changed; the reel content (stills, clips, headline,
lead) is unchanged from its prior operator-read-approval state.

---

## Sign-off

Operator: review each ⚠ line above against the rendered staging pages
(`/licensing`, footer on any page) before flipping `DEPLOY_TARGET=production`.
Nothing here is a status/relationship claim beyond what already exists in
`consts.ts` RELATIONSHIPS (`amazing-aerial` → "Aerial work licensed through
Amazing Aerial Agency") — the licensing page paraphrases that relationship in
plain marketing language but does not alter its permitted phrasing anywhere
it is required to render verbatim (LegendMark usages elsewhere are untouched).
