/**
 * consts.ts — the single source of truth for every claim the site makes.
 *
 * GOVERNANCE (read before editing — binding, from BUILD-PLAN.md §3.5 and
 * research-brief.md §4 as amended by §0):
 *
 *  1. Every statement about a relationship MUST come from a `permittedPhrasing`
 *     string below, copied verbatim into pages — never paraphrased, never
 *     upgraded. Downstream models COPY these strings; they do not compose new
 *     status claims.
 *  2. Unknown values are the literal string "[confirm]". A production build
 *     (DEPLOY_TARGET=production) fails while any [confirm] survives to output.
 *  3. HARD EXCLUSIONS — these must never appear anywhere on the site, and the
 *     build fails if they reach dist/ (see scripts/audit-lib.mjs):
 *     the AI-ambassador relationship (research-brief §0, first bullet), the
 *     real-estate business (research-brief §4 "HARD EXCLUSION"), the
 *     unverified law-firm client, and the exploratory film-group venture.
 *     They are deliberately not named in this file.
 *  4. VOICE — COMPANY VOICE, not a personal blog (Round 4, 2026-07-21,
 *     operator-directed; this REPLACES the former "first-person solo (I),
 *     never we" rule). Site copy speaks as Adventure Storytelling Media:
 *     "we/our", or a neutral construction where a plural would sound absurd
 *     for a solo operator ("Adventure Storytelling Media films…", "The work
 *     spans…", "One operator, on foot all day…"). Prefer neutral over forced
 *     plural — never contort a sentence just to avoid "I".
 *
 *     THREE EXCEPTIONS, and only these:
 *       (a) PAGES.about — he is genuinely speaking about himself there.
 *       (b) TESTIMONIALS — verbatim client quotes. NEVER alter a quote.
 *       (c) A direct PERSONAL relationship that is itself the fact being
 *           stated — his MEME Member At-Large role is the canonical case.
 *           Those stay verbatim.
 *     Everything else — home, the three lanes, forge, contact, privacy, the
 *     case pages, the venture articles, and every component — is company voice.
 */

// ---------------------------------------------------------------------------
// SITE
// ---------------------------------------------------------------------------

export const SITE = {
  name: "Adventure Storytelling Media",
  person: "Sindbad Horizon",
  persona: "The StorySmith",
  location: "Boulder, Colorado",
  // Matches the address on file; per BUILD-PLAN §5A S9 confirm once with Sindbad.
  email: "sindbad@adventurestorytellingmedia.com",
  formEndpoint: "[confirm]", // RESERVED — awaiting operator fact (AS-2). Free-tier form
                             // endpoint; account creation needs his email verification (a
                             // ~2-minute operator task). Form stays inert by design until then.
  bookACall: "https://calendly.com/sindbad-adventurestorytellingmedia/new-meeting", // his binding pricing sheet + live site source
  socials: {
    youtube: "https://www.youtube.com/@AdventureStorytellingMedia", // verified channel
    instagram: "https://www.instagram.com/adventurestorytellingmedia/", // operator roster 2026-07-04 — flag at staging review (account is young)
    // tiktok: REMOVED — operator's own roster: "name may change"; re-add when he confirms the handle
    // linkedin: REMOVED — no ASM company page could be verified (roster URL was truncated);
    //           Sindbad's personal LinkedIn lives on /about instead, per his directive
  },
  /**
   * GoatCounter site code for privacy-respecting analytics (no cookies, no
   * personal data — see /privacy). EMPTY = analytics fully disabled (nothing
   * loads). Deliberately "" rather than "[confirm]": analytics is optional
   * and must never block a production build. To enable: create a free
   * account at goatcounter.com and put the site code here (the `xxx` in
   * xxx.goatcounter.com), then update /privacy to match.
   */
  analytics: "",
  /**
   * P30 (round 2, 2026-07-20) — sitewide trust/logistics signals, surfaced
   * near CTAs and in the footer. COPY RULES (operator-directed):
   *  • `drone` — "FAA Part 107" is operator-CONFIRMED (2026-07-20) and is the
   *    stated credential. NEVER claim "insured" anywhere on the site:
   *    insurance is project-dependent and often the client's responsibility —
   *    no false assurance, ever.
   *  • `travel` — international framing stays POSITIVE and capable: shoots
   *    welcome, operations accommodated to local aviation rules. Never imply
   *    he can't fly internationally; never claim US flight authority abroad.
   *  • `response` is a service promise he has to actually keep — one word from
   *    him confirms or adjusts it.
   */
  trust: {
    drone: "FAA Part 107 licensed drone operations (US)",
    response: "Replies within one business day",
    base: "Boulder, Colorado (UTC-6)",
    travel: "International shoots welcome — operations accommodated to local aviation rules",
  },
} as const;

// ---------------------------------------------------------------------------
// NAV — 6 items, capped (BUILD-PLAN §1.0). Single source of truth for the top
// nav, the mobile menu, and the footer (all three map this array), so ordering
// lives here alone. Order (P12.6): the credibility lanes and the proof come
// first, THEN the sales page — Forge the Saga follows Work so the pitch lands
// after the proof. The header's separate PRIMARY_CTA button still owns the only
// call-to-action; nav position doesn't change that.
// ---------------------------------------------------------------------------

// PUB-A (2026-07-27) — PUBLICATION RESTRUCTURE (ACTION-PLAN.md): the site is
// now a publication with TWO story columns, not three. "Industry Stories" is
// retired — its content (MEME, SeriesFest, AFM) refiles under Venture Stories
// (see /venture, now the index of ALL venture stories). "Forge the Saga"
// drops out of primary nav per the addendum ("no personal website needed" /
// no sales pillar in primary nav) — it survives as a page, footer-linked,
// PUB-B's to rework. The buyer-language sub-labels (P29) were service-
// flavored ("Corporate storytelling & market research", "Drone & aerial
// production") and are dropped with them — this is a publication, not a
// services menu. Nav caps at 4: the two story columns + About + Contact.
export type NavItem = { label: string; href: string; buyer?: string };
export const NAV: readonly NavItem[] = [
  { label: "Adventure Stories", href: "/adventure" },
  { label: "Venture Stories", href: "/venture" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

// PUB-A (2026-07-27) — the header/hero CTA no longer sells a consulting
// engagement; it invites readers to follow the publication. PUB-C is building
// the newsletter-capture UI that will live at this anchor (FollowTheStories
// component); `/contact#follow` is the safe target until that's wired in.
// ⚠ OPERATOR READ-APPROVAL REQUIRED — new label (staging-only until read).
export const PRIMARY_CTA = { label: "Follow the Stories", href: "/contact#follow" } as const;

// ---------------------------------------------------------------------------
// PILLARS — one storyteller, three terrains. Equal grammatical weight in copy
// (the wild / the market / the industry); consulting alone owns the sales CTA.
// ---------------------------------------------------------------------------

export type PillarId = "adventure" | "consulting" | "entertainment";

export type Pillar = {
  id: PillarId;
  name: string;
  terrain: string; // the fixed triad — hold parallel everywhere
  role: "primary" | "credibility";
  href: string;
  /** Soft handoff line closing the lane — every lane hands to consulting. */
  handoff: string;
};

export const PILLARS: readonly Pillar[] = [
  {
    id: "adventure",
    name: "Adventure",
    terrain: "the wild",
    role: "credibility",
    href: "/adventure",
    handoff: "This is the caliber of story we forge for founders.",
  },
  {
    id: "consulting",
    name: "Forge the Saga",
    terrain: "the market",
    role: "primary",
    href: "/forge-the-saga",
    handoff: "", // the primary lane IS the destination
  },
  {
    id: "entertainment",
    name: "Venture",
    terrain: "the industry",
    role: "credibility",
    // PUB-A (2026-07-27) — repointed to /venture (retired /entertainment).
    // `id`/`terrain` intentionally UNCHANGED: both are internal keys the media
    // layer system depends on (Tableaux.astro derives public/media/home/<slug>
    // paths + LAYER_SETS from `terrain`; consts.ts's PAGES.entertainment key
    // is read by PAGES.entertainment.handoff below) — renaming either would
    // either 404 real production art or require touching unowned pages.
    href: "/venture",
    handoff:
      "The rooms this work keeps a pulse on are the same rooms your story eventually has to survive.",
  },
] as const;

// ---------------------------------------------------------------------------
// COPY — load-bearing lines carried from v1 (research-brief §7 KEEP) plus the
// plan-approved hero (Angle C headline + Angle A triad, BUILD-PLAN §1.1 H1).
// Opus refines around these; the lines themselves are anchors.
// ---------------------------------------------------------------------------

export const COPY = {
  hero: {
    kicker: "Every story, taken as far as it goes.",
    headline: "The StorySmith. We forge stories for the wild, the market, and the industry.",
    subline:
      "Sindbad Horizon — Boulder, Colorado. We find the truest version of a story and forge it into something people feel: on the trail, in the boardroom, on set.",
    // P29 buyer-language pairing — one plain line under the hero so a cold
    // buyer decodes the offer in seconds. ⚠ OPERATOR READ-APPROVAL REQUIRED —
    // new visible copy (staging-only until read).
    // AUDIT-FIX (2026-08-02): re-punctuated as one flowing sentence (was
    // three middot-separated HUD fragments) so it reads cleanly now that
    // index.astro promotes it out of .hud-label into body-text scale — see
    // that file. Same words/facts; only case and separators changed.
    buyerLine:
      "Drone & aerial production, corporate storytelling & market research — Boulder, Colorado, working worldwide",
    globeCaption: "Where the stories are told", // LOCKED — see GLOBE below
  },
  anchors: {
    belief: "Your product works. Your story isn't landing.",
    beliefIsntData: "belief isn't data",
    noPressure: "No pitch, no pressure.",
    homeBase: "Boulder is home base. The world is the territory.",
    testing: "find out what works before you spend real money finding out what doesn't.",
  },
  // P29 — signpost paths reordered money-first and PAIRED with buyer terms
  // (the world names stay; the plain term leads so it decodes instantly).
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — new visible labels (staging-only).
  paths: [
    { label: "Drone & aerial production — Adventure Stories", href: "/adventure" },
    // PUB-A (2026-07-27) — href repointed from the retired /entertainment
    // route to /venture (the new venture-stories index); label unchanged.
    { label: "Corporate storytelling & market research — Venture Stories", href: "/venture" },
    // AUDIT-FIX (2026-08-02): "Both, end to end — Forge the Saga" named an
    // internal product with no meaning to a first-time visitor. Relabeled to
    // say what it IS, matching the "[what it is] — [destination]" pattern of
    // the two items above (Forge the Saga is the site's one consulting
    // engagement — research/strategy + production together; see
    // FORGE_SERVICES[0] and PILLARS.consulting). href unchanged.
    { label: "Strategy & production consulting — Forge the Saga", href: "/forge-the-saga" },
  ],
} as const;

// ---------------------------------------------------------------------------
// SAGA_STAGES — ported from v1, voice converted to first-person solo.
// Real productized IP; prices display per OD-4 (exact "from $X").
// P30 REPRICE (2026-07-20, market-researched): stage floors raised to the
// upper band for a boutique specialist who does BOTH research and production.
// Benchmarks: custom market-research projects run $25k–$65k agency-side and
// ~$8k–$12k small-scope (Farnsworth Group / IntoTheMinds / Drive Research
// 2025-26); strategy consulting $150–$500/hr (consultfees.com). Only stage 01
// renders directly (the /entertainment research floor); 02–05 feed the
// package sums below.
// ---------------------------------------------------------------------------

export type SagaStage = {
  no: string;
  name: string;
  sub: string;
  deliverable: string;
  price: string;
  process: string;
  bestFor: string;
};

export const SAGA_STAGES: readonly SagaStage[] = [
  {
    no: "01",
    name: "Story Scouting",
    sub: "Market & Audience Research",
    deliverable: "Field Notes Brief",
    price: "from $4,000", // boutique research sprint — small-scope custom research benchmarks ~$8k–$12k; this is a deliberate specialist floor, not an agency study

    process:
      "Raw market intelligence. We uncover who your audience actually is, the exact language they use, and what your competitors are missing.",
    bestFor: "You have a product but don't yet know who your real buyer is or how to talk to them.",
  },
  {
    no: "02",
    name: "Story Mapping",
    sub: "Messaging Strategy & Positioning",
    deliverable: "Core Narrative Blueprint",
    price: "from $3,500", // messaging/positioning strategy — indep. strategy consultants $150–$275+/hr; ~2 wk engagement floor

    process:
      "We shape raw intelligence into narrative strategy — who the audience is, what arc moves them, and what that looks like as tangible content.",
    bestFor: "You have research but need it shaped into a clear, actionable strategic direction.",
  },
  {
    no: "03",
    name: "Story Forging",
    sub: "Asset Creation & Production",
    deliverable: "Test-Ready Creative Assets",
    price: "from $6,000", // production floor — boutique brand-video band $5k–$15k (Vidico/Firework 2025-26)

    process:
      "The strategy becomes reality. We build high-quality video or copy assets designed specifically for market validation.",
    bestFor: "You have a solid strategy and need the actual creative assets built and ready for feedback.",
  },
  {
    no: "04",
    name: "Story Testing",
    sub: "A/B Testing & Analytics",
    deliverable: "Live Market Data",
    price: "from $2,500 + audience", // testing/analytics sprint — priced under IDI-round benchmarks ($5k–$15k per 10–15 interviews)

    process:
      "Your assets meet a real audience. We use curated human panels, AI audience simulations, or both to gather targeted data.",
    bestFor: "You want data-backed proof it works before committing budget to distribution or ad spend.",
  },
  {
    no: "05",
    name: "Story Assessing",
    sub: "Iterative Refinement & ROI Reporting",
    deliverable: "Action & Refinement Playbook",
    price: "from $2,000", // analysis + playbook — ~a consulting week at the researched $200–$500/hr band's floor

    process:
      "We decode the data — what held attention, where people dropped off, what it means, and the exact steps to take next.",
    bestFor: "You have campaign data but need an expert to decode it and point the way forward.",
  },
] as const;

// ---------------------------------------------------------------------------
// FORGE_SERVICES — P12.x REPACKAGE (operator-directed). The forge page stopped
// selling a numbered "secret sauce" process and now sells the SERVICES you can
// hire a StorySmith for, in two classes:
//   • engagement  — long-span / retainer, "if you want me in it with you"
//   • deliverable — "one specific thing I do all the time", priced at a floor
//
// Prices are RESEARCHED 2025-26 US + international-remote market floors,
// REPRICED P30 (2026-07-20) to the HIGHER end of each verified band —
// positioning: boutique specialist who does BOTH production and market
// research, priced for internet-found clients (he can always discount in
// person), never competing with $50/hr volume operators. Per-service market
// ranges are cited inline. Shown as "Starts at $X" / "$X / mo".
//
// ⚠ OPERATOR READ-APPROVAL REQUIRED — every name/price/blurb below is NEW copy.
//
// The flagship (`flagship: true`) carries the DEMOTED five-stage method as a
// names-only strip; SAGA_STAGES stays the source of those names (home H5 also
// maps them) and its per-stage prices are no longer rendered anywhere.
// ---------------------------------------------------------------------------

export type ForgeService = {
  no: string;
  klass: "engagement" | "deliverable";
  name: string;
  price: string;
  blurb: string;
  flagship?: boolean;
  /** VERBATIM Ledger phrasing, when a service touches a real relationship. */
  note?: string;
};

export const FORGE_SERVICES: readonly ForgeService[] = [
  {
    no: "01",
    klass: "engagement",
    name: "Forge the Saga",
    price: "Starts at $15,000", // P30 — research+strategy+production+testing in one arc; custom research alone runs $25k–$65k agency-side
    flagship: true,
    blurb:
      "Our deepest engagement — the one the whole studio is named for. We take a founder's story from raw market intelligence to a tested Core Narrative Blueprint your team can actually run: the full arc, start to finish. It moves through five stages, and once the spine is set it can carry on as a retainer if there's a reason to keep steering.",
  },
  {
    no: "02",
    klass: "engagement",
    name: "The Standing Forge",
    price: "$5,000 / mo", // P30 — fractional creative-direction retainers verify at $5k–$15k/mo (GTM 8020 2025-26); this is that band's floor
    blurb:
      "For companies that need the forge kept lit. A standing monthly engagement for the story work that never really finishes — ongoing video and photo, the next campaign, the content that keeps a brand's voice steady while it grows. One retainer, a predictable rhythm, no re-quoting every shoot.",
  },
  {
    no: "03",
    klass: "deliverable",
    name: "The Story Intensive",
    price: "Starts at $3,500", // P30 — ~1.5 consulting days at the researched $200–$500/hr fractional-creative band
    blurb:
      "The fastest way to work with us. A focused session on one thing — your positioning, your pitch, the story your launch has to carry. You bring the problem; we bring the questions, and you leave with sharp, usable language and a direction you can act on. The front door to everything else here.",
  },
  {
    no: "04",
    klass: "deliverable",
    name: "The Brand-Story Film",
    price: "Starts at $8,500", // P30 — boutique brand-story films verify at $5k–$15k (Vidico/Firework/Storyteller 2025-26); upper-middle of the band
    blurb:
      "A two-to-four-minute film that tells your story the way it deserves to be told — scripted, shot, and cut by one person who's thought hard about what it needs to say. Founder stories, product films, the piece that anchors your homepage. Pro gear, a real point of view, no committee.",
  },
  {
    no: "05",
    klass: "deliverable",
    name: "Event & Conference Coverage",
    price: "Starts at $3,500", // P30 — solo full-day event/conference coverage verifies at $1.5k–$4k, conferences $3k–$7k (D-MAK/Bonomotion 2025-26); high end of the solo band
    blurb:
      "We cover your event — photo and film — and hand back more than a folder of files. Conferences, pitch nights, summits, workshops: the recap that makes people wish they'd been there, plus clean speaker and session clips you can use the same week. One operator, on foot all day, reading the room.",
  },
  {
    no: "06",
    klass: "deliverable",
    name: "Aerial Cinematography",
    price: "Starts at $2,500 / day", // P30 — established commercial drone-op day rates verify at $1.5k–$4k (UAV Coach/Dronesgator 2025-26); upper-middle for cinema work with own gear
    blurb:
      "FAA Part 107 licensed drone work (US) for people who care how it reads from the air. Cinematic aerials for films, brands, and the places that are hardest to reach — the same eye we bring to the ground, lifted a few hundred feet. International shoots welcome — operations accommodated to local aviation rules.",
    note: "Aerial work licensed through Amazing Aerial Agency",
  },
] as const;

// ---------------------------------------------------------------------------
// FORGE_PACKAGES — P29 money-now restructure (operator-directed, 2026-07-20).
// Forge the Saga is now the CONSULTING page: the odd case who does BOTH
// production and market research, for buyers who want everything. These three
// packages are MOCK SCOPES cut from the existing five-stage method
// (SAGA_STAGES stays the single source of the stage names). Pure-production
// deliverables moved to their lanes: /adventure (aerial day rate) and
// /entertainment (coverage + brand films) each price their own buyer.
//
// P30 REPRICE (2026-07-20, market-researched): the first two package floors
// are the SUM of the per-stage floors each bundles (themselves repriced above
// against 2025-26 benchmarks). The Full Saga is a bundle floor deliberately
// UNDER the ~$18k stage-sum — and still a fraction of the $25k–$65k that a
// custom research project alone runs agency-side. All render with honest
// "from $X — scoped per project" framing.
// ⚠ OPERATOR READ-APPROVAL REQUIRED — names/blurbs/bestFor are new copy.
// ---------------------------------------------------------------------------

export type ForgePackage = {
  name: string;
  /** Indexes into SAGA_STAGES — the stages this package bundles. */
  stageIdx: readonly number[];
  price: string;
  blurb: string;
  bestFor: string;
  flagship?: boolean;
};

/** P30 — starting consultant rate: fractional creative-director / strategy
 *  consulting verifies at $200–$500/hr (GTM 8020, consultfees.com, 2025-26);
 *  $250 sits mid-band for the rare research+production combo. Always rendered
 *  with "scoped per project" framing, never as a fixed quote. */
export const FORGE_CONSULT_RATE = "from $250 / hr";

export const FORGE_PACKAGES: readonly ForgePackage[] = [
  {
    name: "The Scouting Report",
    stageIdx: [0, 1],
    price: "from $7,500", // P30 — sum of stage 01+02 floors; research+strategy engagements verify at ~$8k–$12k small-scope, $25k+ agency-side
    blurb:
      "The research half on its own: who your audience actually is, the exact language they use, and a Core Narrative Blueprint your team can run without us.",
    bestFor: "You want the market research and the strategy — you have your own production.",
  },
  {
    name: "Forge & Test",
    stageIdx: [2, 3],
    price: "from $8,500", // P30 — sum of stage 03+04 floors; boutique brand-video band $5k–$15k plus a testing round priced under IDI benchmarks
    blurb:
      "The production half with proof attached: we build the assets, then put them in front of a real audience before you spend to distribute them.",
    bestFor: "Your strategy is set — you need the assets built and validated.",
  },
  {
    name: "The Full Saga",
    stageIdx: [0, 1, 2, 3, 4],
    price: "from $15,000", // P30 — bundle floor under the ~$18k stage-sum; custom research alone runs $25k–$65k agency-side (Farnsworth/Drive Research 2025-26)
    flagship: true,
    blurb:
      "Everything, one consultant: raw market intelligence to a tested, ready-to-run story. We carry the whole arc — the research, the production, and the read on what the data says to do next.",
    bestFor: "You want the whole thing handled by one person, start to finish.",
  },
] as const;

// ---------------------------------------------------------------------------
// HONESTY LEGEND + RELATIONSHIPS — the map-legend device (BUILD-PLAN §3.4).
// Every relationship renders through <LegendMark> with its tier symbol.
// permittedPhrasing is VERBATIM from the Honesty Ledger — copy, never compose.
// ---------------------------------------------------------------------------

export type RelationshipTier = "official" | "delivered" | "informal" | "attended";

export const LEGEND: Record<RelationshipTier, { symbol: string; label: string }> = {
  official: { symbol: "◆", label: "Official role" },
  delivered: { symbol: "●", label: "Delivered work" },
  informal: { symbol: "○", label: "Informal / early" },
  attended: { symbol: "△", label: "Attended · relationship-building" },
} as const;

export type Relationship = {
  id: string;
  name: string;
  tier: RelationshipTier;
  /** VERBATIM from the Honesty Ledger. The only way this relationship may be described. */
  permittedPhrasing: string;
};

// PARTNER-LOGO RULE (R3.2, operator-directed):
//  • Amazing Aerial — REAL logo allowed on: gallery watermarks, the AA funnel card/button,
//    the gallery outro. Always adjacent to the Ledger phrasing "Aerial work licensed through
//    Amazing Aerial Agency" (nominative use of a real contributor relationship — accurate
//    framing only, never implying ASM ownership of or exclusivity with the agency).
//  • PitchBoulder — logo allowed on its case study IF a real logo asset is supplied
//    (client relationship + public testimonial). NONE exists on disk as of 2026-07-06 →
//    text-only until the operator obtains one from Peter. (Reserved slot, see R3.2c.)
//  • SeriesFest / AFM / Pebble Beach — TEXT ONLY, always. Attendance ≠ affiliation; a logo
//    reads as endorsement. This is a legal posture, not a style choice.
//  • MEME — text-only at launch. P13e HONESTY CORRECTION (2026-07-08): the
//    original brief said "Board Chair", but meme.ngo/meet-the-team lists the
//    Board Chair as Amber MacPherson and Sindbad as "Member At-Large"
//    (role text: Strategic Liaison and Scout). Corrected to THEIR published
//    wording — understating beats overstating. Operator to confirm/refine.
//    Logo use now operator-approved for editorial article pages (nominative
//    use inside an about-the-org card), still never in hero lockups.
export const RELATIONSHIPS: readonly Relationship[] = [
  /** Never: a paid staff role (unless confirmed). */
  {
    id: "meme",
    name: "MEME",
    tier: "official",
    permittedPhrasing:
      "Member At-Large, MEME (Makeshift Entertainment Media Education), a Colorado nonprofit",
  },
  /** Never: "represented exclusively"; never ownership of the agency. */
  {
    id: "amazing-aerial",
    name: "Amazing Aerial Agency",
    tier: "official",
    permittedPhrasing: "Aerial work licensed through Amazing Aerial Agency",
  },
  /** PRIMARY proof anchor (research-brief §0). Testimonial #1 lives here. */
  {
    id: "pitchboulder",
    name: "PitchBoulder",
    tier: "delivered",
    permittedPhrasing:
      "We run PitchBoulder's event coverage & recaps, and produced their commercial",
  },
  /**
   * Testimonial #2 source (OD-5): the car owner's quote about the Shelby
   * coverage — attributed to the owner, NEVER to the event. Never: an official
   * Pebble Beach engagement or "Cinematic & Event Production" for the event.
   */
  {
    id: "pebble-beach",
    name: "Pebble Beach Concours d'Elegance",
    tier: "attended",
    permittedPhrasing: "attended with a car owner to cover a restored Shelby",
  },
  /** Never: an embedded/ongoing body of work. */
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — new permittedPhrasing (staging-only
  // until read). P12-KO (2026-07-12): the operator confirmed the facts and
  // lifted the "ko law" audit exclusion, so this relationship names the firm
  // and its workshop series. Tier stays "informal" — it is early coverage,
  // not an embedded/ongoing engagement. Firm verified from its own site
  // (kofirm.com — a Boulder/Denver business-law firm; Ian Kuliasha, Partner).
  // Renders on /venture/ko-law-workshops, the home proof band, and — as the
  // linked story card — the venture rail on /entertainment.
  // ROUND 5 (2026-07-21, operator NO-COUNT rule): the phrasing drops the
  // session count — a growing series is referred to plurally, never numerized.
  // The dated session index on the article page stays (a fixed factual list,
  // not a running total).
  {
    id: "workshop-coverage",
    name: "KO Law",
    tier: "informal",
    permittedPhrasing: "coverage of KO Law's startup workshop series",
  },
  /** Never: a credentialed coverage role; never "at the table where the industry decides". */
  {
    id: "seriesfest",
    name: "SeriesFest",
    tier: "attended",
    permittedPhrasing: "relationship-building attendance — keeping a pulse on the industry",
  },
  /** Same constraints as SeriesFest. */
  {
    id: "afm",
    name: "American Film Market",
    tier: "attended",
    permittedPhrasing: "relationship-building attendance — keeping a pulse on the industry",
  },
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — two new relationship entries for the
  // work-wall "from the archive" band (staging-only until read). P-work
  // (2026-07-12). Dates come from the source files, never invented.
  //
  // Gigs Go Green — production work on two competition / pitch films (Hero X
  // Solar / OEN solar-prize film, Sept 2024; "We Own Cash" CoinDesk pitchfest
  // film, Apr 2025). Tier "delivered" (delivered work — same tier as
  // PitchBoulder). The phrasing does NOT claim the company currently exists
  // (past-tense only) and, per operator direction (P-work-2, 2026-07-12), was
  // SOFTENED off the specific "two paid production engagements" — no count,
  // no pay claim. Renders on the archive tile AND the /work/gigs-go-green case page.
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — softened permittedPhrasing (staging-only).
  {
    id: "gigs-go-green",
    name: "Gigs Go Green",
    tier: "delivered",
    permittedPhrasing: "production work for Gigs Go Green",
  },
  // Vybe — event coverage of a few of the Vybe events (Vybe = a Denver arts /
  // music / dance collective, "Vibrate Your Best Energy"; brand meaning verified
  // from the collective's own public channels). Coverage spanned 2023–2024 (an
  // outdoor festival + the 2024 Boogie Lights show). Tier "informal". The
  // phrasing asserts NO client relationship and NO current affiliation for
  // anyone; per operator direction (P-work-2, 2026-07-12) the "made for a friend"
  // note was DROPPED — just "coverage of…". Renders on the archive tile AND the
  // /work/vybe case page.
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — softened permittedPhrasing (staging-only).
  {
    id: "vybe",
    name: "Vybe",
    tier: "informal",
    permittedPhrasing: "event coverage for Vybe",
  },
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — three new relationship entries for the
  // additional "from the archive" tiles (staging-only until read). P-work-2
  // (2026-07-12). Early gig work; dates read from the source files, never
  // invented. NO payment is asserted for any of these (operator direction:
  // "little gig-work things … do NOT mention pay").
  //
  // ROUND 5 (2026-07-21, operator-directed) — the combined "Nordic Daughter &
  // Something for Tomorrow" entry SPLITS into two: the operator named them as
  // separate archive tiles on /adventure. Facts unchanged from the original
  // combined entry (Nordic Daughter: Nordic / folk, a Scandinavian-festival
  // set, Jun 2024; Something for Tomorrow: a "Rickhouse" show, Jul 2024; the
  // two bands share a member). Tier "informal" for both (early gig work, no
  // pay claim). ⚠ OPERATOR READ-APPROVAL REQUIRED — the two split phrasings
  // are new strings (staging-only until read).
  //
  // POSTCARD2 (2026-07-27) — genre corrected "punk rock" → "hard rock":
  // Something For Tomorrow is web-verified (nordicdaughter.com/bio; a
  // jamsphere.com interview) as a real band — Jason Lycan (Nordic Daughter's
  // guitarist) plays in both. Full correction + the ND/SfT footage split are
  // in ADVENTURE-ARCHIVE-MINE.md §4 and SITE-COPY-DECK-publication-v1.md.
  {
    id: "nordic-daughter",
    name: "Nordic Daughter",
    tier: "informal",
    permittedPhrasing: "live-music coverage for Nordic Daughter",
  },
  {
    id: "something-for-tomorrow",
    name: "Something for Tomorrow",
    tier: "informal",
    permittedPhrasing: "live-music coverage for Something for Tomorrow",
  },
  // The Art of Brazilian Living — event coverage of a Brazilian music showcase
  // (a singer + samba dancers, outdoor stage; footage dated Jun 2025). Tier
  // "informal" (early gig work, no pay claim).
  {
    id: "brazilian-living",
    name: "The Art of Brazilian Living",
    tier: "informal",
    permittedPhrasing: "event coverage of a Brazilian music showcase",
  },
  // PNUMIX — a delivered event video (the "Paranormal Palace" event, Oct 2024).
  // Tier "delivered" (a finished, delivered piece — the operator's own word).
  // "delivered" is about delivery, not payment, so no pay is implied.
  {
    id: "pnumix",
    name: "PNUMIX",
    tier: "delivered",
    permittedPhrasing: "a delivered event video for PNUMIX",
  },
] as const;

// ---------------------------------------------------------------------------
// WORK — cross-lane proof RECORD. Round 3 (2026-07-21, operator-directed lane
// redistribution): /work no longer renders this array as a wall — every piece
// moved to its true lane page (Shelby + PitchBoulder → /entertainment, which
// already featured both; Knights of Mayhem → the /adventure festival feature;
// the AA flagship → /adventure's AA bands). The array STAYS as the single
// source of each engagement's attribution facts (title / forOrg / what /
// engagement / href) — lane pages compose their attribution lines FROM it,
// never restate them. `engagement` labels paid vs unpaid honestly (BUILD-PLAN
// §1.2 F5) — [confirm] blocks production until each is resolved with Sindbad.
// ---------------------------------------------------------------------------

export type WorkItem = {
  slug: string;
  title: string;
  pillar: PillarId;
  /** "For [org]" — the attribution that keeps every card honest. Omitted only
   *  when `lockedAttribution` renders the relationship's permittedPhrasing as
   *  the WHOLE line (e.g. the Amazing Aerial flagship — a licensed relationship
   *  may only ever be stated in its verbatim phrasing). */
  forOrg?: string;
  what?: string;
  engagement?: "paid engagement" | "unpaid coverage" | "personal / editorial" | "made on a handshake" | "[confirm]";
  relationshipId?: string;
  href?: string;
  /** When true, the tile prints RELATIONSHIP_BY_ID[relationshipId].permittedPhrasing
   *  VERBATIM as its attribution line instead of the composed "For … · … — …"
   *  line — the only honest way to carry a licensed relationship on a tile. */
  lockedAttribution?: boolean;
  /** Overrides the tile's default "Read the story" click-through label. */
  cta?: string;
  /** CSS object-position for the tile face, to keep key elements in the crop. */
  objectPosition?: string;
  /** AA-bound teaser still: its exported media carries a baked-in dual-brand
   *  (Amazing Aerial + ASM) watermark (exclusivity handling — see the gallery
   *  comment). Purely descriptive; the gallery uses it for an optional caption. */
  watermarked?: boolean;
  /** Native orientation of the exported gallery still (R3). "landscape" = 3:2
   *  export widths 800/1400/2200; "vertical" = 4:5 widths 800/1120/1600. The
   *  gallery honors this so images are never squished into a fixed card shape. */
  orientation?: "landscape" | "vertical";
  /** Field note (R3.4) — a first-person location story, 40–90 words, VERBATIM
   *  from FIELD-NOTES-COPY.md. Rendered as a collapsible block on the gallery
   *  card (outside .map-inset so the hover warp is untouched). STAGING-ONLY
   *  review gate: every note awaits operator read-approval before production. */
  fieldNote?: string;
  /** When true, the field note ships expanded (Matterhorn — the sample a
   *  visitor sees without interacting). All others collapsed by default. */
  fieldNoteOpen?: boolean;
};

export const WORK: readonly WorkItem[] = [
  // P12.7 — order flipped per operator: the Shelby/Pebble Beach piece is his
  // signature showpiece right now, so it leads the wall; PitchBoulder follows
  // (now with its own hover-loop cut from the promo he produced).
  {
    slug: "shelby-pebble-beach",
    title: "A restored Shelby at Pebble Beach",
    pillar: "entertainment",
    forOrg: "Jack Bell", // published with attribution on his live site — flag at staging review (COPY.md §4)
    what: "attended with a car owner to cover a restored Shelby",
    // RESERVED — awaiting operator fact (COPY.md §4). Paid vs unpaid is not
    // stated anywhere in his published copy; one word from him at staging review
    // resolves it. This stays "[confirm]" — one of the two production blockers.
    engagement: "[confirm]",
    relationshipId: "pebble-beach",
    href: "/work/shelby-pebble-beach",
  },
  {
    slug: "pitchboulder",
    title: "PitchBoulder — coverage, recaps & the commercial",
    pillar: "entertainment",
    forOrg: "PitchBoulder",
    what: "event coverage & recaps, and produced their commercial",
    // Sourced (COPY.md §3), not guessed: Rothschild's published quote says
    // "I hired Sindbad Horizon"; the published case copy says "directly
    // commissioned by founder Peter Rothschild."
    engagement: "paid engagement",
    relationshipId: "pitchboulder",
    href: "/work/pitchboulder",
  },
  // P-work (2026-07-12) — KNIGHTS RE-LANED venture → ADVENTURE per operator:
  // "Knights of Mayhem is an adventure story, not a venture — I just was at a
  // cool place and covered a story." So the only two VENTURE tiles are the
  // Shelby/Pebble Beach story and PitchBoulder (both above); everything else on
  // the wall files under adventure. Engagement wording ("made on a handshake")
  // is the operator's own phrase — states the deal's shape without claiming or
  // denying payment. Title/what still in the read-approval queue.
  {
    slug: "knights-of-mayhem",
    title: "Knights of Mayhem — full-contact jousting at the Colorado Medieval Festival",
    pillar: "adventure",
    forOrg: "Knights of Mayhem",
    what: "covered the jousting troupe and cut their showcase piece",
    engagement: "made on a handshake",
  },
  // P-work (2026-07-12) — AA FLAGSHIP. The watermarked AA+ASM adventure stills
  // that used to fill the wall were REMOVED at the operator's direction ("all
  // these Amazing Aerial cards defeat the purpose — those belong in Adventure").
  // They still live on /adventure. In their place: ONE flagship tile → the AA
  // highlights reel at /work/amazing-aerial. Its face is E:/Amazing Ariel/
  // Snapshot_2.JPG (the AA mark is baked into the frame), exported to
  // work/amazing-aerial/tile.{avif,webp}. `lockedAttribution` makes the tile
  // print the AA relationship's permittedPhrasing VERBATIM — the only honest way
  // to state a licensed relationship on a tile (never a composed line).
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — the `title` and `cta` are new copy
  // (staging-only until read).
  {
    slug: "amazing-aerial",
    title: "Top shots with Amazing Aerial",
    pillar: "adventure",
    relationshipId: "amazing-aerial",
    lockedAttribution: true,
    href: "/work/amazing-aerial",
    cta: "See the highlights",
  },
] as const;

// ---------------------------------------------------------------------------
// WORK_ARCHIVE — the quiet "from the archive" band at the bottom of the work
// wall: older projects surfaced to round out the record (operator direction,
// 2026-07-12). NOT part of the filterable wall — these render in their own
// muted, smaller-tile band. Each states its relationship ONLY through its
// consts permittedPhrasing (rendered VERBATIM via <LegendMark>), plus a factual
// date read from the source files. Media lives in
// public/media/work/archive/<slug>.{avif,webp}. Tiles link nowhere (no case
// pages) — tiles-only, per operator.
// ⚠ OPERATOR READ-APPROVAL REQUIRED — the `title` + `date` strings and the band
// kicker are new visible copy (staging-only until read); the honest one-liners
// come verbatim from RELATIONSHIPS above.
// ---------------------------------------------------------------------------
export type ArchiveItem = {
  slug: string;
  title: string;
  date: string;
  relationshipId: string;
  /** When set, the archive tile links to its own light case page and shows the
   *  "Read the story →" affordance; unset tiles are display-only (no page). */
  href?: string;
  /**
   * Round 4 (2026-07-21, operator-directed) — the archive band SPLITS across two
   * lane pages instead of all sitting in one place:
   *   • "venture"   → /venture — gig/brand/event work for an organization.
   *   • "adventure" → /adventure — pieces that read as travel/coverage ("was
   *     around here, filmed this"), shown modestly as a small coverage band.
   * One source of truth; each page filters this field. PUB-D (2026-07-27):
   * Vybe is "adventure" per the operator's binding ruling that session — see
   * the entry below.
   */
  lane: "venture" | "adventure";
  /**
   * PUB-E (2026-07-27, operator ruling: "commercials are not stories") — when
   * true, the item is REMOVED from its lane's index page entirely (the "from
   * the archive" band), even though `lane` still records its true
   * classification. The item's own case page (if any) stays live; it stays
   * listed on /work (the flat archive directory) only. Set on Gigs Go Green
   * and PNUMIX below — both are commercial/promotional deliverables, not
   * stories, per the operator's directive.
   */
  hideFromLaneIndex?: boolean;
};

export const WORK_ARCHIVE: readonly ArchiveItem[] = [
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — GGG + Vybe now LINK to their own light
  // case pages (P-work-2, 2026-07-12). Their one-liners render verbatim from the
  // softened RELATIONSHIPS above; the `href` adds the "Read the story →"
  // affordance and makes the tile a link.
  {
    slug: "gigs-go-green",
    title: "Gigs Go Green",
    date: "2024–2025",
    relationshipId: "gigs-go-green",
    href: "/work/gigs-go-green",
    lane: "venture", // operator-named: STAYS on /entertainment
    // PUB-E (2026-07-27) — REMOVED from the /venture index band (operator
    // ruling: "commercials are not stories"). The case page stays live at
    // /work/gigs-go-green and stays listed on /work (the flat archive
    // directory) — only the venture-lane index tile is hidden.
    hideFromLaneIndex: true,
  },
  // PUB-D (2026-07-27) — Vybe MOVES BACK to adventure. Operator's BINDING
  // ruling this session overrides the PUB-A note above (which cited a stale
  // brief): the VYBE story belongs under Adventure Stories, not Venture. The
  // Round-5 2026-07-21 adventure placement was correct after all. Case page
  // stays at /work/vybe (URL unchanged); it now renders in /adventure's
  // "From the archive" band, not on /venture's story rail.
  {
    slug: "vybe",
    title: "Vybe",
    date: "2023–2024",
    relationshipId: "vybe",
    href: "/work/vybe",
    lane: "adventure",
  },
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — archive tiles (the `title` + `date`
  // strings are new visible copy, staging-only). One-liners render verbatim
  // from the RELATIONSHIPS above; dates read from the source files, never
  // invented. Round 4 moved these to /adventure (travel/coverage pieces, not
  // commissioned venture work); they render there as a modest bottom band.
  // ROUND 5 — the combined Nordic Daughter tile SPLITS in two per operator
  // (separate tiles for Nordic Daughter and "Something for Tomorrow").
  // POSTCARD2 (2026-07-27) — all three now link to their own /postcards/[slug]
  // detail page (filed this pass); genre note corrected from "punk rock" to
  // "hard rock" (Something For Tomorrow is web-verified as Jason Lycan's
  // — Nordic Daughter's guitarist — hard-rock side project; source:
  // nordicdaughter.com/bio + a jamsphere.com interview, both quoted in
  // SITE-COPY-DECK-publication-v1.md's POSTCARD2 section).
  {
    slug: "nordic-daughter",
    title: "Nordic Daughter",
    date: "2024",
    relationshipId: "nordic-daughter",
    href: "/postcards/nordic-daughter",
    lane: "adventure",
  },
  {
    slug: "something-for-tomorrow",
    title: "Something for Tomorrow",
    date: "2024",
    relationshipId: "something-for-tomorrow",
    href: "/postcards/something-for-tomorrow",
    lane: "adventure",
  },
  {
    slug: "brazilian-living",
    title: "The Art of Brazilian Living",
    date: "2025",
    relationshipId: "brazilian-living",
    href: "/postcards/brazilian-living",
    lane: "adventure",
  },
  {
    slug: "pnumix",
    title: "PNUMIX — Paranormal Palace",
    date: "2024",
    relationshipId: "pnumix",
    lane: "venture", // operator-named: STAYS on /entertainment
    // PUB-E (2026-07-27) — REMOVED from the /venture index band (operator
    // ruling: "commercials are not stories"). PNUMIX has no case page
    // (`href` was never set — display-only tile from the start), so it
    // stays recorded here and listed on /work (the flat archive directory)
    // as text only.
    hideFromLaneIndex: true,
  },
] as const;

// ---------------------------------------------------------------------------
// VENTURE_COLLECTIONS — PUB-E (2026-07-27, Directive PUB-E "collections
// architecture"). Below /venture's three features (Pebble Beach / PitchBoulder
// / MEME), the operator wants TWO NAMED collections — grouped story sections
// that each collect their stories, including stories that are ALSO featured
// elsewhere on the page (PitchBoulder leads Collection A even though it's
// also a feature chapter). `slate` + `title` strings below are copied
// VERBATIM from each story's own destination page (already flagged there —
// reuse adds no new copy); only the collection `name` and `intro` are new
// sentences on this page.
//
// NAMES ARE PLACEHOLDERS — operator to confirm or rename:
//   • Collection A: "Founders & Pitch Rooms" — the operator's own working
//     name from the directive.
//   • Collection B: "The Film Industry" — the operator's own working name;
//     he offered "The Screen Trade" as an alternate to consider.
// ⚠ OPERATOR READ-APPROVAL REQUIRED — collection names + intro lines are new
// copy (staging-only until read); logged in SITE-COPY-DECK-publication-v1.md.
//
// Amazing Aerial deliberately does NOT join either collection — per the
// directive it "stays on the venture rail (partner story upgrade planned
// later)". Pebble Beach also does not get a collection: the operator's own
// rule is a named collection needs >= 2 stories, and Pebble Beach is the
// only story in its space (see the "High Craft / Luxury Events" comment on
// its feature chapter in venture.astro) — so it stays feature-only.
// ---------------------------------------------------------------------------

export type CollectionStory = {
  href: string;
  slate: string;
  title: string;
  mediaSlug?: string;
  /** CSS object-position for the rail card's hero-900 face, to keep the real
   *  subject in the crop (the card box is 16:10) — same convention as
   *  WorkItem.objectPosition above. */
  objectPosition?: string;
};

export type VentureCollection = {
  id: string;
  /** ⚠ Placeholder — operator to confirm or rename. */
  name: string;
  /** ⚠ New sentence — operator read-approval required. */
  intro: string;
  stories: readonly CollectionStory[];
};

export const VENTURE_COLLECTIONS: readonly VentureCollection[] = [
  {
    id: "founders-pitch-rooms",
    name: "Founders & Pitch Rooms",
    intro:
      "Where founders take the stage — the pitch nights we cover, and the workshop series that gets them ready for one.",
    stories: [
      {
        href: "/work/pitchboulder",
        slate: "PITCHBOULDER · BOULDER, COLORADO",
        title: "PitchBoulder — coverage, recaps & the commercial",
        // AUDIT-FIX (2026-08-03): this card's href is /work/pitchboulder, which
        // toRailCard()'s default `href.replace(/^\/venture\//, "")` slug
        // derivation (venture.astro) doesn't match — the card was silently
        // falling back to the "PITCH" ghost mark instead of a real photo,
        // even though PitchBoulder has plenty of event photography. mediaSlug
        // points it at a fresh bake instead: public/media/venture/
        // pitchboulder/hero-{900,1600} via scripts/
        // make-pitchboulder-venture-card.mjs (the same operator-approved
        // "whole room" frame already used as work/pitchboulder.astro's own
        // hero, re-cropped to this card's 16:10 box).
        mediaSlug: "pitchboulder",
      },
      {
        href: "/venture/ko-law-workshops",
        slate: "KO LAW · STARTUP WORKSHOP SERIES · 2026",
        title: "A startup workshop series, on camera.",
        // AUDIT-FIX (2026-08-03): default center-crop of the native-square
        // hero left too much exposed ceiling/lighting truss above the
        // branded screen (operator: "needs to be recentered ... too much
        // ceiling"). Pushed down to frame the screen + presenters + crowd.
        objectPosition: "50% 60%",
      },
    ],
  },
  {
    id: "film-industry",
    name: "The Film Industry",
    intro:
      "The industry side of the venture lane — the organization, the festival, and the market we keep a pulse on.",
    stories: [
      {
        href: "/venture/meme",
        slate: "MEME · MAKESHIFT ENTERTAINMENT MEDIA EDUCATION",
        title: "MEME is where this lane starts.",
      },
      {
        // Build #2 (2026-08-01 archive-mining integration) — repointed from
        // /work/seriesfest to the new hub page per _INTEGRATION-PLAN.md §1.2
        // "Links in". AUDIT-FIX (2026-08-02): /work/seriesfest is now
        // formally retired (redirects to /venture/seriesfest — see
        // astro.config.mjs); this card already pointed at the right place.
        href: "/venture/seriesfest",
        slate: "SeriesFest · Denver, Colorado",
        title: "SeriesFest, in depth.",
        mediaSlug: "seriesfest-2026",
        // AUDIT-FIX (2026-08-03): default center-crop of the native-square
        // hero showed mostly exposed ceiling truss above the branded SOIRÉE
        // screens (operator: "the images there are not good and centered").
        // Pushed down to frame both screens + the speaker instead.
        objectPosition: "50% 68%",
      },
      {
        href: "/venture/afm-2025",
        slate: "American Film Market · Nov 8–15, 2025 · Los Angeles, CA",
        title: "American Film Market 2025 — a venture story",
        // AUDIT-FIX (2026-08-03): same operator complaint as SeriesFest above.
        // Direction matches the object-position already tuned for this exact
        // photo on its own page (venture/afm-2025.astro's hero — see that
        // file's CROP NOTE: "subjects in the lower band, ~55-68% down"); this
        // card's box is a different ratio (16:10 vs that page's 16:9) so it
        // gets its own tuned value.
        objectPosition: "50% 60%",
      },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// GLOBE — the hero. Caption is LOCKED (binding honesty guardrail): the globe
// expresses where the stories are told — real footprint Italy + Switzerland
// (adventure work) + Boulder home base. It must never imply global client
// work. No arcs at launch. Pins are added only as real stories happen.
// ---------------------------------------------------------------------------

export type GlobePin = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  kind: "home" | "story";
  /** One honest line, surfaced on hover/tap. */
  story: string;
};

export const GLOBE = {
  caption: COPY.hero.globeCaption, // "Where the stories are told" — do not reword
  pins: [
    {
      id: "boulder",
      label: "Boulder, Colorado",
      lat: 40.015,
      lng: -105.2705,
      kind: "home",
      story: "Home base.",
    },
    {
      // Coordinates are country-representative; refine to actual shoot
      // locations when Sindbad supplies them (not a claim — no [confirm] gate).
      id: "italy",
      label: "Italian Alps",
      lat: 46.41,
      lng: 11.844,
      kind: "story",
      story: "Expedition photo & film in the Italian Alps — the work that earned Amazing Aerial's attention.",
    },
    {
      id: "switzerland",
      label: "Switzerland",
      lat: 46.5583,
      lng: 7.8817,
      kind: "story",
      story: "Expedition photo & film in the Swiss Alps.",
    },
  ] as readonly GlobePin[],
} as const;

// ---------------------------------------------------------------------------
// TESTIMONIALS — quotes are [confirm] until Sindbad supplies the exact wording
// AND written permission (BUILD-PLAN.md §5A S4/S5). NEVER invent a quote or an
// attribution; the production gate blocks launch until these resolve.
// ---------------------------------------------------------------------------

export type Testimonial = {
  id: string;
  quote: string; // [confirm] — verbatim, permissioned only
  attribution: string; // [confirm] — name + role, permissioned only
  relationshipId: string; // ties to RELATIONSHIPS (tier symbol + Ledger phrasing)
  /** Authored framing — descriptive only, never a status claim. */
  context: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "pitchboulder",
    // VERBATIM (COPY.md §2.1) — client-authored (Peter Rothschild); permission inherent.
    quote:
      "When we created the website for PitchBoulder, we needed a video to capture the spirit of our meetings and the energy in the room. I hired Sindbad Horizon to create a piece that would address these requirements. Did he ever! The video is sensational, and I could not be more pleased.",
    attribution: "Peter Rothschild, Founder of PitchBoulder",
    relationshipId: "pitchboulder",
    context: "The primary proof anchor.",
  },
  // ---------------------------------------------------------------------------
  // TESTIMONIALS[1] — Pebble Beach / Jack Bell — ACTIVATED (P29, 2026-07-20)
  // per operator direction ("enable the commented-out second testimonial —
  // only two exist, that's fine"). The quote is VERBATIM the staged candidate
  // already published on his live site (adventure-media-v2, Work page, live at
  // the apex) — attributed to the OWNER, never to the event/Concours.
  // Wired into the Shelby case study (Words chapter) + entertainment ch.02.
  // ---------------------------------------------------------------------------
  {
    id: "pebble-beach-owner",
    quote:
      "Working with Sindbad Horizon of Adventure Storytelling Media was a great experience. He not only captured stunning footage and photographs of the Cobra at Pebble Beach, but also brought the story and character of the car to life through his editing and creative direction. The results went far beyond documentation.",
    attribution: "Jack Bell, Owner, 1967 Shelby Cobra 427 S/C",
    relationshipId: "pebble-beach",
    // Existing approved framing phrase reused (entertainment E4) — outcome
    // framing, never a status claim.
    context: "A coverage endorsement from the car owner.",
  },
] as const;

// ---------------------------------------------------------------------------
// Lookup maps — for components that resolve a relationship/testimonial by id.
// Components MUST render RELATIONSHIP_BY_ID[id].permittedPhrasing verbatim for
// any status claim; page prose below never restates a status.
// ---------------------------------------------------------------------------

export const RELATIONSHIP_BY_ID: Record<string, Relationship> = Object.fromEntries(
  RELATIONSHIPS.map((r) => [r.id, r]),
);

export const TESTIMONIAL_BY_ID: Record<string, Testimonial> = Object.fromEntries(
  TESTIMONIALS.map((t) => [t.id, t]),
);

// ---------------------------------------------------------------------------
// PAGES — all page copy, first-person solo voice (BUILD-PLAN.md §1; hero angles
// research-brief.md §3). GOVERNANCE:
//   • Prose fields (heading/body/etc.) are authored positioning — they must
//     never assert a relationship's status.
//   • Any relationship claim is a `ProofLine` {relationshipId}; the renderer
//     prints RELATIONSHIP_BY_ID[id].permittedPhrasing verbatim + its legend
//     symbol. This is the only channel through which a status may be stated.
//   • `[confirm]` marks any fact not yet verified (blocks production builds).
// ---------------------------------------------------------------------------

export type Cta = { label: string; href: string };

/** Renders as the relationship's verbatim permittedPhrasing + legend symbol. */
export type ProofLine = {
  relationshipId: string;
  /** Optional authored lead-in — descriptive only, never a status claim. */
  context?: string;
};

export type TableauChapter = {
  terrain: string;
  headline: string;
  body: string;
  proof: ProofLine;
  link: Cta;
};

/** A case-study walkthrough (§2c) — consumed by CaseStudy.astro. Chapters are
 *  fixed (context / ask / work / outcome / words); `body: "[confirm]"` marks
 *  an honest-outcome slot still awaiting Sindbad's real content (never
 *  invented). */
export type CaseStudySection = { heading: string; body: string; proof?: ProofLine };
export type CaseStudyData = {
  meta: { title: string; description: string };
  hook: string;
  context: CaseStudySection;
  ask: CaseStudySection;
  work: CaseStudySection & { proof: ProofLine };
  outcome: CaseStudySection;
  /** Optional — omitted when a case's testimonial is RESERVED (e.g. Shelby /
   *  Jack Bell, COPY.md §2.2). CaseStudy.astro guards its render. */
  testimonialId?: string;
  cta: Cta;
};

export const PAGES = {
  // ---- HOME (§1.1). Hero + paths live in COPY; sections below follow. ------
  home: {
    // P29 buyer-language pairing — persona kept, plain buyer terms added so
    // search snippets and tabs decode instantly. ⚠ OPERATOR READ-APPROVAL
    // REQUIRED — new meta copy (staging-only until read).
    // PUB-A (2026-07-27) — the <title> is replaced with publication framing
    // per ACTION-PLAN.md (the site sells stories now, not production
    // services). description was flagged as out-of-scope for that pass —
    // PUB-D (2026-07-27) closes that flag: it carried "the StorySmith" as a
    // byline (retired site-wide per the consistency sweep) and the old
    // "corporate storytelling, and market research" services framing
    // (retired with /entertainment). Rewritten to match the new <title> and
    // /about's meta voice; no facts changed.
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — new title (staging-only until read).
    meta: {
      title: `${SITE.name} — Adventure & Venture Stories from the Field`,
      description:
        "Adventure Storytelling Media publishes two kinds of hard-won stories from Boulder, Colorado — Adventure Stories from the field, Venture Stories from the market. One storyteller, research to final cut, working worldwide.",
    },
    // H3 — three-pillar scroll tableaux, equal grammatical weight.
    tableaux: [
      {
        terrain: "The wild",
        headline: "The story is usually where it's hardest to reach.",
        body: "We cover expeditions and wild places most cameras never get to — on foot, in the air, in conditions that don't wait for a second take.",
        proof: { relationshipId: "amazing-aerial" },
        link: { label: "See the adventure work", href: "/adventure" },
      },
      {
        terrain: "The market",
        headline: COPY.anchors.belief, // "Your product works. Your story isn't landing."
        body: "Under Forge the Saga, we turn a founder's real advantage into a narrative the market actually feels — and pressure-test it before you spend to find out.",
        proof: { relationshipId: "pitchboulder" },
        link: { label: "Forge your saga", href: "/forge-the-saga" },
      },
      {
        terrain: "The industry",
        headline: "We keep a pulse on the rooms your story has to survive.",
        body: "We stay close to how the industry moves — the board work, the coverage, the festivals and markets — and we are honest about exactly how close each relationship is.",
        proof: { relationshipId: "meme" },
        // PUB-A (2026-07-27) — Industry Stories is retired; MEME + festival/
        // market coverage now live on /venture (the venture-stories index).
        // href repointed only — terrain/headline/body/proof untouched (media-
        // layer keys + hero copy are out of this restructure's scope).
        link: { label: "The network", href: "/venture" },
      },
    ] as readonly TableauChapter[],
    // H4 — proof band. P29 INVERSION (operator-directed): lead with the
    // strongest delivered work, not the caveats. The honesty DISCIPLINE is
    // unchanged (every line still renders its verbatim permittedPhrasing);
    // only the self-narrating tier framing is gone and the order now runs
    // paid/delivered first. ⚠ OPERATOR READ-APPROVAL REQUIRED — new heading +
    // intro copy (staging-only until read).
    proof: {
      heading: "Paid, delivered, ongoing.",
      intro:
        "Real work for real clients — and every relationship on this site stated at exactly what it is, in its own words. No logo wall, no borrowed credit.",
      anchor: { relationshipId: "pitchboulder" } as ProofLine,
      testimonialId: "pitchboulder",
      // P29 order = delivered/paying work first, rooms last (was tier-formal
      // first, which led with a nonprofit role and closed on caveats).
      tiered: [
        "pitchboulder",
        "amazing-aerial",
        "workshop-coverage",
        "meme",
        "pebble-beach",
        "seriesfest",
        "afm",
      ] as readonly string[],
    },
    // H5 — Forge the Saga teaser. Stage names come from SAGA_STAGES.
    forgeTeaser: {
      heading: "Forge the Saga",
      body: "A five-stage method that takes a founder's story from raw market intelligence to a tested, ready-to-run narrative.",
      anchor: COPY.anchors.testing, // "find out what works before you spend real money..."
      cta: PRIMARY_CTA,
    },
    // H6 — About teaser.
    aboutTeaser: {
      body: "One craft — storytelling — told across the wild, the market, and the industry.",
      anchor: COPY.anchors.homeBase, // "Boulder is home base. The world is the territory."
      link: { label: "How it all fits", href: "/about" },
    },
    // H7 — contact CTA band.
    contactBand: {
      headline: COPY.anchors.noPressure, // "No pitch, no pressure."
      body: "Tell us what you're building. If we can help you make it land, we'll tell you how. If we can't, we'll tell you that too.",
      cta: { label: "Book a call", href: "/contact" },
    },
  },

  // ---- FORGE THE SAGA (§1.2) — PUB-B (2026-07-27): rebuilt as THE METHOD
  // PAGE per ACTION-PLAN.md's publication restructure. This page no longer
  // sells anything — no prices, no packages, no booking CTA. It presents the
  // five stages (SAGA_STAGES stays the single source of stage name/sub/
  // deliverable — its `price`/`process`/`bestFor` fields are sales language
  // for OTHER pages that still price them and are deliberately NOT reused
  // here) as ASM's editorial method: how a story gets made before it's
  // published, and why research comes first. Ends with one quiet line
  // pointing to the founder (about/contact) — the only trace of "hire me" on
  // this page. FORGE_SERVICES / FORGE_PACKAGES / FORGE_CONSULT_RATE are left
  // untouched in consts (adventure.astro + entertainment.astro still price
  // off FORGE_SERVICES) but are no longer imported or rendered here.
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — every string below is new copy
  // (staging-only until read). Logged in COPY-DECK-B.md.
  forge: {
    meta: {
      title: "The Method — How Stories Get Made | Adventure Storytelling Media",
      description:
        "Five stages, research first: how every Adventure Storytelling Media story gets scouted, mapped, forged, tested, and assessed — the same method available to clients through the founder.",
    },
    // F1 — hero. No rate, no booking CTA.
    hero: {
      kicker: "The method",
      headline: "How the stories get made.",
      subline:
        "Every story published here — adventure or venture — moves through the same five stages before we call it finished. Research comes first, every time.",
    },
    // F2 — why research comes first (replaces the old buyer-qualification
    // "who it's for" section with the editorial thesis).
    researchFirst: {
      heading: "Research comes first",
      body: "It's tempting to skip straight to shooting — the camera is the fun part. But a story only works if it reaches the people it's for, and that means finding out who they are and what they already believe before a single frame is cut. The stages below are how we hold ourselves to that, on every story we publish.",
      items: [
        "Who the story is actually for — not just who we hope is watching.",
        "What's already been said, so we're not repeating it.",
        "Where the real stakes are, before a camera comes out.",
      ] as readonly string[],
    },
    // F3 — the five stages themselves, editorial framing. `body` here is new
    // copy written for THIS page; names/subs/deliverables are pulled from
    // SAGA_STAGES by index (single source, unchanged) — no prices rendered.
    method: {
      heading: "The five stages",
      stages: [
        {
          body: "Before anything else, we find out who a story is actually for — the language they use, what they already believe, what's missing from what's already been published. It becomes a Field Notes brief: the ground truth the rest of the work stands on.",
        },
        {
          body: "Raw research becomes a shape — who the story is for, what arc actually moves them, and what that looks like once it's built. This is where a pile of notes turns into a plan.",
        },
        {
          body: "The plan becomes real: the shoot, the edit, the actual film or photographs. Everything is built to be tested, not just published — a first draft with the discipline of a final cut.",
        },
        {
          body: "The story meets a real audience before it meets everyone — a small one first, honestly, so we find out what's landing and what isn't while there's still time to fix it.",
        },
        {
          body: "We read what actually happened — what held attention, where people dropped off — and decide what changes before the story goes out wide, or what the next one should do differently.",
        },
      ] as readonly { body: string }[],
    },
    // F4 — pretest. LAUNCHES AS VARIANT B (OD-2): no standalone section; the
    // pretest idea already lives honestly inside SAGA_STAGES[3] ("curated human
    // panels, AI audience simulations, or both"). The Variant-A copy is kept
    // here on the shelf, NOT rendered, so it lifts back in without rework if
    // the service proves out. It contains zero mention of any platform.
    pretestShelved: {
      rendered: false,
      heading: "Before your story meets investors, it meets the panel.",
      body: "Echo Panel is an AI investor-pitch pretest tool built in-house — your pitch gets stress-tested before it costs you a real meeting.",
    },
    // F5 — proof: the method actually produces delivered work.
    proof: {
      heading: "Proof",
      anchor: { relationshipId: "pitchboulder" } as ProofLine,
      testimonialId: "pitchboulder",
      // Delivered-work cards — services actually delivered for real people,
      // each labeled at exact status (WORK[].engagement, [confirm] until set).
      deliveredWorkSlugs: ["pitchboulder"] as readonly string[],
      note: "No second testimonial at launch. Everything shown is work actually delivered, labeled paid or unpaid as it truly was.",
    },
    // F6 — close. No CTA button, no trustline — one quiet line to the founder.
    close: {
      headline: "The same method, off the page.",
      body: "This same method is available to clients — the research, the production, the testing — through the founder, Sindbad Horizon.",
      links: [
        { label: "About the founder", href: "/about" },
        { label: "Get in touch", href: "/contact" },
      ] as readonly Cta[],
    },
    // F7 — "Where the stories go" (PUB-E, 2026-07-27, Directive PUB-E): a
    // quiet channel directory at the bottom of the method page — where the
    // stories go to be followed, plus a quiet sense of how the operation
    // runs deep. Every link below resolves from a value already live in
    // consts (SITE.socials / the /contact#follow anchor / the /licensing
    // page) or a real route already shipped — nothing invented. The
    // operator's own social roster only confirms YouTube + Instagram
    // (SITE.socials above); TikTok and LinkedIn are commented out there
    // (unconfirmed handle / no verified company page) and are deliberately
    // NOT listed here — a directory that names an unconfirmed channel would
    // be a bigger honesty risk than a short list.
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — every string below is new copy
    // (staging-only until read).
    directory: {
      heading: "Where the stories go",
      body: "The publication lives in a few places besides this page — new dispatches, the licensed aerial archive, and a quieter sense of how the whole operation runs.",
      channels: [
        { label: "Newsletter", href: "/contact#follow" },
        { label: "YouTube", href: SITE.socials.youtube },
        { label: "Instagram", href: SITE.socials.instagram },
        { label: "The licensed aerial archive", href: "/licensing" },
      ] as readonly Cta[],
    },
  },

  // ---- ADVENTURE (§1.3) — P29: now ALSO the adventure-production SALES page
  // (largely drone filming): samples + its own day-rate pricing + booking.
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — meta, hero.eyebrow, hire block, and
  // the production handoff are NEW copy (staging-only until read).
  adventure: {
    meta: {
      title: "Adventure Stories — Drone & Aerial Production | Boulder, Colorado",
      description:
        "Cinematic drone and aerial production, plus expedition photo & film from the places hardest to reach. FAA Part 107 licensed (US), international shoots welcome — day rates, samples, and direct booking.",
    },
    hero: {
      eyebrow: "Adventure Stories — Drone & Aerial Production",
      headline: "The wild doesn't do second takes.",
      subline:
        "Expedition and adventure coverage — photo and film — from the places that are hardest to reach.",
    },
    // PUB-A (2026-07-27) — A1b "Hire the operator" (services + day rate +
    // booking CTA) REMOVED here: adventure.astro is a story index now, not a
    // services pillar. Field removed rather than left orphaned.
    territory: {
      heading: "The territory",
      // Authored positioning (COPY.md §5.1), grounded in the stories the site
      // itself publishes: Alps (Italy + Switzerland), Colorado's Front Range,
      // and the coverage rooms (Denver, Los Angeles). ROUND 5 (2026-07-21):
      // rewritten TIMELESS ("so far" dropped) and count-free — the territory
      // grows without the copy aging. ⚠ OPERATOR READ-APPROVAL REQUIRED — new
      // sentence (staging-only until read).
      body: "The work runs deepest through the Alps — Italy and Switzerland — and across Colorado's Front Range at home, shooting on the ground and from the air. Coverage reaches wherever the story is: festival rooms in Denver, market floors in Los Angeles. The map grows as the work does.",
    },
    // A3 — Licensed vs Personal nesting (Mark Clennon model).
    licensed: {
      heading: "Licensed",
      body: "The aerial footage that's available to license lives off-site — follow it out to where it's licensed.",
      proof: { relationshipId: "amazing-aerial" } as ProofLine,
    },
    personal: {
      heading: "Personal & editorial",
      body: "The self-driven expedition work — the frames we chase for their own sake.",
    },
    gallery: {
      heading: "The field",
      note: "Real stills replace these slots as footage arrives (BUILD-PLAN.md §5A S2).",
    },
    // A3b — THE FIELD teaser (Round 5, 2026-07-21, operator-directed): the
    // floating-portraits gallery moved to its own subpage (/adventure/field);
    // /adventure keeps ONE inviting block that hands off to it. ⚠ OPERATOR
    // READ-APPROVAL REQUIRED — kicker/heading/body/cta are new visible copy
    // (staging-only until read).
    fieldTeaser: {
      kicker: "Travel stories",
      heading: "Stories from the field",
      body: "Living portraits from the places the work goes — the Matterhorn at dusk, Lake Como from the water, the Flatirons at home. Each one opens into its own story.",
      cta: { label: "Enter the field", href: "/adventure/field" },
    },
    // The /adventure/field subpage's own head copy (Round 5). ⚠ OPERATOR
    // READ-APPROVAL REQUIRED — new visible copy (staging-only until read).
    fieldPage: {
      meta: {
        title: "The Field — Travel Stories & Living Portraits | Adventure Stories",
        description:
          "The field gallery of Adventure Storytelling Media — living portraits and travel stories from the Alps, the Front Range, and wherever the work goes next.",
      },
      eyebrow: "Adventure Stories — The Field",
      heading: "The field",
      subline: "Every painting is a place the work has been. Step into one.",
    },
    // A4b — MEDIEVAL FESTIVAL IN LOVELAND (Round 3, 2026-07-21). The Knights of
    // Mayhem piece RE-LANED here from the /work wall (operator: "Knights of
    // Mayhem is an adventure story") and BROADENED into one cohesive festival
    // story block: the jousting showcase video remains the feature, ringed by
    // the operator's own drone frames of the joust lane and the armored
    // ground-combat arena (baked by scripts/make-festival-photos.mjs). The
    // attribution line composes from the WORK record (single source); the
    // aerial-licensing note renders ONLY via LegendMark (amazing-aerial's
    // verbatim permittedPhrasing) as an inline credibility marker.
    // 2026-07-31 (operator direct review) — the section was carrying a
    // PLACEHOLDER description ("A medieval festival in Loveland") instead of
    // the event's real name. Verified: Colorado Medieval Festival, run by The
    // Savage Woods LLC at 1750 Savage Road, Loveland, CO (coloradocastle.com,
    // colorado.com/loveland/events/history-heritage/colorado-medieval-festival,
    // tickettailor.com/events/thesavagewoodsllc — confirmed again 2026-07-31
    // via web search: annual June weekend, Knights of Mayhem full-contact
    // jousting, Colorado Wardens armored combat). Same name already used
    // correctly on the full story page (steelDust below) — this teaser now
    // matches it.
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — kicker/heading/body are new visible
    // copy (staging-only until read). Facts: Colorado Medieval Festival,
    // Loveland, CO, June 2024 — dates read from the source files.
    // 2026-07-31 (naming-scout re-verify, operator note (c) — "did you
    // mention Savage Woods?"): the venue name was already correct on the
    // story page (steelDust below) but missing from THIS teaser, which only
    // said "a field outside Loveland." Both names are real and distinct —
    // Colorado Medieval Festival is the event, The Savage Woods is the venue
    // (The Savage Woods LLC, 1750 Savage Road) — so both now appear here too.
    // "Loveland Medieval Festival" is not an official name anywhere sourced
    // and is deliberately not used.
    festival: {
      kicker: "Adventure story · The Savage Woods, Loveland, Colorado",
      heading: "The Colorado Medieval Festival",
      body: "One weekend a year, The Savage Woods, an event ground in the trees off Savage Road outside Loveland, turns into a tournament ground — full-contact jousting down the lists, armored fighters in the arena, and a few thousand people around the rails. We covered it from the air and the ground, and cut the Knights of Mayhem's showcase piece from it.",
    },
    // M1 — STEEL & DUST (2026-07-22, operator-directed "magazine light"
    // direction): the festival block's FULL STORY subpage at
    // /adventure/steel-and-dust — the first Field Notes magazine story and the
    // template for future marquee coverage pieces. Cover treatment derived
    // from the operator-reviewed Claude Design prototypes (project 4a21b809:
    // recentered cover + telemetry annotations + editorial spread), rebuilt
    // native to the site's grammar.
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — every string below is new visible
    // copy (staging-only until read). v2 (operator notes 2026-07-22): story
    // journalism, not photo description; researched facts folded in. Sources:
    // coloradocastle.com + colorado.com + tickettailor (festival: The Savage
    // Woods, 1750 Savage Road, Loveland; annual June weekend — June 7-9 in
    // 2024; run by The Savage Woods LLC, the outfit behind Loveland's seasonal
    // haunted/holiday walks; bill = jousting + sword-fighting displays +
    // medieval hamlet). knightsofmayhem.com + NatGeo/press (Knights of Mayhem:
    // full-contact jousting troupe founded by Charlie Andrews, world-champion
    // heavy-armor jouster; National Geographic series "Knights of Mayhem",
    // 2011). No invented telemetry, counts, or read-times.
    steelDust: {
      meta: {
        title: "Steel & Dust — the Colorado Medieval Festival from above",
        description:
          "Field Notes No. 01: full-contact jousting at the Colorado Medieval Festival in Loveland — the Knights of Mayhem, covered from the air and the ground.",
      },
      cover: {
        masthead: "Field Notes",
        credit: "Adventure Storytelling Media",
        issue: "Field report · No. 01",
        location: "Loveland, Colorado",
        coords: "40.39° N · 105.07° W",
        storyLabel: "The cover story",
        titleA: "Steel",
        titleB: "Dust",
        deck: "Once a year, a patch of woods outside Loveland stages the real thing — and the Knights of Mayhem ride at each other for keeps.",
        teasers: ["Full-contact jousting", "Armored combat in the pen", "Three days at The Savage Woods"],
        scrollCue: "Scroll for the field report",
        plates: [
          { label: "Inside — the pen", slug: "arena-melee", alt: "Aerial view into the combat pen: downed armored fighters, the marshal crossing with the yellow flag, crowd at the fence" },
          { label: "Inside — the duel", slug: "duel-pen", alt: "Aerial view of two armored fighters in single combat in the pen, swords raised, spectators packed along the rail" },
        ],
      },
      byline: "Words & drone — Sindbad Horizon",
      slate: "Colorado Medieval Festival · June 2024",
      lede: "There is a moment, early in a Knights of Mayhem pass, when a first-time crowd figures out what it is actually watching. Theater applauds on cue. This crowd gasps first.",
      chapters: { lists: "Pass one — the lists", arena: "Pass two — the pen", grounds: "Pass three — the grounds" },
      paragraphs: [
        "The Colorado Medieval Festival runs one June weekend a year at The Savage Woods, a family-run event ground in the trees off Savage Road — the same outfit that stages Loveland's haunted walks come fall. Most of the year it sits quiet. For three days it becomes a hamlet: merchant rows, music, banners, mead — and at the center of it, a dirt jousting list and a timber combat pen built for keeps.",
        "The headliners are the Knights of Mayhem, the full-contact jousting troupe founded by Charlie Andrews — a world-champion heavy-armor jouster, and the man National Geographic built a series around in 2011. Their sport has no script: real lances, real armor, and passes that put a rider in the dirt when the hit lands square.",
      ],
      // Scene description bridging the film to the photos (operator note: no
      // process/"we cut it" language — just what is happening).
      afterVideo:
        "A single pass takes seconds. A rider commits at the far end, the horse opens up, and the lists close to a blur — then the lances meet, and the crowd finds out together whether the hit landed.",
      // Full film — the Knights of Mayhem showcase on YouTube (operator-supplied
      // 2026-07-22; tracking param stripped). Gated: renders only when set.
      fullFilm: { label: "Watch the full film on YouTube", href: "https://youtu.be/2OMfPSibhvE" },
      pullQuote: "Their sport has no script — theater applauds on cue, but this crowd gasps first.",
      arena:
        "The joust shares the bill with armored ground combat. In the timber pen, fighters in full plate go at it with blunt steel until the marshal's yellow flag ends the bout. From directly overhead the sport reads plainly: fighters go down, get helped off the rails, and line right back up for the next round.",
      pageant:
        "And between the violence, the festival does what festivals do — the procession takes the lane, gowns and banners on the same dirt the horses just tore up. Half theater, half genuine hazard: Loveland's strangest June tradition, and its best one.",
      captions: {
        joustCharge: "First pass of the afternoon.",
        joustRiders: "Resetting in the lists.",
        meleeArena: "Yellow flag up — the only thing that ends a bout.",
        arenaSails: "Team bouts under the shade sails, crowd three deep at the fence.",
        lanePageant: "The procession takes the lane.",
        fieldWide: "The Savage Woods at full tilt, June 2024.",
        loop: "Three riders down the lists at once.",
      },
      fieldLog: {
        heading: "Field log",
        rows: [
          { label: "Site", value: "The Savage Woods — Loveland, CO" },
          { label: "Event", value: "Colorado Medieval Festival (annual)" },
          { label: "Date", value: "June 2024" },
          { label: "Discipline", value: "Full-contact joust · armored combat" },
          { label: "Troupe", value: "Knights of Mayhem" },
        ],
      },
      // The bottom sign-off band (operator rule 2026-07-22): wherever this
      // coverage's licensing is referenced, use the Amazing Aerial logo + a
      // link to his contributor page. This footage is registered EDITORIAL on
      // AA — verbal consent to film/fly, no signed commercial release — so it
      // is licensable for editorial use only. Copy states exactly that.
      editorial: {
        note: "Shot for editorial use. This coverage lives in the Adventure Storytelling Media portfolio on Amazing Aerial Agency, where it can be licensed for editorial stories.",
        cta: {
          label: "See more of this work at Amazing Aerial",
          href: "https://www.amazingaerial.com/search/en/1/0x7B22736561726368626172223A22222C226F726465726D6F6465223A2232222C226F726465726279223A2231222C226D6F6D616E65742D69645F75736572223A22323838227D",
        },
      },
    },
    // A4c — FROM THE ARCHIVE (Round 4, 2026-07-21, operator-directed). Two
    // tiles moved off /entertainment's archive band because they read as
    // travel/coverage pieces, not commissioned venture work: Nordic Daughter &
    // Something for Tomorrow, and The Art of Brazilian Living. Rendered
    // DELIBERATELY SMALL and quiet — the operator's note is that these are
    // padding until stronger work replaces them, so the copy claims nothing
    // beyond what happened. Every one-liner still renders VERBATIM from the
    // relationship's permittedPhrasing (no prose restates a status).
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — kicker/heading/body are new visible
    // copy (staging-only until read).
    coverage: {
      kicker: "From the archive",
      heading: "Filmed along the way",
      body: "Earlier live-music and festival coverage, picked up while passing through. Small pieces, kept here for the record.",
    },
    // A4d — POSTCARDS (PUB-E, 2026-07-27): heading copy for the structured
    // micro-story placeholder (src/data/postcards.ts). The section itself
    // renders only when that array is non-empty — this heading just labels
    // it for whenever the first postcard is filed.
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — new copy (staging-only until read).
    postcards: {
      kicker: "Postcards",
      heading: "Postcards from the road",
      body: "The smallest stories — one place, one paragraph, a few frames. Filed as they happen.",
    },
    // AA funnel outro (operator exclusivity handling): the Colorado teaser stills
    // are watermarked previews; the gallery is a referral to the agency that
    // licenses the full collection. Points directly at the operator's AA
    // portfolio search URL (P12.4b) — his contributor listing, not the AA
    // homepage. Copy invites licensing THROUGH Amazing Aerial.
    aaFunnel: {
      heading: "License the full collection",
      body: "The aerial work is represented by Amazing Aerial Agency. The watermarked frames here are previews — see the full, licensable collection on the Amazing Aerial portfolio.",
      cta: {
        label: "See the full collection at Amazing Aerial",
        href: "https://www.amazingaerial.com/search/en/1/0x7B22736561726368626172223A22222C226F726465726D6F6465223A2232222C226F726465726279223A2231222C226D6F6D616E65742D69645F75736572223A22323838227D",
      },
    },
    // A5 — P29: the close now points at PRODUCTION (this lane's own buyer),
    // not at consulting — adventure buyers aren't founders. Calendly direct.
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — new closing line (staging-only).
    handoff: {
      body: "Need this eye on your production? Tell us where and when.",
      cta: { label: "Book a call", href: SITE.bookACall },
    },
  },

  // ---- ENTERTAINMENT (§1.4) — internal key for VENTURE STORIES, the index of
  // ALL venture stories (PUB-A, 2026-07-27; ACTION-PLAN.md restructure). Now
  // rendered at /venture (src/pages/venture.astro; the retired /entertainment
  // route redirects there) as a STORY INDEX, not a services pillar — the E1b
  // "Hire this lane" services/floors block is REMOVED (this is a publication;
  // no service offerings on this site per the addendum). The internal key
  // stays `entertainment` deliberately: `rooms` and `meme` below are read
  // VERBATIM by six unowned venture/*.astro article pages
  // (afm-2025/ko-law-workshops/meme/seriesfest-*) via
  // `PAGES.entertainment.rooms.items.find(...)` / `.meme` — renaming the key
  // or restructuring those two fields would break those pages' builds. Only
  // meta/hero/handoff (consumed solely by venture.astro) are touched here.
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — meta.title/hero.eyebrow/handoff.cta
  // are revised copy (staging-only until read); everything else below is
  // UNCHANGED from the prior /entertainment page.
  entertainment: {
    meta: {
      title: "Venture Stories — Adventure Storytelling Media",
      description:
        "Corporate storytelling with a research spine: event & conference coverage, brand-story films, and market research that tells you what your audience actually hears. Floors and direct booking.",
    },
    // E1 — the pun IS the headline; the subline makes it land honestly.
    hero: {
      // PUB-A — eyebrow drops the buyer-service pairing ("Corporate
      // Storytelling & Market Research"); the page no longer sells that.
      eyebrow: "Venture Stories",
      headline: "The venture in adventure.",
      // Round 3 (2026-07-21) — subline re-worded off "the industry" and the
      // festivals: the film-industry material (MEME, SeriesFest, AFM) moved to
      // /work under the final lane definitions, so this lane's promise is now
      // purely the business-storytelling one. ⚠ OPERATOR READ-APPROVAL
      // REQUIRED — new sentence (staging-only until read).
      subline:
        "We tell stories from the wild — and stories of the modern expedition: founders, markets, and the rooms where business gets done. Real client work, real coverage — each stated at exactly what it is.",
    },
    // E2 — MEME (the most formal role).
    meme: {
      heading: "MEME",
      proof: { relationshipId: "meme" } as ProofLine,
      body: "The role I hold most formally in this world.",
    },
    // E3 — PitchBoulder feature (primary proof anchor).
    pitchboulder: {
      heading: "PitchBoulder",
      // context matches TESTIMONIALS["pitchboulder"].context — carried here
      // since Testimonial's own proof line is suppressed (showProof={false})
      // to avoid a back-to-back duplicate; see entertainment.astro E3.
      proof: {
        relationshipId: "pitchboulder",
        context: "The primary proof anchor.",
      } as ProofLine,
      testimonialId: "pitchboulder",
      link: { label: "See the work", href: "/work/pitchboulder" },
    },
    // E4 — the rooms; each honest about itself. Testimonial #2 sits here.
    // P29: the Jack Bell testimonial is ACTIVATED (operator direction) — its
    // id rides the pebble-beach room and renders in chapter 02.
    rooms: {
      heading: "The rooms",
      intro: "The rest is honest about itself.",
      items: [
        {
          proof: {
            relationshipId: "pebble-beach",
            context: "A coverage endorsement from the car owner.",
          } as ProofLine,
          testimonialId: "pebble-beach-owner",
        },
        { proof: { relationshipId: "seriesfest" } as ProofLine },
        { proof: { relationshipId: "afm" } as ProofLine },
        { proof: { relationshipId: "workshop-coverage" } as ProofLine },
      ] as readonly { proof: ProofLine; testimonialId?: string }[],
    },
    // E5 — soft handoff. PUB-A (2026-07-27): the close no longer sells a
    // booking CTA (no services pillar) — it invites the reader to follow the
    // publication, the same action as the header/hero CTA (PRIMARY_CTA).
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — revised cta (staging-only).
    handoff: {
      body: PILLARS.find((p) => p.id === "entertainment")!.handoff,
      cta: PRIMARY_CTA,
    },
  },

  // ---- WORK (§1.5) — case-study template ONLY (PUB-A, 2026-07-27). ---------
  // "Industry Stories" (the old /work lane page: MEME top billing + the
  // SeriesFest/AFM coverage shelf + the conservative close) is RETIRED per
  // the publication restructure — that content refiles under /venture (the
  // new index of ALL venture stories; see src/pages/venture.astro, which now
  // carries MEME, the SeriesFest hub, and AFM in its story rail). /work is
  // reframed as a simple "Archive / All Stories" index (src/pages/work/
  // index.astro) that no longer reads from this object — it points into both
  // story columns directly. The FORMER meta/eyebrow/intro/meme/coverage/close
  // fields were REMOVED here (their copy is superseded, not reused) rather
  // than left orphaned. `caseStudies` SURVIVES UNCHANGED — work/pitchboulder
  // .astro and work/shelby-pebble-beach.astro (unowned individual story
  // pages; URLs stay stable) still read it.
  work: {
    // Case-study copy (Immersive-Garden walkthrough). PitchBoulder ships first
    // and sets the template. Facts I can't verify are [confirm] (asset S3);
    // outcome carries NO invented metric.
    caseStudies: {
      pitchboulder: {
        meta: {
          title: "PitchBoulder — coverage, recaps & a commercial",
          description:
            "How we run PitchBoulder's event coverage and recaps, and produced their commercial.",
        },
        hook: "The work we do for PitchBoulder, start to finish.",
        context: {
          heading: "Who they are",
          // ROUND 5 (TIMELESS pass): "nearly three years, across dozens of
          // weekly pitch events" dropped — durations and counts age; the
          // standing fact doesn't. ⚠ OPERATOR READ-APPROVAL — revised sentence.
          body: "PitchBoulder is a weekly founder pitch event in Boulder, Colorado — founders on stage, investors and operators in the room, and the sharpest questions in town. Peter Rothschild founded it. Adventure Storytelling Media is in that room week after week, watching the gap between what a founder says and what the room actually hears.",
        },
        ask: {
          heading: "The ask",
          // ROUND 5 (TIMELESS pass): "three years of" dropped — the ask reads
          // as the standing fact it is. ⚠ OPERATOR READ-APPROVAL — revised.
          body: "When PitchBoulder built their website, they needed one video that could stand for the room's weekly founder energy — something an investor or a founder could watch and instantly understand what the room feels like.",
        },
        work: {
          heading: "The work",
          proof: { relationshipId: "pitchboulder" } as ProofLine,
          body: "Event coverage and recaps on an ongoing basis, plus a commercial produced end to end.",
        },
        outcome: {
          heading: "The outcome",
          body: "The commercial now runs as PitchBoulder's primary website asset — commissioned directly by Peter, produced end to end. The event coverage and recaps continue week to week.",
        },
        testimonialId: "pitchboulder",
        cta: { label: "Forge your saga", href: "/forge-the-saga" },
      },
      // ---- Shelby / Pebble Beach case study (NEW — COPY.md §4). ------------
      // Honesty rails: relationship tier = `attended`; the proof line carries
      // the only status claim; prose never implies an official Pebble Beach
      // engagement. P29: the Jack Bell testimonial is ACTIVATED (operator
      // direction 2026-07-20) — see TESTIMONIALS[1].
      shelbyPebbleBeach: {
        meta: {
          title: "A restored Shelby at Pebble Beach",
          description:
            "Covering a one-of-a-kind 1967 Shelby Cobra 427 S/C at the Concours d'Elegance — a story of legacy and craftsmanship, told on screen.",
        },
        hook: "One car, one lawn, and a story worth more than a spec sheet.",
        context: {
          heading: "The car",
          body: "A one-of-a-kind restored 1967 Shelby Cobra 427 S/C, bound for the Concours d'Elegance at Pebble Beach — the most prestigious lawn in the automotive world. Its owner, Jack Bell, had spent years bringing the machine back.",
        },
        ask: {
          heading: "The ask",
          body: "Jack didn't want documentation. He wanted the car's legacy and craftsmanship to come through on screen — the story of the machine, not a walkaround.",
        },
        work: {
          heading: "The work",
          proof: { relationshipId: "pebble-beach" } as ProofLine,
          body: "We shot the Cobra on the lawn, then shaped the footage into a narrative built on emotion and craftsmanship — what the car means, not just what it is.",
        },
        outcome: {
          heading: "The outcome",
          body: "Jack got a finished cinematic film of his car — the machine's story and character on screen, delivered. It's below; watch it.",
        },
        // P29 — Jack Bell testimonial ACTIVATED (operator direction, 2026-07-20).
        testimonialId: "pebble-beach-owner",
        cta: { label: "Forge your saga", href: "/forge-the-saga" },
      },
    },
  },

  // ---- ABOUT (§1.6) — PUB-B (2026-07-27): rebuilt as THE FOUNDER / MASTHEAD
  // PAGE per ACTION-PLAN.md's publication restructure. This is the ONE place
  // services exist online, as a quiet line — no pricing, no packages. First
  // person throughout (the standing VOICE exception (a) above): he is
  // genuinely speaking about himself here. NEVER "The StorySmith" as a byline
  // or title (SITE.persona stays in consts for other pages' use — see the
  // governance note there — but this page does not render it). Every
  // relationship claim below is a ProofLine, rendered through <LegendMark>
  // with its verbatim permittedPhrasing — this page adds no new relationship
  // facts, only surfaces six already in RELATIONSHIPS.
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — every string below is new copy
  // (staging-only until read). Logged in COPY-DECK-B.md.
  about: {
    meta: {
      title: "About — Sindbad Horizon, Founder",
      description:
        "Sindbad Horizon, founder of Adventure Storytelling Media, on why the publication covers two kinds of hard-won stories — the summit and the startup — from Boulder, Colorado.",
    },
    // Verifiable facts only (research-brief §1). Everything else is thesis.
    bio: {
      name: SITE.person,
      role: "Founder, Adventure Storytelling Media",
      location: SITE.location,
    },
    // The opening line + why-ASM-exists thesis — paraphrased and tightened
    // from the operator's own framing (2026-07-27 directive), his idea kept
    // intact: adVENTURE contains venture on purpose.
    opener:
      "I'm Sindbad Horizon. I started Adventure Storytelling Media to tell two kinds of stories I've come to think are actually the same story.",
    narrative: [
      "I've always loved the classic kind of adventure story — the mountain, the expedition, the wild place most people never reach. But somewhere along the way I noticed that a lot of the best adventure stories happening right now aren't on a summit. They're someone starting something. Building something. Taking the risk without knowing yet if it pays off.",
      "The word gives it away before I do: the venture is right there inside adventure. So this publication tells both kinds of hard-won stories — the summit and the startup — because I think they deserve the same kind of attention. Sometimes they're the same story. That's usually when it gets interesting.",
    ] as readonly string[],
    // The two columns, one short paragraph each — the vantage rule.
    columns: [
      {
        heading: "Adventure Stories",
        body: "I go to the place and tell the story of arriving — the discoverer's vantage. Expeditions, wild places, the shot that only exists because someone got there first.",
      },
      {
        heading: "Venture Stories",
        body: "I go behind the scenes with the people building the thing — founders, teams, the unglamorous middle of starting something. Not arrival. The work of getting there.",
      },
    ] as readonly { heading: string; body: string }[],
    // The honesty framing, now introducing real proof points instead of
    // standing alone as an abstract statement.
    legendLine: "None of it is borrowed. Every relationship below is real, stated at exactly what it is:",
    // Real, site-verified proof points only — rendered via <LegendMark> so
    // each prints its RELATIONSHIP_BY_ID verbatim permittedPhrasing. MEME
    // renders here as a credential line, not a story.
    proof: [
      { relationshipId: "amazing-aerial" },
      { relationshipId: "pitchboulder" },
      { relationshipId: "seriesfest" },
      { relationshipId: "afm" },
      { relationshipId: "pebble-beach" },
      { relationshipId: "meme" },
    ] as readonly ProofLine[],
    // THE QUIET SERVICES LINE — the only place services exist on the whole
    // site (ACTION-PLAN.md addendum). No prices, no packages, no service list.
    services: {
      heading: "Working together",
      body: "I also work directly with founders and organizations on positioning and brand films. If that's you, enquiries go through the contact page.",
      link: { label: "Get in touch", href: "/contact" },
    },
  },

  // ---- CONTACT (§1.7) — PUB-B (2026-07-27): rebuilt as PUBLICATION CONTACT
  // per ACTION-PLAN.md. No longer a sales-funnel page — the inert lead form
  // (gated on SITE.formEndpoint, never resolved) is retired in favor of one
  // real email and three honest reasons to use it. The booking link survives
  // only as a small, demoted line (SITE trust logistics still apply to it).
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — every string below is new copy
  // (staging-only until read). Logged in COPY-DECK-B.md.
  contact: {
    meta: {
      title: "Contact — Adventure Storytelling Media",
      description:
        "Story tips, licensing enquiries, or work with the founder directly — one email, one line to book a call.",
    },
    headline: "Have an adventure or venture worth telling?",
    body: "Reach out for story tips, licensing enquiries, or to talk with the founder about brand and positioning work. One inbox, real replies.",
    categories: [
      {
        label: "Story tips",
        body: "Know an adventure or a venture we should be covering? Tell us about it.",
      },
      {
        label: "Licensing",
        body: "Interested in licensing footage or photography from the archive? Say what you need.",
      },
      {
        label: "Work with the founder",
        body: "Sindbad also works directly with founders and organizations on positioning and brand films.",
      },
    ] as readonly { label: string; body: string }[],
    email: SITE.email,
    // The booking link, demoted to a small line beside the email — no longer
    // the page's primary action.
    bookNote: "Prefer to talk it through first?",
    bookLabel: "Book a call",
    // The follow/newsletter stub — PUB-C mounts the capture UI here.
    followHeading: "Follow the stories",
    // Form endpoint, book-a-call, and socials resolve from SITE ([confirm]).
  },

  // ---- VENTURE STORIES (archive-mining integration, 2026-08-01) ------------
  // Full magazine-grade story pages built to the steel-and-dust grammar
  // (src/pages/adventure/steel-and-dust.astro — the exemplar). Copy lives
  // here, same convention as PAGES.adventure.steelDust, so it flows through
  // the same copy-deck read-approval process.
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — every string below is new copy
  // (staging-only until read). Logged in
  // SITE-COPY-DECK-publication-v1.md § "2026-08-01 — archive-mining
  // integration".
  ventureStories: {
    // Build #1 — Pebble Beach Dawn Patrol. Source: _STORY-STAGING/
    // pebble-beach-dawn-patrol/STORY.md (staged copy, written fresh against
    // the 14 selected frames — see that file's own divergence note re: the
    // pre-existing ARTICLE-dawn-patrol.md draft, which this does NOT reuse).
    //
    // HONESTY:
    //  - The only relationship claim renders via LegendMark from
    //    RELATIONSHIPS["pebble-beach"].permittedPhrasing — verbatim.
    //  - WORK["shelby-pebble-beach"].engagement stays "[confirm]" — nothing
    //    here resolves paid-vs-unpaid by implication.
    //  - Every clock time (08:34, 16:26) traces to the shoot's per-car log
    //    (CAR-INDEX.csv), not EXIF (stripped on export at every stage of the
    //    pack) — attributed via `fieldLog.timeNote`, never stated bare.
    //  - The two Ferrari 250 LM cars: race number + the legible UK plate on
    //    No. 7 are visible facts; no chassis number is asserted for either
    //    (the pack's own CAR-INDEX flags even the model ID as tentative).
    //  - The entrant placard's hometown line is partly out of focus in frame
    //    and is not stated here (dropped rather than guessed).
    //  - TESTIMONIALS["pebble-beach-owner"] (Jack & Debbie Bell) is RESERVED
    //    per operator — not quoted on this page.
    dawnPatrol: {
      meta: {
        title: "Dawn Patrol — a Shelby Cobra at Pebble Beach",
        description:
          "Before the crowds, before the judges — a photo essay following a restored 1967 Shelby Cobra 427 S/C, chassis CSX 3042, from the transporter lot to a green ribbon on Pebble Beach's 18th fairway.",
      },
      cover: {
        masthead: "Dawn Patrol",
        credit: "Adventure Storytelling Media",
        issue: "Venture dispatch",
        location: "Pebble Beach, California",
        coords: "36.57° N · 121.97° W",
        storyLabel: "The cover story",
        title: "Dawn Patrol",
        deck: "Before the crowds, before the judges, before the light is even good — the cars arrive in the dark. One Shelby Cobra, chassis CSX 3042, from the transporter lot to a green ribbon on the 18th fairway.",
        teasers: ["Pebble Beach Concours d'Elegance", "A restored 1967 Shelby Cobra 427 S/C", "August 2025"],
        scrollCue: "Scroll for the story",
        plates: [
          { label: "Plate — the hood up", slug: "csx3042-head-on-hood-up" },
          { label: "Plate — race No. 8", slug: "ferrari-250-lm-no8-head-on" },
        ],
      },
      byline: "Words & photographs — Sindbad Horizon",
      slate: "Pebble Beach Concours d'Elegance · August 2025",
      lede: "The cars are already staged by the time the sky starts to lighten. This part belongs to the crew.",
      paragraphs: [
        "Behind the show field, in a fenced lot lined with orange cones, a queue of car-haulers idles nose to tail — a Reliable Carriers rig among them — and the pre-war machines they carried through the night are already parked in rows: a deep maroon coupe, a brass-lamped tourer, a long black sedan wearing a 1930s-style California plate. The horizon still holds a strip of the previous day's orange. The people moving between the cars are mostly crew — checking tires, wiping down paint, watching the clock. The show doesn't open for hours.",
      ],
      afterVideo:
        "A hundred yards on, past a second line of transporters, a tent marked CARS — Classic Automotive Relocation Services holds the International Entrant Pavilion, lit warm against the dawn outside. Inside: a scatter of postwar sedans, a pale blue Cobra parked nose-out, more cars queued at the flap waiting to be walked onto the field proper. Nobody here is posing for anything. It's a staging area doing its job.",
      chapters: {
        before: "Movement one — before light",
        gap: "Movement two — the gap",
        judged: "Movement three — judged",
        field: "Movement four — the field becomes a city",
      },
      beforeLight:
        "On the fairway itself the cars form up in a line before the marshals wave them through — a dark Cobra idling behind a cream-colored sedan flying a pair of small flags, itself behind a black pre-war limousine, the whole queue backlit by a work light. It is, panel for panel, some of the most valuable traffic anywhere in the world, inching forward the same way any traffic does: slowly, with somebody checking a phone.",
      pullQuote:
        "The lawn is not empty. It is, for about an hour, merely uncrowded — the gap between the transporter lot and the crush that's coming.",
      gap: "By the time the sun clears the treeline, three Shelby Cobras have found space on the 18th green, spaced out across grass still dark with dew, the bunkers and Carmel Bay laid out behind them like a golf broadcast.",
      gapDetail:
        "One of them, hood already up, is getting a last look from a small knot of people before the judges arrive: this is CSX 3042, a 1967 Shelby Cobra 427 S/C Roadster, out on loan from its owner.",
      judged:
        "Judging happens in the open, with no rope keeping anyone back. CSX 3042 wears a green class ribbon on its nose, and the small crowd that has gathered around it — blazers, sun hats, one photographer with a case at his feet — is doing the thing car people do at a judged car: standing close, saying little, looking at the details. The engine bay is popped for anyone who wants to see twin carburetors polished past their working purpose. The entrant placard staked in the grass spells out what the judges already know: 1967 Shelby Cobra 427 S/C Roadster, entered by Jack & Debbie Bell — read directly off the card, not guessed.",
      field:
        "By late morning the lawn has filled in completely. A class sign reading L-3 · Postwar Preservation Late marks one judging category among many, a tan and a maroon coupe parked nose to tail in front of it, Stillwater Cove and the coastal hills behind a crowd now several hundred deep. Further along the field, two Ferrari 250 LM competition cars — race numbers 7 and 8, one with a UK plate reading 499FX still bolted to the front, both already wearing their own green ribbons — sit roped off with nothing more than string, close enough that the crowd standing around them is closer than most owners would ever allow at a track.",
      close:
        "By mid-afternoon a line of pre-war classics has formed along the coast road above the rocks: black Packards and their contemporaries, chrome catching the light, a woman in a gold evening dress crossing in front of one of them as though the whole show were a period drama and not a parking lot. This is the other bookend to the empty-ish lot at dawn — the same coastline, the crowd now measured in the hundreds instead of the dozen or so who watched the cars arrive in the dark.",
      captions: {
        beforeA: "The pre-war line forms up, backlit by a work light before the marshals wave it through.",
        beforeB: "A Cobra queued behind a run of pre-war classics, transporters still lined up behind.",
        bleed: "The 18th green, first light. Carmel Bay behind three Shelby Cobras.",
        gapHero: "CSX 3042 gets a last look before the judges arrive.",
        judgedHero: "Judged — the green class ribbon already on the nose.",
        engineDetail: "Twin carburetors, polished past their working purpose.",
        threeQuarter: "CSX 3042, front three-quarter, ribbon on the nose.",
        fieldWide: "By late morning, the lawn is a city.",
        ferrariA: "Ferrari 250 LM, race No. 8 — already ribboned.",
        ferrariB: "Race No. 7 — a UK plate still on the nose.",
        closing: "Mid-afternoon, the pre-war line forms along the coast road.",
        loop: "The dawn-to-midday cut, scored to a cleared library track.",
      },
      fieldLog: {
        heading: "Field log",
        rows: [
          { label: "Chassis", value: "CSX 3042" },
          { label: "Model", value: "1967 Shelby Cobra 427 S/C Roadster" },
          { label: "Entrant", value: "Jack & Debbie Bell" },
          { label: "Judged", value: "08:34" },
          { label: "Coastal line", value: "16:26" },
        ],
        // Rendered as a small footnote under the log — the honesty rail from
        // COLLISION-MAP/INTEGRATION-PLAN §3: times trace to the shoot's own
        // per-car log, not EXIF (stripped on export at every stage of the pack).
        timeNote: "Times per the shoot's own per-car log — EXIF was stripped on export at every stage of this pack.",
      },
      links: {
        shelbyCase: { label: "See the Shelby case study", href: "/work/shelby-pebble-beach" },
        back: { label: "Venture Stories", href: "/venture" },
      },
    },

    // Build #2 — SeriesFest hub. Source: _STORY-STAGING/seriesfest/STORY.md
    // ("The Same Air"), heavily condensed. COLLISION-MAP GATE (2026-08-01):
    // of the miner's 10 staged picks, 4 are pixel-identical to images already
    // live elsewhere on the site and 1 is a near-crop of two more — only 5
    // survive (see scripts/make-seriesfest-hub.mjs header). That collapses
    // this from a 10-image "flagship" into an honestly small hub: a cover +
    // four illustrated links out to the four chapter pages that already carry
    // the real depth. No forced full-bleed — five images across a cover and
    // four chapter cards leaves nothing spare to bleed without repeating one.
    //
    // HONESTY: the only relationship claim renders via LegendMark from
    // RELATIONSHIPS["seriesfest"].permittedPhrasing — verbatim, exactly as
    // the four existing chapter pages already do. Never "a credentialed
    // coverage role" or "at the table where the industry decides" (both
    // explicitly forbidden in consts.ts). Named individuals below are only
    // those already named on the four live chapter pages.
    seriesfestHub: {
      meta: {
        title: "SeriesFest — the same air, 2025–2026",
        description:
          "Four visits to SeriesFest across thirteen months — the 2025 festival, the Soul Power premiere, Fashion in Focus, and Season 12.",
      },
      cover: {
        masthead: "SeriesFest",
        credit: "Adventure Storytelling Media",
        issue: "Venture dispatch",
        location: "Denver, Colorado",
        coords: "39.74° N · 104.99° W",
        storyLabel: "The cover story",
        title: "The Same Air",
        deck: "Two years of showing up at SeriesFest — Denver's home for episodic storytelling — from a red carpet through a fashion runway to the Soirée stage twice over.",
        teasers: ["2025 festival", "Soul Power premiere", "Fashion in Focus", "Season 12"],
        scrollCue: "Scroll for the story",
      },
      byline: "Words & photographs — Sindbad Horizon",
      slate: "SeriesFest · Denver, Colorado · 2025–2026",
      lede: "For a few days each spring, SeriesFest turns Denver into a room where creators, audiences, and industry actually share the same air.",
      intro:
        "We've now sat in that room four times: the full 2025 festival, a February premiere, a March fashion panel, and back for the main event in May 2026. We just kept showing up.",
      close:
        "A counter-thesis kept surfacing across all four visits: as the synthetic proliferates, the value of real human encounters only increases. Four rooms, thirteen months, one relationship that keeps carrying forward — and SeriesFest's programming runs year-round, all the way to Season 13. We'll be back.",
      chapters: [
        {
          no: "01",
          slate: "2025 · The full festival",
          date: "Apr 30 – May 4, 2025",
          title: "The deepest visit.",
          body: "Official-selection screenings, on-stage Q&As, and panels, back to back. There's a saying about SeriesFest — you simply couldn't pull off this kind of intimate, high-access event in New York or LA.",
          imageSlug: "2025-podium-notecard",
          alt: "A moderator speaks from the SeriesFest podium, notecard in hand, before an empty panel row and the Season 11 branded screen.",
          href: "/venture/seriesfest-2025",
          cta: "SeriesFest 2025, in full",
        },
        {
          no: "02",
          slate: "Soul Power · a premiere before the storm",
          date: "Feb 18, 2026",
          title: "Not a nostalgia trip.",
          body: "SeriesFest brought Soul Power: The Legend of the American Basketball Association to the Sie FilmCenter for a screening and Q&A. As moderator Vic Lombardi framed it: this is much deeper than that — it's real.",
          imageSlug: "soulpower-red-carpet-press",
          alt: "The SeriesFest step-and-repeat and red carpet outside the Sie FilmCenter, press photographers already in position ahead of the Soul Power screening.",
          href: "/venture/seriesfest-2026-soul-power",
          cta: "Soul Power premiere, in full",
        },
        {
          no: "03",
          slate: "Fashion in Focus · costume as character",
          date: "Mar 7, 2026",
          title: "A nervous system, before dialogue.",
          body: "A scouting mission to The Cable Center — a runway of more than forty models and costume installations, and a masterclass from Emmy-winning costume designer Molly Rogers.",
          imageSlug: "fashion-runway-floral",
          alt: "A model in a plaid coat walks the runway past a floral arrangement, a big screen behind displaying a night skyline.",
          href: "/venture/seriesfest-2026-fashion-in-focus",
          cta: "Fashion in Focus, in full",
        },
        {
          no: "04",
          slate: "Season 12 · the main event",
          date: "May 6–10, 2026",
          title: "The room fills back up.",
          body: "The first-look screening of The Four Seasons Season 2, the NBC100 drama-writers panel, and the Soirée's inaugural Visionary Award, presented to John J. Sie.",
          imageSlug: "s12-red-carpet-panel",
          alt: "A cast and producing team pose on the SeriesFest red carpet, a branded screen behind them naming the production.",
          href: "/venture/seriesfest-2026",
          cta: "Season 12, in full",
        },
      ],
      coverImageSlug: "fashion-runway-crowd",
      coverAlt: "A model walks the runway at SeriesFest's Fashion in Focus, a full seated audience watching from both sides under the SeriesFest-branded wall.",
      links: {
        // AUDIT-FIX (2026-08-02): /work/seriesfest is retired (redirects to
        // this very hub — see astro.config.mjs), so "More about SeriesFest"
        // would have pointed the page at itself. Repointed to the flat
        // all-stories archive so it stays a genuine "go elsewhere" link
        // instead of a self-loop.
        moreLabel: "The full archive",
        moreHref: "/work",
        back: { label: "Venture Stories", href: "/venture" },
      },
    },
  },
} as const;
