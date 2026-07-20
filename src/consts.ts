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
 *  4. Voice is first-person solo ("I"), never "we".
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
   * P29 (money-now restructure, 2026-07-20) — sitewide trust/logistics signals,
   * surfaced near CTAs and in the footer.
   * ⚠ OPERATOR-CONFIRM (staging-only until read):
   *  • `drone` reuses the EXISTING repo phrasing from the aerial service blurb
   *    ("Licensed, insured drone work"). "FAA Part 107" is deliberately NOT
   *    claimed — it appears nowhere in confirmed repo copy; if he holds the
   *    cert, he swaps this line to name it.
   *  • `response` is a service promise he has to actually keep — one word from
   *    him confirms or adjusts it.
   *  • `travel` claims international PRODUCTION availability only — never
   *    international flight authority (FAA certs don't transfer abroad).
   */
  trust: {
    drone: "Licensed, insured drone work",
    response: "Replies within one business day",
    base: "Boulder, Colorado (UTC-6)",
    travel: "Available for travel and international productions",
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

// P12.6b — operator direction (2026-07-12): the three credibility lanes read
// as investment terms on their own ("Venture" especially). Appending "Stories"
// disambiguates them as the storytelling lanes they are. Labels ONLY changed;
// hrefs unchanged. (Forge the Saga / About / Contact keep their labels.)
// P29 (money-now restructure, 2026-07-20) — BUYER-LANGUAGE PAIRING: every
// world-name keeps its label but gains a plain buyer term (`buyer`), rendered
// as a small sub-line in the nav/menus and an em-dash pairing in the footer,
// so a producer/CMO decodes each lane within seconds. Labels + hrefs unchanged.
// ⚠ OPERATOR READ-APPROVAL REQUIRED — the buyer sub-labels are new visible copy
// (staging-only until read).
export type NavItem = { label: string; href: string; buyer?: string };
export const NAV: readonly NavItem[] = [
  { label: "Adventure Stories", buyer: "Drone & aerial production", href: "/adventure" },
  { label: "Venture Stories", buyer: "Corporate storytelling & research", href: "/entertainment" },
  { label: "Work Stories", buyer: "Case studies", href: "/work" },
  { label: "Forge the Saga", buyer: "Consulting — research + production", href: "/forge-the-saga" },
  { label: "About", href: "/about" },
  { label: "Contact", buyer: "Book a call", href: "/contact" },
] as const;

export const PRIMARY_CTA = { label: "Forge your saga", href: "/forge-the-saga" } as const;

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
    handoff: "This is the caliber of story I forge for founders.",
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
    href: "/entertainment",
    handoff:
      "The rooms I keep a pulse on are the same rooms your story eventually has to survive.",
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
    headline: "The StorySmith. I forge stories for the wild, the market, and the industry.",
    subline:
      "Sindbad Horizon — Boulder, Colorado. I find the truest version of a story and forge it into something people feel: on the trail, in the boardroom, on set.",
    // P29 buyer-language pairing — one plain line under the hero so a cold
    // buyer decodes the offer in seconds. ⚠ OPERATOR READ-APPROVAL REQUIRED —
    // new visible copy (staging-only until read).
    buyerLine:
      "Drone & aerial production · Corporate storytelling & market research · Boulder, Colorado — working worldwide",
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
    { label: "Corporate storytelling & market research — Venture Stories", href: "/entertainment" },
    { label: "Both, end to end — Forge the Saga", href: "/forge-the-saga" },
  ],
} as const;

// ---------------------------------------------------------------------------
// SAGA_STAGES — ported from v1, voice converted to first-person solo.
// Real productized IP; prices display per OD-4 (exact "from $X").
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
    price: "from $2,500",
    process:
      "Raw market intelligence. I uncover who your audience actually is, the exact language they use, and what your competitors are missing.",
    bestFor: "You have a product but don't yet know who your real buyer is or how to talk to them.",
  },
  {
    no: "02",
    name: "Story Mapping",
    sub: "Messaging Strategy & Positioning",
    deliverable: "Core Narrative Blueprint",
    price: "from $2,500",
    process:
      "I shape raw intelligence into narrative strategy — who the audience is, what arc moves them, and what that looks like as tangible content.",
    bestFor: "You have research but need it shaped into a clear, actionable strategic direction.",
  },
  {
    no: "03",
    name: "Story Forging",
    sub: "Asset Creation & Production",
    deliverable: "Test-Ready Creative Assets",
    price: "from $5,000",
    process:
      "The strategy becomes reality. I build high-quality video or copy assets designed specifically for market validation.",
    bestFor: "You have a solid strategy and need the actual creative assets built and ready for feedback.",
  },
  {
    no: "04",
    name: "Story Testing",
    sub: "A/B Testing & Analytics",
    deliverable: "Live Market Data",
    price: "from $2,000 + audience",
    process:
      "Your assets meet a real audience. I use curated human panels, AI audience simulations, or both to gather targeted data.",
    bestFor: "You want data-backed proof it works before committing budget to distribution or ad spend.",
  },
  {
    no: "05",
    name: "Story Assessing",
    sub: "Iterative Refinement & ROI Reporting",
    deliverable: "Action & Refinement Playbook",
    price: "from $1,500",
    process:
      "I decode the data — what held attention, where people dropped off, what it means, and the exact steps to take next.",
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
// Prices are RESEARCHED 2025-26 US market floors set at roughly the 65th-75th
// percentile ("above the median line, not the most expensive") for a solo,
// experienced operator, shown as "Starts at $X" / "$X / mo". They ship to
// STAGING and the operator adjusts from there.
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
    price: "Starts at $12,000",
    flagship: true,
    blurb:
      "My deepest engagement — the one the whole studio is named for. I take a founder's story from raw market intelligence to a tested Core Narrative Blueprint your team can actually run: the full arc, start to finish. It moves through five stages, and once the spine is set it can carry on as a retainer if there's a reason to keep steering.",
  },
  {
    no: "02",
    klass: "engagement",
    name: "The Standing Forge",
    price: "$4,000 / mo",
    blurb:
      "For companies that need the forge kept lit. A standing monthly engagement for the story work that never really finishes — ongoing video and photo, the next campaign, the content that keeps a brand's voice steady while it grows. One retainer, a predictable rhythm, no re-quoting every shoot.",
  },
  {
    no: "03",
    klass: "deliverable",
    name: "The Story Intensive",
    price: "Starts at $3,000",
    blurb:
      "The fastest way to work with me. A focused session on one thing — your positioning, your pitch, the story your launch has to carry. You bring the problem; I bring the questions, and you leave with sharp, usable language and a direction you can act on. The front door to everything else here.",
  },
  {
    no: "04",
    klass: "deliverable",
    name: "The Brand-Story Film",
    price: "Starts at $6,500",
    blurb:
      "A two-to-four-minute film that tells your story the way it deserves to be told — scripted, shot, and cut by one person who's thought hard about what it needs to say. Founder stories, product films, the piece that anchors your homepage. Pro gear, a real point of view, no committee.",
  },
  {
    no: "05",
    klass: "deliverable",
    name: "Event & Conference Coverage",
    price: "Starts at $2,500",
    blurb:
      "I come cover your event — photo and film — and hand back more than a folder of files. Conferences, pitch nights, summits, workshops: the recap that makes people wish they'd been there, plus clean speaker and session clips you can use the same week. One operator, on my feet all day, reading the room.",
  },
  {
    no: "06",
    klass: "deliverable",
    name: "Aerial Cinematography",
    price: "Starts at $2,000 / day",
    blurb:
      "Licensed, insured drone work for people who care how it reads from the air. Cinematic aerials for films, brands, and the places that are hardest to reach — the same eye I bring to the ground, lifted a few hundred feet.",
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
// ⚠ OPERATOR-CONFIRM pricing (placeholder) — the first two package floors are
// NEW numbers for staging: each is the SUM of the per-stage "from $X" floors
// it bundles (themselves researched staging numbers, above). The Full Saga
// REUSES the existing flagship floor ($12,000 — deliberately under the
// $13.5k stage-sum; a bundle floor, not a new number). All render with honest
// "from $X — scoped per project" framing. He adjusts from staging.
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

/** ⚠ OPERATOR-CONFIRM pricing (placeholder) — starting consultant rate; always
 *  rendered with "scoped per project" framing, never as a fixed quote. */
export const FORGE_CONSULT_RATE = "from $150 / hr";

export const FORGE_PACKAGES: readonly ForgePackage[] = [
  {
    name: "The Scouting Report",
    stageIdx: [0, 1],
    price: "from $5,000", // ⚠ OPERATOR-CONFIRM pricing (placeholder) — sum of stage 01+02 floors
    blurb:
      "The research half on its own: who your audience actually is, the exact language they use, and a Core Narrative Blueprint your team can run without me.",
    bestFor: "You want the market research and the strategy — you have your own production.",
  },
  {
    name: "Forge & Test",
    stageIdx: [2, 3],
    price: "from $7,000", // ⚠ OPERATOR-CONFIRM pricing (placeholder) — sum of stage 03+04 floors
    blurb:
      "The production half with proof attached: I build the assets, then put them in front of a real audience before you spend to distribute them.",
    bestFor: "Your strategy is set — you need the assets built and validated.",
  },
  {
    name: "The Full Saga",
    stageIdx: [0, 1, 2, 3, 4],
    price: "from $12,000", // existing flagship floor, reused — not a new number
    flagship: true,
    blurb:
      "Everything, one consultant: raw market intelligence to a tested, ready-to-run story. I carry the whole arc — the research, the production, and the read on what the data says to do next.",
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
      "I run PitchBoulder's event coverage & recaps, and produced their commercial",
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
  // lifted the "ko law" audit exclusion, so this relationship now names the
  // firm + the four 2026 workshops it covers. Tier stays "informal" — it is
  // early coverage, not an embedded/ongoing engagement. Firm verified from its
  // own site (kofirm.com — a Boulder/Denver business-law firm; Ian Kuliasha,
  // Partner). Renders on /venture/ko-law-workshops, the home proof band, and —
  // as the linked story card — the venture rail on /entertainment.
  {
    id: "workshop-coverage",
    name: "KO Law",
    tier: "informal",
    permittedPhrasing: "KO Law's startup workshop series — coverage of four 2026 sessions",
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
  // Nordic Daughter & Something for Tomorrow — live-music coverage of two bands
  // that share a member (Nordic Daughter: Nordic / folk, a Scandinavian-festival
  // set, Jun 2024; Something for Tomorrow: punk rock, a "Rickhouse" show, Jul
  // 2024). Tier "informal" (early gig work, no pay claim). One combined tile.
  {
    id: "nordic-daughter",
    name: "Nordic Daughter & Something for Tomorrow",
    tier: "informal",
    permittedPhrasing: "live-music coverage for two bands with a shared member",
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
// WORK — cross-lane proof index. Attribution-first cards: "For [org] · [what]".
// `engagement` labels paid vs unpaid honestly (BUILD-PLAN §1.2 F5) — [confirm]
// blocks production until each is resolved with Sindbad.
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
    title: "My top shots with Amazing Aerial",
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
  },
  {
    slug: "vybe",
    title: "Vybe",
    date: "2023–2024",
    relationshipId: "vybe",
    href: "/work/vybe",
  },
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — three new archive tiles (the `title` +
  // `date` strings are new visible copy, staging-only). Tiles-only (no case
  // pages), per operator. One-liners render verbatim from the RELATIONSHIPS
  // above; dates read from the source files, never invented.
  {
    slug: "nordic-daughter",
    title: "Nordic Daughter & Something for Tomorrow",
    date: "2024",
    relationshipId: "nordic-daughter",
  },
  {
    slug: "brazilian-living",
    title: "The Art of Brazilian Living",
    date: "2025",
    relationshipId: "brazilian-living",
  },
  {
    slug: "pnumix",
    title: "PNUMIX — Paranormal Palace",
    date: "2024",
    relationshipId: "pnumix",
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
    meta: {
      title: `${SITE.name} — Drone & Aerial Production, Corporate Storytelling & Market Research | Boulder, CO`,
      description:
        "Sindbad Horizon, the StorySmith — drone & aerial production, corporate storytelling, and market research from Boulder, Colorado. One operator, research to final cut, working worldwide.",
    },
    // H3 — three-pillar scroll tableaux, equal grammatical weight.
    tableaux: [
      {
        terrain: "The wild",
        headline: "The story is usually where it's hardest to reach.",
        body: "I cover expeditions and wild places most cameras never get to — on foot, in the air, in conditions that don't wait for a second take.",
        proof: { relationshipId: "amazing-aerial" },
        link: { label: "See the adventure work", href: "/adventure" },
      },
      {
        terrain: "The market",
        headline: COPY.anchors.belief, // "Your product works. Your story isn't landing."
        body: "Under Forge the Saga, I turn a founder's real advantage into a narrative the market actually feels — and I pressure-test it before you spend to find out.",
        proof: { relationshipId: "pitchboulder" },
        link: { label: "Forge your saga", href: "/forge-the-saga" },
      },
      {
        terrain: "The industry",
        headline: "I keep a pulse on the rooms your story has to survive.",
        body: "I stay close to how the industry moves — the board work, the coverage, the festivals and markets — and I'm honest about exactly how close each relationship is.",
        proof: { relationshipId: "meme" },
        link: { label: "The network", href: "/entertainment" },
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
      body: "Tell me what you're building. If I can help you make it land, I'll tell you how. If I can't, I'll tell you that too.",
      cta: { label: "Book a call", href: "/contact" },
    },
  },

  // ---- FORGE THE SAGA (§1.2) — primary lane, REPACKAGED as services. --------
  // P12.x: was a numbered "secret sauce" process; now it sells the SERVICES you
  // hire a StorySmith for, in two classes (Engagements / Deliverables) drawn
  // from FORGE_SERVICES above. The five-stage method demotes to a names-only
  // strip inside the flagship engagement.
  //
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — hero (kicker/headline/subline), both
  // class taglines, flagshipStrip, and the pricing.body are ALL new copy for
  // staging. whoFor, pretestShelved, proof, pricing.note, and cta are KEPT.
  // P29 (money-now restructure, 2026-07-20): this is now the CONSULTING page.
  // Positioning per operator: he's the odd case who does BOTH production and
  // market research; Forge the Saga is for buyers who want everything. It sells
  // a starting consultant rate + three mock packages cut from the five-stage
  // method. Pure-production offers point out to their own lanes.
  // ⚠ OPERATOR READ-APPROVAL REQUIRED — meta, subline, rateLine, bothHalves,
  // packagesIntro, ongoingIntro, and laneNote are NEW copy (staging-only).
  forge: {
    meta: {
      title: "Forge the Saga — Story Consulting: Market Research + Production, One Operator",
      description:
        "Hire the consultant who does both halves: market research and story strategy, plus the production to prove it on screen. Starting rate, packages built on a five-stage method, and a direct booking link.",
    },
    // F1 — belief hero, pivoted to the StorySmith definition move.
    hero: {
      kicker: "The StorySmith · Story Consulting",
      headline: "A smith forges steel. A StorySmith forges the saga.",
      subline:
        "Most shops sell you production or market research. I'm the odd case who does both — I research what your market actually hears, then produce the story that lands. Forge the Saga is for buyers who want everything: one consultant, research to final cut.",
      // ⚠ OPERATOR-CONFIRM pricing (placeholder) — FORGE_CONSULT_RATE renders
      // beside this framing; always "scoped per project", never a fixed quote.
      rateLine: "Consulting",
      rateNote: "— scoped per project; package floors below.",
      cta: { label: "Book a call", href: SITE.bookACall },
    },
    // F2 — who it's for.
    whoFor: {
      heading: "Who it's for",
      body: "Founders at the edge of a launch, a raise, or a real ad spend — when the story finally has to carry weight, and guessing gets expensive.",
      items: [
        "You're about to launch, and the messaging still isn't sharp.",
        "You're raising, and the pitch has to land in a single meeting.",
        "You're about to spend on ads, and you want to know the story works first.",
      ] as readonly string[],
    },
    // F2b — P29: the both-halves positioning move. The weird-case pitch, plus
    // pointers to the two lanes that now carry their own production pricing.
    bothHalves: {
      heading: "Both halves of the job",
      body: "Production people don't usually do research. Research people don't usually shoot. I do both — which is why the testing stages here run on real footage, not decks. If you only need one half, it has its own page and its own floor:",
      lanes: [
        { label: "Drone & aerial production — Adventure Stories", href: "/adventure" },
        { label: "Corporate storytelling & market research — Venture Stories", href: "/entertainment" },
      ] as readonly Cta[],
    },
    // F3 — P29: the consulting packages (FORGE_PACKAGES) + the ongoing class
    // (Standing Forge + Story Intensive, reused verbatim from FORGE_SERVICES).
    classes: {
      heading: "The packages",
      engagements: {
        label: "Packages",
        tagline: "Three cuts of the five-stage method — pick how much of the arc you want me to carry.",
      },
      deliverables: {
        label: "Ongoing & focused",
        tagline: "When it isn't a one-arc project: a standing retainer, or one sharp session.",
      },
    },
    // F3c — pointer row under the packages: production-only buyers exit to
    // their lane instead of being sold consulting.
    laneNote: {
      heading: "Just need production?",
      body: "Straight production is priced on its own pages — no consulting required.",
    },
    // F3b — the DEMOTED method: the five stage NAMES only (from SAGA_STAGES),
    // shown as a quiet strip inside the flagship engagement. No per-stage
    // prices, no how-to — the arc survives as a shape, not a price list.
    flagshipStrip: {
      label: "How the flagship runs",
      note: "Five stages, one ordered arc — raw research to a tested narrative.",
    },
    // F4 — pretest. LAUNCHES AS VARIANT B (OD-2): no standalone section; the
    // pretest idea already lives honestly inside SAGA_STAGES[3] ("curated human
    // panels, AI audience simulations, or both"). The Variant-A copy is kept
    // here on the shelf, NOT rendered, so it lifts back in without rework if
    // the service proves out. It contains zero mention of any platform.
    pretestShelved: {
      rendered: false,
      heading: "Before your story meets investors, it meets the panel.",
      body: "Echo Panel is an AI investor-pitch pretest tool I built — your pitch gets stress-tested before it costs you a real meeting.",
    },
    // F5 — proof.
    proof: {
      heading: "Proof",
      anchor: { relationshipId: "pitchboulder" } as ProofLine,
      testimonialId: "pitchboulder",
      // Delivered-work cards — services actually delivered for real people,
      // each labeled at exact status (WORK[].engagement, [confirm] until set).
      deliveredWorkSlugs: ["pitchboulder"] as readonly string[],
      note: "No second consulting testimonial at launch. Everything shown is work I actually delivered, labeled paid or unpaid as it truly was.",
    },
    // F6 — pricing. Every package shows its own floor; this is the honest note
    // about what the floors mean. ⚠ OPERATOR READ-APPROVAL REQUIRED — body
    // updated for the packages framing (staging-only); note: KEPT verbatim.
    pricing: {
      heading: "On pricing",
      body: "Every number here is a floor, not a quote — packages are scoped per project, and hourly consulting starts where the rate above says it does. Tell me what you're building and I'll tell you what it actually takes.",
      note: "Every price is a starting point — the shape of the work sets the rest.",
    },
    // F7 — CTA. P29: straight to the booking link (no /contact hop).
    cta: {
      headline: COPY.anchors.noPressure,
      body: "Tell me where the story isn't landing. If Forge the Saga is a fit, we'll map it. If it isn't, I'll say so.",
      cta: { label: "Book a call", href: SITE.bookACall },
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
        "Cinematic drone and aerial production, plus expedition photo & film from the places hardest to reach. Licensed, insured drone work — day rates, samples, and direct booking.",
    },
    hero: {
      eyebrow: "Adventure Stories — Drone & Aerial Production",
      headline: "The wild doesn't do second takes.",
      subline:
        "Expedition and adventure coverage — photo and film — from the places that are hardest to reach.",
    },
    // A1b — HIRE THE OPERATOR: the production-services block, above the
    // gallery and the AA licensing funnel. The day rate is REUSED verbatim
    // from the aerial service floor (FORGE_SERVICES 06) — single-sourced, not
    // a new number. Trust lines come from SITE.trust (see its ⚠ flags).
    hire: {
      kicker: "Production services",
      heading: "Hire the operator",
      body: "Aerial and ground cinematography for productions, brands, tourism, and film — the same eye that shoots these expeditions, on your call sheet. One operator, fast on his feet, gear that travels.",
      priceNote: "— a floor, not a quote; scoped per shoot.",
      cta: { label: "Book a call", href: SITE.bookACall },
    },
    territory: {
      heading: "The territory",
      // Authored positioning (COPY.md §5.1), grounded in the photos on the page:
      // Alps (Italy + Switzerland) + Colorado's Front Range. Widened to cover
      // the Colorado aerials now in the gallery.
      body: "The work so far runs deepest through the Alps — Italy and Switzerland — and across Colorado's Front Range at home, shooting on the ground and from the air.",
    },
    // A3 — Licensed vs Personal nesting (Mark Clennon model).
    licensed: {
      heading: "Licensed",
      body: "The aerial footage that's available to license lives off-site — follow it out to where it's licensed.",
      proof: { relationshipId: "amazing-aerial" } as ProofLine,
    },
    personal: {
      heading: "Personal & editorial",
      body: "The self-driven expedition work — the frames I chase for their own sake.",
    },
    gallery: {
      heading: "The field",
      note: "Real stills replace these slots as footage arrives (BUILD-PLAN.md §5A S2).",
    },
    // AA funnel outro (operator exclusivity handling): the Colorado teaser stills
    // are watermarked previews; the gallery is a referral to the agency that
    // licenses the full collection. Points directly at the operator's AA
    // portfolio search URL (P12.4b) — his contributor listing, not the AA
    // homepage. Copy invites licensing THROUGH Amazing Aerial.
    aaFunnel: {
      heading: "License the full collection",
      body: "The aerial work is represented by Amazing Aerial Agency. The watermarked frames here are previews — see the full, licensable collection on my Amazing Aerial portfolio.",
      cta: {
        label: "See the full collection at Amazing Aerial",
        href: "https://www.amazingaerial.com/search/en/1/0x7B22736561726368626172223A22222C226F726465726D6F6465223A2232222C226F726465726279223A2231222C226D6F6D616E65742D69645F75736572223A22323838227D",
      },
    },
    // A5 — P29: the close now points at PRODUCTION (this lane's own buyer),
    // not at consulting — adventure buyers aren't founders. Calendly direct.
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — new closing line (staging-only).
    handoff: {
      body: "Need this eye on your production? Tell me where and when.",
      cta: { label: "Book a call", href: SITE.bookACall },
    },
  },

  // ---- ENTERTAINMENT (§1.4) — credibility lane, now "VENTURE" (P12.3). ------
  // ⚠ OPERATOR READ-APPROVAL REQUIRED (staging-only until then): the lane was
  // renamed Film & TV → Venture per his 2026-07-08 direction ("the venture in
  // adventure" — business stories). NEW SENTENCES in this block, listed for his
  // verbatim review:
  //   1. meta.title  2. meta.description  3. hero.headline  4. hero.subline
  // Every relationship claim below (MEME/PitchBoulder/rooms) is UNCHANGED.
  // P29 (money-now restructure): now ALSO the corporate-storytelling SALES
  // page (largely market research + story advisory): samples + its own
  // pricing + booking. ⚠ OPERATOR READ-APPROVAL REQUIRED — meta, eyebrow, and
  // the services block are NEW copy (staging-only until read).
  entertainment: {
    meta: {
      title: "Venture Stories — Corporate Storytelling & Market Research",
      description:
        "Corporate storytelling with a research spine: event & conference coverage, brand-story films, and market research that tells you what your audience actually hears. Floors and direct booking.",
    },
    // E1 — the pun IS the headline; the subline makes it land honestly.
    // P29: eyebrow carries the buyer pairing.
    hero: {
      eyebrow: "Venture Stories — Corporate Storytelling & Market Research",
      headline: "The venture in adventure.",
      subline:
        "I tell stories from the wild — and stories of the modern expedition: founders, markets, and the rooms where the industry does business. Board work, real coverage, and the festivals I attend — each stated at exactly what it is.",
    },
    // E1b — HIRE THIS LANE: the corporate-storytelling services + floors.
    // Prices are REUSED verbatim from existing staged floors — Event coverage
    // + Brand-Story Film from FORGE_SERVICES (05/04), market research from the
    // Story Scouting stage floor (SAGA_STAGES 01). Single-sourced, no new
    // numbers. Every floor renders with "scoped per engagement" framing.
    services: {
      kicker: "Corporate storytelling — services & floors",
      heading: "Hire this lane",
      intro:
        "Coverage, films, and research for companies that need their story to work — built by one operator who also tests what the market actually hears.",
      items: [
        {
          name: "Event & Conference Coverage",
          serviceNo: "05", // price pulled verbatim from FORGE_SERVICES
          line: "Photo + film coverage of your conference, summit, or pitch night — recap plus same-week clips.",
        },
        {
          name: "The Brand-Story Film",
          serviceNo: "04",
          line: "A two-to-four-minute film that anchors your homepage — scripted, shot, and cut by one person.",
        },
        {
          name: "Market Research & Story Testing",
          stageIdx: 0, // price pulled verbatim from SAGA_STAGES 01
          line: "Who your audience actually is, the language they use, and what your competitors are missing.",
        },
      ] as readonly { name: string; line: string; serviceNo?: string; stageIdx?: number }[],
      note: "Floors, not quotes — every engagement is scoped to the room.",
      cta: { label: "Book a call", href: SITE.bookACall },
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
    // E5 — soft handoff. P29: this lane closes on its OWN buyer action
    // (Calendly direct), not a consulting handoff.
    handoff: {
      body: PILLARS.find((p) => p.id === "entertainment")!.handoff,
      cta: { label: "Book a call", href: SITE.bookACall },
    },
  },

  // ---- WORK (§1.5) — cross-lane proof index + case-study template. ---------
  work: {
    // P29 buyer-language pairing in the meta (⚠ OPERATOR READ-APPROVAL — new
    // title/description copy, staging-only until read).
    meta: {
      title: "Work Stories — Portfolio & Case Studies",
      description:
        "Portfolio and case studies — drone & aerial production, event coverage, and brand films. Each piece attributed and labeled at its true status. No logo walls, no borrowed credit.",
    },
    // ⚠ OPERATOR READ-APPROVAL REQUIRED — strengthened intro copy (staging-only
    // until read). Same honesty backbone (attribution-first, no borrowed
    // credit), sharper voice. Operator note: "the copy of the work field can be
    // a little stronger."
    intro: {
      heading: "The work, on the record.",
      body: "Every piece here I actually shot, cut, or led — credited to exactly who it was for and marked at its true status. No logo walls, no borrowed credit, nothing I can't stand behind.",
    },
    // Case-study copy (Immersive-Garden walkthrough). PitchBoulder ships first
    // and sets the template. Facts I can't verify are [confirm] (asset S3);
    // outcome carries NO invented metric.
    caseStudies: {
      pitchboulder: {
        meta: {
          title: "PitchBoulder — coverage, recaps & a commercial",
          description:
            "How I run PitchBoulder's event coverage and recaps, and produced their commercial.",
        },
        hook: "The work I do for PitchBoulder, start to finish.",
        context: {
          heading: "Who they are",
          body: "PitchBoulder is a weekly founder pitch event in Boulder, Colorado — founders on stage, investors and operators in the room, and the sharpest questions in town. Peter Rothschild founded it. I've been in that room for nearly three years, across dozens of weekly pitch events, watching the gap between what a founder says and what the room actually hears.",
        },
        ask: {
          heading: "The ask",
          body: "When PitchBoulder built their website, they needed one video that could stand for three years of weekly founder energy — something an investor or a founder could watch and instantly understand what the room feels like.",
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
          body: "I shot the Cobra on the lawn, then shaped the footage into a narrative built on emotion and craftsmanship — what the car means, not just what it is.",
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

  // ---- ABOUT (§1.6) — single-arc StorySmith narrative, first person. -------
  about: {
    meta: {
      title: "About — Sindbad Horizon, the StorySmith",
      description:
        "One craft — storytelling — told across the wild, the market, and the industry. Boulder is home base; the world is the territory.",
    },
    // Verifiable facts only (research-brief §1). Everything else is thesis.
    bio: {
      name: SITE.person,
      persona: SITE.persona,
      location: SITE.location,
    },
    narrative: [
      "I'm Sindbad Horizon. People call me the StorySmith. I find the truest version of a story and forge it into something people feel.",
      "I've learned to do that in three kinds of terrain. In the wild, the story is a place most cameras never reach. In the market, it's a founder's real advantage, buried under the wrong words. In the industry, it's a set of relationships — and the honesty to name each one for what it is.",
      "They look like three different jobs. They're one craft. The same instinct that reads the line of a ridge reads the line of an argument.",
      COPY.anchors.homeBase, // "Boulder is home base. The world is the territory."
    ] as readonly string[],
    // The legend device turned into a trust statement (§1.6 close).
    legendLine:
      "And because trust is the whole point, I mark every relationship on this site at exactly what it is — official, delivered, informal, or simply a room I was in.",
  },

  // ---- CONTACT (§1.7) — conversion. ----------------------------------------
  contact: {
    // P29 buyer pairing (⚠ OPERATOR READ-APPROVAL — new title, staging-only).
    meta: {
      title: "Contact — Book a Call",
      description:
        "Tell me what you're building. No pitch, no pressure — book a call or send a note.",
    },
    headline: COPY.anchors.noPressure,
    body: "Tell me what you're building. If Forge the Saga is a fit, we'll talk. If it isn't, I'll point you somewhere better.",
    email: SITE.email,
    // Form endpoint, book-a-call, and socials resolve from SITE ([confirm]).
  },
} as const;
