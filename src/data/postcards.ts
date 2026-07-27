/**
 * src/data/postcards.ts — PUB-E (2026-07-27, Directive PUB-E "collections
 * architecture"). The "Postcards" section on /adventure: structured DATA
 * SHAPE + rendering ONLY. This ships with an EMPTY array on purpose — the
 * directive is explicit that no entries may be invented this pass. The page
 * (adventure.astro) renders the Postcards section only when this array is
 * non-empty, so an empty file is a safe, honest no-op: the code path exists,
 * nothing fabricated appears.
 *
 * A postcard is a MICRO story — smaller and lighter than a full Field Notes
 * dispatch (src/content/field-notes/): one title, one short paragraph, 2–3
 * photos, and a date. No territory constellation entry, no dispatch-stream
 * row — just a small card.
 *
 * EXPECTED CANDIDATES (operator-named, not yet filed — see PUB-E directive):
 *   - VYBE / Boogie Lights (the Denver arts/music/dance collective; Boogie
 *     Lights is an ARTIST, not the collective's event — get the official
 *     asset pack from VYBE before any co-branding, per the operator's own
 *     ruling elsewhere in this project)
 *   - Nordic Daughter
 *   - Something Tomorrow (also seen written "Something for Tomorrow" —
 *     confirm the exact name with the operator before filing)
 *   - others TBD from further archive mining
 *
 * Photo convention (once entries exist): each photo's `slug` should resolve
 * an existence-gated export at
 * public/media/adventure/postcards/<postcard-slug>/<photo-slug>-<width>.{avif,webp}
 * — matching the site's other media-existence-gate patterns (see
 * adventure.astro's `festImg` / `galleryMedia` helpers).
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
  /** 2–3 entries. */
  photos: readonly PostcardPhoto[];
};

// Ship empty — see the file header. Do not add an entry without a real
// title/paragraph/photos/date sourced from the operator or the archive.
export const POSTCARDS: readonly Postcard[] = [] as const;
