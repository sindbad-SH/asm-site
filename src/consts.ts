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
    // No relationshipId: this is personal/editorial work, not a licensed
    // Amazing Aerial credit — attaching that relationship here would overstate
    // it (the Ledger's "amazing-aerial" phrasing is specifically a LICENSING
    // claim, not a blanket credit on all adventure footage). The Adventure
    // page's Licensed section carries that proof line on its own.
    slug: "alps-expedition",
    title: "[confirm] — Italian Alps expedition selects",
    pillar: "adventure",
    forOrg: "Personal / Editorial",
    what: "expedition photo & film, Italy",
    engagement: "personal / editorial",
  },
  {
    slug: "swiss-expedition",
    title: "[confirm] — Switzerland expedition selects",
    pillar: "adventure",
    forOrg: "Personal / Editorial",
    what: "expedition photo & film, Switzerland",
    engagement: "personal / editorial",
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
    quote: "[confirm]",
    attribution: "[confirm]",
    relationshipId: "pitchboulder",
    context: "The primary proof anchor.",
  },
  {
    // A coverage endorsement from the car owner — NOT from Pebble Beach.
    // The Ledger forbids attributing anything to the event itself.
    id: "pebble-beach-owner",
    quote: "[confirm]",
    attribution: "[confirm]",
    relationshipId: "pebble-beach",
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

export const PAGES = {
  // ---- HOME (§1.1). Hero + paths live in COPY; sections below follow. ------
  home: {
    meta: {
      title: `${SITE.name} — ${SITE.persona}`,
      description:
        "Sindbad Horizon, the StorySmith — one craft, told across the wild, the market, and the industry. Narrative strategy for founders under Forge the Saga.",
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
    // H4 — proof band. Replaces the v1 flat marquee with honest tiering.
    proof: {
      heading: "The honest version of the network.",
      intro:
        "Every relationship here is marked at exactly what it is — official, delivered, informal, or simply a room I was in. No logo wall, no borrowed credit.",
      anchor: { relationshipId: "pitchboulder" } as ProofLine,
      testimonialId: "pitchboulder",
      // Order = descending honesty weight; each renders with its legend symbol.
      tiered: [
        "meme",
        "amazing-aerial",
        "pitchboulder",
        "workshop-coverage",
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

  // ---- FORGE THE SAGA (§1.2) — primary lane, belief-first. ------------------
  forge: {
    meta: {
      title: "Forge the Saga — narrative strategy for founders",
      description:
        "A five-stage method for founders: from raw market research to a tested Core Narrative Blueprint. Your product works — let's make the story land.",
    },
    // F1 — belief hero.
    hero: {
      headline: COPY.anchors.belief,
      subline:
        "Forge the Saga is my five-stage method for founders — from raw market research to a tested Core Narrative Blueprint your team can actually run.",
      cta: { label: "Book a call", href: "/contact" },
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
    // F3 — the five stages. Presentation maps SAGA_STAGES directly.
    stages: {
      heading: "The five stages",
      body: "One ordered arc, cold research to tested narrative. Stage 02 delivers the Core Narrative Blueprint — the spine everything else is built on.",
      anchor: COPY.anchors.beliefIsntData, // used at the Story Testing stage
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
    // F6 — pricing (OD-4: exact "from $X"). Per-stage prices from SAGA_STAGES.
    pricing: {
      heading: "Pricing",
      body: "Engagements start at $2,500 for a single stage. Most run between $2,500 and $12,500, depending on how far you take the arc.",
      note: "Every price is a starting point — the shape of the work sets the rest.",
    },
    // F7 — CTA.
    cta: {
      headline: COPY.anchors.noPressure,
      body: "Tell me where the story isn't landing. If Forge the Saga is a fit, we'll map it. If it isn't, I'll say so.",
      cta: { label: "Book a call", href: "/contact" },
    },
  },

  // ---- ADVENTURE (§1.3) — credibility lane, the wild. ----------------------
  adventure: {
    meta: {
      title: "Adventure — the wild",
      description:
        "Expedition and adventure coverage, photo and film, from the places hardest to reach.",
    },
    hero: {
      headline: "The wild doesn't do second takes.",
      subline:
        "Expedition and adventure coverage — photo and film — from the places that are hardest to reach.",
    },
    territory: {
      heading: "The territory",
      // Honest current footprint: Italy & Switzerland only. "So far" signals
      // growth without claiming more.
      body: "So far the work has taken me deepest through the Alps — Italy and Switzerland — shooting on the ground and from the air.",
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
    // A5 — soft handoff toward consulting.
    handoff: {
      body: PILLARS.find((p) => p.id === "adventure")!.handoff,
      cta: PRIMARY_CTA,
    },
  },

  // ---- ENTERTAINMENT (§1.4) — credibility lane, the industry. --------------
  entertainment: {
    meta: {
      title: "Entertainment — the industry",
      description:
        "A pulse on the industry — board work, real coverage, and the festivals and markets I attend, each stated at exactly what it is.",
    },
    // E1 — restrained hero; no "at the table where the industry decides" claim.
    hero: {
      headline: "I keep a pulse on the industry.",
      subline:
        "Board work, real coverage, and the festivals and markets I attend — here's exactly what each one is.",
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
    rooms: {
      heading: "The rooms",
      intro: "The rest is honest about itself.",
      items: [
        {
          // context carries the same framing as TESTIMONIALS["pebble-beach-owner"]
          // — the single LegendMark on this room states it once (Testimonial's
          // own proof line is suppressed via showProof={false} to avoid a
          // back-to-back duplicate; see entertainment.astro E4).
          proof: {
            relationshipId: "pebble-beach",
            context: "A coverage endorsement from the car owner.",
          } as ProofLine,
          testimonialId: "pebble-beach-owner",
        },
        { proof: { relationshipId: "seriesfest" } as ProofLine },
        { proof: { relationshipId: "afm" } as ProofLine },
        { proof: { relationshipId: "workshop-coverage" } as ProofLine },
      ],
    },
    // E5 — soft handoff.
    handoff: {
      body: PILLARS.find((p) => p.id === "entertainment")!.handoff,
      cta: PRIMARY_CTA,
    },
  },

  // ---- WORK (§1.5) — cross-lane proof index + case-study template. ---------
  work: {
    meta: {
      title: "Work",
      description:
        "Everything I've actually done — each piece attributed and labeled at its true status. No logo walls, no borrowed credit.",
    },
    intro: {
      heading: "The field",
      body: "Everything I've actually done, each piece attributed and labeled at its true status. No logo walls, no borrowed credit.",
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
          body: "[confirm]",
        },
        ask: {
          heading: "The ask",
          body: "[confirm]",
        },
        work: {
          heading: "The work",
          proof: { relationshipId: "pitchboulder" } as ProofLine,
          body: "Event coverage and recaps on an ongoing basis, plus a commercial produced end to end.",
        },
        outcome: {
          heading: "The outcome",
          body: "[confirm]", // plain honest statement or one real metric — never invented
        },
        testimonialId: "pitchboulder",
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
    meta: {
      title: "Contact",
      description:
        "Tell me what you're building. No pitch, no pressure — if Forge the Saga is a fit, we'll talk.",
    },
    headline: COPY.anchors.noPressure,
    body: "Tell me what you're building. If Forge the Saga is a fit, we'll talk. If it isn't, I'll point you somewhere better.",
    email: SITE.email,
    // Form endpoint, book-a-call, and socials resolve from SITE ([confirm]).
  },
} as const;
