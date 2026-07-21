/**
 * territory.ts — "THE TERRITORY" data (P12.4c).
 *
 * The single source of truth for the clickable location-dots constellation on
 * /adventure (rendered inside the A2 "The territory" section). It answers one
 * honest question with numbers: WHERE has the operator actually shot?
 *
 * Extracted from AA-MEDIA-INVENTORY.md (P12.4a, the proxy-signal inventory of
 * the 2022–2023 Amazing Aerial archive). Each row of that file's
 * "location -> counts" summary table is one dated outing folder named
 * `YYYY-MM-DD - Region - Place`. Here those rows are folded up two ways:
 *
 *   1. by Place  → duplicate places merge into ONE location, and `outings`
 *      counts how many dated shoots hit that place (e.g. Boulder appears on
 *      2022-10-25, 2023-03-22, 2023-04-24, 2023-05-02 → { Boulder, outings: 4 }).
 *   2. by Region → the four top-level groups below.
 *
 * Honesty rules kept from the spec (P12.4c):
 *   - Only dated Photos-folder outings from the summary table are counted. The
 *     drone-only `_DRONE_VIDEO\Social_ready` outings (Denver, Cassina de'
 *     Pecchi, Sona, Torno, the 2023-10-08 Boulder County pass) are NOT counted —
 *     including them would inflate the totals the operator stands behind.
 *   - "Unknown-location" / "No location" buckets are excluded entirely.
 *   - Taos is its own honest "New Mexico" group (one outing), not folded into
 *     Colorado — different state, so it gets its own dot.
 *
 * Totals this file encodes (verified against the inventory):
 *   Colorado    21 outings across 12 locations
 *   Switzerland 24 outings across 24 locations
 *   Italy       17 outings across 17 locations
 *   New Mexico   1 outing  across  1 location
 *   ───────────────────────────────────────────
 *   TOTAL       63 outings across 54 locations, 4 territories
 *
 * This is DATA only — no positions, colors, or markup. The constellation
 * geometry (cluster centers, the sunflower spray of location dots) is computed
 * in adventure.astro so this file stays a clean, typed inventory.
 *
 * ROUND 5 (2026-07-21, operator-directed NO-COUNT rule): the territory
 * treatment renders NO numbers anywhere — outing counts stay in this file as
 * provenance + sort weights only. The map also now carries COVERAGE places
 * (kind: "coverage") sourced from the site's own published stories, each
 * ⚠ OPERATOR-CONFIRM flagged at its entry. The inventory totals in the note
 * above describe the AA-archive rows only and are historical provenance.
 */

export interface TerritoryLocation {
  /** Place name exactly as it appears in the archive folder tree. */
  name: string;
  /** Number of distinct dated outings that hit this place. */
  outings: number;
  /**
   * Round 5 (2026-07-21) — what kind of work seats this dot:
   *   "aerial"   (default) — the AA archive; its chip links to the licensing
   *              portfolio ("License this work →").
   *   "coverage" — event/story coverage shot at this place; its chip links to
   *              the story that proves it (href/linkLabel below).
   */
  kind?: "aerial" | "coverage";
  /** Coverage chips only: the internal story route that proves this place. */
  href?: string;
  /** Coverage chips only: the chip link label (e.g. "See the coverage"). */
  linkLabel?: string;
}

export interface TerritoryCountry {
  /** Region / country group name (folder "Region" segment). */
  country: string;
  /** Display label — uppercase, for the HUD-mono country node caption. */
  label: string;
  /** Total outings across this group's locations (sum of location.outings). */
  outings: number;
  /** Merged locations, ordered densest-first for a legible spray. */
  locations: readonly TerritoryLocation[];
}

export const TERRITORY: readonly TerritoryCountry[] = [
  {
    country: "Colorado",
    label: "COLORADO",
    outings: 21,
    // 12 places. Boulder (4), Lake County (3) and Boulder County (3) are the
    // repeat-visit anchors; the rest are single outings. Boulder vs. Boulder
    // County and Ouray vs. Ouray County are distinct folders, kept distinct.
    //
    // Round 5 (2026-07-21) — TWO COVERAGE PLACES join the Colorado cluster,
    // sourced from the site's own published coverage (never invented):
    //   · Denver — SeriesFest coverage (/work/seriesfest; the venture dispatch
    //     pages carry the frames). ⚠ OPERATOR-CONFIRM: surfacing Denver as a
    //     territory dot is a new presentation of an existing claim.
    //   · Loveland — the Colorado Medieval Festival feature on /adventure.
    //     ⚠ OPERATOR-CONFIRM: same — existing story, new dot.
    // Their `outings` value is a sort weight only — Round 5 renders NO counts
    // anywhere in the territory treatment (no-count rule: growing bodies of
    // work are never numerized).
    locations: [
      { name: "Denver", outings: 1, kind: "coverage", href: "/work/seriesfest", linkLabel: "See the coverage" },
      { name: "Loveland", outings: 1, kind: "coverage", href: "/adventure#festival", linkLabel: "See the story" },
      { name: "Boulder", outings: 4 },
      { name: "Lake County", outings: 3 },
      { name: "Boulder County", outings: 3 },
      { name: "Ouray County", outings: 2 },
      { name: "Ouray", outings: 2 },
      { name: "Breckenridge", outings: 1 },
      { name: "Summit County", outings: 1 },
      { name: "Vail", outings: 1 },
      { name: "Eagle County", outings: 1 },
      { name: "Clear Creek County", outings: 1 },
      { name: "Jefferson County", outings: 1 },
      { name: "Saguache County", outings: 1 },
    ],
  },
  {
    country: "Switzerland",
    label: "SWITZERLAND",
    outings: 24,
    // 24 places, each a single dated outing — the August 2023 Alps traverse.
    // Zermatt is the only fully-curated (AA_Tier1_Best) outing in the archive,
    // but as an OUTING count it is still one, so it reads "· 1" like the rest.
    locations: [
      { name: "Zermatt", outings: 1 },
      { name: "Glarus Sud", outings: 1 },
      { name: "Innertkirchen", outings: 1 },
      { name: "Ayent", outings: 1 },
      { name: "Icogne", outings: 1 },
      { name: "Lens", outings: 1 },
      { name: "Lausanne", outings: 1 },
      { name: "Bern", outings: 1 },
      { name: "Zurich", outings: 1 },
      { name: "Stallikon", outings: 1 },
      { name: "Meiringen", outings: 1 },
      { name: "Schattenhalb", outings: 1 },
      { name: "Lugano", outings: 1 },
      { name: "Cugy", outings: 1 },
      { name: "Randogne", outings: 1 },
      { name: "Veytaux", outings: 1 },
      { name: "Brienzwiler", outings: 1 },
      { name: "Lake Brienz", outings: 1 },
      { name: "Lake Thun", outings: 1 },
      { name: "Koniz", outings: 1 },
      { name: "Cully", outings: 1 },
      { name: "Ursy", outings: 1 },
      { name: "Montana", outings: 1 },
      { name: "Quinto", outings: 1 },
    ],
  },
  {
    country: "Italy",
    label: "ITALY",
    outings: 17,
    // 17 places, each a single dated outing — Lake Como + the Dolomites/Trentino
    // leg of the same August 2023 trip.
    locations: [
      { name: "Perledo", outings: 1 },
      { name: "Milan", outings: 1 },
      { name: "Bellagio", outings: 1 },
      { name: "Trento", outings: 1 },
      { name: "Pinzolo", outings: 1 },
      { name: "Lido", outings: 1 },
      { name: "Griante", outings: 1 },
      { name: "Nesso", outings: 1 },
      { name: "Como", outings: 1 },
      { name: "Tremezzina", outings: 1 },
      { name: "Bussolengo", outings: 1 },
      { name: "Madruzzo", outings: 1 },
      { name: "Moltrasio", outings: 1 },
      { name: "Blevio", outings: 1 },
      { name: "Carate Urio", outings: 1 },
      { name: "Menaggio", outings: 1 },
      { name: "Varenna", outings: 1 },
    ],
  },
  {
    country: "New Mexico",
    label: "NEW MEXICO",
    outings: 1,
    // A single December 2022 outing — Taos County. Kept honest and separate
    // from Colorado rather than absorbed into it.
    locations: [{ name: "Taos County", outings: 1 }],
  },
  {
    // Round 5 (2026-07-21) — CALIFORNIA joins the map as a COVERAGE territory:
    // the American Film Market coverage in Los Angeles is already published on
    // this site (/venture/afm-2025; the photo index files it under Los Angeles,
    // CA). ⚠ OPERATOR-CONFIRM: new territory dot — the underlying claim is
    // existing site copy, but surfacing California on the map is new.
    // `outings: 1` is a sort weight only; no counts render (no-count rule).
    country: "California",
    label: "CALIFORNIA",
    outings: 1,
    locations: [
      { name: "Los Angeles", outings: 1, kind: "coverage", href: "/venture/afm-2025", linkLabel: "See the coverage" },
    ],
  },
];

/** Convenience totals (kept in sync with the array above). */
export const TERRITORY_TOTALS = {
  territories: TERRITORY.length,
  outings: TERRITORY.reduce((sum, c) => sum + c.outings, 0),
  locations: TERRITORY.reduce((sum, c) => sum + c.locations.length, 0),
} as const;
