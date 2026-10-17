/**
 * src/lib/seo.ts — per-page share images + breadcrumb trail (SEO pass,
 * 2026-10-17). Metadata only: nothing here renders visibly.
 *
 * SHARE IMAGES. Story pages used to share the one brand card (/media/og.jpg).
 * Each entry below points at the page's OWN lead photo — the first content
 * image the page already renders — and reuses that image's existing alt text
 * verbatim (no new descriptive copy). src/pages/og/[...slug].jpg.ts bakes each
 * one to a 1200×630 JPEG at build time (sharp, already a dependency), because
 * social scrapers are inconsistent about WebP/AVIF. Pages not listed here keep
 * /media/og.jpg.
 *
 * Field notes and postcards are derived from their own data (lead photo +
 * its alt) — a new note or postcard gets a card automatically.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getCollection } from "astro:content";
import { POSTCARDS } from "../data/postcards";

export type OgSource = {
  /** site-absolute public path of the source photo (no base prefix) */
  src: string;
  /** alt text, lifted verbatim from where the page already renders the photo */
  alt: string;
};

// Keyed by page path without slashes at either end.
const STORY_LEADS: Record<string, OgSource> = {
  "adventure/steel-and-dust": {
    src: "/media/adventure/festival/cover-charge-1600.webp",
    alt: "Two armored knights charging each other down the jousting lists, crowds along both rails, the Front Range foothills behind",
  },
  "adventure/vybe": {
    src: "/media/adventure/vybe/festival-reveal-800.webp",
    alt: "A blue-hour aerial reveal over the Vybe festival grounds beside a lake, string lights glowing through the cottonwoods",
  },
  "adventure/field": {
    src: "/media/adventure/covers/matterhorn-zermatt-01-800.webp",
    alt: "The Matterhorn above the larch slopes and valley floor at Zermatt",
  },
  "venture/afm-2025": {
    src: "/media/venture/afm-2025/panel-finance-packaging-900.webp",
    alt: "Five panelists seated on the AFM Sessions stage before the American Film Market backdrop, one speaking into a handheld microphone.",
  },
  "venture/amazing-aerial": {
    src: "/media/adventure/covers/twin-lakes-01-800.webp",
    alt: "Twin Lakes, Colorado from the air — a turquoise channel between sandbars, the Sawatch Range behind",
  },
  "venture/dawn-patrol": {
    src: "/media/venture/dawn-patrol/transporter-row-predawn-900.webp",
    alt: "A row of car-haulers and already-parked pre-war classics in a floodlit staging lot before sunrise, orange cones marking the lanes",
  },
  "venture/ko-law-workshops": {
    src: "/media/venture/ko-law-workshops/hero-900.webp",
    alt: "A KO Law startup workshop in session, the room facing the branded screen.",
  },
  "venture/seriesfest": {
    src: "/media/venture/seriesfest/s12-podium-duo-900.webp",
    alt: "Two presenters at a SeriesFest-branded lectern on the Season 12 stage — one speaking into a handheld microphone, the other standing beside him in a red suit — in front of a step-and-repeat wall of repeated SeriesFest marks, a lit projection screen filling the wall behind them.",
  },
  "venture/seriesfest-2025": {
    src: "/media/venture/seriesfest-2025/panel-at-liberty-900.webp",
    alt: "Four people seated on the SeriesFest stage below a pink screen reading “At Liberty, hosted by W. Kamau Bell, ACLU.”",
  },
  "venture/seriesfest-2025-devil-in-disguise": {
    src: "/media/venture/seriesfest-2025-devil-in-disguise/venue-signage-900.webp",
    alt: "The Cable Center's atrium in Denver, a Cable Hall of Fame wall on the left and a tall lit SeriesFest signage tower on the right carrying the Devil in Disguise: John Wayne Gacy event card and its sponsor row.",
  },
  "venture/seriesfest-2026": {
    src: "/media/venture/seriesfest-2026/opening-night-red-carpet-900.webp",
    alt: "Six members of a cast and producing team lined up on the SeriesFest red carpet at Season 12's opening night, the SeriesFest step-and-repeat behind them.",
  },
  "venture/seriesfest-2026-fashion-in-focus": {
    src: "/media/venture/seriesfest-2026-fashion-in-focus/hero-900.webp",
    alt: "The Fashion in Focus title screen at The Cable Center, a blue coat on a mannequin staged beside the podium, the runway audience seated behind.",
  },
  "venture/seriesfest-2026-soul-power": {
    src: "/media/venture/seriesfest-2026-soul-power/red-carpet-aba-lineup-900.webp",
    alt: "Six people lined up on the red carpet at the SeriesFest step-and-repeat outside the Sie FilmCenter, two of them holding red-white-and-blue ABA basketballs, a broadcast camera in the foreground.",
  },
  "work/amazing-aerial": {
    src: "/media/work/amazing-aerial/clips/matterhorn-poster.webp",
    alt: "Aerial of the Matterhorn's pyramid summit above the Zermatt valley",
  },
  "work/gigs-go-green": {
    src: "/media/work/gigs-go-green/hero.webp",
    alt: "Aerial of a large solar array in a green landscape, from the Hero X Solar film.",
  },
  "work/pitchboulder": {
    src: "/media/work/pitchboulder/context-followus-1600.webp",
    alt: "The PitchBoulder room from the back — attendees at long tables, the host on the mic, and the session's “Follow Us!” slide with its QR codes on both projector screens.",
  },
  "work/shelby-pebble-beach": {
    src: "/media/work/shelby-pebble-beach/photos/beauty-front-1600.webp",
    alt: "The restored blue 1967 Shelby Cobra 427, hood raised, on the show lawn at sunrise with the coastline behind",
  },
  "work/vybe": {
    src: "/media/work/vybe/hero.webp",
    alt: "Golden-hour aerial of the 2023 Vybe outdoor festival beside a pond, colorful canopies below.",
  },
};

const PUBLIC = join(process.cwd(), "public");

/** Prefer the largest export of the same frame (…-1600 over …-900), so the
    1200×630 card is downscaled rather than upscaled. Falls back to the path
    as given; returns undefined when even that file is missing. */
function bestSource(src: string): string | undefined {
  const clean = src.split("?")[0]!;
  const m = clean.match(/^(.*)-(\d+)\.(webp|jpe?g|png)$/);
  if (m) {
    for (const w of [2200, 1600, 1400, 1200, 1120]) {
      const candidate = `${m[1]}-${w}.${m[3]}`;
      if (existsSync(join(PUBLIC, candidate))) return candidate;
    }
  }
  return existsSync(join(PUBLIC, clean)) ? clean : undefined;
}

let cache: Promise<Record<string, OgSource>> | undefined;

/** Every page that gets its own share card, keyed by page path (no slashes). */
export function ogSources(): Promise<Record<string, OgSource>> {
  cache ??= (async () => {
    const out: Record<string, OgSource> = {};
    const add = (key: string, s: OgSource) => {
      const src = bestSource(s.src);
      if (src) out[key] = { src, alt: s.alt };
    };
    for (const [key, s] of Object.entries(STORY_LEADS)) add(key, s);

    const notes = await getCollection("fieldNotes", ({ data }) => !data.draft);
    for (const note of notes) {
      const lead = note.data.photos?.[0];
      if (!lead) continue;
      // the unmarked cover master when it exists (what the hero shows), else the gallery frame
      const cover = bestSource(`/media/adventure/covers/${lead.slug}-800.webp`);
      add(`field-notes/${note.id}`, { src: cover ?? `/media/adventure/gallery/${lead.slug}-800.webp`, alt: lead.alt });
    }

    for (const pc of POSTCARDS) {
      const lead = pc.photos[0];
      if (!lead) continue;
      add(`postcards/${pc.slug}`, { src: `/media/adventure/postcards/${pc.slug}/${lead.slug}-700.webp`, alt: lead.alt });
    }
    return out;
  })();
  return cache;
}

/** "/venture/afm-2025/" → "venture/afm-2025" */
export const pageKey = (pagePath: string) => pagePath.replace(/^\/+|\/+$/g, "");

// Section hubs that exist as real pages. Postcards have no index of their own —
// their "← All postcards" link goes to /adventure, so the trail does too.
const SECTIONS: Record<string, { name: string; path: string }> = {
  adventure: { name: "Adventure Stories", path: "/adventure" },
  postcards: { name: "Adventure Stories", path: "/adventure" },
  venture: { name: "Venture Stories", path: "/venture" },
  "field-notes": { name: "Field Notes", path: "/field-notes" },
  work: { name: "Archive", path: "/work" },
};

/** Strip the site-name / section suffixes a <title> carries, leaving the page's own name. */
export const shortTitle = (title: string) =>
  title
    .replace(/\s*\|\s*Adventure Storytelling Media$/, "")
    .replace(/\s+—\s+(Adventure Storytelling Media|a venture story|Field Notes|Postcard)$/, "")
    .trim();

/** Home → Section → Page, for pages one level under a section hub. */
export function breadcrumbTrail(pagePath: string, title: string) {
  const parts = pageKey(pagePath).split("/");
  if (parts.length !== 2) return undefined;
  const section = SECTIONS[parts[0]!];
  if (!section) return undefined;
  return [
    { name: "Home", path: "/" },
    { name: section.name, path: section.path },
    { name: shortTitle(title), path: `/${parts.join("/")}` },
  ];
}
