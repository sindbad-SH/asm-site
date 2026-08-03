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
 * ⚠ 2026-07-31 MERGE (operator direct review of the adventure-page visual
 * upgrade) — "scandinavian-midsummer-festival" (the Valkyrie dance troupe +
 * vendor row) and "nordic-daughter" used to be TWO separate postcards from
 * the SAME festival weekend. Operator: merge them into one — "same festival,
 * one postcard telling both (dancers + band)." The dance-troupe and
 * vendor-row photos/paragraphs fold INTO the surviving "nordic-daughter"
 * postcard (slug + title kept, since that's the destination the operator
 * named); the standalone "scandinavian-midsummer-festival" entry is retired.
 * The `location` field now leads with the festival name so the merged scope
 * (dance stage + market row + Nordic Daughter's set, not just the band) reads
 * clearly on the tile. A structured `related` cross-link was added pointing
 * at "something-for-tomorrow" — Nordic Daughter's guitarist, Jason Lycan,
 * also fronts that band — rendered as a "see that story" link on both
 * postcards' detail pages (not just prose; a real clickable link). Media:
 * the six dance/market export files moved from
 * public/media/adventure/postcards/scandinavian-midsummer-festival/ to
 * .../nordic-daughter/ (scripts/make-postcards.mjs's directory-per-slug
 * convention); the old directory was deleted. No new copy was invented —
 * every sentence below already existed in one of the two pre-merge entries,
 * just reordered so the piece opens on "meeting Nordic Daughter" instead of
 * repeating that beat twice.
 *
 * FOUR entries remain filed this pass (was five before the merge):
 *
 * 1. "nordic-daughter" — MERGED (see above). Verified festival facts carried
 *    over unchanged: Scandinavian Midsummer Festival, Parfet Park, Golden,
 *    Colorado — June 14-16, 2024, the festival's first year in Golden.
 *
 * 2. "something-for-tomorrow" — OPERATOR CORRECTION (2026-07-27, overturning
 *    ADVENTURE-ARCHIVE-MINE.md §4): "Something for Tomorrow" is a REAL band
 *    (web-verified: nordicdaughter.com/bio, "…including his Hard Rock band
 *    Something For Tomorrow"; a jamsphere.com interview, "Jason is practicing
 *    with his other band Something for Tomorrow, two nights a week"). The
 *    archive folder (`Nordic Daughter\Something for tomorrow\`, a Rickhouse
 *    show, Denver, 2024-07-07) was reviewed frame by frame — every raw DJI
 *    master, both edited cuts, and the one phone photo (a band-logo graphic,
 *    not a live shot). ALL stage/performance frames confirm Something for
 *    Tomorrow (the venue screen displays their name throughout; no Nordic
 *    Daughter performance is visible anywhere in this folder).
 *
 *    ⚠ 2026-07-31 FRAMING SWAP (operator direct review, photo pick, not a
 *    fact correction): the "stage-wide" (left) frame was badly framed — the
 *    guitarist pushed to the extreme right edge, partially cropped, the drum
 *    kit dominating an otherwise empty frame. Re-grabbed from the same
 *    Rickhouse edited cut (`Rickhouse 7-7-2024.mp4`, t=38s — same source as
 *    the kept middle/right frames) and manually cropped (not the usual
 *    sharp "attention" auto-crop, which re-produced the same edge-crop
 *    failure): Jason Lycan centered, the venue screen with the band's name
 *    still fully readable above him, the drummer visible in context. The
 *    middle (stage-bassist) and right (stage-hero, green-lit, the frontman)
 *    frames are untouched — operator explicitly said to keep those.
 *
 * 3. "brazilian-living" — Boulder Samba School's outdoor showcase, June 22,
 *    2025. Venue identified as Levitt Pavilion, Ruby Hill Park, Denver
 *    (web-verified: Levitt Pavilion's free concert series is "presented by
 *    Kaiser Permanente" — matches the Kaiser Permanente signage visible
 *    behind the stage in the source footage; matches the bowl-shaped lawn
 *    topology and skyline view on screen). Per the task's binding
 *    instruction, this is NOT captioned as "Colorado Brazil Fest" (that
 *    festival's confirmed 2025 dates, Aug 7–10, don't match this June 22
 *    footage) — only the venue is named, not a festival title.
 *
 * Sourcing note carried over unchanged, on the merged postcard's "Market
 * Row" paragraph (⚠ see SITE-COPY-DECK-publication-v1.md, "POSTCARD
 * additions" / "POSTCARD2 additions" for the full honesty audit): the source
 * clip on disk is a Filmora project titled "Chef Eric Mcbride (Scandinavian
 * Festival Golden 2024).wfp" with no rendered mp4. Its full ~9.5-minute
 * reconstructed timeline (all 26 clips, sampled at their midpoints) was
 * reviewed frame by frame — it is a vendor-market walkthrough (dragon
 * figurines, engraved goblets, jewelry, parasol stalls, the foothills behind
 * Golden); no chef, cooking, or anyone identifiable as "Eric Mcbride" appears
 * anywhere in it. The paragraph describes the vendor row that is actually on
 * screen, not the project file's name.
 *
 * STILL-OPEN CANDIDATE: none — Vybe (formerly listed here as an open
 * candidate) got its own full /adventure section + rich page instead of a
 * postcard, per the operator's 2026-07-31 direction (see adventure.astro's
 * VYBE section and src/pages/adventure/vybe.astro).
 *
 * ⚠ 2026-08-02 REFRAME (operator direct review) — "The photos are pretty
 * much of the whole festival and not just of Nordic Daughter. I thought the
 * whole point is we were going to make the piece largely focusing on the
 * Scandinavian mid-December festival and then FEATURING Nordic Daughter —
 * but the header is Nordic Daughter." (The festival is actually mid-JUNE,
 * per the verified date below — "mid-December" appears to be a slip in the
 * verbal note; the June 14-16, 2024 date is unchanged and still correct.)
 * The 07-31 merge already made the PARAGRAPHS festival-first (dance stage +
 * vendor row + Nordic Daughter's set, in that order); what still read as
 * band-only was the `title` — the single biggest thing on the page (the
 * PostcardCover H1) — which stayed "Nordic Daughter" through the merge. No
 * photos were pulled or swapped (they were already correct: 4 dance-troupe +
 * 2 vendor-row + 2 Nordic-Daughter-performing, i.e. genuinely festival-wide
 * with the band as one part) — only `title` and `location` changed below, so
 * the header now matches what the piece and its photos have actually always
 * been. Old: title "Nordic Daughter", location led with the festival name
 * but still read like Nordic Daughter's own tour-stop postcard. New: title
 * "The Scandinavian Midsummer Festival" (the festival is the subject),
 * location now names the venue plus "featuring Nordic Daughter" (the
 * verified fact that's still true and still worth surfacing high). Every
 * paragraph, the pull-quote, the photo set, and the `related` cross-link to
 * Something for Tomorrow are unchanged — all already festival-first / already
 * true.
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
  /**
   * Optional display scale for the detail-page gallery (2026-08-01,
   * VYBE-quality critic-fix round — see SITE-COPY-DECK-publication-v1.md).
   * "hero" = a full-width feature cell (face-forward, >=560px rendered);
   * "bleed" = a full-width 2:1 wide cell (a single establishing/wow shot);
   * omitted (default) = the standard ~300px grid cell. Postcards that don't
   * set this keep the original uniform-grid behavior untouched.
   */
  scale?: "hero" | "bleed";
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
  /** A short factual place string — leads with the event name when the postcard covers a named festival. */
  location: string;
  /** 2–8 entries — a small gallery on the detail page, first 3 also tile the /adventure card. */
  photos: readonly PostcardPhoto[];
  /**
   * Optional cross-link to another postcard that shares a real, verifiable
   * connection (e.g. a shared band member) — 2026-07-31, structured so the
   * link is a real clickable CTA on the detail page, not just a prose
   * mention. Never invented; only added where the connecting fact is already
   * stated in this postcard's own paragraphs.
   */
  related?: { slug: string; label: string };
  /**
   * Optional pull-line for the detail page (2026-07-31, "lightly editorial —
   * a pull-line or two, not a full spread"). Always a sentence LIFTED
   * verbatim from `paragraphs` below, never new copy — the detail page
   * renders it as a large-type callout, the paragraph itself is unchanged.
   */
  pullQuote?: string;
};

// ⚠ OPERATOR READ-APPROVAL REQUIRED — all paragraphs below are new or
// restructured copy (staging-only until read; see
// SITE-COPY-DECK-publication-v1.md, "POSTCARD additions" / "POSTCARD2
// additions" / "2026-07-31 adventure-page visual upgrade").
export const POSTCARDS: readonly Postcard[] = [
  {
    slug: "nordic-daughter",
    title: "The Scandinavian Midsummer Festival",
    date: "2024-06-16",
    location: "Parfet Park, Golden, Colorado — featuring Nordic Daughter",
    paragraphs: [
      "I spent the closing day of the Scandinavian Midsummer Festival's first year in Golden wandering Parfet Park with a camera — a dance stage on one side of the grounds, a row of vendor tents on the other, and Nordic Daughter playing a set under one of the festival tents that same weekend. That's how I first met them.",
      "On the dance stage, a troupe in flowing black dresses, trailing teal fabric off their arms, worked through a slow, deliberate routine on the plywood boards. A few of the dancers wore pale, ghost-white face paint. The crowd sat in folding chairs and on blankets right up to the stage edge, tents and Nordic flags at their backs.",
      "Through the vendor tents, tables were loaded with dragon figurines, engraved goblets, and jewelry trays, parasols hanging from the tent poles, a Danish flag catching the breeze overhead. Shoppers moved slow through the shade while the foothills rose right behind the last row of tents.",
      "Nordic Daughter's full band took the plywood stage under a different tent — Nordic flags hung behind them, canvas overhead, the crowd seated right up to the edge. Guitarist Jason Lycan led out front; I'd shoot him again a few weeks later fronting his other band, Something for Tomorrow, at a show across town.",
      "From the crowd it read as one continuous set — violin and vocals trading the melody, the drummer and keyboardist filling in behind, the whole tent full for it.",
    ],
    photos: [
      { slug: "festival-set", alt: "Nordic Daughter performing under the festival tent at the Scandinavian Midsummer Festival — the singer with arms raised, the drummer and guitarist beside her, Nordic flags overhead" },
      { slug: "formation", alt: "Dancers in flowing black dresses kneeling and gathered on the wooden stage, Nordic flags hanging behind them and the festival crowd seated on the grass" },
      { slug: "motion", alt: "A dancer in black mid-turn on the stage, teal fabric trailing from her arms as the troupe moves around her" },
      { slug: "closeup", alt: "Dancers in black with pale face paint gathered close together on the stage, one reaching a hand skyward" },
      { slug: "overview", alt: "A wide view over the festival's white vendor tents, a Danish flag flying above the market and the Golden foothills behind" },
      { slug: "stalls", alt: "A vendor stall crowded with medieval-style goblets and drinkware, shoppers browsing under the tent" },
      { slug: "parasols", alt: "A vendor tent hung with patterned parasols, a crowd of festivalgoers browsing the tables beneath them" },
      { slug: "festival-strings", alt: "Nordic Daughter's violinist and keyboardist performing on the festival stage, the festival grounds and Nordic flags visible behind them" },
    ],
    related: { slug: "something-for-tomorrow", label: "Jason Lycan's other band, Something for Tomorrow — see that story" },
    pullQuote: "From the crowd it read as one continuous set — violin and vocals trading the melody, the drummer and keyboardist filling in behind, the whole tent full for it.",
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
      { slug: "stage-wide", alt: "Something for Tomorrow's Jason Lycan singing and playing guitar at The Rickhouse, the venue's screen displaying the band's name above the stage, the drummer visible behind him" },
      { slug: "stage-bassist", alt: "The bassist and lead guitarist of Something for Tomorrow performing side by side at The Rickhouse under blue stage light, a small crowd watching from the floor" },
      { slug: "stage-hero", alt: "The Something for Tomorrow guitarist mid-song under green stage light, arm raised, the band's name lit up on the screen behind him" },
    ],
    related: { slug: "nordic-daughter", label: "Jason Lycan's other band, Nordic Daughter — see that story" },
    pullQuote: "The room ran blue, then red, then green as the set went on.",
  },
  {
    // 2026-07-31 (Brazil-photo-scout expansion, operator note (d) — "no
    // clear version of any of the performers' faces" + "expanding the number
    // of photos is important"): the old 5-photo set was mined from just 4 of
    // ~20 available clips in the source archive; a fresh pass through the
    // full ~2-hour, multi-camera shoot replaces 3 weak picks and adds 6 new
    // ones (11 total; see _BRAZIL-PHOTOS-V2/_NOTES.md for full sourcing).
    // `dancer-motion`'s headdress is GREEN in the new frame (was described
    // as blue below, matching the old photo) — copy corrected to match.
    // One candidate frame from the scout's shortlist (`singer-closing`, a
    // second vocalist) was held back here rather than shipped: her identity/
    // act is unconfirmed against this show, and her costume is markedly more
    // skin-forward than the rest of the set — both flagged by the scout for
    // operator read before going live, so left out pending that read rather
    // than decided unilaterally.
    //
    // ⚠ 2026-08-01 V3 REPLACEMENT (VYBE-quality critic-fix round, finding
    // #4 — "the one large image shows the back of a singer's head; the rest
    // render at ~182x228px, under half the exemplar's smallest image"):
    // reopened all 11 V2 images pixel-by-pixel. `aline-stage` (the only
    // large image, 560x700 display) is NOT a clear face — a side-lit
    // profile with hair across the face. Dropped as cover/hero. A fresh pass
    // over previously-unmined clips found `JJ Footage/JJ Samba dancers 2.mp4`
    // @ 246.0s — six dancers lined up, three (orange/green/blue) fully
    // camera-facing and smiling in one frame, nothing else in ~2 hours of
    // footage matches it. Baked two ways: `dancers-rainbow-trio` (tight crop
    // on the three clear faces, now the cover) and `dancers-rainbow-lineup`
    // (full six-dancer 2:1 wide crop, a new bleed cell). `vendor-tent`,
    // `venue-wide`, and `community-dance` (no performers in frame) dropped
    // per the brief; `aline-stage` superseded by `aline-band` +
    // `dancers-rainbow-trio`, which between them give two much clearer
    // faces. The `pc-gallery` template on /postcards/[slug].astro was also
    // reworked (uniform 182px grid → hero/bleed/mid scale tiers via the new
    // `PostcardPhoto.scale` field) so this pool actually renders at the size
    // it was shot for. Count: 9 photos (was 11) — fewer but every one is
    // performer-forward and the cover is now unambiguously face-clear. Full
    // sourcing: `_BRAZIL-PHOTOS-V3/_NOTES.md`.
    slug: "brazilian-living",
    title: "The Art of Brazilian Living",
    date: "2025-06-22",
    location: "Levitt Pavilion, Ruby Hill Park, Denver, Colorado",
    paragraphs: [
      "This is Boulder Samba School's outdoor showcase from June 22, 2025, at Levitt Pavilion in Denver's Ruby Hill Park — a bowl-shaped lawn amphitheater with the city skyline behind the stage. I got there early enough to walk the grounds: a food truck, a jewelry tent, the hillside filling in with picnic blankets under a clear sky.",
      "On stage, a singer in a sequined green dress worked the mic in front of a full percussion line — congas, surdos, a drum kit — a Brazilian flag hanging off the scaffolding beside her. Boulder Samba School's own drum line anchored it, their blue shirts stamped with the group's name over a Colorado-flag-style patch.",
      "Dancers came out one act after another in full feathered headdresses — orange, blue, yellow, red, and gold — working the front of the stage together. A solo dancer, in a green feathered piece, had the space to herself, mid-stride, all motion.",
      "Later, a big circle formed on the pavement in front of a smaller stage — kids and adults both, working through steps together while a Brazilian flag flew from the barrier.",
    ],
    photos: [
      { slug: "dancers-rainbow-trio", alt: "Three Boulder Samba School dancers in orange, green, and blue feathered headdresses, all smiling and facing the camera mid-song, the percussion band behind them" },
      { slug: "aline-band", alt: "A singer in a green dress performing in front of the full percussion band, a Brazilian flag and the venue's sponsor signage behind her", scale: "hero" },
      { slug: "dancer-motion", alt: "A dancer in a green feathered headdress mid-dance, smiling, fully in frame on the stage apron", scale: "hero" },
      { slug: "dancers-rainbow-lineup", alt: "All six Boulder Samba School dancers lined up on stage in purple, red, orange, green, blue, and gold feathered headdresses, a wide establishing view of the full line", scale: "bleed" },
      { slug: "dancers-headdress", alt: "Four dancers in orange, blue, yellow, and red feathered headdresses on stage, the center dancer in blue smiling directly at the camera" },
      { slug: "dancers-ensemble", alt: "Two dancers in gold dresses and yellow and orange feathered headdresses dancing together on stage" },
      { slug: "percussion-line", alt: "Boulder Samba School's full percussion line on stage, their shirts reading the group's name over a Colorado-flag-style patch" },
      { slug: "percussion-detail", alt: "Boulder Samba School percussionists in matching blue shirts playing congas and surdos, several faces visible and smiling" },
      { slug: "chorus-finale", alt: "A line of dancers and singers in red, purple, green, and orange performance outfits clapping and dancing together in front of the band" },
    ],
    pullQuote: "A solo dancer, in a green feathered piece, had the space to herself, mid-stride, all motion.",
  },
] as const;
