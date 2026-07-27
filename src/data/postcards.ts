/**
 * src/data/postcards.ts — PUB-E (2026-07-27, Directive PUB-E "collections
 * architecture") shipped this EMPTY on purpose. The POSTCARD pass (same
 * date, publication-v1 branch) files the first two entries below — both
 * verified: **Scandinavian Midsummer Festival, Parfet Park, Golden,
 * Colorado — June 14-16, 2024, the festival's first year in Golden**.
 *
 * A postcard is a MICRO story — smaller and lighter than a full Field Notes
 * dispatch (src/content/field-notes/): one title, one short paragraph, 2–3
 * photos, and a date. No territory constellation entry, no dispatch-stream
 * row — just a small card.
 *
 * Sourcing note on "Market Row" (⚠ see SITE-COPY-DECK-publication-v1.md,
 * "POSTCARD additions" for the full honesty audit): the source clip on disk
 * is a Filmora project titled "Chef Eric Mcbride (Scandinavian Festival
 * Golden 2024).wfp" with no rendered mp4. Its full ~9.5-minute reconstructed
 * timeline (all 26 clips, sampled at their midpoints) was reviewed frame by
 * frame — it is a vendor-market walkthrough (dragon figurines, engraved
 * goblets, jewelry, parasol stalls, the foothills behind Golden); no chef,
 * cooking, or anyone identifiable as "Eric Mcbride" appears anywhere in it.
 * Per the task's binding instruction ("if a clip shows something different
 * from its filename's implication, write what you SEE"), the title and
 * paragraph describe the vendor row that is actually on screen, not the
 * project file's name.
 *
 * STILL-OPEN CANDIDATES (operator-named, not yet filed):
 *   - VYBE / Boogie Lights (the Denver arts/music/dance collective; Boogie
 *     Lights is an ARTIST, not the collective's event — get the official
 *     asset pack from VYBE before any co-branding, per the operator's own
 *     ruling elsewhere in this project)
 *   - Nordic Daughter
 *   - Something Tomorrow (also seen written "Something for Tomorrow" —
 *     confirm the exact name with the operator before filing)
 *   - others TBD from further archive mining
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
  /** One short paragraph — a postcard, not a dispatch. */
  paragraph: string;
  /** `YYYY-MM-DD` or a coarser factual string (e.g. "2024"), read from the source, never invented. */
  date: string;
  /** A short factual place string. */
  location: string;
  /** 2–3 entries. */
  photos: readonly PostcardPhoto[];
};

// ⚠ OPERATOR READ-APPROVAL REQUIRED — both paragraphs are new copy
// (staging-only until read; see SITE-COPY-DECK-publication-v1.md,
// "POSTCARD additions").
export const POSTCARDS: readonly Postcard[] = [
  {
    slug: "valkyrie-dance",
    title: "Valkyrie Dance",
    date: "2024-06-16",
    location: "Parfet Park, Golden, Colorado",
    paragraph:
      "I caught this one on the closing day of the Scandinavian Midsummer Festival's first year in Golden. A dance troupe in flowing black dresses, trailing teal fabric off their arms, worked through a slow, deliberate routine on a plywood stage in Parfet Park. A few of the dancers wore pale, ghost-white face paint. The crowd sat in folding chairs and on blankets right up to the stage edge, tents and Nordic flags at their backs.",
    photos: [
      { slug: "formation", alt: "Dancers in flowing black dresses kneeling and gathered on the wooden stage, Nordic flags hanging behind them and the festival crowd seated on the grass" },
      { slug: "motion", alt: "A dancer in black mid-turn on the stage, teal fabric trailing from her arms as the troupe moves around her" },
      { slug: "closeup", alt: "Dancers in black with pale face paint gathered close together on the stage, one reaching a hand skyward" },
    ],
  },
  {
    slug: "market-row",
    title: "Market Row",
    date: "2024-06-16",
    location: "Parfet Park, Golden, Colorado",
    paragraph:
      "I ducked through the vendor tents at the Scandinavian Midsummer Festival's first year in Golden. Tables were loaded with dragon figurines, engraved goblets, and jewelry trays, parasols hanging from the tent poles, a Danish flag catching the breeze overhead. Shoppers moved slow through the shade while the foothills rose right behind the last row of tents.",
    photos: [
      { slug: "overview", alt: "A wide view over the festival's white vendor tents, a Danish flag flying above the market and the Golden foothills behind" },
      { slug: "stalls", alt: "A vendor stall crowded with medieval-style goblets and drinkware, shoppers browsing under the tent" },
      { slug: "parasols", alt: "A vendor tent hung with patterned parasols, a crowd of festivalgoers browsing the tables beneath them" },
    ],
  },
] as const;
