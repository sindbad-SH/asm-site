# Design pass review — 2026-08-03

19 commits on branch `audit-fixes-2026-08-02`. `main` untouched, nothing deployed.
Restore points: `pre-design-pass-2026-08-03` (just this pass) and
`pre-photo-audit-2026-08-02` (the whole day). Build is green (47 pages).

**How to see it live:** `http://localhost:4321/asm-site/` — the dev server is already
running with everything below. Hard-refresh (Ctrl+Shift+R) on any page, since
filenames on swapped photos didn't change and your browser will cache the old ones.

This doc lists only what's genuinely NEW this pass — not the dozens of pre-existing
`⚠ OPERATOR READ-APPROVAL REQUIRED` flags already in the codebase from before today.

---

## 1. New copy — needs your yes/no/edit

### Home (`src/consts.ts`)
| What | Was | Now |
|---|---|---|
| Hero headline (line 195) | "We forge stories for the wild, the market, and the industry." | **"A publication of Adventure Stories and Venture Stories."** |
| Hero subline (204) | "...on the trail, in the boardroom, on set." | "...on the trail, and in the boardroom." |
| Hero buyer line (220) | "Drone & aerial production, corporate storytelling & market research — Boulder, Colorado, working worldwide" | "Drone and expedition photography, founder and industry storytelling — Boulder, Colorado, working worldwide" |
| Signpost #3 (244) | "Both, end to end — Forge the Saga" | "Strategy & production consulting — Forge the Saga" |
| `/adventure` meta description (1439) | Old services-era line (day rates, direct booking) | "Expedition and adventure coverage — photo and film — from the Alps, Colorado's Front Range, and wherever the story leads. Field notes, postcards, and aerial work licensed through Amazing Aerial Agency." |

### Venture collections (`src/consts.ts`)
| What | Line | Detail |
|---|---|---|
| Collection restructure | ~920-1035 | "Founders & Pitch Rooms" dissolved (was PitchBoulder + KO Law; PitchBoulder now a feature-only, KO Law moved to a standalone card). "The Film Industry" now = SeriesFest + AFM only (MEME removed, already a feature). |
| Collection intro (992) | "The industry side of the venture lane — the festival and the market we keep a pulse on." | new sentence |
| Pebble Beach reframe (546, 1057-1058) | Page was "Dawn Patrol" (the pre-dawn arrival only) | Retitled **"Pebble Beach Concours d'Elegance"** — the whole-day story; Dawn Patrol is now its opening movement (2029: "Movement one — Dawn Patrol, before light") |
| Reframe teaser (2013) | "Pebble Beach Concours d'Elegance" / "A restored Shelby..." / "August 2025" | "**Opens with Dawn Patrol**" / (other two unchanged) |

### Work archive (`src/pages/work/`)
| What | File:line | Detail |
|---|---|---|
| Ledger stat lockup | `pitchboulder.astro:396,400` | New "28 Wednesdays · 26 Write-ups · Jan–Jul One season" header above the season list (counts were already stated in prose, just moved up) |
| "pictured above ↑" tags | `pitchboulder.astro:426` | Two rows (Origami Motion, Perlion) now cross-reference photos already shown earlier on the page |
| Archive index labels | `work/index.astro:52,79,240` | "Every Adventure story, in one index" / "Every Venture story, in one index" / "Not yet its own story" (the PNUMIX placeholder) |

### Privacy (`src/pages/privacy.astro:49-56`)
Old paragraph described a contact form that no longer exists (removed weeks ago).
New paragraph describes what's actually there: a mailto contact link + the
not-yet-live newsletter signup.

---

## 2. Photo changes — what to actually look at

**Fixed, verified by me personally (viewed the files, not just trusted the report):**

| Page | What changed |
|---|---|
| `/adventure/vybe` — "band played on" section | Rebuilt the CONTAINER (was a broken full-bleed crop that destroyed every photo put in it) into a 2-photo composition: wide band shot + dance-circle-under-the-balloon-arch shot. This is the fix after 3 failed photo-only swaps. |
| `/postcards/nordic-daughter` | 3 of 7 bottom photos replaced (formation, stalls, parasols) — brighter, sharper, each highlighting something specific. Hero untouched per your instruction. |
| `/venture/seriesfest-2025/2026/fashion-in-focus/soul-power` | All 4 rebuilt onto the same "Movement" template AFM already used — captions, pull-quotes, pacing. Was a flat uncaptioned grid before. |
| `/venture/afm-2025` | One photo swapped (was accidentally repeating the page's own hero) |
| `/venture` collection cards | KO Law and SeriesFest recentered off dead ceiling; PitchBoulder's missing card photo fixed (real bug — its `/work/` URL silently failed the image lookup) |
| **Home, "industry" cluster** | ⚠️ **Found and removed a photo of you** (SeriesFest step-and-repeat, same burst as 3 other places today) — this was live on the front page. Replaced with a clean Awards Ceremony frame. |
| `/adventure` Field Notes list | 11 dispatches went from bare text rows to having lead thumbnails (reused photos already on the page elsewhere) |
| Eldorado Springs field note | 1 photo → 3 |
| `/work` archive index | Bare link list → real thumbnail cards, reusing each destination page's own hero (no new photo claims) |

**Removed entirely (found across today, all traced to one shoot burst):** two frames from
PostForge's web-assets, one carousel slide, one live SeriesFest page photo, and the
home "industry" cluster photo above — five total sightings of you from the same red-carpet
moment. Worth knowing that one burst propagated that far before anyone caught it.

---

## 3. Two open questions for you

1. **Posed red-carpet/lineup photos** — one agent read your "no posed step-and-repeat"
   rule as scoped to the specific AFM sponsor-party photos you'd already rejected, not a
   blanket ban, and used a few honoree lineup shots elsewhere (e.g. `/work` archive's
   SeriesFest card is 6 people posed on a red carpet). Fine as editorial coverage, or do
   you want zero posed backdrop shots site-wide?
2. **`/venture/meme`'s rail card** — you'd flagged "same ceiling thing" as MEME on an
   earlier pass; turns out that card has no photo at all (renders a text logo, same as
   Amazing Aerial) — there was nothing to recenter. Worth double-checking what you were
   actually looking at.

---

## 4. Housekeeping

- One file couldn't be deleted this session (Windows file lock from the running dev
  server): `public/media/home/industry/cluster/valley.webp` — the OLD photo of you.
  It's unreferenced anywhere now (invisible), just needs deleting after a server restart.
- `pre-design-pass-2026-08-03` tag lets you revert just today's design pass if any of it
  doesn't land, without losing yesterday's photo-audit work.
