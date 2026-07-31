# QA Report — publication-v1 (Directive PUB-D, final pass)

**2026-07-27.** Final QA + cleanup pass after three concurrent restructure
agents (PUB-A `97112c6`, PUB-B `59b31cb`, PUB-C `48378b9`, plus a prior
content-date fix `ec173d1`). Branch: `publication-v1`. Repo:
`E:\Adventure Storytelling Media Original\06 - Website\asm-site`.

All fixes below are committed to `publication-v1` as `PUB-D:` commits. **Not
pushed, not merged, not deployed** — production still ships from whatever
was last approved.

---

## 1. Fixes applied

### 1.1 VYBE reclassified to Adventure

Operator's binding ruling this session: the VYBE story belongs under
Adventure Stories, not Venture. `WORK_ARCHIVE`'s Vybe entry in
`src/consts.ts` had `lane: "venture"` (PUB-A had set this citing a stale
brief) — flipped to `lane: "adventure"`. Both `/adventure.astro` and
`/venture.astro` filter purely off this one field (`WORK_ARCHIVE[].lane`),
so the fix is a single source-of-truth change. Verified live on the dev
server: Vybe now renders in `/adventure`'s "From the archive" band and no
longer appears on `/venture`. The case page itself stays at `/work/vybe`
(URL unchanged, per the directive).

### 1.2 Redirect hops killed

18 back-links across 9 `venture/*.astro` article pages
(`ko-law-workshops`, `afm-2025`, `amazing-aerial`, `seriesfest-2025`,
`seriesfest-2026`, `seriesfest-2026-fashion-in-focus`,
`seriesfest-2026-soul-power`, `meme`, `makeshift-film-group` — 2 back-links
each) pointed at `${base}/entertainment`, which now only exists as a
redirect to `/venture`. Repointed all 18 directly to `${base}/venture` —
label text unchanged ("← Venture"). Also fixed one live href bug in
`world.astro`'s "Venture" scene CTA (`href: base + "/entertainment"` →
`base + "/venture"`). `work/*.astro` pages already linked back to `/work`
(no `/entertainment` references there — nothing to fix).

`src/pages/entertainment.astro` (the redirect page itself) is untouched, per
the directive.

Verified: zero `href`/CTA references to `/entertainment` remain anywhere in
`src/` outside the redirect file itself. Remaining `/entertainment` mentions
are historical code comments and the internal `PAGES.entertainment` /
`PillarId` data-object keys (intentionally kept stable, never rendered as a
URL — confirmed by grepping the built `dist/` output for `href=".../entertainment"`: zero matches).

### 1.3 world.astro stale "Industry Stories" references

The five locked multiverse anchors (Gateway / Adventure / Venture / Industry
/ Forge, per `WORLD-LEGS/V2-PRODUCTION.md`) were **not** redesigned or
restructured. Cleaned up only:
- The "Industry" scene's label/eyebrow/CTA copy ("Industry Stories" →
  **"The Archive"**) — its CTA has always pointed at `/work`, which is now
  branded "Archive — All Stories," not "Industry Stories," so the scene's
  copy was stale relative to its own live target, independent of the
  site-wide "Industry Stories" retirement.
- A stale NAV comment (`/entertainment = Venture Stories` → `/venture =
  Venture Stories`).
- Added a comment clarifying the "industry" scene is a locked multiverse
  anchor, not the retired site nav concept, so a future pass doesn't
  conflate the two again.

Internal scene `id: "industry"` and all media/clip/timing were left
unchanged (data hygiene, not a redesign).

**Noted but not touched (out of scope for this directive):** the `impeccable`
design hook flagged a pre-existing broken-image placeholder (L225) and a
colored glow shadow (L131) on `world.astro`. Both predate this session
(unrelated to any PUB-A/B/C/D commit) — flagging for a separate pass if the
operator wants the world page's visuals addressed.

### 1.4 Link sweep

Built the site (`npm run build`) and crawled every `href=` and `src=`
attribute in the built `dist/` output (41 pages) against the actual file
tree, base-path-aware (`/asm-site`). Also spot-verified live on the dev
server (localhost:4321/asm-site) for `/adventure`, `/venture`, and
`/venture/meme`'s back-link. See the table in §3.

Two named anchors were checked explicitly: `/contact#follow` (targeted by
the header/hero "Follow the Stories" CTA and `/venture`'s closing CTA) and
`/adventure#festival` — both resolve to a real `id=` on their target page.

### 1.5 Build + audits

- `npm run build` — **clean**, 41 pages built, 0 errors.
- Honesty-audit (`audit:exclusions` + `audit:confirm`) runs automatically as
  part of `npm run build` — **both passed** ("exclusion audit passed",
  "[confirm] sweep passed").
- `npx astro check` — **15 pre-existing errors**, all unrelated to
  PUB-A/B/C/D. Traced each to its introducing commit: `FieldCover.astro` +
  `field-notes/[slug].astro` (M5, `6af4aed`, an "editorial" variant missing
  from a type union), `Footer.astro` (`2efcab4`/`1189296`, a `"[confirm]"`
  sentinel comparison TS can't narrow), `PageVeil.astro`/`Tableaux.astro`
  (`19106a6`), `portal-scene-3d.ts` (`6dff658`, implicit-`any` + missing
  `@types/three`) — all from commits weeks before this restructure branch.
  **`consts.ts` itself has zero type errors** despite being touched by two
  concurrent agents (PUB-A + PUB-D). No new errors were introduced by the
  concurrent edits; none of the 15 were fixed (out of scope — pre-existing
  debt, not part of this directive's fix list).

### 1.6 Consistency sweep

Checked against the built `dist/` output (ground truth for what renders):

| Check | Result |
|---|---|
| "The StorySmith" as byline/title | **2 violations found + fixed** — Home's `meta.description` + portrait `alt` text, and the `Base.astro` layout's default description (fallback, used by 404). `/about` was already clean (PUB-B). JSON-LD `alternateName` left as intentional nickname data (not a visible byline). |
| "Board Chair" (MEME) | Clean — zero matches anywhere user-visible; only "Member At-Large" renders. |
| "from $" price strings | Clean — zero matches in the built site. `FORGE_CONSULT_RATE` exists in `consts.ts` but is never imported/rendered. |
| Self-description as "journalist" | Clean — zero matches in `src/`. |
| "Corporate Storytelling & Market Research" services framing in `<title>`/description | **1 violation found + fixed** — Home's `meta.description` (the exact instance PUB-A flagged and deliberately deferred). No other page's title/description tag carries it. |

Full before/after text for every fix above is in
`SITE-COPY-DECK-publication-v1.md`.

### 1.7 Copy decks merged

`SITE-COPY-DECK-publication-v1.md` (repo root) combines COPY-DECK-A.md,
COPY-DECK-B.md, COPY-DECK-C.md, and every copy change made in this PUB-D
pass, reorganized **by page**. **79 flagged (⚠) copy rows total** — see the
per-page breakdown in that file's summary table. The three source decks are
untouched on disk.

### 1.8 Field-notes date flag

`eldorado-springs.md` — operator-corrected to 2026-07-03, already committed
(`ec173d1`), no action needed. `flatirons-chautauqua.md` — still shows
`2023-04-24`; **not changed** (per the directive). Noted in the copy deck's
summary as awaiting operator confirm (likely 2026-07-03, same as
Eldorado Springs, but unconfirmed).

---

## 2. Build & audit status

```
npm run build        → PASS (41 pages, 0 errors)
honesty-audit         → PASS (exclusion audit + [confirm] sweep, runs in build)
npx astro check       → 15 pre-existing errors, 0 in consts.ts, none introduced
                         by PUB-A/B/C/D (all traced to commits weeks prior)
```

---

## 3. Link-sweep table

Crawled every `href`/`src` in the built `dist/` output (41 HTML files)
against the actual file tree, base-path-aware.

| Check | Result |
|---|---|
| Internal links resolving to a real route/file | **All resolve** — 0 broken links found across 41 pages |
| `href="…/entertainment"` anywhere in `dist/` | **0 matches** (redirect file itself excluded from the crawl target — it's the destination page's route, not a link) |
| Named anchors (`#follow`, `#festival`) | Both resolve to a real `id=` on their target page |
| Nav (header) | 4 links — all resolve |
| Footer nav | 6 links — all resolve, all point at live routes (not `/entertainment`) |
| Article back-links (venture + work) | All 20 (18 venture + 2 work) resolve to `/venture` or `/work` respectively — no redirect hops |

---

## 4. Review checklist — dev URLs per page

Dev server: `http://localhost:4321/asm-site` (confirm the port matches
whatever's currently running — `npx astro dev status` from the repo root
will report it).

**Highest priority (changed this session):**
- `/adventure` — confirm Vybe appears in "From the archive"
- `/venture` — confirm Vybe is **gone** from "From the archive"
- `/work/vybe` — case page itself, unchanged URL
- `/` (home) — new meta description + portrait alt (view source / og-preview tool to check, not visible on-page)
- `/world` — "The Archive" scene copy (5th scene, end of the scroll flight)
- `/work/seriesfest` — "← Back to the Archive" back-link at the foot

**Full page list (all 41 routes built):**
`/`, `/about`, `/adventure`, `/adventure/field`, `/adventure/steel-and-dust`,
`/contact`, `/entertainment` (should redirect to `/venture`),
`/field-notes`, `/field-notes/<11 location slugs>`, `/forge-the-saga`,
`/licensing`, `/privacy`, `/venture`, `/venture/afm-2025`,
`/venture/amazing-aerial`, `/venture/ko-law-workshops`,
`/venture/makeshift-film-group`, `/venture/meme`, `/venture/seriesfest-2025`,
`/venture/seriesfest-2026`, `/venture/seriesfest-2026-fashion-in-focus`,
`/venture/seriesfest-2026-soul-power`, `/work`, `/work/amazing-aerial`,
`/work/gigs-go-green`, `/work/pitchboulder`, `/work/seriesfest`,
`/work/shelby-pebble-beach`, `/work/vybe`, `/world`

**What to actually approve:** every ⚠ row in
`SITE-COPY-DECK-publication-v1.md` — that's the single document to read
before flipping anything to production. This QA report is the mechanics
(build/links/types); the copy deck is the content sign-off.

---

## 5. Commits (this pass)

All prefixed `PUB-D:` on `publication-v1`. Not pushed, not merged to any
other branch, not deployed.
