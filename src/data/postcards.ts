/**
 * src/data/postcards.ts — "Postcards from the Road" v2 (POSTCARD2,
 * 2026-07-27, publication-v1 branch). Restructures the original POSTCARD
 * pass (PUB-E, same date): each postcard is now a CLICKABLE piece with its
 * own detail page (src/pages/postcards/[slug].astro), not just a tile.
 *
 * A postcard is still a MICRO story — smaller and lighter than a full Field
 * Notes dispatch (src/content/field-notes/): a title, a short paragraph or
 * two, a small gallery (2–8 photos), and a date. No territory constellation
 * entry, no dispatch-stream row.
 *
 * FOUR entries filed this pass:
 *
 * 1. "scandinavian-midsummer-festival" — MERGES the original two entries
 *    (Valkyrie Dance + Market Row) into one piece, per the operator's
 *    restructure directive. Both original paragraphs survive verbatim as
 *    this piece's two "moment" paragraphs; a new intro paragraph and a
 *    closing line about meeting Nordic Daughter were added. Verified:
 *    Scandinavian Midsummer Festival, Parfet Park, Golden, Colorado —
 *    June 14-16, 2024, the festival's first year in Golden. The "Market
 *    Row" honesty note carries forward unchanged (see below).
 *
 * 2. "nordic-daughter" and 3. "something-for-tomorrow" — OPERATOR
 *    CORRECTION (2026-07-27, overturning ADVENTURE-ARCHIVE-MINE.md §4):
 *    "Something for Tomorrow" is a REAL band — Nordic Daughter guitarist
 *    Jason Lycan's hard-rock side project (web-verified: nordicdaughter.com
 *    /bio, "…including his Hard Rock band Something For Tomorrow"; a
 *    jamsphere.com interview, "Jason is practicing with his other band
 *    Something for Tomorrow, two nights a week"). The archive folder
 *    (`Nordic Daughter\Something for tomorrow\`, a Rickhouse show, Denver,
 *    2024-07-07) was reviewed frame by frame — every raw DJI master, both
 *    edited cuts, and the one phone photo (a band-logo graphic, not a live
 *    shot). ALL stage/performance frames confirm Something for Tomorrow (the
 *    venue screen displays their name throughout; no Nordic Daughter
 *    performance is visible anywhere in this folder).
 *
 *    ⚠ SECOND CORRECTION (2026-07-31, operator direct review): the pass above
 *    shipped Nordic Daughter's postcard with Rickhouse audience/crowd frames
 *    (from the Something for Tomorrow shoot) — technically honest captions,
 *    but the operator caught the deeper problem: "For Nordic Daughter you
 *    used shots from their Something for Tomorrow set. I filmed Nordic
 *    Daughter at the Scandinavian Midsummer Festival — any shots will be
 *    from that." Nordic Daughter was never on the Rickhouse stage at all
 *    (that was Something for Tomorrow, a different band that happens to
 *    share a guitarist) — the operator's own footage of Nordic Daughter
 *    performing is at the Scandinavian Midsummer Festival, Parfet Park,
 *    Golden, CO, June 2024 (`Nordic Daughter\Scandinavian Festivle\Nordic
 *    Daughter Scandi Fest Part 1/2/3.mp4` — 4K/60fps edited masters, titled
 *    after the band; that same source already supplied the
 *    scandinavian-midsummer-festival postcard's "nd-set" frame). Re-sourced
 *    (scripts/fix-nordic-daughter-postcard.mjs) to two new, distinct
 *    festival-stage frames of the band performing under the tent — the old
 *    Rickhouse crowd-floor/crowd-side files were deleted, not just replaced.
 *    Something for Tomorrow's postcard is untouched (its stage footage was
 *    already correctly sourced from its own Rickhouse show).
 *
 * 4. "brazilian-living" — Boulder Samba School's outdoor showcase, June 22,
 *    2025. Venue identified as Levitt Pavilion, Ruby Hill Park, Denver
 *    (web-verified: Levitt Pavilion's free concert series is "presented by
 *    Kaiser Permanente" — matches the Kaiser Permanente signage visible
 *    behind the stage in the source footage; matches the bowl-shaped lawn
 *    topology and skyline view on screen). Per the task's binding
 *    instruction, this is NOT captioned as "Colorado Brazil Fest" (that
 *    festival's confirmed 2025 dates, Aug 7–10, don't match this June 22
 *    footage) — only the venue is named, not a festival title.
 *
 * Sourcing note carried over unchanged from the original pass, on "Market
 * Row" (⚠ see SITE-COPY-DECK-publication-v1.md, "POSTCARD additions" /
 * "POSTCARD2 additions" for the full honesty audit): the source clip on disk
 * is a Filmora project titled "Chef Eric Mcbride (Scandinavian Festival
 * Golden 2024).wfp" with no rendered mp4. Its full ~9.5-minute reconstructed
 * timeline (all 26 clips, sampled at their midpoints) was reviewed frame by
 * frame — it is a vendor-market walkthrough (dragon figurines, engraved
 * goblets, jewelry, parasol stalls, the foothills behind Golden); no chef,
 * cooking, or anyone identifiable as "Eric Mcbride" appears anywhere in it.
 * The paragraph describes the vendor row that is actually on screen, not the
 * project file's name.
 *
 * STILL-OPEN CANDIDATE (operator-named, not yet filed):
 *   - VYBE / Boogie Lights (the Denver arts/music/dance collective; Boogie
 *     Lights is an ARTIST, not the collective's event — get the official
 *     asset pack from VYBE before any co-branding, per the operator's own
 *     ruling elsewhere in this project)
 *
 * Photo convention: each photo's `slug` resolves an existence-gated export
 * at public/media/adventure/postcards/<postcard-slug>/<photo-slug>-<width>.{avif,webp}
 * (baked by scripts/make-postcards.mjs) — matching the site's other
 * media-existence-gate patterns (see adventure.astro's `festImg` /
 * `galleryMedia` helpers).
 */

export type PostcardPhoto = {
  slug: string;
  alt: string;
};

export type Postcard = {
  slug: string;
  title: string;
  /**
   * One to a few short paragraphs — a postcard, not a dispatch. The FIRST
   * paragraph is also the tile teaser on /adventure (each postcard is now a
   * clickable piece, POSTCARD2 2026-07-27 — see /postcards/[slug].astro).
   */
  paragraphs: readonly string[];
  /** `YYYY-MM-DD` or a coarser factual string (e.g. "2024"), read from the source, never invented. */
  date: string;
  /** A short factual place string. */
  location: string;
  /** 2–8 entries — a small gallery on the detail page, first 3 also tile the /adventure card. */
  photos: readonly PostcardPhoto[];
};

// ⚠ OPERATOR READ-APPROVAL REQUIRED — all paragraphs below are new or
// restructured copy (staging-only until read; see
// SITE-COPY-DECK-publication-v1.md, "POSTCARD additions" / "POSTCARD2
// additions").
export const POSTCARDS: readonly Postcard[] = [
  {
    slug: "scandinavian-midsummer-festival",
    title: "Scandinavian Midsummer Festival",
    date: "2024-06-16",
    location: "Parfet Park, Golden, Colorado",
    paragraphs: [
      "I spent the closing day of the Scandinavian Midsummer Festival's first year in Golden wandering Parfet Park with a camera — a dance stage on one side of the grounds, a row of vendor tents on the other.",
      "On the stage, a dance troupe in flowing black dresses, trailing teal fabric off their arms, worked through a slow, deliberate routine on the plywood boards. A few of the dancers wore pale, ghost-white face paint. The crowd sat in folding chairs and on blankets right up to the stage edge, tents and Nordic flags at their backs.",
      "Through the vendor tents, tables were loaded with dragon figurines, engraved goblets, and jewelry trays, parasols hanging from the tent poles, a Danish flag catching the breeze overhead. Shoppers moved slow through the shade while the foothills rose right behind the last row of tents.",
      "Nordic Daughter played a set under one of the festival tents that same weekend — that's how I first met them.",
    ],
    photos: [
      { slug: "formation", alt: "Dancers in flowing black dresses kneeling and gathered on the wooden stage, Nordic flags hanging behind them and the festival crowd seated on the grass" },
      { slug: "motion", alt: "A dancer in black mid-turn on the stage, teal fabric trailing from her arms as the troupe moves around her" },
      { slug: "closeup", alt: "Dancers in black with pale face paint gathered close together on the stage, one reaching a hand skyward" },
      { slug: "overview", alt: "A wide view over the festival's white vendor tents, a Danish flag flying above the market and the Golden foothills behind" },
      { slug: "stalls", alt: "A vendor stall crowded with medieval-style goblets and drinkware, shoppers browsing under the tent" },
      { slug: "parasols", alt: "A vendor tent hung with patterned parasols, a crowd of festivalgoers browsing the tables beneath them" },
      { slug: "nd-set", alt: "Nordic Daughter's singer performing under the festival tent, Nordic flags and the festival crowd visible behind the stage" },
    ],
  },
  {
    slug: "nordic-daughter",
    title: "Nordic Daughter",
    date: "2024-06",
    location: "Parfet Park, Golden, Colorado",
    paragraphs: [
      "Nordic Daughter played a set under one of the festival tents at the Scandinavian Midsummer Festival in Golden — the full band on the plywood stage, Nordic flags hung behind them, tent canvas overhead and the crowd seated right up to the edge. Guitarist Jason Lycan led out front; I'd shoot him again a few weeks later fronting his other band, Something for Tomorrow, at a show across town.",
      "From the crowd it read as one continuous set — violin and vocals trading the melody, the drummer and keyboardist filling in behind, the whole tent full for it.",
    ],
    photos: [
      { slug: "festival-set", alt: "Nordic Daughter performing under the festival tent at the Scandinavian Midsummer Festival — the singer with arms raised, the drummer and guitarist beside her, Nordic flags overhead" },
      { slug: "festival-strings", alt: "Nordic Daughter's violinist and keyboardist performing on the festival stage, the festival grounds and Nordic flags visible behind them" },
    ],
  },
  {
    slug: "something-for-tomorrow",
    title: "Something for Tomorrow",
    date: "2024-07-07",
    location: "The Rickhouse, Denver, Colorado",
    paragraphs: [
      "Something for Tomorrow played The Rickhouse in Denver this July night — hard rock, full band, the venue's own screen running the band's name behind the drum riser. Jason Lycan, who also plays guitar in Nordic Daughter, led out front, long hair catching the stage light.",
      "Behind him: a bassist with a grey beard, a second guitarist, a drummer, and a keyboardist working a rig stacked with amps and monitors. The room ran blue, then red, then green as the set went on.",
    ],
    photos: [
      { slug: "stage-wide", alt: "Something for Tomorrow performing at The Rickhouse, the venue's screen displaying the band's name behind the drum kit" },
      { slug: "stage-bassist", alt: "The bassist and lead guitarist of Something for Tomorrow performing side by side at The Rickhouse under blue stage light, a small crowd watching from the floor" },
      { slug: "stage-hero", alt: "The Something for Tomorrow guitarist mid-song under green stage light, arm raised, the band's name lit up on the screen behind him" },
    ],
  },
  {
    slug: "brazilian-living",
    title: "The Art of Brazilian Living",
    date: "2025-06-22",
    location: "Levitt Pavilion, Ruby Hill Park, Denver, Colorado",
    paragraphs: [
      "This is Boulder Samba School's outdoor showcase from June 22, 2025, at Levitt Pavilion in Denver's Ruby Hill Park — a bowl-shaped lawn amphitheater with the city skyline behind the stage. I got there early enough to walk the grounds: a food truck, a jewelry tent, the hillside filling in with picnic blankets under a clear sky.",
      "On stage, a singer in a sequined green dress worked the mic in front of a full percussion line — congas, surdos, a drum kit — a Brazilian flag hanging off the scaffolding beside her.",
      "Three dancers came out in full feathered headdresses — gold, orange, and red — working the front of the stage together. Another dancer, in a shorter blue-feathered piece, had the space to herself, mid-stride, all motion.",
      "Later, a big circle formed on the pavement in front of a smaller stage — kids and adults both, working through steps together while a Brazilian flag flew from the barrier.",
    ],
    photos: [
      { slug: "aline-stage", alt: "A singer in a sequined green dress performing with a full percussion line at Levitt Pavilion, a Brazilian flag hanging beside the stage" },
      { slug: "dancers-headdress", alt: "Three dancers in gold, orange, and red feathered headdresses performing in front of the percussion band" },
      { slug: "dancer-motion", alt: "A dancer in a blue feathered headdress mid-stride on the stage apron" },
      { slug: "venue-wide", alt: "Levitt Pavilion's bowl-shaped lawn packed with picnic blankets, the stage and Denver skyline visible below" },
      { slug: "community-dance", alt: "A large group dancing together on the pavement in front of a smaller stage, a Brazilian flag flying from the barrier" },
    ],
  },
] as const;
