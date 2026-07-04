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
  formEndpoint: "[confirm]", // live form endpoint — replaces the v1 stub (S9)
  bookACall: "[confirm]", // Calendly/Cal.com URL, or drop the pattern (S10)
  socials: {
    instagram: "[confirm]",
    youtube: "[confirm]",
    tiktok: "[confirm]",
    linkedin: "[confirm]",
  },
} as const;

// ---------------------------------------------------------------------------
// NAV — 6 items, capped (BUILD-PLAN §1.0). Forge the Saga owns the only CTA.
// ---------------------------------------------------------------------------

export const NAV = [
  { label: "Forge the Saga", href: "/forge-the-saga" },
  { label: "Adventure", href: "/adventure" },
  { label: "Entertainment", href: "/entertainment" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
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
    name: "Entertainment",
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
    globeCaption: "Where the stories are told", // LOCKED — see GLOBE below
  },
  anchors: {
    belief: "Your product works. Your story isn't landing.",
    beliefIsntData: "belief isn't data",
    noPressure: "No pitch, no pressure.",
    homeBase: "Boulder is home base. The world is the territory.",
    testing: "find out what works before you spend real money finding out what doesn't.",
  },
  paths: [
    { label: "Forge your saga", href: "/forge-the-saga" },
    { label: "See the adventure work", href: "/adventure" },
    { label: "The network", href: "/entertainment" },
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

export const RELATIONSHIPS: readonly Relationship[] = [
  /** Never: a paid staff role (unless confirmed). */
  {
    id: "meme",
    name: "MEME",
    tier: "official",
    permittedPhrasing:
      "Board Chair, MEME (Makeshift Entertainment Media Education), a Colorado nonprofit",
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
  {
    id: "workshop-coverage",
    name: "Workshop coverage",
    tier: "informal",
    permittedPhrasing: "a couple of early, informal workshop-coverage pieces",
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
  /** "For [org]" — the attribution that keeps every card honest. */
  forOrg: string;
  what: string;
  engagement: "paid engagement" | "unpaid coverage" | "personal / editorial" | "[confirm]";
  relationshipId?: string;
  href?: string;
};

export const WORK: readonly WorkItem[] = [
  {
    slug: "pitchboulder",
    title: "PitchBoulder — coverage, recaps & the commercial",
    pillar: "entertainment",
    forOrg: "PitchBoulder",
    what: "event coverage & recaps, and produced their commercial",
    engagement: "[confirm]",
    relationshipId: "pitchboulder",
    href: "/work/pitchboulder",
  },
  {
    slug: "shelby-pebble-beach",
    title: "A restored Shelby at Pebble Beach",
    pillar: "entertainment",
    forOrg: "[confirm]", // the car owner's name, with permission
    what: "attended with a car owner to cover a restored Shelby",
    engagement: "[confirm]",
    relationshipId: "pebble-beach",
  },
  {
    slug: "alps-expedition",
    title: "[confirm] — Italian Alps expedition selects",
    pillar: "adventure",
    forOrg: "Personal / Editorial",
    what: "expedition photo & film, Italy",
    engagement: "personal / editorial",
    relationshipId: "amazing-aerial",
  },
  {
    slug: "swiss-expedition",
    title: "[confirm] — Switzerland expedition selects",
    pillar: "adventure",
    forOrg: "Personal / Editorial",
    what: "expedition photo & film, Switzerland",
    engagement: "personal / editorial",
    relationshipId: "amazing-aerial",
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
